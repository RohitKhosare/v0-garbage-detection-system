'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { MapPin, FileText, CheckCircle, Clock } from 'lucide-react'

export default function CitizenDashboard() {
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0, inProgress: 0 })
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
        .eq('user_id', user.id)
        .limit(100)

      if (reports) {
        setStats({
          total: reports.length,
          pending: reports.filter(r => r.status === 'pending').length,
          inProgress: reports.filter(r => r.status === 'in-progress').length,
          resolved: reports.filter(r => r.status === 'resolved').length,
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
            <h1 className="text-2xl font-bold text-green-600">CleanCity AI</h1>
            <p className="text-sm text-gray-500">Garbage Reporter</p>
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
        <h2 className="text-3xl font-bold mb-8">Your Reports Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-600">Total Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-green-600">{stats.total}</p>
              <p className="text-xs text-gray-500 mt-2">All time submissions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-gray-600">Pending Review</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-yellow-600">{stats.pending}</p>
              <p className="text-xs text-gray-500 mt-2">Awaiting action</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-gray-600">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-blue-600">{stats.inProgress}</p>
              <p className="text-xs text-gray-500 mt-2">Being cleaned up</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-gray-600">Resolved</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-purple-600">{stats.resolved}</p>
              <p className="text-xs text-gray-500 mt-2">Completed cleanups</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/report">
            <Card className="hover:shadow-lg cursor-pointer transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-green-600" />
                  Submit New Report
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Report garbage locations in your area with photos and GPS</p>
                <Button className="w-full">Create Report</Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/map">
            <Card className="hover:shadow-lg cursor-pointer transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  View All Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">See live map of garbage locations and cleanup progress</p>
                <Button className="w-full" variant="outline">View Map</Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/cctv">
            <Card className="hover:shadow-lg cursor-pointer transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-600" />
                  Monitor CCTV Feeds
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">View real-time camera feeds detecting garbage</p>
                <Button className="w-full" variant="outline">View Feeds</Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Your Recent Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.total === 0 ? (
                <p className="text-gray-500 text-center py-8">No reports yet. Start by submitting your first report!</p>
              ) : (
                <p className="text-gray-600">You have {stats.total} total reports submitted to help keep the city clean.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
