import { NextResponse } from "next/server"

// Mock alert data - in real app, this would come from database
const alerts = [
  {
    id: "ALERT-001",
    type: "garbage_detected",
    title: "AI Detection Alert",
    message: "Illegal dumping detected at Main Street Commercial District",
    timestamp: new Date().toISOString(),
    priority: "high",
    source: "cctv",
    location: "Main Street Commercial District",
    isRead: false,
    actionRequired: true,
  },
]

export async function GET() {
  return NextResponse.json({ alerts })
}

export async function POST(request: Request) {
  const body = await request.json()

  // In real app, save alert to database and send notifications
  const newAlert = {
    id: `ALERT-${Date.now()}`,
    ...body,
    timestamp: new Date().toISOString(),
    isRead: false,
  }

  alerts.unshift(newAlert)

  return NextResponse.json({ success: true, alert: newAlert })
}
