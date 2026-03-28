const ProfileVerification = require('../models/ProfileVerification');
const User = require('../models/User');

// Get verification status
exports.getVerificationStatus = async (req, res) => {
  try {
    const verification = await ProfileVerification.findOne({ userId: req.user.id });
    
    if (!verification) {
      return res.status(404).json({ message: 'Verification record not found' });
    }

    res.status(200).json({ success: true, data: verification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update trust score based on verification
const calculateTrustScore = (verification) => {
  let score = 0;
  if (verification.identityVerified) score += 35;
  if (verification.photoVerified) score += 35;
  if (verification.documentVerified) score += 30;
  return score;
};

// Submit verification documents
exports.submitVerification = async (req, res) => {
  try {
    const { documentType, documentUrl } = req.body;

    let verification = await ProfileVerification.findOne({ userId: req.user.id });

    if (!verification) {
      verification = new ProfileVerification({ userId: req.user.id });
    }

    verification.documents.push({
      type: documentType,
      url: documentUrl,
      uploadedAt: new Date(),
    });

    verification.trustScore = calculateTrustScore(verification);
    await verification.save();

    res.status(200).json({ 
      success: true, 
      message: 'Documents submitted for verification',
      data: verification 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Verify profile (Admin)
exports.verifyProfile = async (req, res) => {
  try {
    const { userId, identityVerified, photoVerified, documentVerified, badges } = req.body;

    let verification = await ProfileVerification.findOne({ userId });

    if (!verification) {
      verification = new ProfileVerification({ userId });
    }

    verification.identityVerified = identityVerified;
    verification.photoVerified = photoVerified;
    verification.documentVerified = documentVerified;
    verification.verificationBadges = badges || [];
    verification.trustScore = calculateTrustScore(verification);
    verification.verifiedAt = new Date();

    await verification.save();

    // Update user profile with verified badge
    await User.findByIdAndUpdate(userId, { isVerified: true });

    res.status(200).json({ 
      success: true, 
      message: 'Profile verified successfully',
      data: verification 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get verified profiles for listing
exports.getVerifiedProfiles = async (req, res) => {
  try {
    const verifications = await ProfileVerification.find({ 
      documentVerified: true 
    }).populate('userId', 'firstName lastName profilePicture');

    res.status(200).json({ 
      success: true, 
      count: verifications.length,
      data: verifications 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get trust score
exports.getTrustScore = async (req, res) => {
  try {
    const verification = await ProfileVerification.findOne({ userId: req.user.id });
    
    if (!verification) {
      return res.status(404).json({ message: 'Trust score not found' });
    }

    res.status(200).json({ 
      success: true, 
      trustScore: verification.trustScore,
      badges: verification.verificationBadges
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
