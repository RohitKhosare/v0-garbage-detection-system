# CleanCity AI - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Clone & Setup
```bash
# Clone the repository
git clone <your-repo>
cd cleancity-ai

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local

# Edit .env.local with your database URL
DATABASE_URL=your_neon_or_rds_connection_string
JWT_SECRET=$(openssl rand -hex 32)
```

### Step 2: Initialize Database
```bash
# Create database tables
npm run db:init

# Add sample Indian locations
npm run db:seed
```

### Step 3: Run Locally
```bash
# Start development server
npm run dev

# App will be available at http://localhost:3000
```

### Step 4: Test Login
Visit `http://localhost:3000/login`

**Test Credentials:**
- Email: `citizen@cleancity.in`
- Password: `Test@123`

**Available Test Users:**
- Officer: `officer@cleancity.in` / `Test@123`
- Driver: `driver@cleancity.in` / `Test@123`
- Admin: `admin@cleancity.in` / `Test@123`

### Step 5: Explore Features
- 📍 **Live Map**: View real-time garbage locations across India
- 📝 **Report**: Submit new garbage reports with photos
- 📊 **Dashboard**: See municipal reports and statistics
- 🚗 **Vehicles**: Track garbage collection vehicles
- 📹 **CCTV**: Monitor AI detection cameras
- ⚠️ **Alerts**: Receive real-time notifications

## 🗺️ Indian Cities Included

- 🏙️ **Delhi** - New Delhi, DLF Cyber City (28.61°N, 77.21°E)
- 🏙️ **Mumbai** - Bandra, Marine Drive (19.08°N, 72.88°E)
- 🏙️ **Bangalore** - Whitefield, Indiranagar (12.97°N, 77.59°E)
- 🏙️ **Hyderabad** - Hitech City, Banjara Hills (17.37°N, 78.47°E)
- 🏙️ **Pune** - Hinjewadi, Aundh (18.59°N, 73.80°E)

## 🔌 API Endpoints

### Authentication
```bash
# Register
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "name": "Full Name",
  "role": "citizen",
  "phone": "+91-XXXXXXXXXX"
}

# Login
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Map & Locations
```bash
# Get all locations
GET /api/map/locations

# Update vehicle location (real-time)
POST /api/map/locations
{
  "type": "vehicle",
  "vehicleId": "GC-001",
  "latitude": 28.6139,
  "longitude": 77.2090
}
```

### Reports
```bash
# Get all reports
GET /api/reports

# Create new report
POST /api/reports
{
  "title": "Garbage Pile",
  "description": "Large waste accumulation",
  "latitude": 28.6139,
  "longitude": 77.2090,
  "category": "commercial",
  "photos": ["image_url_1"]
}

# Update report status
PUT /api/reports/[id]
{
  "status": "in-progress",
  "assignedTo": "driver-id"
}
```

### Vehicles
```bash
# Get all vehicles
GET /api/vehicles

# Update vehicle status
PUT /api/vehicles/[id]
{
  "status": "in-progress",
  "latitude": 28.6139,
  "longitude": 77.2090
}
```

## 🌐 Deployment

### Deploy to Vercel
```bash
# Login to Vercel
vercel login

# Deploy
vercel deploy --prod

# Add environment variables
vercel env add DATABASE_URL
vercel env add JWT_SECRET
```

### Deploy to AWS (Using AppRunner)
```bash
# Build Docker image
docker build -t cleancity-ai .

# Push to ECR
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.ap-south-1.amazonaws.com
docker tag cleancity-ai:latest <account-id>.dkr.ecr.ap-south-1.amazonaws.com/cleancity-ai:latest
docker push <account-id>.dkr.ecr.ap-south-1.amazonaws.com/cleancity-ai:latest

# Create AppRunner service in AWS Console
# Region: ap-south-1
# Source: ECR image URL
# Port: 3000
```

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Reports Table
```sql
CREATE TABLE reports (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  category VARCHAR(50),
  status VARCHAR(50) DEFAULT 'pending',
  priority VARCHAR(50) DEFAULT 'medium',
  photos TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Vehicles Table
```sql
CREATE TABLE vehicles (
  id UUID PRIMARY KEY,
  driver_id UUID REFERENCES users(id),
  license_number VARCHAR(50) NOT NULL,
  capacity INT,
  status VARCHAR(50) DEFAULT 'idle',
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  current_load INT DEFAULT 0
);
```

## 🐛 Troubleshooting

### Login Issues
- Check DATABASE_URL is correct
- Verify user exists in database
- Check password hash matches
- Clear browser cookies and try again

### Map Not Loading
- Verify API is returning data at `/api/map/locations`
- Check browser console for errors
- Ensure database has locations

### Real-time Updates Not Working
- Check WebSocket connection in browser console
- Verify API is responding
- Check firewall allows port 3000

## 📞 Support

### Common Issues & Solutions

**Issue**: "Database connection failed"
- **Solution**: Check DATABASE_URL, ensure VPC/Security Groups allow connection

**Issue**: "Login returns 401"
- **Solution**: Verify email exists, password is correct

**Issue**: "Map shows no locations"
- **Solution**: Run `npm run db:seed` to add sample data

**Issue**: "Images not uploading"
- **Solution**: Configure AWS S3 credentials in .env

## 🔒 Security Checklist

- [ ] Change JWT_SECRET in production
- [ ] Enable HTTPS/SSL
- [ ] Setup database backups
- [ ] Enable CloudFront CDN
- [ ] Restrict API endpoints with auth
- [ ] Enable rate limiting
- [ ] Setup monitoring/alerts
- [ ] Regular security audits

## 📊 Performance Tips

- Enable database query caching
- Use CloudFront for static assets
- Optimize images before upload
- Enable API response compression
- Monitor database query times
- Setup alerting for slow queries

## 🎯 Next Steps

1. ✅ Setup and run locally
2. ✅ Test all features
3. ✅ Deploy to Vercel/AWS
4. ✅ Add your own Indian locations
5. ✅ Customize branding
6. ✅ Setup email notifications
7. ✅ Configure SMS alerts
8. ✅ Launch to public

## 📚 Additional Resources

- [AWS RDS Documentation](https://docs.aws.amazon.com/rds/)
- [Neon PostgreSQL Docs](https://neon.tech/docs)
- [Vercel Deployment Guide](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## 💬 Questions?

Check the documentation files:
- `README.md` - Project overview
- `AWS_SETUP_GUIDE.md` - AWS configuration
- `API_DOCUMENTATION.md` - API details
- `ARCHITECTURE.md` - System design

---
**Version**: 1.0.0
**Last Updated**: 2024
**Status**: Production Ready ✅
