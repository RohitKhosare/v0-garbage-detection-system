'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

interface Report {
  id: string
  status: string
  created_at: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0 })
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const loadData = async () => {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)

      // Fetch reports
      const { data: reports } = await supabase
        .from('reports')
        .select('status')
        .limit(100)

      if (reports) {
        setStats({
          total: reports.length,
          pending: reports.filter(r => r.status === 'pending').length,
          resolved: reports.filter(r => r.status === 'resolved').length,
        })
      }

      setLoading(false)
    }

    loadData()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) return <div className="p-8">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-600">CleanCity AI</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{user?.email}</span>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8">Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-600">Total Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-green-600">{stats.total}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-gray-600">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-yellow-600">{stats.pending}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-gray-600">Resolved</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-blue-600">{stats.resolved}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/report">
            <Card className="hover:shadow-lg cursor-pointer">
              <CardHeader>
                <CardTitle>📸 Report Garbage</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Upload images of garbage locations</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/map">
            <Card className="hover:shadow-lg cursor-pointer">
              <CardHeader>
                <CardTitle>🗺️ Live Map</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">View all reports on the map</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/cctv">
            <Card className="hover:shadow-lg cursor-pointer">
              <CardHeader>
                <CardTitle>📹 CCTV Feeds</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Monitor live camera feeds</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  )
}
