"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, X, CheckCircle, AlertTriangle, Info, MapPin, Camera, Users, Truck } from "lucide-react"
import { cn } from "@/lib/utils"

interface AlertNotification {
  id: string
  type: "garbage_detected" | "report_submitted" | "vehicle_assigned" | "cleanup_completed" | "system_alert"
  title: string
  message: string
  timestamp: string
  priority: "low" | "medium" | "high" | "critical"
  source: "cctv" | "citizen" | "vehicle" | "system"
  location?: string
  isRead: boolean
  actionRequired?: boolean
  metadata?: {
    reportId?: string
    cameraId?: string
    vehicleId?: string
  }
}

const mockAlerts: AlertNotification[] = [
  {
    id: "ALERT-001",
    type: "garbage_detected",
    title: "AI Detection Alert",
    message: "Illegal dumping detected at Main Street Commercial District",
    timestamp: "2024-01-15T12:30:00Z",
    priority: "high",
    source: "cctv",
    location: "Main Street Commercial District",
    isRead: false,
    actionRequired: true,
    metadata: { cameraId: "CC-012" },
  },
  {
    id: "ALERT-002",
    type: "report_submitted",
    title: "New Citizen Report",
    message: "Garbage pile reported at Park Avenue & 5th Street",
    timestamp: "2024-01-15T11:45:00Z",
    priority: "medium",
    source: "citizen",
    location: "Park Avenue & 5th Street",
    isRead: false,
    actionRequired: true,
    metadata: { reportId: "RPT-001" },
  },
  {
    id: "ALERT-003",
    type: "vehicle_assigned",
    title: "Vehicle Dispatched",
    message: "Vehicle GC-001 assigned to cleanup task at Industrial Zone",
    timestamp: "2024-01-15T11:30:00Z",
    priority: "low",
    source: "system",
    location: "Industrial Zone East",
    isRead: true,
    actionRequired: false,
    metadata: { vehicleId: "GC-001" },
  },
  {
    id: "ALERT-004",
    type: "cleanup_completed",
    title: "Cleanup Completed",
    message: "Riverside Park cleanup task completed successfully",
    timestamp: "2024-01-15T11:20:00Z",
    priority: "low",
    source: "vehicle",
    location: "Riverside Park Trail",
    isRead: true,
    actionRequired: false,
    metadata: { reportId: "RPT-003", vehicleId: "GC-001" },
  },
  {
    id: "ALERT-005",
    type: "system_alert",
    title: "Camera Offline",
    message: "CCTV Camera CC-008 at Riverside Park has gone offline",
    timestamp: "2024-01-15T10:15:00Z",
    priority: "medium",
    source: "system",
    location: "Riverside Park Trail",
    isRead: false,
    actionRequired: true,
    metadata: { cameraId: "CC-008" },
  },
]

interface AlertsSystemProps {
  className?: string
}

export function AlertsSystem({ className }: AlertsSystemProps) {
  const [alerts, setAlerts] = useState<AlertNotification[]>(mockAlerts)
  const [isOpen, setIsOpen] = useState(false)

  // Simulate real-time alerts
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly add new alerts (simulation)
      if (Math.random() < 0.1) {
        // 10% chance every 30 seconds
        const newAlert: AlertNotification = {
          id: `ALERT-${Date.now()}`,
          type: "garbage_detected",
          title: "New AI Detection",
          message: "Garbage detected by AI monitoring system",
          timestamp: new Date().toISOString(),
          priority: "medium",
          source: "cctv",
          location: "Random Location",
          isRead: false,
          actionRequired: true,
        }
        setAlerts((prev) => [newAlert, ...prev])
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const markAsRead = (alertId: string) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, isRead: true } : alert)))
  }

  const dismissAlert = (alertId: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== alertId))
  }

  const getAlertIcon = (type: AlertNotification["type"], source: AlertNotification["source"]) => {
    switch (type) {
      case "garbage_detected":
        return <AlertTriangle className="w-4 h-4" />
      case "report_submitted":
        return <Users className="w-4 h-4" />
      case "vehicle_assigned":
        return <Truck className="w-4 h-4" />
      case "cleanup_completed":
        return <CheckCircle className="w-4 h-4" />
      case "system_alert":
        return source === "cctv" ? <Camera className="w-4 h-4" /> : <Info className="w-4 h-4" />
      default:
        return <Bell className="w-4 h-4" />
    }
  }

  const getPriorityColor = (priority: AlertNotification["priority"]) => {
    switch (priority) {
      case "critical":
        return "text-red-600 bg-red-50 border-red-200"
      case "high":
        return "text-red-600 bg-red-50 border-red-200"
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "low":
        return "text-blue-600 bg-blue-50 border-blue-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return date.toLocaleDateString()
  }

  const unreadCount = alerts.filter((alert) => !alert.isRead).length
  const actionRequiredCount = alerts.filter((alert) => alert.actionRequired && !alert.isRead).length

  return (
    <div className={cn("relative", className)}>
      {/* Alert Bell Button */}
      <Button variant="outline" size="sm" onClick={() => setIsOpen(!isOpen)} className="relative">
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Alerts Dropdown */}
      {isOpen && (
        <Card className="absolute right-0 top-12 w-96 max-h-96 overflow-hidden z-50 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Alerts</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <CardDescription>
              {unreadCount} unread • {actionRequiredCount} require action
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-80 overflow-y-auto">
              {alerts.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No alerts</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={cn(
                        "p-3 border-l-4 hover:bg-muted/50 cursor-pointer transition-colors",
                        !alert.isRead && "bg-muted/30",
                        getPriorityColor(alert.priority),
                      )}
                      onClick={() => markAsRead(alert.id)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2 flex-1">
                          <div className="mt-1">{getAlertIcon(alert.type, alert.source)}</div>
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-sm">{alert.title}</h4>
                              {!alert.isRead && <div className="w-2 h-2 bg-primary rounded-full"></div>}
                            </div>
                            <p className="text-xs text-muted-foreground">{alert.message}</p>
                            {alert.location && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <MapPin className="w-3 h-3" />
                                {alert.location}
                              </div>
                            )}
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">{formatDate(alert.timestamp)}</span>
                              {alert.actionRequired && (
                                <Badge variant="outline" className="text-xs">
                                  Action Required
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            dismissAlert(alert.id)
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
