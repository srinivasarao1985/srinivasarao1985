const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const verificationController = require('../controllers/verificationController');

// Get verification status
router.get('/status', authenticate, verificationController.getVerificationStatus);

// Get trust score
router.get('/trust-score', authenticate, verificationController.getTrustScore);

// Submit verification documents
router.post('/submit', authenticate, verificationController.submitVerification);

// Get verified profiles (public)
router.get('/verified-profiles', verificationController.getVerifiedProfiles);

// Verify profile (Admin only)
router.post('/verify', authenticate, verificationController.verifyProfile);

module.exports = router;
