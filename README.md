# Navya Consultancy - Matrimonial Website

A full-stack, modern, and scalable matrimonial (matchmaking) platform built with cutting-edge technologies. This platform enables users to create profiles, discover matches, communicate in real-time, and manage premium subscriptions.

## 🚀 Key Features

### User Features
- ✅ **User Authentication**: Secure registration and login with JWT
- ✅ **Profile Management**: Comprehensive profile with photos and preferences
- ✅ **Advanced Search**: Filter profiles by age, location, religion, and more
- ✅ **Real-time Messaging**: Socket.io enabled instant messaging
- ✅ **Like & Match**: Like profiles and get instant match notifications
- ✅ **Premium Subscriptions**: Three-tier pricing with Stripe integration
- ✅ **Notifications**: Real-time alerts for likes, messages, and connections
- ✅ **User Safety**: Report inappropriate profiles

### Admin Features
- ✅ **User Management**: View, verify, and manage all users
- ✅ **Dashboard Analytics**: Track metrics like revenue and user growth
- ✅ **Report Management**: Review and resolve user reports
- ✅ **Site Management**: Control platform settings

### Technical Features
- ✅ **Responsive Design**: Mobile-first design approach
- ✅ **Security**: Password hashing, rate limiting, CORS protection
- ✅ **Scalability**: Modular architecture for easy expansion
- ✅ **Real-time Updates**: Socket.io for live notifications and messaging
- ✅ **Payment Processing**: Stripe integration for secure payments
- ✅ **Cloud Storage**: Cloudinary for image uploads

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time**: Socket.io
- **Payment**: Stripe API
- **Image Storage**: Cloudinary
- **Email**: Nodemailer

### Frontend
- **Framework**: React 18
- **Routing**: React Router v6
- **State Management**: Zustand
- **HTTP Client**: Axios
- **UI Styling**: CSS-in-JS
- **Payment UI**: Stripe React
- **Notifications**: React Toastify
- **Build Tool**: React Scripts

### DevOps
- **Database**: MongoDB Atlas (Cloud)
- **Deployment**: Node.js Server (Production Ready)

## 📁 Project Structure

```
navya-consultancy/
├── backend/                          # Backend server
│   ├── src/
│   │   ├── config/                  # Configuration files (DB, Email, etc)
│   │   ├── controllers/             # Request handlers
│   │   ├── middleware/              # Auth, validation, error handling
│   │   ├── models/                  # MongoDB schemas
│   │   ├── routes/                  # API routes
│   │   ├── services/                # Business logic
│   │   ├── utils/                   # Helper functions
│   │   └── app.js                   # Express app setup
│   ├── server.js                    # Entry point with Socket.io
│   ├── package.json
│   └── .env.example
│
├── frontend/                         # React frontend
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   ├── pages/                   # Page components
│   │   ├── services/                # API calls
│   │   ├── context/                 # State management (Zustand)
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── utils/                   # Helper functions
│   │   ├── styles/                  # Global styles
│   │   ├── App.js                   # Main app component
│   │   └── index.js                 # React entry point
│   ├── public/
│   ├── package.json
│   └── .env.example
│
└── README.md                        # This file
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18 or higher
- **npm** 9 or higher
- **MongoDB** (Local or MongoDB Atlas)
- **Git**

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Configure environment variables:
```env
PORT=5000
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/matrimonial
JWT_SECRET=your_secret_key
STRIPE_SECRET_KEY=your_stripe_key
# ... other variables
```

5. Start development server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory (in a new terminal):
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Configure environment variables:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

5. Start development server:
```bash
npm start
```

Frontend will run on `http://localhost:3000`

## 📚 API Endpoints

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)
- `POST /api/auth/logout` - Logout user

### Profile Endpoints
- `GET /api/profiles/search` - Search profiles (Protected)
- `PUT /api/profiles/update` - Update own profile (Protected)
- `GET /api/profiles/:userId` - Get user profile (Protected)
- `POST /api/profiles/:profileId/like` - Like a profile (Protected)
- `POST /api/profiles/:userId/block` - Block a user (Protected)

### Messaging Endpoints
- `POST /api/messages/send` - Send message (Protected)
- `GET /api/messages/:userId` - Get conversation (Protected)
- `GET /api/messages/conversations` - Get all conversations (Protected)

### Payment Endpoints
- `POST /api/payments/create-intent` - Create Stripe payment intent (Protected)
- `POST /api/payments/confirm` - Confirm payment (Protected)
- `GET /api/payments/history` - Get payment history (Protected)
- `POST /api/payments/:subscriptionId/cancel` - Cancel subscription (Protected)

### Notification Endpoints
- `GET /api/notifications` - Get notifications (Protected)
- `POST /api/notifications/:notificationId/read` - Mark as read (Protected)
- `POST /api/notifications/read-all` - Mark all as read (Protected)
- `DELETE /api/notifications/:notificationId` - Delete notification (Protected)

### Admin Endpoints
- `POST /api/admin/login` - Admin login
- `GET /api/admin/users` - Get all users (Protected)
- `POST /api/admin/users/:userId/verify` - Verify user (Protected)
- `GET /api/admin/reports` - Get reports (Protected)
- `POST /api/admin/reports/:reportId/resolve` - Resolve report (Protected)
- `GET /api/admin/stats` - Get dashboard stats (Protected)

## 🔒 Security Features

- **Password Hashing**: bcryptjs for secure password storage
- **JWT Authentication**: Stateless token-based authentication
- **Input Validation**: Express-validator for request validation
- **CORS Protection**: Configured CORS for cross-origin requests
- **Rate Limiting**: Express rate limit to prevent abuse
- **Helmet.js**: Security headers for Express
- **Password Requirements**: Minimum 6 characters
- **Email Validation**: RFC-compliant email validation

## 💳 Payment Integration

The platform integrates with **Stripe** for secure payment processing:

1. **Subscription Plans**:
   - Free: Lifetime access with limited features
   - Premium: $9.99/month
   - Platinum: $24.99/3 months

2. **Setup Steps**:
   - Get API keys from Stripe dashboard
   - Add `STRIPE_SECRET_KEY` to backend `.env`
   - Add `REACT_APP_STRIPE_PUBLIC_KEY` to frontend `.env`

## 📧 Email Configuration

Uses Nodemailer for sending emails:

1. **Setup Gmail**:
   - Enable 2-Factor Authentication
   - Generate App Password
   - Add credentials to `.env`

2. **Email Templates**: Customizable templates for registration, notifications, etc.

## 🗄️ Database Models

### User Model
- Personal information, profile, preferences
- Authentication credentials
- Subscription status, connections, likes

### Message Model
- Sender and receiver information
- Message content and timestamps
- Read status tracking

### Subscription Model
- Plan details, pricing, duration
- Stripe integration data
- Status and auto-renewal settings

### Payment Model
- Transaction records
- Stripe payment IDs
- Payment status and receipts

### Notification Model
- User notifications for likes, messages, etc.
- Read status and timestamps

### Admin Model
- Admin authentication and permissions
- Activity logging

### Report Model
- User reports for inappropriate profiles
- Status and resolution tracking

## 🔧 Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/matrimonial
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
STRIPE_SECRET_KEY=sk_test_...
FRONTEND_URL=http://localhost:3000
SMTP_USER=your_email@gmail.com
CLOUDINARY_CLOUD_NAME=your_cloud_name
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_...
REACT_APP_ENV=development
```

## 📱 Pages and Components

### User Pages
- **Login/Register**: Authentication pages
- **Dashboard**: Browse and discover profiles
- **Messages**: Real-time messaging interface
- **Profile**: Edit personal information
- **Subscription**: Choose and upgrade plans

### Admin Pages
- **Admin Dashboard**: View statistics and manage users
- **User Management**: Verify profiles, manage accounts
- **Report Management**: Review and resolve reports

## 🧪 Testing

### Run Backend Tests
```bash
cd backend
npm test
```

### Run Frontend Tests
```bash
cd frontend
npm test
```

## 🚢 Deployment

### Backend Deployment (e.g., Heroku)
```bash
git push heroku main
```

### Frontend Deployment (e.g., Vercel)
```bash
npm run build
vercel --prod
```

## 📖 Additional Documentation

- [API Documentation](./backend/API_DOCS.md)
- [Database Schema](./backend/DB_SCHEMA.md)
- [Deployment Guide](./DEPLOYMENT.md)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit pull request

## 📝 License

This project is licensed under the ISC License - see LICENSE file for details.

## 👥 Support

For support, email: support@matrimonial.com

## 🎯 Future Enhancements

- [ ] Video verification for profiles
- [ ] Advanced matching algorithm
- [ ] Mobile app (React Native)
- [ ] AI-based profile recommendations
- [ ] Voice/Video calling
- [ ] Blog and articles section
- [ ]Astrology matching
- [ ] Virtual events and webinars
- [ ] Multi-language support
- [ ] Dark mode

## 📞 Contact

**Navya Consultancy**
- Email: info@navyaconsultancy.com
- Website: www.matrimonial.com

---

**Made with ❤️ by Navya Consultancy**
