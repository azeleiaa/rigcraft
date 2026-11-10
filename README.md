# RigCraft ⚡
> **Sistem E-Commerce Sparepart PC & Smart PC Builder Simulator Berbasis Decoupled Architecture**  
> Mata Kuliah: *Pemrograman Web Lanjutan* — Universitas Primakara

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Live%20Demo-brightgreen?logo=vercel)](https://rigcraft-ebon.vercel.app)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20TypeScript-blue?logo=react)](https://react.dev/)
[![Laravel](https://img.shields.io/badge/Backend-Laravel%2011%20API-red?logo=laravel)](https://laravel.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20Atlas%20NoSQL-green?logo=mongodb)](https://www.mongodb.com/atlas)
[![JWT](https://img.shields.io/badge/Auth-JWT%20Bearer%20Tokens-purple)](https://jwt.io/)

---

## 👥 Tim Pengembang (Project Team)

| NIM | Nama | Peran | Tanggung Jawab Utama |
| :--- | :--- | :--- | :--- |
| **2401020013** | **Dewa Ayu Diah Senja Pratiwi** | *Project Lead & Integration Engineer* | Manajemen proyek, penyusunan dokumen SRS/SDS, integrasi *end-to-end* Frontend-Backend, dan pengelolaan dokumentasi API. |
| **2401020009** | **Ni Made Adelia Devananda** | *Backend & API Engineer* | Perancangan skema NoSQL database (MongoDB), pengembangan RESTful API dengan Laravel, otentikasi JWT, logika validasi kompatibilitas, dan *unit testing* (PHPUnit). |
| **2401020006** | **Kadek Mahesa Wira Darma** | *Frontend Engineer* | Pengembangan antarmuka React.js (Desktop & Mobile), state management, layout styling (*blue accent theme*), dan konsumsi API RESTful. |

---

## 🏛️ Arsitektur Sistem (Decoupled Architecture)

Sistem menggunakan pendekatan **Decoupled Architecture** (pemisahan penuh layer Frontend dan Backend):

```
+------------------------------------+              +------------------------------------+
|          FRONTEND LAYER            |              |           BACKEND LAYER            |
|       React.js + TypeScript        |  HTTP REST   |        Laravel 11 REST API         |
|   (Desktop, Tablet & Mobile UI)    |<============>|    (JWT Auth + Rule Validation)    |
|    Hosted: Vercel (Production)     |  (JSON/JWT)  |     Directory: rigcraft-api        |
+------------------------------------+              +-----------------+------------------+
                                                                      |
                                                                      | mongodb/laravel-mongodb
                                                                      v
                                                    +-----------------+------------------+
                                                    |      DATABASE NOSQL LAYER          |
                                                    |         MongoDB Atlas              |
                                                    | (Flexible JSON Document Collections)
                                                    +------------------------------------+
```

- **Frontend Layer**: Menggunakan React 18, TypeScript, dan Vite. Berjalan sebagai *Single Page Application* (SPA) responsif dengan styling custom CSS (*industrial dark theme* dengan aksen biru).
- **Backend Layer**: RESTful API berbasis Laravel 11 dengan autentikasi stateless JSON Web Token (JWT) via `php-open-source-saver/jwt-auth`.
- **Database Layer**: MongoDB NoSQL via driver `mongodb/laravel-mongodb`. Setiap kategori komponen PC memiliki fleksibilitas penyimpanan atribut spesifikasi (*specs*) yang berbeda tanpa keterbatasan skema kaku.

---

## 📦 Skema Koleksi MongoDB (NoSQL)

Sesuai dokumen SRS §3.2, RigCraft menggunakan 6 koleksi utama:

1. **`users`**
   ```json
   {
     "_id": "ObjectId",
     "name": "Admin RigCraft",
     "email": "admin@rigcraft.com",
     "password": "hashed_bcrypt_string",
     "role": "admin", // atau 'customer'
     "created_at": "ISODate"
   }
   ```
2. **`products`** *(Embedded Documents untuk Specs, Game Benchmarks & Upgrade Options)*
   ```json
   {
     "_id": "ObjectId",
     "name": "RigCraft Titan X Gaming",
     "type": "prebuilt_pc", // atau 'sparepart'
     "category": "Gaming PC",
     "brand": "RigCraft",
     "price": 35000000,
     "stock": 12,
     "status": "Aktif",
     "image_url": "https://...",
     "specs": {
       "processor": "AMD Ryzen 9 7950X3D",
       "socket": "AM5",
       "powerWattage": 850
     },
     "gameBenchmarks": [
       { "gameName": "Cyberpunk 2077", "setting": "4K Ultra", "avgFps": 85 }
     ],
     "upgradeOptions": [
       { "title": "Upgrade RAM", "description": "To 64GB DDR5", "additionalPrice": 1800000 }
     ]
   }
   ```
3. **`vouchers`**: Kode promo (`code`, `discountPercentage`, `discountAmount`, `minPurchase`, `isActive`, `expiredAt`).
4. **`orders`**: Transaksi checkout (`orderNumber`, `userId`, `totalAmount`, `status`, `shippingDetails`, `items[]`).
5. **`carts`**: Keranjang belanja aktif per pengguna (`userId`, `items[]` dengan embedded `selectedSpecs`).
6. **`reviews`**: Ulasan dan testimoni produk (`userId`, `productId`, `rating`, `comment`).

---

## 📡 Ringkasan RESTful API Endpoints (SRS §3.3)

Base URL Lokal: `http://localhost:8000/api/v1`

| Method | Endpoint | Auth | Modul & Deskripsi |
| :--- | :--- | :---: | :--- |
| `POST` | `/api/v1/auth/register` | Publik | Registrasi customer baru (FR-001) |
| `POST` | `/api/v1/auth/login` | Publik | Login & generate JWT Token (FR-001) |
| `GET` | `/api/v1/auth/me` | JWT | Profil pengguna aktif |
| `POST` | `/api/v1/auth/logout` | JWT | Invalidate token pengguna |
| `GET` | `/api/v1/products` | Publik | Katalog produk dengan filter NoSQL (kategori, brand, harga) (FR-003) |
| `GET` | `/api/v1/products/{id}` | Publik | Rincian produk & embedded benchmark FPS (FR-005) |
| `POST` | `/api/v1/builder/validate` | Publik | **Rule-Based Compatibility Validation** (Socket CPU vs Mobo, RAM DDR4/DDR5, Wattage vs PSU) (FR-004) |
| `POST` | `/api/v1/vouchers/validate`| Publik | Validasi kupon promo (`RIGCRAFT2026`, `HEMAT10`, dll.) |
| `GET` | `/api/v1/cart` | JWT | Ambil data keranjang belanja (FR-006) |
| `POST` | `/api/v1/cart` | JWT | Tambah item ke keranjang (FR-006) |
| `DELETE`| `/api/v1/cart/{productId}`| JWT | Hapus item dari keranjang |
| `DELETE`| `/api/v1/cart` | JWT | Kosongkan keranjang |
| `POST` | `/api/v1/orders` | JWT | Checkout transaksi baru (FR-006) |
| `GET` | `/api/v1/orders` | JWT | Riwayat pesanan customer |
| `GET` | `/api/v1/admin/stats` | Admin | **Agregasi MongoDB**: Pendapatan, total pesanan, grafik, status pesanan (FR-007) |
| `GET` | `/api/v1/admin/products`| Admin | Daftar seluruh produk (termasuk status Draft) |
| `POST` | `/api/v1/admin/products`| Admin | Tambah produk & embedded document baru (FR-002) |
| `PUT` | `/api/v1/admin/products/{id}`| Admin| Update data produk & embedded specs (FR-002) |
| `DELETE`| `/api/v1/admin/products/{id}`| Admin| Hapus dokumen produk (FR-002) |
| `GET` | `/api/v1/admin/orders` | Admin | Seluruh riwayat transaksi pelanggan |
| `PUT` | `/api/v1/admin/orders/{id}` | Admin | Update status pesanan (Diproses / Dikirim / Selesai / Dibatalkan) |

---

## 🛠️ Panduan Instalasi & Menjalankan Proyek (Developer Guide)

### 1. Prasyarat Sistem
- **Node.js**: v18+ (disarankan Node.js 20+)
- **PHP**: v8.2+ (termasuk ekstensi `mongodb`, `openssl`, `curl`, `mbstring`, `zip`)
- **Composer**: v2+
- **MongoDB**: Akun MongoDB Atlas (Cloud) atau MongoDB Community lokal

---

### 2. Menjalankan Frontend (React.js)

```powershell
# 1. Pindah ke direktori frontend
cd c:\Projects\rigcraft

# 2. Pasang dependensi
npm install

# 3. Jalankan development server
npm run dev
```
Aplikasi frontend akan terbuka di: `http://localhost:5173`.  
Versi produksi telah di-deploy di Vercel: **[https://rigcraft-ebon.vercel.app](https://rigcraft-ebon.vercel.app)**.

Untuk mengatur endpoint backend API di frontend, gunakan file `.env`:
```env
VITE_API_URL=http://localhost:8000/api/v1
```

Helper API terpusat tersedia di `src/lib/api.ts` (`authApi`, `productsApi`, `builderApi`, `cartApi`, `ordersApi`, `adminApi`).

---

### 3. Menjalankan Backend (Laravel API)

```powershell
# 1. Pindah ke direktori backend API
cd c:\Projects\rigcraft-api

# 2. Pastikan file .env telah terkonfigurasi dengan MongoDB Atlas
# (Kredensial sudah terpasang di .env)
# MONGODB_URI="mongodb+srv://devanandadelia_db_user:30cn4EUfg9CselKO@rigcraft-cluster.qgw6qw3.mongodb.net/rigcraft?retryWrites=true&w=majority"

# 3. Jalankan Database Seeder (Membuat data dummy produk, voucher, admin & customer)
php artisan db:seed

# 4. Jalankan server Laravel API
php artisan serve
```
Server API backend akan aktif di: **`http://localhost:8000`**.

---

### 4. Menjalankan Pengujian Otomatis (PHPUnit)

Sesuai rencana pengujian pada SRS §4:

```powershell
cd c:\Projects\rigcraft-api
php artisan test
```
*Hasil uji: 6 passed tests, 9 assertions (100% lulus).*

---

## 🔐 Akun Bawaan (Default Credentials)

Dibuat otomatis oleh `php artisan db:seed`:

- **Akun Admin (Role: `admin`)**:
  - Email: `admin@rigcraft.com`
  - Password: `admin123`
- **Akun Customer (Role: `customer`)**:
  - Email: `budi@example.com`
  - Password: `password123`
- **Kode Voucher Promo Aktif**:
  - `RIGCRAFT2026` (Diskon 10%, Min. belanja Rp 5.000.000)
  - `HEMAT10` (Diskon 10%, Min. belanja Rp 2.000.000)
  - `PCBARU` (Potongan Rp 500.000, Min. belanja Rp 10.000.000)

---

## 📂 Struktur Repositori (Project Structure)

```
c:\Projects\
├── rigcraft/                          # Layer Frontend (React.js + Vite + TypeScript)
│   ├── public/
│   ├── src/
│   │   ├── components/                # Layout UI, AdminLayout, Header, Sidebar
│   │   ├── lib/
│   │   │   └── api.ts                 # Centralized API Client (Fetch + JWT Auth)
│   │   ├── pages/                     # Storefront & Admin Views
│   │   │   ├── storefront/            # Home, Catalog, ProductDetail, Builder, Cart, Checkout, Auth
│   │   │   └── Dashboard.tsx, Orders.tsx, Products.tsx, Customers.tsx, Reports.tsx
│   │   ├── storefront/                # Storefront CSS & theme specifications
│   │   └── styles/                    # Industrial tokens & components styles
│   ├── vercel.json                    # Konfigurasi SPA routing rewrite untuk Vercel
│   └── package.json
│
└── rigcraft-api/                      # Layer Backend (Laravel 11 + MongoDB NoSQL)
    ├── app/
    │   ├── Http/
    │   │   ├── Controllers/Api/       # AuthController, ProductController, BuilderController, CartController, OrderController, AdminController
    │   │   └── Middleware/            # EnsureAdmin.php (Admin Role Guard)
    │   └── Models/                    # User.php, Product.php, Order.php, Cart.php, Voucher.php, Review.php (MongoDB Eloquent)
    ├── config/
    │   ├── auth.php                   # Guard api => driver: jwt
    │   ├── database.php               # Driver mongodb
    │   ├── cors.php                   # Konfigurasi CORS frontend
    │   └── jwt.php                    # Konfigurasi JWT token & TTL
    ├── database/
    │   └── seeders/DatabaseSeeder.php # Seeder produk, user, voucher, index NoSQL
    ├── routes/
    │   └── api.php                    # 21 REST API Endpoints (/api/v1/...)
    ├── tests/
    │   └── Feature/RigCraftApiTest.php# Pengujian PHPUnit untuk SRS §4
    └── .env                           # Konfigurasi MONGODB_URI Atlas & JWT_SECRET
```
