# Panduan Belajar Progress Backend RigCraft

**Tujuan:** pegangan singkat untuk memahami dan melaporkan progress backend.
**Status per:** 11 November 2026
**Catatan:** panduan ini membedakan implementasi yang sudah ada, perubahan repository hari ini, dan pekerjaan yang belum selesai.

## Ringkasan satu menit

> Backend RigCraft menggunakan Laravel dan MongoDB, dengan endpoint REST untuk autentikasi JWT, produk, validasi rakitan PC, voucher, cart, order, dan admin. Source backend yang sebelumnya berada di folder terpisah sudah dimasukkan ke repository utama pada folder `api/`. Konfigurasi Docker dan Render Free juga sudah disiapkan, tetapi API belum dideploy. Pengujian otomatis yang ada belum lulus seluruhnya: test memakai konfigurasi database SQLite `:memory:`, sementara model API menggunakan MongoDB. Berikutnya adalah memperbaiki strategi testing, deploy ke Render dengan database demo khusus, lalu smoke-test API. Integrasi halaman frontend dikerjakan oleh tim frontend.

## Pembagian tanggung jawab

**Bagian backend:**
- Menyediakan dan menguji API Laravel.
- Menghubungkan API ke MongoDB.
- Mengelola autentikasi, validasi data, aturan bisnis, otorisasi, dan respons API.
- Men-deploy API dan memberikan URL publik ke tim frontend.

**Bagian frontend:**
- Mengatur `VITE_API_URL` di Vercel.
- Memanggil endpoint API dari halaman React.
- Menampilkan data, status, dan pesan error dari API.

Jadi, tanggung jawab backend adalah membuat API siap dipakai dan menyerahkan URL/kontraknya. Penyambungan halaman ke API berada di sisi frontend atau integrasi tim.

## Apa yang berubah hari ini?

| Commit | Perubahan | Arti untuk progress |
|---|---|---|
| `f690454` | Source Laravel yang sebelumnya terpisah disalin ke `api/`; ditambahkan Dockerfile, template `.env.example`, pengaturan CORS berbasis environment variable, aturan `.gitignore`, dan dokumentasi. | Backend kini ikut tersimpan bersama frontend di repository GitHub. File `.env` dan `vendor` tidak ikut dipush. |
| `85ded62` | Konfigurasi Railway diganti dengan Blueprint Render Free di `render.yaml`; dokumentasi deployment diperbarui. | Ada rancangan deployment API yang dapat dibuat dari repository GitHub. |
| `438c977` | Perubahan percobaan integrasi login frontend dibatalkan; dokumentasi diperjelas agar URL API diserahkan ke tim frontend. | Scope akhir tetap fokus ke backend. |

Source API dan fitur-fitur di bawah ini merupakan backend project yang sudah tersedia; perubahan hari ini terutama memindahkan source tersebut ke repository utama dan menyiapkan deployment, bukan menulis ulang seluruh fitur API.

## Cara kerja sistem

1. Browser/frontend mengirim request HTTP ke endpoint, misalnya `POST /api/v1/auth/login`.
2. Laravel menerima request di `routes/api.php`, memvalidasi input, lalu menjalankan controller yang sesuai.
3. Controller membaca atau mengubah data melalui model Laravel yang terhubung ke MongoDB.
4. Laravel mengembalikan status HTTP dan respons JSON.
5. Untuk endpoint privat, frontend menyertakan JWT pada header `Authorization: Bearer ...`.

**Istilah dasar:**

- **API:** pintu komunikasi agar frontend bisa meminta atau mengubah data di backend.
- **Endpoint:** alamat dan metode untuk suatu fungsi API. Contoh: `GET /api/v1/products`.
- **REST/JSON:** pola komunikasi HTTP; data umumnya dikirim dan diterima dalam format JSON.
- **Controller:** kode yang menangani request tertentu.
- **Model:** representasi data/collection yang dipakai Laravel untuk berkomunikasi dengan database.
- **MongoDB collection:** kelompok dokumen data; mirip tabel, tetapi bentuk dokumennya fleksibel.
- **JWT:** token yang dikirim setelah login untuk membuktikan identitas pada request berikutnya.
- **CORS:** aturan browser yang menentukan domain frontend mana yang boleh memanggil API.
- **Seeder:** skrip untuk mengisi database dengan data awal/demo.
- **Index:** struktur database yang membantu pencarian/filter lebih cepat.
- **Docker:** cara mengemas aplikasi dan dependensinya supaya lingkungan deploy konsisten.
- **Smoke test:** pengecekan singkat bahwa deployment hidup dan endpoint penting merespons.

## Fitur backend yang sudah ada

Endpoint didaftarkan dengan prefix `/api/v1` di `api/routes/api.php`.

| Modul | Endpoint utama | Ringkasannya |
|---|---|---|
| Auth | `POST /auth/register`, `POST /auth/login`, `GET /auth/me`, `POST /auth/logout` | Registrasi, login JWT, profil pengguna, dan logout. |
| Produk | `GET /products`, `GET /products/{id}` | Katalog, filter, pencarian, serta detail produk. |
| Builder | `POST /builder/validate` | Memeriksa kecocokan socket CPU/motherboard, tipe RAM, dan kebutuhan daya PSU. |
| Voucher | `POST /vouchers/validate` | Memeriksa kode dan persyaratan voucher. |
| Cart/order | `/cart`, `/orders` | Operasi cart dan checkout; beberapa endpoint perlu login JWT. |
| Admin | `/admin/stats`, `/admin/products`, `/admin/orders` | Statistik, pengelolaan produk/pesanan; perlu JWT dan role admin. |

Password pengguna di-hash memakai Laravel Hash/Bcrypt. Route admin memakai middleware autentikasi dan pengecekan role admin. Periksa file controller sebelum menjelaskan detail aturan yang lebih spesifik.

## Status terhadap SRS/SDS

- **Arah arsitektur:** backend Laravel, database MongoDB, dan autentikasi JWT sesuai rancangan.
- **API dan modul utama:** route untuk kebutuhan inti sudah tersedia.
- **Index database:** command `php artisan mongo:indexes` disediakan untuk index filter/search dan lookup.
- **Testing:** test PHPUnit sudah ada, tetapi belum menjadi bukti semua acceptance criteria lulus.
- **Deployment:** konfigurasi awal Render tersedia; belum ada URL API live yang telah diverifikasi.
- **Integrasi end-to-end:** belum terverifikasi. URL API perlu dikirim ke tim frontend setelah tersedia.
- **Target performa SRS (<500 ms):** belum diukur; jangan klaim tercapai sebelum ada pengukuran.
- **Keamanan:** konfigurasi mencakup hashing password, JWT, validasi, dan route admin. Security review menyeluruh belum dilakukan.

## Status test saat ini — penting untuk dijelaskan dengan jujur

Ketika `php artisan test` dijalankan dari folder `api/` di repository, **4 test gagal**. Penyebab yang terlihat adalah konfigurasi `api/phpunit.xml` menggunakan `DB_CONNECTION=sqlite` dan `DB_DATABASE=:memory:`, sementara query model berjalan melalui MongoDB. Driver MongoDB kemudian membaca `:memory:` sebagai nama database dan mengembalikan error namespace.

Ini berarti konfigurasi test dan backend database belum selaras. Hasil ini **bukan bukti bahwa semua endpoint sudah rusak**, tetapi juga berarti kita **belum boleh menyebut test suite lulus**. Satu test lolos; test lain yang gagal perlu diperiksa setelah strategi database test diperbaiki. Test yang sudah ada menguji akses katalog, validasi builder tanpa komponen, dan penolakan akses tanpa token; cakupannya masih perlu ditambah.

## Pekerjaan backend berikutnya

1. **Buat test berjalan konsisten.** Pilih MongoDB test database yang terisolasi, atau mock dependency database untuk unit test. Jangan memakai database produksi/demo bersama dalam test.
2. **Tambah skenario penting:** register/login berhasil dan gagal, token valid/tidak valid, akses admin vs customer, filter produk, serta builder cocok/tidak cocok.
3. **Siapkan MongoDB Atlas khusus demo.** Seeder menjalankan `truncate` pada beberapa collection, jadi jangan jalankan terhadap database yang menyimpan data penting atau dipakai bersama.
4. **Deploy API di Render.** Login Render, buat Blueprint dari repo `azeleiaa/rigcraft`, lalu isi secret langsung di dashboard Render. Jangan commit atau mengirim `APP_KEY`, `JWT_SECRET`, atau `MONGODB_URI`.
5. **Verifikasi hosting:** cek `/up`, katalog, login, endpoint terlindungi, dan CORS. Catat URL publik API dan hasil pengecekan.
6. **Kirim URL API dan dokumentasi endpoint ke tim frontend.**
7. **Ukur response time** endpoint utama untuk mengecek target SRS <500 ms dan laporkan metodenya.

Render Free menidurkan web service setelah sekitar 15 menit tidak aktif; request pertama setelah tidur dapat membutuhkan sekitar satu menit untuk bangun. Jadi, sebelum demo, buka endpoint health check lebih awal. Lihat [batasan Render Free](https://render.com/docs/free).

## Checklist sebelum laporan/demo

- [ ] Render service sudah berstatus Live.
- [ ] Secret diisi langsung di Render; tidak ada `.env` rahasia di GitHub.
- [ ] MongoDB URI menunjuk ke database demo yang aman.
- [ ] Data demo sudah tersedia jika demo butuh katalog terisi.
- [ ] `GET /up` mengembalikan status sukses.
- [ ] `GET /api/v1/products` merespons JSON yang diharapkan.
- [ ] Login menghasilkan token dan endpoint privat menolak request tanpa token.
- [ ] CORS mengizinkan domain frontend Vercel yang benar.
- [ ] Tim frontend menerima URL API dan tahu endpoint yang akan dipakai.
- [ ] Test yang gagal dan keterbatasannya disebutkan apa adanya.

## Pertanyaan yang mungkin ditanyakan

**“Apa yang sudah kamu kerjakan sebagai backend?”**
“Saya menyiapkan source Laravel di repository utama, mendokumentasikan endpoint dan cara menjalankannya, menambahkan container Docker untuk deployment, serta menyiapkan konfigurasi Render Free dan CORS. Fitur API mencakup auth JWT, katalog produk, builder, voucher, cart/order, dan admin.”

**“Apa bedanya backend dan frontend?”**
“Backend menangani API, aturan bisnis, autentikasi, dan database. Frontend menampilkan antarmuka dan memanggil API. Saya menyiapkan API dan akan menyerahkan URL-nya ke tim frontend; mereka menghubungkan URL tersebut dari halaman aplikasi.”

**“Apa itu JWT dan kenapa dipakai?”**
“Setelah login berhasil, backend memberikan token. Frontend mengirim token itu pada request privat supaya backend bisa memeriksa identitas pengguna tanpa menyimpan session login di server.”

**“Bagaimana admin dibedakan dari customer?”**
“Route admin diberi middleware autentikasi dan pemeriksaan role. Jadi token valid saja belum cukup; pengguna harus mempunyai role admin.”

**“Apakah backend sudah live?”**
“Belum. Blueprint Render dan Dockerfile sudah disiapkan di GitHub. Deployment masih menunggu setup akun/service, pengisian secret, dan koneksi MongoDB Atlas.”

**“Apakah semua test lulus?”**
“Belum. Saat ini ada empat test yang gagal karena konfigurasi PHPUnit masih mengarah ke SQLite `:memory:`, sedangkan model menggunakan MongoDB. Saya perlu menyelaraskan test database, lalu menjalankan dan melaporkan hasilnya lagi.”

**“Apakah frontend sudah tersambung ke API?”**
“Belum diverifikasi end-to-end. Tugas backend saya menyiapkan dan memberikan URL API; integrasi halaman frontend dilakukan oleh tim frontend.”

**“Kenapa jangan langsung jalankan seeder?”**
“Seeder mengosongkan beberapa collection sebelum membuat data demo. Karena itu saya harus memastikan URI mengarah ke database demo terpisah agar data lain tidak terhapus.”

**“Apakah sudah memenuhi performa <500 ms?”**
“Belum saya ukur. Perintah pembuatan index sudah ada, tetapi target response time perlu diuji pada API yang berjalan dan dilaporkan dengan hasil ukur.”

## Kalimat laporan singkat

> “Progress backend: source Laravel dan endpoint utama sudah berada di repository GitHub, dengan MongoDB, JWT, seeder, index command, serta middleware admin. Dockerfile dan Blueprint Render Free juga sudah disiapkan. Saat ini API belum live dan konfigurasi test masih perlu diselaraskan karena PHPUnit memakai SQLite sementara aplikasi memakai MongoDB. Berikutnya saya fokus memperbaiki test database, deploy ke Render dengan database demo terpisah, melakukan smoke test, lalu menyerahkan URL API ke tim frontend.”
