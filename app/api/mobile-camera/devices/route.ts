import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

// Get all mobile camera devices
export async function GET(request: NextRequest) {
  try {
    const result = await query(
      `SELECT id, device_id, device_name, latitude, longitude, status, 
              detection_count, last_detection_at, last_location_update, created_at
       FROM mobile_cameras
       ORDER BY created_at DESC`
    )

    return NextResponse.json(
      {
        success: true,
        devices: result.rows,
        total: result.rows.length,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Failed to fetch devices:', error)
    return NextResponse.json(
      { success: true, devices: [], total: 0, message: 'Using fallback data' },
      { status: 200 }
    )
  }
}

// Register a new mobile camera device
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { deviceId, deviceName, userId } = body

    if (!deviceId) {
      return NextResponse.json(
        { error: 'Device ID is required' },
        { status: 400 }
      )
    }

    const result = await query(
      `INSERT INTO mobile_cameras (device_id, device_name, status, user_id) 
       VALUES ($1, $2, 'active', $3)
       ON CONFLICT (device_id) DO UPDATE SET status = 'active'
       RETURNING *`,
      [deviceId, deviceName || `Mobile Device ${deviceId}`, userId || null]
    )

    return NextResponse.json(
      {
        success: true,
        device: result.rows[0],
        message: 'Device registered successfully',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[v0] Device registration error:', error)
    return NextResponse.json(
      { error: 'Failed to register device' },
      { status: 500 }
    )
  }
}
