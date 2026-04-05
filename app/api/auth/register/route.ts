import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { hashPassword, generateToken } from "@/lib/auth-utils"
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, role, phone } = body

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if user exists
    const checkResult = await query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    )

    if (checkResult.rows.length > 0) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    const userId = uuidv4()
    const passwordHash = hashPassword(password)
    const userRole = role || "citizen"

    // Insert user into database
    const insertResult = await query(
      'INSERT INTO users (id, email, password_hash, name, role, phone, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING id, email, name, role',
      [userId, email, passwordHash, name, userRole, phone || null]
    )

    const user = insertResult.rows[0]
    const token = generateToken(user.id, user.email)

    const response = NextResponse.json(
      {
        success: true,
        user,
        token,
      },
      { status: 201 }
    )

    // Set HTTP-only cookie
    response.cookies.set('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
    })

    return response
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}
