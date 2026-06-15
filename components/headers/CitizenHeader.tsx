'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { FileText, MapPin, Home, Camera, LogOut } from 'lucide-react'

interface CitizenHeaderProps {
  userEmail?: string
  onLogout: () => void
}

export default function CitizenHeader({ userEmail, onLogout }: CitizenHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-gradient-blue shadow-blue-lg border-b border-blue-sky/30">
      <div className="max-w-7xl mx-auto px-6 py-5">
        {/* Top section: Logo and User */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md">
              <MapPin className="w-6 h-6 text-blue-mid" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">CleanCity AI</h1>
              <p className="text-sm text-blue-sky font-medium">Citizen Reporter</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-white text-sm font-medium">{userEmail}</span>
              <span className="text-blue-sky text-xs">Active</span>
            </div>
            <button 
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex gap-1 mt-4 flex-wrap">
          <Link href="/dashboard-citizen">
            <Button variant="ghost" className="text-white hover:bg-white/20 font-medium transition-all duration-200">
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </Link>
          <Link href="/report">
            <Button variant="ghost" className="text-white hover:bg-white/20 font-medium transition-all duration-200">
              <FileText className="w-4 h-4 mr-2" />
              Report Garbage
            </Button>
          </Link>
          <Link href="/map">
            <Button variant="ghost" className="text-white hover:bg-white/20 font-medium transition-all duration-200">
              <MapPin className="w-4 h-4 mr-2" />
              View Map
            </Button>
          </Link>
          <Link href="/cctv">
            <Button variant="ghost" className="text-white hover:bg-white/20 font-medium transition-all duration-200">
              <Camera className="w-4 h-4 mr-2" />
              CCTV Feeds
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}
