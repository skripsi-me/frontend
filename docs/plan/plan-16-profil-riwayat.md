# PLAN-16 — Profil, Update Profil & Riwayat Transaksi

> Eksekusi SETELAH [`plan-11-auth.md`](./plan-11-auth.md). Bagian dari Fase 4.

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
    - Tombol "Edit Profil" → `/profil/update`.
    - Tombol "Ubah Password" → `/auth/ubah-password`.
    - Tombol "Riwayat Transaksi" → `/profil/riwayat-transaksi`.
    - Loading → Skeleton.

2. `/profil/update` ("use client", `RequireAuth`):
    - Form prefill dari `useMe()` (name, address, phone_number).
    - Submit → `useUpdateProfile().mutateAsync({ name, address, phone_number })`.
    - Sukses → toast + redirect `/profil` (cache me ter-invalidate).
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

- Tidak ada halaman detail order publik di route map — riwayat cukup list. (Detail order ada di dashboard admin, Fase 5.)
- Cache `userKeys.me` otomatis invalidate oleh `useUpdateProfile`.
