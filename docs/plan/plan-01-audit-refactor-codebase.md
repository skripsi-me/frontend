# Plan-01 — Audit & Refactor Codebase

Status: done | Scope: seluruh repo frontend | Dependensi: -

## Hasil Audit (ringkasan temuan, sudah diverifikasi)
- Over-engineering: ~550 baris dapat dihapus, 1 dep mati (`next-themes`), 3 rantai dead (hook/service/endpoint), duplikasi komponen & blok.
- Bugs: filter role tidak dikirim ke server, debounce loop, cache research miss, form error non-reaktif, akun tanpa password, busy-guard race, LdResults cap 1000, toast nilai salah, admin-nav startsWith, dll.
- Keamanan: guard admin/auth client-only; `proxy.ts` sebagai defense-in-depth.
- Best practice: devtools tanpa gate, date format campur, pagination inkonsisten, a11y radio, magic numbers, eslint-disable masking bug.

## Non-goals (JANGAN dilakukan)
- Hapus kontrak Puppeteer / algoritma penelitian (lihat orchestrator).
- Refactor hooks/service jadi factory generic CRUD (abstraksi tak diminta; pola per-hook diterima).
- Ubah bentuk respons API.

## Work Packages (kerjakan urut, verifikasi tiap paket)

### WP-A Fondasi & config
- [x] A1 `tsconfig.json`: `target: ES2017` → `ES2022`; hapus `allowJs` (tak ada JS). Verifikasi build.
- [x] A2 Hapus tema mati: blok `.dark` + `@custom-variant dark` (globals.css:9,227-259); hapus dep `next-themes`; `sonner.tsx` → `theme="system"`.
- [x] A3 Hapus `eslint-disable` masking (produk-form:132, pengguna-form:131) — root fix di WP-D10.

### WP-B Layer API & types
- [x] B1 Hapus rantai dead: `useRegister`/`useRefresh` + `authService.register/refresh` + `RegisterRequest`; `useCategoryBySlug` + `categoryService.getBySlug` + endpoint bySlug; `useProductsByCategory` + `productService.byCategory` + endpoint byCategory. Grep pastikan tak ada caller.
- [x] B2 Type dedup: `ProductCategory` dibiarkan (DTO berbeda: tanpa id, description non-null — kontrak backend tak bisa diverifikasi). Hapus `ProductPaginationParams` (mati setelah B1).
- [x] B3 Fuzzy dedup: ekstrak `normalize`/`tokenize` → `lib/utils/text.ts`; dua search function import dari sana. Hapus `FuzzyMatch` duplikat di levenshtein.ts → import `types/research.ts`. Export `LEVENSHTEIN_THRESHOLD`.

### WP-C Dedup komponen
- [x] C1 `SectionError` shared (error/retry) untuk 4 section dashboard. Loading skeleton beda per section → dibiarkan.
- [x] C2 Ekstrak `RoleBadge`; pakai di pengguna-admin-content + pengguna-admin-detail.
- [x] C3 Hook `useOrderStatusUpdate(id)` untuk 3 pemakai (dashboard-content, pesanan-admin-content, pesanan-admin-detail).
- [x] C4 `<CartSummary>` aside shared (keranjang-content + konfirmasi-checkout).
- [x] C5 Selector `sumCart` untuk totalQuantity/totalPrice.
- [x] C6 `<QueryError>` shared; pakai di keranjang/konfirmasi/riwayat.
- [x] C7 NormalResults/LdResults — SKIP ponytail: blok isError ~6 baris beda method; wrapper = indirection tak sebanding.
- [x] C8 `FormField` — SKIP ponytail: field bervariasi (input/password-toggle/textarea/select/file); wrapper generic = config soup.
- [x] C9 `ProductImage` — SKIP: semua prop dipakai (`priority` via object syntax di produk-detail-content:279). Tak ada yang mati.
- [x] C10 `SectionHeader`: hapus prop mati `children`.
- [x] C11 `pagination-nav` getVisiblePages: hapus branch mati (`page===3` re-add).
- [x] C12 Research: `SegmentedControl<T>` (base-ui RadioGroup) untuk method/size — a11y keyboard + dedup.

### WP-D Bug fix
- [x] D1 pengguna role filter → kirim `role` ke `useUsers`; filter client dihapus. (Fallback tak perlu — backend asumsi terima param, pola sama dgn produk/category.)
- [x] D2 produk-admin-list debounce: deps `[searchInput, pathname, router]` + `searchParamsRef`; loop replace hilang.
- [x] D3 research cache key → `String(size)` (dataset tak tergantung query/method).
- [x] D4 ubah-password: error via `form.Subscribe` reaktif; submit gated `canSubmit`.
- [x] D5 pengguna-form: `passwordValidator` — create wajib `min(8)`, update boleh kosong.
- [x] D6 busy-guard state → `mutation.variables`/`isPending` via `useOrderStatusUpdate`. Race + busyId shared hilang.
- [x] D7 LdResults → `useAllProducts` (loop semua halaman).
- [x] D8 dashboard toast stock → nilai dari hasil mutation (`updated.stock`).
- [x] D9 admin-nav/topbar: `/dashboard` match eksak.
- [x] D10 Reset effect form deps → `[product, form]` / `[user, form]`; eslint-disable dihapus.
- [x] D11 research.hook: guard randomUUID dibuang.
- [x] D12 menu-sheet: prop `menu` mati + optional-chain dead dihapus.

### WP-E Keamanan
- [x] E1 `proxy.ts` — SKIP ponytail: nama cookie auth tak terdokumentasi (backend tak di repo); guard tebak berisiko redirect admin valid. Backend tetap enforcement.
- [x] E2 (D5) menutup bypass akun tanpa password.
- [x] E3 Catat di ROADMAP: guard client = UX, backend = enforcement (403).

### WP-F Best practice & smell
- [x] F1 `ReactQueryDevtools` gate `process.env.NODE_ENV !== 'production'`.
- [x] F2 Unifikasi tanggal: `date-fns` → `formatDate`; dep `date-fns` dihapus.
- [x] F3 Riwayat pagination → URL searchParams (selaras produk).
- [x] F4 Logout konsisten: navbar → redirect `/` (sama dengan admin-topbar).
- [x] F5 product-row-card → `next/image` (hapus eslint-disable no-img-element).
- [x] F6 Warna ad-hoc → design token (`text-success`/`text-warning`/`text-destructive`). StockBadge pakai `LOW_STOCK_THRESHOLD`.
- [x] F7 A11y radio research → `SegmentedControl` berbasis base-ui RadioGroup (keyboard built-in).
- [x] F8 `date-fns` bersih dari tree (F2).

### WP-G Polish research (dari review diff)
- [x] G1 `research-search-bar:40` → `RESEARCH_MIN_QUERY_LENGTH`.
- [x] G2 `research-results` label method dari `RESEARCH_METHODS`; "k=2" dari `LEVENSHTEIN_THRESHOLD`.
- [x] G3 Fragment tak perlu di research-results.
- [x] G4 Hapus guard length duplikat di handleSubmit page (pakai konstanta).
- [x] G5 (D3) cache key + (D11).

### WP-H Verifikasi akhir
- [x] H1 `pnpm lint` (0 error, warning hanya di `.agents/` tooling) + `pnpm build` + `npx tsc --noEmit` bersih.
- [ ] H2 Smoke manual (login, dashboard CRUD, cart checkout, search, research) — belum diverifikasi di browser.
- [x] H3 Kontrak Puppeteer utuh (data-testid, `__lastResearchSession`, event `research:session`).
- [x] H4 Update ROADMAP.md + CHANGELOG.md.

## Definition of Done
Semua WP hijau, re-audit tak menyisakan temuan (kecuali instrument penelitian yang sengaja dijaga), build/lint/typecheck lolos.

## Estimasi
Net: −~550 baris, −2 dep (`next-themes`, `date-fns` bila F2 lolos), 3 rantai dead dihapus, 1 file baru (`proxy.ts`), ~2 file util baru.