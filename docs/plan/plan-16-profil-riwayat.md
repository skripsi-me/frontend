# PLAN-16 — Profil, Update Profil & Riwayat Transaksi

> **Status: SELESAI.** Eksekusi SETELAH [`plan-11-auth.md`](./plan-11-auth.md). Bagian dari Fase 4.

## Divergensi Implementasi

- Update profil **inline** di `/profil` (toggle view ↔ edit). Tidak ada route `/profil/update`.
- Detail order publik **DIBANGUN** di `/profil/riwayat-transaksi/{id}` (timeline status + rincian) — merevisi catatan "tidak ada halaman detail order publik".

## Tujuan

- `/profil`: tampil data user.
- `/profil/update`: form update nama/alamat/phone.
- `/profil/riwayat-transaksi`: daftar order user + status.

## Referensi

- `GET /api/users/me` — `useMe()`, `useUpdateProfile()`.
- `GET /api/orders/me` — `useMyOrders({ page, limit })`.
- `POST /api/auth/change-password` — link ke `/auth/ubah-password`.

## Langkah

1. `/profil` ("use client", `RequireAuth`):
    - `useMe()` → card data: nama, email, alamat, phone, role.
    - Tombol "Edit Profil" → toggle ke mode edit inline (form di halaman yang sama).
    - Tombol "Ubah Password" → `/auth/ubah-password`.
    - Menu "Riwayat Transaksi" → `/profil/riwayat-transaksi`.
    - Loading → Skeleton.

2. Edit inline di `/profil` ("use client", `RequireAuth`):
    - Form prefill dari `useMe()` (name, address, phone_number).
    - Submit → `useUpdateProfile().mutateAsync({ name, address, phone_number })`.
    - Sukses → toast + kembali ke mode lihat (cache me ter-invalidate).
    - Error → Alert/field errors.

3. `/profil/riwayat-transaksi` ("use client", `RequireAuth`):
    - `useMyOrders({ page, limit })` → daftar Card order:
        - Tanggal (`formatDate`), status (`status-badge`), total (`formatRupiah`).
        - Item list: nama, qty, `price_at_purchase`.
    - Pagination dari meta (shadcn Pagination) → set page.
    - Empty → `empty-state` "Belum ada transaksi".
    - Loading → Skeleton; error → Alert.

## Verifikasi

```bash
pnpm lint
npx tsc --noEmit
pnpm dev
```

- Profil tampil data user; edit tersimpan + redirect.
- Riwayat: daftar order + status benar, pagination jalan.
- Halaman privat di-guard (redirect login saat belum login).

## Catatan

- Detail order publik tersedia di `/profil/riwayat-transaksi/{id}` (timeline status, rincian item, total).
- Cache `userKeys.me` otomatis invalidate oleh `useUpdateProfile`.
