import { type NextRequest, NextResponse } from "next/server"
import { database } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const vehicle = database.vehicles.get(id)

    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 })
    }

    return NextResponse.json(vehicle, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch vehicle" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const vehicle = database.vehicles.get(id)

    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 })
    }

    const updated = { ...vehicle, ...body }
    database.vehicles.set(id, updated)

    return NextResponse.json(updated, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update vehicle" }, { status: 500 })
  }
}
