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

## Fase 3 — Area Publik / User

- [ ] Beranda (`/`): best-sellers, kategori, hero.
- [ ] Katalog produk (`/produk`): daftar, pencarian, filter kategori, pagination.
- [ ] Detail produk (`/produk/{id}`).
- [ ] Autentikasi: login, logout, ubah password.
- [ ] Keranjang (`/keranjang-saya`): daftar item, ubah kuantitas, hapus.
- [ ] Alur checkout: konfirmasi di `/keranjang-saya/konfirmasi-checkout` → "Pesan Sekarang" (POST `/api/orders/`).
- [ ] Profil: lihat/update (`/profil`, `/profil/update`).
- [ ] Riwayat transaksi (`/profil/riwayat-transaksi`).

## Fase 4 — Admin Panel

- [ ] Layout & autentikasi admin (guard role `admin`).
- [ ] Dashboard (`/dashboard`): ringkasan + laporan harian.
- [ ] Kelola produk (list, detail, buat, update, upload gambar).
- [ ] Kelola kategori (CRUD).
- [ ] Kelola pesanan (list, detail, update status).
- [ ] Kelola pengguna (list, detail, buat, update).

## Fase 5 — Pengujian & Penyempurnaan

- [ ] Uji end-to-end alur order (UC-01).
- [ ] Uji fungsionalitas admin (UC-02, UC-03).
- [ ] Responsivitas mobile.
- [ ] Error handling & empty states.
- [ ] `pnpm lint` & `tsc --noEmit` bersih.

## Fase 6 — Deployment

- [ ] Deploy ke Vercel.
- [ ] Setup `NEXT_PUBLIC_API_BASE_URL` production.
- [ ] Uji produksi end-to-end.
