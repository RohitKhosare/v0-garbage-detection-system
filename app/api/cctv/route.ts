import { type NextRequest, NextResponse } from "next/server"
import { database, type CCTVCamera } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const cameras = Array.from(database.cctv.values())
    return NextResponse.json(cameras, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch CCTV cameras" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, latitude, longitude } = body

    if (!name || latitude === undefined || longitude === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const cameraId = `cctv_${Date.now()}`
    const camera: CCTVCamera = {
      id: cameraId,
      name,
      latitude,
      longitude,
      status: "active",
      detectionCount: 0,
    }

    database.cctv.set(cameraId, camera)
    return NextResponse.json(camera, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create CCTV camera" }, { status: 500 })
  }
}
