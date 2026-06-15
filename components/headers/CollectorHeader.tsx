'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Navigation, CheckCircle, MapPin, Zap, Home, Phone } from 'lucide-react'

interface CollectorHeaderProps {
  userEmail?: string
  onLogout: () => void
}

export default function CollectorHeader({ userEmail, onLogout }: CollectorHeaderProps) {
  return (
    <header className="bg-gradient-to-r from-orange-50 to-orange-100 border-b-2 border-orange-300">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Logo and Title */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-orange-700">CleanCity AI</h1>
            <p className="text-sm text-orange-600 font-semibold">Garbage Collector</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-700 font-medium">{userEmail}</span>
            <Button 
              variant="default" 
              onClick={onLogout}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex gap-2 flex-wrap">
          <Link href="/dashboard-collector">
            <Button variant="ghost" className="text-orange-700 hover:bg-orange-200">
              <Home className="w-4 h-4 mr-2" />
              My Tasks
            </Button>
          </Link>
          <Link href="/map">
            <Button variant="ghost" className="text-orange-700 hover:bg-orange-200">
              <Navigation className="w-4 h-4 mr-2" />
              Route Map
            </Button>
          </Link>
          <Link href="/dashboard-collector">
            <Button variant="ghost" className="text-orange-700 hover:bg-orange-200">
              <CheckCircle className="w-4 h-4 mr-2" />
              Completed
            </Button>
          </Link>
          <Link href="/cctv">
            <Button variant="ghost" className="text-orange-700 hover:bg-orange-200">
              <Zap className="w-4 h-4 mr-2" />
              Live Feed
            </Button>
          </Link>
          <Link href="/dashboard-collector">
            <Button variant="ghost" className="text-orange-700 hover:bg-orange-200">
              <Phone className="w-4 h-4 mr-2" />
              Support
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}
