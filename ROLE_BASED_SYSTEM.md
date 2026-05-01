# Role-Based Dashboard System

Your CleanCity AI now features a complete role-based authentication and dashboard system. Users are automatically routed to their role-specific interface after login.

## System Overview

The website now implements a 3-tier role-based system:

1. **Citizens/Garbage Reporters** - Report garbage locations
2. **Municipal Coordinators** - Manage city-wide operations
3. **Garbage Collectors** - Collect waste and complete tasks

## How It Works

### 1. Login Flow
- User goes to home page (/)
- Redirected to login page if not authenticated
- After login, redirected to role-specific dashboard

### 2. Registration Flow
- User selects their role during registration:
  - Citizen - Report Garbage
  - Municipal Coordinator - Manage operations
  - Garbage Collector - Collect waste
- Role is stored in user metadata
- Dashboard automatically routes based on role

### 3. Dashboard Routing
- Main dashboard checks user role
- Automatically redirects to:
  - `/dashboard-citizen` for reporters
  - `/dashboard-municipal` for coordinators
  - `/dashboard-collector` for collectors

## Role-Specific Interfaces

### Citizen Dashboard (`/dashboard-citizen`)
**Purpose:** Allow citizens to report garbage and track their submissions

**Features:**
- Submit new garbage reports with photos and GPS
- View all their reports and status
- Track completion of reported garbage
- View live map of all reports
- Monitor CCTV feeds
- Statistics: Total reports, pending, in-progress, resolved

**Key Actions:**
- Create garbage report
- View live map
- Monitor CCTV feeds

### Municipal Coordinator Dashboard (`/dashboard-municipal`)
**Purpose:** Manage city-wide garbage collection operations

**Features:**
- Overview of all reports city-wide
- Manage and assign collection tasks
- Track active collection vehicles
- View performance analytics
- Handle priority alerts
- Monitor CCTV coverage
- Statistics: Total reports, pending, active vehicles, resolved today

**Key Actions:**
- View live operations map
- Access analytics and reports
- Manage priority alerts
- Coordinate cleanup operations

### Garbage Collector Dashboard (`/dashboard-collector`)
**Purpose:** Track assigned collection tasks and report completion

**Features:**
- View assigned collection tasks
- See optimized collection routes
- Mark tasks as complete with proof
- Receive real-time priority alerts
- Track daily progress
- Statistics: Assigned tasks, in-progress, completed today, efficiency

**Key Actions:**
- View active routes
- Mark collection complete
- Receive priority alerts

## Technical Implementation

### Files Structure

```
/app
├── page.tsx                      → Redirects to login/dashboard
├── login/page.tsx                → Authentication page
├── register/page.tsx             → Registration with role selection
├── dashboard/page.tsx            → Role router (redirects to specific dashboard)
├── dashboard-citizen/page.tsx    → Citizen-specific interface
├── dashboard-municipal/page.tsx  → Municipal coordinator interface
├── dashboard-collector/page.tsx  → Garbage collector interface
├── report/page.tsx               → Report submission (for citizens)
├── map/page.tsx                  → Live map (all roles)
└── cctv/page.tsx                 → CCTV feeds (all roles)

/middleware.ts                    → Authentication middleware
```

### Authentication Flow

1. **Middleware** (`middleware.ts`)
   - Checks if user is authenticated
   - Redirects unauthenticated users to login
   - Refreshes sessions automatically

2. **Register Page** (`app/register/page.tsx`)
   - User selects role during signup
   - Role stored in Supabase auth metadata
   - Data structure: `user_metadata.role`

3. **Dashboard Router** (`app/dashboard/page.tsx`)
   - Reads user role from auth metadata
   - Routes to appropriate dashboard
   - Falls back to citizen dashboard

## Database Schema

User roles are stored in Supabase auth user metadata:

```json
{
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "user_metadata": {
      "name": "User Name",
      "role": "citizen" | "municipal" | "collector"
    }
  }
}
```

## Testing the System

### Test as Citizen
1. Register with role: "Citizen - Report Garbage"
2. See citizen dashboard
3. Can submit reports, view map, see CCTV

### Test as Municipal Coordinator
1. Register with role: "Municipal Coordinator"
2. See municipal operations dashboard
3. Can view all reports, analytics, manage alerts

### Test as Garbage Collector
1. Register with role: "Garbage Collector"
2. See collector dashboard
3. Can view routes, mark tasks complete, receive alerts

## Security Features

- Protected routes (middleware redirects to login)
- Role-based access control
- User metadata stored securely in Supabase
- Session management with automatic refresh
- Logout functionality on all dashboards

## Customization

To modify roles or add new ones:

1. **Update Register Page** - Add new SelectItem
2. **Update Dashboard Router** - Add new routing condition
3. **Create New Dashboard** - Create new page.tsx file
4. **Update Middleware** - Modify route protection if needed

## API Endpoints Used

All dashboards use these API endpoints:
- `GET /api/map/locations` - Fetch all report locations
- Supabase RLS policies for row-level security
- Real-time subscriptions for live updates

## Next Steps

1. Customize each dashboard UI/UX for your needs
2. Add more features specific to each role
3. Implement email notifications
4. Add analytics and reporting
5. Deploy to production

---

**Remember:** Each role has a completely different interface optimized for their specific job!
