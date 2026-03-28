const Recommendation = require('../models/Recommendation');
const User = require('../models/User');

// Calculate match score based on compatibility
const calculateMatchScore = (user, otherUser) => {
  let score = 0;

  // Age compatibility (within 5 years)
  const userAge = new Date().getFullYear() - new Date(user.dateOfBirth).getFullYear();
  const otherAge = new Date().getFullYear() - new Date(otherUser.dateOfBirth).getFullYear();
  const ageDiff = Math.abs(userAge - otherAge);
  
  if (ageDiff <= 5) score += 25;
  else if (ageDiff <= 10) score += 15;
  else score += 5;

  // Religion match
  if (user.religion === otherUser.religion) score += 20;
  else score += 5;

  // Location similarity
  if (user.location?.city === otherUser.location?.city) score += 15;
  else if (user.location?.state === otherUser.location?.state) score += 8;
  else score += 3;

  // Gender (assuming heterosexual matching by default)
  if (user.gender !== otherUser.gender) score += 10;

  // Caste match (if applicable)
  if (user.caste && user.caste === otherUser.caste) score += 15;
  else if (user.caste) score += 5;

  // Occupation match (educated professionals)
  if (user.occupation && otherUser.occupation) {
    if ((user.occupation.includes('Engineer') && otherUser.occupation.includes('Professional')) ||
        (user.occupation.includes('Doctor') && otherUser.occupation.includes('Professional'))) {
      score += 7;
    }
  }

  return Math.min(score, 100);
};

// Generate recommendations for user
exports.generateRecommendations = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find potential matches (opposite gender, similar criteria)
    const oppositeGender = user.gender === 'male' ? 'female' : 'male';
    const potentialMatches = await User.find({
      _id: { $ne: req.user.id },
      gender: oppositeGender,
    }).limit(20);

    // Calculate scores and create recommendations
    const recommendations = potentialMatches.map((potentialMatch) => {
      const matchScore = calculateMatchScore(user, potentialMatch);
      return {
        userId: req.user.id,
        recommendedUserId: potentialMatch._id,
        matchScore,
        reason: `Great match based on profile compatibility`,
        matchFactors: {
          ageCompatibility: matchScore * 0.25,
          religionMatch: user.religion === potentialMatch.religion,
          locationSimilarity: matchScore * 0.15,
          interestMatch: matchScore * 0.10,
        },
      };
    }).filter(rec => rec.matchScore >= 40); // Only show matches above 40%

    // Save recommendations
    await Recommendation.deleteMany({ userId: req.user.id }); // Clear old recommendations
    const saved = await Recommendation.insertMany(recommendations);

    res.status(201).json({ 
      success: true, 
      count: saved.length,
      message: `Generated ${saved.length} recommendations`,
      data: saved 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get recommendations for user
exports.getRecommendations = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const recommendations = await Recommendation.find({ userId: req.user.id })
      .populate('recommendedUserId', 'firstName lastName age profilePicture bio location religion occupation')
      .sort({ matchScore: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Recommendation.countDocuments({ userId: req.user.id });

    res.status(200).json({ 
      success: true, 
      total,
      page,
      limit,
      data: recommendations 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mark recommendation as viewed/liked/rejected
exports.updateRecommendationStatus = async (req, res) => {
  try {
    const { recommendationId } = req.params;
    const { action } = req.body; // 'view', 'like', 'reject'

    const update = {};
    if (action === 'view') update.viewed = true;
    if (action === 'like') update.liked = true;
    if (action === 'reject') update.rejected = true;

    const recommendation = await Recommendation.findByIdAndUpdate(
      recommendationId,
      update,
      { new: true }
    ).populate('recommendedUserId', 'firstName lastName profilePicture');

    res.status(200).json({ success: true, data: recommendation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get match statistics
exports.getMatchStatistics = async (req, res) => {
  try {
    const recommendations = await Recommendation.find({ userId: req.user.id });

    const stats = {
      totalRecommendations: recommendations.length,
      viewed: recommendations.filter(r => r.viewed).length,
      liked: recommendations.filter(r => r.liked).length,
      rejected: recommendations.filter(r => r.rejected).length,
      averageMatchScore: recommendations.length > 0 
        ? (recommendations.reduce((sum, r) => sum + r.matchScore, 0) / recommendations.length).toFixed(1)
        : 0,
      topMatches: recommendations.sort((a, b) => b.matchScore - a.matchScore).slice(0, 5),
    };

    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
