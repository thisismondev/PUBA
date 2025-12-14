# API Documentation - User Service

**Base URL:** `http://localhost:3001`

## Authentication

### POST /regist
```json
{
  "email": "student@example.com",
  "password": "password123",
  "role": "mahasiswa"
}
```

### POST /login
```json
{
  "email": "student@example.com",
  "password": "password123"
}
```
Response: `{ token, user }`

### POST /logout
Header: `Authorization: Bearer <token>`

---

## User/Mahasiswa

### POST /user/insert
Header: `Authorization: Bearer <token>`
```json
{
  "nameMhs": "John Doe",
  "nimMhs": "2021001",
  "id_fakultas": 1,
  "thnMasuk": 2021,
  "thnLulus": 2025,
  "semester": 8,
  "status": "Aktif"
}
```
Status: `Aktif` | `Lulus` | `Cuti` | `Dropout`

### PUT /user/update
Header: `Authorization: Bearer <token>`
```json
{
  "nameMhs": "John Doe",
  "nimMhs": "2021001",
  "id_fakultas": 1,
  "thnMasuk": 2021,
  "thnLulus": 2025,
  "semester": 8,
  "status": "Lulus"
}
```

### GET /user/:idUser
Header: `Authorization: Bearer <token>`

---

## Fakultas

### GET /fakultas
No auth required
