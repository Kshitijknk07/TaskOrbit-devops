# 🚀 Getting Started with TaskOrbit

Welcome to TaskOrbit! This guide will help you get the application running in just a few minutes.

## 📦 What You Need

Before starting, make sure you have these installed on your computer:

1. **Docker** - [Download here](https://docs.docker.com/get-docker/)
2. **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
3. **Go** (version 1.21 or higher) - [Download here](https://golang.org/dl/)

## ⚡ Super Quick Start (3 Minutes)

### Option 1: Automatic Setup (Recommended)

```bash
# 1. Clone the project
git clone https://github.com/your-username/taskorbit.git
cd taskorbit

# 2. Run the magic setup script
./setup.sh

# 3. That's it! 🎉
```

The script will:
- ✅ Check if everything is installed
- ✅ Start the database
- ✅ Start the backend API
- ✅ Start the frontend
- ✅ Optionally set up monitoring
- ✅ Create demo data

### Option 2: Manual Setup (5 Minutes)

If you prefer to understand what's happening:

```bash
# 1. Clone and enter the project
git clone https://github.com/your-username/taskorbit.git
cd taskorbit

# 2. Start the database
docker run -d --name taskorbit-db -e POSTGRES_DB=taskorbit -e POSTGRES_USER=taskorbit -e POSTGRES_PASSWORD=taskorbit123 -p 5432:5432 postgres:15-alpine

# 3. Start the backend (new terminal)
cd backend
go mod download && go mod tidy
go run main.go

# 4. Start the frontend (new terminal)
cd frontend
npm install
npm run dev
```

## 🎮 Using TaskOrbit

1. **Open your browser** and go to: http://localhost:3000

2. **Explore the homepage** - You'll see:
   - Beautiful landing page
   - Current task statistics
   - Feature overview

3. **Sign in** - Click "Sign In" and enter:
   - **Email**: `admin@taskorbit.com` (or any email)
   - **Password**: `password` (or any password)

4. **Dashboard** - You'll see:
   - 📊 Task statistics
   - 📋 List of demo tasks
   - 👥 Team members
   - ➕ "New Task" button

5. **Try these features**:
   - Create a new task
   - Change task status (Pending → In Progress → Completed)
   - Assign tasks to team members
   - Set task priorities

## 📊 Monitoring (Optional)

If you set up monitoring, you can access:

- **Grafana Dashboard**: http://localhost:3002
  - Login: `admin` / `admin`
  - View real-time application metrics
  - Custom TaskOrbit dashboard

- **Prometheus**: http://localhost:9091
  - Raw metrics data
  - Target status
  - Query metrics

## 🆘 Need Help?

### Something not working?

**Check if services are running:**
```bash
# Frontend (should return HTML)
curl http://localhost:3000

# Backend (should return "healthy")
curl http://localhost:8080/health

# Database (should show taskorbit-db)
docker ps | grep taskorbit-db
```

**View logs:**
```bash
# If using setup script
tail -f backend.log frontend.log

# If running manually, check the terminal where you started each service
```

**Common issues:**

1. **Port already in use**: 
   - Stop other applications using ports 3000, 8080, 5432
   - Or use different ports: `PORT=3001 npm run dev`

2. **Docker not running**: 
   - Start Docker Desktop
   - Check: `docker --version`

3. **Node modules error**: 
   - Delete `node_modules` and run `npm install` again

4. **Go dependencies error**: 
   - Run `go mod download` and `go mod tidy`

### Stop everything:
```bash
# If using setup script
./stop.sh

# Manual shutdown
# Kill the processes in terminals (Ctrl+C)
# Stop database: docker stop taskorbit-db
```

## 🎯 What's Next?

Now that you have TaskOrbit running:

1. **Explore the code**:
   - `frontend/src/` - React components and pages
   - `backend/internal/` - Go API code
   - `k8s/` - Kubernetes deployment files

2. **Customize it**:
   - Change colors in `frontend/src/app/globals.css`
   - Add new API endpoints in `backend/internal/handlers/`
   - Create new React components

3. **Deploy it**:
   - Use Docker Compose: `docker-compose up -d`
   - Deploy to Kubernetes: `kubectl apply -f k8s/`

4. **Learn more**:
   - Read the full [README.md](README.md)
   - Check out the [docs/](docs/) folder
   - Explore the GitHub Actions workflow

## 🏆 Success!

If you can:
- ✅ Open http://localhost:3000
- ✅ Login with any credentials
- ✅ See 3 demo tasks
- ✅ Create a new task

**Congratulations! 🎉** You're now running a full-stack application with:
- Modern React frontend
- Go microservice backend
- PostgreSQL database
- Real-time monitoring
- Production-ready DevOps setup

Welcome to the world of modern software development! 🚀

---

**Questions?** Open an issue on GitHub or check the [troubleshooting section](README.md#troubleshooting) in the main README.
