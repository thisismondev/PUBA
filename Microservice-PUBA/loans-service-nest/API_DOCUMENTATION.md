# Loans Service API Documentation

## Overview
Loans Service mengelola peminjaman buku dan denda keterlambatan. Service ini berkomunikasi dengan books-service untuk memvalidasi ketersediaan dan update status item buku.

**Base URL:** `http://localhost:3003/api`

**Authentication:** JWT Token dari users-service

**External Dependencies:**
- books-service: `http://localhost:3001/api`
- users-service: JWT validation only (user_id from token)

---

## Endpoints

### 1. POST /api/loans
**Pinjam buku (3-Step Saga Pattern)**

- **Access:** mahasiswa, admin
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Body:**
```json
{
  "book_item_id": 1
}
```
- **Response:** `201 Created`
```json
{
  "id": "1",
  "user_id": 123,
  "book_item_id": "1",
  "loan_date": "2025-12-16T00:00:00.000Z",
  "due_date": "2025-12-23T00:00:00.000Z",
  "return_date": null,
  "status": "active",
  "created_at": "2025-12-16T00:00:00.000Z",
  "updated_at": "2025-12-16T00:00:00.000Z",
  "fine": null
}
```

**Business Logic (Saga):**
1. **Step 1 - Validation:** Call `GET books-service/api/book-items/:id` to verify item exists and status is 'available'
2. **Step 2 - Execution:** Create loan record with due_date = loan_date + 7 days
3. **Step 3 - Synchronization:** Call `PATCH books-service/api/book-items/:id/status` with `{ "status": "borrowed" }`
4. **Rollback:** If Step 3 fails, delete created loan (Compensating Transaction)

**Errors:**
- `400` - Item tidak tersedia atau tidak valid
- `404` - Item tidak ditemukan
- `500` - Gagal berkomunikasi dengan books-service atau rollback error

---

### 2. POST /api/loans/:id/return
**Kembalikan buku**

- **Access:** admin only
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Response:**
```json
{
  "loan": {
    "id": "1",
    "user_id": 123,
    "book_item_id": "1",
    "loan_date": "2025-12-16T00:00:00.000Z",
    "due_date": "2025-12-23T00:00:00.000Z",
    "return_date": "2025-12-25T00:00:00.000Z",
    "status": "returned",
    "created_at": "2025-12-16T00:00:00.000Z",
    "updated_at": "2025-12-25T00:00:00.000Z",
    "fine": {
      "id": "1",
      "loan_id": "1",
      "amount": "10000",
      "is_paid": false,
      "created_at": "2025-12-25T00:00:00.000Z",
      "updated_at": "2025-12-25T00:00:00.000Z"
    }
  },
  "fine": {
    "amount": "Rp 10.000",
    "created": true
  },
  "message": "Buku berhasil dikembalikan. Denda: Rp 10.000 (baru dibuat)"
}
```

**Business Logic:**
1. Update loan status to 'returned' and set return_date
2. Call `PATCH books-service/api/book-items/:id/status` with `{ "status": "available" }`
3. If return_date > due_date, create Fine (Rp 5,000 per day)

**Fine Calculation:**
- **Rate:** Rp 5,000 per day
- **Formula:** `days_late * 5000`
- **Example:** 2 days late = Rp 10,000

**Errors:**
- `404` - Loan tidak ditemukan
- `400` - Buku sudah dikembalikan sebelumnya

---

### 3. GET /api/loans/my
**Riwayat peminjaman user yang login**

- **Access:** authenticated users
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Response:**
```json
[
  {
    "id": "1",
    "user_id": 123,
    "book_item_id": "1",
    "loan_date": "2025-12-16T00:00:00.000Z",
    "due_date": "2025-12-23T00:00:00.000Z",
    "return_date": null,
    "status": "active",
    "fine": null
  }
]
```

---

### 4. GET /api/loans/:id
**Detail peminjaman spesifik**

- **Access:** authenticated users
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Response:** Same as POST /loans

**Errors:**
- `404` - Loan tidak ditemukan

---

### 5. GET /api/loans
**Semua peminjaman (Admin)**

- **Access:** admin only
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Response:** Array of all loans with fines included

---

## Database Schema

### Loan Model
```prisma
model Loan {
  id             BigInt     @id @default(autoincrement())
  user_id        Int        // Logical reference to users-service
  book_item_id   BigInt     // Logical reference to books-service
  loan_date      DateTime   @default(now())
  due_date       DateTime
  return_date    DateTime?
  status         LoanStatus @default(active)
  created_at     DateTime   @default(now())
  updated_at     DateTime   @updatedAt

  fine Fine?
}

enum LoanStatus {
  active
  returned
  overdue
}
```

### Fine Model
```prisma
model Fine {
  id         BigInt  @id @default(autoincrement())
  loan_id    BigInt  @unique
  amount     Decimal @db.Decimal(10, 2)
  is_paid    Boolean @default(false)
  created_at DateTime @default(now())
  updated_at DateTime @updatedAt

  loan Loan @relation(fields: [loan_id], references: [id], onDelete: Cascade)
}
```

---

## Architecture Notes

### Inter-Service Communication
- **HTTP Client:** @nestjs/axios with firstValueFrom pattern
- **Timeout:** 5 seconds for external service calls
- **Retry:** None (fail-fast with rollback)

### Transaction Pattern
- **Saga Pattern:** Choreography-based with compensating transactions
- **Rollback Strategy:** Delete created loan if book status update fails
- **Idempotency:** Fine creation checks for existing fine before creating new one

### Security
- **JWT Validation:** Stateless verification using shared JWT_SECRET
- **Payload Normalization:** Supports both 'id' and 'user_id' from different services
- **Role-Based Access:** admin for returns, mahasiswa/admin for borrowing

### Error Handling
- Network failures logged with context
- Rollback attempts logged separately
- Critical errors flagged for manual intervention

---

## Environment Variables

```env
DATABASE_URL=postgresql://...?pgbouncer=true
DIRECT_URL=postgresql://...
PORT=3003
JWT_SECRET=KonbawaHiragana123
BOOKS_SERVICE_URL=http://localhost:3001
SYSTEM_JWT_TOKEN=optional_token_for_inter_service_calls
```

---

## Example Usage

### Borrow a Book
```bash
curl -X POST http://localhost:3003/api/loans \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"book_item_id": 1}'
```

### Return a Book (Admin)
```bash
curl -X POST http://localhost:3003/api/loans/1/return \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

### Get My Loans
```bash
curl http://localhost:3003/api/loans/my \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Testing Saga Pattern

### Scenario 1: Successful Borrow
1. Book item available → GET succeeds
2. Loan created → POST succeeds
3. Book status updated → PATCH succeeds
4. ✅ Transaction complete

### Scenario 2: Rollback on Status Update Failure
1. Book item available → GET succeeds
2. Loan created → POST succeeds
3. Book status update fails → PATCH fails (network/auth error)
4. 🔄 Compensating transaction: Loan deleted
5. ❌ User receives error message

### Scenario 3: Item Not Available
1. Book item borrowed → GET returns status='borrowed'
2. ❌ Validation fails immediately
3. No loan created, no rollback needed

---

## Best Practices

1. **Always check SYSTEM_JWT_TOKEN configuration** for production deployments
2. **Monitor rollback failures** - they require manual intervention
3. **Set proper timeout values** based on network latency
4. **Use separate PowerShell window** to run dev server (VS Code terminal kills background processes)
5. **Keep JWT_SECRET synchronized** across all microservices
