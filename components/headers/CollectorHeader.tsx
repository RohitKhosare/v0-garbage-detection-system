'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Navigation, CheckCircle, MapPin, Zap, Home, Phone, LogOut } from 'lucide-react'

interface CollectorHeaderProps {
  userEmail?: string
  onLogout: () => void
}

export default function CollectorHeader({ userEmail, onLogout }: CollectorHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 shadow-lg border-b border-orange-700/30">
      <div className="max-w-7xl mx-auto px-6 py-5">
        {/* Top section: Logo and User */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md">
              <Zap className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">CleanCity AI</h1>
              <p className="text-sm text-orange-100 font-medium">Field Worker</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-white text-sm font-medium">{userEmail}</span>
              <span className="text-orange-100 text-xs">On Duty</span>
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
          <Link href="/dashboard-collector">
            <Button variant="ghost" className="text-white hover:bg-white/20 font-medium transition-all duration-200">
              <Home className="w-4 h-4 mr-2" />
              My Tasks
            </Button>
          </Link>
          <Link href="/map">
            <Button variant="ghost" className="text-white hover:bg-white/20 font-medium transition-all duration-200">
              <Navigation className="w-4 h-4 mr-2" />
              Route Map
            </Button>
          </Link>
          <a href="#completed">
            <Button variant="ghost" className="text-white hover:bg-white/20 font-medium transition-all duration-200">
              <CheckCircle className="w-4 h-4 mr-2" />
              Completed
            </Button>
          </a>
          <Link href="/cctv">
            <Button variant="ghost" className="text-white hover:bg-white/20 font-medium transition-all duration-200">
              <Zap className="w-4 h-4 mr-2" />
              Live Feed
            </Button>
          </Link>
          <a href="#support">
            <Button variant="ghost" className="text-white hover:bg-white/20 font-medium transition-all duration-200">
              <Phone className="w-4 h-4 mr-2" />
              Support
            </Button>
          </a>
        </nav>
      </div>
    </header>
  )
}
