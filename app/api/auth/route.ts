import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const body = await request.json()
  const { email, password, role } = body

  // Mock authentication - in real app, verify credentials with database
  if (email && password) {
    const user = {
      id: "USER-001",
      name: "John Smith",
      email: email,
      role: role || "municipal_officer",
      department: "Waste Management",
      permissions: ["view_reports", "manage_vehicles", "update_status"],
      lastLogin: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      user,
      token: "mock-jwt-token", // In real app, generate proper JWT
    })
  }

  return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 })
}
