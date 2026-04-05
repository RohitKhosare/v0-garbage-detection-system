"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Camera, MapPin, Upload, X, CheckCircle, AlertTriangle, Loader2 } from "lucide-react"
import Image from "next/image"

interface LocationData {
  latitude: number
  longitude: number
  address?: string
}

interface ReportData {
  name: string
  contact: string
  description: string
  location: LocationData | null
  photos: File[]
  videos: File[]
}

export default function ReportPage() {
  const [reportData, setReportData] = useState<ReportData>({
    name: "",
    contact: "",
    description: "",
    location: null,
    photos: [],
    videos: [],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [previewUrls, setPreviewUrls] = useState<string[]>([])

  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  const getCurrentLocation = async () => {
    setIsGettingLocation(true)
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        })
      })

      const { latitude, longitude } = position.coords

      // Simulate reverse geocoding (in real app, use Google Maps API)
      const address = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`

      setReportData((prev) => ({
        ...prev,
        location: { latitude, longitude, address },
      }))
    } catch (error) {
      console.error("Error getting location:", error)
      alert("Unable to get your location. Please enable location services and try again.")
    } finally {
      setIsGettingLocation(false)
    }
  }

  const handleFileUpload = (files: FileList | null, type: "photos" | "videos") => {
    if (!files) return

    const fileArray = Array.from(files)
    const validFiles = fileArray.filter((file) => {
      if (type === "photos") {
        return file.type.startsWith("image/")
      } else {
        return file.type.startsWith("video/")
      }
    })

    if (type === "photos") {
      setReportData((prev) => ({
        ...prev,
        photos: [...prev.photos, ...validFiles],
      }))

      // Create preview URLs
      const newPreviewUrls = validFiles.map((file) => URL.createObjectURL(file))
      setPreviewUrls((prev) => [...prev, ...newPreviewUrls])
    } else {
      setReportData((prev) => ({
        ...prev,
        videos: [...prev.videos, ...validFiles],
      }))
    }
  }

  const removeFile = (index: number, type: "photos" | "videos") => {
    if (type === "photos") {
      // Revoke the preview URL to prevent memory leaks
      URL.revokeObjectURL(previewUrls[index])
      setPreviewUrls((prev) => prev.filter((_, i) => i !== index))
      setReportData((prev) => ({
        ...prev,
        photos: prev.photos.filter((_, i) => i !== index),
      }))
    } else {
      setReportData((prev) => ({
        ...prev,
        videos: prev.videos.filter((_, i) => i !== index),
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In real implementation, upload files and submit data to backend
      console.log("Submitting report:", reportData)

      setSubmitStatus("success")

      // Reset form after successful submission
      setTimeout(() => {
        setReportData({
          name: "",
          contact: "",
          description: "",
          location: null,
          photos: [],
          videos: [],
        })
        setPreviewUrls([])
        setSubmitStatus("idle")
      }, 3000)
    } catch (error) {
      console.error("Error submitting report:", error)
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid =
    reportData.name &&
    reportData.description &&
    reportData.location &&
    (reportData.photos.length > 0 || reportData.videos.length > 0)

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Report Garbage</h1>
          <p className="text-muted-foreground">Help keep our city clean by reporting garbage issues in your area</p>
        </div>

        {/* Success/Error Messages */}
        {submitStatus === "success" && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Report submitted successfully! Municipal authorities have been notified.
            </AlertDescription>
          </Alert>
        )}

        {submitStatus === "error" && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">Failed to submit report. Please try again.</AlertDescription>
          </Alert>
        )}

        {/* Report Form */}
        <Card>
          <CardHeader>
            <CardTitle>Garbage Report Details</CardTitle>
            <CardDescription>
              Please provide as much detail as possible to help us address the issue quickly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={reportData.name}
                    onChange={(e) => setReportData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Your full name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact">Contact (Optional)</Label>
                  <Input
                    id="contact"
                    value={reportData.contact}
                    onChange={(e) => setReportData((prev) => ({ ...prev, contact: e.target.value }))}
                    placeholder="Phone or email"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={reportData.description}
                  onChange={(e) => setReportData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the garbage issue (type, amount, location details, etc.)"
                  rows={4}
                  required
                />
              </div>

              {/* Location */}
              <div className="space-y-4">
                <Label>Location *</Label>
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={getCurrentLocation}
                    disabled={isGettingLocation}
                    className="flex items-center gap-2 bg-transparent"
                  >
                    {isGettingLocation ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
                    {isGettingLocation ? "Getting Location..." : "Get Current Location"}
                  </Button>
                  {reportData.location && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      Location Captured
                    </Badge>
                  )}
                </div>
                {reportData.location && (
                  <div className="p-3 bg-muted rounded-lg text-sm">
                    <p className="font-medium">Coordinates:</p>
                    <p>{reportData.location.address}</p>
                  </div>
                )}
              </div>

              {/* Photo Upload */}
              <div className="space-y-4">
                <Label>Photos *</Label>
                <div className="space-y-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    Add Photos
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleFileUpload(e.target.files, "photos")}
                    className="hidden"
                  />

                  {previewUrls.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {previewUrls.map((url, index) => (
                        <div key={index} className="relative group">
                          <Image
                            src={url || "/placeholder.svg"}
                            alt={`Preview ${index + 1}`}
                            width={200}
                            height={150}
                            className="w-full h-32 object-cover rounded-lg border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeFile(index, "photos")}
                            className="absolute top-2 right-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Video Upload */}
              <div className="space-y-4">
                <Label>Videos (Optional)</Label>
                <div className="space-y-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => videoInputRef.current?.click()}
                    className="w-full flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Add Videos
                  </Button>
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    multiple
                    onChange={(e) => handleFileUpload(e.target.files, "videos")}
                    className="hidden"
                  />

                  {reportData.videos.length > 0 && (
                    <div className="space-y-2">
                      {reportData.videos.map((video, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <span className="text-sm font-medium">{video.name}</span>
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(index, "videos")}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <Button type="submit" disabled={!isFormValid || isSubmitting} className="w-full" size="lg">
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting Report...
                  </>
                ) : (
                  "Submit Report"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Reporting Guidelines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <p>Take clear photos showing the garbage and surrounding area</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <p>Enable location services for accurate positioning</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <p>Provide detailed descriptions to help cleanup crews</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <p>Reports are reviewed within 2 hours during business days</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
