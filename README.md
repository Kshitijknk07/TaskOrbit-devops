# TaskOrbit 🚀

![TaskOrbit Banner](https://img.shields.io/badge/TaskOrbit-Task%20Management-blue?style=for-the-badge&logo=kubernetes)

**TaskOrbit** is a modern, open-source task management application built with cutting-edge technologies and DevOps best practices. It's designed to demonstrate real-world software development workflows including microservices architecture, containerization, monitoring, and CI/CD pipelines.

> 🚀 **Quick Start**: New to this? Try our [3-minute setup guide](GETTING_STARTED.md) or run `./setup.sh` for automatic installation!

## 🌟 Key Features

✅ **Modern Task Management**: Create, assign, prioritize, and track tasks with intuitive UI  
✅ **Real-Time Updates**: Live task status changes and notifications  
✅ **User Authentication**: Secure login system with demo data  
✅ **Responsive Design**: Beautiful, mobile-friendly interface with TailwindCSS  
✅ **RESTful APIs**: Scalable GoLang backend with comprehensive endpoints  
✅ **Database Integration**: PostgreSQL with auto-migrations and seed data  
✅ **Metrics & Monitoring**: Prometheus + Grafana real-time dashboards  
✅ **DevOps Ready**: Complete CI/CD with GitHub Actions  
✅ **Container Support**: Docker & Docker Compose ready  
✅ **Kubernetes Native**: Production-ready K8s manifests  
✅ **Health Checks**: Built-in monitoring and auto-healing  

## 🏗️ System Architecture

```
         🌐 Frontend (Next.js)           🔧 Backend (GoLang)         🗄️ Database (PostgreSQL)
              Port: 3001        ←→        Port: 8080        ←→         Port: 5433
                  │                           │                           │
                  ▼                           ▼                           ▼
      📊 Grafana Dashboard          📈 Prometheus Metrics         💾 Persistent Storage
         Port: 3002                      Port: 9091                  Docker Volume
```

**Technology Stack:**
- **Frontend**: Next.js 14, React 18, TypeScript, TailwindCSS
- **Backend**: GoLang, Gin Framework, GORM, JWT Authentication
- **Database**: PostgreSQL 15 with auto-migrations
- **Monitoring**: Prometheus, Grafana with custom dashboards
- **DevOps**: Docker, Kubernetes, GitHub Actions CI/CD
- **Development**: Hot reload, health checks, structured logging

## 🚀 Quick Start Guide

### 📋 Prerequisites

Before you begin, ensure you have the following installed:

| Tool | Version | Purpose | Installation |
|------|---------|---------|-------------|
| **Docker** | 20.0+ | Container runtime | [Install Docker](https://docs.docker.com/get-docker/) |
| **Node.js** | 18.0+ | Frontend development | [Install Node.js](https://nodejs.org/) |
| **Go** | 1.21+ | Backend development | [Install Go](https://golang.org/dl/) |
| **Git** | Latest | Version control | [Install Git](https://git-scm.com/) |

**Optional (for production):**
- **kubectl** - Kubernetes CLI
- **Docker Compose** - Multi-container management

### 🎯 Installation Methods

Choose your preferred installation method:

#### Option 1: 🏃‍♂️ Quick Local Development (Recommended for beginners)

**Step 1: Clone the Repository**
```bash
# Clone the project
git clone https://github.com/your-username/taskorbit.git
cd taskorbit

# Verify project structure
ls -la
```

**Step 2: Start Database**
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

**Step 3: Start Backend API**
```bash
# Navigate to backend directory
cd backend

# Download Go dependencies
go mod download
go mod tidy

# Start the backend server
go run main.go

# Backend will start on http://localhost:8080
# You should see: "TaskOrbit backend starting on port 8080"
```

**Step 4: Start Frontend (New Terminal)**
```bash
# Navigate to frontend directory
cd frontend

# Install Node.js dependencies
npm install

# Start the development server on port 3001
npm run dev -- -p 3001

# Frontend will start on http://localhost:3001
```

**Step 5: Add Monitoring (Optional)**
```bash
# Start Prometheus (New Terminal)
docker run -d \
  --name taskorbit-prometheus \
  -p 9091:9090 \
  -v $(pwd)/monitoring/prometheus.yml:/etc/prometheus/prometheus.yml \
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

#### Option 2: 🐳 Docker Compose (All-in-One)

```bash
# Clone and navigate
git clone https://github.com/your-username/taskorbit.git
cd taskorbit

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
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
kubectl apply -f k8s/frontend/

# Check deployment status
kubectl get pods -n taskorbit
kubectl get services -n taskorbit
```

## 🌐 Access Your Application

Once the installation is complete, you can access:

| Service | URL | Credentials | Purpose |
|---------|-----|-------------|----------|
| **🖥️ TaskOrbit App** | [http://localhost:3001](http://localhost:3001) | Any email/password | Main application |
| **🔧 Backend API** | [http://localhost:8080](http://localhost:8080) | - | REST API endpoints |
| **📊 Grafana Dashboard** | [http://localhost:3002](http://localhost:3002) | admin/admin | Monitoring dashboards |
| **📈 Prometheus Metrics** | [http://localhost:9091](http://localhost:9091) | - | Raw metrics data |
| **🗄️ Database** | localhost:5433 | taskorbit/taskorbit123 | PostgreSQL database |

## 🎮 Using TaskOrbit

### First Time Setup

1. **Open the application**: Navigate to [http://localhost:3001](http://localhost:3001)
2. **Explore the homepage**: See the features and current statistics
3. **Sign in**: Click "Sign In" or go to [http://localhost:3001/login](http://localhost:3001/login)
4. **Use demo credentials**: Enter any email (e.g., `admin@taskorbit.com`) and any password
5. **Access dashboard**: You'll be redirected to the main dashboard

### Demo Data

TaskOrbit comes with pre-loaded demo data:

**👥 Demo Users:**
- **Admin User** (admin@taskorbit.com)
- **John Doe** (john@example.com)
- **Jane Smith** (jane@example.com)

**📋 Demo Tasks:**
- Setup TaskOrbit Infrastructure (In Progress, High Priority)
- Implement User Authentication (Completed, Medium Priority)
- Create Task Management API (Pending, High Priority)

### Key Features to Try

#### 📊 Dashboard Overview
- View task statistics and metrics
- See recent tasks with status and priority
- Monitor team activity

#### 📝 Task Management
- Create new tasks with the "New Task" button
- Update task status (Pending → In Progress → Completed)
- Assign tasks to team members
- Set priorities (Low, Medium, High, Urgent)

#### 📈 Real-Time Monitoring
- **Grafana Dashboard**: View application metrics and performance
- **Custom Metrics**: Track task creation, completion rates
- **System Health**: Monitor API response times and error rates

## 🛠️ Development Commands

### Backend Development
```bash
# Start backend in development mode
cd backend
go run main.go

# Run tests
go test ./...

# Build binary
go build -o taskorbit-backend main.go

# Format code
go fmt ./...

# Check for issues
go vet ./...
```

### Frontend Development
```bash
# Start frontend in development mode
cd frontend
npm run dev -- -p 3001

# Run tests
npm test

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### Docker Commands
```bash
# Build custom images
docker build -t taskorbit-backend ./backend
docker build -t taskorbit-frontend ./frontend

# Run individual containers
docker run -p 8080:8080 taskorbit-backend
docker run -p 3001:3001 taskorbit-frontend

# View container logs
docker logs taskorbit-backend -f
docker logs taskorbit-frontend -f
```

## 🐛 Troubleshooting

### Common Issues

#### ❌ Port Already in Use
**Error**: `Error: listen EADDRINUSE: address already in use :::3001`

**Solution**:
```bash
# Find process using the port
lsof -i :3001
# Or use netstat
netstat -tulpn | grep :3001

# Kill the process
kill -9 <PID>

# Or use different ports
PORT=3002 npm run dev  # Frontend
PORT=8081 go run main.go  # Backend
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

#### ❌ Frontend Build Errors
**Error**: `Module not found` or `npm ERR!`

**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Update dependencies
npm update
```

#### ❌ Go Module Issues
**Error**: `go: module not found`

**Solution**:
```bash
# Clean module cache
go clean -modcache

# Redownload dependencies
go mod download
go mod tidy

# Verify go version
go version
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
echo "Frontend: $(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001)"
echo "Backend: $(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/health)"
echo "Prometheus: $(curl -s -o /dev/null -w "%{http_code}" http://localhost:9091)"
echo "Grafana: $(curl -s -o /dev/null -w "%{http_code}" http://localhost:3002)"

# Check database connectivity
psql -h localhost -p 5433 -U taskorbit -d taskorbit -c "SELECT 1;"
```

### Performance Optimization

#### 🚀 Backend Optimization
```bash
# Enable Go race detection
go run -race main.go

# Profile memory usage
go tool pprof http://localhost:8080/debug/pprof/heap

# Monitor metrics
curl http://localhost:8080/metrics | grep -E "(http_requests|tasks_active)"
```

#### ⚡ Frontend Optimization
```bash
# Analyze bundle size
npm run build
npm install -g @next/bundle-analyzer
ANALYZE=true npm run build

# Check for unused dependencies
npx depcheck

# Update packages
npm update
```

## 🌟 Environment Variables

### Backend Configuration
```bash
# Database settings
export DB_HOST=localhost
export DB_PORT=5433
export DB_USER=taskorbit
export DB_PASSWORD=taskorbit123
export DB_NAME=taskorbit

# Server settings
export PORT=8080
export GIN_MODE=release

# Security (production)
export JWT_SECRET=your-secret-key
export CORS_ORIGINS=http://localhost:3001
```

### Frontend Configuration
```bash
# API settings
export NEXT_PUBLIC_API_URL=http://localhost:8080

# Production settings
export NODE_ENV=production
export NEXT_TELEMETRY_DISABLED=1
```

## 🎯 What's Next?

After successfully running TaskOrbit, try these advanced features:

1. **🔧 Customize the UI**: Modify components in `frontend/src/components/`
2. **📊 Add New Metrics**: Extend Prometheus metrics in `backend/internal/handlers/`
3. **🗄️ Database Schema**: Add new tables in `backend/internal/models/`
4. **🚀 Deploy to Cloud**: Use the Kubernetes manifests for production
5. **🔐 Add Real Auth**: Implement proper JWT authentication
6. **📱 Mobile App**: Create a React Native companion app
7. **🔔 Notifications**: Add email or Slack integrations
8. **🌐 Multi-tenancy**: Support multiple organizations

## 🆘 Getting Help

If you encounter any issues:

1. **📖 Check Documentation**: Review this README and `/docs` folder
2. **🐛 Search Issues**: Look through GitHub issues for similar problems
3. **💬 Ask Questions**: Create a new GitHub issue with:
   - Your operating system
   - Node.js and Go versions
   - Complete error messages
   - Steps to reproduce

## 🏆 Success Indicators

You know TaskOrbit is working correctly when:

✅ Frontend loads at http://localhost:3001  
✅ You can login with any credentials  
✅ Dashboard shows 3 demo tasks  
✅ Backend API responds at http://localhost:8080/health  
✅ Prometheus shows metrics at http://localhost:9091  
✅ Grafana dashboard displays at http://localhost:3002  
✅ No error messages in console logs  

---

**🎉 Congratulations!** You're now running a production-ready task management system with full DevOps monitoring. Happy coding!

## 📁 Project Structure

```
taskorbit/
├── backend/                 # GoLang API server
│   ├── cmd/                # Application entry points
│   ├── internal/           # Private application code
│   ├── pkg/                # Public library code
│   ├── api/                # API definitions
│   ├── migrations/         # Database migrations
│   └── Dockerfile
├── frontend/               # Next.js application
│   ├── src/               # Source code
│   ├── components/        # React components
│   ├── pages/             # Next.js pages
│   ├── hooks/             # Custom React hooks
│   └── Dockerfile
├── k8s/                   # Kubernetes manifests
│   ├── namespace.yaml
│   ├── database/
│   ├── backend/
│   ├── frontend/
│   └── monitoring/
├── .github/workflows/     # GitHub Actions CI/CD
└── docs/                 # Documentation
```

## 🔧 Development

### Backend Development
```bash
cd backend
go mod tidy
go run main.go
```

### Frontend Development
```bash
cd frontend
npm install
npm run dev -- -p 3001
```

### Running Tests
```bash
# Backend tests
cd backend && go test ./...

# Frontend tests
cd frontend && npm test
```

## 📊 Monitoring

- **Prometheus**: Metrics collection at `:9091`
- **Grafana**: Visualization dashboard at `:3002`
- **Alerts**: Real-time notifications for system issues

## 🔐 Security

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Rate limiting
- Input validation

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Tasks
- `GET /api/tasks` - List all tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get task by ID
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

## 🚀 Deployment

### GitHub Actions CI/CD
The project includes automated CI/CD pipeline that:
1. Runs tests on every push
2. Builds Docker images
3. Deploys to Kubernetes
4. Updates monitoring dashboards

### Production Deployment
```bash
# Build and push images
docker build -t taskorbit-backend ./backend
docker build -t taskorbit-frontend ./frontend

# Deploy to Kubernetes
kubectl apply -f k8s/
```

## 📈 Scaling

TaskOrbit is designed for horizontal scaling:
- **Backend**: Stateless API servers can be scaled horizontally
- **Frontend**: Served via CDN for global distribution
- **Database**: PostgreSQL with read replicas
- **Cache**: Redis cluster for session management

## 🔗 Links

- [Documentation](./docs/)
- [API Reference](./docs/api.md)
- [Deployment Guide](./docs/deployment.md)

---

Built with ❤️ using modern DevOps practices
