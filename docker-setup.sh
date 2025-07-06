#!/bin/bash

# TaskOrbit Docker Setup Script
# This script helps manage the TaskOrbit application with Docker

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}  TaskOrbit Docker Management${NC}"
    echo -e "${BLUE}================================${NC}"
}

# Check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
}

# Build and start all services
start() {
    print_header
    print_status "Starting TaskOrbit application..."
    
    check_docker
    
    # Stop any existing containers
    docker-compose down --remove-orphans
    
    # Build and start services
    docker-compose up -d --build
    
    print_status "Waiting for services to start..."
    sleep 10
    
    # Check service health
    check_health
    
    print_status "TaskOrbit is now running!"
    print_status "Access your application at:"
    echo "  🌐 Backend API: http://localhost:8080"
    echo "  📊 Grafana: http://localhost:3002 (admin/admin)"
    echo "  📈 Prometheus: http://localhost:9091"
    echo "  🗄️  Database: localhost:5433"
}

# Stop all services
stop() {
    print_header
    print_status "Stopping TaskOrbit application..."
    docker-compose down
    print_status "TaskOrbit stopped successfully!"
}

# Restart all services
restart() {
    print_header
    print_status "Restarting TaskOrbit application..."
    stop
    sleep 2
    start
}

# Show service status
status() {
    print_header
    print_status "Service Status:"
    docker-compose ps
    
    echo ""
    print_status "Service URLs:"
    echo "  Backend API: http://localhost:8080/api/health"
    echo "  Grafana: http://localhost:3002"
    echo "  Prometheus: http://localhost:9091"
}

# Check service health
check_health() {
    print_status "Checking service health..."
    
    # Check backend
    if curl -f http://localhost:8080/api/health > /dev/null 2>&1; then
        print_status "✅ Backend is healthy"
    else
        print_warning "⚠️  Backend health check failed"
    fi
    
    # Check database
    if docker exec taskorbit-db pg_isready -U taskorbit > /dev/null 2>&1; then
        print_status "✅ Database is healthy"
    else
        print_warning "⚠️  Database health check failed"
    fi
    
    # Check Prometheus
    if curl -f http://localhost:9091/-/healthy > /dev/null 2>&1; then
        print_status "✅ Prometheus is healthy"
    else
        print_warning "⚠️  Prometheus health check failed"
    fi
    
    # Check Grafana
    if curl -f http://localhost:3002/api/health > /dev/null 2>&1; then
        print_status "✅ Grafana is healthy"
    else
        print_warning "⚠️  Grafana health check failed"
    fi
}

# Show logs
logs() {
    print_header
    print_status "Showing logs for all services..."
    docker-compose logs -f
}

# Show logs for specific service
logs_service() {
    if [ -z "$1" ]; then
        print_error "Please specify a service name (backend, database, prometheus, grafana)"
        exit 1
    fi
    
    print_header
    print_status "Showing logs for $1..."
    docker-compose logs -f "$1"
}

# Clean up everything
clean() {
    print_header
    print_warning "This will remove all containers, volumes, and images!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Cleaning up TaskOrbit..."
        docker-compose down -v --rmi all
        docker system prune -f
        print_status "Cleanup completed!"
    else
        print_status "Cleanup cancelled."
    fi
}

# Show help
help() {
    print_header
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  start     Build and start all services"
    echo "  stop      Stop all services"
    echo "  restart   Restart all services"
    echo "  status    Show service status and URLs"
    echo "  health    Check service health"
    echo "  logs      Show logs for all services"
    echo "  logs [service]  Show logs for specific service"
    echo "  clean     Remove all containers, volumes, and images"
    echo "  help      Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start"
    echo "  $0 logs backend"
    echo "  $0 status"
}

# Main script logic
case "${1:-help}" in
    start)
        start
        ;;
    stop)
        stop
        ;;
    restart)
        restart
        ;;
    status)
        status
        ;;
    health)
        check_health
        ;;
    logs)
        if [ -n "$2" ]; then
            logs_service "$2"
        else
            logs
        fi
        ;;
    clean)
        clean
        ;;
    help|--help|-h)
        help
        ;;
    *)
        print_error "Unknown command: $1"
        help
        exit 1
        ;;
esac 