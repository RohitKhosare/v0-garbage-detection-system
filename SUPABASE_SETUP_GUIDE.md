# Supabase Complete Setup Guide for CleanCity AI

## Overview
This guide walks you through setting up Supabase with your CleanCity AI project using the official Next.js Server-Side Rendering (SSR) approach.

## What Has Been Created

### 1. Environment Variables (.env.local)
✅ Located in project root  
✅ Contains Supabase credentials  
✅ Loaded automatically by Next.js

### 2. Supabase Client Helpers
- `utils/supabase/server.ts` - Server-side client
- `utils/supabase/client.ts` - Browser-side client
- `middleware.ts` - Session management middleware

---

## Step-by-Step Setup

### Step 1: Install Required Packages
```bash
npm install @supabase/supabase-js @supabase/ssr
```

### Step 2: Verify .env.local File
The file has been created at `/vercel/share/v0-project/.env.local` with:
```
NEXT_PUBLIC_SUPABASE_URL=https://xvchgvaaprqzxynvhiiv.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_2eV-PFJppU33cSaNzGmb-Q_R7XZxZeK
```

### Step 3: Test Connection
Run your development server:
```bash
npm run dev
```

### Step 4: Verify Middleware is Working
The middleware at `middleware.ts` automatically:
- ✅ Keeps user sessions refreshed
- ✅ Manages authentication state
- ✅ Syncs cookies between server and client

---

## Using Supabase in Your Code

### Server Component (Next.js 13+)
```typescript
import { createClient } from "@/utils/supabase/server"

export default async function Page() {
  const supabase = await createClient()
  const { data: users } = await supabase.from("users").select()
  
  return <div>{/* Use users data */}</div>
}
```

### Client Component
```typescript
"use client"

import { createClient } from "@/utils/supabase/client"
import { useEffect, useState } from "react"

export default function ClientComponent() {
  const [data, setData] = useState(null)
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from("reports").select()
      setData(data)
    }
    fetchData()
  }, [])

  return <div>{/* Use data */}</div>
}
```

---

## Database Tables Available

Your Supabase project has these pre-created tables:

1. **users** - User accounts and authentication
2. **reports** - Garbage reports from citizens
3. **vehicles** - Garbage collection vehicles
4. **garbage_bins** - IoT garbage bin data
5. **cctv_cameras** - Camera locations and feeds
6. **detections** - AI detection results
7. **tasks** - Collection task assignments
8. **alerts** - System alerts and notifications

---

## Updating Login/Register to Use Supabase

### Updated Login Flow
1. User submits email and password
2. Supabase authenticates via `supabase.auth.signInWithPassword()`
3. Session saved automatically in cookies
4. User redirected to dashboard

### Updated Registration Flow
1. User submits registration details
2. Supabase creates user via `supabase.auth.signUp()`
3. Optional: Send verification email
4. Session established automatically

---

## API Endpoints Using Supabase

Your API routes can now use Supabase:

```typescript
// app/api/reports/route.ts
import { createClient } from "@/utils/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  
  const { data: reports, error } = await supabase
    .from("reports")
    .select("*")
    .eq("status", "pending")
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  
  return NextResponse.json(reports)
}
```

---

## Real-Time Features

Supabase supports real-time updates via WebSockets:

```typescript
"use client"

import { createClient } from "@/utils/supabase/client"
import { useEffect } from "react"

export default function LiveReports() {
  const supabase = createClient()

  useEffect(() => {
    // Subscribe to new reports
    const subscription = supabase
      .from("reports")
      .on("*", (payload) => {
        console.log("New report:", payload.new)
        // Update UI with new data
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return <div>{/* Live updates */}</div>
}
```

---

## Authentication Functions Available

```typescript
// Sign up
const { data, error } = await supabase.auth.signUp({
  email: "user@example.com",
  password: "SecurePassword123",
})

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: "user@example.com",
  password: "SecurePassword123",
})

// Sign out
await supabase.auth.signOut()

// Get current user
const { data: { user } } = await supabase.auth.getUser()

// Get session
const { data: { session } } = await supabase.auth.getSession()
```

---

## Row Level Security (RLS)

Supabase includes Row Level Security by default. Each table can have policies:

- Users can only see their own reports
- Officers can see all reports in their area
- Drivers can only see assigned tasks
- Admins have full access

Example policy:
```sql
-- Users can only view their own reports
CREATE POLICY "Users can view own reports"
ON reports FOR SELECT
USING (auth.uid() = user_id);
```

---

## Troubleshooting

### Issue: "NEXT_PUBLIC_SUPABASE_URL is undefined"
**Solution:** Ensure `.env.local` is in project root and restart dev server

### Issue: "Session not persisting"
**Solution:** Middleware.ts handles this automatically, no additional setup needed

### Issue: "CORS errors"
**Solution:** Supabase handles CORS automatically, check browser console for specific errors

### Issue: "Authentication not working"
**Solution:** 
1. Verify credentials in .env.local
2. Check Supabase dashboard for user
3. Ensure middleware is running

---

## Next Steps

1. ✅ Install packages: `npm install @supabase/supabase-js @supabase/ssr`
2. ✅ Environment variables are set up
3. ✅ Supabase clients are created
4. ✅ Middleware is in place
5. Next: Update your login/register pages to use Supabase auth
6. Next: Update API routes to query Supabase database
7. Next: Test real-time features

---

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js + Supabase Guide](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [Supabase CLI](https://supabase.com/docs/reference/cli)

---

## Support

If you encounter issues:
1. Check Supabase dashboard: https://app.supabase.com
2. Review console logs in browser dev tools
3. Check server terminal for API errors
4. Review this guide's troubleshooting section
