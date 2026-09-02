# Automation 3-Mode — Spek Proyek Puppeteer

Dokumen ini berisi spek lengkap untuk proyek automation (Puppeteer) pada halaman
instrumen penelitian `/produk/research`. Cocok untuk dijadikan prompt agent opencode
di sesi proyek automation. Kontrak Puppeteer dasar (selector, schema sesi, URL-driven)
ada di `docs/automation-sync-prompt.md` — dokumen ini **tidak menduplikasi**, hanya merujuk.

> Status: metode **Mirror** untuk pengukuran independen. Tanpa perubahan kode website.

---

## 1. Ringkasan & Diagram Keputusan

```
scenarios = semua kombinasi {method × size × query}
            method: web-worker | non-web-worker
            size:   500 | 1000 | 2000

Mode 1 EVALUATE (2 iterasi/skenario, SEMUA skenario)
  ├─ injeksi Mirror (independen) + baca site, dari SESI yang sama
  ├─ hitung ΔTBT, ΔFPS per skenario
  └─ keputusan GLOBAL:
       meanError ≤ max(TBT_THRESHOLD, FPS_THRESHOLD) dan tidak ada anomaly
         → Mode 2 SCRAPE
       selain itu → Mode 3 IN-PAGE

Mode 2 SCRAPE  (20 iterasi/skenario)  ← hasil evaluasi
Mode 3 IN-PAGE (20 iterasi/skenario)  ← hasil evaluasi
```

Hasil evaluasi disimpan dan bisa ditimpa manual (force mode).

---

## 2. Konfigurasi

Variable khusus yang bisa diubah sesuai kebutuhan (threshold TBT dan FPS **terpisah**):

```ts
const TBT_THRESHOLD = 0.10; // relatif (0.10 = 10%)
const FPS_THRESHOLD = 0.10; // relatif (0.10 = 10%)
const ITERATIONS_EVAL = 2;  // mode 1
const ITERATIONS_RESEARCH = 20; // mode 2 & 3
type Mode = 'evaluate' | 'scrape' | 'in-page';
const FORCE_MODE: Mode | null = null; // isi untuk bypass evaluasi
```

Keputusan global: `meanError ≤ Math.max(TBT_THRESHOLD, FPS_THRESHOLD)` dan tanpa
anomaly → `scrape`; selain itu → `in-page`.

---

## 3. Injeksi Mirror (mode 1 & 3) — tanpa ubah website

Meniru window pengukuran website (`t0` = klik "Cari", `t1` = hasil render) dengan
**click-anchor** yang dipasang automation:

```js
await page.evaluate(() => {
  window.__t0 = null;
  window.__active = false;
  window.__tbt = [];
  window.__fpsFrames = 0;

  // t0 anchor: listener target-phase di tombol Cari (≈ µs sebelum t0 site)
  document.querySelector('[data-testid="research-submit"]')
    .addEventListener('click', () => {
      window.__t0 = performance.now();
      window.__active = true;
    });

  // TBT independen: kumpulkan semua long task, filter window saat baca
  new PerformanceObserver((l) => {
    for (const e of l.getEntries()) window.__tbt.push(e);
  }).observe({ type: 'longtask' });

  // FPS independen: hitung frame hanya saat __active (nol bias idle-prefix)
  const loop = () => {
    if (window.__active) window.__fpsFrames++;
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
});
```

**Window Mirror**: `[__t0 (saat klik), __lastResearchSession terisi]`.

- `t0` anchor = target-phase listener → jalan sebelum React delegasi (yang memanggil
  `execute()` site) → µs lebih awal dari `t0` site. Praktis identik.
- `t1` = deteksi `__lastResearchSession` terisi ≈ `t1` site (double-rAF).
- rAF dihitung hanya saat `__active` → prefix idle (sebelum klik) tidak mengencerkan FPS.
- TBT difilter `entry.startTime >= __t0` saat baca → buang task di prefix idle,
  setara filter site `start >= t0`.

> `ponytail:` anchor target-phase ≈ t0 site (selisih µs, diabaikan). Bila presisi
> mutlak dibutuhkan, ekspos `t0`/`t1` di `SearchSessionMetrics` website — add ketika
> audit ketat menuntut.

---

## 4. Runner skenario (shared, per iterasi)

```
1. page.goto (URL skenario)               # full reload → reset cache in-memory
2. mode 1/3: inject Mirror                # sebelum klik
3. klik [data-testid="research-submit"]
4. waitForFunction(() => window.__lastResearchSession !== undefined)
5. kumpulkan:
   - SITE (semua mode): __lastResearchSession.metrics.{tbtMs, fpsAverage}
   - INDEP (mode 1/3):
       tbtIndep  = Σ max(0, dur - 50)  utk task dgn start >= __t0
       fpsIndep  = __fpsFrames / ((t_end - __t0) / 1000)
6. simpan per-sesi JSON
```

`t_end` = `performance.now()` (di dalam `page.evaluate` saat baca, bukan Node wall-clock —
hindari noise CDP round-trip).

---

## 5. Mode 1 — Evaluate (perbandingan & keputusan)

Per skenario (2 iterasi, **tanpa drop** — cold fetch network kena site & indep secara
bersamaan di sesi yang sama, sehingga perbandingan tetap adil):

```
ΔTBT = |tbtSite − tbtIndep| / max(tbtIndep, ε)   // ε = 1ms, anti bagi-nol
ΔFPS = |fpsSite − fpsIndep| / fpsIndep
errorSkenario = max(ΔTBT, ΔFPS)                   // worst-case per skenario
```

Agregat global (seluruh skenario): `meanError`, `maxError`.

**Keputusan global:**
```
anomaly = ada skenario dgn (tbtSite = 0 && tbtIndep > 0)
          ATAU ΔFPS > 0.50
mode    = (meanError ≤ max(TBT_THRESHOLD, FPS_THRESHOLD) && !anomaly)
          ? 'scrape' : 'in-page'
```

Output `evaluation-report.json`:
```json
{
  "mode": "scrape",
  "meanError": 0.034,
  "maxError": 0.082,
  "thresholds": { "tbt": 0.10, "fps": 0.10 },
  "scenarios": [
    {
      "method": "non-web-worker", "size": 1000, "query": "samudra",
      "site":  { "tbt": 59.0, "fps": 58.4 },
      "indep": { "tbt": 60.1, "fps": 57.9 },
      "deltaTbt": 0.018, "deltaFps": 0.009, "error": 0.018
    }
  ]
}
```

---

## 6. Mode 2 — Scrape

- Tanpa injeksi. Klik "Cari" → baca `__lastResearchSession` (atau `data-metric="tbt"`
  / `data-metric="fps"`).
- 20 iterasi/skenario. Output per-sesi + agregat (mean/std, drop warm-up 1–3).

## 7. Mode 3 — In-page

- Inject Mirror → klik → baca nilai **independen** (bukan site).
- 20 iterasi/skenario. Output per-sesi + agregat (mean/std, drop warm-up 1–3).
- Independen dari instrumentasi website — bukti validitas bila metrik site diragukan.

---

## 8. Validasi data (semua mode)

- `datasetLength` < `size` → tandai **invalid** (katalog server tak mencukupi);
  kombinasi tsb tidak dipakai untuk perbandingan antar-metode.
- `resultCount` harus konsisten antar metode untuk query sama (algoritma identik;
  beda = bug).
- Dropping iterasi warm-up (1–3) hanya di mode riset (2/3); evaluasi tidak drop.

---

## 9. Kontrak Puppeteer

Rujuk `docs/automation-sync-prompt.md`:
- Selector: `research-search-bar`, `research-keyword-input`, `research-submit`,
  `metrics-panel`, `metrics-searching`, `metric-*`.
- Metrik final: `data-metric="execution-time|tbt|fps|dataset-length"`.
- Sesi: `window.__lastResearchSession` + event `research:session`.
- URL-driven: `?method=&search=&size=` → pre-fill, tanpa auto-execute.