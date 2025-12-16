# 🎯 Books Service - Quick Reference

## 🚀 Quick Start
```bash
npm install
npx prisma generate
npx prisma db push
npm run start:dev
```
**Server:** http://localhost:3000/api

---

## 📋 API Endpoints Summary

### Public (No Auth)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/books` | List all books |
| GET | `/api/books/stats` | Statistics |
| GET | `/api/books/:id` | Book detail + items |
| GET | `/api/book-items/:id` | Item detail |
| GET | `/api/book-items/:id/availability` | Check if available |
| GET | `/api/book-items/by-book/:bookId` | Items by book |

### Admin Only (Requires JWT with role="admin")
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/books` | Create book |
| DELETE | `/api/books/:id` | Delete book |
| POST | `/api/book-items` | Create item |

### System (Requires Valid JWT) ⚠️ CRITICAL
| Method | Endpoint | Description |
|--------|----------|-------------|
| PATCH | `/api/book-items/:id/status` | Update status (for loans-service) |

---

## 🔐 Authentication

### JWT Payload
```json
{
  "user_id": 101,
  "role": "mahasiswa" | "admin"
}
```

### Request Header
```
Authorization: Bearer <JWT_TOKEN>
```

### Environment Variable
```env
JWT_SECRET=your-secret-key-must-match-loans-service
```

---

## 📦 Data Models

### Book
```typescript
{
  id: BigInt
  isbn?: string (unique)
  title: string
  author: string
  publisher?: string
  category?: string
  publication_year?: number
  cover_url?: string
  created_at: DateTime
  updated_at: DateTime
  items: BookItem[]
}
```

### BookItem
```typescript
{
  id: BigInt
  book_id: BigInt
  inventory_code: string (unique)
  status: 'available' | 'borrowed' | 'lost' | 'repair'
  rack_location?: string
  created_at: DateTime
  book: Book
}
```

---

## 🔄 Status Transitions

### Valid Transitions
```
available → borrowed   ✅ (Peminjaman)
borrowed → available   ✅ (Pengembalian)
available → lost       ✅ (Admin)
available → repair     ✅ (Admin)
lost → available       ✅ (Admin - found)
repair → available     ✅ (Admin - fixed)
```

### Invalid Transitions
```
borrowed → borrowed    ❌ Already borrowed
lost → borrowed        ❌ Cannot borrow lost item
repair → borrowed      ❌ Cannot borrow item in repair
```

---

## 🧪 cURL Examples

### Create Book (Admin)
```bash
curl -X POST http://localhost:3000/api/books \
  -H "Authorization: Bearer YOUR_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Hobbit",
    "author": "J.R.R. Tolkien",
    "isbn": "978-0547928227",
    "publisher": "Houghton Mifflin",
    "category": "Fantasy",
    "publication_year": 1937
  }'
```

### Create Book Item (Admin)
```bash
curl -X POST http://localhost:3000/api/book-items \
  -H "Authorization: Bearer YOUR_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "book_id": 1,
    "inventory_code": "BOOK-001",
    "status": "available",
    "rack_location": "A1-Shelf-03"
  }'
```

### Check Availability (Public)
```bash
curl http://localhost:3000/api/book-items/1/availability
```

### Update Status to Borrowed (System/Admin)
```bash
curl -X PATCH http://localhost:3000/api/book-items/1/status \
  -H "Authorization: Bearer YOUR_JWT" \
  -H "Content-Type: application/json" \
  -d '{"status": "borrowed"}'
```

### Return Book (Update Status to Available)
```bash
curl -X PATCH http://localhost:3000/api/book-items/1/status \
  -H "Authorization: Bearer YOUR_JWT" \
  -H "Content-Type: application/json" \
  -d '{"status": "available"}'
```

---

## 🐛 Common Errors

### 401 Unauthorized
```json
{"statusCode": 401, "message": "Token tidak valid"}
```
**Fix:** Check JWT token and JWT_SECRET

### 403 Forbidden
```json
{"statusCode": 403, "message": "Akses ditolak. Memerlukan role: admin"}
```
**Fix:** Use token with "admin" role

### 404 Not Found
```json
{"statusCode": 404, "message": "Buku dengan ID 999 tidak ditemukan"}
```
**Fix:** Check if resource exists

### 409 Conflict
```json
{"statusCode": 409, "message": "Item sudah dalam status borrowed"}
```
**Fix:** Cannot borrow already borrowed item

---

## 🔧 Useful Commands

### Database
```bash
npx prisma generate      # Generate Prisma Client
npx prisma db push       # Sync schema to DB
npx prisma studio        # Open GUI
npx prisma migrate dev   # Create migration
```

### Development
```bash
npm run start            # Start normally
npm run start:dev        # Start with watch mode
npm run start:debug      # Start with debugger
npm run build            # Build for production
npm run start:prod       # Run production build
```

### Maintenance
```bash
npm run lint             # Check code style
npm run format           # Format code
npm test                 # Run tests
```

---

## 📊 Database Connection

### Supabase URLs
```env
# Pooler (untuk queries)
DATABASE_URL="postgresql://user:pass@host:6543/postgres?pgbouncer=true"

# Direct (untuk migrations)
DIRECT_URL="postgresql://user:pass@host:5432/postgres"
```

---

## 🌐 Inter-Service URLs

### From loans-service
```typescript
const BOOKS_SERVICE_URL = process.env.BOOKS_SERVICE_URL || 'http://localhost:3000';

// Check availability
await axios.get(`${BOOKS_SERVICE_URL}/api/book-items/${itemId}/availability`);

// Borrow book
await axios.patch(
  `${BOOKS_SERVICE_URL}/api/book-items/${itemId}/status`,
  { status: 'borrowed' },
  { headers: { Authorization: `Bearer ${token}` } }
);

// Return book
await axios.patch(
  `${BOOKS_SERVICE_URL}/api/book-items/${itemId}/status`,
  { status: 'available' },
  { headers: { Authorization: `Bearer ${token}` } }
);
```

---

## 🔑 JWT Secret Best Practices

### Generate Strong Secret
```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# OpenSSL
openssl rand -hex 64

# Online
# Use: https://randomkeygen.com/
```

### Share Across Services
```bash
# books-service/.env
JWT_SECRET=abc123...xyz789

# loans-service/.env
JWT_SECRET=abc123...xyz789  # MUST BE SAME!
```

---

## 📁 Important Files

| File | Description |
|------|-------------|
| `prisma/schema.prisma` | Database schema |
| `src/guards/jwt-auth.guard.ts` | JWT authentication |
| `src/book-items/book-items.service.ts` | Critical business logic |
| `API_DOCUMENTATION.md` | Complete API reference |
| `IMPLEMENTATION_SUMMARY.md` | Implementation details |
| `DEPLOYMENT_CHECKLIST.md` | Deployment guide |

---

## 🎯 Critical Considerations

1. **JWT_SECRET** must be identical in books-service and loans-service
2. **Status updates** must be transactional and validated
3. **CORS** must allow loans-service origin
4. **Error messages** should be clear for inter-service debugging
5. **Logging** critical for troubleshooting distributed systems

---

## 📞 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| Can't connect to DB | Check DATABASE_URL and network |
| JWT verification fails | Verify JWT_SECRET matches |
| CORS error | Check CORS config in main.ts |
| Build fails | Run `npm install` and check TypeScript errors |
| Prisma errors | Run `npx prisma generate` |

---

**Need detailed info?** Check these docs:
- 📖 [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- 📝 [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)
- ✅ [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
- 📚 [README.md](./README.md)

---

*Built with NestJS + Prisma + PostgreSQL (Supabase)*
