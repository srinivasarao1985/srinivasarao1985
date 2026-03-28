const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reportedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reason: {
    type: String,
    enum: ['fake_profile', 'inappropriate_content', 'harassment', 'spam', 'scam', 'other'],
    required: true,
  },
  description: String,
  status: {
    type: String,
    enum: ['submitted', 'under_review', 'resolved', 'dismissed'],
    default: 'submitted',
  },
  resolution: String,
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
  },
  resolvedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
