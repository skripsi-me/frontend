# PLAN-10 — Public Shell: Layout, Navigasi & Auth Context

> Eksekusi SETELAH Fase 3 (config/types/services/hooks). Bagian dari Fase 4.

## Tujuan

- Membangun route group `app/(public)/` dengan layout bersama (Navbar + Footer).
- Auth context global (user, status login) + guard halaman privat.
- Komponen UI bersama: product card, empty state, price, status badge.

## Prekondisi

- Fase 3 selesai (`services/`, `hooks/`, `providers/query-provider.tsx`).
- `app/dashboard/` layout terpisah — TIDAK masuk route group publik.

## Langkah

1. Pindahkan halaman publik ke route group `(public)` (URL tidak berubah):

    ```
    app/(public)/
    ├── layout.tsx           # baru: Navbar + Footer shell
    ├── page.tsx             # /  (beranda)
    ├── produk/...           # /produk, /produk/{id}
    ├── keranjang-saya/...   # /keranjang-saya, /keranjang-saya/konfirmasi-checkout
    ├── profil/...           # /profil, /profil/update, /profil/riwayat-transaksi
    └── auth/...             # /auth/login, /auth/ubah-password
    ```

    Dashboard tetap di `app/dashboard/` (di luar group).

2. Tambah komponen shadcn yang dibutuhkan shell:

    ```bash
    npx shadcn@latest add avatar sheet
    ```

3. Auth context — `providers/auth-provider.tsx` ("use client"):
    - Pakai `useMe()` dari `hooks/user.hook.ts`.
    - Expose: `user`, `isAuthenticated`, `isLoading`, `login`, `logout`.
    - `login(email, password)` → `useLogin().mutateAsync`, lalu invalidate `userKeys.me`.
    - `logout()` → `useLogout().mutateAsync`, hapus cache `userKeys.me` (`removeQueries`).
    - Pasang `AuthProvider` di `app/layout.tsx` (di dalam `QueryProvider`).

4. Guard privat — `components/auth/require-auth.tsx` ("use client"):
    - Jika `isLoading` → tampilkan Skeleton.
    - Jika `!isAuthenticated` → `<Redirect href="/auth/login" />`.
    - Jika login → render `children`.
    - (Fase 5: varian `require-admin` untuk dashboard.)

5. Layout `app/(public)/layout.tsx`:
    - Server component. Render `<Navbar /> {children} <Footer />`.
    - Navbar/Footer client component (pakai auth context + cart count).

6. Komponen bersama di `components/`:
    - `navbar.tsx` — logo As-Sakinah Mart, link (Beranda, Produk), search singkat (ke /produk), keranjang icon + count, dropdown profil (Profil, Riwayat Transaksi, Ubah Password, Logout) atau tombol Login.
    - `footer.tsx` — info toko statis.
    - `product-card.tsx` — card produk: image, nama, harga (`formatRupiah`), stok; link ke `/produk/{slug}`.
    - `empty-state.tsx` — ilustrasi + teks kosong (pakai komponen `Empty` bila tersedia, atau div sederhana).
    - `status-badge.tsx` — Badge status order via `formatStatus` + warna (pending=warning, shipped=primary, delivered=success, cancelled=secondary).
    - `price.tsx` — teks harga Rupiah.

## Verifikasi

```bash
pnpm lint
npx tsc --noEmit
pnpm dev
```

- URL semua route publik tidak berubah.
- Navbar tampil di halaman publik, TIDAK di /dashboard.
- Auth context tersedia; guard mengalihkan ke /auth/login saat belum login.
- Skeleton muncul saat isLoading.

## Catatan

- Route group `(public)` hanya berpengaruh pada struktur folder, bukan URL.
- Auth context berbasis cookie httpOnly — tidak ada token di localStorage.
