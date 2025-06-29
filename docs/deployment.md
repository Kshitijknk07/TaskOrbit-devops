# TaskOrbit Deployment Guide

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Kubernetes cluster (k3s/minikube/kind)
- kubectl configured
- Go 1.21+ (for local development)
- Node.js 18+ (for local development)

## Local Development with Docker Compose

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd taskorbit
```

2. **Start all services**
```bash
docker-compose up -d
```

3. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3001 (admin/admin)

## Kubernetes Deployment

1. **Apply Kubernetes manifests**
```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/database/
kubectl apply -f k8s/backend/
kubectl apply -f k8s/frontend/
```

2. **Check deployment status**
```bash
kubectl get pods -n taskorbit
kubectl get services -n taskorbit
```

3. **Access the application**
```bash
# Get frontend service URL
kubectl get service taskorbit-frontend -n taskorbit
```

## Local Development (Without Docker)

### Backend
```bash
cd backend
go mod download
go run main.go
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Database
Start PostgreSQL locally or use Docker:
```bash
docker run -d \
  --name taskorbit-db \
  -e POSTGRES_DB=taskorbit \
  -e POSTGRES_USER=taskorbit \
  -e POSTGRES_PASSWORD=taskorbit123 \
  -p 5432:5432 \
  postgres:15-alpine
```

## Environment Variables

### Backend
- `DB_HOST`: Database host (default: localhost)
- `DB_PORT`: Database port (default: 5432)
- `DB_USER`: Database user (default: taskorbit)
- `DB_PASSWORD`: Database password (default: taskorbit123)
- `DB_NAME`: Database name (default: taskorbit)
- `PORT`: Server port (default: 8080)

### Frontend
- `NEXT_PUBLIC_API_URL`: Backend API URL (default: http://localhost:8080)

## Monitoring

- **Prometheus**: Collects metrics from backend services
- **Grafana**: Visualizes metrics and provides dashboards
- **Health Checks**: Built-in health endpoints for all services

## CI/CD Pipeline

The GitHub Actions workflow automatically:
1. Runs tests for both backend and frontend
2. Builds Docker images
3. Pushes images to GitHub Container Registry
4. Deploys to Kubernetes (when configured)

## Troubleshooting

### Common Issues

1. **Database connection failed**
   - Check if PostgreSQL is running
   - Verify connection details

2. **Frontend can't reach backend**
   - Check NEXT_PUBLIC_API_URL environment variable
   - Ensure backend is running and accessible

3. **Prometheus not scraping metrics**
   - Check if /metrics endpoints are accessible
   - Verify Prometheus configuration

### Logs
```bash
# Docker Compose
docker-compose logs -f [service-name]

# Kubernetes
kubectl logs -f deployment/taskorbit-backend -n taskorbit
kubectl logs -f deployment/taskorbit-frontend -n taskorbit
```

## Production Considerations

1. **Security**
   - Use secrets for database passwords
   - Enable HTTPS/TLS
   - Configure proper CORS settings

2. **Performance**
   - Set up database connection pooling
   - Configure caching with Redis
   - Use CDN for frontend assets

3. **Monitoring**
   - Set up alerting rules
   - Configure log aggregation
   - Monitor resource usage

4. **Backup**
   - Regular database backups
   - Persistent volume backups
   - Configuration backups
