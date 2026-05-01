# CleanCity AI - Quick Reference

## 🚀 30-Second Startup

```bash
# 1. Install dependencies
npm install

# 2. Create .env.local file with:
DATABASE_URL=your_neon_postgresql_url
JWT_SECRET=your-secret-key-12345

# 3. Run database schema
psql $DATABASE_URL < scripts/init-db.sql

# 4. Start development server
npm run dev

# 5. Open browser
# http://localhost:3000
```

---

## 📋 What You Need (Checklist)

### Must Have
- [ ] Node.js installed (v18+)
- [ ] PostgreSQL database (Neon or AWS RDS)
- [ ] GitHub account (for Vercel)
- [ ] Environment variables configured

### Nice to Have
- [ ] AWS account (for S3 image storage)
- [ ] Mobile device (for testing camera)
- [ ] Postman/cURL (for API testing)

---

## 🗄️ Database Setup (Choose One)

### Option 1: Neon (Easiest - RECOMMENDED)
```
1. Go to console.neon.tech
2. Create project (free tier)
3. Copy connection string
4. Add to .env.local as DATABASE_URL
5. Run: psql $DATABASE_URL < scripts/init-db.sql
```

### Option 2: AWS RDS
```
1. AWS Console → RDS
2. Create PostgreSQL instance
3. Get endpoint from RDS dashboard
4. Format: postgresql://user:password@endpoint:5432/postgres
5. Add to .env.local
6. Run initialization script
```

---

## 🔑 Environment Variables

Create `.env.local`:
```
# Required
DATABASE_URL=postgresql://user:password@host/dbname
JWT_SECRET=your-secure-random-string

# Optional but recommended
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=ap-south-1
AWS_S3_BUCKET=your-bucket-name

# For production
NODE_ENV=production
```

---

## 📱 Test Credentials (Built-in for Testing)

```
Citizen:  citizen@cleancity.in / Test@123
Officer:  officer@cleancity.in / Test@123
Driver:   driver@cleancity.in / Test@123
Admin:    admin@cleancity.in / Test@123
```

---

## 🌐 Website Pages

| Page | URL | Purpose |
|------|-----|---------|
| Home | `/` | Landing page |
| Login | `/login` | User authentication |
| Register | `/register` | Create account |
| Report | `/report` | Submit garbage report |
| Map | `/map` | Live interactive map |
| Municipal Dashboard | `/municipal` | Officer view |
| Vehicle Dashboard | `/vehicles` | Driver view |
| CCTV | `/cctv` | Camera monitoring |
| Mobile Camera | `/mobile-camera` | Mobile uploads |
| Alerts | `/alerts` | Notifications |

---

## 🔌 API Endpoints (Main)

```
POST   /api/auth/register          - Create user
POST   /api/auth/login             - User login
GET    /api/map/locations          - Get all locations
POST   /api/reports                - Create report
GET    /api/mobile-camera/devices  - List mobile cameras
POST   /api/mobile-camera/upload   - Upload image
GET    /api/cctv                   - List cameras
```

---

## 🏗️ Project Structure

```
cleancity-ai/
├── app/                    # Next.js pages
│   ├── page.tsx           # Home page
│   ├── login/             # Login page
│   ├── map/               # Live map
│   ├── cctv/              # CCTV monitoring
│   ├── mobile-camera/     # Mobile uploads
│   └── api/               # API routes
├── components/            # React components
├── lib/                   # Utilities
│   ├── db.ts             # Database connection
│   └── auth-utils.ts     # Authentication
├── public/               # Static files (images)
├── scripts/              # Database schemas
└── .env.local            # Environment variables
```

---

## 💻 Development Commands

```bash
npm install              # Install dependencies
npm run dev              # Start dev server (http://localhost:3000)
npm run build            # Create production build
npm run start            # Start production server
npm run lint             # Check code quality
```

---

## 🐛 Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| "Connection refused" | Database not running | Start Neon/RDS instance |
| "Invalid credentials" | Wrong password | Use test credentials |
| "Database not found" | Schema not initialized | Run init-db.sql |
| "Port 3000 in use" | Another app using port | `npm run dev -- -p 3001` |
| "Module not found" | Dependencies not installed | `npm install` |

---

## 📤 Deployment to Vercel

```bash
# 1. Create Vercel account at vercel.com
# 2. Connect GitHub repo
# 3. Add environment variables in Vercel dashboard
# 4. Deploy (automatic on git push or manual: vercel --prod)
# 5. Visit your-project.vercel.app
```

---

## 📱 Mobile Camera Setup

**Web Interface:**
1. Go to http://localhost:3000/mobile-camera
2. Click "Register Device"
3. Take photo or upload image
4. Click "Upload Detection"

**React Native App:**
```bash
npx react-native init CleanCityMobile
npm install axios
# See MOBILE_SETUP.md for code
```

**Flutter App:**
```bash
flutter create cleancity_mobile
flutter pub add http
# See MOBILE_SETUP.md for code
```

---

## 🔐 Security Checklist

- [ ] JWT_SECRET is unique and long (>20 chars)
- [ ] DATABASE_URL is private (never in git)
- [ ] HTTPS enabled (automatic on Vercel)
- [ ] Passwords hashed (PBKDF2)
- [ ] CORS configured
- [ ] Rate limiting enabled
- [ ] Database backups enabled

---

## 📊 Monitoring

### Logs
- **Development:** Browser console (F12)
- **Production:** Vercel dashboard → Logs
- **Database:** Neon/RDS dashboard

### Performance
- Page load: Should be < 2 seconds
- API response: Should be < 500ms
- Database query: Should be < 100ms

### Alerts
- Set up in Vercel dashboard
- Error rate threshold: > 1%
- Response time threshold: > 1s
- Database CPU threshold: > 80%

---

## 🎯 Next Steps

1. **First Time Setup:**
   - Read FULL_SETUP_GUIDE.md (detailed)
   - Set up database (Neon recommended)
   - Configure .env.local
   - Start dev server

2. **Testing:**
   - Login with test credentials
   - Test each page
   - Try uploading a report
   - Test mobile camera

3. **Deployment:**
   - Push to GitHub
   - Connect Vercel
   - Add env vars
   - Deploy to production

4. **Production:**
   - Monitor logs daily
   - Set up backups
   - Configure alerts
   - Scale as needed

---

## 📞 Quick Links

- **Neon Console:** https://console.neon.tech
- **AWS Console:** https://console.aws.amazon.com
- **Vercel Dashboard:** https://vercel.com/dashboard
- **GitHub:** https://github.com
- **Documentation:** See other .md files in project

---

## ❓ FAQ

**Q: Can I use this on my phone?**
A: Yes! Use /mobile-camera page or build native app. See MOBILE_SETUP.md

**Q: Is this production-ready?**
A: Yes! With proper database and environment setup.

**Q: How much does it cost?**
A: Free (Vercel + Neon free tiers), ~$40/month at scale.

**Q: Can I use my own domain?**
A: Yes! Add in Vercel dashboard.

**Q: How do I backup data?**
A: Neon provides 7-day backups. Export manually for long-term storage.

---

## 🎓 Learning Path

1. Start with: START_HERE.md
2. Setup with: FULL_SETUP_GUIDE.md (this document)
3. Learn APIs: API_DOCUMENTATION.md
4. Mobile setup: MOBILE_SETUP.md
5. Testing: TEST_GUIDE.md
6. Production: DEPLOYMENT.md

---

**Version:** 1.0  
**Last Updated:** 2024  
**Status:** Production Ready ✅
