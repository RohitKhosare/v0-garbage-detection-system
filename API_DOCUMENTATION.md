# CleanCity AI - Complete API Documentation

## Overview
Comprehensive REST API for the AI-powered garbage detection and reporting system.

## Base URL
\`\`\`
http://localhost:3000/api
\`\`\`

## Authentication
All requests requiring authentication should include a Bearer token in the Authorization header:
\`\`\`
Authorization: Bearer <token>
\`\`\`

---

## Auth Endpoints

### Register User
**POST** `/auth/register`

Request body:
\`\`\`json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "citizen"
}
\`\`\`

Response: `{ user: User, token: string }`

### Login User
**POST** `/auth/login`

Request body:
\`\`\`json
{
  "email": "user@example.com",
  "password": "password123"
}
\`\`\`

Response: `{ user: User, token: string }`

---

## Reports Endpoints

### Get All Reports
**GET** `/reports`

Response: `Report[]`

### Create Report
**POST** `/reports`

Request body:
\`\`\`json
{
  "userId": "user_123",
  "title": "Overflowing trash bins",
  "description": "Multiple bins overflowing",
  "latitude": 40.7580,
  "longitude": -73.9855,
  "category": "general",
  "photos": []
}
\`\`\`

Response: `Report`

### Get Report by ID
**GET** `/reports/{id}`

Response: `Report`

### Update Report
**PATCH** `/reports/{id}`

Request body:
\`\`\`json
{
  "status": "in-progress",
  "priority": "high"
}
\`\`\`

Response: `Report`

---

## Vehicles Endpoints

### Get All Vehicles
**GET** `/vehicles`

Response: `Vehicle[]`

### Create Vehicle
**POST** `/vehicles`

Request body:
\`\`\`json
{
  "driverId": "driver_123",
  "licenseNumber": "ABC123",
  "capacity": 5000
}
\`\`\`

Response: `Vehicle`

### Get Vehicle by ID
**GET** `/vehicles/{id}`

Response: `Vehicle`

### Update Vehicle
**PATCH** `/vehicles/{id}`

Request body:
\`\`\`json
{
  "status": "in-progress",
  "latitude": 40.7580,
  "longitude": -73.9855,
  "currentLoad": 3000
}
\`\`\`

Response: `Vehicle`

---

## Tasks Endpoints

### Get Tasks
**GET** `/tasks?driverId={driverId}`

Query parameters:
- `driverId` (optional): Filter tasks by driver ID

Response: `Task[]`

### Create Task
**POST** `/tasks`

Request body:
\`\`\`json
{
  "reportId": "report_123",
  "vehicleId": "vehicle_456",
  "driverId": "driver_789"
}
\`\`\`

Response: `Task`

### Update Task
**PATCH** `/tasks/{id}`

Request body:
\`\`\`json
{
  "status": "completed",
  "proofPhotos": ["photo1.jpg", "photo2.jpg"]
}
\`\`\`

Response: `Task`

---

## CCTV Endpoints

### Get All Cameras
**GET** `/cctv`

Response: `CCTVCamera[]`

### Create Camera
**POST** `/cctv`

Request body:
\`\`\`json
{
  "name": "Main Street Camera",
  "latitude": 40.7580,
  "longitude": -73.9855
}
\`\`\`

Response: `CCTVCamera`

### Report Detection
**POST** `/cctv/{id}/detection`

Response: `{ camera: CCTVCamera, alert: Alert }`

---

## Alerts Endpoints

### Get All Alerts
**GET** `/alerts`

Response: `Alert[]`

### Acknowledge Alert
**PATCH** `/alerts/{id}`

Request body:
\`\`\`json
{
  "acknowledged": true
}
\`\`\`

Response: `Alert`

---

## Statistics Endpoints

### Get System Statistics
**GET** `/statistics`

Response:
\`\`\`json
{
  "totalReports": 150,
  "activeReports": 23,
  "resolvedReports": 127,
  "activeVehicles": 8,
  "completedTasks": 95,
  "unacknowledgedAlerts": 5,
  "averageResponseTime": 144,
  "reportsByCategory": { ... },
  "hourlyReports": { ... }
}
\`\`\`

---

## Data Models

### User
\`\`\`typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: "citizen" | "officer" | "driver" | "admin";
  phone?: string;
  createdAt: Date;
}
\`\`\`

### Report
\`\`\`typescript
interface Report {
  id: string;
  userId: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  category: string;
  photos: string[];
  videos?: string[];
  status: "pending" | "in-progress" | "resolved";
  priority: "low" | "medium" | "high";
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: string;
}
\`\`\`

### Vehicle
\`\`\`typescript
interface Vehicle {
  id: string;
  driverId: string;
  licenseNumber: string;
  capacity: number;
  status: "idle" | "in-progress" | "full" | "maintenance";
  latitude?: number;
  longitude?: number;
  currentLoad: number;
}
\`\`\`

### Task
\`\`\`typescript
interface Task {
  id: string;
  reportId: string;
  vehicleId?: string;
  driverId?: string;
  status: "pending" | "in-progress" | "completed";
  createdAt: Date;
  completedAt?: Date;
  proofPhotos?: string[];
}
\`\`\`

---

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Server Error

Error responses include a message:
\`\`\`json
{
  "error": "Descriptive error message"
}
\`\`\`

---

## Features

### Real-time Updates
The API automatically creates alerts when:
- New reports are submitted
- CCTV detections occur
- Tasks are completed
- Critical events happen

### Role-based Access
Different features available based on user role:
- **Citizen**: Report issues, view status
- **Officer**: Manage reports, assign tasks, monitor CCTV
- **Driver**: View assigned tasks, update status
- **Admin**: Full system access

### Location Tracking
All reports and assets include GPS coordinates for mapping and routing.

### Analytics
System automatically tracks:
- Report completion rates
- Response times
- Vehicle utilization
- Detection trends
