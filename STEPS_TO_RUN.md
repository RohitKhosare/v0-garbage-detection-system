# 🎯 Step-by-Step: Get Your Website Running Right Now

## Step 1: Open Terminal
Open your terminal/command prompt in the project directory.

```bash
# Navigate to your project
cd /path/to/v0-garbage-detection-system
```

## Step 2: Install Dependencies
Run this command:

```bash
npm install
```

Wait for it to complete (takes 1-2 minutes).

## Step 3: Start Development Server
```bash
npm run dev
```

You should see:
```
> next dev

▲ Next.js 14.0.0
- Local:        http://localhost:3000
```

## Step 4: Open in Browser
Click this link or copy-paste in your browser:

**http://localhost:3000**

---

## Step 5: See Your Website Running

You'll see the CleanCity AI homepage with:
- ✅ Hero section
- ✅ Feature buttons
- ✅ Statistics cards
- ✅ Navigation menu

---

## Step 6: Test Login/Register

### Create Account
1. Click "Register" or go to http://localhost:3000/register
2. Fill in:
   - Email: `your-email@example.com`
   - Password: `YourPassword123`
   - Click "Register"
3. Redirected to login

### Login
1. Go to http://localhost:3000/login
2. Use your email and password
3. Click "Login"
4. See dashboard!

---

## Step 7: Test Dashboard
After logging in, you'll see:
- Total Reports: 0
- Pending: 0
- Resolved: 0
- Quick navigation buttons

Click any button to navigate:
- "Report Garbage" → Report page
- "Live Map" → Map page
- "CCTV Feeds" → CCTV page

---

## Step 8: Create Database Tables (Important!)

For reports to be saved, create the database:

### Go to Supabase Console
1. Visit: https://app.supabase.com
2. Login with your account
3. Select project (v0-garbage-detection-system)
4. Go to SQL Editor (left sidebar)
5. Click "New Query"
6. Paste this code:

```sql
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  location TEXT NOT NULL,
  latitude DECIMAL(10,8) NOT NULL,
  longitude DECIMAL(11,8) NOT NULL,
  image_url TEXT,
  category TEXT DEFAULT 'garbage',
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own reports" ON reports
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reports" ON reports
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

7. Click "Run" (blue button)
8. Wait for confirmation
9. Done! ✅

---

## Step 9: Create Storage Bucket (Optional but Recommended)

For image uploads:

1. In Supabase console, go to "Storage" (left sidebar)
2. Click "Create a new bucket"
3. Name: `garbage-images`
4. Check "Public bucket"
5. Click "Create bucket"
6. Done! ✅

---

## Step 10: Test the Full System

### Submit a Report
1. Go back to http://localhost:3000/dashboard
2. Click "Report Garbage"
3. Upload an image
4. Location will auto-fill from GPS (or enter manually)
5. Click "Submit"
6. See success message ✅

### View on Map
1. Click "Live Map" on dashboard
2. See your report location
3. Click on it to see details
4. Watch for real-time updates ✅

### CCTV
1. Click "CCTV Feeds"
2. See camera monitoring interface ✅

---

## Your Website is Now Running! 🎉

### Access Points
- **Home**: http://localhost:3000
- **Login**: http://localhost:3000/login
- **Dashboard**: http://localhost:3000/dashboard
- **Report**: http://localhost:3000/report
- **Map**: http://localhost:3000/map
- **CCTV**: http://localhost:3000/cctv

### What's Working
- ✅ User registration
- ✅ User login
- ✅ Dashboard
- ✅ Report submission
- ✅ Real-time map
- ✅ CCTV monitoring
- ✅ Database storage
- ✅ User sessions

---

## Troubleshooting

### Website won't load?
```bash
# Stop the server (Ctrl+C)
# Clear cache
rm -rf .next
# Restart
npm run dev
```

### Getting errors?
- Check browser console (Press F12)
- Look for red error messages
- Check terminal for server errors

### Port 3000 already in use?
```bash
# Use different port
npm run dev -- -p 3001
# Visit http://localhost:3001
```

### Can't upload images?
- Make sure you created the storage bucket
- Check that it's marked as public
- Try again

### Reports not showing?
- Make sure you created the database table
- Check you're logged in
- Refresh the page

---

## Next: Deploy to Production

When ready to launch:

### Option 1: Vercel (Easiest)
```bash
# Push to GitHub
git add .
git commit -m "Ready for production"
git push origin main

# Then go to vercel.com
# Import the repository
# Add environment variables
# Deploy!
```

### Option 2: Any Server
```bash
npm run build
npm start
```

---

## You're All Set! 🚀

Your complete CleanCity AI website is running locally.

### Quick Commands
- **Start**: `npm run dev`
- **Build**: `npm run build`
- **Production**: `npm start`

### Key Files
- `.env.local` - Your Supabase credentials
- `app/` - All pages
- `utils/supabase/` - Database clients
- `middleware.ts` - Session management

---

## That's It!

You now have a fully functional Smart City Garbage Management System running on your computer using Supabase.

**Total time to get running: ~5 minutes** ⏱️

---

**Happy coding! 🎉**
