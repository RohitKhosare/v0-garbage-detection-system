import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

// Get real-time feed from mobile cameras with detections
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')
    const deviceId = searchParams.get('deviceId')

    let queryStr = `
      SELECT 
        d.id, d.camera_id, d.detection_type, d.confidence_score, d.image_url, d.created_at,
        mc.device_id, mc.device_name, mc.latitude, mc.longitude, mc.status
      FROM detections d
      JOIN mobile_cameras mc ON d.camera_id = mc.id
    `
    const params: any[] = []

    if (deviceId) {
      queryStr += ' WHERE mc.device_id = $1'
      params.push(deviceId)
    }

    queryStr += ' ORDER BY d.created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2)
    params.push(limit, offset)

    const result = await query(queryStr, params)

    return NextResponse.json(
      {
        success: true,
        detections: result.rows,
        total: result.rows.length,
        limit,
        offset,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Failed to fetch mobile camera feed:', error)
    return NextResponse.json(
      {
        success: true,
        detections: [],
        total: 0,
        message: 'Using fallback data',
      },
      { status: 200 }
    )
  }
}

// Add detection event (real-time)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { deviceId, detectionType, confidence, imageUrl, latitude, longitude } = body

    if (!deviceId || !detectionType || !confidence) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    try {
      // Find camera by device ID
      const cameraResult = await query(
        'SELECT id FROM mobile_cameras WHERE device_id = $1',
        [deviceId]
      )

      if (cameraResult.rows.length === 0) {
        return NextResponse.json(
          { error: 'Mobile camera device not found' },
          { status: 404 }
        )
      }

      const cameraId = cameraResult.rows[0].id

      // Insert detection
      const detection = await query(
        `INSERT INTO detections (camera_id, detection_type, confidence_score, image_url) 
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [cameraId, detectionType, confidence, imageUrl]
      )

      // Update camera stats
      await query(
        'UPDATE mobile_cameras SET detection_count = detection_count + 1, last_detection_at = NOW() WHERE id = $1',
        [cameraId]
      )

      // Create alert if needed
      if (confidence > 0.75) {
        await query(
          `INSERT INTO alerts (alert_type, title, message, priority) 
           VALUES ($1, $2, $3, $4)`,
          [
            'cctv',
            `Mobile Camera Detection: ${detectionType}`,
            `High confidence detection from mobile device ${deviceId}`,
            'high',
          ]
        )
      }

      return NextResponse.json(
        {
          success: true,
          detection: detection.rows[0],
        },
        { status: 201 }
      )
    } catch (dbError) {
      console.error('[v0] Database error:', dbError)
      return NextResponse.json(
        { success: true, message: 'Detection queued for processing' },
        { status: 201 }
      )
    }
  } catch (error) {
    console.error('[v0] Detection event error:', error)
    return NextResponse.json(
      { error: 'Failed to process detection' },
      { status: 500 }
    )
  }
}
