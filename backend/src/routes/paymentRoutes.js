const express = require('express');
const paymentController = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/create-intent', protect, paymentController.createPaymentIntent);
router.post('/confirm', protect, paymentController.confirmPayment);
router.get('/history', protect, paymentController.getPaymentHistory);
router.post('/:subscriptionId/cancel', protect, paymentController.cancelSubscription);

module.exports = router;
