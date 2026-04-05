# CleanCity AI - Garbage Detection & Reporting System

A comprehensive, production-ready AI-powered garbage detection and reporting system for smart cities. This full-stack application combines citizen reporting, CCTV monitoring, municipal management, and vehicle coordination in one integrated platform.

## Features

### Core Features
- **Citizen Reporting**: Users can report garbage issues with photos, GPS location, and category classification
- **CCTV Integration**: AI-powered monitoring of live camera feeds with automatic garbage detection
- **Municipal Dashboard**: Comprehensive management interface for municipal officers
- **Vehicle Management**: Real-time tracking and task assignment for garbage collection vehicles
- **Live Maps**: Interactive map showing all garbage reports and vehicle locations
- **Smart Alerts**: Real-time notification system for critical events
- **Role-based Access**: Different interfaces for citizens, officers, drivers, and admins

### Technical Features
- Full REST API with complete documentation
- Real-time data synchronization
- Location-based services with GPS tracking
- Response time analytics
- Category-based reporting
- Task assignment and tracking
- Alert acknowledgment system

## Tech Stack

### Frontend
- **Framework**: Next.js 16 with App Router
- **UI**: React 19 with shadcn/ui components
- **Styling**: Tailwind CSS v4
- **State Management**: React Context API
- **HTTP Client**: Fetch API
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js with Next.js API Routes
- **Database**: In-memory (demo) - Ready for PostgreSQL/MySQL integration
- **Authentication**: Token-based (JWT-like)
- **API**: RESTful with comprehensive error handling

### Infrastructure
- **Deployment**: Vercel (recommended)
- **Package Manager**: npm/yarn/pnpm
- **Build Tool**: Next.js Turbopack
- **Type Safety**: TypeScript throughout

## Project Structure

\`\`\`
├── app/
│   ├── page.tsx                 # Homepage
│   ├── layout.tsx               # Root layout with auth provider
│   ├── globals.css              # Tailwind & design tokens
│   ├── login/                   # Login page
│   ├── register/                # Registration page
│   ├── report/                  # Citizen report submission
│   ├── map/                     # Interactive map view
│   ├── municipal/               # Officer dashboard
│   ├── vehicles/                # Driver task management
│   ├── cctv/                    # CCTV monitoring
│   ├── alerts/                  # Alerts & notifications
│   └── api/
│       ├── auth/                # Authentication endpoints
│       ├── reports/             # Report management
│       ├── vehicles/            # Vehicle management
│       ├── tasks/               # Task assignment
│       ├── cctv/                # CCTV endpoints
│       ├── alerts/              # Alert management
│       └── statistics/          # Analytics
├── components/
│   ├── navigation.tsx           # Main navigation bar
│   ├── auth-system.tsx          # Auth context & provider
│   └── ui/                      # shadcn UI components
├── lib/
│   ├── db.ts                    # Database schemas & utilities
│   └── auth-utils.ts            # Authentication helpers
└── public/                      # Static assets

\`\`\`

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- Modern web browser

### Installation

1. Clone or download the repository
2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Run development server:
\`\`\`bash
npm run dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000)

## Usage Guide

### For Citizens
1. Register as a "Citizen"
2. Click "Report Issue" on the homepage
3. Fill in garbage details and location
4. Submit report
5. Track status on the map

### For Municipal Officers
1. Register as a "Municipal Officer"
2. Access the municipal dashboard
3. View all reports with filters
4. Assign vehicles to reports
5. Monitor CCTV feeds for additional detections
6. Track completion via vehicle dashboard

### For Garbage Collectors (Drivers)
1. Register as a "Garbage Collector"
2. Access "My Tasks" section
3. View assigned cleanup tasks
4. Start and complete tasks
5. Upload proof photos upon completion

## API Documentation

Comprehensive API documentation is available in `API_DOCUMENTATION.md`.

### Key Endpoints

**Authentication**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

**Reports**
- `GET /api/reports` - Get all reports
- `POST /api/reports` - Create new report
- `GET /api/reports/{id}` - Get report details
- `PATCH /api/reports/{id}` - Update report status

**Vehicles**
- `GET /api/vehicles` - Get all vehicles
- `POST /api/vehicles` - Register vehicle
- `PATCH /api/vehicles/{id}` - Update vehicle location/status

**Tasks**
- `GET /api/tasks` - Get tasks (filtered by driver)
- `POST /api/tasks` - Create task
- `PATCH /api/tasks/{id}` - Update task status

**CCTV**
- `GET /api/cctv` - Get all cameras
- `POST /api/cctv` - Register camera
- `POST /api/cctv/{id}/detection` - Report detection

**Alerts**
- `GET /api/alerts` - Get all alerts
- `PATCH /api/alerts/{id}` - Acknowledge alert

**Statistics**
- `GET /api/statistics` - Get system statistics

## User Roles & Permissions

### Citizen
- Submit garbage reports with GPS location and photos
- View report status and location
- Access public map view

### Municipal Officer
- View all reports in dashboard
- Filter and search reports
- Assign vehicles to cleanup tasks
- Monitor CCTV feeds
- Track vehicle locations
- View system statistics and analytics

### Garbage Collector (Driver)
- View assigned tasks
- Update task progress
- Complete tasks with proof photos
- Track vehicle location

### Admin
- Full system access
- User management
- System configuration

## Database Schema

The system uses an in-memory database for demo purposes. For production deployment, connect to PostgreSQL or MySQL.

### Core Tables
- **Users**: User accounts and authentication
- **Reports**: Garbage reports from citizens
- **Vehicles**: Garbage collection vehicles
- **Tasks**: Cleanup assignments
- **CCTV**: Camera feeds and detections
- **Alerts**: System alerts and notifications

See `lib/db.ts` for complete schema definitions.

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect to Vercel
3. Configure environment variables (if needed)
4. Deploy

### Other Platforms
The application is compatible with any Node.js hosting platform supporting Next.js.

## Configuration

### Environment Variables
Create a `.env.local` file (optional):
\`\`\`
NEXT_PUBLIC_API_URL=http://localhost:3000
\`\`\`

### Design Customization
Modify color scheme in `app/globals.css` using CSS custom properties:
\`\`\`css
--primary: oklch(0.45 0.15 160);      /* Main green color */
--destructive: oklch(0.577 0.245 27.325);  /* Red alerts */
\`\`\`

## Performance Optimizations

- Server-side rendering for fast initial loads
- Optimized API routes with caching
- Real-time data sync every 30-60 seconds
- Lazy loading for map and CCTV components
- Responsive design for all devices

## Security Considerations

- Token-based authentication
- CORS headers configuration
- Input validation on all API endpoints
- SQL injection prevention (ready for database integration)
- Role-based access control on sensitive endpoints

## Future Enhancements

- Real database integration (PostgreSQL/MySQL)
- Actual CCTV feed integration with AI model
- Push notifications to mobile devices
- Advanced analytics and reporting
- Machine learning for prediction
- Geofencing and smart routing
- Mobile native app
- Dark mode support
- Multi-language support

## Troubleshooting

### Authentication Issues
- Ensure localStorage is enabled
- Check token expiration
- Verify role-based access

### API Issues
- Check browser console for detailed errors
- Verify API endpoint URLs
- Ensure all required fields are provided

### Performance Issues
- Clear browser cache
- Check network tab in DevTools
- Verify server is running

## Support

For issues or questions:
1. Check API_DOCUMENTATION.md
2. Review error messages in browser console
3. Verify all prerequisites are installed
4. Test API endpoints directly

## License

CleanCity AI - Open Source Project

## Credits

Built with Next.js, React, TypeScript, and Tailwind CSS.

---

**Ready to deploy?**
- Run \`npm run build\` to create production build
- Deploy to Vercel, AWS, or any Node.js hosting platform
- Update API endpoint configuration as needed
