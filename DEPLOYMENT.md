# Deployment Guide

## Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Stripe account
- Cloudinary account
- Email provider (Gmail, SendGrid, etc.)

## Backend Deployment

### 1. Prepare for Production
```bash
# Create .env.production
cp .env.example .env.production
```

### 2. Configure Environment Variables
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://prod_user:prod_password@cluster.mongodb.net/matrimonial
JWT_SECRET=your_production_jwt_secret_key_change_this
JWT_EXPIRE=7d
STRIPE_SECRET_KEY=sk_live_your_production_key
FRONTEND_URL=https://yourdomain.com
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
CLOUDINARY_CLOUD_NAME=your_cloud_name
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3. Deploy to Heroku

#### Setup Heroku
```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create new Heroku app
heroku create your-app-name

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=mongodb+srv://...
heroku config:set JWT_SECRET=your_secret
# ... set other variables
```

#### Push to Heroku
```bash
git push heroku main
```

### 4. Deploy to AWS EC2

```bash
# SSH into instance
ssh -i your-key.pem ec2-user@your-instance

# Install Node.js
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Clone repository
git clone your-repo-url
cd navya-consultancy/backend

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with production values

# Install PM2 for process management
sudo npm install -g pm2
pm2 start server.js --name matrimonial

# Setup auto-restart
pm2 startup
pm2 save
```

### 5. Setup Nginx (Reverse Proxy)

```bash
# Install Nginx
sudo yum install -y nginx

# Configure Nginx
sudo nano /etc/nginx/conf.d/matrimonial.conf
```

```nginx
upstream matrimonial_app {
  server localhost:5000;
}

server {
  listen 80;
  server_name yourdomain.com www.yourdomain.com;

  location / {
    proxy_pass http://matrimonial_app;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}
```

```bash
# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 6. SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo yum install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo systemctl enable certbot-renew
```

---

## Frontend Deployment

### 1. Build Production

```bash
cd frontend
npm run build
```

### 2. Deploy to Vercel

#### Setup Vercel
```bash
npm install -g vercel
vercel login
```

#### Deploy
```bash
npm run build
vercel --prod
```

### 3. Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=build
```

### 4. Deploy to AWS S3 + CloudFront

```bash
# Build
npm run build

# Create S3 bucket
aws s3 mb s3://matrimonial-frontend

# Upload files
aws s3 sync build/ s3://matrimonial-frontend --delete

# Create CloudFront distribution (via AWS Console)
```

### 5. Update Environment Variables

Create `.env.production`
```env
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_STRIPE_PUBLIC_KEY=pk_live_production_key
REACT_APP_ENV=production
```

---

## Database Setup

### MongoDB Atlas

1. Create account at mongodb.com/cloud
2. Create cluster
3. Add IP to whitelist
4. Create database user
5. Get connection string
6. Format: `mongodb+srv://user:password@cluster.mongodb.net/database`

### Initialize Database

```bash
# Connect to database
mongo "mongodb+srv://user:password@cluster.mongodb.net/matrimonial"

# Create indexes
db.users.createIndex({ email: 1 }, { unique: true })
db.messages.createIndex({ sender: 1, receiver: 1 })
db.notifications.createIndex({ user: 1, createdAt: -1 })
```

---

## Monitoring & Logging

### Setup PM2 Monitoring
```bash
pm2 web          # Access at http://localhost:9615
pm2 logs matrimonial
pm2 monitoring
```

### CloudWatch (AWS)
```bash
# Install CloudWatch agent
aws cloudwatch put-metric-alarm --alarm-name memory-usage ...
```

### Error Tracking (Sentry)
```bash
npm install @sentry/node

# In server.js
const Sentry = require('@sentry/node');
Sentry.init({ dsn: 'YOUR_SENTRY_DSN' });
```

---

## Performance Optimization

### Backend
- Enable gzip compression
- Use CDN for static assets
- Implement caching strategies
- Optimize database queries with indexes
- Use connection pooling

### Frontend
- Code splitting
- Lazy loading
- Image optimization
- Tree shaking
- Minification

---

## Security Checklist

- [ ] Change all default passwords
- [ ] Disable debug mode
- [ ] Enable HTTPS/SSL
- [ ] Setup rate limiting
- [ ] Enable CORS properly
- [ ] Use environment variables
- [ ] Implement DDoS protection
- [ ] Regular security updates
- [ ] Database backups
- [ ] Log monitoring

---

## Continuous Deployment (CI/CD)

### GitHub Actions

Create `.github/workflows/deploy.yml`

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: npm install
      - name: Run tests
        run: npm test
      - name: Deploy to Heroku
        run: git push heroku main
```

---

## Troubleshooting

### Common Issues

**Database Connection Failed**
```bash
# Check connection string
# Verify IP whitelist
# Ensure MongoDB is running
```

**CORS Errors**
```bash
# Update FRONTEND_URL in backend .env
# Verify CORS configuration in app.js
```

**Payment Issues**
```bash
# Verify Stripe keys
# Check webhook configuration
# Test in Stripe dashboard
```

**Email Not Sending**
```bash
# Enable Less Secure Apps (Gmail)
# Verify SMTP credentials
# Check email provider settings
```

---

## Backup & Recovery

### Database Backup
```bash
# Monthly backup
mongodump --uri="mongodb+srv://..." --archive=backup.archive
```

### Restore
```bash
mongorestore --uri="mongodb+srv://..." --archive=backup.archive
```

---

## Support
For deployment issues, contact: support@matrimonial.com
