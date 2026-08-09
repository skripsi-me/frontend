# PLAN-03 — Root Layout & Font Open Sauce One

> Eksekusi SETELAH [`plan-02-design-tokens.md`](./plan-02-design-tokens.md). Bagian dari Fase 2.

## Tujuan

- Memuat font **Open Sauce One** (self-host via npm `@fontsource`).
- Rewrite `app/layout.tsx`: `lang="id"`, metadata "As-Sakinah Mart", font Open Sauce One, latar putih.
- Memperbaiki error pre-existing `Cannot find name 'LayoutProps'` di `layout.tsx`.

## Prekondisi

- Plan-02 selesai (theme tanpa Geist, tanpa dark-mode).
- `app/globals.css` sudah memakai CSS variables surface/on-surface.

## Langkah

1. Install fontsource:

    ```bash
    pnpm add @fontsource/open-sauce-one
    ```

2. Impor weight yang dipakai di `app/globals.css` (setelah `@import "tailwindcss"`):

    ```css
    @import '@fontsource/open-sauce-one/400.css';
    @import '@fontsource/open-sauce-one/600.css';
    @import '@fontsource/open-sauce-one/700.css';
    @import '@fontsource/open-sauce-one/800.css';
    ```

    Sesuaikan path sesuai paket yang terpasang (cek `node_modules/@fontsource/open-sauce-one/`).

3. Set font di `@theme`:

    ```css
    @theme {
    	--font-sans: 'Open Sauce One', ui-sans-serif, system-ui, sans-serif;
    	--font-mono: ...; /* pertahankan/monospace fallback */
    }
    ```

    Hapus referensi `--font-geist-*`.

4. Rewrite `app/layout.tsx`:
    - Hapus import `next/font` Geist & `LayoutProps`.
    - `lang="id"`.
    - `metadata`: `title: "As-Sakinah Mart"`, `description` Bahasa Indonesia (toko online COD).
    - Body: gunakan `font-sans` dari theme (tanpa variabel font Geist), `bg-background text-foreground`.

    Contoh kerangka:

    ```tsx
    import type { Metadata } from 'next';
    import './globals.css';

    export const metadata: Metadata = {
    	title: 'As-Sakinah Mart',
    	description: 'Toko online dengan pembayaran Cash on Delivery (COD).',
    };

    export default function RootLayout({
    	children,
    }: Readonly<{ children: React.ReactNode }>) {
    	return (
    		<html lang="id" className="h-full">
    			<body className="min-h-full flex flex-col bg-background text-foreground font-sans antialiased">
    				{children}
    			</body>
    		</html>
    	);
    }
    ```

## Verifikasi

```bash
pnpm lint
npx tsc --noEmit
pnpm dev
```

- Browser: font tampil Open Sauce One (DevTools → Computed font-family).
- `<html lang="id">`.
- Judul tab "As-Sakinah Mart".
- Tidak ada `LayoutProps`, `Geist`, `prefers-color-scheme: dark` tersisa.
- Halaman render tanpa error.

## Catatan

- Bahasa UI Indonesia — `lang="id"` wajib.
- Jangan ubah struktur `children`/layout lain di luar cakupan ini (shell lengkap di plan-05).
