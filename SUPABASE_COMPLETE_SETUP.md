# CleanCity AI - Supabase Complete Setup Guide

**Status:** ✅ Supabase is already connected to your project!

All environment variables are configured. Your database tables are created and ready to use.

---

## 🎯 WHAT YOU HAVE NOW

### ✅ Database Connected
- Supabase PostgreSQL fully integrated
- 8 tables created with all columns
- Environment variables set up
- Ready to use immediately

### ✅ Database Tables
1. **users** - User accounts (citizens, officers, drivers, admins)
2. **reports** - Garbage reports from citizens
3. **vehicles** - Garbage collection vehicles
4. **garbage_bins** - IoT garbage bins with sensors
5. **tasks** - Collection tasks assigned to drivers
6. **cctv_cameras** - CCTV camera locations
7. **detections** - Garbage detections from cameras
8. **alerts** - System alerts and notifications

---

## 📋 STEP 1: Install Supabase Client (if needed)

```bash
npm install @supabase/supabase-js
```

Already done? Check:
```bash
npm list @supabase/supabase-js
```

---

## 📋 STEP 2: Check Environment Variables

Your `.env.local` should have:

```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
POSTGRES_URL=your_postgres_url
SUPABASE_SERVICE_ROLE_KEY=your_service_key
```

**Are they set?** Run in terminal:
```bash
echo $NEXT_PUBLIC_SUPABASE_URL
```

If empty, add them to your `.env.local` file in project root.

---

## 📋 STEP 3: Use Supabase in Your Code

### Import the client:
```typescript
import { supabase } from '@/lib/supabase'
```

### Fetch data:
```typescript
// Get all reports
const { data: reports, error } = await supabase
  .from('reports')
  .select('*')

// Get user by ID
const { data: user, error } = await supabase
  .from('users')
  .select('*')
  .eq('id', userId)
  .single()

// Insert new report
const { data, error } = await supabase
  .from('reports')
  .insert([
    {
      user_id: userId,
      title: 'Garbage pile',
      description: 'Found garbage',
      latitude: 28.6139,
      longitude: 77.2090,
      category: 'Street',
      status: 'pending',
      priority: 'high'
    }
  ])
```

---

## 🖼️ STEP 4: Upload Images to Storage

```typescript
// Upload image
const { data, error } = await supabase.storage
  .from('garbage-images')
  .upload(`report-${Date.now()}.jpg`, imageFile)

// Get public URL
const { data: { publicUrl } } = supabase.storage
  .from('garbage-images')
  .getPublicUrl(fileName)
```

---

## 🔐 STEP 5: User Authentication

```typescript
// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
})

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
})

// Get current user
const { data: { user } } = await supabase.auth.getUser()

// Sign out
await supabase.auth.signOut()
```

---

## 📊 STEP 6: Real-time Subscriptions

Listen to database changes:

```typescript
// Subscribe to new reports
const subscription = supabase
  .from('reports')
  .on('*', payload => {
    console.log('Change:', payload)
  })
  .subscribe()

// Unsubscribe when done
subscription.unsubscribe()
```

---

## 🧪 STEP 7: Test Everything

### Test 1: Check Connection
```bash
curl https://your-supabase-url/rest/v1/users -H "apikey: your-anon-key"
```

### Test 2: Insert Test Data
Go to Supabase dashboard → tables → insert a test user

### Test 3: Query Data
In your app, run:
```typescript
const { data } = await supabase.from('users').select('*')
console.log(data)
```

---

## 🚀 STEP 8: Run Your App

```bash
npm run dev
```

Open: http://localhost:3000

Test features:
- Login page
- Submit garbage report
- View live map
- Check CCTV feeds
- Check mobile camera uploads

---

## ⚡ QUICK API REFERENCE

### Create
```typescript
await supabase.from('reports').insert([{ ... }])
```

### Read
```typescript
await supabase.from('reports').select('*').eq('id', reportId)
```

### Update
```typescript
await supabase.from('reports').update({ status: 'resolved' }).eq('id', reportId)
```

### Delete
```typescript
await supabase.from('reports').delete().eq('id', reportId)
```

### Filter
```typescript
await supabase
  .from('reports')
  .select('*')
  .eq('status', 'pending')
  .gt('priority', 'low')
```

---

## 🔍 TROUBLESHOOTING

### Issue: "Missing environment variables"
**Solution:** Add to `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### Issue: "Failed to fetch"
**Solution:** Check Supabase status at supabase.com/status

### Issue: "RLS denied"
**Solution:** Check Row Level Security policies in Supabase dashboard

### Issue: "CORS error"
**Solution:** Add your domain to Supabase project → Settings → API

---

## 📚 RESOURCES

- Supabase Docs: https://supabase.com/docs
- Supabase JS Client: https://supabase.com/docs/reference/javascript
- Database Guide: https://supabase.com/docs/guides/database
- Real-time: https://supabase.com/docs/guides/realtime

---

## ✅ CHECKLIST - Your System is Ready!

- [x] Supabase account created
- [x] Database tables created (8 tables)
- [x] Environment variables configured
- [x] Supabase client library ready (`lib/supabase.ts`)
- [x] API endpoints ready to update
- [x] Storage bucket ready for images
- [x] Authentication ready
- [x] Real-time subscriptions available

**You're all set! Start building! 🚀**
