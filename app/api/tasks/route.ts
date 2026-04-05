import { type NextRequest, NextResponse } from "next/server"
import { database, type Task } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const driverId = searchParams.get("driverId")

    let tasks = Array.from(database.tasks.values())

    if (driverId) {
      tasks = tasks.filter((task: Task) => task.driverId === driverId)
    }

    return NextResponse.json(tasks, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { reportId, vehicleId, driverId } = body

    if (!reportId) {
      return NextResponse.json({ error: "Missing reportId" }, { status: 400 })
    }

    const taskId = `task_${Date.now()}`
    const task: Task = {
      id: taskId,
      reportId,
      vehicleId,
      driverId,
      status: "pending",
      createdAt: new Date(),
    }

    database.tasks.set(taskId, task)
    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 })
  }
}
