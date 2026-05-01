# Mobile Camera Setup & Integration Guide

## Quick Start (Beginner Level)

This guide walks you through connecting your mobile device (phone/tablet) to the CleanCity AI garbage detection system.

---

## Step 1: Add Database Schema (5 minutes)

First, run the mobile camera schema update in your Neon database:

1. Go to https://console.neon.tech/
2. Select your project
3. Go to **SQL Editor**
4. Copy and paste the contents of `scripts/add-mobile-camera-schema.sql`
5. Click **Run**

You should see: `CREATE TABLE` and `CREATE INDEX` messages indicating success.

**What this does:**
- Creates `mobile_cameras` table to store device info
- Creates `mobile_sessions` table for tracking usage
- Adds columns to `detections` table for mobile support

---

## Step 2: Access Mobile Camera Page

1. Start your CleanCity AI application locally or deployed
2. Navigate to: `http://localhost:3000/mobile-camera` (or your deployed URL)
3. You'll see the **Mobile Camera Upload** interface

---

## Step 3: Register Your Mobile Device

### Option A: Automatic (Recommended)

When you first visit the mobile camera page:
1. Your Device ID is auto-generated (e.g., `MOBILE-OFFICER-ABC123`)
2. Change the Device Name if desired (e.g., "Officer Sharma Mobile")
3. The system auto-registers the device when you upload

### Option B: Manual Registration

```bash
curl -X POST http://localhost:3000/api/mobile-camera/devices \
  -H "Content-Type: application/json" \
  -d '{
    "deviceId": "MOBILE-OFFICER-001",
    "deviceName": "Officer Sharma's Phone"
  }'
```

---

## Step 4: Enable GPS Location

The application will request permission to access your device's GPS:

1. **On iPhone/iOS:**
   - Safari will prompt: "Allow location?"
   - Tap **Allow**

2. **On Android:**
   - Browser will prompt: "Allow location?"
   - Tap **Allow**

If location is disabled:
- Go to Settings → Location → Enable
- Or manually enter latitude/longitude

**Test location:**
```
Delhi: 28.6328, 77.2197
Mumbai: 19.0760, 72.8777
Bangalore: 12.9716, 77.5946
Hyderabad: 17.3850, 78.4867
```

---

## Step 5: Capture or Upload Image

### Method 1: Take a Photo (Easiest)

1. Tap **"Take Photo"** button
2. Allow camera access
3. Point camera at garbage
4. Tap capture button
5. Tap **"Upload Detection"**

### Method 2: Choose from Gallery

1. Tap **"Choose Image"** button
2. Select a photo from your phone
3. Tap **"Upload Detection"**

---

## Step 6: Monitor Detections

Once you upload:

1. **Success message** appears ("Image uploaded successfully!")
2. Image appears in **"Recent Uploads"** section
3. Device appears in **"Connected Mobile Devices"** list
4. Detection count increases

**Real-time updates:** The page refreshes every 5 seconds automatically

---

## How Data is Stored

When you upload an image, here's what happens:

```
Mobile Device (Phone/Tablet)
        ↓
Captures Image + GPS Location
        ↓
Sends to: /api/mobile-camera/upload
        ↓
Database stores:
├── mobile_cameras (device info)
├── detections (image metadata)
└── alerts (if high confidence)
        ↓
Appears in:
├── Dashboard
├── CCTV Feed
├── Live Map
└── Mobile Camera Page
```

---

## API Endpoints (For Developers)

### 1. Upload Image
```
POST /api/mobile-camera/upload
Parameters: deviceId, latitude, longitude, image (file)
Returns: detectionId, imageUrl
```

### 2. Get Devices
```
GET /api/mobile-camera/devices
Returns: List of all registered mobile cameras
```

### 3. Get Feed
```
GET /api/mobile-camera/feed?limit=20
Returns: Latest detections with images
```

### 4. Register Device
```
POST /api/mobile-camera/devices
Body: { deviceId, deviceName }
```

---

## Using on Different Devices

### Smartphone (iOS/Android)

1. Open browser (Chrome, Safari, Firefox)
2. Navigate to your CleanCity AI URL
3. Go to Mobile Camera page
4. Follow Steps 3-6

**Recommended:** Save as home screen shortcut
- iOS: Tap Share → Add to Home Screen
- Android: Tap Menu → Install app → Add to Home Screen

### Tablet

Same as smartphone, but larger screen for better preview

### Laptop/Desktop

You can test with:
1. Upload pre-existing images
2. Manually enter GPS coordinates
3. Useful for testing before field use

---

## Troubleshooting

### Problem: Camera Permission Denied

**Solution:**
1. Settings → Privacy/Permissions
2. Find your Browser app
3. Enable Camera access
4. Reload page

### Problem: GPS Not Working

**Solution:**
1. Enable Location Services in settings
2. Allow app to access location
3. Refresh page
4. Or manually enter coordinates

### Problem: Upload Fails

**Solution:**
1. Check internet connection
2. Try smaller image file
3. Check if browser supports FormData API
4. Use different browser (Chrome recommended)

### Problem: Image Too Large

**Solution:**
1. Use camera directly (takes smaller photos)
2. Compress image before upload (max 5MB recommended)
3. Use image editing app to reduce size

---

## Example Usage Workflow

### Field Officer Detecting Garbage

1. **Morning:** Officer goes out with phone
2. **Find garbage:** Officer sees garbage pile
3. **Click "Take Photo"**: Captures image and GPS
4. **Click "Upload"**: Data sent to server
5. **Confirmation**: Green success message
6. **Back at office:** Officers see report on dashboard
7. **Driver assignment**: System assigns collection task
8. **Collection:** Driver completes task with proof photo

### Timeline:
- 9:00 AM - Officer uploads detection
- 9:05 AM - Alert sent to Municipal Officer
- 9:30 AM - Driver assigned & en route
- 10:00 AM - Collection completed
- 10:05 AM - Status marked "Resolved"

---

## Data Visibility

### What You Can See

**From Mobile Camera Page:**
- Your device info
- Recent uploads
- Detection count
- Status (Active/Inactive)

**From CCTV Dashboard:**
- All mobile detections
- Confidence scores
- Images & timestamps
- Detection type

**From Map:**
- Mobile camera locations
- Live GPS tracking
- Cluster view of detections

**From Reports:**
- All citizen + mobile detections
- Filterable by source
- Assignable to drivers

---

## Best Practices

1. **Clear Photos:** Make sure garbage is clearly visible
2. **Good Lighting:** Take photos in daylight when possible
3. **GPS Accuracy:** Wait 10 seconds for GPS to lock
4. **File Size:** Compress large photos (< 5MB)
5. **Naming:** Use descriptive device names
6. **Regular Use:** Upload frequently for better coverage

---

## Performance Tips

- Phone battery: Takes ~2% per upload
- Data usage: ~500KB per image upload
- Speed: ~2-5 seconds per upload on 4G
- Storage: No storage needed (stored on server)

---

## Security Notes

- ✅ Images stored securely in database
- ✅ GPS locations tracked
- ✅ Device ID prevents impersonation
- ✅ Timestamps verify when uploaded
- ✅ Only authorized users can view

---

## Next Steps

1. ✅ Setup database schema
2. ✅ Visit mobile camera page
3. ✅ Register device
4. ✅ Enable GPS
5. ✅ Upload first image
6. ✅ Check dashboard for confirmation
7. Monitor detections in real-time
8. Integrate with collection teams

---

## Support

For issues or questions:
- Check this guide's **Troubleshooting** section
- Contact development team
- Email: support@cleancity.local

**Happy detecting! 📱📷🗑️**
