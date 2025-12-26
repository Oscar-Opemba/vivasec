# VivaSec Deployment Guide

This guide covers deploying VivaSec to production environments including web servers, mobile platforms, and cloud infrastructure.

## Table of Contents

1. [Web Deployment](#web-deployment)
2. [Mobile Deployment](#mobile-deployment)
3. [Docker Deployment](#docker-deployment)
4. [Environment Setup](#environment-setup)
5. [Database Setup](#database-setup)
6. [Security Checklist](#security-checklist)

## Web Deployment

### Prerequisites

- Node.js 22.13.0 or higher
- pnpm 10.4.1 or higher
- MySQL 8.0+ or TiDB database
- SSL/TLS certificate

### Build for Production

```bash
# Install dependencies
pnpm install

# Build the application
pnpm build

# Start production server
pnpm start
```

### Deployment to Popular Platforms

#### Vercel (Recommended for Web)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

#### Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway up
```

#### Render

1. Push code to GitHub
2. Create new Web Service on render.com
3. Connect GitHub repository
4. Set environment variables
5. Deploy

#### DigitalOcean App Platform

1. Connect GitHub repository
2. Create new app
3. Configure environment variables
4. Deploy

### Environment Variables for Production

```bash
NODE_ENV=production
DATABASE_URL=mysql://user:password@db-host:3306/vivasec
JWT_SECRET=your-production-secret-key
VITE_APP_ID=production-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
```

## Mobile Deployment

### Option 1: React Native (Recommended)

#### Setup

```bash
# Install React Native CLI
npm install -g react-native-cli

# Create React Native project from web code
npx react-native init VivaSec

# Install dependencies
npm install
```

#### Build for iOS

```bash
cd ios
pod install
cd ..
npx react-native run-ios
```

#### Build for Android

```bash
# Ensure Android SDK is installed
npx react-native run-android
```

#### Build for Production

**iOS:**
```bash
cd ios
xcodebuild -workspace VivaSec.xcworkspace \
  -scheme VivaSec \
  -configuration Release \
  -derivedDataPath build
```

**Android:**
```bash
cd android
./gradlew assembleRelease
```

### Option 2: Capacitor (Web to Native)

#### Setup

```bash
# Install Capacitor
npm install @capacitor/core @capacitor/cli

# Initialize Capacitor
npx cap init

# Add platforms
npx cap add ios
npx cap add android
```

#### Build

```bash
# Build web
pnpm build

# Sync to native
npx cap sync

# Open in Xcode (iOS)
npx cap open ios

# Open in Android Studio (Android)
npx cap open android
```

### Option 3: Progressive Web App (PWA)

Add to `vite.config.ts`:

```typescript
import { VitePWA } from 'vite-plugin-pwa'

export default {
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'VivaSec',
        short_name: 'VivaSec',
        description: 'Unified Privacy Super-App',
        theme_color: '#1a1a2e',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
}
```

## Docker Deployment

### Dockerfile

```dockerfile
# Build stage
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# Runtime stage
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile --prod
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["pnpm", "start"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      DATABASE_URL: mysql://user:password@db:3306/vivasec
      JWT_SECRET: ${JWT_SECRET}
      VITE_APP_ID: ${VITE_APP_ID}
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}
      MYSQL_DATABASE: vivasec
      MYSQL_USER: ${DB_USER}
      MYSQL_PASSWORD: ${DB_PASSWORD}
    volumes:
      - db_data:/var/lib/mysql
    restart: unless-stopped

volumes:
  db_data:
```

### Build and Run

```bash
# Build Docker image
docker build -t vivasec:latest .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL=mysql://user:password@db:3306/vivasec \
  -e JWT_SECRET=your-secret \
  vivasec:latest

# Or use Docker Compose
docker-compose up -d
```

## Environment Setup

### Production Environment Variables

Create a `.env.production` file:

```bash
NODE_ENV=production
DATABASE_URL=mysql://prod_user:prod_password@prod-db-host:3306/vivasec
JWT_SECRET=your-production-jwt-secret-key
VITE_APP_ID=production-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
BUILT_IN_FORGE_API_KEY=your-production-api-key
VITE_FRONTEND_FORGE_API_KEY=your-production-frontend-key
```

### SSL/TLS Configuration

For production, always use HTTPS:

```bash
# Using Let's Encrypt with Certbot
sudo certbot certonly --standalone -d yourdomain.com

# Configure in your web server (nginx example)
server {
    listen 443 ssl;
    server_name yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    location / {
        proxy_pass http://localhost:3000;
    }
}
```

## Database Setup

### Production Database

```bash
# Connect to production database
mysql -h prod-db-host -u prod_user -p

# Create database
CREATE DATABASE vivasec;

# Run migrations
pnpm db:push
```

### Database Backup

```bash
# Backup database
mysqldump -h prod-db-host -u prod_user -p vivasec > backup.sql

# Restore database
mysql -h prod-db-host -u prod_user -p vivasec < backup.sql
```

### Automated Backups

```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/vivasec"

mkdir -p $BACKUP_DIR

mysqldump -h $DB_HOST -u $DB_USER -p$DB_PASSWORD vivasec > \
  $BACKUP_DIR/vivasec_$DATE.sql

# Keep only last 30 days of backups
find $BACKUP_DIR -name "vivasec_*.sql" -mtime +30 -delete
```

## Security Checklist

- [ ] Use HTTPS/TLS for all connections
- [ ] Set strong JWT_SECRET (min 32 characters)
- [ ] Enable database encryption at rest
- [ ] Configure database access controls
- [ ] Set up firewall rules
- [ ] Enable CORS only for trusted domains
- [ ] Implement rate limiting
- [ ] Set up monitoring and alerting
- [ ] Enable database backups and recovery
- [ ] Use environment variables for secrets
- [ ] Implement API authentication
- [ ] Enable request logging
- [ ] Set up intrusion detection
- [ ] Configure DDoS protection
- [ ] Enable security headers
- [ ] Regular security audits
- [ ] Keep dependencies updated

## Monitoring and Logging

### Application Monitoring

```bash
# Using PM2 for process management
npm install -g pm2

# Start application
pm2 start dist/index.js --name vivasec

# Monitor
pm2 monit

# Logs
pm2 logs vivasec
```

### Database Monitoring

```bash
# Monitor MySQL performance
mysql -h prod-db-host -u prod_user -p

# Check slow queries
SHOW VARIABLES LIKE 'slow_query_log';
SET GLOBAL slow_query_log = 'ON';
```

## Troubleshooting

### Common Issues

**Port Already in Use**
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

**Database Connection Error**
```bash
# Test connection
mysql -h $DB_HOST -u $DB_USER -p$DB_PASSWORD -e "SELECT 1"
```

**Out of Memory**
```bash
# Increase Node.js memory limit
NODE_OPTIONS=--max-old-space-size=4096 pnpm start
```

## Performance Optimization

1. **Enable Compression**
   ```javascript
   import compression from 'compression'
   app.use(compression())
   ```

2. **Implement Caching**
   - Use Redis for session storage
   - Implement HTTP caching headers

3. **Database Optimization**
   - Add indexes to frequently queried columns
   - Use connection pooling

4. **Frontend Optimization**
   - Minify and bundle JavaScript
   - Optimize images
   - Implement code splitting

## Support and Resources

- Documentation: See README.md
- Issues: GitHub Issues
- Discussions: GitHub Discussions
- Email: support@vivasec.app

---

**Last Updated**: December 2025
**Version**: 1.0.0
