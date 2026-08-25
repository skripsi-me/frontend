# PRD — "Fuzzy Search Performance Instrument" (Objek Penelitian Skripsi)

**Versi:** 1.0 (final)
**Tech Stack:** Next.js 16.3 (App Router) · React 19.2 · TypeScript 5 · pnpm · `fastest-levenshtein`
**Status:** Final — disetujui

---

## 1. Ringkasan Eksekutif & Tujuan Produk

Ini **bukan produk komersial**. Ini **instrumen eksperimen** untuk penelitian skripsi yang mengukur perbedaan performa pencarian fuzzy berbasis **Levenshtein Distance** ketika dieksekusi di **Main Thread** versus **Web Worker**.

Satu halaman penelitian, `/produk/research`, mengeksekusi pencarian pada dataset produk berukuran **500 / 1000 / 2000 entri** dan mengukur empat metrik secara real-time: **Execution Time**, **Total Blocking Time (TBT)**, **FPS** (loop `requestAnimationFrame`), dan **Interaction to Next Paint (INP)**.

Desain diarahkan agar **stabil untuk automasi Puppeteer** (selector deterministik, URL-driven, tanpa ketergantungan cache browser) sehingga eksperimen dapat direproduksi dalam profil Chromium bersih.

**Indikator keberhasilan produk:** halaman dapat dijalankan dalam skenario Puppeteer clean-profile/incognito + Disable Cache, menghasilkan 4 metrik terukur per sesi pencarian untuk ketiga ukuran dataset dan kedua metode, dengan hasil konsisten antar-run.

## 2. User Persona

**Persona tunggal: Peneliti-Performa (admin/tester), bukan end-user komersial.**

| Atribut | Nilai |
|---|---|
| Peran | Mahasiswa peneliti (skripsi performa web) |
| Kebutuhan utama | Menjalankan eksperimen presisi: kombinasi {method, size, query} berulang, metrik terukur akurat |
| Interaksi | Navigasi URL langsung (Puppeteer), klik "Cari", baca metrik di header |
| Bukan kebutuhan | Relevansi hasil, UX belanja, konversi, keamanan akun, multiuser |
| Alat | Chromium headless + Puppeteer, clean profile, Disable Cache |

Tidak ada persona pembeli/penjual. Fitur e-commerce lain di luar halaman penelitian bersifat pendukung dan tidak menjadi fokus evaluasi.

## 3. User Flow

**Flow A — Masuk ke halaman penelitian:**
1. Pengguna membuka `/produk` (katalog utama).
2. Pengguna menekan tombol **"Penelitian"** (header halaman produk).
3. Sistem menavigasi ke `/produk/research`.

**Flow B — Menjalankan satu sesi pencarian:**
1. Pengguna berada di `/produk/research`.
2. Pengguna memilih metode: **"Web Worker"** atau **"Non Web Worker"**.
3. Pengguna memilih ukuran dataset: **500 / 1000 / 2000**.
4. Pengguna mengisi **"Kata Kunci"** (3–20 karakter).
5. Pengguna menekan **"Cari"**.
6. Sistem membentuk URL: `/produk/research?method={web-worker|non-web-worker}&search={query}&size={jumlah-data}`, lalu `router.replace`.
7. Sistem mengeksekusi pencarian sesuai metode:
   - **Non Web Worker:** dataset dari cache/backend, fuzzy search dihitung sinkron di main thread.
   - **Web Worker:** dataset dipastikan ter-preload di Worker singleton, query dikirim via `postMessage`.
8. Sistem memulai instrumentasi: catat `t0` (klik Cari), mulai loop rAF (FPS), mulai observer Long Tasks (TBT) dan observer event (INP).
9. Hasil di-render di grid produk. Setelah render selesai: hentikan loop rAF, catat `t1`, akumulasi TBT, ambil INP maksimum.
10. Empat metrik ditampilkan di header halaman (panel metrik).

**Flow C — Navigasi langsung oleh Puppeteer (automasi):**
1. Puppeteer navigasi ke `/produk/research?method=web-worker&search=sepatu&size=1000`.
2. Input "Kata Kunci" ter-pre-fill dari `search` param.
3. Puppeteer klik tombol **"Cari"** → Flow B step 6–10 berjalan.
4. Puppeteer baca panel metrik (selector/data-attribute) untuk pengumpulan data.

**Catatan desain:** pencarian **tidak auto-eksekusi** saat halaman dimuat walau param ada; param hanya pre-fill input. Eksekusi selalu dipicu klik "Cari". Titik ukur konsisten ("klik Cari → render selesai") untuk semua skenario.

## 4. Functional Requirements

### FR-1 — Halaman `/produk` (katalog utama)
- FR-1.1 Fitur search/pagination server-side existing (`NormalResults`) **tetap dipertahankan**, tidak diubah.
- FR-1.2 Tombol **"Penelitian"** ditambahkan di header, menavigasi ke `/produk/research`.

### FR-2 — Halaman `/produk/research`
- FR-2.1 Route baru `app/(public)/produk/research/page.tsx`, client component (`'use client'`).
- FR-2.2 Membaca param URL: `method` (`web-worker` | `non-web-worker`), `search`, `size` (`500`|`1000`|`2000`).
- FR-2.3 Jika `search` ada saat mount, pre-fill input. Tanpa auto-execute.
- FR-2.4 Struktur halaman:
  - **Section kontrol** (header atas): input "Kata Kunci", tombol "Cari", toggle metode, toggle ukuran.
  - **Panel metrik** (header): Execution Time, TBT, FPS (live saat pencarian + rata-rata), INP.
  - **Section hasil:** grid render **semua** hasil (tanpa batas / tanpa pagination).

### FR-3 — Komponen search baru (bukan dialog)
- FR-3.1 Komponen baru `research-search-bar.tsx`, **tidak** mereuse `SearchDialog`.
- FR-3.2 Elemen: `<input>` kata kunci, tombol **"Cari"**, dua tombol radio metode, tiga tombol radio ukuran.
- FR-3.3 Submit: validasi panjang query (3–20), `router.replace` ke URL berparam, lalu trigger eksekusi pencarian.

### FR-4 — Mesin fuzzy search (Levenshtein)
- FR-4.1 **Normalisasi:** lowercase + trim; tokenisasi split `[^a-z0-9]+`, filter kosong.
- FR-4.2 **Threshold:** konstanta `k = 2`, berlaku untuk semua token.
- FR-4.3 **Perhitungan:** untuk setiap produk, hitung jarak Levenshtein **seluruh pasangan** (query-token × product-token) — komputasi exhaustive.
- FR-4.4 **Match rule (any-word-matches):** produk match jika **minimal satu** query-token memiliki jarak terbaik (`best-match` antar product-token, tanpa urutan) ≤ `k`.
- FR-4.5 **Ranking:** urutkan produk match ascending berdasarkan **rata-rata jarak seluruh pasangan**. Produk non-match tidak dihitung.
- FR-4.6 **Guard query:** panjang query < 3 atau > 20 → fungsi return kosong (guard di dalam fungsi).
- FR-4.7 Implementasi `fastest-levenshtein`. File `lib/utils/research-levenshtein.ts`, terpisah dari `lib/utils/levenshtein.ts` (yang tetap dipakai halaman `/produk`).

### FR-5 — Strategi data & cache
- FR-5.1 Dataset (500/1000/2000) di-fetch dari backend API dengan `limit` = nilai `size`.
  Jika server memiliki produk < `size`, `datasetLength` akan kurang dari `size`
  (fetch berhenti saat halaman kosong). Analis wajib memeriksa `datasetLength`
  untuk validitas — kombinasi size yang hasilnya sama menandakan katalog
  server tidak mencukupi.
- FR-5.2 Cache in-memory `Map` key: **`{query}-{method}-{size}`**. Fetch sekali per kombinasi.
- FR-5.3 Cache **in-memory (sesi JS)** — tidak menyentuh HTTP cache browser; hilang saat reload.

### FR-6 — Strategi Web Worker
- FR-6.1 **Satu instance Worker singleton** dibuat sekali, dipakai ulang seluruh sesi pengujian. Tidak dibuat ulang per pencarian.
- FR-6.2 **Preload dataset:** dikirim sekali via `postMessage` saat inisialisasi per ukuran. Query berikutnya tidak mengirim ulang dataset.
- FR-6.3 Komunikasi via `postMessage` (Structured Clone API). Protokol:
  - Main → Worker: `{ type: 'init', dataset, seq }`, `{ type: 'search', query, seq }`
  - Worker → Main: `{ type: 'ready', seq }`, `{ type: 'results', results, seq }`
- FR-6.4 Kondisi Non Web Worker: komputasi sinkron di main thread memakai array dataset dari cache yang sama.
- FR-6.5 `fastest-levenshtein` di-bundle ke worker.

### FR-7 — Layer instrumentasi
- FR-7.1 **Execution Time:** `performance.now()` di handler klik "Cari" (`t0`) → `t1` setelah hasil ter-render & painted (double `requestAnimationFrame`). Nilai `t1 - t0` ms.
- FR-7.2 **TBT:** `PerformanceObserver({ type: 'longtask', buffered: true })`. Jumlahkan `(duration - 50)` untuk task yang mulai antara `t0` dan `t1`.
- FR-7.3 **FPS:** loop `requestAnimationFrame` dimulai saat "Cari", sampling per detik, sekaligus **timer UI berjalan** di panel metrik. Stop saat render selesai. Seri FPS + rata-rata.
- FR-7.4 **INP:** `PerformanceObserver({ type: 'event', buffered: true })` (data lapangan Chrome) + **klik periodik programatik pada field input tiap 50ms** sejak "Cari" sampai render selesai (latensi dispatch diukur manual). Ambil **nilai maksimum**.
- FR-7.5 Semua metrik dirender ke **panel metrik di header**, dengan selector stabil + `data-*` attributes (mis. `data-metric="execution-time"`, `data-metric="tbt"`, `data-metric="fps"`, `data-metric="inp"`).

### FR-8 — Komponen skeleton loading
- FR-8.1 Skeleton tampil selama pencarian berlangsung.
- FR-8.2 Animasi skeleton **bukan murni compositor-only** — animasi berbasis `background-color`, bukan `opacity`/`transform` semata. Sumber resmi FPS adalah loop rAF.

## 5. Non-Functional Requirements

### NFR-1 — Kesiapan automasi Puppeteer
- NFR-1.1 Seluruh elemen interaksi & metrik punya **selector deterministik** (id / `data-testid` / `data-metric`).
- NFR-1.2 Tidak ada animasi/elemen mengganggu pengukuran selain yang dirancang untuk diukur (skeleton + timer rAF).
- NFR-1.3 Semua kombinasi pengujian dapat dipicu via **navigasi URL** (`method`, `search`, `size`) + satu klik "Cari".

### NFR-2 — Isolasi browser
- NFR-2.1 Berjalan di Chromium **clean profile / incognito**, tanpa ketergantungan pada cache browser (mendukung Disable Cache). Cache dataset hanya in-memory JS.
- NFR-2.2 Tidak ada dependency `localStorage`/`sessionStorage` untuk alur pengujian.

### NFR-3 — Kinerja & determinisme
- NFR-3.1 Eksekusi pencarian sinkron di main thread **tidak** dipisah ke microtask/chunk — komputasi penuh di main thread agar TBT/FPS terukur realistis.
- NFR-3.2 Rendering hasil tanpa batas maksimal — konsisten antar metode.
- NFR-3.3 Strict Mode/React batching tidak mengubah titik ukur `t0`/`t1`.

### NFR-4 — Kejelasan metrik
- NFR-4.1 Definisi tiap metrik didokumentasikan (JSDoc) & ditampilkan berlabel di UI.

### NFR-5 — Kualitas kode
- NFR-5.1 TypeScript strict, lint (`pnpm lint`) hijau, tanpa dependency baru di luar `fastest-levenshtein` (sudah ada).

## 6. Struktur Data

**Skema produk** (mengikuti `types/product.ts` existing):

```ts
type Product = {
  id: string;
  name: string;
  slug: string;
  price: string;
  stock: number;
  category_id: string;
  // + field lain dari API
};
```

**Skema hasil fuzzy** (`types/research.ts`):

```ts
type FuzzyMatch = {
  product: Product;
  distance: number; // rata-rata jarak seluruh pasangan (query-token × product-token)
};
```

**Skema cache dataset (in-memory):**

```ts
type DatasetCacheEntry = {
  key: string; // `${query}-${method}-${size}`
  products: Product[];
  fetchedAt: number;
};
```

**Skema hasil pengukuran per sesi pencarian:**

```ts
type SearchSessionMetrics = {
  sessionId: string;
  method: 'web-worker' | 'non-web-worker';
  query: string;
  queryLength: number;
  size: 500 | 1000 | 2000;
  timestamp: string;
  metrics: {
    executionTimeMs: number;   // t1 - t0
    tbtMs: number;             // sum(longtask.duration - 50) dalam window
    fps: { sample: number; fps: number }[]; // seri per detik
    fpsAverage: number;
    inpMs: number;             // maksimum latensi interaksi
    longTasks: { start: number; duration: number }[];
    resultCount: number;
  };
};
```

## 7. Batasan (Out of Scope)

- **Relevansi/kualitas hasil pencarian (precision/recall) TIDAK dievaluasi** — murni performa komputasi.
- Tidak ada evaluasi ranking quality, UX, atau konversi.
- Tidak ada perubahan fungsionalitas e-commerce existing di luar tombol "Penelitian".
- Tidak ada kompatibilitas cross-browser (target Chromium).
- Tidak ada generasi/sintesis dataset — dataset dari backend API.
- Tidak ada persistensi hasil pengukuran ke server (metrik hanya di UI untuk dibaca Puppeteer).