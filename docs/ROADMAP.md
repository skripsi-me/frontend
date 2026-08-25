# ROADMAP — As-Sakinah Mart

Rencana pengembangan frontend As-Sakinah Mart.

> Detail kebutuhan per fitur: [`docs/PRD.md`](./PRD.md) dan [`docs/SRS.md`](./SRS.md).

## Fase 1 — Fondasi (selesai)

- [x] Inisialisasi proyek Next.js 16 + Tailwind v4.
- [x] Dokumentasi proyek (README, PRD, SRS, SETUP, ROADMAP, CHANGELOG, LICENSE).

## Fase 2 — Infrastruktur Frontend

- [x] Setup design token (warna, tipografi, radius, spacing dari `docs/DESIGN.md`) ke Tailwind theme.
- [x] Root layout + font Open Sauce One.
- [x] API client layer (axios instance + interceptor, `credentials: "include"`, penanganan error & refresh token).
- [x] Routing shell & struktur folder `app/` sesuai route map.

## Fase 3 — Modular Service Layer

- [x] API config: `config/api.config.ts` (env `NEXT_PUBLIC_API_BASE_URL` + `API_ENDPOINTS`).
- [x] Tipe/interface per module: `types/` (auth, user, category, product, cart, order).
- [x] Service API per module: `services/` (typed, endpoint dari config).
- [x] Hook API per module: `hooks/` (TanStack Query, queryKey factory, queryFn → service, invalidate cache).
- [x] QueryClientProvider + ReactQueryDevtools di root layout.

## Fase 4 — Area Publik / User

- [x] Beranda (`/`): best-sellers, kategori, hero.
- [x] Katalog produk (`/produk`): daftar, pencarian, filter kategori, pagination.
- [x] Detail produk (`/produk/{slug}`).
- [x] Autentikasi: login, logout, ubah password.
- [x] Keranjang (`/keranjang-saya`): daftar item, ubah kuantitas, hapus.
- [x] Alur checkout: konfirmasi di `/keranjang-saya/konfirmasi-checkout` → "Buat Pesanan" (POST `/api/orders/`).
- [x] Profil: lihat/update (`/profil`, edit inline; tidak ada route `/profil/update`).
- [x] Riwayat transaksi (`/profil/riwayat-transaksi`) + detail (`/profil/riwayat-transaksi/{id}`).
- [x] Instrumen penelitian performa pencarian fuzzy (`/produk/research`) — Levenshtein Main Thread vs Web Worker, metrik TBT/FPS/INP (PRD-research-fuzzy-search.md).

## Fase 5 — Admin Panel

- [x] Layout & autentikasi admin (guard role `admin`).
- [x] Dashboard (`/dashboard`): ringkasan + laporan harian.
- [x] Kelola produk (list, detail, buat, update, upload gambar).
- [x] Kelola kategori (CRUD).
- [x] Kelola pesanan (list, detail, update status).
- [x] Kelola pengguna (list, detail, buat, update).

## Fase 6 — Pengujian & Penyempurnaan

- [ ] Uji end-to-end alur order (UC-01).
- [ ] Uji fungsionalitas admin (UC-02, UC-03).
- [x] Responsivitas mobile (diperiksa bertahap).
- [x] Error handling & empty states.
- [x] `pnpm lint` & `tsc --noEmit` bersih.
- [x] Refactor & audit plan-01/plan-02 (`docs/plan/`): dedup komponen, hapus dead code & dep (`next-themes`, `date-fns`), bug fix, best practice, penyempurnaan instrumen research.

> **Catatan keamanan:** guard admin/auth (`RequireAdmin`/`RequireAuth`) dan `proxy.ts` bila ada hanya UX-level. Enforcement otorisasi final ada di backend (401/403). `proxy.ts` belum dibuat karena nama cookie auth tak terdokumentasi; tambahkan bila nama cookie diketahui.

## Fase 7 — Deployment

- [ ] Deploy ke Vercel.
- [x] Setup `NEXT_PUBLIC_API_BASE_URL` production (same-origin via rewrite, lihat `docs/plan/plan-17-go-live-readiness.md`).
- [ ] Uji produksi end-to-end.
