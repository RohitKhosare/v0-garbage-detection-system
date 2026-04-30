# Mobile Camera Integration Guide

## Overview
This guide shows how to connect mobile devices (phones/tablets) to the CleanCity AI CCTV system to capture and upload garbage detection images directly to the database.

## Quick Start (5 minutes)

### 1. Register Your Mobile Device

Make a POST request to register your mobile device:

```bash
curl -X POST http://localhost:3000/api/mobile-camera/devices \
  -H "Content-Type: application/json" \
  -d '{
    "deviceId": "MOBILE-OFFICER-001",
    "deviceName": "Officer Sharma Mobile"
  }'
```

**Response:**
```json
{
  "success": true,
  "device": {
    "id": "uuid",
    "device_id": "MOBILE-OFFICER-001",
    "device_name": "Officer Sharma Mobile",
    "status": "active"
  }
}
```

### 2. Upload Image from Mobile Camera

```bash
curl -X POST http://localhost:3000/api/mobile-camera/upload \
  -F "deviceId=MOBILE-OFFICER-001" \
  -F "deviceName=Officer Sharma Mobile" \
  -F "latitude=28.6328" \
  -F "longitude=77.2197" \
  -F "detectionType=garbage_pile" \
  -F "confidence=0.92" \
  -F "image=@/path/to/image.jpg"
```

**Response:**
```json
{
  "success": true,
  "detectionId": "uuid",
  "cameraId": "uuid",
  "imageUrl": "/mobile-uploads/MOBILE-OFFICER-001/uuid.jpg",
  "message": "Image uploaded and stored successfully"
}
```

### 3. Get Real-time Mobile Camera Feed

```bash
curl http://localhost:3000/api/mobile-camera/feed?limit=20
```

**Response:**
```json
{
  "success": true,
  "detections": [
    {
      "id": "uuid",
      "camera_id": "uuid",
      "detection_type": "garbage_pile",
      "confidence_score": 0.92,
      "image_url": "/mobile-uploads/MOBILE-OFFICER-001/uuid.jpg",
      "created_at": "2024-01-15T10:30:00Z",
      "device_id": "MOBILE-OFFICER-001",
      "device_name": "Officer Sharma Mobile",
      "latitude": 28.6328,
      "longitude": 77.2197,
      "status": "active"
    }
  ],
  "total": 1
}
```

## Full API Reference

### 1. Register Mobile Device

**Endpoint:** `POST /api/mobile-camera/devices`

**Request:**
```json
{
  "deviceId": "MOBILE-001",
  "deviceName": "Field Officer Mobile",
  "userId": "optional-uuid"
}
```

**Required Fields:**
- `deviceId`: Unique identifier for the device (string, max 255 chars)
- `deviceName`: Friendly name for the device (optional)

**Response:** `201 Created`
```json
{
  "success": true,
  "device": { ... },
  "message": "Device registered successfully"
}
```

---

### 2. Upload Image/Detection

**Endpoint:** `POST /api/mobile-camera/upload`

**Request (Multipart Form Data):**
- `deviceId` (required): Device identifier
- `deviceName` (optional): Device name
- `latitude` (required): GPS latitude
- `longitude` (required): GPS longitude
- `image` (required): Image file
- `detectionType` (optional): Type of detection
  - `garbage_pile` (default)
  - `illegal_dumping`
  - `overflowing_bin`
  - `hazardous_waste`
- `confidence` (optional): Confidence score (0-1)

**Response:** `201 Created`
```json
{
  "success": true,
  "detectionId": "uuid",
  "cameraId": "uuid",
  "imageUrl": "/mobile-uploads/DEVICE-ID/uuid.jpg"
}
```

---

### 3. Get Mobile Camera Devices

**Endpoint:** `GET /api/mobile-camera/devices`

**Query Parameters:** None

**Response:** `200 OK`
```json
{
  "success": true,
  "devices": [ ... ],
  "total": 5
}
```

---

### 4. Get Mobile Camera Feed

**Endpoint:** `GET /api/mobile-camera/feed`

**Query Parameters:**
- `limit` (optional): Results per page (default: 100)
- `offset` (optional): Pagination offset (default: 0)
- `deviceId` (optional): Filter by specific device

**Response:** `200 OK`
```json
{
  "success": true,
  "detections": [ ... ],
  "total": 50,
  "limit": 100,
  "offset": 0
}
```

---

### 5. Add Detection Event (Real-time)

**Endpoint:** `POST /api/mobile-camera/feed`

**Request:**
```json
{
  "deviceId": "MOBILE-001",
  "detectionType": "garbage_pile",
  "confidence": 0.92,
  "imageUrl": "https://...",
  "latitude": 28.6328,
  "longitude": 77.2197
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "detection": { ... }
}
```

---

## Mobile App Implementation Examples

### React Native Example

```javascript
import * as ImagePicker from 'expo-image-picker'
import * as Location from 'expo-location'

const uploadGarbageDetection = async () => {
  // Get current location
  const location = await Location.getCurrentPositionAsync({})
  const { latitude, longitude } = location.coords

  // Pick image from device
  const image = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.8,
  })

  if (image.cancelled) return

  // Create form data
  const formData = new FormData()
  formData.append('deviceId', 'MOBILE-OFFICER-001')
  formData.append('deviceName', 'Officer Mobile')
  formData.append('latitude', latitude)
  formData.append('longitude', longitude)
  formData.append('detectionType', 'garbage_pile')
  formData.append('confidence', 0.92)
  formData.append('image', {
    uri: image.uri,
    type: 'image/jpeg',
    name: 'detection.jpg',
  })

  // Upload
  const response = await fetch(
    'http://your-server.com/api/mobile-camera/upload',
    {
      method: 'POST',
      body: formData,
    }
  )

  const result = await response.json()
  console.log('Upload successful:', result)
}
```

### Flutter Example

```dart
import 'package:image_picker/image_picker.dart'
import 'package:geolocator/geolocator.dart'
import 'package:http/http.dart' as http

Future<void> uploadGarbageDetection() async {
  // Get current location
  Position position = await Geolocator.getCurrentPosition();

  // Pick image
  final picker = ImagePicker()
  final image = await picker.pickImage(source: ImageSource.camera)

  if (image == null) return

  // Create multipart request
  var request = http.MultipartRequest(
    'POST',
    Uri.parse('http://your-server.com/api/mobile-camera/upload'),
  )

  request.fields['deviceId'] = 'MOBILE-OFFICER-001'
  request.fields['deviceName'] = 'Officer Mobile'
  request.fields['latitude'] = position.latitude.toString()
  request.fields['longitude'] = position.longitude.toString()
  request.fields['detectionType'] = 'garbage_pile'
  request.fields['confidence'] = '0.92'

  // Add image file
  request.files.add(
    await http.MultipartFile.fromPath('image', image.path),
  )

  // Send request
  var response = await request.send()
  print('Upload status: ${response.statusCode}')
}
```

### Python Example

```python
import requests
from PIL import Image
import io

def upload_garbage_detection(device_id, latitude, longitude, image_path):
    url = 'http://localhost:3000/api/mobile-camera/upload'
    
    with open(image_path, 'rb') as f:
        files = {
            'image': f,
            'deviceId': (None, device_id),
            'deviceName': (None, 'Python Detector'),
            'latitude': (None, str(latitude)),
            'longitude': (None, str(longitude)),
            'detectionType': (None, 'garbage_pile'),
            'confidence': (None, '0.92'),
        }
        
        response = requests.post(url, files=files)
        return response.json()

# Usage
result = upload_garbage_detection(
    device_id='MOBILE-PYTHON-001',
    latitude=28.6328,
    longitude=77.2197,
    image_path='garbage_image.jpg'
)
print(result)
```

### JavaScript/Node.js Example

```javascript
const FormData = require('form-data')
const fs = require('fs')
const axios = require('axios')

async function uploadGarbageDetection(imagePath, latitude, longitude) {
  const form = new FormData()
  form.append('deviceId', 'MOBILE-JS-001')
  form.append('deviceName', 'JavaScript Mobile')
  form.append('latitude', latitude)
  form.append('longitude', longitude)
  form.append('detectionType', 'garbage_pile')
  form.append('confidence', 0.92)
  form.append('image', fs.createReadStream(imagePath))

  try {
    const response = await axios.post(
      'http://localhost:3000/api/mobile-camera/upload',
      form,
      { headers: form.getHeaders() }
    )
    console.log('Success:', response.data)
    return response.data
  } catch (error) {
    console.error('Error:', error.message)
  }
}

// Usage
uploadGarbageDetection('image.jpg', 28.6328, 77.2197)
```

---

## Database Schema

The mobile camera integration uses the following tables:

### mobile_cameras
Stores information about mobile devices connected to the system.

```sql
CREATE TABLE mobile_cameras (
  id UUID PRIMARY KEY,
  device_id VARCHAR(255) UNIQUE,
  device_name VARCHAR(255),
  user_id UUID,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  status VARCHAR(50),
  detection_count INT,
  last_detection_at TIMESTAMP,
  last_location_update TIMESTAMP,
  created_at TIMESTAMP
)
```

### detections
Enhanced to support mobile cameras in addition to CCTV:

```sql
ALTER TABLE detections ADD COLUMN device_type VARCHAR(50); -- 'cctv', 'mobile', 'iot'
ALTER TABLE detections ADD COLUMN mobile_camera_id UUID;
ALTER TABLE detections ADD COLUMN location_name VARCHAR(255);
```

---

## Security Best Practices

1. **Device Registration**: Always register a device before uploading
2. **API Keys**: Use API keys in production (add to mobile app)
3. **Rate Limiting**: Implement rate limiting to prevent abuse
4. **Image Validation**: Validate image size and format
5. **GPS Validation**: Ensure coordinates are within valid ranges
6. **User Authentication**: Associate uploads with authenticated users

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Upload fails with 400 | Check all required fields are included |
| Device not found (404) | Register device first with POST /api/mobile-camera/devices |
| Database connection error | System uses mock data fallback automatically |
| No GPS signal | Use manual latitude/longitude input |
| Large file upload fails | Compress image before upload |

---

## Next Steps

1. Register your mobile device
2. Start uploading detection images
3. Monitor the CCTV dashboard for mobile camera feeds
4. Configure alerts for high-confidence detections
5. Integrate with your mobile app

For support, contact the development team or check the full API documentation.
