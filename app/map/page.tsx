'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { AlertTriangle, MapPin, Truck, Camera, Search, RefreshCw } from 'lucide-react'

interface Location {
  id: string
  latitude: number
  longitude: number
  type: string
  status: string
  title?: string
  fill_level?: number
  current_load?: number
  image_url?: string
  location?: string
}

interface Report {
  id: string
  location: string
  latitude: number
  longitude: number
  status: string
  image_url: string
  created_at: string
}

export default function MapPage() {
  const [user, setUser] = useState<any>(null)
  const [locations, setLocations] = useState<Location[]>([])
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const router = useRouter()
  const supabase = createClient()

  // Fetch real-time locations from Supabase
  useEffect(() => {
    const fetchLocations = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)

      try {
        setLoading(true)
        const { data: reports } = await supabase
          .from('reports')
          .select('*')
          .order('created_at', { ascending: false })

        if (reports) {
          const combined: Location[] = reports.map((r: Report) => ({
            id: r.id,
            latitude: r.latitude,
            longitude: r.longitude,
            type: 'report',
            status: r.status,
            title: r.location,
            image_url: r.image_url,
            location: r.location,
          }))

          setLocations(combined)
        }
        setError('')
      } catch (err) {
        console.error('[v0] Failed to fetch locations:', err)
        setError('Failed to fetch locations')
      } finally {
        setLoading(false)
      }
    }

    fetchLocations()

    // Subscribe to real-time updates
    const channel = supabase
      .channel('reports')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reports' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newReport = payload.new as Report
            setLocations((prev) => [
              {
                id: newReport.id,
                latitude: newReport.latitude,
                longitude: newReport.longitude,
                type: 'report',
                status: newReport.status,
                title: newReport.location,
                image_url: newReport.image_url,
                location: newReport.location,
              },
              ...prev,
            ])
          }
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [])

  // Filter locations based on search and type
  useEffect(() => {
    let filtered = locations

    if (typeFilter !== "all") {
      filtered = filtered.filter(loc => loc.type === typeFilter)
    }

    if (searchTerm) {
      filtered = filtered.filter(loc =>
        (loc.title || "").toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredLocations(filtered)
  }, [locations, searchTerm, typeFilter])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-red-500"
      case "in-progress":
        return "bg-yellow-500"
      case "resolved":
        return "bg-green-500"
      case "idle":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "report":
        return <AlertTriangle className="w-4 h-4" />
      case "vehicle":
        return <Truck className="w-4 h-4" />
      case "camera":
        return <Camera className="w-4 h-4" />
      case "bin":
        return <MapPin className="w-4 h-4" />
      default:
        return <MapPin className="w-4 h-4" />
    }
  }

  const stats = {
    activeReports: locations.filter(l => l.type === 'report' && l.status === 'pending').length,
    inProgress: locations.filter(l => l.type === 'report' && l.status === 'in-progress').length,
    activeVehicles: locations.filter(l => l.type === 'vehicle').length,
    cameras: locations.filter(l => l.type === 'camera').length,
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Live City Map</h1>
          <p className="text-muted-foreground">Real-time tracking across India</p>
        </div>
        <Button onClick={() => window.location.reload()}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Reports</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.activeReports}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <RefreshCw className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.inProgress}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Vehicles</CardTitle>
            <Truck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activeVehicles}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Cameras</CardTitle>
            <Camera className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.cameras}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Controls */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Map Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search locations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Filter Type</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                >
                  <option value="all">All Types</option>
                  <option value="report">Garbage Reports</option>
                  <option value="vehicle">Vehicles</option>
                  <option value="bin">Garbage Bins</option>
                  <option value="camera">CCTV Cameras</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Locations List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Locations ({filteredLocations.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredLocations.map((location) => (
                  <div
                    key={location.id}
                    className="p-3 border rounded-lg hover:bg-accent cursor-pointer transition"
                    onClick={() => setSelectedReport(location as unknown as Report)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`${getStatusColor(location.status)} w-3 h-3 rounded-full mt-1.5 flex-shrink-0`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{location.title || location.type}</p>
                        <p className="text-xs text-muted-foreground">
                          {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs flex-shrink-0">
                        {location.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Map Area */}
        <div className="lg:col-span-3">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Interactive Map View</CardTitle>
              <CardDescription>Locations across India - Real-time Updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted rounded-lg h-96 flex items-center justify-center border-2 border-dashed">
                <div className="text-center space-y-4">
                  <MapPin className="w-16 h-16 text-muted-foreground mx-auto" />
                  <div>
                    <h3 className="text-lg font-medium">Live Garbage Locations</h3>
                    <p className="text-muted-foreground text-sm">
                      {loading ? 'Loading map data...' : `Displaying ${filteredLocations.length} reports`}
                    </p>
                    {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
                    <p className="text-xs text-muted-foreground mt-2 max-w-sm">
                      Real-time garbage detection reports with latitude/longitude coordinates from Supabase database.
                    </p>
                  </div>
                </div>
              </div>

              {/* API Status */}
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm">
                  <strong>Supabase Status:</strong> {loading ? 'Fetching...' : 'Connected'} • 
                  <strong className="ml-2">Reports:</strong> {locations.length} total • 
                  <strong className="ml-2">Updates:</strong> Real-time
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Selected Report Details */}
          {selectedReport && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>{selectedReport.location}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    {selectedReport.image_url && (
                      <img
                        src={selectedReport.image_url}
                        alt="Report"
                        className="rounded-lg max-h-64 w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">Coordinates</p>
                      <p className="font-semibold">
                        {selectedReport.latitude.toFixed(4)}, {selectedReport.longitude.toFixed(4)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <Badge>{selectedReport.status}</Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Reported</p>
                      <p className="font-semibold">
                        {new Date(selectedReport.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
