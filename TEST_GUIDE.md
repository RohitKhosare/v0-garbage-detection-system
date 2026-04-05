# CleanCity AI - Complete Testing Guide

## 🧪 Test Credentials

### Pre-Created Test Users

Use these credentials to test immediately after deployment:

#### 1. Citizen Account
```
Email: citizen@cleancity.in
Password: Test@123
Role: Citizen
Phone: +91-9876543210
```

#### 2. Municipal Officer Account
```
Email: officer@cleancity.in
Password: Test@123
Role: Officer
Phone: +91-9876543211
```

#### 3. Garbage Collector/Driver Account
```
Email: driver@cleancity.in
Password: Test@123
Role: Driver
Phone: +91-9876543212
```

#### 4. Admin Account
```
Email: admin@cleancity.in
Password: Test@123
Role: Admin
Phone: +91-9876543213
```

---

## 🔐 Authentication Testing

### Test 1: Register New User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "SecurePass123!",
    "name": "John Doe",
    "role": "citizen",
    "phone": "+91-9999999999"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid-here",
    "email": "newuser@example.com",
    "name": "John Doe",
    "role": "citizen"
  },
  "token": "eyJhbGc..."
}
```

### Test 2: Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "citizen@cleancity.in",
    "password": "Test@123"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "user": {
    "id": "user-123",
    "email": "citizen@cleancity.in",
    "name": "Test Citizen",
    "role": "citizen"
  },
  "token": "eyJhbGc..."
}
```

### Test 3: Invalid Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "citizen@cleancity.in",
    "password": "WrongPassword"
  }'
```

**Expected Response:**
```json
{
  "error": "Invalid credentials"
}
```
**Status Code:** 401

---

## 🗺️ Map & Locations Testing

### Test 4: Get All Locations
```bash
curl http://localhost:3000/api/map/locations \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response:**
```json
{
  "reports": [
    {
      "id": "report-1",
      "latitude": 28.6139,
      "longitude": 77.2090,
      "type": "report",
      "status": "active",
      "title": "Garbage Pile - Delhi"
    }
  ],
  "bins": [
    {
      "id": "bin-1",
      "latitude": 28.6273,
      "longitude": 77.2055,
      "fill_level": 75,
      "status": "active"
    }
  ],
  "vehicles": [
    {
      "id": "vehicle-1",
      "latitude": 28.5244,
      "longitude": 77.1855,
      "status": "in-progress",
      "current_load": 45
    }
  ],
  "cameras": [
    {
      "id": "camera-1",
      "latitude": 28.6332,
      "longitude": 77.2197,
      "status": "active",
      "detection_count": 5
    }
  ],
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Test 5: Update Vehicle Location (Real-time)
```bash
curl -X POST http://localhost:3000/api/map/locations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "type": "vehicle",
    "vehicleId": "GC-001",
    "latitude": 28.5300,
    "longitude": 77.1900
  }'
```

**Expected Response:**
```json
{
  "success": true
}
```

### Test 6: Update Bin Fill Level
```bash
curl -X POST http://localhost:3000/api/map/locations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "type": "bin",
    "binId": "bin-001",
    "fillLevel": 85
  }'
```

---

## 📝 Reports Testing

### Test 7: Create Garbage Report
```bash
curl -X POST http://localhost:3000/api/reports \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Large garbage pile near Metro Station",
    "description": "Overflowing waste accumulation blocking pathway",
    "latitude": 28.6139,
    "longitude": 77.2090,
    "category": "commercial",
    "priority": "high",
    "photos": [
      "https://example.com/photo1.jpg",
      "https://example.com/photo2.jpg"
    ]
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "report": {
    "id": "report-new-123",
    "userId": "user-123",
    "title": "Large garbage pile near Metro Station",
    "status": "pending",
    "priority": "high",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Test 8: Get All Reports
```bash
curl http://localhost:3000/api/reports \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test 9: Update Report Status (Officer)
```bash
curl -X PUT http://localhost:3000/api/reports/report-123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer OFFICER_TOKEN" \
  -d '{
    "status": "in-progress",
    "assignedTo": "driver-001"
  }'
```

### Test 10: Mark Report as Resolved
```bash
curl -X PUT http://localhost:3000/api/reports/report-123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer DRIVER_TOKEN" \
  -d '{
    "status": "resolved"
  }'
```

---

## 🚗 Vehicle Testing

### Test 11: Get All Vehicles
```bash
curl http://localhost:3000/api/vehicles \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test 12: Create Vehicle Entry
```bash
curl -X POST http://localhost:3000/api/vehicles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{
    "driverId": "driver-001",
    "licenseNumber": "DL-01-AB-1234",
    "capacity": 5000,
    "status": "idle"
  }'
```

### Test 13: Update Vehicle Status
```bash
curl -X PUT http://localhost:3000/api/vehicles/vehicle-001 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer DRIVER_TOKEN" \
  -d '{
    "status": "in-progress",
    "latitude": 28.5244,
    "longitude": 77.1855,
    "currentLoad": 3500
  }'
```

---

## 📊 Testing by User Role

### Citizen Tests (citizen@cleancity.in)
```bash
# 1. Login as citizen
TOKEN=$(curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "citizen@cleancity.in",
    "password": "Test@123"
  }' | jq -r '.token')

# 2. Submit report
curl -X POST http://localhost:3000/api/reports \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '...'

# 3. View my reports
curl http://localhost:3000/api/reports/my-reports \
  -H "Authorization: Bearer $TOKEN"

# 4. View live map
curl http://localhost:3000/api/map/locations \
  -H "Authorization: Bearer $TOKEN"
```

### Officer Tests (officer@cleancity.in)
```bash
# 1. Login as officer
TOKEN=$(curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "officer@cleancity.in",
    "password": "Test@123"
  }' | jq -r '.token')

# 2. View all reports
curl http://localhost:3000/api/reports \
  -H "Authorization: Bearer $TOKEN"

# 3. Assign report to driver
curl -X PUT http://localhost:3000/api/reports/report-id \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"status": "in-progress", "assignedTo": "driver-id"}'

# 4. View statistics
curl http://localhost:3000/api/statistics \
  -H "Authorization: Bearer $TOKEN"

# 5. View heatmap data
curl http://localhost:3000/api/heatmap \
  -H "Authorization: Bearer $TOKEN"
```

### Driver Tests (driver@cleancity.in)
```bash
# 1. Login as driver
TOKEN=$(curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "driver@cleancity.in",
    "password": "Test@123"
  }' | jq -r '.token')

# 2. Get assigned tasks
curl http://localhost:3000/api/tasks/assigned-to-me \
  -H "Authorization: Bearer $TOKEN"

# 3. Update location in real-time
curl -X POST http://localhost:3000/api/map/locations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "type": "vehicle",
    "vehicleId": "GC-001",
    "latitude": 28.5244,
    "longitude": 77.1855
  }'

# 4. Mark task as complete
curl -X PUT http://localhost:3000/api/tasks/task-id \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"status": "completed", "proofPhotos": ["url1", "url2"]}'
```

---

## 🧪 Frontend Testing (Browser)

### Step 1: Login
1. Visit `http://localhost:3000/login`
2. Enter credentials:
   - Email: `citizen@cleancity.in`
   - Password: `Test@123`
3. Click "Login"
4. Should redirect to homepage

### Step 2: Test Home Page
1. Should see welcome message
2. Stats cards should display
3. Should be able to logout

### Step 3: Test Report Page
1. Go to `/report`
2. Fill form:
   - Title: "Test Garbage"
   - Description: "Test Description"
   - Location: (uses current GPS)
   - Category: "Commercial"
   - Priority: "High"
3. Click "Submit"
4. Should show success message

### Step 4: Test Live Map
1. Go to `/map`
2. Should see:
   - Stats cards with numbers
   - Location list with Indian cities
   - Search and filter controls
3. Try filters:
   - Filter by type: "Garbage Reports"
   - Search: "Delhi"
4. Update should happen every 5 seconds

### Step 5: Test Municipal Dashboard
1. Go to `/municipal`
2. Login as officer (officer@cleancity.in)
3. Should see:
   - All reports table
   - Filters (status, priority, date)
   - Assign to driver option
   - Update status option

### Step 6: Test Vehicle Dashboard
1. Go to `/vehicles`
2. Login as driver (driver@cleancity.in)
3. Should see:
   - Assigned tasks
   - Current location
   - Route optimization
   - Mark complete button

### Step 7: Test CCTV Monitoring
1. Go to `/cctv`
2. Should see:
   - Camera list
   - Detection statistics
   - Live detection alerts
   - Historical data

### Step 8: Test Alerts
1. Go to `/alerts`
2. Should see all notifications
3. Test acknowledgment
4. Check toast notifications appear

---

## 🔍 Performance Testing

### Load Test API
```bash
# Using Apache Bench
ab -n 1000 -c 100 http://localhost:3000/api/map/locations

# Using wrk (better for concurrent load)
wrk -t12 -c400 -d30s http://localhost:3000/api/map/locations
```

### Expected Results
- Response Time: < 500ms
- Throughput: > 100 req/sec
- Error Rate: < 1%

---

## 🐛 Debug Mode

### Enable Debug Logging
```bash
# Set in terminal before running
DEBUG=cleancity:* npm run dev

# Or in .env
DEBUG=cleancity:*
```

### Check Browser Console
1. Open Developer Tools (F12)
2. Go to Console tab
3. Check for [v0] debug messages

### Database Debug
```bash
# Enable PostgreSQL logging
psql $DATABASE_URL -c "SET log_statement = 'all';"

# View logs
tail -f /var/log/postgresql/postgresql.log
```

---

## ✅ Testing Checklist

### Authentication
- [ ] Register new user works
- [ ] Login works
- [ ] JWT token is generated
- [ ] Token expiration works
- [ ] Invalid password shows error

### Map & Locations
- [ ] Get locations returns data
- [ ] Update vehicle location works
- [ ] Update bin level works
- [ ] Real-time updates every 5 seconds
- [ ] Filters work correctly

### Reports
- [ ] Create report works
- [ ] Get reports works
- [ ] Update status works
- [ ] Assign to driver works
- [ ] Mark as resolved works

### Vehicles
- [ ] Get vehicles works
- [ ] Update location works
- [ ] Update status works
- [ ] Track in real-time works

### Frontend
- [ ] Login page loads
- [ ] Map page shows locations
- [ ] Report form submits
- [ ] Dashboard displays data
- [ ] Responsive on mobile
- [ ] Logout works

### Security
- [ ] Cannot access without token
- [ ] JWT validation works
- [ ] Password is hashed
- [ ] SQL injection prevented
- [ ] CORS working properly

---

## 🆘 Troubleshooting Tests

### If Login Fails
```bash
# Check user exists
psql $DATABASE_URL
SELECT * FROM users WHERE email='citizen@cleancity.in';

# Check password hash
SELECT password_hash FROM users WHERE email='citizen@cleancity.in';

# Insert test user manually
INSERT INTO users VALUES (
  'test-uuid',
  'test@test.com',
  'hashed_password_here',
  'Test User',
  'citizen',
  '+91-9999999999',
  NOW()
);
```

### If Map API Fails
```bash
# Check database connection
psql $DATABASE_URL -c "SELECT 1"

# Check tables exist
psql $DATABASE_URL -c "\dt"

# Check data exists
psql $DATABASE_URL -c "SELECT COUNT(*) FROM reports;"
```

### If API Timeouts
```bash
# Check server is running
curl http://localhost:3000/health

# Check database pool
psql $DATABASE_URL -c "SELECT * FROM pg_stat_activity;"

# Check logs
npm run dev | grep -i error
```

---

## 📊 Testing Summary Report

After completing all tests, create a report:

```markdown
# CleanCity AI - Test Report

## Test Date: YYYY-MM-DD
## Environment: Local / Production
## Tester: Your Name

### Results
- Total Tests: 50
- Passed: ✅
- Failed: ❌
- Skipped: ⏭️

### By Category
- Authentication: ✅ 5/5
- Map & Locations: ✅ 4/5
- Reports: ✅ 5/5
- Vehicles: ✅ 4/4
- Frontend: ✅ 8/8
- Performance: ✅ 3/3
- Security: ✅ 5/5

### Issues Found
1. Issue: ...
   Severity: High/Medium/Low
   Status: Open/Closed

### Recommendations
1. ...
2. ...

### Sign-off
- [ ] Ready for Production
- [ ] Ready for Staging
- [ ] Needs More Testing
```

---

## 🚀 Next Steps

After successful testing:
1. Deploy to production
2. Run smoke tests on production
3. Monitor logs and errors
4. Set up alerting
5. Plan ongoing testing schedule

---

**Last Updated**: 2024  
**Version**: 1.0  
**Status**: Ready for Testing ✅
