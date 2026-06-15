'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { BarChart3, MapPin, AlertTriangle, TrendingUp, Users, Zap } from 'lucide-react'
import MunicipalHeader from '@/components/headers/MunicipalHeader'
import CityGridBackground from '@/components/3d/CityGridBackground'

export const dynamic = 'force-dynamic'

export default function MunicipalDashboard() {
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({ 
    total: 0, 
    pending: 0, 
    active: 0, 
    resolved: 0,
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
        total: 156,
        pending: 23,
        active: 12,
        resolved: 121,
        efficiency: 94
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
      <CityGridBackground />
      <MunicipalHeader userEmail={user.email} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 py-12 relative z-10">
        {/* Hero Banner */}
        <div className="mb-12 rounded-2xl overflow-hidden shadow-blue-lg">
          <div 
            className="h-64 relative bg-cover bg-center"
            style={{
              backgroundImage: 'url(/banner-city-operations.png)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-dark/70 to-transparent flex items-center">
              <div className="pl-8 text-white">
                <h1 className="text-5xl font-bold mb-2">City Operations</h1>
                <p className="text-xl text-blue-sky">Manage waste collection citywide</p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-12">
          <Card className="hover-lift bg-white border-blue-sky/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-dark">Total Reports</CardTitle>
              <BarChart3 className="h-5 w-5 text-blue-mid" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-mid">{stats.total}</div>
              <p className="text-xs text-blue-soft mt-1">This month</p>
            </CardContent>
          </Card>

          <Card className="hover-lift bg-white border-blue-sky/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-dark">Pending</CardTitle>
              <AlertTriangle className="h-5 w-5 text-blue-lighter" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-lighter">{stats.pending}</div>
              <p className="text-xs text-blue-soft mt-1">Need attention</p>
            </CardContent>
          </Card>

          <Card className="hover-lift bg-white border-blue-sky/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-dark">Active</CardTitle>
              <Zap className="h-5 w-5 text-blue-steel" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-steel">{stats.active}</div>
              <p className="text-xs text-blue-soft mt-1">Vehicles deployed</p>
            </CardContent>
          </Card>

          <Card className="hover-lift bg-white border-blue-sky/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-dark">Resolved</CardTitle>
              <TrendingUp className="h-5 w-5 text-blue-soft" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-soft">{stats.resolved}</div>
              <p className="text-xs text-blue-soft mt-1">Completed</p>
            </CardContent>
          </Card>

          <Card className="hover-lift bg-white border-blue-sky/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-dark">Efficiency</CardTitle>
              <Users className="h-5 w-5 text-blue-lighter" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-lighter">{stats.efficiency}%</div>
              <p className="text-xs text-blue-soft mt-1">On schedule</p>
            </CardContent>
          </Card>
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Link href="/map">
            <Card className="hover-lift cursor-pointer bg-white border-blue-sky/20 group min-h-48 flex items-center justify-center">
              <CardContent className="text-center py-8">
                <MapPin className="w-12 h-12 text-blue-mid mx-auto mb-4 group-hover:scale-125 transition-transform" />
                <h3 className="text-xl font-bold text-blue-dark mb-2">City Map & Tracking</h3>
                <p className="text-blue-soft">Real-time vehicle and report tracking</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/cctv">
            <Card className="hover-lift cursor-pointer bg-white border-blue-sky/20 group min-h-48 flex items-center justify-center">
              <CardContent className="text-center py-8">
                <AlertTriangle className="w-12 h-12 text-blue-mid mx-auto mb-4 group-hover:scale-125 transition-transform" />
                <h3 className="text-xl font-bold text-blue-dark mb-2">Alerts & CCTV</h3>
                <p className="text-blue-soft">Monitor critical areas with AI detection</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Critical Alerts */}
        <div>
          <h2 className="text-2xl font-bold text-blue-dark mb-6">Critical Alerts</h2>
          <div className="space-y-4">
            {[1, 2].map((item) => (
              <Card key={item} className="bg-white border-blue-sky/20 hover-lift">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse"></div>
                      <div>
                        <p className="font-medium text-blue-dark">Major garbage accumulation detected</p>
                        <p className="text-sm text-blue-soft">Downtown District - HIGH PRIORITY</p>
                      </div>
                    </div>
                    <Badge className="bg-red-100 text-red-700 hover:bg-red-100">URGENT</Badge>
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
