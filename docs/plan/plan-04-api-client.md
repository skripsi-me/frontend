# PLAN-04 — API Client Layer (axios)

> Dapat dieksekusi paralel (tidak menyentuh file plan lain). Bagian dari Fase 2.

## Tujuan

- Membangun axios instance + interceptor untuk semua fetching API.
- Autentikasi berbasis cookie httpOnly → kirim `credentials: "include"`.
- Handle refresh token single-flight saat access token kedaluwarsa (401).
- Error normalization sesuai format response `docs/API.md`.
- Helper utilitas (format Rupiah, tanggal, unwrap response).

## Referensi

- Format response: [`../API.md`](../API.md) §Format Response Standar & §Penanganan Error.
- Endpoint refresh: `POST /api/auth/refresh` (memakai cookie, set ulang `token`).
- Env: `NEXT_PUBLIC_API_BASE_URL` (lihat `../SETUP.md`, `.env.example`).

## Langkah

1. Install axios:
   ```bash
   pnpm add axios
   ```

2. Buat `lib/api/client.ts`:
   - `baseURL: process.env.NEXT_PUBLIC_API_BASE_URL`
   - `withCredentials: true`
   - Response interceptor: buka `metadata`/`error` sesuai kontrak API.md.

3. Response interceptor — logika:
   - Sukses: kembalikan `response` mentah (unwrap dilakukan helper).
   - Error 401: jika URL bukan `/api/auth/login` & `/api/auth/refresh` → jalankan refresh single-flight, lalu retry request asli sekali. Jika refresh gagal → reject (frontend diarahkan login oleh caller/halaman).
   - Error lain: normalisasi jadi objek error berisi `status`, `message` (dari `metadata.message`), `fieldErrors` (dari `error` untuk validation 400).

4. Buat tipe di `lib/api/types.ts`:
   ```ts
   interface ApiMetadata { code: number; message: string }
   interface ApiResponse<T> { metadata: ApiMetadata; data: T }
   interface ApiErrorResponse { metadata: ApiMetadata; error?: Record<string, string> }
   interface Paginated<T> { data: T[]; meta: { total: number; page: number; limit: number; total_pages: number } }
   ```
   Catatan: `error` pada response juga berisi daftar field error (400).

5. Buat helper `lib/api/index.ts` (atau `lib/api/http.ts`):
   - `unwrap<T>(response): T` — mengembalikan `response.data.data`.
   - `get<T>`, `post<T>`, `patch<T>`, `put<T>`, `del<T>` — wrapper bertipe dengan unwrap.
   - `isApiError(e)` — type guard.

6. Buat `lib/utils/format.ts`:
   - `formatRupiah(value: string | number): string` — `Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 })`. Nilai API berupa string desimal (`"18999000.00"`).
   - `formatDate(value: string): string` — format Indonesia.
   - Optional: `formatStatus(status)` → label Indonesia (pending → "Menunggu", dst).

7. Buat contoh env local jika belum ada:
   - `.env.example` sudah ada — pastikan `NEXT_PUBLIC_API_BASE_URL`.

## Catatan Arsitektur

- **Client components**: pakai axios client ini (`"use client"`).
- **Server components**: pakai `fetch` native (jangan axios, hindari SSR cookie masalah).
- Jangan simpan token di `localStorage` — token hanya di cookie httpOnly.

## Verifikasi

```bash
pnpm lint
npx tsc --noEmit
```

- Tidak ada error tipe.
- File `lib/api/client.ts`, `lib/api/types.ts`, `lib/utils/format.ts` ada.
- (Opsional, jika backend jalan) test `GET /health` via instance dan lihat response masuk.

## Catatan

- Refresh token single-flight: hanya SATU request refresh aktif untuk N request yang gagal bersamaan (pakai shared promise).
- Tidak menulis halaman login di plan ini — itu Fase 3.
