# RigCraft RESTful API (Laravel + MongoDB Decoupled Backend)

Backend RESTful API untuk **RigCraft: Sistem E-Commerce Sparepart PC & Smart PC Builder Simulator Berbasis Decoupled Architecture**.

- **Mata Kuliah**: Pemrograman Web Lanjutan
- **Program Studi**: Informatika - Universitas Primakara
- **Tech Stack**: Laravel 13, MongoDB (via `mongodb/laravel-mongodb`), JWT Authentication (`php-open-source-saver/jwt-auth`), PHPUnit

---

## 🚀 Setup & Menjalankan Backend

### 1. Konfigurasi MongoDB (`.env`)

Salin `.env.example` menjadi `.env` di direktori `api/`, lalu isi kredensial MongoDB secara lokal. Jangan commit `.env`.

```env
DB_CONNECTION=mongodb
DB_DATABASE=rigcraft_demo

# Opsi A: MongoDB Lokal (jika MongoDB Server terinstall di komputer)
MONGODB_URI=mongodb://127.0.0.1:27017/rigcraft_demo

# Opsi B: MongoDB Atlas (Cloud)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/rigcraft_demo?retryWrites=true&w=majority
```

### 2. Isi Data Awal (Database Seeder)

Seeder menjalankan `truncate` pada koleksi user, produk, voucher, review, dan order. Jalankan hanya pada database demo yang tidak dipakai bersama:

```powershell
php artisan db:seed
```

Akun default yang dibuat oleh seeder:
- **Admin**: `admin@rigcraft.com` / `admin123` (Role: `admin`)
- **Customer**: `adel@example.com` / `password123` (Role: `customer`)

### 3. Jalankan Server API

```powershell
php artisan serve
```
API akan berjalan di `http://localhost:8000`.

### 4. Menjalankan Unit & Integration Testing (PHPUnit)

Sesuai rencana pengujian pada SRS §4:

```powershell
php artisan test
```

---

## 📡 Daftar Endpoint RESTful API (SRS §3.3)

Base URL: `http://localhost:8000/api/v1`

### 1. Autentikasi Pengguna (JWT)
- `POST /api/v1/auth/register` — Registrasi customer baru (201 Created)
- `POST /api/v1/auth/login` — Login & generate Bearer Token JWT (200 OK)
- `GET  /api/v1/auth/me` — Info profil pengguna login (Requires JWT)
- `POST /api/v1/auth/logout` — Invalidate token (Requires JWT)

### 2. Katalog Produk & Spesifikasi (NoSQL)
- `GET  /api/v1/products` — Daftar katalog produk dengan filter query NoSQL (`category`, `brand`, `min_price`, `max_price`, `q`)
- `GET  /api/v1/products/{id}` — Detail produk beserta embedded specs & game benchmarks

### 3. PC Builder Simulator (Rule-Based Validation - FR-004)
- `POST /api/v1/builder/validate` — Validasi cross-reference spesifikasi (Socket CPU vs Motherboard, Tipe RAM DDR4/DDR5, Konsumsi Wattage vs PSU)

### 4. Keranjang Belanja (FR-006)
- `GET    /api/v1/cart` — Ambil keranjang belanja pengguna aktif
- `POST   /api/v1/cart` — Tambah item ke keranjang
- `DELETE /api/v1/cart/{productId}` — Hapus item dari keranjang
- `DELETE /api/v1/cart` — Kosongkan keranjang

### 5. Transaksi & Voucher (FR-006)
- `POST /api/v1/vouchers/validate` — Cek validitas kode kupon promo (`RIGCRAFT2026`, `HEMAT10`, dll.)
- `POST /api/v1/orders` — Checkout & buat dokumen pesanan baru
- `GET  /api/v1/orders` — Riwayat pesanan pengguna login

### 6. Admin Management & Dashboard (FR-002, FR-007)
*Memerlukan Bearer Token dengan role `admin`*
- `GET    /api/v1/admin/stats` — Agregasi statistik dashboard (Total Pendapatan, Total Pesanan, Produk Terjual, Distribusi Kategori)
- `GET    /api/v1/admin/products` — Daftar semua produk
- `POST   /api/v1/admin/products` — Tambah produk baru (CRUD)
- `PUT    /api/v1/admin/products/{id}` — Edit produk & dokumen embedded
- `DELETE /api/v1/admin/products/{id}` — Hapus produk
- `GET    /api/v1/admin/orders` — Daftar seluruh transaksi masuk
- `PUT    /api/v1/admin/orders/{id}` — Update status pesanan (Diproses / Dikirim / Selesai)

---

## ☁️ MongoDB Atlas — Database Cloud Multi-Perangkat (Rekomendasi)

Database lokal (`127.0.0.1`) hanya bisa diakses dari satu komputer. Untuk akses dari
laptop, PC lab, dan perangkat lain, gunakan **MongoDB Atlas free tier (M0)**.

### 1. Buat Cluster

1. Buka <https://cloud.mongodb.com> dan daftar/masuk (bisa dengan akun Google).
2. Buat project baru, misalnya **RigCraft**.
3. Klik **Build a Database** → pilih **M0 Free**.
4. Provider **AWS**, region **Singapore (ap-southeast-1)** (paling dekat ke Indonesia).
5. Klik **Create Deployment**.

### 2. Buat User & Izinkan Akses

1. Di dialog **Security Quickstart**, buat database user (contoh: `rigcraft_admin`)
   dan simpan password-nya.
2. Buka **Network Access** → **Add IP Address** → pilih **Allow Access from Anywhere**
   (`0.0.0.0/0`) untuk tahap development. Ini yang membuat database bisa diakses
   dari perangkat mana pun.

### 3. Ambil Connection String

1. Klik **Connect** → **Drivers** → **Laravel / PHP**.
2. Copy string `mongodb+srv://...`.
3. Ganti `<password>` dengan password user (URL-encode karakter khusus, mis. `@` → `%40`)
   dan pastikan nama database `rigcraft` ada sebelum tanda `?`.

### 4. Pasang di `.env`

```env
DB_CONNECTION=mongodb
DB_DATABASE=rigcraft
MONGODB_URI=mongodb+srv://rigcraft_admin:PASSWORD@cluster0.xxxxx.mongodb.net/rigcraft?retryWrites=true&w=majority
```

### 5. Isi Data & Buat Index

```powershell
php artisan db:seed
```

Seeder otomatis mengisi koleksi `users`, `products`, `vouchers`, `reviews`, `orders`
dan menjalankan `php artisan mongo:indexes` untuk index `category`, `brand`, `price`,
`name` (SRS NFR: Performance).

Jalankan `php artisan mongo:indexes` secara terpisah kapan pun index perlu dibuat ulang.

> **Catatan:** Atlas membuat database `rigcraft` secara otomatis saat data pertama ditulis.
> Jangan commit file `.env` karena berisi kredensial. Untuk produksi, ganti
> `0.0.0.0/0` dengan IP server backend saja.
