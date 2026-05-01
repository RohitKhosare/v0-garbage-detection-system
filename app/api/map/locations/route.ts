import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get all garbage reports with location
    const { data: reports, error: reportsError } = await supabase
      .from('reports')
      .select('*')
      .not('latitude', 'is', null)
      .not('longitude', 'is', null)
      .order('created_at', { ascending: false })
      .limit(100)

    if (reportsError) throw reportsError

    // Get all garbage bins with fill level
    const { data: bins, error: binsError } = await supabase
      .from('garbage_bins')
      .select('*')
      .order('fill_level_percentage', { ascending: false })

    if (binsError) throw binsError

    // Get all active vehicles with location
    const { data: vehicles, error: vehiclesError } = await supabase
      .from('vehicles')
      .select('*')
      .not('latitude', 'is', null)
      .not('longitude', 'is', null)

    if (vehiclesError) throw vehiclesError

    // Get all active CCTV cameras
    const { data: cameras, error: camerasError } = await supabase
      .from('cctv_cameras')
      .select('*')
      .eq('status', 'active')

    if (camerasError) throw camerasError

    const locations = {
      reports: reports || [],
      bins: bins || [],
      vehicles: vehicles || [],
      cameras: cameras || [],
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(locations, { status: 200 })
  } catch (error) {
    console.error('[v0] Map locations error:', error)
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
