#!/bin/bash

# TaskOrbit Local Setup Script
# This script sets up TaskOrbit using local PostgreSQL installation

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_step() {
    echo -e "${BLUE}🔧 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
check_prerequisites() {
    print_step "Checking prerequisites..."
    
    local missing_tools=()
    
    if ! command_exists node; then
        missing_tools+=("Node.js")
    fi
    
    if ! command_exists go; then
        missing_tools+=("Go")
    fi
    
    if ! command_exists psql; then
        missing_tools+=("PostgreSQL")
    fi
    
    if [ ${#missing_tools[@]} -ne 0 ]; then
        print_error "Missing required tools: ${missing_tools[*]}"
        echo "Please install the missing tools and run this script again."
        echo "Installation guides:"
        echo "- Node.js: https://nodejs.org/"
        echo "- Go: https://golang.org/dl/"
        echo "- PostgreSQL: sudo apt install postgresql postgresql-contrib"
        exit 1
    fi
    
    print_success "All prerequisites are installed!"
}

# Check if ports are available
check_ports() {
    print_step "Checking if required ports are available..."
    
    local ports=(3001 8080 5432)
    local busy_ports=()
    
    for port in "${ports[@]}"; do
        if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
            busy_ports+=($port)
        fi
    done
    
    if [ ${#busy_ports[@]} -ne 0 ]; then
        print_warning "The following ports are busy: ${busy_ports[*]}"
        echo "TaskOrbit needs ports 3001, 8080, and 5432 to be available."
        read -p "Do you want to continue anyway? (y/N): " choice
        case "$choice" in 
            y|Y ) print_warning "Continuing... Some services might fail to start.";;
            * ) echo "Please free up the required ports and run the script again."; exit 1;;
        esac
    else
        print_success "All required ports are available!"
    fi
}

# Setup PostgreSQL database
setup_database() {
    print_step "Setting up PostgreSQL database..."
    
    # Check if PostgreSQL service is running
    if ! sudo systemctl is-active --quiet postgresql; then
        print_step "Starting PostgreSQL service..."
        sudo systemctl start postgresql
        sudo systemctl enable postgresql
    fi
    
    # Check if database and user exist
    if ! sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -qw taskorbit; then
        print_step "Creating database and user..."
        sudo -u postgres psql -c "CREATE USER taskorbit WITH PASSWORD 'taskorbit123';" 2>/dev/null || true
        sudo -u postgres psql -c "CREATE DATABASE taskorbit OWNER taskorbit;" 2>/dev/null || true
        sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE taskorbit TO taskorbit;" 2>/dev/null || true
        print_success "Database setup completed!"
    else
        print_warning "Database already exists"
    fi
}

# Setup backend
setup_backend() {
    print_step "Setting up backend..."
    
    cd backend
    
    print_step "Downloading Go dependencies..."
    go mod download
    go mod tidy
    
    print_step "Starting backend server..."
    nohup go run main.go > ../backend.log 2>&1 &
    echo $! > ../backend.pid
    
    cd ..
    
    print_step "Waiting for backend to start..."
    sleep 5
    
    # Check if backend is running
    if curl -s http://localhost:8080/health > /dev/null; then
        print_success "Backend started successfully!"
    else
        print_error "Backend failed to start. Check backend.log for details."
        exit 1
    fi
}

# Setup frontend
setup_frontend() {
    print_step "Setting up frontend..."
    
    cd frontend
    
    print_step "Installing Node.js dependencies..."
    npm install
    
    print_step "Starting frontend server on port 3001..."
    nohup npm run dev -- -p 3001 > ../frontend.log 2>&1 &
    echo $! > ../frontend.pid
    
    cd ..
    
    print_step "Waiting for frontend to start..."
    sleep 15
    
    # Check if frontend is running
    if curl -s http://localhost:3001 > /dev/null; then
        print_success "Frontend started successfully!"
    else
        print_error "Frontend failed to start. Check frontend.log for details."
        exit 1
    fi
}

# Setup monitoring (optional)
setup_monitoring() {
    read -p "Do you want to set up monitoring (Prometheus + Grafana)? (y/N): " choice
    case "$choice" in 
        y|Y ) 
            print_warning "Monitoring setup requires Docker. Please use setup-docker.sh for full monitoring."
            print_warning "Skipping monitoring setup for local installation."
            ;;
        * ) 
            print_warning "Skipping monitoring setup"
            ;;
    esac
}

# Generate traffic for demo
generate_demo_traffic() {
    print_step "Generating demo traffic..."
    
    for i in {1..5}; do
        curl -s http://localhost:8080/api/tasks > /dev/null
        curl -s http://localhost:8080/api/users > /dev/null
        curl -s http://localhost:8080/health > /dev/null
        sleep 1
    done
    
    print_success "Demo traffic generated!"
}

# Show service status
show_status() {
    echo ""
    echo "🎉 TaskOrbit Local Setup Complete!"
    echo "=================================="
    echo ""
    echo "📱 Access your services:"
    echo "  Frontend:   http://localhost:3001"
    echo "  Backend:    http://localhost:8080"
    echo "  Database:   localhost:5432 (PostgreSQL)"
    echo ""
    echo "🔧 Management commands:"
    echo "  Stop all:     ./stop-local.sh"
    echo "  View logs:    tail -f backend.log frontend.log"
    echo "  Check health: curl http://localhost:8080/health"
    echo "  Status check: ./status.sh"
    echo ""
    echo "🎮 Getting started:"
    echo "  1. Open http://localhost:3001"
    echo "  2. Click 'Sign In'"
    echo "  3. Use any email/password to login"
    echo "  4. Explore the dashboard and tasks"
    echo ""
    echo "📊 Demo data available:"
    echo "  - 3 sample tasks with different statuses"
    echo "  - 3 demo users"
    echo ""
    echo "💡 For monitoring (Prometheus + Grafana), use: ./setup-docker.sh"
}

# Create stop script for local setup
create_stop_script() {
    cat > stop-local.sh << 'EOF'
#!/bin/bash

echo "🛑 Stopping TaskOrbit Local services..."

# Stop backend
if [ -f backend.pid ]; then
    kill $(cat backend.pid) 2>/dev/null || true
    rm backend.pid
    echo "✅ Backend stopped"
fi

# Stop frontend
if [ -f frontend.pid ]; then
    kill $(cat frontend.pid) 2>/dev/null || true
    rm frontend.pid
    echo "✅ Frontend stopped"
fi

# Note: PostgreSQL service is not stopped by default
# To stop PostgreSQL: sudo systemctl stop postgresql

echo "🎉 All services stopped!"
echo "💡 PostgreSQL is still running. To stop it: sudo systemctl stop postgresql"
EOF
    chmod +x stop-local.sh
}

# Main setup function
main() {
    echo "🚀 TaskOrbit Local Setup"
    echo "========================"
    echo ""
    
    check_prerequisites
    check_ports
    setup_database
    setup_backend
    setup_frontend
    setup_monitoring
    generate_demo_traffic
    create_stop_script
    show_status
}

# Run main function
main "$@" 