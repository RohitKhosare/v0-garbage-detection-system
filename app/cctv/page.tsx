"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const dynamic = 'force-dynamic'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Camera,
  MapPin,
  AlertTriangle,
  Search,
  Maximize2,
  Play,
  RotateCcw,
  Settings,
  Eye,
  Zap,
  Activity,
} from "lucide-react"
import Image from "next/image"

interface CCTVCamera {
  id: string
  name: string
  location: string
  coordinates: { lat: number; lng: number }
  status: "online" | "offline" | "maintenance"
  lastSnapshot: string
  aiEnabled: boolean
  detectionCount: number
  lastDetection?: string
  zone: string
}

interface Detection {
  id: string
  cameraId: string
  cameraName: string
  timestamp: string
  confidence: number
  type: "garbage_pile" | "illegal_dumping" | "overflowing_bin"
  location: string
  image: string
  status: "new" | "reviewed" | "reported"
  description: string
}

const mockCameras: CCTVCamera[] = [
  {
    id: "CC-001",
    name: "Park Avenue Entrance",
    location: "Park Avenue & 5th Street",
    coordinates: { lat: 40.7589, lng: -73.9851 },
    status: "online",
    lastSnapshot: "2024-01-15T12:30:00Z",
    aiEnabled: true,
    detectionCount: 3,
    lastDetection: "2024-01-15T11:45:00Z",
    zone: "Parks & Recreation",
  },
  {
    id: "CC-012",
    name: "Main Street Commercial",
    location: "Main Street Commercial District",
    coordinates: { lat: 40.7505, lng: -73.9934 },
    status: "online",
    lastSnapshot: "2024-01-15T12:29:00Z",
    aiEnabled: true,
    detectionCount: 7,
    lastDetection: "2024-01-15T10:20:00Z",
    zone: "Commercial",
  },
  {
    id: "CC-025",
    name: "Industrial Zone East",
    location: "Industrial Zone East Entrance",
    coordinates: { lat: 40.7282, lng: -74.0776 },
    status: "online",
    lastSnapshot: "2024-01-15T12:28:00Z",
    aiEnabled: true,
    detectionCount: 12,
    lastDetection: "2024-01-15T09:15:00Z",
    zone: "Industrial",
  },
  {
    id: "CC-008",
    name: "Riverside Park Trail",
    location: "Riverside Park Main Trail",
    coordinates: { lat: 40.7829, lng: -73.9654 },
    status: "offline",
    lastSnapshot: "2024-01-15T08:45:00Z",
    aiEnabled: false,
    detectionCount: 1,
    zone: "Parks & Recreation",
  },
]

const mockDetections: Detection[] = [
  {
    id: "DET-001",
    cameraId: "CC-012",
    cameraName: "Main Street Commercial",
    timestamp: "2024-01-15T10:20:00Z",
    confidence: 0.94,
    type: "illegal_dumping",
    location: "Main Street Commercial District",
    image: "/placeholder.svg?key=detection1",
    status: "new",
    description: "Large commercial waste bags detected in unauthorized area",
  },
  {
    id: "DET-002",
    cameraId: "CC-001",
    cameraName: "Park Avenue Entrance",
    timestamp: "2024-01-15T11:45:00Z",
    confidence: 0.87,
    type: "garbage_pile",
    location: "Park Avenue & 5th Street",
    image: "/placeholder.svg?key=detection2",
    status: "reviewed",
    description: "Household waste pile detected near park entrance",
  },
  {
    id: "DET-003",
    cameraId: "CC-025",
    cameraName: "Industrial Zone East",
    timestamp: "2024-01-15T09:15:00Z",
    confidence: 0.91,
    type: "overflowing_bin",
    location: "Industrial Zone East Entrance",
    image: "/placeholder.svg?key=detection3",
    status: "reported",
    description: "Industrial waste bin overflowing onto street",
  },
]

export default function CCTVPage() {
  const [mounted, setMounted] = useState(false)
  const [cameras, setCameras] = useState<CCTVCamera[]>(mockCameras)
  const [detections, setDetections] = useState<Detection[]>(mockDetections)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [zoneFilter, setZoneFilter] = useState<string>("all")
  const [selectedCamera, setSelectedCamera] = useState<CCTVCamera | null>(null)
  const [isLiveView, setIsLiveView] = useState(false)

  // Mount guard
  useEffect(() => {
    setMounted(true)
  }, [])

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCameras((prev) =>
        prev.map((camera) => ({
          ...camera,
          lastSnapshot: new Date().toISOString(),
        })),
      )
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const filteredCameras = cameras.filter((camera) => {
    const matchesSearch =
      camera.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      camera.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      camera.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || camera.status === statusFilter
    const matchesZone = zoneFilter === "all" || camera.zone === zoneFilter

    return matchesSearch && matchesStatus && matchesZone
  })

  const getStatusBadge = (status: CCTVCamera["status"]) => {
    switch (status) {
      case "online":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Online</Badge>
      case "offline":
        return <Badge variant="destructive">Offline</Badge>
      case "maintenance":
        return <Badge variant="secondary">Maintenance</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getDetectionTypeBadge = (type: Detection["type"]) => {
    switch (type) {
      case "garbage_pile":
        return <Badge variant="destructive">Garbage Pile</Badge>
      case "illegal_dumping":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Illegal Dumping</Badge>
      case "overflowing_bin":
        return <Badge variant="secondary">Overflowing Bin</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getDetectionStatusBadge = (status: Detection["status"]) => {
    switch (status) {
      case "new":
        return <Badge variant="destructive">New</Badge>
      case "reviewed":
        return <Badge variant="secondary">Reviewed</Badge>
      case "reported":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Reported</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const updateDetectionStatus = (detectionId: string, newStatus: Detection["status"]) => {
    setDetections((prev) =>
      prev.map((detection) => (detection.id === detectionId ? { ...detection, status: newStatus } : detection)),
    )
  }

  const onlineCameras = cameras.filter((c) => c.status === "online").length
  const totalDetections = detections.length
  const newDetections = detections.filter((d) => d.status === "new").length
  const aiEnabledCameras = cameras.filter((c) => c.aiEnabled).length

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading CCTV feeds...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">CCTV Monitoring</h1>
          <p className="text-muted-foreground">AI-powered garbage detection from live camera feeds</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Camera Settings
          </Button>
          <Button size="sm">
            <Activity className="w-4 h-4 mr-2" />
            Live Dashboard
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Online Cameras</CardTitle>
            <Camera className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{onlineCameras}</div>
            <p className="text-xs text-muted-foreground">of {cameras.length} total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Detections</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDetections}</div>
            <p className="text-xs text-muted-foreground">Total today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{newDetections}</div>
            <p className="text-xs text-muted-foreground">Needs review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Enabled</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{aiEnabledCameras}</div>
            <p className="text-xs text-muted-foreground">Active monitoring</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="cameras" className="space-y-6">
        <TabsList>
          <TabsTrigger value="cameras">Camera Feeds</TabsTrigger>
          <TabsTrigger value="detections">AI Detections ({newDetections})</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="cameras" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Camera Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search cameras by name, location, or ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={zoneFilter} onValueChange={setZoneFilter}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Zone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Zones</SelectItem>
                    <SelectItem value="Parks & Recreation">Parks & Recreation</SelectItem>
                    <SelectItem value="Commercial">Commercial</SelectItem>
                    <SelectItem value="Industrial">Industrial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Camera Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCameras.map((camera) => (
              <Card key={camera.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{camera.name}</CardTitle>
                        {getStatusBadge(camera.status)}
                      </div>
                      <CardDescription className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {camera.location}
                      </CardDescription>
                    </div>
                    <Badge variant="outline">{camera.id}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Camera Feed */}
                  <div className="relative">
                    <Image
                      src={`/placeholder_image.png?height=200&width=300&text=${camera.id}`}
                      alt={`Camera feed from ${camera.name}`}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                    <div className="absolute top-2 left-2 flex gap-2">
                      {camera.status === "online" && (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                          LIVE
                        </Badge>
                      )}
                      {camera.aiEnabled && (
                        <Badge variant="secondary">
                          <Zap className="w-3 h-3 mr-1" />
                          AI
                        </Badge>
                      )}
                    </div>
                    <div className="absolute bottom-2 right-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setSelectedCamera(camera)}
                            className="bg-black/50 hover:bg-black/70 text-white"
                          >
                            <Maximize2 className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>{camera.name}</DialogTitle>
                            <DialogDescription>{camera.location}</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="relative">
                              <Image
                                src={`/placeholder.png?height=400&width=600&text=${camera.id}`}
                                alt={`Full view of ${camera.name}`}
                                width={600}
                                height={400}
                                className="w-full h-96 object-cover rounded-lg border"
                              />
                              <div className="absolute bottom-4 left-4 flex gap-2">
                                <Button variant="secondary" size="sm">
                                  <Play className="w-4 h-4 mr-2" />
                                  Play
                                </Button>
                                <Button variant="secondary" size="sm">
                                  <RotateCcw className="w-4 h-4 mr-2" />
                                  Refresh
                                </Button>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="font-medium">Camera ID:</p>
                                <p className="text-muted-foreground">{camera.id}</p>
                              </div>
                              <div>
                                <p className="font-medium">Zone:</p>
                                <p className="text-muted-foreground">{camera.zone}</p>
                              </div>
                              <div>
                                <p className="font-medium">Last Update:</p>
                                <p className="text-muted-foreground">{formatDate(camera.lastSnapshot)}</p>
                              </div>
                              <div>
                                <p className="font-medium">Detections Today:</p>
                                <p className="text-muted-foreground">{camera.detectionCount}</p>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>

                  {/* Camera Info */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Zone:</span>
                      <Badge variant="outline">{camera.zone}</Badge>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Detections Today:</span>
                      <span className="font-medium">{camera.detectionCount}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Last Update:</span>
                      <span className="font-medium">{formatDate(camera.lastSnapshot)}</span>
                    </div>
                    {camera.lastDetection && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Last Detection:</span>
                        <span className="font-medium text-red-600">{formatDate(camera.lastDetection)}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Eye className="w-4 h-4 mr-2" />
                      View Feed
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        window.open(
                          `https://maps.google.com/maps?q=${camera.coordinates.lat},${camera.coordinates.lng}`,
                          "_blank",
                        )
                      }
                    >
                      <MapPin className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="detections" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Detection Alerts</CardTitle>
              <CardDescription>Recent garbage detections from AI-powered camera analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {detections.map((detection) => (
                  <div key={detection.id} className="flex items-start gap-4 p-4 border rounded-lg">
                    <Image
                      src={detection.image || "/placeholder.svg"}
                      alt={`Detection ${detection.id}`}
                      width={120}
                      height={80}
                      className="w-30 h-20 object-cover rounded border flex-shrink-0"
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{detection.id}</h4>
                            {getDetectionTypeBadge(detection.type)}
                            {getDetectionStatusBadge(detection.status)}
                          </div>
                          <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <Camera className="w-4 h-4" />
                            {detection.cameraName}
                          </p>
                        </div>
                        <div className="text-right text-sm">
                          <p className="font-medium">Confidence: {Math.round(detection.confidence * 100)}%</p>
                          <p className="text-muted-foreground">{formatDate(detection.timestamp)}</p>
                        </div>
                      </div>
                      <p className="text-sm">{detection.description}</p>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{detection.location}</span>
                      </div>
                      <div className="flex gap-2 pt-2">
                        {detection.status === "new" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateDetectionStatus(detection.id, "reviewed")}
                            >
                              Mark Reviewed
                            </Button>
                            <Button size="sm" onClick={() => updateDetectionStatus(detection.id, "reported")}>
                              Create Report
                            </Button>
                          </>
                        )}
                        {detection.status === "reviewed" && (
                          <Button size="sm" onClick={() => updateDetectionStatus(detection.id, "reported")}>
                            Create Report
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <MapPin className="w-4 h-4 mr-2" />
                          View Location
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Detection Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <Activity className="w-8 h-8 text-muted-foreground mx-auto" />
                    <p className="text-muted-foreground">Detection analytics chart</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Camera Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <Camera className="w-8 h-8 text-muted-foreground mx-auto" />
                    <p className="text-muted-foreground">Camera uptime analytics</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
