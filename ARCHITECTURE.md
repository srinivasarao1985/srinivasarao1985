# System Architecture & Features Documentation

## 📐 System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  React Frontend (Port 3000)                             │   │
│  │  - Single Page Application (SPA)                        │   │
│  │  - Responsive Design (Mobile First)                     │   │
│  │  - Real-time Updates via Socket.io                      │   │
│  └─────────────────────────────────────────────────────────┘   │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                    HTTPS/WebSocket
                               │
┌──────────────────────────────▼──────────────────────────────────┐
│                    Presentation Layer                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  API Gateway / Reverse Proxy (Nginx)                    │   │
│  │  - Request Routing                                      │   │
│  │  - Load Balancing                                       │   │
│  │  - SSL/TLS Termination                                 │   │
│  └─────────────────────────────────────────────────────────┘   │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                          HTTP/WS
                               │
┌──────────────────────────────▼──────────────────────────────────┐
│                   Application Layer                              │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Node.js/Express Backend (Port 5000)                    │   │
│  │  ┌──────────────────────────────────────────────────┐  │   │
│  │  │  API Routes (REST + WebSocket)                 │  │   │
│  │  │  - Authentication Routes                       │  │   │
│  │  │  - Profile Management Routes                   │  │   │
│  │  │  - Messaging Routes                            │  │   │
│  │  │  - Payment Routes                              │  │   │
│  │  │  - Admin Routes                                │  │   │
│  │  └──────────────────────────────────────────────────┘  │   │
│  │                                                         │   │
│  │  ┌──────────────────────────────────────────────────┐  │   │
│  │  │  Business Logic Layer                          │  │   │
│  │  │  - Controllers (Request Handlers)              │  │   │
│  │  │  - Services (Business Logic)                   │  │   │
│  │  │  - Middleware (Auth, Validation, Error)        │  │   │
│  │  └──────────────────────────────────────────────────┘  │   │
│  │                                                         │   │
│  │  ┌──────────────────────────────────────────────────┐  │   │
│  │  │  Data Access Layer                             │  │   │
│  │  │  - Models (Schemas)                            │  │   │
│  │  │  - ORM/ODM (Mongoose)                          │  │   │
│  │  │  - Database Queries                            │  │   │
│  │  └──────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────┘   │
└──────────────────────────────┬──────────────────────────────────┘
                               │
         ┌──────────────────────┼──────────────────────┐
         │                      │                      │
        TCP                    TCP                    REST API
         │                      │                      │
┌────────▼──────┐      ┌───────▼──────┐      ┌───────▼──────┐
│   MongoDB     │      │  Cloudinary  │      │    Stripe    │
│   Database    │      │   (Storage)  │      │  (Payments)  │
└───────────────┘      └──────────────┘      └──────────────┘
```

---

## 🏗️ Component Architecture

### Backend Architecture

```
backend/
├── server.js                          # Entry point
├── src/
│   ├── app.js                         # Express configuration
│   │
│   ├── config/
│   │   ├── db.js                      # Database connection
│   │   ├── email.js                   # Email service
│   │   └── cloudinary.js              # Image upload service
│   │
│   ├── models/                        # Database Models (Mongoose)
│   │   ├── User.js                    # User schema with auth & preferences
│   │   ├── Message.js                 # Messaging schema
│   │   ├── Subscription.js            # Subscription management
│   │   ├── Payment.js                 # Payment records
│   │   ├── Notification.js            # User notifications
│   │   ├── Admin.js                   # Admin users
│   │   └── Report.js                  # User reports
│   │
│   ├── controllers/                   # Request Handlers
│   │   ├── authController.js          # Authentication logic
│   │   ├── profileController.js       # Profile management
│   │   ├── messageController.js       # Messaging logic
│   │   ├── paymentController.js       # Payment handling
│   │   ├── adminController.js         # Admin operations
│   │   └── notificationController.js  # Notifications
│   │
│   ├── routes/                        # API Routes
│   │   ├── authRoutes.js              # /api/auth/*
│   │   ├── profileRoutes.js           # /api/profiles/*
│   │   ├── messageRoutes.js           # /api/messages/*
│   │   ├── paymentRoutes.js           # /api/payments/*
│   │   ├── notificationRoutes.js      # /api/notifications/*
│   │   └── adminRoutes.js             # /api/admin/*
│   │
│   ├── middleware/                    # Custom Middleware
│   │   ├── auth.js                    # JWT authentication
│   │   ├── errorHandler.js            # Error handling
│   │   └── validation.js              # Input validation
│   │
│   ├── services/                      # Business Logic
│   │   └── (future service classes)
│   │
│   └── utils/                         # Utilities
│       └── (helper functions)
│
├── package.json                       # Dependencies
└── .env.example                       # Environment template
```

### Frontend Architecture

```
frontend/
├── src/
│   ├── index.js                       # React entry point
│   ├── App.js                         # Main app component & routing
│   │
│   ├── pages/                         # Page Components
│   │   ├── LoginPage.js               # Authentication
│   │   ├── RegisterPage.js            # User registration
│   │   ├── DashboardPage.js           # Profile discovery
│   │   ├── MessagesPage.js            # Messaging interface
│   │   ├── ProfilePage.js             # Profile editing
│   │   ├── SubscriptionPage.js        # Payment & plans
│   │   └── AdminDashboard.js          # Admin panel
│   │
│   ├── components/                    # Reusable Components
│   │   └── (UI components)
│   │
│   ├── services/                      # API Integration
│   │   ├── api.js                     # Axios instance
│   │   └── index.js                   # API endpoints
│   │
│   ├── context/                       # State Management
│   │   └── authStore.js               # Zustand auth store
│   │
│   ├── hooks/                         # Custom React Hooks
│   │   └── (custom hooks)
│   │
│   ├── utils/                         # Utilities
│   │   └── helpers.js                 # Helper functions
│   │
│   └── styles/                        # CSS Files
│       └── index.css                  # Global styles
│
├── public/
│   └── index.html                     # HTML template
├── package.json                       # Dependencies
└── .env.example                       # Environment template
```

---

## 🔄 Data Flow Diagrams

### Authentication Flow

```
User Input (Email/Password)
    ↓
Frontend: LoginPage
    ↓
POST /api/auth/login
    ↓
Backend: authController.login()
    ├→ Find user by email
    ├→ Verify password (bcrypt)
    ├→ Generate JWT token
    └→ Return token & user data
    ↓
Frontend: Store token in localStorage
    ↓
Set Authorization header for future requests
    ↓
Authenticated API Access
```

### Message Flow

```
User A sends message to User B
    ↓
Frontend: MessagesPage.handleSendMessage()
    ↓
POST /api/messages/send {receiverId, message}
    ↓
Backend: messageController.sendMessage()
    ├→ Create Message record in DB
    ├→ Create Notification for User B
    └→ Emit Socket.io event
    ↓
Socket.io: 'message_received' event to User B
    ↓
User B Frontend: Receive in real-time
    ↓
Display notification & update chat
```

### Payment Flow

```
User selects premium plan
    ↓
Frontend: SubscriptionPage
    ↓
1. POST /api/payments/create-intent
    ↓
Backend: Creates Stripe PaymentIntent
    ↓
2. Frontend: Load Stripe card element
    ↓
User enters card details
    ↓
3. Frontend: confirmCardPayment() with client secret
    ↓
Stripe: Process payment
    ↓
4. POST /api/payments/confirm {paymentIntentId}
    ↓
Backend: 
    ├→ Create Subscription record
    ├→ Create Payment record
    └→ Update user subscription status
    ↓
Frontend: Show success & redirect
```

---

## 🗄️ Database Schema Design

### User Model Relationships

```
User
├── 1:N → Message (as sender)
├── 1:N → Message (as receiver)
├── 1:1 → Subscription
├── 1:N → Payment
├── 1:N → Notification
├── N:M → User (Likes)
├── N:M → User (Connections - Pending)
├── N:M → User (Blocked Users)
└── 1:N → Report (as reported)

Message
├── N:1 → User (sender)
└── N:1 → User (receiver)

Subscription
├── N:1 → User
└── 1:N → Payment

Payment
├── N:1 → User
└── N:1 → Subscription

Notification
└── N:1 → User

Report
├── N:1 → User (reportedBy)
├── N:1 → User (reportedUser)
└── N:1 → Admin (resolvedBy)
```

---

## 🔐 Security Architecture

### Authentication & Authorization

```
Request with Token
    ↓
Express Middleware: protect
    ├→ Extract Bearer token from header
    ├→ Verify JWT signature
    ├→ Validate token expiry
    ├→ Find user by ID
    └→ Attach user to request object
    ↓
Route Handler has access to req.user
    ↓
Check authorization if needed
    ↓
Process request
```

### Password Security

```
User Registration
    ↓
Input password (plain text)
    ↓
API: Generate bcrypt salt (rounds: 10)
    ↓
Hash password with salt
    ↓
Store hashed password in DB
    ↓
Never store plain text password
```

### Data Validation

```
Request received
    ↓
Middleware: validateEmail, validatePassword, etc.
    ↓
Express-validator checks:
├→ Type validation
├→ Format validation
├→ Length validation
└→ Custom validation
    ↓
If validation fails → 400 error
    ↓
If all pass → Continue to controller
```

---

## 📊 Scalability Considerations

### Database Optimization

- **Indexing**: Indexes on frequently queried fields
  ```javascript
  messageSchema.index({ sender: 1, receiver: 1 });
  userSchema.index({ email: 1 }, { unique: true });
  ```

- **Connection Pooling**: MongoDB handles connection pooling
  
- **Data Partitioning**: Users can be sharded by region/date

### Backend Optimization

- **Rate Limiting**: Prevent abuse and DDoS
- **Caching**: Redis for session & frequently accessed data
- **Load Balancing**: Nginx/HAProxy to distribute requests
- **Horizontal Scaling**: Multiple Node.js instances

### Frontend Optimization

- **Code Splitting**: React lazy loading
- **Bundle Optimization**: Tree shaking, minification
- **CDN**: Serve static assets from CDN
- **Lazy Loading**: Images loaded on demand

---

## 🔄 Deployment Architecture

### Development

```
Developer Machine
├── Backend: localhost:5000
├── Frontend: localhost:3000
└── MongoDB: localhost:27017
```

### Production

```
Internet
    ↓
DNS → yourdomain.com
    ↓
Nginx Reverse Proxy (Port 80/443)
    ├→ Load Balancer
    ├→ SSL/TLS Termination
    └→ Request Routing
    ↓
┌─────────────────┐
│ Node.js Instance│ (Port 5000)
└─────────────────┘
    ↓
MongoDB Atlas (Cloud)
    ↓
External Services
├→ Stripe API
├→ Cloudinary
└→ Email Service
```

---

## 📈 Feature Roadmap

### Phase 1 (Current)
- ✅ User authentication
- ✅ Profile management
- ✅ Basic search
- ✅ Messaging
- ✅ Payments
- ✅ Admin panel

### Phase 2 (Future)
- [ ] Advanced matching algorithm
- [ ] Video verification
- [ ] Voice/Video calls
- [ ] Stories feature
- [ ] Compatibility score

### Phase 3 (Advanced)
- [ ] AI recommendations
- [ ] Mobile app (React Native)
- [ ] Virtual events
- [ ] Astrology matching
- [ ] Multi-language support

---

## 🧪 Testing Strategy

### Unit Tests
- Controller functions
- Utility functions
- Service methods

### Integration Tests
- API endpoints
- Database operations
- External API calls

### E2E Tests
- User workflows
- Payment flow
- Real-time messaging

### Performance Tests
- Load testing
- Stress testing
- Benchmark testing

---

## 📝 Code Quality

### Standards
- ESLint configuration for consistent code style
- Prettier for code formatting
- Git hooks for pre-commit checks
- Code reviews before merge

### Monitoring
- Error tracking (Sentry)
- Performance monitoring
- User analytics
- Security scanning

---

## 🔧 Maintenance & Operations

### Regular Tasks
- Database backups (daily)
- Security patches (weekly)
- Performance optimization (monthly)
- Code reviews (continuous)

### Monitoring
- Server uptime
- Response times
- Error rates
- User analytics

---

This architecture provides a scalable, secure, and maintainable matrimonial platform ready for production deployment.
