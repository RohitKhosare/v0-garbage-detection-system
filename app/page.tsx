'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export const dynamic = 'force-dynamic'

export default function HomePage() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
      } else {
        router.push('/dashboard')
      }
    }
    checkAuth()
  }, [router, supabase])

  return (
    <div className="min-h-screen bg-gradient-blue-light flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold text-blue-dark">CleanCity AI</h1>
        <p className="text-blue-soft text-lg">Smart Garbage Detection & Reporting System</p>
        <p className="text-blue-light mt-8">Redirecting...</p>
      </div>
    </div>
  )
}

