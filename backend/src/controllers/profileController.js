const User = require('../models/User');

// Update User Profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, phone, religion, caste, location, bio, occupation, education, income, preferences } = req.body;

    let user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Update fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    if (religion) user.religion = religion;
    if (caste) user.caste = caste;
    if (location) user.location = { ...user.location, ...location };
    if (bio) user.bio = bio;
    if (occupation) user.occupation = occupation;
    if (education) user.education = education;
    if (income) user.income = income;
    if (preferences) user.preferences = { ...user.preferences, ...preferences };

    // Mark profile as complete if required fields are filled
    if (firstName && lastName && bio && occupation) {
      user.isProfileComplete = true;
    }

    await user.save();

    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// Get User Profile
exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate('likedProfiles', 'firstName lastName profilePicture')
      .populate('connections.userId', 'firstName lastName profilePicture');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// Search Profiles
exports.searchProfiles = async (req, res, next) => {
  try {
    const { ageMin, ageMax, gender, religion, location, page = 1, limit = 10 } = req.query;

    let query = { _id: { $ne: req.user.id }, isVerified: true, isProfileComplete: true };

    if (gender) query.gender = gender;
    if (religion) query.religion = religion;
    if (location) query['location.city'] = location;

    const users = await User.find(query)
      .select('firstName lastName age gender religion location profilePicture bio occupation')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      users,
      total,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

// Like Profile
exports.likeProfile = async (req, res, next) => {
  try {
    const { profileId } = req.params;

    let user = await User.findById(req.user.id);
    let targetUser = await User.findById(profileId);

    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if already liked
    if (user.likedProfiles.includes(profileId)) {
      return res.status(400).json({ success: false, message: 'Already liked this profile' });
    }

    user.likedProfiles.push(profileId);
    targetUser.likedByProfiles.push(req.user.id);

    await user.save();
    await targetUser.save();

    // Check for mutual like
    const mutualLike = targetUser.likedProfiles.includes(req.user.id);

    res.status(200).json({ success: true, mutualLike, message: 'Profile liked successfully' });
  } catch (error) {
    next(error);
  }
};

// Block User
exports.blockUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    let user = await User.findById(req.user.id);

    if (user.blockedUsers.includes(userId)) {
      return res.status(400).json({ success: false, message: 'User already blocked' });
    }

    user.blockedUsers.push(userId);
    await user.save();

    res.status(200).json({ success: true, message: 'User blocked successfully' });
  } catch (error) {
    next(error);
  }
};
