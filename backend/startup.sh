#!/bin/bash

# CleanCity AI Backend - Production Startup Script
# Run on EC2 after initial setup

set -e

echo "Starting CleanCity AI Backend deployment..."

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo -e "${YELLOW}[1] Checking prerequisites...${NC}"
command -v docker >/dev/null 2>&1 || { echo -e "${RED}Docker not found${NC}"; exit 1; }
command -v docker-compose >/dev/null 2>&1 || { echo -e "${RED}Docker Compose not found${NC}"; exit 1; }

# Create .env if doesn't exist
echo -e "${YELLOW}[2] Checking configuration...${NC}"
if [ ! -f .env ]; then
    echo -e "${RED}.env file not found${NC}"
    echo "Please copy .env.example to .env and configure"
    exit 1
fi

# Build and start containers
echo -e "${YELLOW}[3] Building Docker image...${NC}"
docker build -t cleancity-ai-backend:latest .

echo -e "${YELLOW}[4] Starting services...${NC}"
docker-compose up -d

# Wait for services
echo -e "${YELLOW}[5] Waiting for services to start...${NC}"
sleep 10

# Check health
echo -e "${YELLOW}[6] Checking health...${NC}"
if curl -f http://localhost:8000/health >/dev/null 2>&1; then
    echo -e "${GREEN}Backend is healthy${NC}"
else
    echo -e "${RED}Backend health check failed${NC}"
    docker logs cleancity_ai_backend
    exit 1
fi

# Migrate database
echo -e "${YELLOW}[7] Running database migrations...${NC}"
docker exec cleancity_ai_backend python -c "from app.database import init_db; import asyncio; asyncio.run(init_db())"

echo -e "${GREEN}[✓] Deployment complete!${NC}"
echo -e "${GREEN}Backend is running at http://localhost:8000${NC}"
echo -e "${GREEN}API documentation at http://localhost:8000/docs${NC}"

# Display status
echo ""
echo -e "${YELLOW}Container Status:${NC}"
docker-compose ps

echo ""
echo -e "${YELLOW}Useful commands:${NC}"
echo "  View logs: docker logs -f cleancity_ai_backend"
echo "  Stop: docker-compose down"
echo "  Restart: docker-compose restart"
echo "  Update: git pull && docker-compose build && docker-compose up -d"
