const express = require('express');
const profileController = require('../controllers/profileController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/search', protect, profileController.searchProfiles);
router.put('/update', protect, profileController.updateProfile);
router.get('/:userId', protect, profileController.getUserProfile);
router.post('/:profileId/like', protect, profileController.likeProfile);
router.post('/:userId/block', protect, profileController.blockUser);

module.exports = router;
