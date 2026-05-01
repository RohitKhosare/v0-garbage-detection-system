'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function ReportPage() {
  const [user, setUser] = useState<any>(null)
  const [location, setLocation] = useState('')
  const [latitude, setLatitude] = useState(0)
  const [longitude, setLongitude] = useState(0)
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [category, setCategory] = useState('garbage')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)
      // Get current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          setLatitude(pos.coords.latitude)
          setLongitude(pos.coords.longitude)
        })
      }
    }
    checkUser()
  }, [mounted, router])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!image) {
      alert('Please select an image')
      return
    }

    setLoading(true)

    try {
      // Upload image to Supabase Storage
      const fileName = `${Date.now()}-${image.name}`
      const { data: storageData, error: storageError } = await supabase.storage
        .from('garbage-images')
        .upload(fileName, image)

      if (storageError) throw storageError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('garbage-images')
        .getPublicUrl(fileName)

      // Save report to database
      const { error: dbError } = await supabase
        .from('reports')
        .insert({
          user_id: user.id,
          image_url: publicUrl,
          location,
          latitude,
          longitude,
          category,
          status: 'pending',
        })

      if (dbError) throw dbError

      setSuccess(true)
      setImage(null)
      setImagePreview('')
      setLocation('')
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch (error: any) {
      alert('Error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  if (!mounted || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Report Garbage Location</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="garbage">General Garbage</SelectItem>
                    <SelectItem value="plastic">Plastic Waste</SelectItem>
                    <SelectItem value="organic">Organic Waste</SelectItem>
                    <SelectItem value="hazardous">Hazardous Waste</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Location Description</label>
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Near the park entrance"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Latitude</label>
                  <Input
                    type="number"
                    value={latitude}
                    onChange={(e) => setLatitude(parseFloat(e.target.value))}
                    step="0.0001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Longitude</label>
                  <Input
                    type="number"
                    value={longitude}
                    onChange={(e) => setLongitude(parseFloat(e.target.value))}
                    step="0.0001"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Upload Image</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Choose Image
                </Button>
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" className="mt-4 rounded-lg max-h-64" />
                )}
              </div>

              {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700">
                  Report submitted successfully! Redirecting...
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Uploading...' : 'Submit Report'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
