# 🐳 TaskOrbit Docker Setup

This guide will help you run TaskOrbit using Docker and Docker Compose.

## 🚀 Quick Start

### Prerequisites
- **Docker** 20.0+
- **Docker Compose** 2.0+
- **Git** (to clone the repository)

### 1. Start All Services
```bash
# Using the setup script (recommended)
./docker-setup.sh start

# Or using docker-compose directly
docker-compose up -d --build
```

### 2. Access Your Application
Once all services are running, you can access:

| Service | URL | Credentials | Description |
|---------|-----|-------------|-------------|
| **🌐 Backend API** | http://localhost:8080 | - | REST API endpoints |
| **📊 Grafana** | http://localhost:3002 | admin/admin | Monitoring dashboards |
| **📈 Prometheus** | http://localhost:9091 | - | Metrics collection |
| **🗄️ Database** | localhost:5433 | taskorbit/taskorbit123 | PostgreSQL |

## 🛠️ Docker Management

### Using the Setup Script
```bash
# Start all services
./docker-setup.sh start

# Check service status
./docker-setup.sh status

# View logs
./docker-setup.sh logs

# View logs for specific service
./docker-setup.sh logs backend

# Check health
./docker-setup.sh health

# Stop all services
./docker-setup.sh stop

# Restart all services
./docker-setup.sh restart

# Clean up everything
./docker-setup.sh clean
```

### Using Docker Compose Directly
```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild and start
docker-compose up -d --build

# View service status
docker-compose ps
```

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   (Future)      │◄──►│   (Node.js)     │◄──►│   (PostgreSQL)  │
│   Port: 3001    │    │   Port: 8080    │    │   Port: 5433    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   Monitoring    │
                       │   (Prometheus)  │
                       │   Port: 9091    │
                       └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   Dashboard     │
                       │   (Grafana)     │
                       │   Port: 3002    │
                       └─────────────────┘
```

## 📋 Services Overview

### 1. **Backend API** (Node.js/Express)
- **Image**: Built from `./backend/Dockerfile`
- **Port**: 8080
- **Features**: REST API, JWT auth, task management
- **Health Check**: `GET /api/health`

### 2. **Database** (PostgreSQL)
- **Image**: `postgres:15-alpine`
- **Port**: 5433
- **Data**: Persistent volume storage
- **Health Check**: `pg_isready`

### 3. **Prometheus** (Monitoring)
- **Image**: `prom/prometheus:v2.48.1`
- **Port**: 9091
- **Config**: `./monitoring/prometheus/prometheus.yml`
- **Data**: Persistent volume storage

### 4. **Grafana** (Dashboard)
- **Image**: `grafana/grafana:10.2.2`
- **Port**: 3002
- **Credentials**: admin/admin
- **Config**: Auto-provisioned datasources and dashboards

## 🔧 Configuration

### Environment Variables
All environment variables are set in `docker-compose.yml`:

```yaml
environment:
  NODE_ENV: development
  PORT: 8080
  DB_HOST: database
  DB_PORT: 5432
  DB_NAME: taskorbit
  DB_USER: taskorbit
  DB_PASSWORD: taskorbit123
  JWT_SECRET: your-super-secret-jwt-key-change-in-production
  JWT_EXPIRES_IN: 7d
  CORS_ORIGIN: http://localhost:3001
```

### Volumes
- **postgres_data**: Database persistence
- **prometheus_data**: Metrics persistence
- **grafana_data**: Dashboard persistence

### Networks
- **taskorbit-network**: Internal communication between services

## 🧪 Testing with Docker

### 1. Test Backend API
```bash
# Health check
curl http://localhost:8080/api/health

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@taskorbit.com", "password": "admin123"}'

# Get tasks (with token)
curl -X GET http://localhost:8080/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 2. Test Database Connection
```bash
# Connect to database
docker exec -it taskorbit-db psql -U taskorbit -d taskorbit

# Check tables
\dt

# Check users
SELECT * FROM users;
```

### 3. Test Monitoring
```bash
# Check Prometheus
curl http://localhost:9091/-/healthy

# Check Grafana
curl http://localhost:3002/api/health
```

## 🔍 Troubleshooting

### Common Issues

#### 1. **Port Already in Use**
```bash
# Check what's using the port
lsof -i :8080

# Kill the process
kill -9 <PID>
```

#### 2. **Database Connection Failed**
```bash
# Check database container
docker logs taskorbit-db

# Restart database
docker-compose restart database
```

#### 3. **Backend Won't Start**
```bash
# Check backend logs
docker logs taskorbit-backend

# Rebuild backend
docker-compose up -d --build backend
```

#### 4. **Permission Issues**
```bash
# Fix Docker permissions
sudo usermod -aG docker $USER
newgrp docker
```

### Debug Commands
```bash
# View all container logs
docker-compose logs

# View specific service logs
docker-compose logs backend

# Check container status
docker-compose ps

# Execute commands in container
docker exec -it taskorbit-backend sh
docker exec -it taskorbit-db psql -U taskorbit -d taskorbit
```

## 🚀 Production Deployment

### 1. **Update Environment Variables**
```bash
# Edit docker-compose.yml
environment:
  NODE_ENV: production
  JWT_SECRET: your-production-secret-key
  CORS_ORIGIN: https://yourdomain.com
```

### 2. **Use Production Images**
```bash
# Build production images
docker-compose -f docker-compose.prod.yml up -d
```

### 3. **Add SSL/HTTPS**
```bash
# Use nginx reverse proxy
# Add SSL certificates
# Configure domain
```

## 📊 Monitoring & Logs

### View Real-time Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
```

### Access Grafana Dashboards
1. Open http://localhost:3002
2. Login with `admin/admin`
3. Navigate to Dashboards
4. View TaskOrbit metrics

### Access Prometheus
1. Open http://localhost:9091
2. Go to Status > Targets
3. Check if all targets are UP

## 🧹 Cleanup

### Remove Everything
```bash
# Stop and remove containers, networks, volumes
docker-compose down -v

# Remove images
docker-compose down --rmi all

# Clean up Docker system
docker system prune -f
```

### Using Setup Script
```bash
./docker-setup.sh clean
```

## 📝 Development Workflow

### 1. **Start Development Environment**
```bash
./docker-setup.sh start
```

### 2. **Make Code Changes**
Edit files in `./backend/src/`

### 3. **Rebuild Backend**
```bash
docker-compose up -d --build backend
```

### 4. **View Logs**
```bash
docker-compose logs -f backend
```

### 5. **Test Changes**
```bash
curl http://localhost:8080/api/health
```

## 🔗 Useful Commands

```bash
# Quick status check
./docker-setup.sh status

# Health check all services
./docker-setup.sh health

# View backend logs
./docker-setup.sh logs backend

# Restart backend only
docker-compose restart backend

# Access backend shell
docker exec -it taskorbit-backend sh

# Access database
docker exec -it taskorbit-db psql -U taskorbit -d taskorbit
```

---

**🎉 Your TaskOrbit application is now running with Docker!**

For more information, check the main [README.md](README.md) file. 