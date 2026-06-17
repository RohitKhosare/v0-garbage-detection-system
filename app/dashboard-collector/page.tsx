'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { MapPin, CheckCircle, Navigation, Zap, Clock, TrendingUp } from 'lucide-react'
import CollectorHeader from '@/components/headers/CollectorHeader'
import CleaningWavesBackground from '@/components/3d/CleaningWavesBackground'

export const dynamic = 'force-dynamic'

export default function CollectorDashboard() {
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({ 
    assigned: 0, 
    completed: 0, 
    inProgress: 0, 
    efficiency: 0 
  })
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)

      setStats({
        assigned: 8,
        completed: 5,
        inProgress: 2,
        efficiency: 87
      })

      setLoading(false)
    }

    loadData()
  }, [mounted, router, supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (!mounted || loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-blue-light relative overflow-hidden">
      <CleaningWavesBackground />
      <CollectorHeader userEmail={user.email} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 py-12 relative z-10">
        {/* Hero Banner */}
        <div className="mb-12 rounded-2xl overflow-hidden shadow-blue-lg">
          <div 
            className="h-64 relative bg-cover bg-center"
            style={{
              backgroundImage: 'url(/banner-field-worker.png)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-dark/70 to-transparent flex items-center">
              <div className="pl-8 text-white">
                <h1 className="text-5xl font-bold mb-2">Today&apos;s Tasks</h1>
                <p className="text-xl text-blue-sky">Keep your routes optimized and on schedule</p>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="hover-lift bg-white border-blue-sky/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-dark">Assigned</CardTitle>
              <MapPin className="h-5 w-5 text-blue-mid" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-mid">{stats.assigned}</div>
              <p className="text-xs text-blue-soft mt-1">Today&apos;s tasks</p>
            </CardContent>
          </Card>

          <Card className="hover-lift bg-white border-blue-sky/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-dark">In Progress</CardTitle>
              <Clock className="h-5 w-5 text-blue-lighter" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-lighter">{stats.inProgress}</div>
              <p className="text-xs text-blue-soft mt-1">Currently working</p>
            </CardContent>
          </Card>

          <Card className="hover-lift bg-white border-blue-sky/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-dark">Completed</CardTitle>
              <CheckCircle className="h-5 w-5 text-blue-steel" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-steel">{stats.completed}</div>
              <p className="text-xs text-blue-soft mt-1">Finished today</p>
            </CardContent>
          </Card>

          <Card className="hover-lift bg-white border-blue-sky/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-dark">Efficiency</CardTitle>
              <TrendingUp className="h-5 w-5 text-blue-lighter" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-lighter">{stats.efficiency}%</div>
              <p className="text-xs text-blue-soft mt-1">On schedule</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Link href="/map">
            <Card className="hover-lift cursor-pointer bg-white border-blue-sky/20 group min-h-48 flex items-center justify-center">
              <CardContent className="text-center py-8">
                <Navigation className="w-12 h-12 text-blue-mid mx-auto mb-4 group-hover:scale-125 transition-transform" />
                <h3 className="text-xl font-bold text-blue-dark mb-2">View Route Map</h3>
                <p className="text-blue-soft">Optimized route for today&apos;s collection</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/cctv">
            <Card className="hover-lift cursor-pointer bg-white border-blue-sky/20 group min-h-48 flex items-center justify-center">
              <CardContent className="text-center py-8">
                <Zap className="w-12 h-12 text-blue-mid mx-auto mb-4 group-hover:scale-125 transition-transform" />
                <h3 className="text-xl font-bold text-blue-dark mb-2">Live Field Feed</h3>
                <p className="text-blue-soft">Real-time updates and alerts</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Task List */}
        <div>
          <h2 className="text-2xl font-bold text-blue-dark mb-6">Today&apos;s Collection Tasks</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((task) => (
              <Card key={task} className="bg-white border-blue-sky/20 hover-lift">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-4 h-4 rounded-full ${task <= 2 ? 'bg-green-500' : 'bg-blue-mid'}`}></div>
                      <div className="flex-1">
                        <p className="font-medium text-blue-dark">Collection Zone {task}</p>
                        <p className="text-sm text-blue-soft">Downtown District - {task * 15} minutes away</p>
                      </div>
                    </div>
                    <Badge className={task <= 2 ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-blue-100 text-blue-dark hover:bg-blue-100"}>
                      {task <= 2 ? 'Completed' : 'Pending'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
