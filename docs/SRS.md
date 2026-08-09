# SRS — As-Sakinah Mart

> **Software Requirements Specification**  
> Versi: 0.1.0 (alpha)  
> Tanggal: 2026-08-09  
> Status: Draft

---

## 1. Pendahuluan

### 1.1 Tujuan

Dokumen ini menjelaskan kebutuhan fungsional dan non-fungsional aplikasi web **As-Sakinah Mart**, toko online dengan pembayaran COD. Dokumen menjadi acuan implementasi frontend dan acuan pengujian (skripsi).

### 1.2 Ruang Lingkup

Sistem terdiri dari dua area:

- **Area publik/user**: katalog produk, keranjang, checkout, riwayat transaksi, manajemen profil.
- **Admin panel**: kelola produk, kategori, pesanan, dan pengguna.

### 1.3 Definisi & Istilah

| Istilah         | Definisi                                     |
| --------------- | -------------------------------------------- |
| JWT             | JSON Web Token, mekanisme autentikasi        |
| Cookie httpOnly | Cookie yang tidak dapat dibaca JavaScript    |
| ULID            | Identifier 26 karakter (contoh: `01HXYZ...`) |
| COD             | Cash on Delivery, bayar saat barang tiba     |
| Route           | Path URL halaman frontend                    |

### 1.4 Referensi

| Dokumen                         | Deskripsi           |
| ------------------------------- | ------------------- |
| [`docs/API.md`](./API.md)       | Kontrak API backend |
| [`docs/DESIGN.md`](./DESIGN.md) | Desain token visual |
| [`docs/PRD.md`](./PRD.md)       | Kebutuhan produk    |

### 1.5 Asumsi

- Backend tersedia dan mengikuti kontrak `docs/API.md`.
- Autentikasi memakai cookie `httpOnly` (`token`, `refresh_token`).
- Seluruh antarmuka berbahasa Indonesia.
- Mata uang transaksi: Rupiah (IDR).

---

## 2. Deskripsi Keseluruhan

### 2.1 Aktor

| Aktor     | Deskripsi                | Hak Akses                                                |
| --------- | ------------------------ | -------------------------------------------------------- |
| **Guest** | Tidak login              | Katalog, pencarian, detail produk, login/register        |
| **User**  | Sudah login              | Semua akses guest + keranjang, checkout, riwayat, profil |
| **Admin** | User dengan role `admin` | Semua akses + admin panel                                |

### 2.2 Konteks Sistem

Frontend (Next.js) berkomunikasi dengan backend REST melalui `fetch`/HTTP. Cookie autentikasi dikirim otomatis oleh browser. Gambar produk disimpan via ImageKit (backend menangani upload).

### 2.3 Tampilan

Tampilan mengikuti sistem desain pada `docs/DESIGN.md` ("Tokopedia Green Commerce"): latar putih, aksen hijau `#00AA5B`, radius 8px, font Open Sauce One.

---

## 3. Kebutuhan Fungsional

ID format: `FR-<modul>-<no>`.

### 3.1 Autentikasi (FR-AUTH)

| ID         | Kebutuhan                                                                                                          |
| ---------- | ------------------------------------------------------------------------------------------------------------------ |
| FR-AUTH-01 | Sistem menampilkan halaman login pada route `/auth/login`.                                                         |
| FR-AUTH-02 | Sistem mengirim `POST /api/auth/login` dengan email & password.                                                    |
| FR-AUTH-03 | Setelah login sukses, sistem mengarahkan user ke beranda.                                                          |
| FR-AUTH-04 | Sistem menampilkan halaman ubah password pada `/auth/ubah-password` dan mengirim `POST /api/auth/change-password`. |
| FR-AUTH-05 | Sistem menyediakan tombol logout yang memanggil `POST /api/auth/logout`.                                           |
| FR-AUTH-06 | Sistem menangani refresh token otomatis saat access token kedaluwarsa (`POST /api/auth/refresh`).                  |
| FR-AUTH-07 | Sistem melindungi halaman privat; user belum login diarahkan ke login.                                             |
| FR-AUTH-08 | Sistem melindungi halaman admin; non-admin diarahkan keluar/ke halaman 403.                                        |

### 3.2 Pengguna (FR-USER)

| ID         | Kebutuhan                                                                                                                     |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------- |
| FR-USER-01 | Sistem menampilkan profil user (`GET /api/users/me`) pada `/profil`.                                                          |
| FR-USER-02 | Sistem menyediakan form update profil pada `/profil/update` dan mengirim `PATCH /api/users/me` (name, address, phone_number). |
| FR-USER-03 | Sistem menampilkan riwayat transaksi pada `/profil/riwayat-transaksi` (`GET /api/orders/me`).                                 |
| FR-USER-04 | Admin dapat melihat daftar pengguna di `/dashboard/pengguna` (`GET /api/users/`).                                             |
| FR-USER-05 | Admin dapat melihat detail pengguna di `/dashboard/pengguna/{id}` (`GET /api/users/:id`).                                     |
| FR-USER-06 | Admin dapat membuat pengguna di `/dashboard/pengguna/buat` (`POST /api/users/`).                                              |
| FR-USER-07 | Admin dapat mengupdate pengguna di `/dashboard/pengguna/{id}/update` (`PATCH /api/users/:id`).                                |
| FR-USER-08 | Admin dapat menghapus pengguna (`DELETE /api/users/:id`).                                                                     |

### 3.3 Katalog & Kategori (FR-PRODUCT)

| ID            | Kebutuhan                                                                                                                                    |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| FR-PRODUCT-01 | Beranda (`/`) menampilkan produk terlaris (`GET /api/products/best-sellers`).                                                                |
| FR-PRODUCT-02 | Halaman produk (`/produk`) menampilkan daftar produk dengan pagination & pencarian (`GET /api/products/?search=&category_id=&page=&limit=`). |
| FR-PRODUCT-03 | Detail produk (`/produk/{id}`) mengambil data via `GET /api/products/slug/:slug`.                                                            |
| FR-PRODUCT-04 | Beranda menampilkan daftar kategori (`GET /api/categories/`) sebagai shortcut filter.                                                        |
| FR-PRODUCT-05 | Filter produk per kategori memakai `GET /api/products/category/:categorySlug`.                                                               |
| FR-PRODUCT-06 | Admin dapat membuat produk (`POST /api/products/`, multipart image).                                                                         |
| FR-PRODUCT-07 | Admin dapat mengupdate produk (`PATCH /api/products/:id`).                                                                                   |
| FR-PRODUCT-08 | Admin dapat menghapus produk (`DELETE /api/products/:id`).                                                                                   |
| FR-PRODUCT-09 | Admin dapat mengelola kategori (CRUD `/api/categories/`).                                                                                    |

### 3.4 Keranjang (FR-CART)

| ID         | Kebutuhan                                                                |
| ---------- | ------------------------------------------------------------------------ |
| FR-CART-01 | User dapat menambah produk ke keranjang (`POST /api/carts/items`).       |
| FR-CART-02 | Halaman `/keranjang-saya` menampilkan isi keranjang (`GET /api/carts/`). |
| FR-CART-03 | User dapat mengubah kuantitas item (`PUT /api/carts/items/:itemId`).     |
| FR-CART-04 | User dapat menghapus item (`DELETE /api/carts/items/:itemId`).           |
| FR-CART-05 | Halaman keranjang menampilkan total belanja dan tombol **"Checkout"**.   |

### 3.5 Pesanan (FR-ORDER)

| ID          | Kebutuhan                                                                                                                                                    |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| FR-ORDER-01 | Setelah klik "Checkout", sistem menampilkan halaman konfirmasi (`/keranjang-saya/konfirmasi-checkout`) berisi data user, daftar produk, dan total transaksi. |
| FR-ORDER-02 | Tombol **"Pesan Sekarang"** mengirim `POST /api/orders/` (order dibuat dari isi keranjang).                                                                  |
| FR-ORDER-03 | Setelah order sukses, sistem mengosongkan keranjang (backend) dan mengarahkan user ke riwayat transaksi.                                                     |
| FR-ORDER-04 | User melihat riwayat order dengan status (`GET /api/orders/me`).                                                                                             |
| FR-ORDER-05 | User dapat melihat detail order miliknya (`GET /api/orders/:id`).                                                                                            |
| FR-ORDER-06 | Admin melihat semua pesanan di `/dashboard/pesanan` (`GET /api/orders/`).                                                                                    |
| FR-ORDER-07 | Admin melihat detail pesanan (`GET /api/orders/:id`).                                                                                                        |
| FR-ORDER-08 | Admin mengupdate status order (`PATCH /api/orders/:id/status`) pada nilai `pending`, `shipped`, `delivered`, `cancelled`.                                    |
| FR-ORDER-09 | Admin melihat laporan order harian (`GET /api/orders/report`) di dashboard.                                                                                  |

### 3.6 Error Handling (FR-ERROR)

| ID          | Kebutuhan                                                                                         |
| ----------- | ------------------------------------------------------------------------------------------------- |
| FR-ERROR-01 | Sistem menampilkan pesan error sesuai `metadata.message` dari API.                                |
| FR-ERROR-02 | Sistem menangani validation error (400) dengan menampilkan pesan field.                           |
| FR-ERROR-03 | Sistem menangani 401 (redirect ke login), 403 (halaman terlarang), 404 (halaman tidak ditemukan). |
| FR-ERROR-04 | Sistem menangani rate limit 429 dengan pesan informatif.                                          |

---

## 4. Kebutuhan Non-Fungsional

| ID    | Kategori       | Kebutuhan                                                                                  |
| ----- | -------------- | ------------------------------------------------------------------------------------------ |
| NF-01 | Keamanan       | Token JWT disimpan di cookie `httpOnly`; frontend tidak menyimpan token di `localStorage`. |
| NF-02 | Keamanan       | Semua request privat menyertakan `credentials: "include"` agar cookie terkirim.            |
| NF-03 | Keamanan       | Halaman admin dilindungi berbasis role (`admin`).                                          |
| NF-04 | Performa       | Halaman katalog memakai pagination (`page`, `limit`) untuk membatasi beban data.           |
| NF-05 | Performa       | Aset gambar menggunakan URL CDN (ImageKit).                                                |
| NF-06 | Kompatibilitas | Tampilan responsif (desktop & mobile).                                                     |
| NF-07 | Kualitas       | Kode lolos lint dan type-check (`pnpm lint`, `tsc`).                                       |
| NF-08 | Aksesibilitas  | Kontras warna mengikuti desain token; teks terbaca (body ≥ 12px).                          |
| NF-09 | Penggunaan     | Seluruh teks UI dalam Bahasa Indonesia.                                                    |

---

## 5. Data Model (Relasi)

Berdasarkan schema API:

```
users 1 ──── * carts
users 1 ──── * orders
carts 1 ──── * cart_items
cart_items * ──── 1 products
orders 1 ──── * order_items
order_items * ──── 1 products
categories 1 ──── * products
```

### Entitas

| Entitas       | Field utama                                                                                           |
| ------------- | ----------------------------------------------------------------------------------------------------- |
| `users`       | id (ULID), email, password (hash), name, address, phone_number, role (`user`/`admin`), timestamps     |
| `categories`  | id (ULID), name, slug, description, timestamps                                                        |
| `products`    | id (ULID), category_id, name, slug, description, price (string desimal), stock, image_url, timestamps |
| `carts`       | id (ULID), user_id                                                                                    |
| `cart_items`  | id (ULID), cart_id, product_id, quantity                                                              |
| `orders`      | id (ULID), user_id, total_amount, status (`pending`/`shipped`/`delivered`/`cancelled`), timestamps    |
| `order_items` | id (ULID), order_id, product_id, quantity, price_at_purchase                                          |

> `price` dan `total_amount` dikirim API sebagai string desimal (contoh `"18999000.00"`) — perlu format Rupiah di UI.

---

## 6. Mapping Halaman ↔ Endpoint API

| Route Frontend                        | Endpoint API                                     | Metode                |
| ------------------------------------- | ------------------------------------------------ | --------------------- |
| `/`                                   | `/api/products/best-sellers`, `/api/categories/` | GET                   |
| `/produk`                             | `/api/products/`                                 | GET                   |
| `/produk/{id}`                        | `/api/products/slug/:slug`                       | GET                   |
| `/keranjang-saya`                     | `/api/carts/`, `/api/carts/items/:itemId`        | GET/PUT/DELETE        |
| `/keranjang-saya/konfirmasi-checkout` | `/api/carts/` (ringkasan)                        | GET                   |
| Pesan Sekarang                        | `/api/orders/`                                   | POST                  |
| `/profil`                             | `/api/users/me`                                  | GET                   |
| `/profil/update`                      | `/api/users/me`                                  | PATCH                 |
| `/profil/riwayat-transaksi`           | `/api/orders/me`, `/api/orders/:id`              | GET                   |
| `/auth/login`                         | `/api/auth/login`, `/api/auth/logout`            | POST                  |
| `/auth/ubah-password`                 | `/api/auth/change-password`                      | POST                  |
| `/dashboard`                          | `/api/orders/report`                             | GET                   |
| `/dashboard/produk` + CRUD            | `/api/products/`, `/api/products/:id`            | GET/POST/PATCH/DELETE |
| `/dashboard/kategori`                 | `/api/categories/`                               | GET/POST/PATCH/DELETE |
| `/dashboard/pesanan`                  | `/api/orders/`, `/api/orders/:id/status`         | GET/PATCH             |
| `/dashboard/pengguna` + CRUD          | `/api/users/`, `/api/users/:id`                  | GET/POST/PATCH/DELETE |

---

## 7. Spesifikasi Desain

Antarmuka wajib mengikuti token desain pada [`docs/DESIGN.md`](./DESIGN.md):

| Aspek          | Spesifikasi                              |
| -------------- | ---------------------------------------- |
| Warna primer   | `#00AA5B` (button, active, success)      |
| Latar          | putih (`#FFFFFF`), muted `#F7F8FA`       |
| Font           | Open Sauce One                           |
| Radius default | 8px (card, button, input)                |
| Tinggi kontrol | 40px (button, input)                     |
| Padding card   | 16px                                     |
| Elevasi        | flat, border tipis; hindari shadow berat |

---

## 8. Use Case Utama

### UC-01: Belanja & Checkout

**Aktor:** User  
**Alur:** Login → lihat produk → tambah ke keranjang → buka `/keranjang-saya` → klik **Checkout** → konfirmasi di `/keranjang-saya/konfirmasi-checkout` → klik **Pesan Sekarang** → sistem kirim `POST /api/orders/` → redirect riwayat transaksi.  
**Prekondisi:** User login, keranjang berisi item.  
**Postkondisi:** Order `pending` dibuat, keranjang kosong.

### UC-02: Update Status Pesanan

**Aktor:** Admin  
**Alur:** Buka `/dashboard/pesanan` → pilih pesanan → ubah status (`pending`→`shipped`→`delivered`, atau `cancelled`).  
**Prekondisi:** Admin login.  
**Postkondisi:** Status pesanan ter-update via `PATCH /api/orders/:id/status`.

### UC-03: Kelola Produk

**Aktor:** Admin  
**Alur:** Buka `/dashboard/produk` → buat/update/hapus produk (termasuk upload gambar).  
**Postkondisi:** Katalog berubah, tercermin di halaman publik.
