import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// Helper functions for common operations
export async function getUser(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()
  return { data, error }
}

export async function getReports(limit = 100) {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)
  return { data, error }
}

export async function getVehicles() {
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .order('created_at', { ascending: false })
  return { data, error }
}

export async function getGarbageBins() {
  const { data, error } = await supabase
    .from('garbage_bins')
    .select('*')
    .order('fill_level_percentage', { ascending: false })
  return { data, error }
}

export async function getCCTVCameras() {
  const { data, error } = await supabase
    .from('cctv_cameras')
    .select('*')
    .eq('status', 'active')
  return { data, error }
}

export async function getDetections(cameraId?: string) {
  let query = supabase.from('detections').select('*')
  
  if (cameraId) {
    query = query.eq('camera_id', cameraId)
  }
  
  const { data, error } = await query
    .order('created_at', { ascending: false })
    .limit(50)
  
  return { data, error }
}

export async function getTasks(status?: string) {
  let query = supabase.from('tasks').select('*')
  
  if (status) {
    query = query.eq('status', status)
  }
  
  const { data, error } = await query
    .order('created_at', { ascending: false })
  
  return { data, error }
}

export async function getAlerts(limit = 20) {
  const { data, error } = await supabase
    .from('alerts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)
  return { data, error }
}
