# API Gateway - NestJS Reverse Proxy

## Overview
API Gateway yang berfungsi sebagai **Reverse Proxy** untuk arsitektur microservices PUBA. Gateway ini menyatukan traffic dari 3 microservices (Users, Books, Loans) ke single entry point.

**Gateway Port:** `8000`

---

## Architecture

```
Client → API Gateway (8000)
           │
           ├─ /users/*  → Users Service (3000)
           ├─ /books/*  → Books Service (3001)
           └─ /loans/*  → Loans Service (3002)
```

### Route Mapping

| Gateway Route | Target Service | Path Rewrite |
|--------------|----------------|--------------|
| `POST /users/login` | `http://localhost:3000/login` | Strip `/users` |
| `GET /books/api/books` | `http://localhost:3001/api/books` | Strip `/books` |
| `POST /loans/api/loans` | `http://localhost:3002/api/loans` | Strip `/loans` |

---

## Features

✅ **Global Proxy Middleware** - Uses `http-proxy-middleware` in `main.ts`  
✅ **Header Preservation** - Forwards `Authorization: Bearer ...` to downstream services  
✅ **Path Rewrite** - Automatically strips prefix (`/users`, `/books`, `/loans`)  
✅ **Error Handling** - Returns `502 Bad Gateway` if target service is down  
✅ **CORS Enabled** - Allows Frontend access  
✅ **Health Check** - Endpoint `/health` to verify gateway status  
✅ **Environment Validation** - Ensures all service URLs are configured  

---

## Installation

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env if needed (default values work for local development)
```

---

## Configuration

### Environment Variables

```env
# Gateway
PORT=8000

# Microservices URLs
USERS_SERVICE_URL=http://localhost:3000
BOOKS_SERVICE_URL=http://localhost:3001
LOANS_SERVICE_URL=http://localhost:3002
```

### Docker Setup

For Docker Compose, update `.env` to use service names:

```env
USERS_SERVICE_URL=http://users-service:3000
BOOKS_SERVICE_URL=http://books-service:3001
LOANS_SERVICE_URL=http://loans-service:3002
```

---

## Usage

### Development

```bash
npm run start:dev
```

### Production

```bash
npm run build
npm run start:prod
```

### Expected Output

```
[Gateway] === API Gateway Configuration ===
[Gateway] Users Service: http://localhost:3000
[Gateway] Books Service: http://localhost:3001
[Gateway] Loans Service: http://localhost:3002
[Gateway] 🚀 API Gateway running on http://localhost:8000
[Gateway] 📍 Health Check: http://localhost:8000/health
[Gateway] =================================
```

---

## API Endpoints

### Gateway Info
```bash
GET http://localhost:8000/
```

**Response:**
```json
{
  "name": "PUBA API Gateway",
  "version": "1.0.0",
  "description": "Reverse Proxy for Microservices Architecture",
  "routes": {
    "users": {
      "prefix": "/users",
      "target": "http://localhost:3000",
      "description": "Authentication and User Management"
    },
    "books": {
      "prefix": "/books",
      "target": "http://localhost:3001",
      "description": "Book and Book Item Management"
    },
    "loans": {
      "prefix": "/loans",
      "target": "http://localhost:3002",
      "description": "Loan and Fine Management"
    }
  }
}
```

### Health Check
```bash
GET http://localhost:8000/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-12-18T10:00:00.000Z",
  "uptime": 123.456,
  "services": {
    "users": "http://localhost:3000",
    "books": "http://localhost:3001",
    "loans": "http://localhost:3002"
  }
}
```

---

## Example Requests

### 1. Login (Users Service)

**Before Gateway:**
```bash
POST http://localhost:3000/login
```

**Through Gateway:**
```bash
POST http://localhost:8000/users/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}
```

### 2. Get Books (Books Service)

**Before Gateway:**
```bash
GET http://localhost:3001/api/books
Authorization: Bearer <TOKEN>
```

**Through Gateway:**
```bash
GET http://localhost:8000/books/api/books
Authorization: Bearer <TOKEN>
```

### 3. Borrow Book (Loans Service)

**Before Gateway:**
```bash
POST http://localhost:3002/api/loans
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "book_item_id": 1
}
```

**Through Gateway:**
```bash
POST http://localhost:8000/loans/api/loans
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "book_item_id": 1
}
```

---

## Error Handling

### Service Unavailable (502)

If a target service is down, the gateway returns:

```json
{
  "statusCode": 502,
  "message": "Books Service unavailable",
  "error": "Bad Gateway"
}
```

**Common Causes:**
- Target service not running
- Wrong service URL in `.env`
- Network connectivity issues

---

## Implementation Details

### Proxy Middleware (`main.ts`)

```typescript
expressApp.use(
  '/users',
  createProxyMiddleware({
    target: usersServiceUrl,
    changeOrigin: true,
    pathRewrite: {
      '^/users': '', // Strip /users prefix
    },
    onProxyReq: (proxyReq, req, res) => {
      // Preserve Authorization header
      const authHeader = req.headers.authorization;
      if (authHeader) {
        proxyReq.setHeader('Authorization', authHeader);
      }
    },
    onError: (err, req, res) => {
      // Return 502 Bad Gateway
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          statusCode: 502,
          message: 'Users Service unavailable',
          error: 'Bad Gateway',
        }),
      );
    },
  }),
);
```

### Key Configuration Options

- **`changeOrigin: true`** - Changes the origin of the host header to the target URL
- **`pathRewrite`** - Removes the prefix before forwarding
- **`onProxyReq`** - Intercepts and modifies outgoing request (preserves headers)
- **`onError`** - Handles connection failures gracefully

---

## Testing

### 1. Start All Services

```bash
# Terminal 1: Users Service
cd service-user
npm start

# Terminal 2: Books Service
cd books-services-nest
npm run start:dev

# Terminal 3: Loans Service
cd loans-service-nest
npm run start:dev

# Terminal 4: API Gateway
cd api-gateway
npm run start:dev
```

### 2. Test Gateway Routing

```bash
# Get gateway info
curl http://localhost:8000/

# Health check
curl http://localhost:8000/health

# Login through gateway
curl -X POST http://localhost:8000/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'

# Get books through gateway
curl http://localhost:8000/books/api/books \
  -H "Authorization: Bearer <TOKEN>"
```

### 3. Test Error Handling

```bash
# Stop Books Service, then try accessing it through gateway
curl http://localhost:8000/books/api/books

# Should return 502 Bad Gateway
```

---

## Best Practices

1. **Always start microservices before the gateway** - The gateway will fail to start if service URLs are unreachable
2. **Keep .env synchronized** - Ensure service URLs match actual running ports
3. **Monitor gateway logs** - Debug-level logs show all proxy requests
4. **Use health check endpoint** - Integrate with monitoring tools like Prometheus
5. **Test service failures** - Verify 502 responses when services are down

---

## Troubleshooting

### Gateway fails to start

**Error:** `Missing required environment variables`

**Solution:** Check `.env` file exists and contains all required URLs

---

### 502 Bad Gateway

**Error:** `Books Service unavailable`

**Solution:** 
1. Verify service is running: `curl http://localhost:3001/health`
2. Check service URL in `.env`
3. Ensure no firewall blocking localhost communication

---

### Authorization headers not reaching services

**Error:** `401 Unauthorized` from downstream service

**Solution:**
- Verify `Authorization: Bearer ...` header is sent to gateway
- Check `onProxyReq` implementation preserves headers
- Test directly against service to isolate issue

---

## Production Considerations

1. **Rate Limiting** - Add rate limiting middleware to prevent abuse
2. **Request Logging** - Implement structured logging for audit trails
3. **Circuit Breaker** - Add resilience patterns for service failures
4. **Service Discovery** - Integrate with Consul/Eureka for dynamic service URLs
5. **SSL/TLS** - Use HTTPS in production environments
6. **Authentication** - Consider gateway-level authentication/authorization

---

## Tech Stack

- **Framework:** NestJS 11.0.1
- **Proxy Library:** http-proxy-middleware 3.0.3
- **Configuration:** @nestjs/config 3.3.0
- **Runtime:** Node.js 18+
- **Language:** TypeScript 5.7.2

---

## License

MIT
