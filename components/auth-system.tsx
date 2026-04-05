"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { LogIn, LogOut } from "lucide-react"

interface User {
  id: string
  email: string
  name: string
  role: "citizen" | "officer" | "driver" | "admin"
  phone?: string
}

interface AuthContextType {
  currentUser: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string, role: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken")
    const storedUser = localStorage.getItem("currentUser")

    if (storedToken && storedUser) {
      setToken(storedToken)
      setCurrentUser(JSON.parse(storedUser))
    }
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error("Login failed")
      }

      const data = await response.json()
      setCurrentUser(data.user)
      setToken(data.token)

      localStorage.setItem("authToken", data.token)
      localStorage.setItem("currentUser", JSON.stringify(data.user))
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (email: string, password: string, name: string, role: string) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, role }),
      })

      if (!response.ok) {
        throw new Error("Registration failed")
      }

      const data = await response.json()
      setCurrentUser(data.user)
      setToken(data.token)

      localStorage.setItem("authToken", data.token)
      localStorage.setItem("currentUser", JSON.stringify(data.user))
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setCurrentUser(null)
    setToken(null)
    localStorage.removeItem("authToken")
    localStorage.removeItem("currentUser")
  }

  return (
    <AuthContext.Provider value={{ currentUser, token, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}

interface AuthSystemProps {
  className?: string
}

export function AuthSystem({ className }: AuthSystemProps) {
  const { currentUser, logout } = useAuth()
  const [showProfile, setShowProfile] = useState(false)

  if (!currentUser) {
    return (
      <div className="flex items-center gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <LogIn className="w-4 h-4 mr-2" />
              Login
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Login to CleanCity AI</DialogTitle>
              <DialogDescription>Access your account and manage garbage reports</DialogDescription>
            </DialogHeader>
            {/* Login form can be implemented here */}
            <p className="text-sm text-muted-foreground">Login functionality integrated with API</p>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge variant="destructive">Admin</Badge>
      case "officer":
        return <Badge className="bg-blue-100 text-blue-800">Officer</Badge>
      case "driver":
        return <Badge className="bg-green-100 text-green-800">Driver</Badge>
      case "citizen":
        return <Badge variant="outline">Citizen</Badge>
      default:
        return <Badge variant="outline">User</Badge>
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
            <span className="hidden md:inline text-sm">{currentUser.name}</span>
            {getRoleBadge(currentUser.role)}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
            <DialogDescription>Your account information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="font-medium">{currentUser.name}</p>
              <p className="text-sm text-muted-foreground">{currentUser.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Role:</p>
              {getRoleBadge(currentUser.role)}
            </div>
            <Button variant="outline" className="w-full bg-transparent" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
