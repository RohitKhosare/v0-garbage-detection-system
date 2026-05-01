# CleanCity AI - Production Setup Guide

## Overview

This is a complete production-ready Smart City Garbage Management System built with:
- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth + Storage + Realtime)
- **Architecture**: Full-stack, serverless, scalable

---

## Prerequisites

- Node.js 18+ (https://nodejs.org/)
- A Supabase account (https://supabase.com)
- Git (https://git-scm.com/)

---

## Step 1: Supabase Database Setup

### 1.1 Create Supabase Project
1. Go to https://supabase.com and sign up
2. Create a new project
3. Copy your **Project URL** and **Anon Key**

### 1.2 Create Database Tables

Run these SQL queries in Supabase SQL Editor:

```sql
-- Users table (managed by Supabase Auth)
-- Supabase creates this automatically

-- Reports table
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  location TEXT NOT NULL,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  category TEXT DEFAULT 'garbage',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'resolved')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- CCTV Feeds table
CREATE TABLE IF NOT EXISTS public.cctv_feeds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  stream_url TEXT NOT NULL,
  latitude FLOAT,
  longitude FLOAT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_reports_user_id ON public.reports(user_id);
CREATE INDEX idx_reports_status ON public.reports(status);
CREATE INDEX idx_reports_location ON public.reports(latitude, longitude);
CREATE INDEX idx_reports_created_at ON public.reports(created_at);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.reports;
```

### 1.3 Create Storage Bucket

1. Go to Supabase Storage
2. Create a new bucket named: `garbage-images`
3. Make it **public** (not private)
4. Set upload size limit to 50MB

### 1.4 Set Up Storage Policies

```sql
-- Allow authenticated users to upload
CREATE POLICY "Allow authenticated uploads" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'garbage-images' AND auth.role() = 'authenticated');

-- Allow public read
CREATE POLICY "Allow public read" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'garbage-images');
```

### 1.5 Enable Row Level Security (RLS)

In Supabase, enable RLS on these tables:

**For reports table:**
```sql
-- Users can only see/edit their own reports
CREATE POLICY "Users can view own reports" ON public.reports
  FOR SELECT
  USING (auth.uid() = user_id OR auth.role() = 'admin');

CREATE POLICY "Users can insert own reports" ON public.reports
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reports" ON public.reports
  FOR UPDATE
  USING (auth.uid() = user_id OR auth.role() = 'admin');
```

---

## Step 2: Project Setup

### 2.1 Clone/Setup Project

```bash
cd your-project-directory
npm install
```

### 2.2 Configure Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace:
- `your-project.supabase.co` with your actual Supabase URL
- `your-anon-key-here` with your actual Anon Key (found in Supabase Settings → API)

### 2.3 Start Development Server

```bash
npm run dev
```

Visit: http://localhost:3000

---

## Step 3: Features & Pages

### Dashboard (`/dashboard`)
- View statistics (total reports, pending, resolved)
- Navigate to report, map, and CCTV pages
- Logout button

### Report Page (`/report`)
- Upload garbage images
- Select category (garbage, plastic, organic, hazardous)
- Capture GPS location automatically
- Submit to Supabase storage + database

### Live Map (`/map`)
- View all reported garbage locations
- Click reports to see details and images
- Real-time updates (Supabase Realtime)
- Filter by status

### CCTV Page (`/cctv`)
- View live camera feeds
- Display feed status
- Monitor multiple streams

### Authentication
- Email/password registration
- Email/password login
- Role-based access (citizen, officer, collector)
- Session management with Supabase Auth
- Protected routes via middleware

---

## Step 4: Authentication Setup

### Test Accounts

After registration, use your own accounts. Default test account:
```
Email: test@example.com
Password: Test@123456
```

### Configure Email Templates

In Supabase, configure email templates for:
- Welcome email
- Password reset
- Email confirmation (if enabled)

---

## Step 5: Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to vercel.com and sign in
3. Import your repository
4. Add environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```
5. Deploy

### Deploy to AWS/Other Platforms

1. Build the project:
   ```bash
   npm run build
   ```

2. Start in production mode:
   ```bash
   npm start
   ```

---

## Step 6: Testing Features

### Test Report Upload

1. Login to http://localhost:3000
2. Go to `/report`
3. Fill in location and select image
4. Click "Submit Report"
5. Check Supabase Storage for uploaded image
6. Verify entry in `reports` table

### Test Real-time Updates

1. Open map page in one browser
2. Upload a report in another
3. New report should appear on map instantly

### Test API

```bash
# Get all reports
curl "http://localhost:3000/api/reports"

# Create report (requires auth token)
curl -X POST "http://localhost:3000/api/reports" \
  -H "Content-Type: application/json" \
  -d '{
    "location": "Test Location",
    "latitude": 28.6139,
    "longitude": 77.2090,
    "status": "pending"
  }'
```

---

## Step 7: Database Queries (Using Supabase Client)

### In Components (Client-side)

```typescript
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

// Fetch reports
const { data: reports } = await supabase
  .from('reports')
  .select('*')
  .order('created_at', { ascending: false })

// Insert report
const { error } = await supabase
  .from('reports')
  .insert({
    user_id: user.id,
    image_url: 'https://...',
    location: 'Park',
    latitude: 28.6139,
    longitude: 77.2090,
    status: 'pending'
  })

// Subscribe to real-time updates
const channel = supabase
  .channel('reports')
  .on(
    'postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'reports' },
    (payload) => console.log('New report:', payload.new)
  )
  .subscribe()
```

### In API Routes (Server-side)

```typescript
import { createClient } from '@/lib/supabase/server'

const supabase = await createClient()

const { data, error } = await supabase
  .from('reports')
  .select('*')
```

---

## Step 8: Monitoring & Maintenance

### Check Logs

Vercel/Hosting logs:
```bash
npm logs  # Vercel logs
```

Supabase logs:
- Database: Supabase Dashboard → Database → Webhooks
- Auth: Supabase Dashboard → Authentication
- Storage: Supabase Dashboard → Storage

### Monitor Performance

- Database queries: Supabase Dashboard → Database → Query Performance
- Real-time stats: Supabase Dashboard → Status
- Storage usage: Supabase Dashboard → Storage

### Backups

Supabase automatically backs up your database. Configure:
- Backup frequency (daily/weekly)
- Retention period (7-90 days)

---

## Step 9: Scaling & Optimization

### Database Optimization

- Add more indexes for frequently queried columns
- Archive old reports periodically
- Use database functions for complex queries

### Image Optimization

- Compress images before upload
- Use CDN for faster delivery
- Set up image resizing (Supabase Image Transformation)

### Caching

- Cache reports with Supabase caching
- Use browser caching for images
- Implement SWR for client-side data fetching

---

## Step 10: Production Checklist

- [ ] Environment variables set correctly
- [ ] Database tables created and indexed
- [ ] Storage bucket configured
- [ ] RLS policies enabled
- [ ] Email authentication configured
- [ ] SSL certificate active (Vercel does this automatically)
- [ ] Monitoring and logging set up
- [ ] Backup and recovery tested
- [ ] Rate limiting configured
- [ ] Error tracking enabled (Sentry, etc.)
- [ ] Analytics configured
- [ ] CORS properly configured

---

## Troubleshooting

### Problem: "Invalid Supabase URL"
- Check `.env.local` has correct NEXT_PUBLIC_SUPABASE_URL
- Restart dev server after changing env vars

### Problem: "Storage upload fails"
- Verify bucket is public
- Check storage policies are set
- Ensure image file size < 50MB

### Problem: "Real-time updates not working"
- Verify Realtime is enabled for the table
- Check middleware is running correctly
- Verify user is authenticated

### Problem: "Maps not loading"
- Check latitude/longitude are valid numbers
- Ensure reports have location data
- Verify map component is mounted

---

## Support

- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs
- shadcn/ui: https://ui.shadcn.com
- Issues: Check GitHub issues or create a new one

---

## Security Best Practices

1. **Never commit `.env.local`** to Git
2. **Use environment variables** for all secrets
3. **Enable RLS** on all tables
4. **Validate inputs** on server-side
5. **Use HTTPS** in production
6. **Keep dependencies** updated
7. **Regular backups** of database
8. **Monitor usage** for unusual activity
9. **Rotate API keys** periodically
10. **Test security** before production

---

## Cost Estimation

**Supabase Pricing** (per month):
- Database: $0 - $100 (based on usage)
- Storage: $0 - $100 (based on GB used)
- Auth: Free for unlimited users
- Realtime: Included

**Vercel Pricing** (per month):
- Pro Plan: $20
- Pro Plus: $150
- (or use Free plan for development)

**Estimated Total**: $20-50/month for small to medium apps

---

## Next Steps

1. Add more camera feeds to CCTV table
2. Implement admin dashboard for officers
3. Add email notifications for new reports
4. Create mobile app (React Native)
5. Add garbage collection scheduling
6. Implement AI detection for autonomous monitoring

Good luck! 🚀
