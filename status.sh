#!/bin/bash

# TaskOrbit Status Check Script
echo "🚀 TaskOrbit Status Check"
echo "=========================="

# Check if services are running
echo -e "\n📊 Service Status:"
echo "Backend API (port 8080):"
if curl -s http://localhost:8080/health > /dev/null; then
    echo "  ✅ Running - http://localhost:8080"
else
    echo "  ❌ Not running"
fi

echo "Frontend (port 3001):"
if curl -s http://localhost:3001 > /dev/null; then
    echo "  ✅ Running - http://localhost:3001"
else
    echo "  ❌ Not running"
fi

echo "Database (PostgreSQL):"
if sudo systemctl is-active --quiet postgresql; then
    echo "  ✅ Running"
else
    echo "  ❌ Not running"
fi

# Show recent logs
echo -e "\n📝 Recent Logs:"
echo "Backend (last 3 lines):"
tail -3 backend.log 2>/dev/null || echo "  No backend log found"

echo -e "\nFrontend (last 3 lines):"
tail -3 frontend.log 2>/dev/null || echo "  No frontend log found"

echo -e "\n🌐 Access URLs:"
echo "  Frontend: http://localhost:3001"
echo "  Backend API: http://localhost:8080"
echo "  Health Check: http://localhost:8080/health"
echo "  Tasks API: http://localhost:8080/api/tasks"

echo -e "\n🎮 Demo Credentials:"
echo "  Email: admin@taskorbit.com (or any email)"
echo "  Password: any password" 