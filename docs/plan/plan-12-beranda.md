# PLAN-12 — Beranda (`/`)

> Eksekusi SETELAH [`plan-10-public-shell.md`](./plan-10-public-shell.md). Bagian dari Fase 4.

## Tujuan

Membangun beranda: hero, daftar kategori, produk best-sellers.

## Referensi

- `GET /api/products/best-sellers?limit=...` — `useBestSellers(limit)`.
- `GET /api/categories/` — `useCategories()`.
- Komponen: `product-card`, `empty-state`, Skeleton.

## Langkah

1. Hero banner:
    - Statis (tanpa API): teks promo + CTA ke `/produk`.
    - Gaya banner (`rounded.lg`, surface, aksen hijau).

2. Kategori:
    - `useCategories()` → daftar Chip/Kartu kategori (nama + slug).
    - Klik kategori → `/produk?category_id={id}` (atau `/produk?category={slug}` — sesuaikan filter di plan-13).

3. Best Sellers:
    - `useBestSellers(limit)` — ambil 4–8 produk.
    - Grid responsif `product-card`.
    - State: isLoading → Skeleton grid; error → Alert + retry; kosong → `empty-state`.

4. Section layout:
    - Header section: `text-headline-lg`/`text-headline-md`.
    - Spacing pakai token (gap/padding konsisten).

## Verifikasi

```bash
pnpm lint
npx tsc --noEmit
pnpm dev
```

- Beranda render hero, kategori, best-sellers dari API.
- Skeleton saat loading, error state tertangani.
- Klik kategori mengarah ke halaman produk dengan filter.
- Harga tampil format Rupiah.

## Catatan

- Tidak ada endpoint banner terpisah — hero statis.
- Kalau API offline, halaman tetap render dengan state error (bukan crash).
