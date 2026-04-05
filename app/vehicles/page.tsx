"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  MapPin,
  Navigation,
  Camera,
  CheckCircle,
  Clock,
  Truck,
  Route,
  X,
  AlertTriangle,
  Loader2,
  Phone,
  Calendar,
} from "lucide-react"
import Image from "next/image"

interface Task {
  id: string
  reportId: string
  location: string
  coordinates: { lat: number; lng: number }
  description: string
  priority: "low" | "medium" | "high"
  assignedAt: string
  estimatedTime: string
  status: "assigned" | "en-route" | "in-progress" | "completed"
  photos?: string[]
  completionNotes?: string
  completedAt?: string
}

interface Vehicle {
  id: string
  driver: string
  contact: string
  currentLocation: { lat: number; lng: number }
  status: "available" | "busy" | "maintenance"
}

const mockTasks: Task[] = [
  {
    id: "TASK-001",
    reportId: "RPT-001",
    location: "Park Avenue & 5th Street",
    coordinates: { lat: 40.7589, lng: -73.9851 },
    description: "Large pile of household waste dumped near park entrance",
    priority: "high",
    assignedAt: "2024-01-15T10:30:00Z",
    estimatedTime: "45 minutes",
    status: "assigned",
  },
  {
    id: "TASK-002",
    reportId: "RPT-004",
    location: "Industrial Zone East",
    coordinates: { lat: 40.7282, lng: -74.0776 },
    description: "Construction debris detected in unauthorized area",
    priority: "high",
    assignedAt: "2024-01-15T09:15:00Z",
    estimatedTime: "1.5 hours",
    status: "en-route",
  },
  {
    id: "TASK-003",
    reportId: "RPT-003",
    location: "Riverside Park Trail",
    coordinates: { lat: 40.7829, lng: -73.9654 },
    description: "Overflowing trash bins and scattered litter",
    priority: "low",
    assignedAt: "2024-01-15T08:45:00Z",
    estimatedTime: "30 minutes",
    status: "completed",
    completedAt: "2024-01-15T11:20:00Z",
    completionNotes: "All bins emptied and area cleaned. Replaced damaged bin #3.",
    photos: ["/placeholder.svg?key=completed1"],
  },
]

const mockVehicle: Vehicle = {
  id: "GC-001",
  driver: "Mike Johnson",
  contact: "+1 (555) 123-4567",
  currentLocation: { lat: 40.7505, lng: -73.9934 },
  status: "busy",
}

export default function VehicleDashboard() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [completionPhotos, setCompletionPhotos] = useState<File[]>([])
  const [completionNotes, setCompletionNotes] = useState("")
  const [isSubmittingCompletion, setIsSubmittingCompletion] = useState(false)
  const [previewUrls, setPreviewUrls] = useState<string[]>([])

  const fileInputRef = useRef<HTMLInputElement>(null)

  const updateTaskStatus = (taskId: string, newStatus: Task["status"]) => {
    setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)))
  }

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return

    const fileArray = Array.from(files)
    const validFiles = fileArray.filter((file) => file.type.startsWith("image/"))

    setCompletionPhotos((prev) => [...prev, ...validFiles])

    // Create preview URLs
    const newPreviewUrls = validFiles.map((file) => URL.createObjectURL(file))
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls])
  }

  const removePhoto = (index: number) => {
    URL.revokeObjectURL(previewUrls[index])
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index))
    setCompletionPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  const handleCompleteTask = async () => {
    if (!selectedTask) return

    setIsSubmittingCompletion(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setTasks((prev) =>
        prev.map((task) =>
          task.id === selectedTask.id
            ? {
                ...task,
                status: "completed",
                completedAt: new Date().toISOString(),
                completionNotes,
                photos: previewUrls,
              }
            : task,
        ),
      )

      // Reset form
      setCompletionPhotos([])
      setCompletionNotes("")
      setPreviewUrls([])
      setSelectedTask(null)
    } catch (error) {
      console.error("Error completing task:", error)
    } finally {
      setIsSubmittingCompletion(false)
    }
  }

  const getStatusBadge = (status: Task["status"]) => {
    switch (status) {
      case "assigned":
        return <Badge variant="outline">Assigned</Badge>
      case "en-route":
        return <Badge variant="secondary">En Route</Badge>
      case "in-progress":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">In Progress</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Completed</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getPriorityBadge = (priority: Task["priority"]) => {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const activeTasks = tasks.filter((task) => task.status !== "completed")
  const completedTasks = tasks.filter((task) => task.status === "completed")

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Vehicle Dashboard</h1>
          <p className="text-muted-foreground">Manage your assigned cleanup tasks and routes</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="flex items-center gap-2">
            <Truck className="w-4 h-4" />
            {mockVehicle.id}
          </Badge>
          <Badge variant="secondary">{mockVehicle.status}</Badge>
        </div>
      </div>

      {/* Driver Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Driver Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Truck className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">{mockVehicle.driver}</p>
                <p className="text-sm text-muted-foreground">Driver</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Phone className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">{mockVehicle.contact}</p>
                <p className="text-sm text-muted-foreground">Contact</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Calendar className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">Day Shift</p>
                <p className="text-sm text-muted-foreground">8:00 AM - 4:00 PM</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeTasks.length}</div>
            <p className="text-xs text-muted-foreground">Pending completion</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks.length}</div>
            <p className="text-xs text-muted-foreground">Tasks finished</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {activeTasks.filter((t) => t.priority === "high").length}
            </div>
            <p className="text-xs text-muted-foreground">Urgent tasks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Est. Time Left</CardTitle>
            <Route className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.5h</div>
            <p className="text-xs text-muted-foreground">Remaining work</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="active" className="space-y-6">
        <TabsList>
          <TabsTrigger value="active">Active Tasks ({activeTasks.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedTasks.length})</TabsTrigger>
          <TabsTrigger value="route">Route Optimization</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeTasks.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No Active Tasks</h3>
                  <p className="text-muted-foreground">All assigned tasks have been completed!</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            activeTasks.map((task) => (
              <Card key={task.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{task.reportId}</CardTitle>
                        {getPriorityBadge(task.priority)}
                        {getStatusBadge(task.status)}
                      </div>
                      <CardDescription className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {task.location}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col md:flex-row gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          window.open(
                            `https://maps.google.com/maps?q=${task.coordinates.lat},${task.coordinates.lng}`,
                            "_blank",
                          )
                        }
                      >
                        <Navigation className="w-4 h-4 mr-2" />
                        Navigate
                      </Button>
                      {task.status === "assigned" && (
                        <Button size="sm" onClick={() => updateTaskStatus(task.id, "en-route")}>
                          Start Route
                        </Button>
                      )}
                      {task.status === "en-route" && (
                        <Button size="sm" onClick={() => updateTaskStatus(task.id, "in-progress")}>
                          Arrive at Site
                        </Button>
                      )}
                      {task.status === "in-progress" && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" onClick={() => setSelectedTask(task)}>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Complete Task
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Complete Task: {task.reportId}</DialogTitle>
                              <DialogDescription>
                                Please provide proof of completion and any additional notes
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-6">
                              {/* Task Details */}
                              <div className="p-4 bg-muted rounded-lg">
                                <h4 className="font-medium mb-2">Task Details</h4>
                                <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                                <div className="flex items-center gap-2 text-sm">
                                  <MapPin className="w-4 h-4" />
                                  {task.location}
                                </div>
                              </div>

                              {/* Photo Upload */}
                              <div className="space-y-4">
                                <Label>Completion Photos *</Label>
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => fileInputRef.current?.click()}
                                  className="w-full flex items-center gap-2"
                                >
                                  <Camera className="w-4 h-4" />
                                  Add Photos
                                </Button>
                                <input
                                  ref={fileInputRef}
                                  type="file"
                                  accept="image/*"
                                  multiple
                                  onChange={(e) => handleFileUpload(e.target.files)}
                                  className="hidden"
                                />

                                {previewUrls.length > 0 && (
                                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {previewUrls.map((url, index) => (
                                      <div key={index} className="relative group">
                                        <Image
                                          src={url || "/placeholder.svg"}
                                          alt={`Completion photo ${index + 1}`}
                                          width={200}
                                          height={150}
                                          className="w-full h-32 object-cover rounded-lg border"
                                        />
                                        <Button
                                          type="button"
                                          variant="destructive"
                                          size="sm"
                                          onClick={() => removePhoto(index)}
                                          className="absolute top-2 right-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                          <X className="w-3 h-3" />
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Completion Notes */}
                              <div className="space-y-2">
                                <Label htmlFor="notes">Completion Notes</Label>
                                <Textarea
                                  id="notes"
                                  value={completionNotes}
                                  onChange={(e) => setCompletionNotes(e.target.value)}
                                  placeholder="Describe what was done, any issues encountered, or additional observations..."
                                  rows={4}
                                />
                              </div>

                              {/* Submit Button */}
                              <Button
                                onClick={handleCompleteTask}
                                disabled={previewUrls.length === 0 || isSubmittingCompletion}
                                className="w-full"
                                size="lg"
                              >
                                {isSubmittingCompletion ? (
                                  <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Submitting...
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Complete Task
                                  </>
                                )}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm">{task.description}</p>
                    <div className="flex flex-col md:flex-row gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Assigned: {formatDate(task.assignedAt)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Route className="w-4 h-4" />
                        Est. Time: {task.estimatedTime}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedTasks.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No Completed Tasks</h3>
                  <p className="text-muted-foreground">Completed tasks will appear here</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            completedTasks.map((task) => (
              <Card key={task.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{task.reportId}</CardTitle>
                        {getStatusBadge(task.status)}
                      </div>
                      <CardDescription className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {task.location}
                      </CardDescription>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <p>Completed: {task.completedAt && formatDate(task.completedAt)}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm">{task.description}</p>
                    {task.completionNotes && (
                      <div className="p-3 bg-muted rounded-lg">
                        <h4 className="font-medium text-sm mb-1">Completion Notes:</h4>
                        <p className="text-sm text-muted-foreground">{task.completionNotes}</p>
                      </div>
                    )}
                    {task.photos && task.photos.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Completion Photos:</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {task.photos.map((photo, index) => (
                            <Image
                              key={index}
                              src={photo || "/placeholder.svg"}
                              alt={`Completion photo ${index + 1}`}
                              width={150}
                              height={100}
                              className="w-full h-20 object-cover rounded border"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="route" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Route Optimization</CardTitle>
              <CardDescription>Optimized route for efficient task completion</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center space-y-2">
                  <Route className="w-12 h-12 text-muted-foreground mx-auto" />
                  <p className="text-muted-foreground">Route optimization map will be displayed here</p>
                  <p className="text-sm text-muted-foreground">Integration with Google Maps Directions API</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
