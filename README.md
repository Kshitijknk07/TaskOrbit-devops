# TaskOrbit 🚀

![TaskOrbit Banner](https://img.shields.io/badge/TaskOrbit-Task%20Management-blue?style=for-the-badge&logo=nodejs)

**TaskOrbit** is a modern, open-source task management application built with Node.js/Express backend, PostgreSQL database, and comprehensive monitoring via Prometheus and Grafana. It's designed to demonstrate real-world software development workflows including microservices architecture, containerization, monitoring, and DevOps best practices.

> 🚀 **Quick Start**: New to this? Try our [Docker setup guide](DOCKER_README.md) or run `./docker-setup.sh start` for automatic installation!

## 🌟 Key Features

✅ **Modern Task Management**: Create, assign, prioritize, and track tasks with intuitive API  
✅ **Real-Time Updates**: Live task status changes and notifications  
✅ **User Authentication**: Secure JWT-based login system with demo data  
✅ **RESTful APIs**: Scalable Node.js/Express backend with comprehensive endpoints  
✅ **Database Integration**: PostgreSQL with Sequelize ORM and auto-migrations  
✅ **Metrics & Monitoring**: Prometheus + Grafana real-time dashboards  
✅ **DevOps Ready**: Complete Docker & Docker Compose setup  
✅ **Kubernetes Native**: Production-ready K8s manifests  
✅ **Health Checks**: Built-in monitoring and auto-healing  
✅ **Security**: JWT authentication, rate limiting, input validation  

## 🏗️ System Architecture

```
         🔧 Backend (Node.js/Express)         🗄️ Database (PostgreSQL)
              Port: 8080        ←→         Port: 5433
                  │                           │
                  ▼                           ▼
      📊 Grafana Dashboard          📈 Prometheus Metrics
         Port: 3002                      Port: 9091
```

**Technology Stack:**
- **Backend**: Node.js 18+, Express.js, Sequelize ORM, JWT Authentication
- **Database**: PostgreSQL 15 with auto-migrations
- **Monitoring**: Prometheus, Grafana with custom dashboards
- **DevOps**: Docker, Docker Compose, Kubernetes manifests
- **Development**: Hot reload, health checks, structured logging

## 🚀 Quick Start Guide

### 📋 Prerequisites

Before you begin, ensure you have the following installed:

| Tool | Version | Purpose | Installation |
|------|---------|---------|-------------|
| **Docker** | 20.0+ | Container runtime | [Install Docker](https://docs.docker.com/get-docker/) |
| **Docker Compose** | 2.0+ | Multi-container management | [Install Docker Compose](https://docs.docker.com/compose/install/) |
| **Node.js** | 18.0+ | Backend development | [Install Node.js](https://nodejs.org/) |
| **Git** | Latest | Version control | [Install Git](https://git-scm.com/) |

**Optional (for production):**
- **kubectl** - Kubernetes CLI
- **PostgreSQL Client** - Database management

### 🎯 Installation Methods

Choose your preferred installation method:

#### Option 1: 🐳 Docker Compose (Recommended)

**Step 1: Clone the Repository**
```bash
# Clone the project
git clone https://github.com/your-username/taskorbit.git
cd taskorbit

# Verify project structure
ls -la
```

**Step 2: Start All Services**
```bash
# Using the setup script (recommended)
./docker-setup.sh start

# Or using docker-compose directly
docker-compose up -d --build
```

**Step 3: Verify Services**
```bash
# Check service status
./docker-setup.sh status

# View logs
./docker-setup.sh logs

# Check health
./docker-setup.sh health
```

#### Option 2: 🏃‍♂️ Local Development

**Step 1: Start Database**
```bash
# Start PostgreSQL using Docker
docker run -d \
  --name taskorbit-db \
  -e POSTGRES_DB=taskorbit \
  -e POSTGRES_USER=taskorbit \
  -e POSTGRES_PASSWORD=taskorbit123 \
  -p 5433:5432 \
  postgres:15-alpine

# Verify database is running
docker ps | grep taskorbit-db
```

**Step 2: Start Backend API**
```bash
# Navigate to backend directory
cd backend

# Install Node.js dependencies
npm install

# Copy environment file
cp env.example .env

# Start the backend server
npm run dev

# Backend will start on http://localhost:8080
# You should see: "TaskOrbit backend server running on port 8080"
```

**Step 3: Add Monitoring (Optional)**
```bash
# Start Prometheus
docker run -d \
  --name taskorbit-prometheus \
  -p 9091:9090 \
  -v $(pwd)/monitoring/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml \
  --add-host=host.docker.internal:host-gateway \
  prom/prometheus:v2.48.1 \
  --config.file=/etc/prometheus/prometheus.yml

# Start Grafana
docker run -d \
  --name taskorbit-grafana \
  -p 3002:3000 \
  -e GF_SECURITY_ADMIN_PASSWORD=admin \
  --add-host=host.docker.internal:host-gateway \
  -v $(pwd)/monitoring/grafana/provisioning:/etc/grafana/provisioning \
  grafana/grafana:10.2.2
```

#### Option 3: ☸️ Kubernetes Deployment (Production)

```bash
# Clone repository
git clone https://github.com/your-username/taskorbit.git
cd taskorbit

# Apply Kubernetes manifests
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/database/
kubectl apply -f k8s/backend/
kubectl apply -f k8s/monitoring/

# Check deployment status
kubectl get pods -n taskorbit
kubectl get services -n taskorbit
```

## 🌐 Access Your Application

Once the installation is complete, you can access:

| Service | URL | Credentials | Purpose |
|---------|-----|-------------|----------|
| **🔧 Backend API** | [http://localhost:8080](http://localhost:8080) | - | REST API endpoints |
| **📊 Grafana Dashboard** | [http://localhost:3002](http://localhost:3002) | admin/admin | Monitoring dashboards |
| **📈 Prometheus Metrics** | [http://localhost:9091](http://localhost:9091) | - | Raw metrics data |
| **🗄️ Database** | localhost:5433 | taskorbit/taskorbit123 | PostgreSQL database |

## 🎮 Using TaskOrbit API

### First Time Setup

1. **Test the API**: Navigate to [http://localhost:8080/api/health](http://localhost:8080/api/health)
2. **Explore endpoints**: Use the comprehensive API testing script
3. **Run tests**: Execute `./test_backend.sh` for full API testing

### Demo Data

TaskOrbit comes with pre-loaded demo data:

**👥 Demo Users:**
- **Admin User** (admin@taskorbit.com / admin123)
- **John Doe** (john@example.com / john123)
- **Jane Smith** (jane@example.com / jane123)

**📋 Demo Tasks:**
- Setup TaskOrbit Infrastructure (In Progress, High Priority)
- Implement User Authentication (Completed, Medium Priority)
- Create Task Management API (Pending, High Priority)

### API Testing

Use the provided test script for comprehensive API testing:

```bash
# Run full API test suite
./test_backend.sh

# Or test individual endpoints
curl -X GET http://localhost:8080/api/health
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@taskorbit.com", "password": "admin123"}'
```

## 🛠️ Development Commands

### Backend Development
```bash
# Start backend in development mode
cd backend
npm run dev

# Run tests
npm test

# Build for production
npm start

# Check for issues
npm run lint
```

### Docker Commands
```bash
# Build custom images
docker build -t taskorbit-backend ./backend

# Run individual containers
docker run -p 8080:8080 taskorbit-backend

# View container logs
docker logs taskorbit-backend -f

# Manage services
./docker-setup.sh start
./docker-setup.sh stop
./docker-setup.sh restart
./docker-setup.sh logs
./docker-setup.sh status
./docker-setup.sh health
```

## 🐛 Troubleshooting

### Common Issues

#### ❌ Port Already in Use
**Error**: `Error: listen EADDRINUSE: address already in use :::8080`

**Solution**:
```bash
# Find process using the port
lsof -i :8080
# Or use netstat
netstat -tulpn | grep :8080

# Kill the process
kill -9 <PID>

# Or use different ports
PORT=8081 npm run dev  # Backend
```

#### ❌ Database Connection Failed
**Error**: `Failed to connect to database`

**Solution**:
```bash
# Check if PostgreSQL container is running
docker ps | grep postgres

# Restart database container
docker restart taskorbit-db

# Check database logs
docker logs taskorbit-db

# Verify connection
docker exec -it taskorbit-db psql -U taskorbit -d taskorbit
```

#### ❌ Docker Issues
**Error**: `Cannot connect to Docker daemon`

**Solution**:
```bash
# Start Docker service
sudo systemctl start docker

# Add user to docker group
sudo usermod -aG docker $USER

# Restart session or run
newgrp docker

# Check Docker status
docker version
```

### Health Checks

```bash
# Check all services status
echo "🔍 Service Health Check"
echo "Backend: $(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/health)"
echo "Prometheus: $(curl -s -o /dev/null -w "%{http_code}" http://localhost:9091)"
echo "Grafana: $(curl -s -o /dev/null -w "%{http_code}" http://localhost:3002)"

# Check database connectivity
docker exec -it taskorbit-db psql -U taskorbit -d taskorbit -c "SELECT 1;"
```

### Performance Optimization

#### 🚀 Backend Optimization
```bash
# Monitor memory usage
docker stats taskorbit-backend

# Check logs for errors
docker logs taskorbit-backend --tail 100

# Monitor API metrics
curl http://localhost:8080/api/health
```

## 🌟 Environment Variables

### Backend Configuration
```bash
# Database settings
DB_HOST=localhost
DB_PORT=5433
DB_USER=taskorbit
DB_PASSWORD=taskorbit123
DB_NAME=taskorbit

# Server settings
PORT=8080
NODE_ENV=development

# Security (production)
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3001
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🎯 What's Next?

After successfully running TaskOrbit, try these advanced features:

1. **🔧 Customize the API**: Modify controllers in `backend/src/controllers/`
2. **📊 Add New Metrics**: Extend Prometheus metrics in `backend/src/services/`
3. **🗄️ Database Schema**: Add new models in `backend/src/models/`
4. **🚀 Deploy to Cloud**: Use the Kubernetes manifests for production
5. **🔐 Add Real Auth**: Implement proper JWT authentication
6. **📱 Frontend App**: Create a React/Next.js frontend
7. **🔔 Notifications**: Add email or Slack integrations
8. **🌐 Multi-tenancy**: Support multiple organizations

## 🆘 Getting Help

If you encounter any issues:

1. **📖 Check Documentation**: Review this README and [DOCKER_README.md](DOCKER_README.md)
2. **🐛 Search Issues**: Look through GitHub issues for similar problems
3. **💬 Ask Questions**: Create a new GitHub issue with:
   - Your operating system
   - Node.js version
   - Complete error messages
   - Steps to reproduce

## 🏆 Success Indicators

You know TaskOrbit is working correctly when:

✅ Backend API responds at http://localhost:8080/api/health  
✅ You can login with demo credentials  
✅ API endpoints return proper JSON responses  
✅ Prometheus shows metrics at http://localhost:9091  
✅ Grafana dashboard displays at http://localhost:3002  
✅ No error messages in container logs  
✅ Database connection is established  

---

**🎉 Congratulations!** You're now running a production-ready task management API with full DevOps monitoring. Happy coding!

## 📁 Project Structure

```
taskorbit/
├── backend/                 # Node.js/Express API server
│   ├── src/                # Source code
│   │   ├── controllers/    # API controllers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Express middleware
│   │   ├── config/         # Configuration
│   │   └── utils/          # Utility functions
│   ├── migrations/         # Database migrations
│   ├── package.json        # Node.js dependencies
│   └── Dockerfile          # Backend container
├── frontend/               # Frontend application (future)
├── k8s/                   # Kubernetes manifests
│   ├── namespace.yaml
│   ├── database/
│   ├── backend/
│   ├── frontend/
│   └── monitoring/
├── monitoring/             # Monitoring configuration
│   ├── prometheus/         # Prometheus config
│   └── grafana/           # Grafana dashboards
├── docs/                  # Documentation
├── docker-compose.yml     # Docker services
├── docker-setup.sh        # Docker management script
├── test_backend.sh        # API testing script
└── DOCKER_README.md       # Docker documentation
```

## 🔧 Development

### Backend Development
```bash
cd backend
npm install
npm run dev
```

### Docker Development
```bash
# Start all services
./docker-setup.sh start

# View logs
./docker-setup.sh logs

# Stop services
./docker-setup.sh stop
```

### Running Tests
```bash
# Backend tests
cd backend && npm test

# API tests
./test_backend.sh
```

## 📊 Monitoring

- **Prometheus**: Metrics collection at `:9091`
- **Grafana**: Visualization dashboard at `:3002`
- **Health Checks**: Built-in monitoring for all services

## 🔐 Security

- JWT-based authentication
- Password hashing with bcryptjs
- CORS protection
- Rate limiting
- Input validation with express-validator
- Helmet.js security headers

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Tasks
- `GET /api/tasks` - List all tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get task by ID
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/stats` - Get task statistics

### Health
- `GET /api/health` - Application health check
- `GET /api/health/database` - Database health check

## 🚀 Deployment

### Docker Deployment
```bash
# Build and start all services
docker-compose up -d --build

# Or use the setup script
./docker-setup.sh start
```

### Kubernetes Deployment
```bash
# Apply all manifests
kubectl apply -f k8s/

# Check deployment status
kubectl get pods -n taskorbit
```

## 📈 Scaling

TaskOrbit is designed for horizontal scaling:
- **Backend**: Stateless API servers can be scaled horizontally
- **Database**: PostgreSQL with read replicas
- **Monitoring**: Prometheus with federation for multi-cluster

## 🔗 Links

- [Docker Setup Guide](DOCKER_README.md)
- [API Testing Script](test_backend.sh)
- [Docker Management Script](docker-setup.sh)

---

Built with ❤️ using modern DevOps practices
