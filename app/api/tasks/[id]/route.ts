import { type NextRequest, NextResponse } from "next/server"
import { database } from "@/lib/db"

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const task = database.tasks.get(id)

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    const updated = { ...task, ...body }
    if (body.status === "completed") {
      updated.completedAt = new Date()
    }

    database.tasks.set(id, updated)
    return NextResponse.json(updated, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 })
  }
}
