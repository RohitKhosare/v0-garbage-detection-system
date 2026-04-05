import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    // Get all garbage reports with location
    const reportsResult = await query(`
      SELECT 
        id,
        title,
        latitude,
        longitude,
        status,
        priority,
        created_at,
        'report' as type
      FROM reports
      WHERE latitude IS NOT NULL AND longitude IS NOT NULL
      ORDER BY created_at DESC
      LIMIT 100
    `)

    // Get all garbage bins with fill level
    const binsResult = await query(`
      SELECT 
        id,
        bin_name as name,
        latitude,
        longitude,
        fill_level_percentage as fill_level,
        status,
        capacity_liters,
        'bin' as type
      FROM garbage_bins
      ORDER BY fill_level_percentage DESC
    `)

    // Get all active vehicles with location
    const vehiclesResult = await query(`
      SELECT 
        id,
        latitude,
        longitude,
        status,
        current_load_liters as current_load,
        capacity_liters as capacity,
        'vehicle' as type
      FROM vehicles
      WHERE latitude IS NOT NULL AND longitude IS NOT NULL
    `)

    // Get all active CCTV cameras
    const cameraResult = await query(`
      SELECT 
        id,
        camera_name as name,
        latitude,
        longitude,
        status,
        detection_count,
        'camera' as type
      FROM cctv_cameras
      WHERE status = 'active'
    `)

    const locations = {
      reports: reportsResult.rows,
      bins: binsResult.rows,
      vehicles: vehiclesResult.rows,
      cameras: cameraResult.rows,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(locations, { status: 200 })
  } catch (error) {
    console.error('Map locations error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch locations' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { latitude, longitude, type } = body

    // Real-time update for vehicle location
    if (type === 'vehicle') {
      const { vehicleId } = body
      await query(
        'UPDATE vehicles SET latitude = $1, longitude = $2, last_location_update = NOW() WHERE id = $3',
        [latitude, longitude, vehicleId]
      )
    }

    // Real-time update for bin fill level
    if (type === 'bin') {
      const { binId, fillLevel } = body
      await query(
        'UPDATE garbage_bins SET fill_level_percentage = $1 WHERE id = $2',
        [fillLevel, binId]
      )
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Map update error:', error)
    return NextResponse.json(
      { error: 'Failed to update location' },
      { status: 500 }
    )
  }
}
