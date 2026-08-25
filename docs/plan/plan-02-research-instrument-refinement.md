# Plan-02 — Research Instrument Refinement

Status: done | Scope: fitur research (`/produk/research`) + PRD | Dependensi: plan-01 (done)

## Konteks & Keputusan Metodologi (dikonfirmasi user)
- Cache dataset menyimpan **data RAW** hasil fetch (`Product[]`), bukan hasil proses. Pemrosesan per-query terjadi setelah ambil cache.
- Program analisis user **drop iterasi warm-up (1–3) per skenario**. Konsekuensi:
  - Fetch network yang ada di dalam window `t0–t1` BUKAN anomaly — iterasi-1 (cold) di-drop.
  - Key cache PRD `{query}-{method}-{size}` adalah desain BENAR: tiap skenario key unik → iterasi-1 selalu cold-fetch → warm-up drop tepat sasaran → isolasi skenario terjaga.
- **Anomaly A & F (fetch/worker-init di window pengukuran) DIHAPUS dari scope** — ditangani program analisis, bukan kode.

## Guard rails (dari orchestrator.md)
- Baca orchestrator.md + plan ini sebelum eksekusi.
- Guard per task: `pnpm lint` (0 error) + `pnpx tsc --noEmit` hijau. Build penuh di akhir.
- JANGAN ubah kontrak Puppeteer: `data-testid*`, `data-metric*`, `window.__lastResearchSession`, event `research:session`.
- JANGAN ubah algoritma `searchProductsFuzzyResearch` (threshold k=2, ranking rata-rata, PRD FR-4).
- JANGAN tambah dependency baru.
- Kontrak API tak disentuh.

## Work Packages (kerjakan urut)

### WP-A — Cache key kembali ke spec PRD (FR-5.2)
- [x] A1 `hooks/research.hook.ts:260`: `String(size)` → `` `${trimmed}-${method}-${size}` ``.
- [x] A2 Komentar datasetCache tidak diubah (sudah sesuai spec).
- Verifikasi: `grep "String(size)" hooks/research.hook.ts` → kosong. `grep "trimmed}-${method}-${size}"` → 1 match.

### WP-B — Guard re-entrancy `execute` (anti-leak interval/rAF/observer)
- [x] B1 `useRef` di import react.
- [x] B2 `runningRef = useRef(false)` bersama state.
- [x] B3 Guard `if (runningRef.current) return; runningRef.current = true;` di awal `execute`.
- [x] B4 `runningRef.current = false;` di `teardown` (sukses + catch).
- Verifikasi: jalankan 2x `execute` cepat (submit ganda) → hanya 1 sesi berjalan; `teardown` sekali; tidak ada interval bocor (cek via `performance.getEntriesByType('longtask')` tidak wajib — cukup pastikan tak ada double metrics event `research:session` berturut-turut dari 1 klik).

### WP-C — Hapus `setQuery` ganda
- [x] C1 `setQuery(trimmed)` di L264 dihapus; tersisa 1 panggilan (L153).
- Verifikasi: `grep -n "setQuery" hooks/research.hook.ts` → 1 match (L149).

### WP-D — INP synthetic clicks: tambah koordinat & pointerId
- [x] D1 `pointerdown`/`pointerup` + `pointerId: 1, clientX: 0, clientY: 0`.

### WP-E — PRD: catatan validitas `datasetLength` (G)
- [x] E1 FR-5.1 ditambah catatan `datasetLength` < nominal bila katalog server kecil.
- [x] E2 Tanpa perubahan kode.

### WP-F — Hapus attr duplikat `data-searching`
- [x] F1 `data-searching` dihapus; `metrics-searching` (data-testid) utuh.
- Verifikasi: kontrak Puppeteer `metrics-searching` utuh.

## Verifikasi akhir (WP-H)
- [x] H1 `pnpm lint` → 0 error (warning hanya di `.agents/`).
- [x] H2 `npx tsc --noEmit` → bersih.
- [x] H3 `pnpm build` → hijau.
- [x] H4 Kontrak Puppeteer utuh (grep `__lastResearchSession`, `research:session`, `data-metric`, `data-testid="research-`).
- [ ] H5 Smoke manual `/produk/research` — belum diverifikasi di browser.
- [x] H6 Update registry orchestrator → plan-02 done.

## Definition of Done
Semua WP hijau, guard lolos, kontrak Puppeteer utuh, tidak ada kode redundan tersisa di fitur research.

## Estimasi
Net: −3 baris kode (setQuery dup, data-searching attr, +0), +4 baris guard/key (revert key netral), −0 dep. Perubahan terisolasi di 2 file + 1 doc.