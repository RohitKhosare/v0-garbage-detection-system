# CleanCity AI Backend

Production-ready FastAPI backend for AI-powered garbage detection, tracking, and collection optimization system.

## Features

- **AI Detection**: YOLOv8 computer vision for garbage identification
- **Real-time Updates**: WebSocket support for live notifications
- **Image Storage**: AWS S3 integration for scalable storage
- **Route Optimization**: Intelligent garbage collection route planning
- **IoT Integration**: Smart bin sensors with automatic status updates
- **Geographic Heatmaps**: Visualize garbage hotspots and trends
- **Role-Based Access**: Multi-user authentication with permissions
- **PostgreSQL**: Reliable relational database with full-text search
- **Docker Ready**: Production-grade containerization
- **AWS Deployment**: EC2, RDS, S3, CloudWatch integration

## Tech Stack

- **Framework**: FastAPI 0.104.1
- **Database**: PostgreSQL 15
- **AI/ML**: YOLOv8 (Ultralytics)
- **Image Processing**: OpenCV, Pillow
- **Storage**: AWS S3
- **Authentication**: JWT (python-jose)
- **Container**: Docker & Docker Compose
- **Server**: Uvicorn
- **ORM**: SQLAlchemy 2.0

## Quick Start

### Development

```bash
# Clone repository
git clone <repo-url>
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your settings

# Start local PostgreSQL
docker run -d \
  -e POSTGRES_USER=cleancity \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=garbage_detection \
  -p 5432:5432 \
  postgres:15

# Run development server
uvicorn app.main:app --reload

# Visit http://localhost:8000
```

### Docker

```bash
# Build and run with Docker Compose
docker-compose up -d

# View logs
docker logs -f cleancity_ai_backend

# Stop services
docker-compose down
```

## API Endpoints

All endpoints require JWT authentication (except `/health`, `/login`, `/register`)

### Authentication
- `POST /api/v1/auth/register` - Register user
- `POST /api/v1/auth/login` - Login and get token
- `GET /api/v1/auth/me` - Get current user

### Detection
- `POST /api/v1/detect` - Upload image and detect garbage
- `GET /api/v1/detections` - Get detection history
- `GET /api/v1/detections/{id}` - Get single detection
- `PATCH /api/v1/detections/{id}` - Update detection status

### Bins
- `GET /api/v1/bins` - Get all garbage bins
- `GET /api/v1/bins/{id}` - Get bin details
- `POST /api/v1/bin-update` - IoT sensor update (no auth)
- `GET /api/v1/bins/{id}/history` - Get fill level history

### Heatmap
- `GET /api/v1/heatmap` - Get garbage hotspot map
- `GET /api/v1/heatmap/radius` - Get detections in radius

### Routes
- `POST /api/v1/optimize-route` - Optimize collection route
- `POST /api/v1/routes` - Create collection route
- `GET /api/v1/routes/{id}` - Get route details
- `PATCH /api/v1/routes/{id}/assign/{driver_id}` - Assign to driver
- `PATCH /api/v1/routes/{id}/status` - Update route status

### Health
- `GET /health` - Health check (no auth)

## Environment Configuration

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/garbage_detection
DATABASE_ECHO=False

# JWT Authentication
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# AWS Credentials
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
S3_BUCKET_NAME=cleancity-ai-images
S3_IMAGE_PREFIX=detections/

# YOLOv8 Model
YOLO_MODEL=yolov8m.pt
YOLO_CONFIDENCE_THRESHOLD=0.5

# Server
HOST=0.0.0.0
PORT=8000
DEBUG=False
CORS_ORIGINS=["http://localhost:3000"]

# API Info
API_TITLE=CleanCity AI - Backend API
API_VERSION=1.0.0
```

## Project Structure

```
backend/
├── app/
│   ├── api/                 # API endpoints
│   │   ├── auth.py         # Authentication endpoints
│   │   ├── detection.py    # Garbage detection endpoints
│   │   ├── bins.py         # Smart bin endpoints
│   │   ├── heatmap.py      # Heatmap endpoints
│   │   ├── routes.py       # Route optimization endpoints
│   │   └── health.py       # Health check
│   ├── services/           # Business logic
│   │   ├── yolo.py        # YOLOv8 detection service
│   │   ├── s3.py          # AWS S3 service
│   │   └── routing.py      # Route optimization service
│   ├── models.py           # SQLAlchemy models
│   ├── schemas.py          # Pydantic validation schemas
│   ├── security.py         # JWT authentication
│   ├── database.py         # Database configuration
│   ├── config.py           # Environment configuration
│   └── main.py             # FastAPI application
├── tests/                  # Unit and integration tests
├── requirements.txt        # Python dependencies
├── Dockerfile              # Docker image configuration
├── docker-compose.yml      # Multi-container setup
├── .env.example            # Environment template
├── DEPLOYMENT.md           # AWS EC2 deployment guide
├── BACKEND_API_GUIDE.md    # Complete API documentation
└── README.md               # This file
```

## Development

### Running Tests

```bash
# Install test dependencies
pip install pytest pytest-asyncio

# Run all tests
pytest

# Run with coverage
pytest --cov=app

# Run specific test file
pytest tests/test_auth.py
```

### Database Migrations

```bash
# Initialize Alembic (first time)
alembic init alembic

# Create migration
alembic revision --autogenerate -m "Add new table"

# Apply migrations
alembic upgrade head

# Rollback
alembic downgrade -1
```

### Code Quality

```bash
# Format code
black app/

# Lint
flake8 app/

# Type checking
mypy app/
```

## Deployment

### AWS EC2 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions:

1. Launch EC2 instance (t3.medium+)
2. Install Docker and Docker Compose
3. Configure environment variables
4. Create RDS PostgreSQL database
5. Setup S3 bucket for images
6. Configure Nginx reverse proxy
7. Enable HTTPS with Let's Encrypt
8. Setup monitoring with CloudWatch

### Using Startup Script

```bash
chmod +x startup.sh
./startup.sh
```

### Manual Deployment

```bash
# Pull latest code
git pull origin main

# Build Docker image
docker build -t cleancity-ai-backend:latest .

# Start with Docker Compose
docker-compose up -d

# View status
docker-compose ps
docker logs -f cleancity_ai_backend
```

## Monitoring and Logging

### Application Logs

```bash
# View real-time logs
docker logs -f cleancity_ai_backend

# Export logs
docker logs cleancity_ai_backend > backup.log

# Check specific log level
docker logs cleancity_ai_backend | grep ERROR
```

### Database Health

```bash
# Connect to database
psql -h localhost -U cleancity -d garbage_detection

# Check connections
SELECT datname, count(*) FROM pg_stat_activity GROUP BY datname;

# Vacuum and analyze
VACUUM ANALYZE;
```

### Performance Monitoring

```bash
# Docker container stats
docker stats cleancity_ai_backend

# Disk usage
df -h
du -sh /var/lib/docker

# System resources
top
free -h
```

## Security Best Practices

- [ ] Change default JWT secret in production
- [ ] Use strong database passwords
- [ ] Enable HTTPS only (redirect HTTP)
- [ ] Restrict API CORS origins
- [ ] Use AWS IAM roles instead of access keys
- [ ] Enable database encryption
- [ ] Setup firewall rules (Security Groups)
- [ ] Regular security audits
- [ ] Keep dependencies updated
- [ ] Monitor CloudWatch alarms

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker logs cleancity_ai_backend

# Common issues:
# 1. Database connection: Check DATABASE_URL and RDS security groups
# 2. Port conflict: Change PORT in .env
# 3. Missing env vars: Copy .env.example and configure
```

### Database Connection Timeout

```bash
# Test connection
psql -h your-rds-endpoint -U admin -d garbage_detection

# Check security group
aws ec2 describe-security-groups --group-ids sg-xxxxx

# Verify RDS endpoint
aws rds describe-db-instances --query 'DBInstances[0].Endpoint'
```

### Out of Memory

```bash
# Check Docker memory usage
docker stats

# Increase Docker memory limit in docker-compose.yml
# Or increase instance type (t3.medium → t3.large)
```

### S3 Upload Failures

```bash
# Test S3 access
aws s3 ls s3://bucket-name/

# Check IAM policy
aws iam get-user-policy --user-name cleancity-api --policy-name S3Access

# Verify bucket exists and is accessible
aws s3api get-bucket-acl --bucket bucket-name
```

## Performance Tuning

### FastAPI
- Increase worker processes: `workers = cpu_count * 2 + 1`
- Increase timeout: `timeout = 120`
- Enable compression: `gzip_level = 6`

### PostgreSQL
- Increase max_connections: `300`
- Increase shared_buffers: `256MB`
- Enable connection pooling (PgBouncer)

### Docker
- Allocate sufficient CPU cores
- Allocate 4GB+ RAM
- Use SSD storage
- Enable log rotation

## Contributing

1. Create feature branch: `git checkout -b feature/description`
2. Make changes and commit: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/description`
4. Submit pull request

## Testing Checklist

- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Code formatted with black
- [ ] Linting passes (flake8)
- [ ] No type errors (mypy)
- [ ] API endpoints documented
- [ ] Performance tested
- [ ] Security reviewed

## Production Checklist

- [ ] Environment variables set
- [ ] Database backups configured
- [ ] S3 bucket policies verified
- [ ] SSL certificate installed
- [ ] CORS origins configured
- [ ] Logging enabled
- [ ] Monitoring configured
- [ ] Backup and disaster recovery tested
- [ ] Load tested
- [ ] Security audit completed

## Performance Benchmarks

- Detection: ~500ms per image (YOLOv8m)
- Route optimization: ~100ms for 50 bins
- Database query: <100ms (indexed)
- API response: <200ms (average)

## Scalability

Horizontally scalable architecture:

```
Load Balancer (ALB)
├── EC2 Instance 1 (API)
├── EC2 Instance 2 (API)
└── EC2 Instance N (API)
    └── RDS PostgreSQL (Primary + Read Replicas)
    └── S3 (Image Storage)
```

Auto-scaling groups handle traffic spikes.

## Support

- API Documentation: `/docs` (Swagger)
- API Schema: `/openapi.json`
- Report Issues: GitHub Issues
- Documentation: See README files in project

## License

Proprietary - CleanCity AI

## Changelog

### v1.0.0 (2024-01-20)
- Initial production release
- All core APIs implemented
- YOLOv8 integration
- AWS deployment ready
- Docker containerization
- Complete documentation

---

**Last Updated**: 2024-01-20  
**Maintainer**: CleanCity AI Team  
**Version**: 1.0.0
