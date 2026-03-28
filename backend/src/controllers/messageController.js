const Message = require('../models/Message');
const User = require('../models/User');
const Notification = require('../models/Notification');

// Send Message
exports.sendMessage = async (req, res, next) => {
  try {
    const { receiverId, message } = req.body;

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const newMessage = await Message.create({
      sender: req.user.id,
      receiver: receiverId,
      message,
    });

    // Create notification
    await Notification.create({
      user: receiverId,
      type: 'message',
      title: 'New Message',
      description: `${req.user.firstName} sent you a message`,
      relatedUser: req.user.id,
    });

    res.status(201).json({ success: true, message: newMessage });
  } catch (error) {
    next(error);
  }
};

// Get Conversation
exports.getConversation = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: userId },
        { sender: userId, receiver: req.user.id },
      ],
    })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('sender', 'firstName lastName profilePicture')
      .populate('receiver', 'firstName lastName profilePicture');

    // Mark messages as read
    await Message.updateMany(
      { receiver: req.user.id, sender: userId, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    res.status(200).json({ success: true, messages: messages.reverse() });
  } catch (error) {
    next(error);
  }
};

// Get All Conversations
exports.getAllConversations = async (req, res, next) => {
  try {
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: req.user._id }, { receiver: req.user._id }],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', req.user._id] },
              '$receiver',
              '$sender',
            ],
          },
          lastMessage: { $first: '$message' },
          lastMessageTime: { $first: '$createdAt' },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ['$receiver', req.user._id] }, { $eq: ['$isRead', false] }] },
                1,
                0,
              ],
            },
          },
        },
      },
      { $sort: { lastMessageTime: -1 } },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
    ]);

    res.status(200).json({ success: true, conversations });
  } catch (error) {
    next(error);
  }
};
