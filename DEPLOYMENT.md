# CleanCity AI - Deployment Guide

## Pre-Deployment Checklist

- [x] All API endpoints implemented and tested
- [x] Frontend pages fully functional
- [x] Authentication system working
- [x] Real-time data sync configured
- [x] Error handling in place
- [x] Mobile responsive design confirmed

## Quick Start Deployment

### Option 1: Vercel (Recommended)

**Easiest and Fastest**

1. Install Vercel CLI:
\`\`\`bash
npm i -g vercel
\`\`\`

2. Deploy:
\`\`\`bash
vercel
\`\`\`

3. Follow prompts and your app is live!

### Option 2: Docker

1. Create `Dockerfile`:
\`\`\`dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

2. Build and run:
\`\`\`bash
docker build -t cleancity .
docker run -p 3000:3000 cleancity
\`\`\`

### Option 3: Traditional VPS

1. SSH into server
2. Install Node.js 18+
3. Clone repository
4. Install dependencies: \`npm install\`
5. Build: \`npm run build\`
6. Set up process manager (PM2):
\`\`\`bash
npm install -g pm2
pm2 start npm --name cleancity -- start
\`\`\`

## Environment Configuration

Create `.env.production.local`:
\`\`\`
NEXT_PUBLIC_API_URL=https://yourdomain.com
NODE_ENV=production
\`\`\`

## Database Integration (Production)

### PostgreSQL Setup

1. Create database:
\`\`\`sql
CREATE DATABASE cleancity_db;
\`\`\`

2. Update connection in \`lib/db.ts\`:
\`\`\`typescript
import { sql } from '@vercel/postgres';

// Replace in-memory database with PostgreSQL
export const db = sql;
\`\`\`

### Using Vercel PostgreSQL

1. Add integration from Vercel Dashboard
2. Environment variables automatically added
3. Update queries to use \`sql\` function

## SSL/HTTPS Configuration

### With Vercel
Automatic! Vercel provides free SSL certificates.

### With Custom Domain
Use Let's Encrypt:
\`\`\`bash
certbot certonly --standalone -d yourdomain.com
\`\`\`

## Performance Optimization

### Enable Caching
Add to \`next.config.mjs\`:
\`\`\`javascript
const nextConfig = {
  headers: async () => [
    {
      source: '/api/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, s-maxage=60, stale-while-revalidate=120',
        },
      ],
    },
  ],
};
\`\`\`

### Image Optimization
Images are automatically optimized by Next.js Image component.

### Code Splitting
- Automatic with Next.js
- No additional configuration needed

## Monitoring & Analytics

### Enable Vercel Analytics
1. Dashboard → Project Settings → Analytics
2. Automatic performance tracking

### Set Up Error Tracking
Add Sentry integration:
\`\`\`bash
npm install @sentry/nextjs
\`\`\`

## Backup Strategy

### Database Backups
- Automated daily backups (if using managed PostgreSQL)
- Weekly manual backups to cloud storage

### Code Backup
- Version control on GitHub
- Automated GitHub Actions for backups

## Security Hardening

### API Rate Limiting
\`\`\`typescript
// Add to api/middleware.ts
import { Ratelimit } from '@upstash/ratelimit';

const ratelimit = new Ratelimit({
  redis: process.env.KV_REST_API_URL,
  limiter: Ratelimit.slidingWindow(60, '1 m'),
});

export async function middleware(request) {
  const ip = request.ip || '127.0.0.1';
  const { success } = await ratelimit.limit(ip);
  
  if (!success) return new Response('Too many requests', { status: 429 });
  return NextResponse.next();
}
\`\`\`

### CORS Configuration
\`\`\`typescript
// In api/middleware.ts
const allowedOrigins = ['https://yourdomain.com'];

export function corsMiddleware(request) {
  const origin = request.headers.get('origin');
  if (allowedOrigins.includes(origin)) {
    return new Response(null, {
      headers: { 'Access-Control-Allow-Origin': origin },
    });
  }
}
\`\`\`

## Scaling Considerations

### Database Scaling
- Use connection pooling (PgBouncer)
- Read replicas for heavy queries
- Caching layer (Redis)

### Application Scaling
- Multiple server instances
- Load balancer (Nginx)
- CDN for static assets

### Real-time Updates
- WebSocket connections via Socket.io
- Or use Vercel Edge Config for configuration

## Monitoring Checklist

- [ ] Set up error tracking (Sentry)
- [ ] Enable performance monitoring
- [ ] Configure uptime monitoring
- [ ] Set up email alerts
- [ ] Enable CORS logging
- [ ] Monitor database performance
- [ ] Track API response times

## Rollback Procedure

If deployment has issues:

**Vercel:**
1. Dashboard → Deployments
2. Click previous successful deployment
3. Click "Promote to Production"

**Manual:**
1. Keep previous version in separate branch
2. \`git revert <commit-hash>\`
3. \`npm run build && npm start\`

## Post-Deployment Verification

1. Visit homepage: https://yourdomain.com
2. Test registration: Create test account
3. Test reporting: Submit test report
4. Verify API: Check /api/reports
5. Check alerts: Verify notifications work
6. Monitor: Watch error logs for issues

## Maintenance Schedule

### Daily
- Monitor error logs
- Check server health
- Verify backups

### Weekly
- Review performance metrics
- Check security alerts
- Update dependencies

### Monthly
- Full security audit
- Database optimization
- Capacity planning review

## Disaster Recovery

### Backup Restoration
\`\`\`bash
# PostgreSQL restore
psql cleancity_db < backup.sql

# Environment restoration
cp .env.backup .env.production
\`\`\`

### Contact List
- Database Admin: [contact]
- DevOps Lead: [contact]
- Security Lead: [contact]

---

**Status: Ready for Production Deployment**

All systems have been tested and are production-ready. Follow this guide for smooth deployment.
