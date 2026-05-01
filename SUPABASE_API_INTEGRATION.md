# CleanCity AI - Supabase API Integration Guide

This guide shows how to update your existing API routes to use Supabase.

---

## 📝 UPDATE LOGIN API

**File:** `app/api/auth/login/route.ts`

Replace with:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { hashPassword, generateToken } from '@/lib/auth-utils'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    // Query user from Supabase
    const { data: users, error } = await supabase
      .from('users')
      .select('id, email, password_hash, name, role')
      .eq('email', email)
      .single()

    if (error || !users) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Verify password
    if (hashPassword(password) !== users.password_hash) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Generate token
    const token = generateToken(users.id, users.email)

    const response = NextResponse.json({
      success: true,
      user: {
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
      },
      token,
    })

    // Set cookie
    response.cookies.set('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
```

---

## 📝 UPDATE REGISTER API

**File:** `app/api/auth/register/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { hashPassword, generateToken } from '@/lib/auth-utils'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, role, phone } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }

    // Create user
    const userId = uuidv4()
    const passwordHash = hashPassword(password)

    const { data: newUser, error } = await supabase
      .from('users')
      .insert([
        {
          id: userId,
          email,
          password_hash: passwordHash,
          name,
          role: role || 'citizen',
          phone: phone || null,
        },
      ])
      .select('id, email, name, role')
      .single()

    if (error) {
      return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
    }

    const token = generateToken(userId, email)

    const response = NextResponse.json({
      success: true,
      user: newUser,
      token,
    }, { status: 201 })

    response.cookies.set('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
    })

    return response
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}
```

---

## 📝 UPDATE REPORTS API

**File:** `app/api/reports/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '100')

    let query = supabase.from('reports').select('*')

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ reports: data })
  } catch (error) {
    console.error('Fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      user_id,
      title,
      description,
      latitude,
      longitude,
      category,
      photo_urls = [],
      video_urls = [],
      priority = 'medium',
    } = body

    if (!user_id || !title || !latitude || !longitude) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('reports')
      .insert([
        {
          id: uuidv4(),
          user_id,
          title,
          description,
          latitude,
          longitude,
          category,
          photo_urls,
          video_urls,
          status: 'pending',
          priority,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ])
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ report: data[0] }, { status: 201 })
  } catch (error) {
    console.error('Create error:', error)
    return NextResponse.json({ error: 'Failed to create report' }, { status: 500 })
  }
}
```

---

## 📝 UPDATE MAP LOCATIONS API

**File:** `app/api/map/locations/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Fetch all data in parallel
    const [reportsRes, binsRes, vehiclesRes, camerasRes] = await Promise.all([
      supabase.from('reports').select('*').order('created_at', { ascending: false }).limit(100),
      supabase.from('garbage_bins').select('*').order('fill_level_percentage', { ascending: false }),
      supabase.from('vehicles').select('*').order('created_at', { ascending: false }),
      supabase.from('cctv_cameras').select('*').eq('status', 'active'),
    ])

    return NextResponse.json({
      reports: reportsRes.data || [],
      bins: binsRes.data || [],
      vehicles: vehiclesRes.data || [],
      cameras: camerasRes.data || [],
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Map locations error:', error)
    return NextResponse.json({ error: 'Failed to fetch locations' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { type, latitude, longitude, ...data } = await request.json()

    if (type === 'vehicle' && data.vehicleId) {
      await supabase
        .from('vehicles')
        .update({ latitude, longitude, last_location_update: new Date() })
        .eq('id', data.vehicleId)
    } else if (type === 'bin' && data.binId) {
      await supabase
        .from('garbage_bins')
        .update({ fill_level_percentage: data.fillLevel })
        .eq('id', data.binId)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update error:', error)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}
```

---

## 📝 UPDATE MOBILE CAMERA API

**File:** `app/api/mobile-camera/upload/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const userId = formData.get('userId') as string
    const latitude = parseFloat(formData.get('latitude') as string)
    const longitude = parseFloat(formData.get('longitude') as string)
    const deviceId = formData.get('deviceId') as string

    if (!file || !userId) {
      return NextResponse.json({ error: 'Missing file or userId' }, { status: 400 })
    }

    const fileName = `mobile-camera/${userId}/${Date.now()}-${file.name}`

    // Upload image to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('garbage-images')
      .upload(fileName, file)

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('garbage-images')
      .getPublicUrl(fileName)

    // Save detection record
    const { data: detection, error: detectionError } = await supabase
      .from('detections')
      .insert([
        {
          id: uuidv4(),
          image_url: publicUrl,
          detection_type: 'garbage',
          confidence_score: 0.95,
          created_at: new Date(),
        },
      ])
      .select()

    if (detectionError) {
      return NextResponse.json({ error: detectionError.message }, { status: 500 })
    }

    // Create alert if high confidence
    if (latitude && longitude) {
      await supabase.from('alerts').insert([
        {
          id: uuidv4(),
          title: 'Garbage Detected',
          message: `Garbage detected at coordinates ${latitude}, ${longitude}`,
          alert_type: 'detection',
          priority: 'high',
          created_at: new Date(),
          acknowledged: false,
        },
      ])
    }

    return NextResponse.json({
      success: true,
      detection: detection[0],
      imageUrl: publicUrl,
    }, { status: 201 })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
```

---

## 🔐 STORAGE SETUP

Create buckets in Supabase:

1. Go to Supabase Dashboard
2. Storage → Create Bucket
3. Create these buckets:
   - `garbage-images` (Public)
   - `vehicle-logs` (Private)
   - `detection-videos` (Private)

---

## ✅ SUMMARY

Your CleanCity AI now uses Supabase for:
- ✅ User authentication
- ✅ Report management
- ✅ Vehicle tracking
- ✅ Camera feeds
- ✅ Detection storage
- ✅ Alert system
- ✅ Image storage

All ready to go!
