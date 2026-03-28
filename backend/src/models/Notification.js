const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['like', 'message', 'connection', 'subscription', 'profile_viewed', 'system'],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
  relatedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  readAt: Date,
  link: String,
  icon: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

notificationSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
