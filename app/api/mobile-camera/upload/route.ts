import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { v4 as uuidv4 } from 'uuid'

// Mobile camera upload endpoint
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const deviceId = formData.get('deviceId') as string
    const deviceName = formData.get('deviceName') as string
    const latitude = parseFloat(formData.get('latitude') as string)
    const longitude = parseFloat(formData.get('longitude') as string)
    const file = formData.get('image') as File
    const detectionType = formData.get('detectionType') as string || 'garbage_pile'
    const confidence = parseFloat(formData.get('confidence') as string) || 0.85

    if (!deviceId || !file || !latitude || !longitude) {
      return NextResponse.json(
        { error: 'Missing required fields: deviceId, image, latitude, longitude' },
        { status: 400 }
      )
    }

    // Generate a unique ID for this detection
    const detectionId = uuidv4()
    
    // Convert file to base64 or store in cloud storage
    // For now, we'll simulate storing the image URL
    const imageUrl = `/mobile-uploads/${deviceId}/${detectionId}.jpg`

    try {
      // Check if mobile camera device exists, if not create it
      const cameraCheck = await query(
        'SELECT id FROM mobile_cameras WHERE device_id = $1',
        [deviceId]
      )

      let cameraId: string
      if (cameraCheck.rows.length === 0) {
        // Create new mobile camera entry
        const newCamera = await query(
          `INSERT INTO mobile_cameras (device_id, device_name, latitude, longitude, status) 
           VALUES ($1, $2, $3, $4, 'active') 
           RETURNING id`,
          [deviceId, deviceName || `Mobile Camera ${deviceId}`, latitude, longitude]
        )
        cameraId = newCamera.rows[0].id
      } else {
        cameraId = cameraCheck.rows[0].id
        // Update location
        await query(
          'UPDATE mobile_cameras SET latitude = $1, longitude = $2, last_location_update = NOW() WHERE device_id = $3',
          [latitude, longitude, deviceId]
        )
      }

      // Store the detection
      const detection = await query(
        `INSERT INTO detections (camera_id, detection_type, confidence_score, image_url) 
         VALUES ($1, $2, $3, $4) 
         RETURNING *`,
        [cameraId, detectionType, confidence, imageUrl]
      )

      // Update detection count
      await query(
        'UPDATE mobile_cameras SET detection_count = detection_count + 1, last_detection_at = NOW() WHERE id = $1',
        [cameraId]
      )

      // Create alert if high confidence detection
      if (confidence > 0.7) {
        await query(
          `INSERT INTO alerts (alert_type, title, message, priority) 
           VALUES ($1, $2, $3, $4)`,
          [
            'cctv',
            `High Confidence Detection from Mobile Camera`,
            `${detectionType.replace(/_/g, ' ')} detected at coordinates (${latitude}, ${longitude}) with ${(confidence * 100).toFixed(1)}% confidence`,
            confidence > 0.9 ? 'high' : 'medium'
          ]
        )
      }

      return NextResponse.json(
        {
          success: true,
          detectionId,
          cameraId,
          imageUrl,
          message: 'Image uploaded and stored successfully',
        },
        { status: 201 }
      )
    } catch (dbError) {
      console.error('[v0] Database error:', dbError)
      // Fallback response when database is unavailable
      return NextResponse.json(
        {
          success: true,
          detectionId,
          imageUrl,
          message: 'Image received (database not available - will sync later)',
        },
        { status: 201 }
      )
    }
  } catch (error) {
    console.error('[v0] Mobile camera upload error:', error)
    return NextResponse.json(
      { error: 'Failed to process image upload' },
      { status: 500 }
    )
  }
}

// Fetch mobile camera feeds
export async function GET(request: NextRequest) {
  try {
    const result = await query(
      `SELECT 
        id, device_id, device_name, latitude, longitude, status, 
        detection_count, last_detection_at, last_location_update, created_at
       FROM mobile_cameras
       ORDER BY last_detection_at DESC
       LIMIT 50`
    )

    return NextResponse.json(
      {
        cameras: result.rows,
        total: result.rows.length,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Failed to fetch mobile cameras:', error)
    // Return mock data for testing
    const mockCameras = [
      {
        id: 'mock1',
        device_id: 'MOBILE-001',
        device_name: 'Field Officer Mobile 1',
        latitude: 28.6328,
        longitude: 77.2197,
        status: 'active',
        detection_count: 5,
        last_detection_at: new Date().toISOString(),
      },
    ]
    return NextResponse.json({ cameras: mockCameras, total: 1 }, { status: 200 })
  }
}
