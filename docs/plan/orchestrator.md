# ORKESTRATOR — Fase 2: Infrastruktur Frontend

> Dokumen ini adalah master plan eksekusi **Fase 2 — Infrastruktur Frontend** pada [`../ROADMAP.md`](../ROADMAP.md).
> Eksekutor WAJIB membaca dokumen ini terlebih dahulu sebelum mengeksekusi plan apa pun.

## Tujuan

Membangun fondasi teknis frontend As-Sakinah Mart:

1. Inisialisasi shadcn/ui sebagai base component.
2. Design token dari `docs/DESIGN.md` masuk ke Tailwind v4 theme.
3. Root layout + font Open Sauce One.
4. API client layer (axios instance + interceptor) untuk fetching.
5. Routing shell & struktur folder `app/` sesuai route map.

## Daftar Plan

| # | File | Isi | Dependensi |
|---|---|---|---|
| 01 | [`plan-01-shadcn-init.md`](./plan-01-shadcn-init.md) | Inisialisasi shadcn + add base components | Tidak ada |
| 02 | [`plan-02-design-tokens.md`](./plan-02-design-tokens.md) | Design token DESIGN.md → Tailwind v4 theme | 01 (globals.css hasil init shadcn) |
| 03 | [`plan-03-layout-fonts.md`](./plan-03-layout-fonts.md) | Font Open Sauce One + rewrite root layout | 02 (tema di globals.css) |
| 04 | [`plan-04-api-client.md`](./plan-04-api-client.md) | axios instance + interceptor + helpers | Tidak ada (paralel) |
| 05 | [`plan-05-routing-shell.md`](./plan-05-routing-shell.md) | Struktur `app/` + placeholder pages + dashboard group | 03 (layout), 04 (utils) |

## Urutan Eksekusi

```
plan-01 → plan-02 → plan-03 → plan-05
                     plan-04 (dapat dieksekusi paralel)
```

- **WAJIB berurutan**: 01 → 02 → 03 → 05 (saling menimpa/membaca `globals.css` & `layout.tsx`).
- **Paralel**: `plan-04` (axios) bebas dieksekusi kapan saja, tidak menyentuh file yang dipakai plan lain.

## Instruksi Eksekutor

1. Baca plan yang akan dieksekusi secara lengkap.
2. Baca file target yang akan dimodifikasi sebelum mengedit.
3. Eksekusi setiap langkah sesuai urutan di plan. Jangan lewati langkah tanpa alasan.
4. Setelah tiap plan selesai, jalankan verifikasi di bagian **Verifikasi** plan tersebut.
5. Lanjut ke plan berikutnya hanya jika verifikasi plan sebelumnya pass.
6. Jangan menulis kode di luar cakupan plan. Halaman & fitur penuh adalah Fase 3/4.

## Perintah Verifikasi Global

```bash
pnpm lint
npx tsc --noEmit
pnpm build
pnpm dev        # lalu cek via browser
```

Aturan: `lint` dan `tsc --noEmit` WAJIB bersih sebelum plan dianggap selesai.

## Kriteria Selesai Fase 2

- [ ] `components.json` ada, komponen shadcn base di `components/ui/`.
- [ ] Design token DESIGN.md (warna, tipografi, radius, spacing) terdefinisi di theme.
- [ ] Font Open Sauce One terpasang & terpakai; tidak ada sisa Geist/default.
- [ ] Root layout `lang="id"`, metadata "As-Sakinah Mart", latar putih, tanpa dark-mode.
- [ ] Axios instance + interceptor refresh single-flight + error normalization ada.
- [ ] Struktur `app/` sesuai route map; semua route render tanpa 404.
- [ ] `pnpm lint` & `npx tsc --noEmit` bersih.
- [ ] ROADMAP Fase 2 dicentang di [`../ROADMAP.md`](../ROADMAP.md).

## Catatan

- Bahasa UI: Indonesia.
- Axios dipakai pada **client components** (`"use client"`). Server components memakai `fetch` native.
- Halaman placeholder bersifat sementara — isi penuh di Fase 3 (publik) & Fase 4 (admin).
