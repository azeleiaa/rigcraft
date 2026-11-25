# RigCraft ⚡
> **Sistem E-Commerce Sparepart PC & Smart PC Builder Simulator Berbasis Decoupled Architecture**  
> Mata Kuliah: *Pemrograman Web Lanjutan* — Universitas Primakara

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Live%20Demo-brightgreen?logo=vercel)](https://rigcraft-ebon.vercel.app)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20TypeScript-blue?logo=react)](https://react.dev/)
[![Laravel](https://img.shields.io/badge/Backend-Laravel%2013%20API-red?logo=laravel)](https://laravel.com/)
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
|       React.js + TypeScript        |  HTTP REST   |        Laravel 13 REST API         |
|   (Desktop, Tablet & Mobile UI)    |<============>|    (JWT Auth + Rule Validation)    |
|    Hosted: Vercel (Production)     |  (JSON/JWT)  | Repo: azeleiaa/rigcraft-api        |
+------------------------------------+              |     Hosted: Railway (Production)   |
                                                    +-----------------+------------------+
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
- **Backend Layer**: RESTful API berbasis Laravel 13 dengan autentikasi stateless JSON Web Token (JWT) via `php-open-source-saver/jwt-auth`.
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
| `GET` | `/api/v1/products` | Publik | Katalog produk dengan filter NoSQL (kategori, brand, harga, `socket`, `ramType`) + paginasi `meta` (FR-003) |
| `GET` | `/api/v1/products/{id}` | Publik | Rincian produk & embedded benchmark FPS (FR-005) |
| `POST` | `/api/v1/builder/validate` | Publik | **Rule-Based Compatibility Validation** (Socket CPU vs Mobo, RAM DDR4/DDR5, Wattage max 80% PSU) (FR-004) |
| `POST` | `/api/v1/vouchers/validate`| Publik | Validasi kupon promo (`RIGCRAFT2026`, `HEMAT10`, dll.) |
| `GET` | `/api/health` | Publik | Health check produksi (200 + flag env, tanpa DB/session) |
| `GET` | `/api/v1/reviews?productId=` | Publik | Daftar ulasan produk (FR-007) |
| `GET` | `/api/v1/cart` | JWT | Ambil data keranjang belanja (FR-006) |
| `POST` | `/api/v1/cart` | JWT | Tambah item ke keranjang (FR-006) |
| `PUT` | `/api/v1/cart/{productId}` | JWT | Ubah jumlah item (0 = hapus) |
| `DELETE`| `/api/v1/cart/{productId}`| JWT | Hapus item dari keranjang |
| `DELETE`| `/api/v1/cart` | JWT | Kosongkan keranjang |
| `POST` | `/api/v1/orders` | JWT | Checkout transaksi baru (FR-006) |
| `GET` | `/api/v1/orders` | JWT | Riwayat pesanan customer |
| `PUT` | `/api/v1/orders/{id}/cancel` | JWT | Batalkan pesanan sendiri (hanya Diproses/Menunggu Pembayaran) |
| `POST` | `/api/v1/reviews` | JWT | Kirim ulasan produk (rating 1-5) |
| `GET` | `/api/v1/admin/stats` | Admin | **Agregasi MongoDB**: Pendapatan, total pesanan, grafik, status pesanan (FR-007) |
| `GET` | `/api/v1/admin/products`| Admin | Daftar seluruh produk (termasuk status Draft) |
| `POST` | `/api/v1/admin/products`| Admin | Tambah produk & embedded document baru (FR-002) |
| `PUT` | `/api/v1/admin/products/{id}`| Admin| Update data produk & embedded specs (FR-002) |
| `DELETE`| `/api/v1/admin/products/{id}`| Admin| Hapus dokumen produk (FR-002) |
| `GET` | `/api/v1/admin/orders` | Admin | Seluruh riwayat transaksi pelanggan (`?status=`) |
| `PUT` | `/api/v1/admin/orders/{id}` | Admin | Update status pesanan (Diproses / Dikirim / Selesai / Dibatalkan) |
| `GET` | `/api/v1/admin/vouchers` | Admin | Daftar voucher promo |
| `POST` | `/api/v1/admin/vouchers` | Admin | Tambah voucher baru |
| `PUT` | `/api/v1/admin/vouchers/{id}` | Admin | Edit voucher |
| `DELETE`| `/api/v1/admin/vouchers/{id}` | Admin | Hapus voucher |
| `GET` | `/api/v1/admin/reviews` | Admin | Baca ulasan pelanggan |

Koleksi Postman lengkap (30 endpoint + contoh body): `../rigcraft-api/postman/RigCraft-API.postman_collection.json`.

---

## 🛠️ Panduan Instalasi & Menjalankan Proyek (Developer Guide)

### 1. Prasyarat Sistem
- **Node.js**: v18+ (disarankan Node.js 20+)
- **PHP**: v8.4+ (lock file membutuhkan `php >=8.4.1`; termasuk ekstensi `mongodb`, `openssl`, `mbstring`, `zip`)
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

### 3. Menjalankan Backend Lokal (Laravel API)

> Backend aktif dikembangkan di repository terpisah: **[azeleiaa/rigcraft-api](https://github.com/azeleiaa/rigcraft-api)**.
> Folder `api/` di repo ini adalah salinan lama (legacy) dan tidak lagi dipakai — jangan kembangkan di sana.

```powershell
cd C:\Projects\rigcraft-api
composer install
Copy-Item .env.example .env
php artisan key:generate
php artisan jwt:secret

# Atur MongoDB Atlas di .env sebelum menjalankan API.
# Gunakan database demo terpisah; db:seed menghapus data koleksi demo yang ada.
php artisan test
php artisan serve --host 0.0.0.0 --port 8000
```
API lokal berjalan di `http://localhost:8000`. Endpoint health check: `http://localhost:8000/api/health`.

### 4. Deploy Backend ke Railway untuk Demo Vercel

1. Pastikan perubahan repository `azeleiaa/rigcraft-api` sudah di-push ke GitHub (`main` auto-deploy).
2. Railway membaca `Dockerfile` (PHP 8.4 + Apache + ekstensi MongoDB prebuilt) dan menjalankan entrypoint yang mengarahkan Apache ke `$PORT`.
3. Isi environment variables di Railway:
   - `APP_KEY` — buat key baru dengan `php artisan key:generate --show`.
   - `MONGODB_URI` — URI MongoDB Atlas untuk database demo.
   - `JWT_SECRET` — buat secret baru dengan `php artisan jwt:secret`; jangan commit atau bagikan nilainya.
   - Wajib juga: `CACHE_STORE=file`, `SESSION_DRIVER=file` (cache `database` tidak didukung driver MongoDB dan membuat login/register 500), `LOG_CHANNEL=stderr`.
4. Di MongoDB Atlas, pastikan user database demo boleh terhubung dari Railway (`0.0.0.0/0` untuk tahap development). Batasi user hanya ke database demo dan jangan gunakan kredensial database yang dipakai bersama.
5. Setelah deploy, tunggu status **Live**, lalu uji `https://<domain-railway>/api/health` (harus 200 + flag env `true`).
6. Kirim URL API `https://<domain-railway>/api/v1` ke tim frontend agar mereka dapat mengatur `VITE_API_URL` di Vercel dan menghubungkan halaman aplikasi.

Jangan gunakan database bersama untuk demo: seeder menjalankan `truncate` pada koleksi user, produk, voucher, dan order.

### 5. Menjalankan Pengujian Otomatis (PHPUnit)

```powershell
cd C:\Projects\rigcraft\api
composer install
php artisan test
```

---

## 🔐 Akun Bawaan (Default Credentials)

Dibuat otomatis oleh `php artisan db:seed`:

- **Akun Admin (Role: `admin`)**:
  - Email: `admin@rigcraft.com`
  - Password: `admin123`
- **Akun Customer (Role: `customer`)**:
  - Email: `adel@example.com`
  - Password: `password123`
- **Kode Voucher Promo Aktif**:
  - `RIGCRAFT2026` (Diskon 10%, Min. belanja Rp 5.000.000)
  - `HEMAT10` (Diskon 10%, Min. belanja Rp 2.000.000)
  - `PCBARU` (Potongan Rp 500.000, Min. belanja Rp 10.000.000)

> ⚠️ Kredensial di atas adalah akun demo untuk development & UAS dan sengaja dipublikasikan agar tim/dosen bisa login.
> Karena seeder membuat akun yang sama di database produksi, **ganti password admin produksi** setelah deploy dan jangan gunakan kredensial demo untuk data sungguhan.

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
├── api/                                # ⚠️ LEGACY — salinan lama backend, tidak dipakai lagi.
                                     # Backend aktif ada di repo terpisah: azeleiaa/rigcraft-api
                                     # (Laravel 13 + Dockerfile + Railway deploy, 30 endpoint)
```
