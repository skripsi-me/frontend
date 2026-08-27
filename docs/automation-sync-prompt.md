# Automation Sync — Prompt & Panduan Puppeteer

Dokumen ini berisi informasi lengkap untuk menyinkronkan proyek automation (Puppeteer)
dengan kondisi terbaru frontend As-Sakinah Mart, terutama halaman instrumen penelitian
`/produk/research`. Cocok untuk dijadikan prompt agent opencode di sesi proyek automation.

> Status: mencerminkan kondisi saat sesi terakhir di frontend.

---

## 1. Perubahan pada Website Utama

### 1.1 `fastest-levenshtein` dihapus total

- Fuzzy search kini memakai implementasi **Levenshtein DP referensi murni**:
  `levenshteinDistance` di `lib/utils/levenshtein.ts` (rolling two-row, O(m·n)).
- Dependensi dihapus dari `package.json` dan `pnpm-lock.yaml`.
- Hasil **identik** dengan library lama (diverifikasi parity: 200.000 pasang string, 0 mismatch).
- Implikasi untuk automation: skor, ranking, dan `resultCount` **tidak berubah**. Hanya
  kecepatan komputasi yang berbeda (lebih lambat, sesuai ekspektasi "algoritma murni").

### 1.2 Metrik INP dikecualikan

- Metrik **INP dihapus dari instrumen**. Klik sintetis `dispatchEvent` (untrusted) sudah
  dihapus sebelumnya — tidak menghasilkan `PerformanceEventTiming`.
- Alasan eksklusi: INP adalah **field metric** yang valid hanya dari interaksi user asli.
  Di lingkungan lab (Puppeteer), interaksi trusted yang menimbulkan kerja nyata sulit
  dihasilkan (klik no-op tidak dilaporkan Chrome), sehingga nilai `inpMs` tidak konsisten
  (sering 0). **TBT dipakai sebagai lab proxy resmi untuk INP** (rekomendasi Chrome/Google).
- Dampak automation: **tidak ada `data-metric="inp"`**, **tidak ada tombol
  `research-inp-target`**, dan **`inpMs` tidak ada** di objek sesi.

Konsekuensi:

- Metrik pembeda utama klaim *"web worker menjaga main thread tetap responsif"* adalah
  **TBT** dan **FPS**.
- `inpMs` **tidak lagi ada** di objek sesi maupun DOM.

---

## 2. Kontrak Puppeteer (tetap utuh)

### 2.1 Selector deterministik

| Elemen | Selector |
|---|---|
| Form pencarian | `data-testid="research-search-bar"` |
| Input kata kunci | `data-testid="research-keyword-input"` |
| Tombol Cari | `data-testid="research-submit"` |
| Panel metrik | `data-testid="metrics-panel"` |
| Indikator mengukur | `data-testid="metrics-searching"` |
| Kartu metrik | `data-testid="metric-{key}"` |

### 2.2 Metrik final (nilai aman dibaca setelah sesi selesai)

| Metrik | Selector nilai | Arti |
|---|---|---|
| Execution Time | `data-metric="execution-time"` | `t1 - t0`, ms |
| TBT | `data-metric="tbt"` | Total blocking time, ms |
| FPS (rata-rata) | `data-metric="fps"` | fps |
| Ukuran dataset | `data-metric="dataset-length"` | Jumlah produk yang benar-benar diproses |

### 2.3 Nilai live (hanya selama pencarian berjalan)

- `data-metric="live-timer"` — timer berjalan (rAF, tanpa re-render React).
- `data-metric="live-fps"` — FPS live.

### 2.4 Objek sesi

- `window.__lastResearchSession` — objek `SearchSessionMetrics` sesi terakhir.
- Event `research:session` — di-dispatch ke `window` saat sesi selesai (`detail` = objek sesi).

Skema `SearchSessionMetrics` (singkat):

```ts
{
  sessionId: string;
  method: 'web-worker' | 'non-web-worker';
  query: string;
  queryLength: number;
  size: 500 | 1000 | 2000;
  timestamp: string;
  metrics: {
    executionTimeMs: number;
    tbtMs: number;
    fps: { sample: number; fps: number }[];
    fpsAverage: number;
    longTasks: { start: number; duration: number }[];
    resultCount: number;
    datasetLength: number;
  };
}
```

---

## 3. Langkah-langkah Puppeteer

### 3.1 Persiapan environment

- Chromium **clean profile / incognito**.
- **Disable cache** (DevTools → Network → Disable cache, atau argumen Puppeteer).
- Tanpa ekstensi. Tanpa tab lain yang memakan CPU.

### 3.2 Alur satu skenario (kombinasi method × size × query)

1. **Navigasi URL** langsung:
   ```
   /produk/research?method={web-worker|non-web-worker}&search={query}&size={500|1000|2000}
   ```
   - Param hanya **pre-fill** input/toggle. **Tidak auto-eksekusi**.
   - `query` wajib 3–20 karakter.

2. **Verifikasi pre-fill** (opsional, disarankan):
   - Input `research-keyword-input` berisi `{query}`.
   - Radio metode & ukuran sesuai param.

3. **Klik "Cari"** (`research-submit`) — satu kali. Ini titik awal pengukuran (`t0`).

4. **Tunggu sesi selesai:**
   - Tunggu `data-testid="metrics-searching"` **hilang** dari DOM, **atau**
   - Tunggu `window.__lastResearchSession` terisi, **atau**
   - Dengar event `research:session`.

5. **Baca hasil** (lihat bagian 4).

6. **Reload penuh (`page.goto` lagi)** untuk skenario berikutnya — cache dataset in-memory
   hilang saat reload, dan wajib untuk mengisolasi iterasi (warm-up).

### 3.3 Catatan cadence & isolasi

- Antarskenario: selalu **full reload** (bukan SPA navigation) supaya state bersih.
- Analisis disarankan membuang **iterasi 1–3 per skenario** (cold fetch network berada
  dalam window pengukuran; `datasetCache` in-memory baru terisi di iterasi pertama).

---

## 4. Cara Mengambil Hasil Pengujian

### 4.1 Baca metrik final dari DOM

```js
const get = (m) => page.$eval(`[data-metric="${m}"]`, (el) => el.textContent.trim());
const metrics = {
  executionTimeMs: parseFloat(await get('execution-time')),
  tbtMs: parseFloat(await get('tbt')),
  fps: parseFloat(await get('fps')),
  datasetLength: parseInt(await get('dataset-length'), 10),
};
```

### 4.2 Baca objek sesi lengkap (lebih kaya)

```js
const session = await page.evaluate(() => window.__lastResearchSession);
// berisi: longTasks, fps seri, queryLength, resultCount, timestamp, method, size
```

atau via event:

```js
const session = await new Promise((resolve) => {
  page.evaluate(() => {
    window.addEventListener('research:session', (e) => {
      window.__resolved = e.detail;
    }, { once: true });
  });
  // polling window.__resolved sampai terisi, atau gunakan waitForFunction:
});
```

Cara yang paling stabil dengan Puppeteer:

```js
await page.waitForFunction(() => window.__lastResearchSession !== undefined);
const session = await page.evaluate(() => window.__lastResearchSession);
```

### 4.3 Output yang disarankan per sesi

Untuk setiap kombinasi `{method, size, query}`, simpan:

```json
{
  "sessionId": "...",
  "method": "web-worker",
  "size": 1000,
  "query": "samudra",
  "queryLength": 7,
  "timestamp": "...",
  "executionTimeMs": 3837.3,
  "tbtMs": 59.0,
  "fpsAverage": 58.4,
  "resultCount": 102,
  "datasetLength": 1000,
  "longTasks": [{ "start": 0, "duration": 0 }]
}
```

### 4.4 Validasi data (wajib)

- **`datasetLength` vs `size`:** jika `datasetLength < size`, katalog server tidak
  mencukupi — kombinasi tsb tidak valid untuk perbandingan antar-metode. Buang atau tandai.
- **`resultCount` harus konsisten** antar metode untuk query yang sama (algoritma identik;
  beda = bug).
- **Pembeda utama worker vs non-worker:** `tbtMs` (harus ≈0 untuk worker) dan `fpsAverage`
  (harus stabil untuk worker).

---

## 5. Checklist Proyek Automation

- [ ] Hapus/abaikan pembacaan `data-metric="inp"` dan `inpMs` (sudah tidak ada).
- [ ] Verifikasi skenario URL-driven masih jalan (navigasi → klik Cari → baca metrik).
- [ ] Tambah guard: `datasetLength` < `size` → tandai invalid.