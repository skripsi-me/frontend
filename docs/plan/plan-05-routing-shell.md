# PLAN-05 — Routing Shell & Struktur Folder

> Eksekusi SETELAH [`plan-03-layout-fonts.md`](./plan-03-layout-fonts.md). Bagian dari Fase 2.

## Tujuan

- Membangun struktur folder `app/` sesuai route map (PRD/SRS).
- Membuat placeholder page minimal per route agar semua halaman render tanpa 404.
- Membuat group layout `app/dashboard/layout.tsx` dengan guard role (stub).

## Referensi Route

- Publik/user: [`../PRD.md`](../PRD.md) §6.1
- Admin panel: [`../PRD.md`](../PRD.md) §6.2 (base `/dashboard`)

## Route Map

```
app/
├── page.tsx                          # /
├── produk/
│   ├── page.tsx                      # /produk
│   └── [id]/page.tsx                 # /produk/{id}
├── keranjang-saya/
│   ├── page.tsx                      # /keranjang-saya
│   └── konfirmasi-checkout/page.tsx  # /keranjang-saya/konfirmasi-checkout
├── profil/
│   ├── page.tsx                      # /profil
│   ├── update/page.tsx               # /profil/update
│   └── riwayat-transaksi/page.tsx    # /profil/riwayat-transaksi
├── auth/
│   ├── login/page.tsx                # /auth/login
│   └── ubah-password/page.tsx        # /auth/ubah-password
└── dashboard/                        # base /dashboard
    ├── layout.tsx                    # shell + guard admin (stub)
    ├── page.tsx                      # /dashboard
    ├── produk/
    │   ├── page.tsx                  # /dashboard/produk
    │   ├── [id]/page.tsx             # /dashboard/produk/{id}
    │   ├── buat/page.tsx             # /dashboard/produk/buat
    │   └── [id]/update/page.tsx      # /dashboard/produk/{id}/update
    ├── kategori/page.tsx             # /dashboard/kategori
    ├── pesanan/
    │   ├── page.tsx                  # /dashboard/pesanan
    │   └── [id]/page.tsx             # /dashboard/pesanan/{id}
    └── pengguna/
        ├── page.tsx                  # /dashboard/pengguna
        ├── [id]/page.tsx             # /dashboard/pengguna/{id}
        ├── buat/page.tsx             # /dashboard/pengguna/buat
        └── [id]/update/page.tsx      # /dashboard/pengguna/{id}/update
```

> Detail produk publik: route pakai `{id}` sesuai PRD. Pengambilan data aktual (slug API) diatur di Fase 3.

## Langkah

1. Buat folder & placeholder `page.tsx` untuk setiap route di atas.
2. Pola placeholder seragam:
    - `metadata` per halaman (title deskriptif Bahasa Indonesia).
    - Isi minimal: heading (`headline` token) + teks "Halaman ini sedang dalam pengembangan." + label route.
    - Tidak ada logika/fetch di placeholder.
3. Beranda `app/page.tsx` diganti placeholder (hanya teks sementara).
4. Buat `app/dashboard/layout.tsx`:
    - Guard role **stub**: tampilkan placeholder + komentar TODO bahwa autentikasi penuh di Fase 3/4 (jangan redirect login aktif — akan merusak dev).
    - Bungkus `children` dalam shell sederhana.
5. Jangan membuat layout untuk area publik lain di plan ini — root layout sudah cukup.

## Verifikasi

```bash
pnpm lint
npx tsc --noEmit
pnpm dev
```

- Buka tiap route utama di browser → render tanpa 404:
    - `/`, `/produk`, `/produk/abc`
    - `/keranjang-saya`, `/keranjang-saya/konfirmasi-checkout`
    - `/profil`, `/profil/update`, `/profil/riwayat-transaksi`
    - `/auth/login`, `/auth/ubah-password`
    - `/dashboard` + sub-route (produk, kategori, pesanan, pengguna)
- Tidak ada error Next.js di terminal.

## Catatan

- Placeholder BUKAN implementasi final — hanya agar shell route berdiri.
- Full auth guard (redirect login/403) dan isi halaman dikerjakan di Fase 3 (publik) & Fase 4 (admin).
- Setelah selesai, centang checklist Fase 2 di [`../ROADMAP.md`](../ROADMAP.md).
