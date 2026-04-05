import { type NextRequest, NextResponse } from "next/server"
import { database, type Vehicle } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const vehicles = Array.from(database.vehicles.values())
    return NextResponse.json(vehicles, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch vehicles" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { driverId, licenseNumber, capacity } = body

    if (!driverId || !licenseNumber || !capacity) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const vehicleId = `vehicle_${Date.now()}`
    const vehicle: Vehicle = {
      id: vehicleId,
      driverId,
      licenseNumber,
      capacity,
      status: "idle",
      currentLoad: 0,
    }

    database.vehicles.set(vehicleId, vehicle)
    return NextResponse.json(vehicle, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create vehicle" }, { status: 500 })
  }
}
