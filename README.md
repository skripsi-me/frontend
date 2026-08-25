# As-Sakinah Mart — Frontend

Toko online (e-commerce) berbasis web dengan pembayaran **Cash on Delivery (COD)**. Proyek tugas akhir (skripsi).

Frontend dibangun dengan **Next.js (App Router)** dan terhubung ke backend REST API. Desain mengikuti sistem token "Tokopedia Green Commerce" (hijau `#00AA5B`, latar putih, font Open Sauce One).

## Tech Stack

| Teknologi | Versi |
|---|---|
| Next.js | 16.x |
| React | 19.x |
| TypeScript | 5.x |
| Tailwind CSS | 4.x |
| Package manager | pnpm |

## Quick Start

Prasyarat: **Node.js 20+** dan **pnpm**.

```bash
# 1. Install dependencies
pnpm install

# 2. Siapkan environment (lihat docs/SETUP.md)
cp .env.example .env.local

# 3. Jalankan development server
pnpm dev
```

Buka [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Deskripsi |
|---|---|
| `pnpm dev` | Jalankan development server |
| `pnpm build` | Build production |
| `pnpm start` | Jalankan server production |
| `pnpm lint` | Jalankan ESLint |

## Struktur Folder

```
app/          # Routes & halaman (App Router)
docs/         # Dokumentasi proyek
public/       # Aset statis
```

## Daftar Halaman

### Pengguna

| Halaman | Route |
|---|---|
| Beranda | `/` |
| Produk | `/produk` |
| Detail produk | `/produk/{slug}` |
| Penelitian (pencarian fuzzy) | `/produk/research` |
| Keranjang | `/keranjang-saya` |
| Konfirmasi checkout | `/keranjang-saya/konfirmasi-checkout` |
| Profil | `/profil` |
| Riwayat transaksi | `/profil/riwayat-transaksi` |
| Detail transaksi | `/profil/riwayat-transaksi/{id}` |
| Login | `/auth/login` |
| Ubah password | `/auth/ubah-password` |

> Update profil dilakukan langsung di halaman `/profil` (mode edit inline). Tidak ada route `/profil/update`.

### Admin Panel (base `/dashboard`)

| Halaman | Route |
|---|---|
| Dashboard | `/dashboard` |
| Produk | `/dashboard/produk` |
| Tambah/Update produk | `/dashboard/produk/buat`, `/dashboard/produk/{id}/update` |
| Kategori | `/dashboard/kategori` |
| Pesanan | `/dashboard/pesanan` |
| Pengguna | `/dashboard/pengguna` |

## Dokumentasi

- [`docs/API.md`](docs/API.md) — Kontrak API backend
- [`docs/DESIGN.md`](docs/DESIGN.md) — Desain token visual
- [`docs/PRD.md`](docs/PRD.md) — Product Requirements Document
- [`docs/SRS.md`](docs/SRS.md) — Software Requirements Specification
- [`docs/SETUP.md`](docs/SETUP.md) — Panduan setup & deployment
- [`docs/ROADMAP.md`](docs/ROADMAP.md) — Rencana pengembangan
- [`docs/PRD-research-fuzzy-search.md`](docs/PRD-research-fuzzy-search.md) — PRD instrumen penelitian pencarian fuzzy
- [`docs/plan/`](docs/plan/) — Plan audit & refactor (orchestrator + plan files)
- [`CHANGELOG.md`](CHANGELOG.md) — Catatan perubahan

## Lisensi

Proprietary. Hak cipta © 2026 Ibnu Khoirul Prasetyo. Lihat [LICENSE](LICENSE).
