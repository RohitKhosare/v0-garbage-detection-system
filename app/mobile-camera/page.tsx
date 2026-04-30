'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Smartphone, MapPin, Camera, Upload, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react'

interface MobileCamera {
  id: string
  device_id: string
  device_name: string
  latitude?: number
  longitude?: number
  status: string
  detection_count: number
  last_detection_at?: string
}

interface Detection {
  id: string
  device_id: string
  detection_type: string
  confidence_score: number
  image_url: string
  created_at: string
}

export default function MobileCameraPage() {
  const [deviceId, setDeviceId] = useState('MOBILE-OFFICER-' + Math.random().toString(36).substr(2, 9).toUpperCase())
  const [deviceName, setDeviceName] = useState('Field Officer Mobile')
  const [latitude, setLatitude] = useState<number | null>(null)
  const [longitude, setLongitude] = useState<number | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info')
  const [devices, setDevices] = useState<MobileCamera[]>([])
  const [detections, setDetections] = useState<Detection[]>([])
  const [loadingGPS, setLoadingGPS] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [useCameraFeed, setUseCameraFeed] = useState(false)

  // Get GPS location
  useEffect(() => {
    if (navigator.geolocation) {
      setLoadingGPS(true)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude)
          setLongitude(position.coords.longitude)
          setLoadingGPS(false)
        },
        (error) => {
          console.error('GPS error:', error)
          setLoadingGPS(false)
        }
      )
    }
  }, [])

  // Fetch devices and detections
  useEffect(() => {
    fetchDevices()
    fetchDetections()
    const interval = setInterval(fetchDetections, 5000) // Refresh every 5 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchDevices = async () => {
    try {
      const response = await fetch('/api/mobile-camera/devices')
      const data = await response.json()
      setDevices(data.devices || [])
    } catch (error) {
      console.error('Failed to fetch devices:', error)
    }
  }

  const fetchDetections = async () => {
    try {
      const response = await fetch('/api/mobile-camera/feed?limit=10')
      const data = await response.json()
      setDetections(data.detections || [])
    } catch (error) {
      console.error('Failed to fetch detections:', error)
    }
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setUseCameraFeed(true)
    } catch (error) {
      setMessage('Camera access denied')
      setMessageType('error')
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d')
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)
        canvasRef.current.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' })
            setSelectedImage(file)
            setImagePreview(canvasRef.current?.toDataURL() || '')
          }
        })
      }
    }
  }

  const handleUpload = async () => {
    if (!selectedImage || latitude === null || longitude === null) {
      setMessage('Please select image and enable GPS')
      setMessageType('error')
      return
    }

    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append('deviceId', deviceId)
      formData.append('deviceName', deviceName)
      formData.append('latitude', latitude.toString())
      formData.append('longitude', longitude.toString())
      formData.append('detectionType', 'garbage_pile')
      formData.append('confidence', '0.85')
      formData.append('image', selectedImage)

      const response = await fetch('/api/mobile-camera/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('Image uploaded successfully!')
        setMessageType('success')
        setSelectedImage(null)
        setImagePreview('')
        fetchDevices()
        fetchDetections()
      } else {
        setMessage(data.error || 'Upload failed')
        setMessageType('error')
      }
    } catch (error) {
      setMessage('Upload failed: ' + (error as Error).message)
      setMessageType('error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Smartphone className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Mobile Camera Upload</h1>
          </div>
          <p className="text-muted-foreground">Capture and upload garbage detection images from your mobile device</p>
        </div>

        {message && (
          <Alert className="mb-6" variant={messageType === 'error' ? 'destructive' : 'default'}>
            <AlertDescription className="flex items-center gap-2">
              {messageType === 'success' && <CheckCircle className="w-4 h-4" />}
              {messageType === 'error' && <AlertTriangle className="w-4 h-4" />}
              {message}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle>Capture & Upload</CardTitle>
              <CardDescription>Take a photo and upload garbage detection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Device Info */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Device ID</label>
                <Input
                  value={deviceId}
                  onChange={(e) => setDeviceId(e.target.value)}
                  placeholder="Device ID"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Device Name</label>
                <Input
                  value={deviceName}
                  onChange={(e) => setDeviceName(e.target.value)}
                  placeholder="Device name"
                />
              </div>

              {/* GPS Location */}
              <div className="bg-secondary p-3 rounded-lg flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <div className="text-sm font-medium">GPS Location</div>
                  {loadingGPS ? (
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Getting location...
                    </div>
                  ) : latitude !== null && longitude !== null ? (
                    <div className="text-sm text-green-600 font-semibold">
                      {latitude.toFixed(4)}, {longitude.toFixed(4)}
                    </div>
                  ) : (
                    <div className="text-sm text-red-600">Location unavailable</div>
                  )}
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="text-sm font-medium mb-2 block">Select Image</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="flex-1"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Image
                  </Button>
                  <Button
                    onClick={startCamera}
                    variant="outline"
                    className="flex-1"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Take Photo
                  </Button>
                </div>
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <div className="relative w-full aspect-video bg-secondary rounded-lg overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Camera Feed */}
              {useCameraFeed && (
                <div className="space-y-2">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full aspect-video bg-black rounded-lg"
                  />
                  <Button onClick={capturePhoto} className="w-full">
                    Capture Photo
                  </Button>
                  <Button
                    onClick={() => {
                      setUseCameraFeed(false)
                      if (videoRef.current?.srcObject) {
                        (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop())
                      }
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Close Camera
                  </Button>
                </div>
              )}

              <canvas ref={canvasRef} width={320} height={240} className="hidden" />

              {/* Upload Button */}
              <Button
                onClick={handleUpload}
                disabled={!selectedImage || isLoading || latitude === null || longitude === null}
                className="w-full"
                size="lg"
              >
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {isLoading ? 'Uploading...' : 'Upload Detection'}
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Uploads</CardTitle>
              <CardDescription>Latest detections from mobile cameras</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 max-h-96 overflow-y-auto">
              {detections.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No detections yet</p>
              ) : (
                detections.map((detection) => (
                  <div key={detection.id} className="border rounded-lg p-3 hover:bg-secondary transition">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline">{detection.detection_type.replace(/_/g, ' ')}</Badge>
                      <Badge variant="secondary">{(detection.confidence_score * 100).toFixed(0)}%</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(detection.created_at).toLocaleString()}
                    </div>
                    {detection.image_url && (
                      <img
                        src={detection.image_url}
                        alt="Detection"
                        className="w-full mt-2 rounded aspect-square object-cover"
                      />
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Devices List */}
        <Card>
          <CardHeader>
            <CardTitle>Connected Mobile Devices</CardTitle>
            <CardDescription>All registered mobile camera devices</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {devices.map((device) => (
                <Card key={device.id} className="border">
                  <CardContent className="pt-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-primary" />
                        <span className="font-semibold text-sm">{device.device_name}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">{device.device_id}</div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={device.status === 'active' ? 'border-green-500 text-green-700' : ''}
                        >
                          {device.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{device.detection_count} detections</span>
                      </div>
                      {device.latitude && device.longitude && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          {device.latitude.toFixed(4)}, {device.longitude.toFixed(4)}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
