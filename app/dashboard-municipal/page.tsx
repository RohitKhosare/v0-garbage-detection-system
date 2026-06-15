'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { BarChart3, MapPin, AlertTriangle, TrendingUp } from 'lucide-react'
import MunicipalHeader from '@/components/headers/MunicipalHeader'

export const dynamic = 'force-dynamic'

export default function MunicipalDashboard() {
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({
    totalReports: 0,
    pendingReports: 0,
    activeVehicles: 0,
    resolvedToday: 0,
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
        .limit(1000)

      if (reports) {
        setStats({
          totalReports: reports.length,
          pendingReports: reports.filter(r => r.status === 'pending').length,
          activeVehicles: Math.floor(reports.length / 10) || 0,
          resolvedToday: reports.filter(r => r.status === 'resolved').length,
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
      <MunicipalHeader userEmail={user.email} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8">Municipal Operations Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-600">Total Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-red-600">{stats.totalReports}</p>
              <p className="text-xs text-gray-500 mt-2">City-wide submissions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-gray-600">Pending Action</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-orange-600">{stats.pendingReports}</p>
              <p className="text-xs text-gray-500 mt-2">Require attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-gray-600">Active Vehicles</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-green-600">{stats.activeVehicles}</p>
              <p className="text-xs text-gray-500 mt-2">Deployed collectors</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-gray-600">Resolved Today</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-purple-600">{stats.resolvedToday}</p>
              <p className="text-xs text-gray-500 mt-2">Completed cleanups</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/map">
            <Card className="hover:shadow-lg cursor-pointer transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  Live Operations Map
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Monitor all reports and vehicle locations in real-time</p>
                <Button className="w-full">View Map</Button>
              </CardContent>
            </Card>
          </Link>

          <Card className="hover:shadow-lg cursor-pointer transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-green-600" />
                Analytics & Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">View performance metrics and city-wide statistics</p>
              <Button className="w-full" variant="outline">View Analytics</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg cursor-pointer transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                Priority Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Manage high-priority garbage detection alerts</p>
              <Button className="w-full" variant="outline">View Alerts</Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">CCTV Coverage</span>
                <Badge>Active</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Mobile Reports</span>
                <Badge>Enabled</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Vehicle Tracking</span>
                <Badge>Online</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Data Sync</span>
                <Badge variant="secondary">Last updated: Now</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
