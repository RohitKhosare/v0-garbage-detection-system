import { type NextRequest, NextResponse } from "next/server"
import { database } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const report = database.reports.get(id)

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 })
    }

    return NextResponse.json(report, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch report" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const report = database.reports.get(id)

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 })
    }

    const updated = { ...report, ...body, updatedAt: new Date() }
    database.reports.set(id, updated)

    return NextResponse.json(updated, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update report" }, { status: 500 })
  }
}
