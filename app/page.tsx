import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Camera, FileText, BarChart3, Truck, AlertTriangle, CheckCircle, Clock, Users } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-balance">
            AI-Powered Garbage Detection
            <span className="text-primary block">for Smart Cities</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Revolutionizing waste management through intelligent CCTV monitoring, citizen reporting, and real-time
            municipal coordination.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/report">
            <Button size="lg" className="w-full sm:w-auto">
              <FileText className="w-5 h-5 mr-2" />
              Report Garbage
            </Button>
          </Link>
          <Link href="/map">
            <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
              <MapPin className="w-5 h-5 mr-2" />
              View Live Map
            </Button>
          </Link>
        </div>
      </section>

      {/* Live Status Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Reports</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">+3 from last hour</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">+12% from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Vehicles</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Currently deployed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4h</div>
            <p className="text-xs text-muted-foreground">-15min from last week</p>
          </CardContent>
        </Card>
      </section>

      {/* Features Grid */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Comprehensive Waste Management</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our AI-powered system combines multiple data sources to provide real-time insights and efficient waste
            collection coordination.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Camera className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>CCTV Integration</CardTitle>
              <CardDescription>
                AI-powered analysis of live camera feeds to automatically detect garbage accumulation and illegal
                dumping.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/cctv">
                <Button variant="outline" size="sm">
                  View Live Feeds
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Citizen Reporting</CardTitle>
              <CardDescription>
                Easy-to-use interface for citizens to report garbage issues with photo evidence and GPS location
                tracking.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/report">
                <Button variant="outline" size="sm">
                  Submit Report
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Live Tracking</CardTitle>
              <CardDescription>
                Real-time map showing garbage locations, collection vehicle positions, and cleanup progress across the
                city.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/map">
                <Button variant="outline" size="sm">
                  Open Map
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Municipal Dashboard</CardTitle>
              <CardDescription>
                Comprehensive analytics and management tools for municipal officers to coordinate cleanup operations
                efficiently.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/municipal">
                <Button variant="outline" size="sm">
                  Access Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Truck className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Vehicle Management</CardTitle>
              <CardDescription>
                Task assignment and tracking system for garbage collection vehicles with route optimization and proof of
                completion.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/vehicles">
                <Button variant="outline" size="sm">
                  Track Vehicles
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Smart Alerts</CardTitle>
              <CardDescription>
                Automated notification system that alerts relevant authorities when garbage is detected or reported in
                the city.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary">Real-time</Badge>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold">Recent Activity</h2>
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New garbage report submitted</p>
                  <p className="text-xs text-muted-foreground">Park Avenue & 5th Street - 2 minutes ago</p>
                </div>
                <Badge variant="outline">Pending</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Cleanup completed</p>
                  <p className="text-xs text-muted-foreground">
                    Main Street dumpsite - Vehicle #GC-003 - 15 minutes ago
                  </p>
                </div>
                <Badge variant="secondary">Resolved</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">CCTV detection alert</p>
                  <p className="text-xs text-muted-foreground">
                    Camera #CC-012 detected illegal dumping - 32 minutes ago
                  </p>
                </div>
                <Badge variant="outline">In Progress</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
