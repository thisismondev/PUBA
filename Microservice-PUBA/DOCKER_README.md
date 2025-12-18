# PUBA Microservices - Docker Setup

Complete Docker Compose configuration for PUBA Library Management System microservices.

## Architecture

```
Docker Network: puba-microservices
├── users-service (Port 3000)
├── books-service (Port 3001)
├── loans-service (Port 3002)
└── api-gateway (Port 8000)
```

---

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- 2GB available RAM
- 5GB available disk space

---

## Quick Start

### 1. Setup Environment Variables

```bash
# Copy environment template
cp .env.example .env

# Edit .env and fill in your credentials:
# - JWT_SECRET
# - BOOKS_DATABASE_URL
# - BOOKS_DIRECT_URL
# - LOANS_DATABASE_URL
# - LOANS_DIRECT_URL
```

### 2. Build and Start All Services

```bash
# Navigate to Microservice-PUBA directory
cd "C:\project VSCode\Tugas PLBService\PUBA\Microservice-PUBA"

# Build and start all services
docker-compose up -d --build
```

### 3. View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api-gateway
docker-compose logs -f users-service
docker-compose logs -f books-service
docker-compose logs -f loans-service
```

### 4. Check Service Status

```bash
docker-compose ps
```

### 5. Stop All Services

```bash
docker-compose down
```

---

## Running Options

### Option 1: Docker Compose (Recommended for Production)

```powershell
# Navigate to project directory
cd "C:\project VSCode\Tugas PLBService\PUBA\Microservice-PUBA"

# Start all services
docker-compose up -d --build

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Option 2: Manual Startup (Development Mode)

Run each service in separate terminal windows:

```powershell
# Terminal 1 - Users Service
cd "C:\project VSCode\Tugas PLBService\PUBA\Microservice-PUBA\service-user"
npm install
npm start
Testing Endpoints

### Gateway Health Check

```bash
curl http://localhost:8000/health
```

### Access Services Through Gateway

**Login:**
```bash
POST http://localhost:8000/users/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Get All Books:**
```bash
GET http://localhost:8000/books/api/books
Authorization: Bearer <TOKEN>
```

**Create Loan:**
```bash
POST http://localhost:8000/loans/api/loans
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "book_item_id": 1
}
```

**Return Book:**
```bash
POST http://localhost:8000/loans/api/loans/:id/return
Authorization: Bearer <TOKEN>
```

### Using cURL

```bash
# Login
curl -X POST http://localhost:8000/users/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@example.com\",\"password\":\"admin123\"}"

# Get Books
curl http://localhost:8000/books/api/books \
  -H "Authorization: Bearer <TOKEN>"

# Borrow Book
curl -X POST http://localhost:8000/loans/api/loans \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d "{\"book_item_id\":1}"
## Service Details

### Users Service
- **Container:** `puba-users-service`
- **Port:** 3000
- **Technology:** Node.js + Express
- **Endpoints:** `/login`, `/regist`, `/user/*`

### Books Service
- **Container:** `puba-books-service`
- **Port:** 3001
- **Technology:** NestJS + Prisma
- **Endpoints:** `/api/books`, `/api/book-items`
- **Database:** Supabase PostgreSQL

### Loans Service
- **Container:** `puba-loans-service`
- **Port:** 3002
- **Technology:** NestJS + Prisma
- **Endpoints:** `/api/loans`, `/api/loans/:id/return`
- **Database:** Supabase PostgreSQL

### API Gateway
- **Container:** `puba-api-gateway`
- **Port:** 8000
- **Technology:** NestJS + http-proxy-middleware
- **Routes:** `/users/*`, `/books/*`, `/loans/*`

---

## Usage

### Access Services Through Gateway

```bash
# Login
curl -X POST http://localhost:8000/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'

# Get Books
curl http://localhost:8000/books/api/books \
  -H "Authorization: Bearer <TOKEN>"

# Borrow Book
curl -X POST http://localhost:8000/loans/api/loans \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"book_item_id":1}'
```

### Direct Service Access

```bash
# Users Service
curl http://localhost:3000/login

# Books Service
curl http://localhost:3001/api/books

# Loans Service
curl http://localhost:3002/api/loans
```

---

## Docker Commands

### Rebuild Specific Service

```bash
docker-compose up -d --build users-service
docker-compose up -d --build books-service
docker-compose up -d --build loans-service
docker-compose up -d --build api-gateway
```

### Restart Service

```bash
docker-compose restart users-service
docker-compose restart books-service
docker-compose restart loans-service
docker-compose restart api-gateway
```

### Stop and Remove Containers

```bash
docker-compose down

# Remove volumes as well
docker-compose down -v
```

### View Resource Usage

```bash
docker stats
```

---

## Health Checks

All services have health check endpoints:

```bash
# Gateway
curl http://localhost:8000/health

# Books Service
curl http://localhost:3001/api/health

# Loans Service
curl http://localhost:3002/api/health
```

---

## Troubleshooting

### Service Won't Start

```bash
# Check logs
docker-compose logs <service-name>

# Rebuild from scratch
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Port Already in Use

```bash
# Stop containers
docker-compose down

# Check port usage
netstat -ano | findstr "3000 3001 3002 8000"

# Kill conflicting process
taskkill /PID <PID> /F
```

### Database Connection Issues

- Verify `DATABASE_URL` in docker-compose.yml
- Check Supabase service status
- Ensure internet connectivity

### Network Issues

```bash
# Inspect network
docker network inspect puba-microservices

# Recreate network
docker-compose down
docker network prune
docker-compose up -d
```

---

## Production Considerations

1. **Environment Variables**
   - Store secrets in `.env` file (not in docker-compose.yml)
   - Use Docker secrets for sensitive data

2. **Database**
   - Consider local PostgreSQL for production
   - Setup database migrations in Dockerfile

3. **Reverse Proxy**
   - Add Nginx/Traefik in front of API Gateway
   - Configure SSL/TLS certificates

4. **Monitoring**
   - Add Prometheus + Grafana for metrics
   - Configure logging aggregation (ELK stack)

5. **Scaling**
   - Use Docker Swarm or Kubernetes
   - Configure replicas for each service

---

## Development vs Production

### Development (Local)

```bash
# Use local Node.js
npm run start:dev
```

### Production (Docker)

```bash
# Use Docker Compose
docker-compose up -d
```

---

## File Structure

```
Microservice-PUBA/
├── docker-compose.yml          # Main orchestration file
├── service-user/
│   ├── Dockerfile
│   └── .dockerignore
├── books-services-nest/
│   ├── Dockerfile
│   └── .dockerignore
├── loans-service-nest/
│   ├── Dockerfile
│   └── .dockerignore
└── api-gateway/
    ├── Dockerfile
    └── .dockerignore
```

---

## Network Configuration

All services run on `puba-microservices` bridge network:
- Internal DNS: Service names resolve to container IPs
- External access: Mapped host ports (3000, 3001, 3002, 8000)

---

## License

MIT
