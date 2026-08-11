# PLAN-15 — Keranjang & Checkout

> **Status: SELESAI.** Eksekusi SETELAH [`plan-11-auth.md`](./plan-11-auth.md). Bagian dari Fase 4.

## Divergensi Implementasi

- Sukses `useCreateOrder` → **inline success panel** (tetap di halaman, tampil no. pesanan + rincian dari response), bukan redirect `/profil/riwayat-transaksi`.
- Konfirmasi tidak menampilkan card data pengiriman (`useMe`) — API `POST /api/orders/` tanpa body; diganti banner COD statis.
- Keranjang kosong → empty-state + CTA "Mulai Belanja", bukan redirect balik `/keranjang-saya`.

## Tujuan

- Halaman keranjang (`/keranjang-saya`): daftar item, ubah kuantitas, hapus, total, tombol Checkout.
- Halaman konfirmasi checkout (`/keranjang-saya/konfirmasi-checkout`): ringkasan user + produk + total, tombol "Pesan Sekarang".

## Referensi

- `GET /api/carts/` — `useCart()`.
- `PUT /api/carts/items/:itemId` — `useUpdateCartItem()`.
- `DELETE /api/carts/items/:itemId` — `useDeleteCartItem()`.
- `POST /api/orders/` — `useCreateOrder()`.
- `GET /api/users/me` — `useMe()` (data pengiriman di konfirmasi).

## Langkah

1. `/keranjang-saya` ("use client", bungkus `RequireAuth`):
    - `useCart()` → daftar item (image, nama, harga satuan, subtotal per item).
    - Kuantitas: tombol − / + (clamp min 1, max stok produk bila tersedia) → `useUpdateCartItem`.
    - Hapus item → `useDeleteCartItem` (konfirmasi Dialog/AlertDialog opsional).
    - Ringkasan: jumlah item, total `formatRupiah` (sum `price * quantity`).
    - Tombol **"Checkout"** (primary) → `/keranjang-saya/konfirmasi-checkout`. Kosong → disabled + empty-state.

2. `/keranjang-saya/konfirmasi-checkout` ("use client", `RequireAuth`):
    - `useMe()` → nama, alamat, phone (card data pengiriman).
    - `useCart()` → daftar produk + subtotal + total transaksi.
    - Tombol **"Pesan Sekarang"** (primary) → `useCreateOrder().mutateAsync()`.
    - Sukses → toast + redirect `/profil/riwayat-transaksi` (backend mengosongkan keranjang).
    - Error 400 (`Cart is empty`, `Insufficient stock...`) → Alert.
    - Loading → button spinner; keranjang kosong → redirect balik `/keranjang-saya`.

## Verifikasi

```bash
pnpm lint
npx tsc --noEmit
pnpm dev
```

- Keranjang: tambah/ubah kuantitas/hapus sinkron dengan API (invalidate cache).
- Total benar (Rupiah).
- Belum login → redirect `/auth/login`.
- Checkout: konfirmasi tampil data user + produk + total.
- "Pesan Sekarang": order `pending` terbuat, redirect riwayat, keranjang kosong.
- Error stok/keranjang kosong tertangani.

## Catatan

- Subtotal & total dihitung client dari data keranjang (`product.price` string → number).
- `useCreateOrder` sudah invalidate `orderKeys` + `cartKeys`.
