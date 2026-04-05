import { type NextRequest, NextResponse } from "next/server"
import { database, type Alert } from "@/lib/db"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const camera = database.cctv.get(id)

    if (!camera) {
      return NextResponse.json({ error: "Camera not found" }, { status: 404 })
    }

    // Update camera
    const updated = { ...camera, lastDetection: new Date(), detectionCount: camera.detectionCount + 1 }
    database.cctv.set(id, updated)

    // Create alert
    const alertId = `alert_${Date.now()}`
    const alert: Alert = {
      id: alertId,
      type: "cctv",
      title: "Garbage Detection Alert",
      message: `Camera ${camera.name} detected garbage accumulation`,
      priority: "high",
      createdAt: new Date(),
      acknowledged: false,
    }

    database.alerts.set(alertId, alert)

    return NextResponse.json({ camera: updated, alert }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to process detection" }, { status: 500 })
  }
}
