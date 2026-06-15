'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { BarChart3, Truck, AlertTriangle, MapPin, Home, Users } from 'lucide-react'

interface MunicipalHeaderProps {
  userEmail?: string
  onLogout: () => void
}

export default function MunicipalHeader({ userEmail, onLogout }: MunicipalHeaderProps) {
  return (
    <header className="bg-gradient-to-r from-blue-50 to-blue-100 border-b-2 border-blue-300">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Logo and Title */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-blue-700">CleanCity AI</h1>
            <p className="text-sm text-blue-600 font-semibold">Municipal Coordinator</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-700 font-medium">{userEmail}</span>
            <Button 
              variant="default" 
              onClick={onLogout}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex gap-2 flex-wrap">
          <Link href="/dashboard-municipal">
            <Button variant="ghost" className="text-blue-700 hover:bg-blue-200">
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </Link>
          <Link href="/map">
            <Button variant="ghost" className="text-blue-700 hover:bg-blue-200">
              <MapPin className="w-4 h-4 mr-2" />
              City Map
            </Button>
          </Link>
          <Link href="/cctv">
            <Button variant="ghost" className="text-blue-700 hover:bg-blue-200">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Alerts & CCTV
            </Button>
          </Link>
          <Link href="/dashboard-municipal">
            <Button variant="ghost" className="text-blue-700 hover:bg-blue-200">
              <Truck className="w-4 h-4 mr-2" />
              Vehicles
            </Button>
          </Link>
          <Link href="/dashboard-municipal">
            <Button variant="ghost" className="text-blue-700 hover:bg-blue-200">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </Button>
          </Link>
          <Link href="/dashboard-municipal">
            <Button variant="ghost" className="text-blue-700 hover:bg-blue-200">
              <Users className="w-4 h-4 mr-2" />
              Team
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}
