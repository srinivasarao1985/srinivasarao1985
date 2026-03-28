const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  recommendedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  matchScore: {
    type: Number,
    min: 0,
    max: 100,
    required: true,
  },
  reason: String,
  matchFactors: {
    ageCompatibility: Number,
    religionMatch: Boolean,
    locationSimilarity: Number,
    interestMatch: Number,
  },
  viewed: {
    type: Boolean,
    default: false,
  },
  liked: {
    type: Boolean,
    default: false,
  },
  rejected: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Recommendation', recommendationSchema);
