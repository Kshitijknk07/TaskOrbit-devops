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
