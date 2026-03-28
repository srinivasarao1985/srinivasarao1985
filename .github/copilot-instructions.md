# Navya Consultancy - Matrimonial Website

This is a full-stack matrimonial platform built with modern technologies and best practices.

## Project Overview
- **Backend**: Node.js + Express.js
- **Frontend**: React.js with Responsive Design
- **Database**: MongoDB
- **Authentication**: JWT + OAuth
- **Payment Integration**: Stripe
- **Admin**: Dedicated admin dashboard
- **Real-time**: Socket.io for messaging

## Development Setup

### Prerequisites
- Node.js 18+
- npm 9+
- MongoDB
- Git

### Installation

1. Install backend dependencies:
```bash
cd backend
npm install
```

2. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

3. Setup environment variables (see `.env.example` files in each directory)

### Running the Project

#### Development Mode
```bash
# Terminal 1 - Backend (from backend/)
npm run dev

# Terminal 2 - Frontend (from frontend/)
npm start
```

#### Production Build
```bash
# Backend
npm run build

# Frontend
npm run build
```

## Project Structure

```
navya-consultancy/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── app.js
│   ├── .env.example
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── context/
│   │   ├── App.js
│   │   └── index.js
│   ├── .env.example
│   └── package.json
└── README.md
```

## Key Features

### User Features
- ✅ User registration & authentication
- ✅ Complete profile management
- ✅ Advanced search & filtering
- ✅ Real-time chat messaging
- ✅ Profile likes & connections
- ✅ Membership plans
- ✅ Notifications

### Security
- ✅ JWT authentication
- ✅ Password hashing (bcrypt)
- ✅ Rate limiting
- ✅ Input validation
- ✅ CORS protection
- ✅ SQL injection prevention

### Administrator Features
- ✅ User management
- ✅ Verify profiles
- ✅ Payment management
- ✅ Reports & analytics
- ✅ Site settings

## API Documentation
API endpoints are documented in `/backend/API_DOCS.md`

## Contributing
Please follow the code style guide and commit conventions documented in this project.
