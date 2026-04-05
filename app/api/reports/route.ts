import { type NextRequest, NextResponse } from "next/server"
import { database, type Report } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const reports = Array.from(database.reports.values()).sort(
      (a: Report, b: Report) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    return NextResponse.json(reports, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, title, description, latitude, longitude, category, photos } = body

    if (!userId || !title || !latitude || !longitude) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const reportId = `report_${Date.now()}`
    const report: Report = {
      id: reportId,
      userId,
      title,
      description,
      latitude,
      longitude,
      category: category || "general",
      photos: photos || [],
      status: "pending",
      priority: "medium",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    database.reports.set(reportId, report)

    // Create alert for new report
    const alertId = `alert_${Date.now()}`
    database.alerts.set(alertId, {
      id: alertId,
      type: "report",
      title: "New Garbage Report",
      message: `New report: ${title}`,
      priority: "high",
      createdAt: new Date(),
      acknowledged: false,
    })

    return NextResponse.json(report, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create report" }, { status: 500 })
  }
}
