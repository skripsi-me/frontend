# PRD — As-Sakinah Mart

> **Product Requirements Document**  
> Versi: 0.1.0 (alpha)  
> Tanggal: 2026-08-09  
> Status: Draft

---

## 1. Ringkasan Produk

As-Sakinah Mart adalah aplikasi toko online (e-commerce) berbasis web yang dikembangkan sebagai proyek tugas akhir (skripsi). Aplikasi ini menghubungkan pembeli dengan toko melalui katalog produk digital, keranjang belanja, dan alur pemesanan sederhana dengan pembayaran **Cash on Delivery (COD)**.

Frontend dibangun dengan **Next.js (App Router)**, terhubung ke backend REST API yang sudah terdokumentasi di [`docs/API.md`](./API.md). Bahasa yang digunakan di seluruh antarmuka adalah Bahasa Indonesia.

## 2. Tujuan & Problem Statement

### Problem Statement

Toko fisik (mart) kesulitan menjangkau pembeli di luar area toko. Pembeli tidak dapat melihat stok produk, harga, atau melakukan pemesanan tanpa datang langsung ke toko.

### Tujuan

1. Menyediakan katalog produk online yang dapat diakses publik.
2. Memudahkan pembeli memesan produk dari rumah dan membayar saat barang tiba (COD).
3. Memberi admin alat kelola produk, kategori, pesanan, dan pengguna dalam satu panel.
4. Menjadi bukti kelayakan teknis mahasiswa (proyek skripsi) melalui implementasi penuh sistem e-commerce.

## 3. Target Pengguna & Persona

| Persona                | Deskripsi                          | Kebutuhan                                                 |
| ---------------------- | ---------------------------------- | --------------------------------------------------------- |
| **Pengunjung (Guest)** | Belum login, melihat-lihat katalog | Browsing, mencari, melihat detail produk                  |
| **Pembeli (User)**     | Terdaftar & login                  | Keranjang, checkout, riwayat transaksi, kelola profil     |
| **Admin**              | Mengelola toko                     | Kelola produk, kategori, pesanan, pengguna, lihat laporan |

## 4. Daftar Fitur

### 4.1 Fitur Pengunjung / Pembeli

| ID   | Fitur              | Keterangan                                     |
| ---- | ------------------ | ---------------------------------------------- |
| F-01 | Browsing produk    | Beranda menampilkan produk terlaris & kategori |
| F-02 | Pencarian produk   | Cari berdasarkan nama/deskripsi                |
| F-03 | Filter kategori    | Lihat produk per kategori                      |
| F-04 | Detail produk      | Info lengkap: harga, stok, deskripsi, kategori |
| F-05 | Registrasi & login | Daftar akun baru, login, logout                |
| F-06 | Ubah password      | Ganti password dari akun sendiri               |
| F-07 | Keranjang belanja  | Tambah, ubah kuantitas, hapus item             |
| F-08 | Checkout           | Konfirmasi order dengan pembayaran COD         |
| F-09 | Riwayat transaksi  | Daftar order milik sendiri beserta status      |
| F-10 | Kelola profil      | Lihat & update nama, alamat, nomor telepon     |

### 4.2 Fitur Admin

| ID   | Fitur           | Keterangan                                                 |
| ---- | --------------- | ---------------------------------------------------------- |
| F-11 | Dashboard       | Ringkasan data toko & laporan harian                       |
| F-12 | Kelola produk   | Buat, lihat, update, hapus produk (termasuk upload gambar) |
| F-13 | Kelola kategori | Buat, lihat, update, hapus kategori                        |
| F-14 | Kelola pesanan  | Lihat semua pesanan, update status                         |
| F-15 | Kelola pengguna | Buat, lihat, update, hapus pengguna & role                 |

## 5. Alur Order (Checkout)

1. **Login** — Pengguna login ke akunnya.
2. **Masukkan ke keranjang** — Pengguna memilih produk dan memasukkan ke keranjang dari halaman produk/detail.
3. **Buka keranjang** — Pada halaman keranjang, pengguna menekan tombol **"Checkout"**.
4. **Konfirmasi checkout** — Pengguna diarahkan ke halaman konfirmasi berisi ringkasan data pengguna, daftar produk, dan total transaksi.
5. **Pesan sekarang** — Pengguna menekan **"Pesan Sekarang"** untuk membuat order. Order tercatat dengan status `pending`, dan pengguna diarahkan ke riwayat transaksi.

> **Pembayaran**: COD. Pembayaran dilakukan saat barang diterima. Tidak ada payment gateway.

**Status Order:**

```
pending → shipped → delivered
    └──── cancelled (sewaktu-waktu oleh admin)
```

## 6. Daftar Halaman & Route

### 6.1 Halaman Pengguna

| Halaman             | Route                                 |
| ------------------- | ------------------------------------- |
| Beranda             | `/`                                   |
| Produk              | `/produk`                             |
| Detail produk       | `/produk/{id}`                        |
| Keranjang saya      | `/keranjang-saya`                     |
| Konfirmasi checkout | `/keranjang-saya/konfirmasi-checkout` |
| Profil              | `/profil`                             |
| Update profile      | `/profil` (edit inline)               |
| Riwayat transaksi   | `/profil/riwayat-transaksi`           |
| Login               | `/auth/login`                         |
| Ubah password       | `/auth/ubah-password`                 |

### 6.2 Admin Panel (base URL `/dashboard`)

| Halaman         | Route                             |
| --------------- | --------------------------------- |
| Dashboard       | `/dashboard`                      |
| Produk          | `/dashboard/produk`               |
| Detail produk   | `/dashboard/produk/{id}`          |
| Tambah produk   | `/dashboard/produk/buat`          |
| Update produk   | `/dashboard/produk/{id}/update`   |
| Kategori        | `/dashboard/kategori`             |
| Pesanan         | `/dashboard/pesanan`              |
| Detail pesanan  | `/dashboard/pesanan/{id}`         |
| Pengguna        | `/dashboard/pengguna`             |
| Detail pengguna | `/dashboard/pengguna/{id}`        |
| Tambah pengguna | `/dashboard/pengguna/buat`        |
| Update pengguna | `/dashboard/pengguna/{id}/update` |

> Langkah 4 pada alur order (konfirmasi checkout) diimplementasikan pada halaman `/keranjang-saya/konfirmasi-checkout`.

## 7. User Stories

- Sebagai **pengunjung**, saya ingin melihat daftar produk dan detailnya agar saya bisa memutuskan pembelian.
- Sebagai **pembeli**, saya ingin login dan memasukkan produk ke keranjang agar saya bisa berbelanja banyak item sekaligus.
- Sebagai **pembeli**, saya ingin checkout dengan COD agar saya tidak perlu membayar di muka.
- Sebagai **pembeli**, saya ingin melihat riwayat transaksi agar saya bisa memantau status pesanan.
- Sebagai **admin**, saya ingin mengelola produk & kategori agar katalog tetap mutakhir.
- Sebagai **admin**, saya ingin mengubah status pesanan agar alur pengiriman berjalan.
- Sebagai **admin**, saya ingin mengelola pengguna agar dapat mengatur akses pengguna toko.

## 8. Prioritas MoSCoW

| Prioritas       | Fitur                                                                                                                                                                                |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Must have**   | Auth (login/logout), katalog & pencarian produk, detail produk, keranjang, checkout COD, riwayat transaksi, kelola produk, kelola kategori, kelola pesanan, kelola pengguna |
| **Should have** | Update profil, ubah password, dashboard admin, laporan harian                                                                                                                        |
| **Could have**  | Fitur best-sellers di beranda, filter lanjutan                                                                                                                                       |
| **Won't have**  | Payment gateway, wishlist, review produk, notifikasi realtime, chat                                                                                                                  |

## 9. Metrik Sukses (Skripsi)

- 100% fitur _must have_ terimplementasi dan berfungsi.
- Semua alur order end-to-end dapat diselesaikan tanpa error.
- Kelayakan fungsionalitas diuji via skenario use case (pengujian black-box).
- Performa halaman memenuhi standar dasar (waktu muat halaman dapat diterima).
- Kode lolos lint & type-check (`pnpm lint`, `tsc`).

## 10. Dependensi Dokumen

- [`docs/API.md`](./API.md) — Kontrak API backend (sumber kebenaran endpoint).
- [`docs/DESIGN.md`](./DESIGN.md) — Desain token visual (warna, tipografi, komponen).
- [`docs/SRS.md`](./SRS.md) — Spesifikasi kebutuhan perangkat lunak.
