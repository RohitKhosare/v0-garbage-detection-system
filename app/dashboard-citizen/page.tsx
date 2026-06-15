'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { MapPin, FileText, CheckCircle, Clock, TrendingUp, Zap, Award } from 'lucide-react'
import CitizenHeader from '@/components/headers/CitizenHeader'

export const dynamic = 'force-dynamic'

export default function CitizenDashboard() {
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0, points: 0 })
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
        total: 24,
        pending: 5,
        resolved: 19,
        points: 2450
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
    <div className="min-h-screen bg-gradient-blue-light">
      <CitizenHeader userEmail={user.email} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Banner with Image */}
        <div className="mb-12 rounded-2xl overflow-hidden shadow-blue-lg">
          <div 
            className="h-64 relative bg-cover bg-center"
            style={{
              backgroundImage: 'url(/banner-garbage-detection.png)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-dark/70 to-transparent flex items-center">
              <div className="pl-8 text-white">
                <h1 className="text-5xl font-bold mb-2">Report & Track</h1>
                <p className="text-xl text-blue-sky">Help keep your city clean</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="hover-lift bg-white border-blue-sky/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-dark">Total Reports</CardTitle>
              <FileText className="h-5 w-5 text-blue-mid" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-mid">{stats.total}</div>
              <p className="text-xs text-blue-soft mt-1">All time reports</p>
            </CardContent>
          </Card>

          <Card className="hover-lift bg-white border-blue-sky/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-dark">Pending</CardTitle>
              <Clock className="h-5 w-5 text-blue-lighter" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-lighter">{stats.pending}</div>
              <p className="text-xs text-blue-soft mt-1">Awaiting action</p>
            </CardContent>
          </Card>

          <Card className="hover-lift bg-white border-blue-sky/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-dark">Resolved</CardTitle>
              <CheckCircle className="h-5 w-5 text-blue-steel" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-steel">{stats.resolved}</div>
              <p className="text-xs text-blue-soft mt-1">Completed cleanup</p>
            </CardContent>
          </Card>

          <Card className="hover-lift bg-white border-blue-sky/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-dark">Eco Points</CardTitle>
              <Award className="h-5 w-5 text-blue-lighter" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-lighter">{stats.points}</div>
              <p className="text-xs text-blue-soft mt-1">Earned this month</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Link href="/report">
            <Card className="hover-lift cursor-pointer bg-white border-blue-sky/20 group">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-blue rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-blue-dark group-hover:text-blue-mid transition-colors">Submit New Report</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-soft text-sm">Upload photos and location details for garbage you&apos;ve found</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/map">
            <Card className="hover-lift cursor-pointer bg-white border-blue-sky/20 group">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-blue rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-blue-dark group-hover:text-blue-mid transition-colors">View City Map</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-soft text-sm">See all garbage reports and cleanup progress on the map</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/cctv">
            <Card className="hover-lift cursor-pointer bg-white border-blue-sky/20 group">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-blue rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-blue-dark group-hover:text-blue-mid transition-colors">AI CCTV Feeds</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-soft text-sm">Monitor live camera feeds with AI detection</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-2xl font-bold text-blue-dark mb-6">Your Recent Reports</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <Card key={item} className="bg-white border-blue-sky/20 hover-lift">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-4 h-4 rounded-full bg-blue-mid"></div>
                      <div>
                        <p className="font-medium text-blue-dark">Garbage pile at Park Avenue</p>
                        <p className="text-sm text-blue-soft">Report #{item}</p>
                      </div>
                    </div>
                    <Badge className="bg-blue-lighter text-blue-dark hover:bg-blue-lighter">In Progress</Badge>
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
