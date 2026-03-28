const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../models/Payment');
const Subscription = require('../models/Subscription');
const User = require('../models/User');

// Create Payment Intent
exports.createPaymentIntent = async (req, res, next) => {
  try {
    const { amount, plan } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      metadata: {
        userId: req.user.id,
        plan,
      },
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    next(error);
  }
};

// Confirm Payment
exports.confirmPayment = async (req, res, next) => {
  try {
    const { paymentIntentId, plan, duration = 1 } = req.body;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ success: false, message: 'Payment not confirmed' });
    }

    // Create subscription
    const subscription = await Subscription.create({
      user: req.user.id,
      plan,
      price: paymentIntent.amount / 100,
      duration,
      status: 'active',
    });

    // Create payment record
    const payment = await Payment.create({
      user: req.user.id,
      subscription: subscription._id,
      amount: paymentIntent.amount / 100,
      status: 'completed',
      stripePaymentId: paymentIntentId,
    });

    // Update user subscription
    let user = await User.findById(req.user.id);
    user.subscription = subscription._id;
    user.subscriptionStatus = plan;
    user.subscriptionExpire = new Date(Date.now() + duration * 30 * 24 * 60 * 60 * 1000);
    await user.save();

    res.status(201).json({
      success: true,
      subscription,
      message: 'Payment confirmed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Get Payment History
exports.getPaymentHistory = async (req, res, next) => {
  try {
    const payments = await Payment.find({ user: req.user.id })
      .populate('subscription')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, payments });
  } catch (error) {
    next(error);
  }
};

// Cancel Subscription
exports.cancelSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.subscriptionId);

    if (!subscription) {
      return res.status(404).json({ success: false, message: 'Subscription not found' });
    }

    if (subscription.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    subscription.status = 'cancelled';
    subscription.autoRenew = false;
    await subscription.save();

    // Update user status
    let user = await User.findById(req.user.id);
    user.subscriptionStatus = 'free';
    await user.save();

    res.status(200).json({ success: true, message: 'Subscription cancelled' });
  } catch (error) {
    next(error);
  }
};
