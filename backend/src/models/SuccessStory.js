const mongoose = require('mongoose');

const successStorySchema = new mongoose.Schema({
  coupleId: {
    type: String,
    required: true,
    unique: true,
  },
  user1Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  user2Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  story: {
    type: String,
    required: true,
  },
  photos: [
    {
      url: String,
      caption: String,
    },
  ],
  meetingDate: Date,
  engagementDate: Date,
  weddingDate: Date,
  location: String,
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  likes: {
    type: Number,
    default: 0,
  },
  comments: [
    {
      userId: mongoose.Schema.Types.ObjectId,
      comment: String,
      createdAt: Date,
    },
  ],
  featured: {
    type: Boolean,
    default: false,
  },
  public: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('SuccessStory', successStorySchema);
