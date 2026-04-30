# Supabase Quick Start Checklist

## What's Already Done ✅

- [x] Created `.env.local` with Supabase credentials
- [x] Created `utils/supabase/server.ts` - Server client
- [x] Created `utils/supabase/client.ts` - Browser client  
- [x] Created `middleware.ts` - Session management
- [x] Database tables created in Supabase
- [x] Comprehensive setup guide created

## What You Need To Do (2 Steps)

### Step 1: Install Packages
```bash
npm install @supabase/supabase-js @supabase/ssr
```

### Step 2: Start Your Project
```bash
npm run dev
```

**That's it! Your project is ready to use Supabase.**

---

## Verify It's Working

1. Open `http://localhost:3000` in browser
2. Try to login with: `citizen@cleancity.in` / `Test@123`
3. Check browser console (F12) for any errors
4. Check server terminal for API logs

---

## Key Files Created

| File | Purpose |
|------|---------|
| `.env.local` | Supabase credentials (KEEP SECRET!) |
| `utils/supabase/server.ts` | Server-side queries |
| `utils/supabase/client.ts` | Client-side queries |
| `middleware.ts` | Session refresh automation |

---

## File Locations

```
your-project/
├── .env.local ← Credentials here
├── middleware.ts ← Session management
└── utils/
    └── supabase/
        ├── server.ts ← Use in server components
        └── client.ts ← Use in client components
```

---

## Quick Code Examples

### Query Data in Server Component
```typescript
import { createClient } from "@/utils/supabase/server"

export default async function Page() {
  const supabase = await createClient()
  const { data: reports } = await supabase.from("reports").select()
  return <div>{reports?.length} reports</div>
}
```

### Query Data in Client Component
```typescript
"use client"

import { createClient } from "@/utils/supabase/client"
import { useEffect, useState } from "react"

export default function ReportsList() {
  const [reports, setReports] = useState([])
  const supabase = createClient()

  useEffect(() => {
    supabase.from("reports").select().then(({ data }) => setReports(data))
  }, [])

  return <div>{reports?.length} reports</div>
}
```

---

## Environment Variables Explanation

```
NEXT_PUBLIC_SUPABASE_URL
├─ Your Supabase project URL
├─ Safe to expose (it's in the name: NEXT_PUBLIC_)
└─ Needed for: Client and server communication

NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY  
├─ Your public API key
├─ Safe to expose (only read permissions by default)
└─ Needed for: Authentication and queries

DATABASE_URL
├─ Optional: Full database connection string
├─ Only needed for: Direct PostgreSQL queries
└─ KEEP SECRET: Never commit to GitHub
```

---

## Troubleshooting

**Problem:** Packages not installed
```bash
npm install @supabase/supabase-js @supabase/ssr
```

**Problem:** Environment variables not loading
- Restart dev server: `npm run dev`
- Check `.env.local` exists in project root
- Verify variables are set correctly

**Problem:** Authentication errors
- Check Supabase dashboard user exists
- Verify email/password are correct
- Check middleware.ts is in project root

**Problem:** Database queries failing
- Ensure table names match exactly (case-sensitive)
- Check Supabase dashboard > Tables
- Verify user has permissions (RLS policies)

---

## Next Features To Build

1. **Upgrade Login** - Use Supabase Auth instead of API
2. **Real-time Map** - Subscribe to report updates
3. **Auto-notifications** - WebSocket alerts
4. **File Storage** - Upload photos to Supabase Storage
5. **User Profiles** - Store user preferences

---

## Helpful Links

- Supabase Dashboard: https://app.supabase.com
- Supabase Docs: https://supabase.com/docs
- Your Database: https://app.supabase.com/project/xvchgvaaprqzxynvhiiv

---

## Support

If something doesn't work:
1. Read `SUPABASE_SETUP_GUIDE.md` (more detailed)
2. Check Supabase dashboard for errors
3. Review console logs (F12)
4. Verify all files were created correctly
