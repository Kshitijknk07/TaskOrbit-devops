# TaskOrbit Backend API

A modern, scalable Node.js backend API for the TaskOrbit task management application.

## 🚀 Features

- **RESTful API** with Express.js
- **JWT Authentication** with secure token handling
- **PostgreSQL Database** with Sequelize ORM
- **Input Validation** with express-validator
- **Rate Limiting** and security middleware
- **Health Checks** for monitoring
- **Clean Architecture** with separation of concerns
- **Docker Support** for containerization

## 🏗️ Architecture

```
src/
├── config/          # Database and app configuration
├── controllers/     # HTTP request handlers
├── middleware/      # Authentication, validation, error handling
├── models/          # Database models and associations
├── routes/          # API route definitions
├── services/        # Business logic layer
├── utils/           # Utility functions and seed data
└── server.js        # Main application entry point
```

## 📋 Prerequisites

- **Node.js** 18.0+
- **PostgreSQL** 15.0+
- **npm** or **yarn**

## 🛠️ Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
```bash
cp env.example .env
# Edit .env with your database credentials
```

### 3. Database Setup
```bash
# Start PostgreSQL (using Docker)
docker run -d \
  --name taskorbit-db \
  -e POSTGRES_DB=taskorbit \
  -e POSTGRES_USER=taskorbit \
  -e POSTGRES_PASSWORD=taskorbit123 \
  -p 5433:5432 \
  postgres:15-alpine
```

### 4. Start Development Server
```bash
npm run dev
```

The API will be available at `http://localhost:8080`

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/logout` - User logout

### Tasks
- `GET /api/tasks` - List all tasks (with filtering)
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get task by ID
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/stats` - Get task statistics
- `PUT /api/tasks/:id/assign` - Assign task to user

### Users
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/change-password` - Change password

### Health
- `GET /api/health` - Basic health check
- `GET /api/health/database` - Database health check
- `GET /api/health/detailed` - Detailed system health

## 📊 Database Models

### User Model
- `id` (UUID) - Primary key
- `email` (String) - Unique email address
- `password` (String) - Hashed password
- `name` (String) - User's full name
- `role` (Enum) - 'user' or 'admin'
- `is_active` (Boolean) - Account status

### Task Model
- `id` (UUID) - Primary key
- `title` (String) - Task title
- `description` (Text) - Task description
- `status` (Enum) - 'pending', 'in_progress', 'completed', 'cancelled'
- `priority` (Enum) - 'low', 'medium', 'high', 'urgent'
- `due_date` (Date) - Task due date
- `completed_at` (Date) - Completion timestamp
- `assignee_id` (UUID) - Assigned user
- `created_by` (UUID) - Task creator
- `tags` (Array) - Task tags
- `estimated_hours` (Decimal) - Estimated time
- `actual_hours` (Decimal) - Actual time spent

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. **Register/Login** to get a token
2. **Include token** in Authorization header: `Bearer <token>`
3. **Token expires** after 7 days (configurable)

### Example Usage
```bash
# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@taskorbit.com", "password": "admin123"}'

# Use token for authenticated requests
curl -X GET http://localhost:8080/api/tasks \
  -H "Authorization: Bearer <your-token>"
```

## 🧪 Demo Data

The application includes demo data for testing:

### Demo Users
- **Admin**: admin@taskorbit.com / admin123
- **John**: john@example.com / john123
- **Jane**: jane@example.com / jane123

### Demo Tasks
- Setup TaskOrbit Infrastructure (In Progress)
- Implement User Authentication (Completed)
- Create Task Management API (Pending)
- Design Frontend Dashboard (Pending)
- Setup Monitoring and Logging (Pending)

## 🐳 Docker

### Build Image
```bash
docker build -t taskorbit-backend .
```

### Run Container
```bash
docker run -p 8080:8080 \
  -e DB_HOST=host.docker.internal \
  -e DB_PORT=5433 \
  -e DB_NAME=taskorbit \
  -e DB_USER=taskorbit \
  -e DB_PASSWORD=taskorbit123 \
  taskorbit-backend
```

## 🔍 Testing

### Health Check
```bash
curl http://localhost:8080/api/health
```

### API Testing
```bash
# Test registration
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "test123", "name": "Test User"}'

# Test login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@taskorbit.com", "password": "admin123"}'
```

## 📈 Monitoring

- **Health Endpoints**: `/api/health/*`
- **Request Logging**: Morgan middleware
- **Error Handling**: Comprehensive error responses
- **Rate Limiting**: 100 requests per 15 minutes per IP

## 🔧 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 8080 | Server port |
| `NODE_ENV` | development | Environment mode |
| `DB_HOST` | localhost | Database host |
| `DB_PORT` | 5433 | Database port |
| `DB_NAME` | taskorbit | Database name |
| `DB_USER` | taskorbit | Database user |
| `DB_PASSWORD` | taskorbit123 | Database password |
| `JWT_SECRET` | - | JWT signing secret |
| `JWT_EXPIRES_IN` | 7d | JWT expiration time |
| `CORS_ORIGIN` | http://localhost:3001 | Allowed CORS origin |

## 🚀 Production Deployment

1. **Set Environment Variables**
   ```bash
   export NODE_ENV=production
   export JWT_SECRET=your-super-secret-key
   ```

2. **Build and Run**
   ```bash
   npm start
   ```

3. **Docker Deployment**
   ```bash
   docker build -t taskorbit-backend .
   docker run -d -p 8080:8080 taskorbit-backend
   ```

## 📝 API Response Format

All API responses follow this format:

```json
{
  "success": true,
  "data": {...},
  "message": "Operation successful"
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [...]
}
```

## 🔗 Related Projects

- **Frontend**: Next.js React application
- **Database**: PostgreSQL with Sequelize
- **Monitoring**: Prometheus + Grafana
- **Deployment**: Docker + Kubernetes

---

Built with ❤️ using Node.js and Express 