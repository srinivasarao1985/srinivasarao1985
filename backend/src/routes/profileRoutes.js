const express = require('express');
const profileController = require('../controllers/profileController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Static routes (must come first)
router.get('/', profileController.getAllProfiles);
router.get('/search', protect, profileController.searchProfiles);
router.put('/update', protect, profileController.updateProfile);

// Photo routes (specific paths with :photoId)
router.post('/photos/upload', protect, profileController.uploadProfilePhotos);
router.delete('/photos/:photoId', protect, profileController.deletePhoto);
router.put('/photos/set-profile-picture', protect, profileController.setProfilePicture);

// Routes with action suffixes (like /like, /block) - more specific
router.post('/:profileId/like', protect, profileController.likeProfile);
router.post('/:userId/block', protect, profileController.blockUser);

// Generic parameterized route - must come last
router.get('/:userId', protect, profileController.getUserProfile);

module.exports = router;
