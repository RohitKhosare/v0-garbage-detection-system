'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const redirectToRoleDashboard = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/login')
          return
        }

        // Get user's role from auth metadata
        const userRole = user.user_metadata?.role || 'citizen'

        // Route based on role
        if (userRole === 'municipal') {
          router.push('/dashboard-municipal')
        } else if (userRole === 'collector') {
          router.push('/dashboard-collector')
        } else {
          // Default to citizen dashboard
          router.push('/dashboard-citizen')
        }
      } catch (error) {
        console.error('[v0] Error redirecting:', error)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    redirectToRoleDashboard()
  }, [mounted, router, supabase])

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-800">CleanCity AI</h1>
          <p className="text-gray-600">Loading your dashboard...</p>
          <div className="animate-pulse">
            <p className="text-gray-500 text-sm">Redirecting based on your role...</p>
          </div>
        </div>
      </div>
    )
  }

  return null
}
