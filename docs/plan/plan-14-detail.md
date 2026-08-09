# PLAN-14 — Detail Produk (`/produk/{id}`)

> Eksekusi SETELAH [`plan-10-public-shell.md`](./plan-10-public-shell.md). Bagian dari Fase 4.

## Tujuan

Halaman detail produk: info lengkap, stok, tombol tambah ke keranjang.

## Referensi

- `GET /api/products/slug/:slug` — `useProductBySlug(slug)`.
- `POST /api/carts/items` — `useAddCartItem()`.
- Komponen: Card, Badge, Skeleton, Alert, sonner toast.

## Langkah

1. Parameter route:
   - Route `/produk/{id}` — nilai param dipakai sebagai **slug** (endpoint publik detail = `slug/:slug`).
   - Di page: `params.id` → `useProductBySlug(params.id)`.
   - (Opsional: tambahkan comment/source bahwa route {id} = slug untuk konsistensi URL PRD.)

2. Konten:
   - Image (gambar produk; fallback placeholder bila `image_url` null).
   - Nama (`text-headline-lg`), kategori (Badge/link filter), deskripsi.
   - Harga `formatRupiah(price)` (`text-headline-display`), stok (Badge hijau "Tersedia" / abu "Stok habis").
   - `total_sold` bila ada.

3. Tambah ke keranjang:
   - Tombol "Tambah ke Keranjang" (primary).
   - Not login → redirect `/auth/login`.
   - Submit → `useAddCartItem().mutateAsync({ product_id, quantity: 1 })`.
   - Sukses → toast + badge count navbar ter-update (invalidate `cartKeys`).
   - Stok habis → tombol disabled.

4. State handling:
   - Loading → Skeleton blok.
   - Error 404 → `notFound()` atau empty-state "Produk tidak ditemukan".
   - Error lain → Alert + retry.

## Verifikasi

```bash
pnpm lint
npx tsc --noEmit
pnpm dev
```

- `/produk/{slug}` render detail benar.
- Tambah ke keranjang: sukses toast, count navbar naik; belum login → redirect login.
- Stok habis: tombol disabled.
- 404 → halaman tidak ditemukan.

## Catatan

- Endpoint `GET /api/products/:id` bersifat adminOnly — halaman publik WAJIB pakai slug endpoint.
- Keranjang butuh login; guard via RequireAuth atau redirect manual saat aksi.
