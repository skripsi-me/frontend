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
- Instrumen penelitian pencarian fuzzy (`/produk/research`) — metrik TBT/FPS/INP, Web Worker vs Main Thread.

### Diubah

- Refactor plan-01 (audit & refactor): dedup komponen (SectionError, RoleBadge, CartSummary, QueryError, SegmentedControl), hook `useOrderStatusUpdate`, util `sumCart`/`text`, hapus rantai dead (register/refresh/category-bySlug/product-byCategory), hapus dep `next-themes` & `date-fns`, tema dark mati dihapus, `tsconfig` target ES2022.
- Bug fix: debounce search loop, filter role pengguna (server-side), busy-guard race, cache dataset research, form error reaktif, akun tanpa password dicegah, LdResults muat semua halaman, toast nilai stock.
- Best practice: devtools digate NODE_ENV, pagination riwayat berbasis URL, logout konsisten, `next/image`, design token warna, radio a11y base-ui.
- Instrumen penelitian (`/produk/research`): hapus total dep `fastest-levenshtein` → Levenshtein DP referensi murni (`levenshteinDistance`), INP kini dari interaksi trusted (tombol target `research-inp-target`, klik Puppeteer) via `PerformanceObserver('event')` filter `startTime >= t0`, sintetis `dispatchEvent` dihapus.

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
