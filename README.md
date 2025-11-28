# 📘 Microservice Architecture — PUBA System
## 🔍 Overview

Project ini merupakan tugas kuliah mata kuliah Rekayasa Perangkat Lunak Beriorentasi Service untuk pengimplementasi arsitektur microservices untuk sistem manajemen perpustakaan digital bernama PUBA (Perpustakaan Berbasis Microservice).

Sistem ini dirancang untuk menangani layanan pengguna, pengelolaan buku, serta proses peminjaman dengan cara memisahkan fungsional inti ke dalam beberapa service yang berdiri sendiri,

Setiap service berjalan sebagai aplikasi independen dan berkomunikasi melalui HTTP/REST API.

## 🧩 Services

Proyek ini direncanakan memiliki tiga microservice utama:

### 1️⃣ User Service
Bertanggung jawab untuk:
Registrasi(khusus admin) & autentikasi pengguna
Validasi role / permission
Integrasi login (email/password)

Rencana endpoint contoh:

- `POST /uers/register`
- `POST /users/login`
- `GET /users/:id`

### 2️⃣ Books Service

Mengelola seluruh data buku (khusus admin), termasuk:
- `Menambahkan buku baru`
- `Update & delete data buku`
- `Pencarian buku`
- `List katalog buku`

Endpoint contoh:
- `GET /books`
- `POST /books`
- `GET /books/:id`

Service ini akan menggunakan Prisma ORM dan database bawaan pengguna

### 3️⃣ Loan Service

Mengelola proses borrow (peminjaman) dan return (pengembalian):
Fungsinya:

- Mencatat peminjaman buku oleh user
- Mengatur tanggal peminjaman & pengembalian
- Validasi ketersediaan buku
- Tracking status pinjaman

Endpoint contoh:
- `POST /loans`
- `GET /loans/user/:id`
- `POST /loans/return/:loanId`

## 🏗️ Architecture

Setiap service dirancang sebagai aplikasi independen:

- `/user-service`
- `/books-service`
- `/loan-service`

### Karakteristik arsitektur:

Stateless: setiap service berdiri sendiri tanpa berbagi state.

Database per service:
contoh: user, books, dan loans punya tabel masing-masing dalam database berbeda atau schema berbeda.

API Communication: REST over HTTP.

Deployment independent: setiap service bisa dideploy ke Cloud Run secara terpisah.

## 🛠️ Tech Stack

- Node.js + Express untuk REST API
- Prisma ORM untuk pengelolaan database
- PostgreSQL (Supabase) sebagai database utama
- Docker-ready (akan ditambahkan)
- Deployment target: Google Cloud Run

## 📂 Planned Repository Structure
```root/
 ├── user-service/
 │    └── src/...
 │
 ├── books-service/
 │    └── src/...
 │
 └── loan-service/
      └── src/...
```

Setiap folder service memiliki:

- src/ (code utama)
- ORM
- .env
- Dockerfile
- package.json

## 📝 Development Status

Project ini merupakan bagian dari tugas kuliah pada mata kuliah Perangkat Lunak Berorientasi Service. Saat ini, pekerjaan masih berada pada tahap perancangan arsitektur sistem dan penyusunan struktur masing-masing service. Implementasi backend akan dilakukan setelah perancangan schema database untuk setiap service diselesaikan.