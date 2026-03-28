const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const recommendationController = require('../controllers/recommendationController');

// Generate recommendations
router.post('/generate', authenticate, recommendationController.generateRecommendations);

// Get recommendations
router.get('/', authenticate, recommendationController.getRecommendations);

// Get match statistics
router.get('/stats', authenticate, recommendationController.getMatchStatistics);

// Update recommendation status (view/like/reject)
router.patch('/:recommendationId', authenticate, recommendationController.updateRecommendationStatus);

module.exports = router;
