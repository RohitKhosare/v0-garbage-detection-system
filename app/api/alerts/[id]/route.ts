import { type NextRequest, NextResponse } from "next/server"
import { database } from "@/lib/db"

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const alert = database.alerts.get(id)

    if (!alert) {
      return NextResponse.json({ error: "Alert not found" }, { status: 404 })
    }

    const updated = { ...alert, ...body }
    database.alerts.set(id, updated)

    return NextResponse.json(updated, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update alert" }, { status: 500 })
  }
}
