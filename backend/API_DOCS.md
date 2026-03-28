# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Auth Endpoints

### Register User
**POST** `/auth/register`

Request body:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "securepass123",
  "phone": "+1234567890",
  "gender": "male",
  "dateOfBirth": "1990-01-01"
}
```

Response (201):
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": { ... }
}
```

### Login User
**POST** `/auth/login`

Request body:
```json
{
  "email": "john@example.com",
  "password": "securepass123"
}
```

Response (200):
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": { ... }
}
```

### Get Current User
**GET** `/auth/me` *Protected*

Response (200):
```json
{
  "success": true,
  "user": { ... }
}
```

---

## Profile Endpoints

### Search Profiles
**GET** `/profiles/search` *Protected*

Query parameters:
- `ageMin`: Minimum age
- `ageMax`: Maximum age
- `gender`: male/female/other
- `religion`: Religion preference
- `location`: City name
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 10)

Response (200):
```json
{
  "success": true,
  "users": [ ... ],
  "total": 50,
  "pages": 5
}
```

### Update Profile
**PUT** `/profiles/update` *Protected*

Request body:
```json
{
  "firstName": "John",
  "bio": "Looking for a caring partner",
  "occupation": "Software Engineer",
  "preferences": {
    "ageRange": { "min": 25, "max": 35 },
    "religionPreference": ["Hindu", "Sikh"]
  }
}
```

Response (200):
```json
{
  "success": true,
  "user": { ... }
}
```

### Get User Profile
**GET** `/profiles/:userId` *Protected*

Response (200):
```json
{
  "success": true,
  "user": { ... }
}
```

### Like Profile
**POST** `/profiles/:profileId/like` *Protected*

Response (200):
```json
{
  "success": true,
  "mutualLike": true/false,
  "message": "Profile liked successfully"
}
```

### Block User
**POST** `/profiles/:userId/block` *Protected*

Response (200):
```json
{
  "success": true,
  "message": "User blocked successfully"
}
```

---

## Messaging Endpoints

### Send Message
**POST** `/messages/send` *Protected*

Request body:
```json
{
  "receiverId": "user_id",
  "message": "Hello, how are you?"
}
```

Response (201):
```json
{
  "success": true,
  "message": { ... }
}
```

### Get Conversation
**GET** `/messages/:userId` *Protected*

Query parameters:
- `page`: Page number (default: 1)
- `limit`: Messages per page (default: 20)

Response (200):
```json
{
  "success": true,
  "messages": [ ... ]
}
```

### Get All Conversations
**GET** `/messages/conversations` *Protected*

Response (200):
```json
{
  "success": true,
  "conversations": [
    {
      "_id": "user_id",
      "lastMessage": "Last message text",
      "lastMessageTime": "2024-01-01T10:00:00Z",
      "unreadCount": 3,
      "user": { ... }
    }
  ]
}
```

---

## Payment Endpoints

### Create Payment Intent
**POST** `/payments/create-intent` *Protected*

Request body:
```json
{
  "amount": 9.99,
  "plan": "premium"
}
```

Response (200):
```json
{
  "success": true,
  "clientSecret": "stripe_client_secret"
}
```

### Confirm Payment
**POST** `/payments/confirm` *Protected*

Request body:
```json
{
  "paymentIntentId": "pi_xxxx",
  "plan": "premium",
  "duration": 1
}
```

Response (201):
```json
{
  "success": true,
  "subscription": { ... },
  "message": "Payment confirmed successfully"
}
```

### Get Payment History
**GET** `/payments/history` *Protected*

Response (200):
```json
{
  "success": true,
  "payments": [ ... ]
}
```

### Cancel Subscription
**POST** `/payments/:subscriptionId/cancel` *Protected*

Response (200):
```json
{
  "success": true,
  "message": "Subscription cancelled"
}
```

---

## Notification Endpoints

### Get Notifications
**GET** `/notifications` *Protected*

Query parameters:
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 10)

Response (200):
```json
{
  "success": true,
  "notifications": [ ... ],
  "unreadCount": 5
}
```

### Mark Notification as Read
**POST** `/notifications/:notificationId/read` *Protected*

Response (200):
```json
{
  "success": true,
  "notification": { ... }
}
```

### Mark All as Read
**POST** `/notifications/read-all` *Protected*

Response (200):
```json
{
  "success": true,
  "message": "All notifications marked as read"
}
```

### Delete Notification
**DELETE** `/notifications/:notificationId` *Protected*

Response (200):
```json
{
  "success": true,
  "message": "Notification deleted"
}
```

---

## Admin Endpoints

### Admin Login
**POST** `/admin/login`

Request body:
```json
{
  "email": "admin@matrimonial.com",
  "password": "admin_password"
}
```

Response (200):
```json
{
  "success": true,
  "token": "jwt_token",
  "admin": { ... }
}
```

### Get All Users
**GET** `/admin/users` *Protected*

Query parameters:
- `page`: Page number
- `limit`: Results per page
- `search`: Search by name/email
- `status`: verified/unverified

Response (200):
```json
{
  "success": true,
  "users": [ ... ],
  "total": 100,
  "pages": 10
}
```

### Verify User Profile
**POST** `/admin/users/:userId/verify` *Protected*

Response (200):
```json
{
  "success": true,
  "message": "User verified successfully"
}
```

### Get Reports
**GET** `/admin/reports` *Protected*

Query parameters:
- `page`: Page number
- `limit`: Results per page
- `status`: submitted/under_review/resolved

Response (200):
```json
{
  "success": true,
  "reports": [ ... ],
  "total": 20,
  "pages": 2
}
```

### Resolve Report
**POST** `/admin/reports/:reportId/resolve` *Protected*

Request body:
```json
{
  "resolution": "User warned",
  "action": "suspend" // optional
}
```

Response (200):
```json
{
  "success": true,
  "message": "Report resolved successfully"
}
```

### Get Dashboard Stats
**GET** `/admin/stats` *Protected*

Response (200):
```json
{
  "success": true,
  "stats": {
    "totalUsers": 500,
    "verifiedUsers": 450,
    "premiumUsers": 150,
    "totalRevenue": 5000
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Invalid input"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Server Error"
}
```

---

## Rate Limiting

- **Window**: 15 minutes
- **Limit**: 100 requests per IP
- **Response**: 429 Too Many Requests
