#!/bin/bash

# TaskOrbit Docker Setup Script
# This script sets up TaskOrbit using Docker containers

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
    
    if ! command_exists docker; then
        missing_tools+=("Docker")
    fi
    
    if ! command_exists node; then
        missing_tools+=("Node.js")
    fi
    
    if ! command_exists go; then
        missing_tools+=("Go")
    fi
    
    if [ ${#missing_tools[@]} -ne 0 ]; then
        print_error "Missing required tools: ${missing_tools[*]}"
        echo "Please install the missing tools and run this script again."
        echo "Installation guides:"
        echo "- Docker: https://docs.docker.com/get-docker/"
        echo "- Node.js: https://nodejs.org/"
        echo "- Go: https://golang.org/dl/"
        exit 1
    fi
    
    print_success "All prerequisites are installed!"
}

# Check if ports are available
check_ports() {
    print_step "Checking if required ports are available..."
    
    local ports=(3001 8080 5432 9091 3002)
    local busy_ports=()
    
    for port in "${ports[@]}"; do
        if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
            busy_ports+=($port)
        fi
    done
    
    if [ ${#busy_ports[@]} -ne 0 ]; then
        print_warning "The following ports are busy: ${busy_ports[*]}"
        echo "TaskOrbit needs ports 3001, 8080, 5432, 9091, and 3002 to be available."
        read -p "Do you want to continue anyway? (y/N): " choice
        case "$choice" in 
            y|Y ) print_warning "Continuing... Some services might fail to start.";;
            * ) echo "Please free up the required ports and run the script again."; exit 1;;
        esac
    else
        print_success "All required ports are available!"
    fi
}

# Start database using Docker
start_database() {
    print_step "Starting PostgreSQL database using Docker..."
    
    if docker ps --format "table {{.Names}}" | grep -q "taskorbit-db"; then
        print_warning "Database container already running"
    else
        docker run -d \
            --name taskorbit-db \
            -e POSTGRES_DB=taskorbit \
            -e POSTGRES_USER=taskorbit \
            -e POSTGRES_PASSWORD=taskorbit123 \
            -p 5432:5432 \
            postgres:15-alpine
        
        print_step "Waiting for database to start..."
        sleep 10
        print_success "Database started successfully!"
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

# Setup monitoring using Docker
setup_monitoring() {
    read -p "Do you want to set up monitoring (Prometheus + Grafana)? (y/N): " choice
    case "$choice" in 
        y|Y ) 
            print_step "Setting up Prometheus..."
            if ! docker ps --format "table {{.Names}}" | grep -q "taskorbit-prometheus"; then
                docker run -d \
                    --name taskorbit-prometheus \
                    -p 9091:9090 \
                    -v $(pwd)/monitoring/prometheus.yml:/etc/prometheus/prometheus.yml \
                    --add-host=host.docker.internal:host-gateway \
                    prom/prometheus:v2.48.1 \
                    --config.file=/etc/prometheus/prometheus.yml
                print_success "Prometheus started!"
            fi
            
            print_step "Setting up Grafana..."
            if ! docker ps --format "table {{.Names}}" | grep -q "taskorbit-grafana"; then
                docker run -d \
                    --name taskorbit-grafana \
                    -p 3002:3000 \
                    -e GF_SECURITY_ADMIN_PASSWORD=admin \
                    --add-host=host.docker.internal:host-gateway \
                    -v $(pwd)/monitoring/grafana/provisioning:/etc/grafana/provisioning \
                    grafana/grafana:10.2.2
                print_success "Grafana started!"
            fi
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
    echo "🎉 TaskOrbit Docker Setup Complete!"
    echo "===================================="
    echo ""
    echo "📱 Access your services:"
    echo "  Frontend:   http://localhost:3001"
    echo "  Backend:    http://localhost:8080"
    echo "  Grafana:    http://localhost:3002 (admin/admin)"
    echo "  Prometheus: http://localhost:9091"
    echo ""
    echo "🔧 Management commands:"
    echo "  Stop all:     ./stop-docker.sh"
    echo "  View logs:    tail -f backend.log frontend.log"
    echo "  Check health: curl http://localhost:8080/health"
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
    echo "  - Real-time metrics in Grafana"
    echo ""
}

# Create stop script for Docker setup
create_stop_script() {
    cat > stop-docker.sh << 'EOF'
#!/bin/bash

echo "🛑 Stopping TaskOrbit Docker services..."

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

# Stop Docker containers
docker stop taskorbit-db taskorbit-prometheus taskorbit-grafana 2>/dev/null || true
docker rm taskorbit-db taskorbit-prometheus taskorbit-grafana 2>/dev/null || true
echo "✅ Docker containers stopped"

echo "🎉 All services stopped!"
EOF
    chmod +x stop-docker.sh
}

# Main setup function
main() {
    echo "🚀 TaskOrbit Docker Setup"
    echo "========================="
    echo ""
    
    check_prerequisites
    check_ports
    start_database
    setup_backend
    setup_frontend
    setup_monitoring
    generate_demo_traffic
    create_stop_script
    show_status
}

# Run main function
main "$@" 