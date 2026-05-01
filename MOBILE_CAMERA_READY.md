# Mobile Camera Integration - READY TO USE

## What's New

Your CleanCity AI CCTV page now supports **single mobile camera streaming** optimized for mobile phone cameras.

---

## Quick Start - 3 Steps

### Step 1: Install Mobile Camera App
Choose one based on your phone:

**Android:**
- Download: **IP Webcam** (Free)
- Get it: Google Play Store

**iOS:**
- Download: **Codeshot** (Free)
- Get it: Apple App Store

### Step 2: Get Your Stream URL
1. Open the app on your phone
2. Start streaming (Red button / Toggle "ON")
3. App will show: `http://192.168.X.X:8080`

### Step 3: Add to CleanCity AI
1. Go to: `/cctv` (CCTV Monitoring page)
2. Click: "Add Mobile Camera" button
3. Paste: Your stream URL
4. Click: "Connect"

**Done! Your live camera appears below.**

---

## Layout Changes

### Before:
- Grid: 3 columns (desktop), 2 columns (tablet), 1 column (mobile)
- Multiple fixed CCTV cameras

### After:
- Grid: **1 column only** (optimized for mobile cameras)
- Single mobile camera focus
- Full-width camera feed
- Mobile-friendly interface

---

## Camera App URLs

| App | URL Format | Notes |
|-----|-----------|-------|
| IP Webcam (Android) | `http://192.168.0.105:8080/video` | Most popular |
| Codeshot (iOS) | `http://192.168.0.110:8080/stream` | Recommended for iOS |
| DailyWebcam | `http://192.168.1.50:8080` | No app install needed |

---

## Finding Your Phone's IP

### Easy Way (Android - IP Webcam):
1. Open IP Webcam
2. IP shown at top of app (e.g., `192.168.0.100`)

### Easy Way (iOS):
1. Settings → WiFi
2. Tap your network
3. Copy "IP Address"

### All Phones:
- Look for "192.168.X.X" format
- Last number usually 100-200

---

## Features

✓ Single column layout (mobile optimized)
✓ Real-time video streaming
✓ Full screen view available
✓ Camera status indicator
✓ Local network streaming (secure)
✓ Works with any IP camera app

---

## Important Notes

1. **Same WiFi Required:**
   - Phone and computer must be on same network
   - Won't work across different networks

2. **Phone Must Be Running:**
   - App must stay active (foreground)
   - Don't lock screen (disable auto-lock)
   - Screen brightness on

3. **URL Format:**
   - Always starts with `http://` (not https)
   - Includes IP and port (usually :8080)
   - May need `/video` or `/stream` at end

4. **Security:**
   - Only works on local WiFi (not internet)
   - No external access (safe)
   - Turn off app when not needed

---

## Troubleshooting

**Camera won't connect?**
- Both on same WiFi? ✓
- App still running? ✓
- Correct IP/port? ✓
- Try browser first: `http://192.168.x.x:8080`

**Stream is laggy?**
- Lower video quality in app
- Reduce resolution to 480p
- Check WiFi signal

**Lost connection?**
- Phone may have slept
- App may have crashed
- WiFi disconnected
- Try refreshing page

---

## File Updated

- `/app/cctv/page.tsx` - Single column layout + connection guide

## Documentation Created

- `/MOBILE_CAMERA_SETUP.md` - Full step-by-step guide (211 lines)
- `/MOBILE_CAMERA_READY.md` - This quick reference

---

## Test It Now

```bash
npm run dev
# Open http://localhost:3000/cctv
# See "How to Connect Your Mobile Camera" section
# Follow 3 steps above
```

---

## Next: Advanced Features (Future)

- Multiple mobile cameras (grid view)
- Recording and snapshots
- Motion detection
- Cloud backup
- Remote access via VPN

---

## Your CCTV Page Now:

✓ Single mobile camera column
✓ Clear connection instructions
✓ Full-width video display
✓ Camera status badges
✓ AI detection capability
✓ Mobile-optimized layout

**Your garbage monitoring system now has a mobile camera feed!**
