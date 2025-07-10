
<h1 align="center">TaskOrbit</h1>

<p align="center">
  <b>Epic, Scalable, Real-Time Task Management Platform</b><br/>
</p>

---

## 🚀 Overview

TaskOrbit is a modern, high-performance backend for collaborative task management, built with NestJS, TypeScript, and Docker. It features real-time updates, robust authentication, and seamless integration with Redis and PostgreSQL. Designed for speed, scalability, and developer happiness.

---

## 🏗️ Architecture

- **NestJS**: Modular, scalable Node.js framework
- **TypeScript**: Type-safe, maintainable codebase
- **Redis**: Fast in-memory data store for caching and pub/sub
- **PostgreSQL**: Relational database
- **Docker Compose**: Local orchestration
- **Kubernetes**: Production-grade deployment manifests

```
[Client]
   |
[Backend (NestJS)] <--> [Redis]
   |
[PostgreSQL]
```

---

## ⚡ Quickstart

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) & Docker Compose
- [Node.js 18+](https://nodejs.org/) (for local dev)
- [pnpm](https://pnpm.io/) (for local dev)

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd TaskOrbit-devops
```

### 2. Start with Docker Compose
```bash
docker-compose up --build
```
- Backend: http://localhost:3000
- Redis: localhost:6379
- PostgreSQL: localhost:5432

### 3. Local Development (Optional)
```bash
cd backend-nestjs
pnpm install
pnpm run start:dev
```

---

## 🤖 CI/CD Pipeline

- Automated with **GitHub Actions**
- On every push to `main`:
  - Lints, tests, and builds the backend
  - Builds and pushes Docker image to Docker Hub
  - (Optional) Deploys to Kubernetes (cloud cluster required)

---

## ☸️ Kubernetes Deployment

1. **Build and push your backend image:**
   ```bash
   docker build -t <your-dockerhub>/taskorbit-backend:latest ./backend-nestjs
   docker push <your-dockerhub>/taskorbit-backend:latest
   ```
2. **Deploy to your cluster:**
   ```bash
   kubectl apply -f k8s/postgres-deployment.yaml
   kubectl apply -f k8s/redis-deployment.yaml
   kubectl apply -f k8s/backend-deployment.yaml
   # (Optional) kubectl apply -f k8s/backend-ingress.yaml
   ```

---

## 📚 API Summary

### Authentication
- `POST /auth/register` — Register a new user
- `POST /auth/login` — Login and receive JWT

### Users
- `POST /users` — Create user
- `GET /users` — List users
- `GET /users/:email` — Get user by email
- `PUT /users/:email` — Update user
- `DELETE /users/:email` — Delete user

### Tasks
- `POST /tasks` — Create task
- `GET /tasks` — List tasks
- `GET /tasks/:id` — Get task by ID
- `PUT /tasks/:id` — Update task
- `DELETE /tasks/:id` — Delete task
- `PUT /tasks/:id/assign/:userId` — Assign task to user

### Health
- `GET /health` — Health check (includes Redis status)

---

## 🗃️ Data Models

### User
```json
{
  "id": "string",
  "email": "string",
  "password": "string (hashed)",
  "name": "string",
  "role": "user | admin"
}
```

### Task
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "status": "pending | in_progress | completed",
  "priority": "low | medium | high",
  "dueDate": "ISO date string",
  "assignedTo": "user id"
}
```

---

## ⚙️ Environment Variables

- `REDIS_URL` (default: `redis://redis:6379`)
- `POSTGRES_HOST` (default: `postgres`)
- `POSTGRES_PORT` (default: `5432`)
- `POSTGRES_USER` (default: `postgres`)
- `POSTGRES_PASSWORD` (default: `postgres`)
- `POSTGRES_DB` (default: `taskorbit`)
- `JWT_SECRET` (default: `changeme` — change in production)

---

## 🧪 Testing

```bash
cd backend-nestjs
pnpm run test         # Unit tests
pnpm run test:e2e     # End-to-end tests
pnpm run test:cov     # Coverage
```
## 📄 License

This project is UNLICENSED. For internal or educational use only.
