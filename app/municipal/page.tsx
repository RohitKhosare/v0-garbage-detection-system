"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  MoreHorizontal,
  Search,
  Truck,
  Camera,
  Users,
  TrendingUp,
  Calendar,
  Eye,
  BarChart3,
} from "lucide-react"

interface Report {
  id: string
  type: "citizen" | "cctv"
  status: "reported" | "in-progress" | "cleared"
  location: string
  coordinates: { lat: number; lng: number }
  description: string
  reportedBy: string
  reportedAt: string
  assignedVehicle?: string
  priority: "low" | "medium" | "high"
  photos: string[]
}

const mockReports: Report[] = [
  {
    id: "RPT-001",
    type: "citizen",
    status: "reported",
    location: "Park Avenue & 5th Street",
    coordinates: { lat: 40.7589, lng: -73.9851 },
    description: "Large pile of household waste dumped near park entrance",
    reportedBy: "John Smith",
    reportedAt: "2024-01-15T10:30:00Z",
    priority: "high",
    photos: ["/garbage-pile.png"],
  },
  {
    id: "RPT-002",
    type: "cctv",
    status: "in-progress",
    location: "Main Street Commercial District",
    coordinates: { lat: 40.7505, lng: -73.9934 },
    description: "AI detected illegal dumping - commercial waste",
    reportedBy: "Camera CC-012",
    reportedAt: "2024-01-15T09:15:00Z",
    assignedVehicle: "GC-003",
    priority: "medium",
    photos: ["/commercial-waste.png"],
  },
  {
    id: "RPT-003",
    type: "citizen",
    status: "cleared",
    location: "Riverside Park Trail",
    coordinates: { lat: 40.7829, lng: -73.9654 },
    description: "Overflowing trash bins and scattered litter",
    reportedBy: "Maria Garcia",
    reportedAt: "2024-01-15T08:45:00Z",
    assignedVehicle: "GC-001",
    priority: "low",
    photos: ["/overflowing-bins.jpg"],
  },
  {
    id: "RPT-004",
    type: "cctv",
    status: "reported",
    location: "Industrial Zone East",
    coordinates: { lat: 40.7282, lng: -74.0776 },
    description: "Construction debris detected in unauthorized area",
    reportedBy: "Camera CC-025",
    reportedAt: "2024-01-15T07:20:00Z",
    priority: "high",
    photos: ["/construction-debris.jpg"],
  },
]

export default function MunicipalDashboard() {
  const [reports, setReports] = useState<Report[]>(mockReports)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || report.status === statusFilter
    const matchesType = typeFilter === "all" || report.type === typeFilter
    const matchesPriority = priorityFilter === "all" || report.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesType && matchesPriority
  })

  const updateReportStatus = (reportId: string, newStatus: Report["status"], vehicleId?: string) => {
    setReports((prev) =>
      prev.map((report) =>
        report.id === reportId
          ? { ...report, status: newStatus, assignedVehicle: vehicleId || report.assignedVehicle }
          : report,
      ),
    )
  }

  const getStatusBadge = (status: Report["status"]) => {
    switch (status) {
      case "reported":
        return <Badge variant="destructive">Reported</Badge>
      case "in-progress":
        return <Badge variant="secondary">In Progress</Badge>
      case "cleared":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Cleared</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getPriorityBadge = (priority: Report["priority"]) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High</Badge>
      case "medium":
        return <Badge variant="secondary">Medium</Badge>
      case "low":
        return <Badge variant="outline">Low</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getTypeBadge = (type: Report["type"]) => {
    switch (type) {
      case "citizen":
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            Citizen
          </Badge>
        )
      case "cctv":
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Camera className="w-3 h-3" />
            CCTV
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const stats = {
    total: reports.length,
    reported: reports.filter((r) => r.status === "reported").length,
    inProgress: reports.filter((r) => r.status === "in-progress").length,
    cleared: reports.filter((r) => r.status === "cleared").length,
    highPriority: reports.filter((r) => r.priority === "high").length,
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Municipal Dashboard</h1>
          <p className="text-muted-foreground">Monitor and manage garbage reports across the city</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button size="sm">
            <TrendingUp className="w-4 h-4 mr-2" />
            Analytics
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.reported}</div>
            <p className="text-xs text-muted-foreground">Needs attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground">Being handled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cleared</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.cleared}</div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.highPriority}</div>
            <p className="text-xs text-muted-foreground">Urgent cases</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="reports" className="space-y-6">
        <TabsList>
          <TabsTrigger value="reports">Reports List</TabsTrigger>
          <TabsTrigger value="heatmap">Heatmap View</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filters & Search</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search by location, description, or ID..."
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
                    <SelectItem value="reported">Reported</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="cleared">Cleared</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="citizen">Citizen</SelectItem>
                    <SelectItem value="cctv">CCTV</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Reports Table */}
          <Card>
            <CardHeader>
              <CardTitle>Reports ({filteredReports.length})</CardTitle>
              <CardDescription>Real-time garbage reports from citizens and CCTV systems</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Reported</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{report.id}</TableCell>
                        <TableCell>{getTypeBadge(report.type)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span className="max-w-48 truncate">{report.location}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(report.status)}</TableCell>
                        <TableCell>{getPriorityBadge(report.priority)}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{formatDate(report.reportedAt)}</div>
                            <div className="text-muted-foreground">{report.reportedBy}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {report.assignedVehicle ? (
                            <Badge variant="outline">{report.assignedVehicle}</Badge>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              {report.status === "reported" && (
                                <DropdownMenuItem
                                  onClick={() => updateReportStatus(report.id, "in-progress", "GC-001")}
                                >
                                  <Truck className="w-4 h-4 mr-2" />
                                  Assign Vehicle
                                </DropdownMenuItem>
                              )}
                              {report.status === "in-progress" && (
                                <DropdownMenuItem onClick={() => updateReportStatus(report.id, "cleared")}>
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Mark as Cleared
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem>
                                <MapPin className="w-4 h-4 mr-2" />
                                View on Map
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="heatmap" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Garbage Heatmap</CardTitle>
              <CardDescription>Visual representation of garbage reports across the city</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center space-y-2">
                  <MapPin className="w-12 h-12 text-muted-foreground mx-auto" />
                  <p className="text-muted-foreground">Interactive heatmap will be displayed here</p>
                  <p className="text-sm text-muted-foreground">Integration with Google Maps or OpenStreetMap</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Response Time Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <TrendingUp className="w-8 h-8 text-muted-foreground mx-auto" />
                    <p className="text-muted-foreground">Chart will be displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Reports by Area</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <BarChart3 className="w-8 h-8 text-muted-foreground mx-auto" />
                    <p className="text-muted-foreground">Chart will be displayed here</p>
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
