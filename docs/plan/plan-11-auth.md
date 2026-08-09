# PLAN-11 — Autentikasi: Login, Logout, Ubah Password

> Eksekusi SETELAH [`plan-10-public-shell.md`](./plan-10-public-shell.md). Bagian dari Fase 4.

## Tujuan

- Halaman login (`/auth/login`) fungsional.
- Logout dari Navbar.
- Halaman ubah password (`/auth/ubah-password`).

## Referensi

- `POST /api/auth/login`, `POST /api/auth/logout`, `POST /api/auth/change-password` (docs/API.md).
- `authService`, `useLogin`, `useLogout`, `useChangePassword` (Fase 3).

## Langkah

1. `app/(public)/auth/login/page.tsx` ("use client"):
    - Form: email + password (Input + Label). Validasi minimal (required, email format).
    - Submit → `useLogin().mutateAsync({ email, password })`.
    - Sukses → invalidate `userKeys.me` (via auth context), redirect `/`.
    - Error → `isApiError` → tampilkan `metadata.message` (Alert), field error per input.
    - Loading state button (disabled + spinner).
    - Link ke `/auth/ubah-password`.

2. Logout (di Navbar):
    - Tombol Logout → `authContext.logout()` → redirect `/auth/login`.
    - Setelah logout pastikan cache user & cart dibersihkan.

3. `app/(public)/auth/ubah-password/page.tsx` ("use client"):
    - Form: old_password, new_password (min 8), konfirmasi password baru (validasi client, tidak dikirim).
    - Submit → `useChangePassword().mutateAsync({ old_password, new_password })`.
    - Sukses → toast (sonner) + redirect `/profil`.
    - Error 400 `Invalid old password` → Alert.
    - Halaman privat → bungkus dengan `RequireAuth`.

## Verifikasi

```bash
pnpm lint
npx tsc --noEmit
pnpm dev
```

- Login sukses: navbar berubah jadi state user, redirect ke `/`.
- Login gagal: Alert error tampil, form tidak submit ulang.
- Logout: kembali ke `/auth/login`, cache user kosong.
- Ubah password: validasi min 8, sukses toast, redirect profil.

## Catatan

- Tidak ada halaman register di route map — register opsional di luar scope Fase 4 (API tersedia `authService.register`).
- Cookie di-set backend; frontend hanya memantau status via `useMe`.
