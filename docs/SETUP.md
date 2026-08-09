# SETUP — As-Sakinah Mart

Panduan setup pengembangan dan deployment frontend.

## 1. Prasyarat

| Tool    | Versi minimal                      |
| ------- | ---------------------------------- |
| Node.js | 20.x                               |
| pnpm    | 9.x / 11.x (sesuai `package.json`) |

Verifikasi:

```bash
node -v
pnpm -v
```

## 2. Install

```bash
pnpm install
```

## 3. Environment Variables

Buat file `.env.local` di root proyek.

```bash
cp .env.example .env.local
```

| Variable                   | Wajib | Deskripsi                                              |
| -------------------------- | ----- | ------------------------------------------------------ |
| `NEXT_PUBLIC_API_BASE_URL` | Ya    | Base URL backend, contoh `http://localhost:3000` (dev) |

> Backend memakai cookie `httpOnly` (JWT). Pastikan request dikirim dengan `credentials: "include"` dan backend mengizinkan origin frontend (CORS dengan `credentials: true`).

## 4. Script

```bash
pnpm dev          # development server (http://localhost:3000)
pnpm build        # build production
pnpm start        # serve hasil build
pnpm lint         # ESLint
```

## 5. Struktur Folder Target

```
app/
├── layout.tsx            # Root layout
├── page.tsx              # Beranda (/)
├── produk/               # /produk, /produk/{id}
├── keranjang-saya/       # /keranjang-saya
├── profil/               # /profil, /profil/update, /profil/riwayat-transaksi
├── auth/                 # /auth/login, /auth/ubah-password
└── dashboard/            # Admin panel (base /dashboard)
```

Struktur akhir menyesuaikan daftar route di [`PRD.md`](./PRD.md) dan [`SRS.md`](./SRS.md).

## 6. Deployment Vercel

1. Push repositori ke GitHub.
2. Import proyek di [Vercel](https://vercel.com) → **Add New Project**.
3. Framework preset otomatis terdeteksi: **Next.js**.
4. Set environment variable `NEXT_PUBLIC_API_BASE_URL` di Vercel → Settings → Environment Variables.
5. Deploy.

> Vercel default memakai output Next.js standard. Jika perlu output statis, sesuaikan `next.config.ts` dan tambahkan `"export"` pada script build.

## 7. Lint & Type Check

```bash
pnpm lint
npx tsc --noEmit
```

Keduanya wajib bersih sebelum commit.
