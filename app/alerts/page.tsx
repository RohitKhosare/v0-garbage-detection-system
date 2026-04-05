"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle, Bell } from "lucide-react"

interface Alert {
  id: string
  type: "report" | "cctv" | "task" | "system"
  title: string
  message: string
  priority: "low" | "medium" | "high"
  createdAt: string
  acknowledged: boolean
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch("/api/alerts")
        if (response.ok) {
          const data = await response.json()
          setAlerts(data)
        }
      } catch (error) {
        console.error("Failed to fetch alerts:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAlerts()
    const interval = setInterval(fetchAlerts, 15000)
    return () => clearInterval(interval)
  }, [])

  const acknowledgeAlert = async (alertId: string) => {
    try {
      const response = await fetch(`/api/alerts/${alertId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ acknowledged: true }),
      })

      if (response.ok) {
        const updated = await response.json()
        setAlerts((prev) => prev.map((a) => (a.id === alertId ? updated : a)))
      }
    } catch (error) {
      console.error("Failed to acknowledge alert:", error)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "report":
        return <AlertTriangle className="w-4 h-4" />
      case "cctv":
        return <AlertTriangle className="w-4 h-4" />
      case "task":
        return <CheckCircle className="w-4 h-4" />
      default:
        return <Bell className="w-4 h-4" />
    }
  }

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  const unacknowledgedAlerts = alerts.filter((a) => !a.acknowledged)
  const acknowledgedAlerts = alerts.filter((a) => a.acknowledged)

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Notifications & Alerts</h1>
        <p className="text-muted-foreground">Stay updated with real-time system alerts</p>
      </div>

      {/* Unacknowledged Alerts */}
      {unacknowledgedAlerts.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Active Alerts ({unacknowledgedAlerts.length})
            </CardTitle>
            <CardDescription>Actions required</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {unacknowledgedAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start justify-between p-4 bg-white rounded-lg border border-red-200"
              >
                <div className="flex gap-3 flex-1">
                  <div className="mt-1">{getIcon(alert.type)}</div>
                  <div className="flex-1">
                    <p className="font-medium">{alert.title}</p>
                    <p className="text-sm text-muted-foreground">{alert.message}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={getPriorityColor(alert.priority)}>{alert.priority}</Badge>
                      <Badge variant="outline" className="text-xs">
                        {new Date(alert.createdAt).toLocaleTimeString()}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => acknowledgeAlert(alert.id)}
                  className="ml-2 flex-shrink-0"
                >
                  Mark Done
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Acknowledged Alerts */}
      {acknowledgedAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resolved Alerts ({acknowledgedAlerts.length})</CardTitle>
            <CardDescription>Previously acknowledged alerts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 max-h-96 overflow-y-auto">
            {acknowledgedAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start justify-between p-3 border border-border rounded-lg opacity-60"
              >
                <div className="flex gap-2 flex-1">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-1">{alert.title}</p>
                    <p className="text-xs text-muted-foreground">{new Date(alert.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs ml-2 flex-shrink-0">
                  {alert.priority}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {alerts.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No alerts at this time</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
