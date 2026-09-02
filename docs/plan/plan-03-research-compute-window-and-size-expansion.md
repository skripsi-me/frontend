# Plan-03 — Research: Isolasi Compute-Window + Ekspansi Dataset

Status: done (F3 optional pending) | Scope: fitur research (`/produk/research`) + automation + docs | Dependensi: plan-02 (done)

## Konteks & Keputusan Metodologi (dikonfirmasi user)

- **Masalah:** pada window `[t0 klik, t1 render]` lama, TBT/FPS worker tercampur fetch jaringan & orchestrasi (clone-back). Data run `2026-08-28-12-00-58`: TBT worker > non-worker (4x: 101 vs 21; 6x: 210 vs 95.5) padahal konsep worker = main thread lebih responsif saat long-task. Sebab: window penuh + compute non-worker <50ms di dataset kecil → tidak ada long-task yang "dilawan" worker; overhead worker (structured-clone hasil) justru > blok compute non-worker.
- **Keputusan:** isolasi window responsivitas (TBT/FPS) ke **fase compute+render** `[computeStart, t1]`. `computeStart` = setelah dataset siap, sebelum search. `executionTimeMs` tetap `[t0 klik, t1]`.
- **Ekspansi dataset:** size **500/1000/2000/3000/4000** (backend kini 4000 produk). Name 150–250 char sengaja (memperberat komputasi). DatasetLength valid utk semua size.
- **Kontrol resultCount:** name panjang → token filler marketing dominan → query dari token paling umum match ~seluruh dataset → render confound (ribuan kartu dirender dalam window). Generator query diubah ke **seleksi berbasis resultCount** (band `[20,400]`) + indeks token terbalik utk performa.
- Analysis (in-page) **memetakan metrik dari Mirror** (`tbtIndep/fpsIndep`), bukan hook site → Mirror WAJIB disinkronkan ke compute-window, bukan hanya site.

## Guard rails (dari orchestrator.md)

- Baca orchestrator.md + plan ini sebelum eksekusi.
- Guard per task: `pnpm lint` (0 error) + `npx tsc --noEmit` hijau. Build penuh di akhir.
- JANGAN ubah kontrak Puppeteer: `data-testid*`, `data-metric*`, `window.__lastResearchSession`, event `research:session`.
- JANGAN ubah algoritma `searchProductsFuzzyResearch` (threshold k=2, ranking rata-rata, PRD FR-4).
- JANGAN tambah dependency baru.
- Kontrak API tak disentuh.

## Work Packages (kerjakan urut)

### WP-A — Frontend: ekspansi size
- [x] A1 `types/research.ts`: `DatasetSize` + `RESEARCH_SIZES` → `[500,1000,2000,3000,4000]`.
- [x] A2 `fetchDataset` sudah multi-page (cap 1000/halaman) → tangani 4000 tanpa ubah.

### WP-B — Frontend: isolasi compute-window + ekspos computeStart
- [x] B1 `hooks/research.hook.ts`: start `longTaskObserver` + `frameLoop` dipindah ke setelah `fetchDataset`, sebelum search. TBT/FPS atas `[computeStart, t1]`.
- [x] B2 Set `window.__researchComputeStart = performance.now()` sebelum compute.
- [x] B3 `executionTimeMs` tetap `[t0 klik, t1]`.
- [x] B4 Perbaikan bug shadow: `rafId`/`longTaskObserver` dideklarasi sekali (outer) → `teardown` membatalkan loop yang benar (tak bocor).

### WP-C — Automation: Mirror sinkron + size
- [x] C1 `automation/src/instruments/mirror.mjs`: window = `__researchComputeStart` (fallback `__t0`); frame rAF dihitung sejak `now >= computeStart`; reset `__researchComputeStart` per iterasi.
- [x] C2 `automation/src/config/run-config.mjs`: `SIZES = [500,1000,2000,3000,4000]`.

### WP-D — Kontrol resultCount (anti-render confound)
- [x] D1 `automation/scripts/generate-queries.mjs`: filter stopword + seleksi query berbasis **resultCount** (band `[20,400]`) + **indeks token terbalik** (performa; 500 kandidat × 4000 produk). Query terpilih: `adaptor`, `adaptor harddisk` (resultCount q1=20, q3=36).
- [x] D2 `queries.json` di-regenerate untuk dataset 4000.

### WP-E — Docs
- [x] E1 `docs/PRD-research-fuzzy-search.md`: FR-2.2 size list, FR-5.1 catatan 4000 produk, FR-7 window (TBT/FPS = compute-window; exec = click→render; `__researchComputeStart`).
- [x] E2 File plan ini + registry `orchestrator.md`.

### WP-F — Verifikasi
- [x] F1 `pnpm lint` (0 error) + `npx tsc --noEmit` + `pnpm build` hijau. Syntax automation (`node --check`) OK.
- [x] F2 Smoke manual 2 skenario (worker/non-worker): size 3000/4000 tampil; `__researchComputeStart` terset; `__lastResearchSession` terisi; resultCount konsisten antar metode (adaptor → 20 = 20); FPS worker (45.7) > non-worker (34.9) pada window terisolasi; data-metric terisi; tanpa runtime error (hanya warning pre-existing Base UI button).
- [ ] F3 (opsional) automation eval-only + analysis cepat utk cek arah TBT/FPS — belum dijalankan.

## Definition of Done

Semua WP hijau; window TBT/FPS = compute+render; size 500–4000; Mirror sinkron; query resultCount moderat; kontrak Puppeteer utuh; angka jujur (worker unggul HANYA bila compute >> overhead — bila tidak, itu hasil valid).

## Estimasi

Net: ~+40 baris (frontend hook) + ~+80 baris (generator query) + 2 file config/docs. Perubahan di 3 repo (frontend, automation, analysis tak disentuh).