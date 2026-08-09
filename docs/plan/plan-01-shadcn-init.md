# PLAN-01 — Inisialisasi shadcn/ui

> Eksekusi setelah membaca [`orchestrator.md`](./orchestrator.md). Bagian dari Fase 2.

## Tujuan

Inisialisasi shadcn/ui di proyek Next.js + Tailwind v4, lalu menambahkan komponen base yang akan dipakai seluruh aplikasi.

## Prekondisi

- Proyek berjalan Next.js 16 + Tailwind v4 (postcss plugin `@tailwindcss/postcss`).
- TIDAK ada `components.json` sebelumnya (cek dengan `glob components.json`).
- Path alias `@/*` → `./*` sudah ada di `tsconfig.json`.

## Langkah

1. Jalankan inisialisasi shadcn:

    ```bash
    npx shadcn@latest init
    ```

    Pilihan konfigurasi:
    - Base color: **Green** (mendekati `#00AA5B` — penyempurnaan di plan-02)
    - Alias components: `@/components`
    - Alias utils: `@/lib/utils`
    - Gaya: ikuti default (New York) kecuali ada prompt lain.

2. Pastikan file berikut tercipta:
    - `components.json`
    - `lib/utils.ts` (fungsi `cn`)
    - `components/ui/` (jika init menghasilkan)

3. Tambahkan komponen base:

    ```bash
    npx shadcn@latest add button input label card badge tabs skeleton separator sonner checkbox select dialog dropdown-menu table pagination textarea alert
    ```

4. Periksa hasil: semua komponen di `components/ui/`.

## File yang Dibuat/Diubah

- `components.json`
- `lib/utils.ts`
- `components/ui/*` (17+ komponen)
- `app/globals.css` (init shadcn menambah CSS vars tema)
- `package.json` (dependensi baru)

## Verifikasi

```bash
pnpm lint
npx tsc --noEmit
```

- `components.json` ada dan menunjuk alias `@/components`, `@/lib/utils`.
- Komponen terdaftar di `components/ui/`.
- Jangan lanjut jika lint/tsc error.

## Catatan

- Plan-02 akan menimpa bagian tema CSS di `globals.css` — jangan takut hasil init berubah.
- Jika prompt interaktif sulit dijalankan otomatis, gunakan flag non-interaktif yang tersedia (lihat `npx shadcn@latest init --help`) dan set nilai sesuai konfigurasi di atas.
