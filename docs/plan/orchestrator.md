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

---

# ORKESTRATOR — Fase 3: Modular Service Layer

## Tujuan

Membangun lapisan data modular: config → types → services → hooks (TanStack Query).

## Daftar Plan (eksekusi langsung, bukan dokumen terpisah)

| # | Cakupan | File |
|---|---|---|
| 06 | API config | `config/api.config.ts` (env + `API_ENDPOINTS`) + refactor `lib/api/client.ts` |
| 07 | Types per module | `types/{auth,user,category,product,cart,order}.ts` |
| 08 | Services per module | `services/{auth,user,category,product,cart,order}.service.ts` |
| 09 | Hooks per module | `hooks/{auth,user,category,product,cart,order}.hook.ts` + `providers/query-provider.tsx` + pasang di `app/layout.tsx` |

Urutan: 06 → 07 → 08 → 09. Install `@tanstack/react-query` + devtools di langkah 09.

## Prinsip Kode

- Config = satu sumber endpoint & env.
- Service = typed, endpoint dari `API_ENDPOINTS`, hasil dari helpers `lib/api`.
- Hook = TanStack Query: queryKey factory, `queryFn` → service, mutation `onSuccess` → invalidate key terkait.
- Semua module pakai `"use client"` (cookies + state browser).
- Best practice per stack, readable, mudah maintenance.

## Kriteria Selesai Fase 3

- [ ] `config/api.config.ts` ada; `client.ts` baca baseURL dari config.
- [ ] Tipe response/request semua endpoint API.md terdefinisi di `types/`.
- [ ] Service per module memanggil endpoint config dengan tipe sesuai.
- [ ] Hook query + mutation per module; cache ter-invalidate benar.
- [ ] Provider + devtools aktif; `pnpm lint` & `npx tsc --noEmit` bersih; `pnpm build` sukses.
- [ ] ROADMAP Fase 3 dicentang.
