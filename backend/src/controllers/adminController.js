const User = require('../models/User');
const Admin = require('../models/Admin');
const Payment = require('../models/Payment');
const Report = require('../models/Report');
const Notification = require('../models/Notification');
const jwt = require('jsonwebtoken');

// Admin Login
exports.adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const admin = await Admin.findOne({ email }).select('+password');

    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    admin.lastLogin = new Date();
    await admin.save();

    const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    res.status(200).json({ success: true, token, admin });
  } catch (error) {
    next(error);
  }
};

// Get All Users
exports.getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '', status = '' } = req.query;

    let query = {};
    if (search) {
      query = {
        $or: [
          { firstName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ],
      };
    }

    if (status === 'verified') query.isVerified = true;
    if (status === 'unverified') query.isVerified = false;

    const users = await User.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      users,
      total,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

// Verify User Profile
exports.verifyUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.isVerified = true;
    await user.save();

    // Send notification
    await Notification.create({
      user: user._id,
      type: 'system',
      title: 'Profile Verified',
      description: 'Your profile has been verified by the admin',
    });

    res.status(200).json({ success: true, message: 'User verified successfully' });
  } catch (error) {
    next(error);
  }
};

// Get Reports
exports.getReports = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status = '' } = req.query;

    let query = {};
    if (status) query.status = status;

    const reports = await Report.find(query)
      .populate('reportedBy', 'firstName lastName email')
      .populate('reportedUser', 'firstName lastName email')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Report.countDocuments(query);

    res.status(200).json({
      success: true,
      reports,
      total,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

// Resolve Report
exports.resolveReport = async (req, res, next) => {
  try {
    const { reportId } = req.params;
    const { resolution, action } = req.body;

    let report = await Report.findById(reportId);

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    report.status = 'resolved';
    report.resolution = resolution;
    report.resolvedBy = req.user.id;
    report.resolvedAt = new Date();
    await report.save();

    // If action is to suspend user
    if (action === 'suspend') {
      let user = await User.findById(report.reportedUser);
      user.isVerified = false;
      await user.save();
    }

    res.status(200).json({ success: true, message: 'Report resolved successfully' });
  } catch (error) {
    next(error);
  }
};

// Dashboard Statistics
exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const verifiedUsers = await User.countDocuments({ isVerified: true });
    const premiumUsers = await User.countDocuments({ subscriptionStatus: { $in: ['premium', 'platinum'] } });
    const totalRevenue = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        verifiedUsers,
        premiumUsers,
        totalRevenue: totalRevenue[0]?.total || 0,
      },
    });
  } catch (error) {
    next(error);
  }
};
