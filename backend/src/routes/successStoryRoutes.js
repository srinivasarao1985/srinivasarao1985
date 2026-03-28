const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const successStoryController = require('../controllers/successStoryController');

// Get all success stories (public)
router.get('/', successStoryController.getAllSuccessStories);

// Get featured success stories
router.get('/featured', successStoryController.getFeaturedSuccessStories);

// Create success story
router.post('/', authenticate, successStoryController.createSuccessStory);

// Get user's success story
router.get('/my-story', authenticate, successStoryController.getUserSuccessStory);

// Like success story
router.patch('/:storyId/like', successStoryController.likeSuccessStory);

// Add comment to success story
router.post('/:storyId/comments', authenticate, successStoryController.addComment);

// Feature story (Admin)
router.patch('/:storyId/feature', authenticate, successStoryController.featureStory);

module.exports = router;
