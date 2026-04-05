# CleanCity AI - Complete Installation & Setup Guide

## System Requirements

- **Node.js**: v18.0 or higher
- **npm/yarn/pnpm**: Latest version
- **Browser**: Modern browser (Chrome, Firefox, Safari, Edge)
- **Disk Space**: 500MB minimum
- **RAM**: 2GB minimum for development

## Installation Steps

### 1. Download/Clone Project

\`\`\`bash
# If you have the code as files
cd cleancity-ai

# Or if cloning from Git
git clone <repository-url>
cd cleancity-ai
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
# or
yarn install
# or
pnpm install
\`\`\`

### 3. Start Development Server

\`\`\`bash
npm run dev
\`\`\`

The application will start at: **http://localhost:3000**

## First Time Setup

### Step 1: Create Test Accounts

1. Go to http://localhost:3000
2. Click "Sign Up"
3. Create accounts with different roles:
   - **Citizen**: First user for testing reporting
   - **Officer**: For testing municipal dashboard
   - **Driver**: For testing vehicle management

### Step 2: Test Report Submission

1. Login as Citizen
2. Click "Report Issue"
3. Fill in the form with test data
4. Submit report
5. You should be redirected to the map

### Step 3: Test Officer Dashboard

1. Login as Officer
2. Go to "Dashboard"
3. You should see the report you just created
4. Try assigning it to a vehicle

### Step 4: Test Driver Interface

1. Login as Driver
2. Go to "My Tasks"
3. You should see assigned tasks
4. Try starting and completing tasks

## Project Structure Overview

\`\`\`
cleancity-ai/
├── app/                          # Next.js app directory
│   ├── page.tsx                 # Homepage
│   ├── layout.tsx               # Root layout
│   ├── globals.css              # Global styles
│   ├── api/                     # API routes
│   ├── login/                   # Login page
│   ├── register/                # Registration page
│   ├── report/                  # Report submission
│   ├── map/                     # Map view
│   ├── municipal/               # Officer dashboard
│   ├── vehicles/                # Driver tasks
│   ├── cctv/                    # CCTV monitoring
│   └── alerts/                  # Alerts page
├── components/
│   ├── navigation.tsx           # Main navigation
│   ├── auth-system.tsx          # Auth context
│   └── ui/                      # UI components
├── lib/
│   ├── db.ts                    # Database schemas
│   └── auth-utils.ts            # Auth utilities
├── public/                      # Static files
├── package.json
├── tsconfig.json
├── next.config.mjs
└── README.md
\`\`\`

## Common Issues & Solutions

### Issue: "Port 3000 already in use"

**Solution:**
\`\`\`bash
# Use a different port
npm run dev -- -p 3001

# Or kill the process using port 3000
# On macOS/Linux:
lsof -ti:3000 | xargs kill -9

# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
\`\`\`

### Issue: "npm install fails"

**Solution:**
\`\`\`bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and try again
rm -rf node_modules package-lock.json
npm install
\`\`\`

### Issue: "localStorage is not defined"

**Solution:**
This is normal in server-side rendering. The app handles this automatically. If you see this error:
- Clear browser cache
- Check browser console
- Ensure JavaScript is enabled

### Issue: "Auth token not working"

**Solution:**
\`\`\`bash
# Clear localStorage in browser DevTools
# Application → LocalStorage → Clear all

# Then try logging in again
\`\`\`

## Development Commands

\`\`\`bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting (if configured)
npm run lint

# Run tests (if configured)
npm test
\`\`\`

## Browser DevTools Tips

### Check Authentication
1. Open DevTools (F12)
2. Go to "Application" tab
3. Check "Local Storage"
4. Look for "authToken" and "currentUser"

### Monitor API Calls
1. Open DevTools Network tab
2. Filter by "Fetch/XHR"
3. Watch API calls in real-time

### Debug Components
1. Install React DevTools browser extension
2. Use React tab to inspect components
3. Check props and state

## Testing the API

### Using curl (Command Line)

\`\`\`bash
# Register user
curl -X POST http://localhost:3000/api/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{"email":"test@example.com","password":"pass123","name":"Test User","role":"citizen"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email":"test@example.com","password":"pass123"}'

# Get all reports
curl http://localhost:3000/api/reports

# Create report
curl -X POST http://localhost:3000/api/reports \\
  -H "Content-Type: application/json" \\
  -d '{
    "userId":"user_123",
    "title":"Test Report",
    "description":"Test",
    "latitude":40.7580,
    "longitude":-73.9855,
    "category":"general"
  }'
\`\`\`

### Using Postman

1. Download Postman: https://www.postman.com/downloads/
2. Create new collection "CleanCity AI"
3. Add requests:
   - POST /api/auth/login
   - GET /api/reports
   - POST /api/reports
   - etc.

## Performance Tips

### For Faster Development

1. **Use pnpm instead of npm**: \`npm install -g pnpm\`
2. **Enable SSD**: Store project on SSD for faster builds
3. **Increase Node memory**: \`NODE_OPTIONS=--max_old_space_size=4096 npm run dev\`

### For Better Experience

1. Close unused browser tabs
2. Disable unused extensions
3. Use Chrome for best DevTools experience
4. Clear browser cache periodically

## Next Steps

### Ready to Customize?

1. **Change Colors**: Edit \`app/globals.css\`
2. **Add Features**: Create new API routes in \`app/api/\`
3. **Modify Pages**: Edit page files in \`app/\`
4. **Add Components**: Create in \`components/\`

### Ready to Deploy?

1. Read \`DEPLOYMENT.md\`
2. Choose deployment platform
3. Configure environment variables
4. Deploy!

### Ready to Integrate Database?

1. Read \`API_DOCUMENTATION.md\`
2. Choose PostgreSQL or MySQL
3. Update \`lib/db.ts\` with connection
4. Run migrations

## Getting Help

### Documentation Files

- **README.md** - Project overview
- **API_DOCUMENTATION.md** - Complete API reference
- **DEPLOYMENT.md** - Deployment guide
- **ARCHITECTURE.md** - System design
- **This file** - Installation & setup

### Quick Reference

**Citizen Features**
- Report issues with photos and GPS
- View report status on map
- Track cleanup progress

**Officer Features**
- Dashboard with all reports
- Filter and search reports
- Assign vehicles to reports
- Monitor CCTV feeds
- View statistics

**Driver Features**
- View assigned tasks
- Navigate to locations
- Update task status
- Submit proof photos

**Admin Features**
- Full system access
- User management
- System configuration

## Verification Checklist

After installation, verify:

- [ ] Dev server running at localhost:3000
- [ ] Can access homepage
- [ ] Can create account
- [ ] Can login/logout
- [ ] Can submit report
- [ ] Can view map
- [ ] Can access dashboard (as officer)
- [ ] Can view tasks (as driver)
- [ ] API responses in Network tab
- [ ] No console errors

## System Information to Report Issues

If you encounter issues:

1. **Node version**: \`node --version\`
2. **npm version**: \`npm --version\`
3. **OS**: Windows/macOS/Linux
4. **Browser**: Chrome/Firefox/Safari/Edge version
5. **Console errors**: Screenshot or copy from DevTools
6. **Steps to reproduce**: Exact steps that cause issue

---

**You're all set! Happy coding!**

If you have questions, check the other documentation files or create an issue.
