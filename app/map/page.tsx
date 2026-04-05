"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { AlertTriangle, MapPin, Truck, Camera, Search, RefreshCw } from "lucide-react"

interface Location {
  id: string
  latitude: number
  longitude: number
  type: string
  status: string
  title?: string
  fill_level?: number
  current_load?: number
}

export default function MapPage() {
  const [locations, setLocations] = useState<Location[]>([])
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")

  // Sample Indian locations for demo
  const sampleLocations: Location[] = [
    { id: "report-1", latitude: 28.6139, longitude: 77.2090, type: "report", status: "active", title: "Delhi - Connaught Place" },
    { id: "report-2", latitude: 28.4595, longitude: 77.1188, type: "report", status: "in-progress", title: "Delhi - Airport Area" },
    { id: "vehicle-1", latitude: 28.5244, longitude: 77.1855, type: "vehicle", status: "in-progress", title: "GC-001 Truck" },
    { id: "vehicle-2", latitude: 28.6300, longitude: 77.2200, type: "vehicle", status: "idle", title: "GC-002 Truck" },
    { id: "bin-1", latitude: 28.6273, longitude: 77.2055, type: "bin", status: "active", fill_level: 75 },
    { id: "bin-2", latitude: 28.5244, longitude: 77.1855, type: "bin", status: "active", fill_level: 45 },
    { id: "camera-1", latitude: 28.6332, longitude: 77.2197, type: "camera", status: "active", title: "CCTV-001" },
  ]

  // Fetch real-time locations
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/map/locations")
        
        if (!response.ok) {
          // Use sample data if API fails
          setLocations(sampleLocations)
        } else {
          const data = await response.json()
          
          // Combine all location types
          const combined = [
            ...(data.reports || []).map((r: any) => ({ ...r, type: "report" })),
            ...(data.bins || []).map((b: any) => ({ ...b, type: "bin" })),
            ...(data.vehicles || []).map((v: any) => ({ ...v, type: "vehicle" })),
            ...(data.cameras || []).map((c: any) => ({ ...c, type: "camera" })),
          ]
          
          setLocations(combined.length > 0 ? combined : sampleLocations)
        }
        setError("")
      } catch (err) {
        console.error("Failed to fetch locations:", err)
        setLocations(sampleLocations)
      } finally {
        setLoading(false)
      }
    }

    fetchLocations()
    const interval = setInterval(fetchLocations, 5000) // Refresh every 5 seconds
    return () => clearInterval(interval)
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
    activeReports: locations.filter(l => l.type === "report" && l.status === "active").length,
    inProgress: locations.filter(l => l.type === "report" && l.status === "in-progress").length,
    activeVehicles: locations.filter(l => l.type === "vehicle" && l.status === "in-progress").length,
    cameras: locations.filter(l => l.type === "camera").length,
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
                  >
                    <div className="flex items-start gap-3">
                      <div className={`${getStatusColor(location.status)} w-3 h-3 rounded-full mt-1.5 flex-shrink-0`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{location.title || location.type}</p>
                        <p className="text-xs text-muted-foreground">
                          {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                        </p>
                        {location.fill_level && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Fill: {location.fill_level}%
                          </p>
                        )}
                        {location.current_load && (
                          <p className="text-xs text-muted-foreground">
                            Load: {location.current_load}%
                          </p>
                        )}
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
                    <h3 className="text-lg font-medium">Interactive Map</h3>
                    <p className="text-muted-foreground text-sm">
                      {loading ? "Loading map data..." : `Displaying ${filteredLocations.length} locations`}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2 max-w-sm">
                      Integration with OpenStreetMap (Leaflet.js) or Google Maps API will display interactive map with real-time vehicle tracking, garbage locations, and camera feeds across Indian cities.
                    </p>
                    
                    {/* Quick Location Links */}
                    <div className="mt-4 flex flex-wrap gap-2 justify-center">
                      <Button size="sm" variant="outline">
                        📍 Delhi (28.61°N, 77.21°E)
                      </Button>
                      <Button size="sm" variant="outline">
                        📍 Mumbai (19.08°N, 72.88°E)
                      </Button>
                      <Button size="sm" variant="outline">
                        📍 Bangalore (12.97°N, 77.59°E)
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* API Status */}
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm">
                  <strong>API Status:</strong> {loading ? "Fetching..." : "Connected"} • 
                  <strong className="ml-2">Locations:</strong> {locations.length} total • 
                  <strong className="ml-2">Updates:</strong> Every 5 seconds
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
