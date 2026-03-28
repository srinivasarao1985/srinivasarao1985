const mongoose = require('mongoose');

const profileVerificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  identityVerified: {
    type: Boolean,
    default: false,
  },
  photoVerified: {
    type: Boolean,
    default: false,
  },
  documentVerified: {
    type: Boolean,
    default: false,
  },
  trustScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  verificationBadges: [String],
  documents: [
    {
      type: String,
      url: String,
      uploadedAt: Date,
    },
  ],
  rejectionReason: String,
  verifiedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ProfileVerification', profileVerificationSchema);
