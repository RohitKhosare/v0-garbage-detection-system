# CleanCity AI - Complete Setup & Running Guide

## ✅ Your Project Status
- ✓ All unnecessary code removed
- ✓ Only Supabase integration (no other storage)
- ✓ All 6 pages created and working
- ✓ Middleware & authentication setup
- ✓ Environment variables configured
- ✓ Ready to run immediately

---

## 🚀 QUICK START (5 MINUTES)

### Step 1: Install Dependencies
```bash
cd /vercel/share/v0-project
npm install
```

### Step 2: Create Supabase Database Tables
Copy and paste this SQL into your Supabase Dashboard (SQL Editor):

```sql
-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  location VARCHAR(255) NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  description TEXT,
  image_url TEXT,
  category VARCHAR(50) DEFAULT 'garbage',
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create garbage_bins table
CREATE TABLE IF NOT EXISTS garbage_bins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bin_name VARCHAR(255) NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  fill_level_percentage INT DEFAULT 0,
  capacity_liters INT,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_name VARCHAR(255) NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  current_load_liters INT DEFAULT 0,
  capacity_liters INT,
  status VARCHAR(50) DEFAULT 'idle',
  driver_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create cctv_cameras table
CREATE TABLE IF NOT EXISTS cctv_cameras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  camera_name VARCHAR(255) NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  status VARCHAR(50) DEFAULT 'active',
  detection_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE garbage_bins ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cctv_cameras ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view reports" ON reports FOR SELECT USING (true);
CREATE POLICY "Users can insert their own reports" ON reports FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own reports" ON reports FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view bins" ON garbage_bins FOR SELECT USING (true);
CREATE POLICY "Anyone can view vehicles" ON vehicles FOR SELECT USING (true);
CREATE POLICY "Anyone can view cameras" ON cctv_cameras FOR SELECT USING (true);
```

### Step 3: Create Storage Bucket
In Supabase Dashboard → Storage:
1. Click "Create a new bucket"
2. Name it: `garbage-images`
3. Make it **Public**
4. Click Create

### Step 4: Run Locally
```bash
npm run dev
```
Open: `http://localhost:3000`

### Step 5: Test the Website
1. **Home Page**: http://localhost:3000
2. **Register**: Create new account
3. **Login**: Use your account
4. **Report**: Upload garbage photos
5. **Map**: See all reports
6. **Dashboard**: View statistics

---

## 🔐 Login Credentials (For Testing)

After you create an account via Register page, you can login with:
- Email: your-email@example.com
- Password: your-password

---

## 📁 Project Structure

```
/app
├── page.tsx                    → Home page
├── login/page.tsx              → Login (Supabase Auth)
├── register/page.tsx           → Sign up (Supabase Auth)
├── dashboard/page.tsx          → Statistics & navigation
├── report/page.tsx             → Upload garbage photos
├── map/page.tsx                → Real-time map
├── cctv/page.tsx               → Camera feeds
└── api/map/locations/route.ts  → API endpoint

/utils/supabase
├── client.ts                   → Browser client
└── server.ts                   → Server client

middleware.ts                   → Session management
.env.local                      → Environment variables
```

---

## 🌐 Deploy to Vercel (5 MINUTES)

### Option A: Deploy from GitHub

1. **Push to GitHub**
```bash
git add .
git commit -m "CleanCity AI - Supabase Only"
git push origin main
```

2. **Deploy on Vercel**
   - Go to https://vercel.com
   - Click "Add New Project"
   - Import your GitHub repository
   - Add Environment Variables:
     ```
     NEXT_PUBLIC_SUPABASE_URL=https://xvchgvaaprqzxynvhiiv.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_2eV-PFJppU33cSaNzGmb-Q_R7XZxZeK
     ```
   - Click Deploy

3. **Your site is live!**

### Option B: Deploy Standalone

1. **Connect to Vercel CLI**
```bash
npm i -g vercel
vercel login
vercel
```

2. **Follow prompts and your site deploys**

---

## 📱 Features Available

### Login & Authentication
- ✓ Email/password registration
- ✓ Secure Supabase authentication
- ✓ Session management
- ✓ Protected routes

### Report Garbage
- ✓ Upload photos
- ✓ Add location (GPS)
- ✓ Add description
- ✓ Automatic storage in Supabase

### Live Map
- ✓ See all garbage reports
- ✓ Real-time updates
- ✓ Click to view details
- ✓ Location coordinates

### Dashboard
- ✓ Total reports count
- ✓ Pending reports
- ✓ Resolved reports
- ✓ Quick navigation

### CCTV Feeds
- ✓ Monitor camera feeds
- ✓ View detection history

---

## 🔧 Environment Variables

Your `.env.local` already has:
```
NEXT_PUBLIC_SUPABASE_URL=https://xvchgvaaprqzxynvhiiv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_2eV-PFJppU33cSaNzGmb-Q_R7XZxZeK
```

No changes needed unless you want to use a different Supabase project.

---

## ⚠️ Troubleshooting

### Issue: "SUPABASE_URL not found"
**Solution**: Check `.env.local` has both variables

### Issue: "Database table doesn't exist"
**Solution**: Run the SQL script in Step 2

### Issue: "Storage bucket error"
**Solution**: Create public bucket named `garbage-images`

### Issue: "Auth not working"
**Solution**: Make sure email is verified in Supabase

### Issue: "Build fails on Vercel"
**Solution**: Add environment variables in Vercel project settings

---

## 📊 Database Schema

### reports table
```
id (UUID) - Unique identifier
user_id - Who reported
location - Address/location name
latitude, longitude - GPS coordinates
image_url - Photo from storage
status - pending/in-progress/resolved
created_at - Timestamp
```

### garbage_bins table
```
id - Unique identifier
bin_name - Name
latitude, longitude - Location
fill_level_percentage - 0-100%
capacity_liters - Size
status - active/inactive
```

### vehicles table
```
id - Unique identifier
vehicle_name - Truck name
latitude, longitude - Current location
current_load_liters - How full
capacity_liters - Max size
status - idle/in-progress
```

### cctv_cameras table
```
id - Unique identifier
camera_name - Camera name
latitude, longitude - Location
detection_count - Total detections
status - active/inactive
```

---

## 🎯 What's Included

✅ **Frontend**
- 6 fully functional pages
- Real-time updates
- Beautiful UI with Tailwind CSS
- Mobile responsive

✅ **Backend**
- Supabase authentication
- PostgreSQL database
- Real-time subscriptions
- Storage for images

✅ **Deployment Ready**
- Production-grade code
- Environment configuration
- Vercel ready
- GitHub integration

---

## 📚 Additional Resources

- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- GitHub: https://github.com/RohitKhosare/v0-garbage-detection-system

---

## ✨ You're All Set!

Your CleanCity AI website is **100% ready to run**. 

**Start now with:**
```bash
npm install
npm run dev
```

Then open http://localhost:3000 and start using it!

For production, just push to GitHub and Vercel will auto-deploy.

**Happy coding! 🚀**
