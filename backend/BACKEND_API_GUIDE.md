# CleanCity AI Backend API Guide

## Overview

Comprehensive REST API for garbage detection, tracking, and collection optimization. Built with FastAPI, PostgreSQL, YOLOv8, and AWS S3.

## Base URL

```
Production: https://api.yourdomain.com
Staging: https://staging-api.yourdomain.com
Development: http://localhost:8000
```

## Authentication

All endpoints (except `/health`, `/login`, `/register`) require JWT bearer token.

### Getting a Token

```bash
# Register
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "username",
    "full_name": "Full Name",
    "password": "secure_password",
    "role": "citizen"
  }'

# Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "username",
    "password": "secure_password"
  }'
```

### Using Token

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/v1/detections
```

## API Endpoints

### Health & Status

#### GET /health
Check API health status

**Response:**
```json
{
  "status": "operational",
  "database": "healthy",
  "version": "1.0.0"
}
```

---

### Authentication

#### POST /api/v1/auth/register
Register new user

**Request:**
```json
{
  "email": "user@example.com",
  "username": "username",
  "full_name": "John Doe",
  "phone": "+1234567890",
  "password": "secure_password",
  "role": "citizen"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "username",
    "full_name": "John Doe",
    "role": "citizen",
    "is_active": true,
    "created_at": "2024-01-20T10:30:00"
  }
}
```

#### POST /api/v1/auth/login
Login user

**Request:**
```json
{
  "username": "username",
  "password": "secure_password"
}
```

**Response:** Same as register

#### GET /api/v1/auth/me
Get current user profile

**Headers:** Authorization: Bearer TOKEN

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "username",
  "full_name": "John Doe",
  "role": "citizen",
  "is_active": true,
  "created_at": "2024-01-20T10:30:00"
}
```

---

### Detection (Garbage Detection)

#### POST /api/v1/detect
Upload image and detect garbage

**Headers:** Authorization: Bearer TOKEN, Content-Type: multipart/form-data

**Parameters:**
- `file` (file): Image file
- `latitude` (float): Detection latitude
- `longitude` (float): Detection longitude
- `garbage_type` (string, optional): Type of garbage
- `severity` (string, optional): Severity level
- `notes` (string, optional): Additional notes

**Response:**
```json
{
  "id": 1,
  "user_id": 1,
  "original_image_url": "https://bucket.s3.amazonaws.com/...",
  "detected_image_url": "https://bucket.s3.amazonaws.com/...",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "confidence": 0.87,
  "garbage_type": "plastic, paper",
  "severity": "high",
  "status": "reported",
  "detections_data": {
    "detections": [...],
    "summary": {...}
  },
  "created_at": "2024-01-20T10:30:00"
}
```

#### GET /api/v1/detections
Get detection history

**Headers:** Authorization: Bearer TOKEN

**Query Parameters:**
- `skip` (int, default: 0): Pagination offset
- `limit` (int, default: 100): Results per page
- `status` (string): Filter by status (reported, assigned, completed, rejected)
- `severity` (string): Filter by severity (low, medium, high)
- `days` (int, default: 30): Days back to query

**Response:**
```json
{
  "total": 45,
  "skip": 0,
  "limit": 100,
  "data": [...]
}
```

#### GET /api/v1/detections/{detection_id}
Get single detection

**Headers:** Authorization: Bearer TOKEN

**Response:** Detection object

#### PATCH /api/v1/detections/{detection_id}
Update detection status

**Headers:** Authorization: Bearer TOKEN

**Query Parameter:** `status` (assigned, completed, rejected)

**Response:** Updated detection object

---

### Bins (Garbage Bins)

#### GET /api/v1/bins
Get all bins

**Headers:** Authorization: Bearer TOKEN

**Query Parameters:**
- `skip` (int): Pagination offset
- `limit` (int): Results per page
- `status_filter` (string): Filter by status (empty, partial, full)

**Response:**
```json
{
  "total": 250,
  "skip": 0,
  "limit": 100,
  "data": [...]
}
```

#### GET /api/v1/bins/{bin_id}
Get single bin details

**Response:**
```json
{
  "id": 1,
  "bin_id": "BIN-001",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "capacity": 100.0,
  "current_fill": 75.5,
  "status": "partial",
  "location_name": "5th Avenue & 42nd Street",
  "last_emptied": "2024-01-18T10:30:00",
  "updated_at": "2024-01-20T14:22:00"
}
```

#### POST /api/v1/bin-update
IoT endpoint - Update bin status

**Note:** No authentication required for IoT devices

**Request:**
```json
{
  "bin_id": "BIN-001",
  "fill_level": 85.5,
  "temperature": 22.3,
  "humidity": 65.2,
  "battery_level": 92.0
}
```

**Response:**
```json
{
  "message": "Bin updated successfully",
  "bin_id": 1,
  "status": "partial"
}
```

#### GET /api/v1/bins/{bin_id}/history
Get bin fill level history

**Headers:** Authorization: Bearer TOKEN

**Response:**
```json
{
  "bin_id": 1,
  "updates": [
    {
      "timestamp": "2024-01-20T14:22:00",
      "fill_level": 85.5,
      "temperature": 22.3,
      "humidity": 65.2,
      "battery_level": 92.0,
      "status": "partial"
    }
  ]
}
```

---

### Heatmap

#### GET /api/v1/heatmap
Get garbage hotspot heatmap

**Headers:** Authorization: Bearer TOKEN

**Query Parameters:**
- `days` (int, default: 30): Days back
- `grid_size` (int, default: 10): Grid granularity

**Response:**
```json
{
  "points": [
    {
      "latitude": 40.71,
      "longitude": -74.01,
      "count": 45,
      "severity": "high"
    }
  ],
  "total_detections": 1250
}
```

#### GET /api/v1/heatmap/radius
Get detections within radius

**Headers:** Authorization: Bearer TOKEN

**Query Parameters:**
- `latitude` (float): Center latitude
- `longitude` (float): Center longitude
- `radius_km` (float): Radius in kilometers
- `days` (int): Days back

**Response:**
```json
{
  "center": {"latitude": 40.7128, "longitude": -74.0060},
  "radius_km": 5,
  "total_detections": 125,
  "severity": {"high": 30, "medium": 50, "low": 45},
  "detections": [...]
}
```

---

### Route Optimization

#### POST /api/v1/optimize-route
Optimize collection route

**Headers:** Authorization: Bearer TOKEN

**Query Parameters:**
- `bin_ids` (list of int): Bin IDs to visit
- `start_latitude` (float, optional): Starting point
- `start_longitude` (float, optional): Starting point

**Response:**
```json
{
  "optimized_waypoints": [
    {
      "order": 0,
      "latitude": 40.7128,
      "longitude": -74.0060,
      "bin_id": "BIN-001"
    }
  ],
  "total_distance_km": 15.7,
  "estimated_time_minutes": 45,
  "stop_count": 5
}
```

#### POST /api/v1/routes
Create collection route

**Headers:** Authorization: Bearer TOKEN (officer/admin only)

**Query Parameters:** `waypoint_ids` (list of bin IDs)

**Response:**
```json
{
  "route_id": 1,
  "status": "pending",
  "total_distance_km": 15.7,
  "estimated_time_minutes": 45,
  "waypoints": 5
}
```

#### GET /api/v1/routes/{route_id}
Get route details

**Headers:** Authorization: Bearer TOKEN

**Response:**
```json
{
  "id": 1,
  "waypoints": [...],
  "total_distance_km": 15.7,
  "estimated_time_minutes": 45,
  "status": "pending",
  "created_at": "2024-01-20T10:30:00"
}
```

#### PATCH /api/v1/routes/{route_id}/assign/{driver_id}
Assign route to driver

**Headers:** Authorization: Bearer TOKEN (officer/admin only)

**Response:**
```json
{
  "message": "Route assigned successfully"
}
```

#### PATCH /api/v1/routes/{route_id}/status
Update route status

**Headers:** Authorization: Bearer TOKEN

**Query Parameter:** `status` (assigned, in_progress, completed)

**Response:**
```json
{
  "message": "Route status updated"
}
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "detail": "Invalid authentication credentials"
}
```

### 403 Forbidden
```json
{
  "detail": "User role 'citizen' not allowed for this operation"
}
```

### 404 Not Found
```json
{
  "detail": "Detection not found"
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error"
}
```

---

## Rate Limiting

Coming soon. Current limits:
- Detection upload: 100 requests/hour
- API calls: 1000 requests/hour

---

## Pagination

Most list endpoints support pagination:

```bash
curl "http://localhost:8000/api/v1/detections?skip=0&limit=50" \
  -H "Authorization: Bearer TOKEN"
```

---

## WebSocket Events

Real-time updates (coming soon):
- Detection created
- Bin status changed
- Route progress
- Alerts

---

## Testing

### Using cURL

```bash
# Register
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"testuser","full_name":"Test","password":"test123"}'

# Get token from response
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Make authenticated request
curl "http://localhost:8000/api/v1/detections" \
  -H "Authorization: Bearer $TOKEN"
```

### Using Python

```python
import requests

BASE_URL = "http://localhost:8000/api/v1"
headers = {"Authorization": "Bearer YOUR_TOKEN"}

# Get detections
response = requests.get(f"{BASE_URL}/detections", headers=headers)
print(response.json())

# Upload detection
files = {"file": open("image.jpg", "rb")}
params = {"latitude": 40.7128, "longitude": -74.0060}
response = requests.post(f"{BASE_URL}/detect", files=files, params=params, headers=headers)
print(response.json())
```

### Using JavaScript

```javascript
const BASE_URL = "http://localhost:8000/api/v1";
const token = "YOUR_TOKEN";

// Get detections
fetch(`${BASE_URL}/detections`, {
  headers: { "Authorization": `Bearer ${token}` }
})
.then(r => r.json())
.then(data => console.log(data));

// Upload detection
const formData = new FormData();
formData.append("file", fileInput.files[0]);
formData.append("latitude", 40.7128);
formData.append("longitude", -74.0060);

fetch(`${BASE_URL}/detect`, {
  method: "POST",
  headers: { "Authorization": `Bearer ${token}` },
  body: formData
})
.then(r => r.json())
.then(data => console.log(data));
```

---

## Webhooks

Receive real-time updates via webhooks (coming soon):

```json
{
  "event": "detection.created",
  "data": {
    "id": 1,
    "severity": "high",
    "latitude": 40.7128,
    "longitude": -74.0060
  },
  "timestamp": "2024-01-20T10:30:00"
}
```

---

## Performance Tips

1. **Pagination**: Always use limit/skip for large datasets
2. **Caching**: Frontend should cache detections locally
3. **Compression**: Optimize images before upload
4. **Batch Requests**: Combine multiple operations when possible
5. **Connection Pooling**: Reuse HTTP connections

---

## Changelog

### v1.0.0 (2024-01-20)
- Initial release
- All core endpoints
- JWT authentication
- YOLOv8 integration
- Route optimization
