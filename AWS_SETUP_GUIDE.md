# AWS Setup Guide - CleanCity AI (Indian Server)

## Your AWS Account Details
- **Account Name:** Rohit1918
- **Account ID:** 159178775890
- **Region:** us-east-1 (Change to ap-south-1 for India)
- **Service:** Neon PostgreSQL Database

## Prerequisites
- AWS Account with appropriate permissions
- Vercel CLI installed
- Git installed
- Node.js 18+ installed

## Step 1: Setup AWS RDS PostgreSQL in India (Mumbai)

### Create RDS Instance
1. Go to AWS Console → RDS → Create Database
2. Configuration:
   - Engine: PostgreSQL 15+
   - Instance class: db.t3.micro (free tier eligible)
   - Storage: 20GB
   - Region: **ap-south-1 (Mumbai)**
   - Publicly accessible: Yes
   - VPC: Default VPC

3. Security Group Settings:
   - Inbound Rule: PostgreSQL (5432) from 0.0.0.0/0
   - Outbound Rule: Allow all

4. Database Configuration:
   - DB Name: cleancity_db
   - Master username: admin
   - Master password: [Generate strong password]

5. Copy the RDS Endpoint when created:
   ```
   cleancity-db.xxxxx.ap-south-1.rds.amazonaws.com:5432
   ```

## Step 2: Setup Neon PostgreSQL (Alternative - Recommended)

Neon provides better performance for Vercel integration.

1. Visit: https://console.neon.tech
2. Create new project:
   - Name: CleanCity-India
   - Region: ap-south-1 (Mumbai)
   
3. Copy connection string:
   ```
   postgresql://user:password@host/database?sslmode=require
   ```

## Step 3: Initialize Database Schema

```bash
# Install dependencies
npm install -D ts-node @types/node

# Run migration
npx ts-node scripts/init-db.sql

# Or use psql directly
psql postgresql://user:password@host:5432/cleancity_db < scripts/init-db.sql
```

## Step 4: Connect Vercel to Your Neon/RDS Database

### Using Neon:
1. In Vercel Dashboard → Project Settings → Environment Variables
2. Add:
   ```
   DATABASE_URL=postgresql://user:password@host/database?sslmode=require
   ```

### Using RDS:
1. In Vercel Dashboard → Project Settings → Environment Variables
2. Add:
   ```
   DATABASE_URL=postgresql://admin:password@cleancity-db.xxxxx.ap-south-1.rds.amazonaws.com:5432/cleancity_db
   ```

## Step 5: Setup Environment Variables

Create `.env.local`:
```bash
DATABASE_URL=your_database_url
JWT_SECRET=your-secret-key-generate-with-openssl-rand-hex-32
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://yourdomain.vercel.app
```

Generate JWT_SECRET:
```bash
openssl rand -hex 32
```

## Step 6: Setup AWS S3 for Image Storage (Optional)

1. AWS Console → S3 → Create bucket:
   - Name: cleancity-images-india
   - Region: ap-south-1
   - Block public access: Off

2. Create IAM User:
   - Go to IAM → Users → Create user
   - Attach policy: AmazonS3FullAccess
   - Generate Access Key ID and Secret Access Key

3. Add to environment variables:
   ```bash
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   AWS_BUCKET_NAME=cleancity-images-india
   AWS_REGION=ap-south-1
   ```

## Step 7: Setup AWS CloudFront CDN (Optional)

For faster image delivery across India:

1. CloudFront → Create distribution
2. Origin domain: your-s3-bucket.s3.ap-south-1.amazonaws.com
3. Default cache behavior: Allow all HTTP methods

## Step 8: Deploy to Vercel

```bash
# Login to Vercel
vercel login

# Deploy project
vercel deploy --prod

# Or connect GitHub for automatic deployments
# Push to GitHub → Vercel automatically deploys
```

## Step 9: Test the Application

### Test Login:
1. First, create a test user via API:
```bash
curl -X POST https://yourdomain.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@cleancity.in",
    "password": "Test@123",
    "name": "Test User",
    "role": "citizen",
    "phone": "+91-9999999999"
  }'
```

2. Then login:
```bash
curl -X POST https://yourdomain.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@cleancity.in",
    "password": "Test@123"
  }'
```

### Test Live Map API:
```bash
curl https://yourdomain.vercel.app/api/map/locations
```

## Step 10: Add Indian Locations

Insert sample Indian garbage locations:
```sql
INSERT INTO reports (id, user_id, title, description, latitude, longitude, category, status, priority) 
VALUES 
  ('report-001', 'user-001', 'Delhi - DLF Cyber City', 'Garbage accumulation in commercial area', 28.4595, 77.1188, 'commercial', 'active', 'high'),
  ('report-002', 'user-001', 'Mumbai - Bandra', 'Dumped waste near residential', 19.0596, 72.8295, 'residential', 'active', 'high'),
  ('report-003', 'user-001', 'Bangalore - Whitefield', 'IT Park area cleanup needed', 12.9698, 77.6499, 'commercial', 'pending', 'medium'),
  ('report-004', 'user-001', 'Hyderabad - Hitech City', 'Street cleanup required', 17.3850, 78.4867, 'street', 'active', 'high');
```

## Monitoring & Maintenance

### CloudWatch Monitoring:
1. AWS Console → CloudWatch → Dashboards
2. Monitor:
   - RDS CPU utilization
   - Database connections
   - Query performance

### Vercel Analytics:
1. Vercel Dashboard → Analytics
2. Monitor:
   - Response times
   - Error rates
   - Traffic patterns

### Database Backups:
- RDS: Automatic daily backups (7-day retention)
- Manual snapshot every week via AWS console

## Scaling for Indian Market

### High Traffic Handling:
1. Enable RDS Read Replicas in Mumbai
2. Setup CloudFront cache for static assets
3. Enable Vercel Edge Caching

### Multi-Region Deployment:
```bash
# Create separate Vercel projects for different regions
vercel env add DATABASE_URL (for different regions)
vercel env add AWS_REGION ap-south-1
```

## Troubleshooting

### Database Connection Issues:
```bash
# Test connection
psql -h your-host -U admin -d cleancity_db

# Check security groups in AWS
# Ensure port 5432 is open
```

### Login Not Working:
1. Check DATABASE_URL is correct
2. Verify JWT_SECRET is set
3. Check browser console for errors

### Map Not Loading:
1. Verify /api/map/locations endpoint
2. Check database has sample locations
3. Verify browser allows geolocation

## Support & Documentation

- AWS Support: https://console.aws.amazon.com/support
- Vercel Docs: https://vercel.com/docs
- Neon Docs: https://neon.tech/docs
- PostgreSQL Docs: https://www.postgresql.org/docs/15/

## Next Steps

1. Deploy to Vercel
2. Test all APIs
3. Setup monitoring
4. Configure custom domain
5. Enable HTTPS
6. Setup automated backups
7. Configure CloudFront
8. Deploy mobile app

---
**Last Updated:** 2024
**Status:** Production Ready
