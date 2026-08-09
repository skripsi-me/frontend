# PLAN-13 — Katalog Produk (`/produk`)

> Eksekusi SETELAH [`plan-10-public-shell.md`](./plan-10-public-shell.md). Bagian dari Fase 4.

## Tujuan

Daftar produk dengan pencarian, filter kategori, dan pagination. URL berisi state (searchable/shareable).

## Referensi

- `GET /api/products/` — `useProducts({ page, limit, search, category_id })`.
- `GET /api/categories/` — `useCategories()` untuk filter.
- Komponen: `product-card`, `empty-state`, `pagination` (shadcn), Skeleton.

## Langkah

1. State via URL (`useSearchParams` + `useRouter`):
   - `search` — kata kunci.
   - `category_id` — filter kategori.
   - `page` — halaman.
   - Semua perubahan → `router.replace` agar URL sinkron & bisa di-share.

2. Search input:
   - Debounce ~400ms (setTimeout/useEffect) sebelum update `search` di URL.
   - Reset `page=1` saat search/filter berubah.

3. Filter kategori:
   - `useCategories()` → Select/Chips kategori.
   - Pilih → set `category_id`, reset page.

4. Grid produk:
   - `useProducts({ page, limit: 12, search, category_id })`.
   - Grid responsif `product-card`.
   - Skeleton grid saat loading; `empty-state` saat hasil kosong; Alert saat error.

5. Pagination:
   - Dari `Paginated.meta` (`total_pages`, `page`).
   - Shadcn Pagination → set `page`.
   - `keepPreviousData` (sudah di hook) menjaga grid saat ganti halaman.

## Verifikasi

```bash
pnpm lint
npx tsc --noEmit
pnpm dev
```

- `/produk` tampil daftar + total.
- Search debounce bekerja; URL berubah (`?search=...&page=...`).
- Filter kategori + pagination bekerja; URL bisa di-refresh/share.
- Loading/empty/error state benar.

## Catatan

- Batasi `limit` (12–20) agar performa baik.
- Gunakan `Suspense`/`useSearchParams` sesuai konvensi Next.js 16 (bungkus bagian yang memakai `useSearchParams` agar prerender aman).
