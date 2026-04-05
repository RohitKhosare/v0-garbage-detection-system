import { type NextRequest, NextResponse } from "next/server"
import { database, type Report } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const reports = Array.from(database.reports.values())
    const vehicles = Array.from(database.vehicles.values())
    const tasks = Array.from(database.tasks.values())
    const alerts = Array.from(database.alerts.values())

    const stats = {
      totalReports: reports.length,
      activeReports: reports.filter((r: Report) => r.status === "pending" || r.status === "in-progress").length,
      resolvedReports: reports.filter((r: Report) => r.status === "resolved").length,
      activeVehicles: vehicles.filter((v: any) => v.status === "in-progress").length,
      completedTasks: tasks.filter((t: any) => t.status === "completed").length,
      unacknowledgedAlerts: alerts.filter((a: any) => !a.acknowledged).length,
      averageResponseTime: calculateAverageResponseTime(reports, tasks),
      reportsByCategory: groupReportsByCategory(reports),
      hourlyReports: getHourlyReportTrend(reports),
    }

    return NextResponse.json(stats, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch statistics" }, { status: 500 })
  }
}

function calculateAverageResponseTime(reports: any[], tasks: any[]): number {
  const completedTasks = tasks.filter((t) => t.status === "completed" && t.completedAt)
  if (completedTasks.length === 0) return 0

  const times = completedTasks.map((task) => {
    const report = reports.find((r) => r.id === task.reportId)
    if (report && task.completedAt) {
      return (new Date(task.completedAt).getTime() - new Date(report.createdAt).getTime()) / (1000 * 60)
    }
    return 0
  })

  return Math.round(times.reduce((a, b) => a + b, 0) / times.length)
}

function groupReportsByCategory(reports: any[]): Record<string, number> {
  return reports.reduce(
    (acc, report) => {
      acc[report.category] = (acc[report.category] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )
}

function getHourlyReportTrend(reports: any[]): Record<number, number> {
  const trend: Record<number, number> = {}
  for (let i = 0; i < 24; i++) {
    trend[i] = 0
  }

  reports.forEach((report) => {
    const hour = new Date(report.createdAt).getHours()
    trend[hour]++
  })

  return trend
}
