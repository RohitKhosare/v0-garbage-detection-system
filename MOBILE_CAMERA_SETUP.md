# Mobile Camera Setup Guide for CleanCity AI

## Quick Overview

You can now connect your mobile phone as a live CCTV camera to CleanCity AI. Your phone's camera feed will appear in a single-column layout optimized for mobile viewing.

---

## How to Connect Your Mobile Camera

### Step 1: Install Mobile Camera App

**For Android:**
- Download **IP Webcam** (by Pavel Khudov)
  - Link: https://play.google.com/store/apps/details?id=com.pas.webcam
  - Free version available

**For iOS:**
- Download **Codeshot**
  - Link: https://apps.apple.com/app/codeshot/id1444987967
  - Alternative: **iVCam** by E2eSoft

**For Any Phone (Web-based):**
- Use **DailyWebcam** - works on any phone with browser

### Step 2: Enable Live Streaming

**Android (IP Webcam):**
1. Open the IP Webcam app
2. Tap the red "Start Server" button
3. App will show: `http://192.168.X.X:8080`
4. Keep this URL for Step 3

**iOS (Codeshot):**
1. Open Codeshot app
2. Tap "Settings" ⚙️
3. Enable "HTTP Server"
4. Copy the IP address shown (e.g., `http://192.168.X.X:8080`)

### Step 3: Get Your Stream URL

The URL format depends on your app:

**IP Webcam (Android):**
- Main feed: `http://192.168.X.X:8080/video`
- MJpeg feed: `http://192.168.X.X:8080`

**Codeshot (iOS):**
- Stream: `http://192.168.X.X:8080/stream`

**Important:** 
- Replace `192.168.X.X` with your actual phone IP
- Your phone must be on the SAME WiFi network as your device
- Port `8080` is default (may vary by app)

### Step 4: Add to CleanCity AI

1. Go to CCTV Monitoring page
2. Scroll to "How to Connect Your Mobile Camera"
3. Click **"Add Mobile Camera"** button
4. Paste your stream URL
5. Click **"Connect"**
6. Your live camera feed will appear!

---

## Finding Your Phone's IP Address

### Android:
1. Open IP Webcam app
2. The IP is displayed at the top (e.g., `192.168.0.100`)

### iOS:
1. Open Settings → WiFi
2. Tap your WiFi network
3. Your IP shows next to "IP Address"

### Windows/Mac (to find Android phone):
1. Open Command Prompt / Terminal
2. Type: `ping [your_phone_name]` 
3. Or use: `arp -a` to list all devices on network

---

## URL Examples

| App | URL Format |
|-----|-----------|
| IP Webcam (Android) | `http://192.168.0.105:8080/video` |
| Codeshot (iOS) | `http://192.168.0.110:8080/stream` |
| Generic MJPEG | `http://192.168.1.50:8080/stream.mjpg` |

---

## Testing Your URL

Before adding to CleanCity AI, test your URL:

1. **On the same WiFi:**
   - Open web browser
   - Paste your URL
   - Press Enter
   - You should see your camera feed

2. **If it doesn't work:**
   - Check phone IP address
   - Ensure app is still running on phone
   - Check WiFi connection (both devices same network?)
   - Try port 8081 or 8888 instead of 8080

---

## Troubleshooting

### "Camera Won't Connect"
- ✓ Phone and computer on same WiFi
- ✓ Mobile camera app is running
- ✓ Phone screen is on (apps may sleep)
- ✓ Correct IP address and port
- ✓ Try disabling phone firewall

### "URL works in browser but not in app"
- Some apps need specific format
- Try adding `/video` or `/stream` at end
- Example: `http://192.168.0.100:8080/video`

### "Stream is very slow/laggy"
- Lower video quality in camera app
- Reduce resolution to 320x240
- Check WiFi signal strength
- Close other apps on phone

### "Lost connection suddenly"
- Phone may have gone to sleep
- WiFi connection dropped
- App crashed (restart it)
- Try refreshing CCTV page

---

## Security Tips

1. **Local Network Only:**
   - Stream only works on your local WiFi
   - Not accessible from internet (secure)

2. **Close App When Not Needed:**
   - Closes the streaming server
   - Prevents battery drain on phone

3. **Use Strong WiFi Password:**
   - Only authorized people can access stream

4. **Disable When Away:**
   - Turn off camera app when leaving home
   - Prevents unauthorized access

---

## Advanced: Port Forwarding (For Remote Access)

If you want to access camera from outside your network:

1. Find your router's public IP
2. Configure port forwarding in router settings
3. Forward port 8080 to your phone's local IP
4. Use: `http://[PUBLIC_IP]:8080/video`

**Warning:** This exposes your camera to internet. Use VPN for security!

---

## Recommended Apps by Platform

### Android
- **IP Webcam** ⭐⭐⭐⭐⭐ (Best)
- **RTSP Server** - For advanced streaming
- **DroidCam** - Works with USB cable too

### iOS
- **Codeshot** ⭐⭐⭐⭐⭐ (Best)
- **EpocCam** - Premium quality
- **iVCam** - Good alternative

### Any Phone (Web-based)
- **DailyWebcam** - No installation needed

---

## Next Steps

1. Install app on your phone
2. Start streaming
3. Copy the URL
4. Add to CleanCity AI CCTV page
5. Monitor live garbage in your area!

**Your mobile camera will display in a single-column layout, perfect for landscape or portrait viewing on any device.**

---

## Questions?

If you need help:
- Check your phone's WiFi is connected
- Verify app is in foreground (not sleeping)
- Try restarting the app
- Check port number in app settings

Your mobile camera is now part of the CleanCity AI network!
