const SuccessStory = require('../models/SuccessStory');

// Create success story
exports.createSuccessStory = async (req, res) => {
  try {
    const { partnerId, title, story, photos, meetingDate, engagementDate, weddingDate, location } = req.body;

    const successStory = new SuccessStory({
      coupleId: `${req.user.id}-${partnerId}`,
      user1Id: req.user.id,
      user2Id: partnerId,
      title,
      story,
      photos,
      meetingDate,
      engagementDate,
      weddingDate,
      location,
      public: true,
    });

    await successStory.save();

    res.status(201).json({ 
      success: true, 
      message: 'Success story created',
      data: successStory 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all success stories
exports.getAllSuccessStories = async (req, res) => {
  try {
    const stories = await SuccessStory.find({ public: true })
      .populate('user1Id', 'firstName lastName profilePicture')
      .populate('user2Id', 'firstName lastName profilePicture')
      .sort({ createdAt: -1 });

    res.status(200).json({ 
      success: true, 
      count: stories.length,
      data: stories 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get featured success stories
exports.getFeaturedSuccessStories = async (req, res) => {
  try {
    const stories = await SuccessStory.find({ public: true, featured: true })
      .populate('user1Id', 'firstName lastName profilePicture')
      .populate('user2Id', 'firstName lastName profilePicture')
      .limit(6)
      .sort({ likes: -1 });

    res.status(200).json({ 
      success: true, 
      count: stories.length,
      data: stories 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user's success story
exports.getUserSuccessStory = async (req, res) => {
  try {
    const story = await SuccessStory.findOne({ 
      $or: [{ user1Id: req.user.id }, { user2Id: req.user.id }]
    }).populate('user1Id user2Id', 'firstName lastName profilePicture');

    if (!story) {
      return res.status(404).json({ message: 'No success story found' });
    }

    res.status(200).json({ success: true, data: story });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Like success story
exports.likeSuccessStory = async (req, res) => {
  try {
    const { storyId } = req.params;

    const story = await SuccessStory.findByIdAndUpdate(
      storyId,
      { $inc: { likes: 1 } },
      { new: true }
    );

    res.status(200).json({ success: true, data: story });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add comment to success story
exports.addComment = async (req, res) => {
  try {
    const { storyId } = req.params;
    const { comment } = req.body;

    const story = await SuccessStory.findByIdAndUpdate(
      storyId,
      {
        $push: {
          comments: {
            userId: req.user.id,
            comment,
            createdAt: new Date(),
          },
        },
      },
      { new: true }
    );

    res.status(200).json({ success: true, data: story });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Feature story (Admin)
exports.featureStory = async (req, res) => {
  try {
    const { storyId } = req.params;

    const story = await SuccessStory.findByIdAndUpdate(
      storyId,
      { featured: true },
      { new: true }
    );

    res.status(200).json({ success: true, message: 'Story featured', data: story });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
