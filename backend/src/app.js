const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const messageRoutes = require('./routes/messageRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const verificationRoutes = require('./routes/verificationRoutes');
const successStoryRoutes = require('./routes/successStoryRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const searchRoutes = require('./routes/searchRoutes');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Trust proxy
app.set('trust proxy', 1);

// Security Middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.',
});

app.use(limiter);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// CORS middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// Logger middleware
app.use(morgan('combined'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/verification', verificationRoutes);
app.use('/api/success-stories', successStoryRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/search', searchRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handling middleware
app.use(errorHandler);

module.exports = app;
