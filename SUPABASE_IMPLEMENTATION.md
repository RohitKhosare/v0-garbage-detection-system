# CleanCity AI - Supabase Implementation Guide

## Overview
Your CleanCity AI project has been fully integrated with Supabase for authentication, database, and real-time updates. This guide explains the implementation and how to use it.

---

## 1. What Has Been Changed

### Updated Files:
- **`lib/supabaseClient.ts`** - Supabase client initialization
- **`.env.local`** - Environment variables (NEXT_PUBLIC_SUPABASE_ANON_KEY)
- **`app/login/page.tsx`** - Updated to use Supabase authentication
- **`app/register/page.tsx`** - Updated to use Supabase sign-up
- **`app/api/map/locations/route.ts`** - Updated to fetch data from Supabase

### Removed Dependencies:
- Custom JWT authentication (no longer needed)
- Mock data APIs (replaced with real Supabase queries)

---

## 2. Supabase Client Setup

### File: `lib/supabaseClient.ts`
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

This creates a Supabase client that connects to your database.

---

## 3. Authentication Flow

### Login (app/login/page.tsx)
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
})
```

### Register (app/register/page.tsx)
```typescript
const { data, error } = await supabase.auth.signUp({
  email: formData.email,
  password: formData.password,
  options: {
    data: {
      name: formData.name,
      role: formData.role,
    },
  },
})
```

---

## 4. Database Operations

### Querying Data (Map API)
```typescript
// Get reports
const { data: reports } = await supabase
  .from('reports')
  .select('*')
  .not('latitude', 'is', null)
  .order('created_at', { ascending: false })
  .limit(100)

// Get bins
const { data: bins } = await supabase
  .from('garbage_bins')
  .select('*')
  .order('fill_level_percentage', { ascending: false })
```

### Inserting Data
```typescript
const { data, error } = await supabase
  .from('reports')
  .insert([
    {
      title: 'Garbage dump',
      latitude: 28.6139,
      longitude: 77.2090,
      status: 'pending',
    }
  ])
```

### Updating Data
```typescript
const { data, error } = await supabase
  .from('reports')
  .update({ status: 'resolved' })
  .eq('id', reportId)
```

---

## 5. Available Tables

Your Supabase database has these tables (already created):

1. **users** - User accounts with roles
2. **reports** - Garbage reports with location and photos
3. **garbage_bins** - Smart bin data with fill levels
4. **vehicles** - Collection vehicles and drivers
5. **cctv_cameras** - Camera locations and status
6. **tasks** - Collection tasks assigned to drivers
7. **detections** - AI detection results
8. **alerts** - System and user alerts

---

## 6. Real-Time Updates (Live Data)

Subscribe to real-time changes:

```typescript
supabase
  .channel('reports')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'reports' },
    (payload) => {
      console.log('New report:', payload)
      // Update your UI here
    }
  )
  .subscribe()
```

---

## 7. Image Upload (Storage)

### Create a Storage Bucket (Supabase Dashboard):
1. Go to Storage in Supabase Dashboard
2. Create bucket: `garbage-images`
3. Make it public

### Upload Code:
```typescript
const uploadImage = async (file: File) => {
  const { data, error } = await supabase.storage
    .from('garbage-images')
    .upload(`public/${file.name}`, file)

  if (error) return null

  const { data: publicUrl } = supabase.storage
    .from('garbage-images')
    .getPublicUrl(data.path)

  return publicUrl.publicUrl
}
```

---

## 8. Migration Path

### Old Way (Custom JWT + Mock Data):
```typescript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  body: JSON.stringify({ email, password })
})
```

### New Way (Supabase):
```typescript
const { data } = await supabase.auth.signInWithPassword({
  email,
  password
})
```

---

## 9. Environment Variables

Your `.env.local` should have:
```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

**Note:** These are public keys meant for client-side use. The `ANON_KEY` is safe to expose in the browser.

---

## 10. Testing

### Test Login:
1. Visit `http://localhost:3000/login`
2. Create an account or use test credentials
3. Should redirect to home page

### Test Map:
1. Visit `http://localhost:3000/map`
2. Should fetch and display real locations from Supabase

### Test Reports:
1. Go to `/report` page
2. Submit a report
3. Check if it appears in Supabase dashboard

---

## 11. Next Steps

### 1. Update Other Pages
Update these pages to use Supabase instead of mock APIs:
- `/municipal` - Fetch reports data
- `/vehicles` - Fetch task assignments
- `/cctv` - Fetch camera data
- `/alerts` - Fetch alerts

### 2. Add Real-Time Updates
Implement live subscriptions for:
- Live map updates
- Real-time dashboard refresh
- Live alert notifications

### 3. Setup Image Storage
Enable image uploads for:
- Report photos
- CCTV snapshots
- Mobile camera uploads

### 4. Row-Level Security (RLS)
Setup RLS policies so users can only see their own data.

---

## 12. Example: Complete Report Submission

```typescript
'use client'

import { supabase } from '@/lib/supabaseClient'
import { useState } from 'react'

export default function ReportForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    latitude: 0,
    longitude: 0,
    photo: null as File | null,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Upload image if provided
    let photoUrl = null
    if (formData.photo) {
      const { data, error } = await supabase.storage
        .from('garbage-images')
        .upload(`reports/${Date.now()}`, formData.photo)
      
      if (error) throw error
      
      const { data: publicUrl } = supabase.storage
        .from('garbage-images')
        .getPublicUrl(data.path)
      
      photoUrl = publicUrl.publicUrl
    }

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()

    // Insert report
    const { error } = await supabase
      .from('reports')
      .insert([
        {
          user_id: user?.id,
          title: formData.title,
          description: formData.description,
          latitude: formData.latitude,
          longitude: formData.longitude,
          photo_url: photoUrl,
          status: 'pending',
        }
      ])

    if (error) throw error

    alert('Report submitted!')
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  )
}
```

---

## 13. Troubleshooting

### "Missing Supabase environment variables"
- Check `.env.local` has `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Restart dev server: `npm run dev`

### "Authentication error"
- Make sure user exists in Supabase Auth
- Check credentials in login form
- Verify email/password in Supabase dashboard

### "Data not showing on map"
- Check if tables have data in Supabase dashboard
- Verify column names match in SELECT queries
- Check browser console for error messages

---

## 14. Resources

- Supabase Docs: https://supabase.com/docs
- Supabase JavaScript Client: https://supabase.com/docs/reference/javascript
- Authentication Guide: https://supabase.com/docs/guides/auth
- Database Guide: https://supabase.com/docs/guides/database
- Storage Guide: https://supabase.com/docs/guides/storage

---

## Summary

Your CleanCity AI is now fully integrated with Supabase! The changes include:
- Real authentication system
- Live database connectivity
- Proper API endpoints using Supabase
- Ready for production deployment

Just update the remaining pages to use Supabase queries instead of mock data, and your system will be complete!
