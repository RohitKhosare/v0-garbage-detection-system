'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { FileText, MapPin, Home, Settings } from 'lucide-react'

interface CitizenHeaderProps {
  userEmail?: string
  onLogout: () => void
}

export default function CitizenHeader({ userEmail, onLogout }: CitizenHeaderProps) {
  return (
    <header className="bg-gradient-to-r from-green-50 to-green-100 border-b-2 border-green-300">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Logo and Title */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-green-700">CleanCity AI</h1>
            <p className="text-sm text-green-600 font-semibold">Garbage Reporter</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-700 font-medium">{userEmail}</span>
            <Button 
              variant="default" 
              onClick={onLogout}
              className="bg-green-600 hover:bg-green-700"
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex gap-2 flex-wrap">
          <Link href="/dashboard-citizen">
            <Button variant="ghost" className="text-green-700 hover:bg-green-200">
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </Link>
          <Link href="/report">
            <Button variant="ghost" className="text-green-700 hover:bg-green-200">
              <FileText className="w-4 h-4 mr-2" />
              Report Garbage
            </Button>
          </Link>
          <Link href="/map">
            <Button variant="ghost" className="text-green-700 hover:bg-green-200">
              <MapPin className="w-4 h-4 mr-2" />
              View Map
            </Button>
          </Link>
          <Link href="/cctv">
            <Button variant="ghost" className="text-green-700 hover:bg-green-200">
              <Settings className="w-4 h-4 mr-2" />
              CCTV Feeds
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}
