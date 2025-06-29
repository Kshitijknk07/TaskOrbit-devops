#!/bin/bash

echo "🛑 Stopping TaskOrbit services..."

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
