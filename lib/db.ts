import { Pool, PoolClient } from '@neondatabase/serverless'

let pool: Pool | null = null

export function getPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set')
    }
    pool = new Pool({ connectionString })
  }
  return pool
}

export async function getClient(): Promise<PoolClient> {
  return getPool().connect()
}

export async function query(text: string, params?: any[]) {
  const client = await getClient()
  try {
    return await client.query(text, params)
  } finally {
    client.release()
  }
}

export interface User {
  id: string
  email: string
  password_hash: string
  name: string
  role: "citizen" | "officer" | "driver" | "admin"
  phone?: string
  created_at: Date
}

export interface Report {
  id: string
  user_id: string
  title: string
  description: string
  latitude: number
  longitude: number
  category: string
  photos: string[]
  videos?: string[]
  status: "pending" | "in-progress" | "resolved"
  priority: "low" | "medium" | "high"
  created_at: Date
  updated_at: Date
  assigned_to?: string
}

export interface Vehicle {
  id: string
  driver_id: string
  license_number: string
  capacity: number
  status: "idle" | "in-progress" | "full" | "maintenance"
  latitude?: number
  longitude?: number
  current_load: number
}

export interface GarbageBin {
  id: string
  latitude: number
  longitude: number
  fill_level: number
  status: "empty" | "partial" | "full"
  last_emptied: Date
  location_name: string
}

export interface Task {
  id: string
  report_id: string
  vehicle_id?: string
  driver_id?: string
  status: "pending" | "in-progress" | "completed"
  created_at: Date
  completed_at?: Date
  proof_photos?: string[]
}

export interface CCTVCamera {
  id: string
  name: string
  latitude: number
  longitude: number
  status: "active" | "inactive"
  last_detection?: Date
  detection_count: number
}

export interface Alert {
  id: string
  type: "report" | "cctv" | "task" | "system"
  title: string
  message: string
  priority: "low" | "medium" | "high"
  created_at: Date
  acknowledged: boolean
}

// Backward compatibility - export empty database object for files that expect it
export const database = {
  users: new Map(),
  reports: new Map(),
  vehicles: new Map(),
  tasks: new Map(),
  cctv: new Map(),
  alerts: new Map(),
}
