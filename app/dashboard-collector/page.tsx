'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { MapPin, CheckCircle, Navigation, Zap } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function CollectorDashboard() {
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({
    assignedTasks: 0,
    completedToday: 0,
    inProgress: 0,
    efficiency: 0,
  })
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
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

      const { data: reports } = await supabase
        .from('reports')
        .select('status')
        .limit(100)

      if (reports) {
        setStats({
          assignedTasks: reports.filter(r => r.status === 'pending').length,
          completedToday: reports.filter(r => r.status === 'resolved').length,
          inProgress: reports.filter(r => r.status === 'in-progress').length,
          efficiency: 92,
        })
      }

      setLoading(false)
    }

    loadData()
  }, [mounted, router, supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Redirecting...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-orange-600">CleanCity AI</h1>
            <p className="text-sm text-gray-500">Garbage Collector</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{user.email}</span>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8">Collection Tasks Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-600">Assigned Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-orange-600">{stats.assignedTasks}</p>
              <p className="text-xs text-gray-500 mt-2">Ready for collection</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-gray-600">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-blue-600">{stats.inProgress}</p>
              <p className="text-xs text-gray-500 mt-2">Currently collecting</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-gray-600">Completed Today</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-green-600">{stats.completedToday}</p>
              <p className="text-xs text-gray-500 mt-2">Tasks finished</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-gray-600">Efficiency</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-purple-600">{stats.efficiency}%</p>
              <p className="text-xs text-gray-500 mt-2">Collection rate</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/map">
            <Card className="hover:shadow-lg cursor-pointer transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-blue-600" />
                  Active Routes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">View optimized collection routes and navigation</p>
                <Button className="w-full">View Routes</Button>
              </CardContent>
            </Card>
          </Link>

          <Card className="hover:shadow-lg cursor-pointer transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Mark Complete
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Report completed collection tasks with photos</p>
              <Button className="w-full" variant="outline">Complete Task</Button>
            </CardContent>
            </Card>

          <Link href="/cctv">
            <Card className="hover:shadow-lg cursor-pointer transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-purple-600" />
                  Priority Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Receive real-time alerts for urgent collection needs</p>
                <Button className="w-full" variant="outline">View Alerts</Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Daily Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Today's Progress</span>
                  <span className="text-gray-600">{stats.completedToday} / {stats.assignedTasks + stats.completedToday} tasks</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{
                      width: `${stats.assignedTasks + stats.completedToday > 0 ? (stats.completedToday / (stats.assignedTasks + stats.completedToday)) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
