# Changelog

Format berdasarkan [Keep a Changelog](https://keepachangelog.com/id-ID/1.0.0/) dan [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Ditambahkan

- Halaman Beranda (`/`) — hero, trust strip, kategori, produk terlaris, produk terbaru, cara belanja, CTA COD.
- Halaman katalog produk (`/produk`) — daftar, pencarian, filter kategori, pagination.
- Halaman detail produk (`/produk/{slug}`) — metadata dinamis, tambah ke keranjang.
- Autentikasi user — login, logout, ubah kata sandi (`/auth/ubah-password`).
- Keranjang belanja (`/keranjang-saya`) — daftar item, ubah kuantitas, hapus, ringkasan.
- Alur checkout (`/keranjang-saya/konfirmasi-checkout`) — ringkasan pesanan, buat pesanan, panel sukses inline.
- Profil (`/profil`) — lihat & edit data diri (edit inline), detail akun, menu navigasi.
- Riwayat transaksi (`/profil/riwayat-transaksi`) + detail pesanan (`/profil/riwayat-transaksi/{id}`) — daftar order, status, timeline pengiriman.
- Komponen `ProductImage` — fallback saat gambar gagal dimuat (URL signed expired / 403).
- Perbaikan `DropdownMenuLabel` — dibungkus `Menu.Group` (Base UI) agar tidak error runtime.

## [0.1.0] - 2026-08-09

### Ditambahkan

- Inisialisasi proyek Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4.
- Dokumentasi proyek:
  - `README.md` — profil proyek & quick start.
  - `docs/PRD.md` — Product Requirements Document.
  - `docs/SRS.md` — Software Requirements Specification.
  - `docs/SETUP.md` — panduan setup & deployment.
  - `docs/ROADMAP.md` — rencana pengembangan.
  - `CHANGELOG.md` — catatan perubahan ini.
  - `LICENSE` — lisensi proprietary.
