# Orchestrator — Audit & Refactor Codebase

Source of truth untuk semua agent AI. **BACA FILE INI DULU** sebelum mengeksekusi plan apa pun.

## Fungsi
- Menyimpan aturan eksekusi, guard, dan protocol langkah.
- Registry semua plan dengan status.
- Menjadi acuan tunggal; plan file hanya berisi detail tugas.

## Aturan Wajib (guard rails)
1. Baca `orchestrator.md`, lalu plan file target, SEBELUM eksekusi.
2. **Satu task satu status.** Update status di registry setelah tiap task (pending/in-progress/done/blocked).
3. **Guard setelah tiap task:** `pnpm lint` DAN `pnpm build` HARUS hijau sebelum lanjut. Gagal = kembali, perbaiki, ulangi.
4. Jangan ubah kontrak API: bentuk respons `ApiResponse`/`Paginated`, nama field snake_case, endpoint di `config/api.config.ts`.
5. Jangan hapus **kontrak Puppeteer penelitian**: `data-testid*`, `data-metric*`, `window.__lastResearchSession`, event `research:session`. Ini syarat automasi skripsi.
6. Jangan ubah hasil algoritma `searchProductsFuzzyResearch` (threshold k=2, ranking rata-rata). Spek PRD-research-fuzzy-search.md.
7. Frontend-only. Backend di repo terpisah; tidak disentuh.
8. Tanpa dependency baru kecuali disetujui user (cek `ctx7` dulu bila ragu API library).
9. Jangan turunkan aksesibilitas. Jangan menambah `eslint-disable` baru.
10. Bila buntu/ambigu: STOP, lapor, jangan improvise.
11. Commit tidak otomatis. Bila user minta, commit per work package pakai caveman-commit.

## Perintah
- dev: `pnpm dev`
- build: `pnpm build`
- lint: `pnpm lint`
- typecheck: `npx tsc --noEmit`

## Registry Plan
| ID | File | Status |
|----|------|--------|
| plan-01 | docs/plan/plan-01-audit-refactor-codebase.md | done (H2 smoke manual pending) |
| plan-02 | docs/plan/plan-02-research-instrument-refinement.md | done (H5 smoke verified) |
| plan-03 | docs/plan/plan-03-research-compute-window-and-size-expansion.md | done (F3 run penuh pending) |

## Status Konvensi
- `not-started` → `in-progress` → `done` | `blocked` (tulis alasan)