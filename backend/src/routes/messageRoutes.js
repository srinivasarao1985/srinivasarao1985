const express = require('express');
const messageController = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/send', protect, messageController.sendMessage);
router.get('/conversations', protect, messageController.getAllConversations);
router.get('/:userId', protect, messageController.getConversation);

module.exports = router;
