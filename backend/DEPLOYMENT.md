# CleanCity AI Backend - AWS EC2 Deployment Guide

## Overview

This guide provides step-by-step instructions to deploy the CleanCity AI FastAPI backend on AWS EC2 with PostgreSQL, Docker, and production configurations.

## Prerequisites

- AWS Account with EC2 access
- Domain name (optional but recommended)
- SSH client
- Docker knowledge (basic)

## Architecture

```
User/Frontend
    ↓
    ↓ HTTPS
    ↓
Load Balancer (AWS ALB)
    ↓
EC2 Instance(s)
    ├── Docker Container (FastAPI Backend)
    └── PostgreSQL (RDS or Docker)
         ↓
    AWS S3 (Image Storage)
```

## Step 1: Create EC2 Instance

### 1.1 Launch Instance

1. Go to AWS EC2 Dashboard
2. Click "Launch Instance"
3. **AMI Selection**: Choose "Ubuntu Server 22.04 LTS"
4. **Instance Type**: Select `t3.medium` (minimum) or `t3.large` for production
5. **Storage**: 50 GB (adjust for image storage)
6. **Security Group**: Create with rules:
   - SSH: 22 (your IP)
   - HTTP: 80 (0.0.0.0/0)
   - HTTPS: 443 (0.0.0.0/0)
   - Custom: 8000 (FastAPI, internal)
   - PostgreSQL: 5432 (if not using RDS)

### 1.2 Connect to Instance

```bash
chmod 400 your-key.pem
ssh -i your-key.pem ubuntu@your-ec2-public-ip
```

## Step 2: Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Nginx (reverse proxy)
sudo apt install nginx -y

# Install Let's Encrypt (SSL certificates)
sudo apt install certbot python3-certbot-nginx -y

# Verify installations
docker --version
docker-compose --version
```

## Step 3: Clone Repository and Setup

```bash
# Create app directory
mkdir -p ~/cleancity
cd ~/cleancity

# Clone repository (adjust URL as needed)
git clone <your-repo-url> .

# Navigate to backend
cd backend

# Create .env file
cp .env.example .env

# Edit .env with production values
nano .env
```

### .env Configuration for Production

```env
# Database (using RDS)
DATABASE_URL=postgresql://admin:strong_password_123@your-rds-endpoint.us-east-1.rds.amazonaws.com:5432/garbage_detection
DATABASE_ECHO=False

# JWT
SECRET_KEY=generate-a-long-random-string-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# AWS Credentials
AWS_ACCESS_KEY_ID=your-iam-access-key
AWS_SECRET_ACCESS_KEY=your-iam-secret-key
AWS_REGION=us-east-1
S3_BUCKET_NAME=cleancity-ai-images
S3_IMAGE_PREFIX=detections/

# YOLOv8
YOLO_MODEL=yolov8m.pt
YOLO_CONFIDENCE_THRESHOLD=0.5

# Server
HOST=0.0.0.0
PORT=8000
DEBUG=False
CORS_ORIGINS=["https://yourdomain.com"]

# API
API_TITLE=CleanCity AI - Backend API
API_VERSION=1.0.0
```

## Step 4: Setup PostgreSQL with RDS (Recommended)

### 4.1 Create RDS Instance

1. Go to AWS RDS Dashboard
2. Click "Create database"
3. Select "PostgreSQL"
4. **DB Instance Class**: db.t3.micro (free tier) or db.t3.small
5. **Storage**: 20 GB, gp3
6. **Publicly Accessible**: No (access through security group)
7. **Database Name**: garbage_detection
8. **Master Username**: admin
9. **Master Password**: Use strong password
10. Create Security Group allowing EC2 instance

### 4.2 Verify Connection

```bash
# Install PostgreSQL client
sudo apt install postgresql-client -y

# Test connection
psql -h your-rds-endpoint.us-east-1.rds.amazonaws.com -U admin -d garbage_detection -c "SELECT 1;"
```

## Step 5: Deploy with Docker

```bash
cd ~/cleancity/backend

# Build image (first time only)
docker build -t cleancity-ai-backend:latest .

# Or use Docker Compose (includes PostgreSQL if local)
docker-compose up -d

# Verify containers
docker ps
docker logs cleancity_ai_backend

# Check health
curl http://localhost:8000/health
```

## Step 6: Setup Nginx Reverse Proxy

```bash
# Create Nginx config
sudo nano /etc/nginx/sites-available/cleancity

# Add configuration
```

```nginx
upstream fastapi {
    server 127.0.0.1:8000;
}

server {
    listen 80;
    server_name yourdomain.com;

    client_max_body_size 100M;

    location / {
        proxy_pass http://fastapi;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_redirect off;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/cleancity /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

## Step 7: SSL Certificate (HTTPS)

```bash
# Generate certificate with Let's Encrypt
sudo certbot certonly --nginx -d yourdomain.com

# Auto-renew
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Verify
sudo certbot certificates
```

## Step 8: Configure AWS S3

### 8.1 Create S3 Bucket

```bash
aws s3 mb s3://cleancity-ai-images --region us-east-1
```

### 8.2 Create IAM User

1. Go to IAM Dashboard
2. Create user with S3 access policy
3. Generate access keys
4. Add to .env file

### 8.3 S3 Bucket Policy

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicRead",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::cleancity-ai-images/*"
        }
    ]
}
```

## Step 9: Setup Monitoring and Logging

### 9.1 CloudWatch Logs

```bash
# Install CloudWatch agent
wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i -E ./amazon-cloudwatch-agent.deb
```

### 9.2 Docker Logs

```bash
# View real-time logs
docker logs -f cleancity_ai_backend

# Save logs to file
docker logs cleancity_ai_backend > backend.log
```

## Step 10: Auto-Scaling and Load Balancing

### 10.1 Create Load Balancer

1. Go to AWS EC2 > Load Balancers
2. Create Application Load Balancer
3. Configure with:
   - Protocol: HTTPS (port 443)
   - Target: EC2 instance
   - Health check: `/health`

### 10.2 Auto Scaling Group

1. Create Launch Template with user data script
2. Create Auto Scaling Group (min: 1, desired: 2, max: 4)
3. Attach to Load Balancer

## Step 11: Database Backups

```bash
# Automated RDS backups
# Configure in RDS console:
# - Backup retention: 30 days
# - Preferred backup window: 03:00-04:00 UTC

# Manual backup
aws rds create-db-snapshot \
    --db-instance-identifier garbage-detection \
    --db-snapshot-identifier backup-$(date +%Y%m%d)
```

## Step 12: Maintenance

### 12.1 Update Application

```bash
cd ~/cleancity
git pull origin main
cd backend
docker-compose build
docker-compose up -d
```

### 12.2 Monitor Performance

```bash
# Check Docker stats
docker stats

# Check disk usage
df -h
du -sh ~/cleancity

# Check database
psql -h your-rds-endpoint -U admin -d garbage_detection -c "SELECT version();"
```

## Troubleshooting

### Container won't start

```bash
docker logs cleancity_ai_backend
# Check .env values
# Verify database connection
```

### Database connection timeout

```bash
# Test connection
psql -h your-rds-endpoint -U admin -d garbage_detection -c "SELECT 1;"

# Check security groups
aws ec2 describe-security-groups --group-ids sg-xxxxx
```

### Out of disk space

```bash
# Clean Docker
docker system prune -a

# Check S3 usage
aws s3 ls s3://cleancity-ai-images/ --recursive --summarize
```

## Performance Tuning

### PostgreSQL (RDS)

- Instance class: t3.small or larger
- Multi-AZ for production
- Enhanced monitoring
- Parameter groups: max_connections=300, shared_buffers=256MB

### FastAPI

- Worker count: 4 × CPU cores
- Environment: PYTHONUNBUFFERED=1
- Timeout: 120 seconds

### Nginx

- Worker processes: auto
- Keepalive: 65
- Gzip compression: enabled

## Cost Optimization

- Use t3.medium (burstable) for dev/staging
- Use Savings Plans for production
- Set S3 lifecycle policies (transition old images to Glacier)
- Use CloudFront CDN for static images

## Security Checklist

- [ ] SSH key protected
- [ ] Security groups restricted
- [ ] SSL/TLS enabled (HTTPS)
- [ ] WAF configured
- [ ] Database encrypted
- [ ] S3 bucket not public
- [ ] Secrets in AWS Secrets Manager
- [ ] VPC properly configured
- [ ] CloudTrail logging enabled
- [ ] Regular backups verified

## Monitoring and Alerts

```bash
# CloudWatch Alarms
aws cloudwatch put-metric-alarm \
    --alarm-name backend-cpu-high \
    --alarm-description "Alert when CPU > 80%" \
    --metric-name CPUUtilization \
    --namespace AWS/EC2 \
    --statistic Average \
    --period 300 \
    --threshold 80 \
    --comparison-operator GreaterThanThreshold
```

## Support and Maintenance

- Monitor logs daily
- Review CloudWatch metrics weekly
- Test backups monthly
- Update dependencies quarterly
- Security patches immediately

## Next Steps

1. Setup monitoring dashboard in CloudWatch
2. Configure backup schedules
3. Test disaster recovery
4. Document runbooks
5. Setup CI/CD pipeline
