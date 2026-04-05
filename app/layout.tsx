import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Navigation } from "@/components/navigation"
import { AuthProvider } from "@/components/auth-system"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "CleanCity AI - Garbage Detection & Reporting System",
  description: "AI-powered garbage detection and reporting system for smart cities",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <AuthProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <Navigation />
            <main className="min-h-screen bg-background">{children}</main>
            <Analytics />
          </Suspense>
        </AuthProvider>
      </body>
    </html>
  )
}
