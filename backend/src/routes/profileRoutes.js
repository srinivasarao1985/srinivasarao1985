const express = require('express');
const profileController = require('../controllers/profileController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Get all profiles
router.get('/', profileController.getAllProfiles);

// Search profiles
router.get('/search', protect, profileController.searchProfiles);

// Update profile
router.put('/update', protect, profileController.updateProfile);

// Upload profile photos
router.post('/photos/upload', protect, profileController.uploadProfilePhotos);

// Delete photo
router.delete('/photos/:photoId', protect, profileController.deletePhoto);

// Set profile picture
router.put('/photos/set-profile-picture', protect, profileController.setProfilePicture);

// Get user profile by ID
router.get('/:userId', protect, profileController.getUserProfile);

// Like profile
router.post('/:profileId/like', protect, profileController.likeProfile);

// Block user
router.post('/:userId/block', protect, profileController.blockUser);

module.exports = router;
