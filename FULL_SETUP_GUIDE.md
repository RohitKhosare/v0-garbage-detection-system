# CleanCity AI - Complete Setup Guide

## Overview
This guide covers everything needed to run CleanCity AI fully and properly. Follow each step sequentially.

---

## PART 1: Local Development Setup (First Time)

### Step 1: Install Node.js
- Download from: https://nodejs.org (LTS version recommended)
- Verify installation:
  ```bash
  node --version
  npm --version
  ```

### Step 2: Clone/Access Project
```bash
cd /vercel/share/v0-project
```

### Step 3: Install Dependencies
```bash
npm install
```
This installs all packages listed in package.json:
- Next.js 14.2.35 (React framework)
- @neondatabase/serverless (PostgreSQL)
- Radix UI components (UI library)
- TailwindCSS (styling)
- Form handling, charts, and utilities

### Step 4: Create Environment File
Create `.env.local` file in project root:
```bash
touch .env.local
```

---

## PART 2: Database Setup (Required)

### Option A: Using Neon PostgreSQL (RECOMMENDED)

#### Step 1: Create Neon Account
1. Go to https://console.neon.tech
2. Sign up for free
3. Create a new project
4. Select region: `ap-south-1` (Mumbai - for India)

#### Step 2: Get Connection String
1. In Neon console, go to "Connection String"
2. Copy the PostgreSQL URL
3. Format: `postgresql://user:password@host/dbname`

#### Step 3: Add to Environment
Add to `.env.local`:
```
DATABASE_URL=postgresql://user:password@host/dbname
JWT_SECRET=your-secret-key-12345
NODE_ENV=development
```

#### Step 4: Initialize Database Schema
Run the schema creation script:
```bash
# Get the connection string from your .env.local
# Then run the SQL script in Neon console or via:
psql postgresql://user:password@host/dbname < scripts/init-db.sql
```

OR use Neon SQL editor:
1. Go to Neon console → SQL Editor
2. Copy content from `scripts/init-db.sql`
3. Paste and execute

#### Step 5: Add Mobile Camera Tables
```bash
psql postgresql://user:password@host/dbname < scripts/add-mobile-camera-schema.sql
```

### Option B: Using AWS RDS PostgreSQL

#### Step 1: Create RDS Instance
1. AWS Console → RDS
2. Create Database → PostgreSQL
3. DB instance identifier: `cleancity-ai`
4. Master username: `postgres`
5. Master password: (save securely)
6. Instance class: `db.t3.micro` (free tier eligible)
7. Storage: 20 GB
8. Region: `ap-south-1` (Mumbai)

#### Step 2: Get Connection Details
After instance created:
- Endpoint: (RDS Dashboard)
- Port: 5432
- Database: postgres

#### Step 3: Connect and Run Schema
```bash
psql -h endpoint.rds.amazonaws.com -U postgres -d postgres -f scripts/init-db.sql
psql -h endpoint.rds.amazonaws.com -U postgres -d postgres -f scripts/add-mobile-camera-schema.sql
```

#### Step 4: Add to Environment
```
DATABASE_URL=postgresql://postgres:password@endpoint.rds.amazonaws.com:5432/postgres
JWT_SECRET=your-secret-key-12345
NODE_ENV=development
```

---

## PART 3: AWS Integration (Optional but Recommended)

### For Image Storage with S3:

#### Step 1: Create AWS IAM User
1. AWS Console → IAM → Users
2. Create user: `cleancity-ai-user`
3. Attach policy: `AmazonS3FullAccess`
4. Generate Access Keys
5. Save:
   - AWS_ACCESS_KEY_ID
   - AWS_SECRET_ACCESS_KEY

#### Step 2: Create S3 Bucket
1. AWS Console → S3
2. Create bucket: `cleancity-ai-images`
3. Region: `ap-south-1`
4. Block public access: NO (for public image URLs)

#### Step 3: Add to Environment
```
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=ap-south-1
AWS_S3_BUCKET=cleancity-ai-images
```

---

## PART 4: Local Development Testing

### Step 1: Start Development Server
```bash
npm run dev
```

Expected output:
```
> next dev
  ▲ Next.js 14.2.35
  - Local:        http://localhost:3000
  ✓ Ready in 2.5s
```

### Step 2: Test Login Page
1. Open: http://localhost:3000
2. Click "Login"
3. Use test credentials:
   - Email: `citizen@cleancity.in`
   - Password: `Test@123`

### Step 3: Test Each Feature
- Home page (http://localhost:3000)
- Login (http://localhost:3000/login)
- Register (http://localhost:3000/register)
- Report garbage (http://localhost:3000/report)
- Live map (http://localhost:3000/map)
- Municipal dashboard (http://localhost:3000/municipal)
- Vehicle dashboard (http://localhost:3000/vehicles)
- CCTV monitoring (http://localhost:3000/cctv)
- Mobile camera (http://localhost:3000/mobile-camera)
- Alerts (http://localhost:3000/alerts)

### Step 4: Check API Endpoints
Test API calls:
```bash
# Register new user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test@123","name":"Test User","role":"citizen"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test@123"}'

# Get live map locations
curl http://localhost:3000/api/map/locations

# Get mobile cameras
curl http://localhost:3000/api/mobile-camera/devices
```

---

## PART 5: Mobile Camera Setup

### Step 1: Register Mobile Device
1. Go to http://localhost:3000/mobile-camera
2. Enter device name: "My Mobile Camera"
3. Click "Register Device"
4. Save device ID shown

### Step 2: Upload Garbage Detection
Method 1: Using Web Interface
1. On mobile-camera page
2. Click "Take Photo" or "Upload Image"
3. Enable "Share Location"
4. Click "Upload Detection"

Method 2: Using API (Advanced)
```bash
curl -X POST http://localhost:3000/api/mobile-camera/upload \
  -H "Content-Type: application/json" \
  -d '{
    "device_id":"device-123",
    "latitude":28.6328,
    "longitude":77.2197,
    "image_url":"https://...",
    "detection_type":"garbage_pile",
    "confidence":0.95
  }'
```

Method 3: Using Mobile App
See: MOBILE_SETUP.md for React Native/Flutter integration

---

## PART 6: Deployment to Vercel

### Step 1: Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub
3. Connect your GitHub repository

### Step 2: Configure Environment Variables
In Vercel Dashboard:
1. Settings → Environment Variables
2. Add:
   ```
   DATABASE_URL = your_neon_postgresql_url
   JWT_SECRET = your_secret_key
   AWS_ACCESS_KEY_ID = (if using S3)
   AWS_SECRET_ACCESS_KEY = (if using S3)
   AWS_REGION = ap-south-1
   AWS_S3_BUCKET = (if using S3)
   NODE_ENV = production
   ```

### Step 3: Deploy
Method 1: Automatic (Recommended)
1. Push code to GitHub
2. Vercel auto-deploys on push

Method 2: Manual
```bash
npm install -g vercel
vercel --prod
```

### Step 4: Verify Deployment
1. Visit your Vercel URL
2. Test login with credentials
3. Verify database connection
4. Test file uploads

---

## PART 7: Production Checklist

### Database
- [ ] Database created (Neon or RDS)
- [ ] Schema initialized (init-db.sql)
- [ ] Mobile camera schema added
- [ ] DATABASE_URL in production env vars
- [ ] Backups enabled
- [ ] SSL/TLS enabled

### Security
- [ ] JWT_SECRET set to secure random string
- [ ] Passwords hashed (PBKDF2)
- [ ] HTTPS enforced
- [ ] CORS configured
- [ ] Rate limiting enabled
- [ ] SQL injection prevention active

### AWS (If Using)
- [ ] IAM user created
- [ ] S3 bucket created
- [ ] Access keys secured
- [ ] Bucket policy configured
- [ ] CloudFront CDN enabled (optional)
- [ ] S3 encryption enabled

### Monitoring
- [ ] Error tracking enabled (Sentry - optional)
- [ ] Analytics enabled (Vercel Analytics)
- [ ] Database monitoring enabled
- [ ] Uptime monitoring setup
- [ ] Log aggregation configured

---

## PART 8: Troubleshooting

### Database Connection Error
```
Error: "Connection terminated unexpectedly"
```
Fix:
1. Check DATABASE_URL in .env.local
2. Verify Neon/RDS is running
3. Test connection: `psql connection_string`
4. Check firewall rules

### Login Not Working
```
Error: "Invalid credentials"
```
Fix:
1. Verify user exists in database:
   ```sql
   SELECT * FROM users WHERE email='test@example.com';
   ```
2. Check password hash matches
3. Look at API logs

### Images Not Uploading
```
Error: "Failed to upload image"
```
Fix:
1. Check AWS credentials
2. Verify S3 bucket exists
3. Check bucket permissions
4. Verify file size < 10MB

### Mobile Camera Not Working
```
Error: "Device not found"
```
Fix:
1. Check device registered: `GET /api/mobile-camera/devices`
2. Use correct device_id
3. Verify GPS enabled
4. Check mobile-camera schema created

### Map Not Showing
```
Error: "Failed to fetch locations"
```
Fix:
1. Verify API endpoint working: `GET /api/map/locations`
2. Check database has data
3. Verify coordinates are valid
4. Check browser console for errors

---

## PART 9: Performance Optimization

### Enable Caching
1. Add Redis (Upstash - optional):
   ```
   REDIS_URL=https://...
   ```

2. Implement caching in API routes:
   ```typescript
   // Cache responses for 5 minutes
   response.headers.set('Cache-Control', 'public, max-age=300')
   ```

### Database Optimization
1. Add indexes:
   ```sql
   CREATE INDEX idx_reports_location ON reports(latitude, longitude);
   CREATE INDEX idx_mobile_sessions_device ON mobile_sessions(device_id);
   ```

2. Enable query optimization

### Frontend Optimization
1. Image lazy loading: Enabled ✓
2. Code splitting: Automatic ✓
3. CSS minification: Automatic ✓
4. JavaScript minification: Automatic ✓

---

## PART 10: Scaling to Production

### Traffic Scaling
- Vercel: Auto-scales (up to $40/month for hobby)
- For production: Use Pro plan or Enterprise

### Database Scaling
- Neon: Free tier up to 3GB, then paid
- RDS: Upgrade instance size as needed
- Consider read replicas for high traffic

### Storage Scaling
- S3: Pay-per-use, very cheap
- CloudFront CDN: Recommended for images
- Auto-delete old images: Implement cleanup job

### Monitoring at Scale
1. Set up alerts:
   - Database CPU > 80%
   - Error rate > 1%
   - Response time > 1s

2. Enable detailed logging
3. Set up database replication

---

## PART 11: Daily Operations

### Regular Maintenance
```bash
# Run weekly
npm run build  # Test build

# Run monthly
# Database backup
# Log cleanup
# Cache cleanup
```

### Monitoring Commands
```bash
# Check Vercel deployment
vercel status

# Check database connections
psql -c "SELECT count(*) FROM pg_stat_activity;"

# View recent errors
# Check Vercel logs dashboard
```

### Backup Strategy
- Automatic: Neon provides 7-day backups
- Manual: Export database weekly
- Archive: Store 3 months of backups

---

## Summary: Quick Reference

### URLs
- Development: http://localhost:3000
- Production: https://your-domain.vercel.app
- Neon Console: https://console.neon.tech
- AWS Console: https://console.aws.amazon.com
- Vercel Dashboard: https://vercel.com/dashboard

### Test Credentials
```
citizen@cleancity.in / Test@123
officer@cleancity.in / Test@123
driver@cleancity.in / Test@123
admin@cleancity.in / Test@123
```

### Key Files
- Configuration: `.env.local`
- Database: `scripts/init-db.sql`, `scripts/add-mobile-camera-schema.sql`
- API: `app/api/**`
- Frontend: `app/**/page.tsx`
- Components: `components/**`

### Key Commands
```bash
npm install          # Install dependencies
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Check code quality
```

---

## Need Help?

### Documentation Files
- `START_HERE.md` - Quick overview
- `API_DOCUMENTATION.md` - All API endpoints
- `MOBILE_CAMERA_INTEGRATION.md` - Mobile setup
- `AWS_SETUP_GUIDE.md` - AWS configuration
- `TEST_GUIDE.md` - Testing procedures

### Support
- Check error logs in browser console
- Review Vercel deployment logs
- Test API endpoints with cURL/Postman
- Enable debug mode: `NODE_ENV=development`

Good luck! 🚀
