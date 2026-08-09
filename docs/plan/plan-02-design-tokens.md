# PLAN-02 — Design Token ke Tailwind v4 Theme

> Eksekusi SETELAH [`plan-01-shadcn-init.md`](./plan-01-shadcn-init.md). Bagian dari Fase 2.

## Tujuan

Menerjemahkan design token `docs/DESIGN.md` ("Tokopedia Green Commerce") ke CSS variables + Tailwind v4 `@theme` di `app/globals.css`.

## Sumber Token

Baca [`../DESIGN.md`](../DESIGN.md) — bagian YAML frontmatter (warna, tipografi, radius, spacing, komponen).

## Mapping Warna

| Token DESIGN.md             | Nilai     | CSS var / Tailwind           |
| --------------------------- | --------- | ---------------------------- |
| primary                     | `#00AA5B` | `--color-primary`            |
| primary-foreground          | `#FFFFFF` | `--color-primary-foreground` |
| primary-soft                | `#E7F9EF` | `--color-primary-soft`       |
| secondary                   | `#101010` | `--color-secondary`          |
| tertiary                    | `#B3BBC9` | `--color-tertiary`           |
| neutral                     | `#FFFFFF` | `--color-neutral`            |
| neutral-100 / surface-muted | `#F7F8FA` | `--color-surface-muted`      |
| surface                     | `#FFFFFF` | `--color-surface`            |
| on-surface                  | `#080808` | `--color-on-surface`         |
| on-surface-muted            | `#6B7280` | `--color-on-surface-muted`   |
| border                      | `#E5E7EB` | `--color-border`             |
| border-strong               | `#B3BBC9` | `--color-border-strong`      |
| success                     | `#00AA5B` | `--color-success`            |
| warning                     | `#F59E0B` | `--color-warning`            |
| error                       | `#E11D48` | `--color-error`              |

## Mapping Radius & Spacing

| Token                  | Nilai            | Catatan                 |
| ---------------------- | ---------------- | ----------------------- |
| `rounded.md`           | 8px              | radius default komponen |
| `rounded.lg`           | 12px             | banner                  |
| `rounded.xl`           | 16px             | panel besar             |
| `rounded.full`         | 9999px           | chip/badge              |
| spacing xs/sm/md/lg/xl | 6/16/32/50/110px | rhythm layout           |

Sesuaikan/tingkatkan skala spacing Tailwind bila diperlukan agar konsisten.

## Mapping Tipografi

Font: **Open Sauce One** (dipasang di plan-03).

Gunakan `@theme` untuk token berikut (font-size + weight + line-height):

| Token            | Size/Weight/LineHeight |
| ---------------- | ---------------------- |
| headline-display | 32px / 700 / 38px      |
| headline-lg      | 28px / 700 / 33px      |
| headline-md      | 20px / 600 / 24px      |
| headline-sm      | 18px / 600 / 22px      |
| body-lg          | 16px / 600 / 24px      |
| body-md          | 14px / 600 / 21px      |
| body-sm          | 12px / 400 / 18px      |
| label-lg         | 14px / 700 / 21px      |
| label-md         | 12px / 800 / 18px      |
| label-sm         | 12px / 400 / 18px      |
| caption          | 11px / 600 / 16px      |

Implementasi diserahkan pada eksekutor — target: utility class siap pakai (misal via `@utility` atau custom class di layer `components`).

## Langkah

1. Baca `app/globals.css` (sudah berisi hasil init shadcn dari plan-01).
2. Timpa/atur CSS variables & `@theme` sesuai mapping di atas.
3. HAPUS blok `@media (prefers-color-scheme: dark)` — desain tidak memakai dark mode.
4. HAPUS warna default Geist (`--background: #ffffff`, `--foreground: #171717` di `:root`) dan ganti dengan `--background: #ffffff` (surface) & `--foreground: #080808` (on-surface).
5. Hapus `--font-geist-*` reference bila masih ada (font final di plan-03).

## Verifikasi

```bash
pnpm lint
npx tsc --noEmit
pnpm build
```

- Tidak ada referensi dark-mode.
- Token warna DESIGN.md terdefinisi.
- Build sukses.

## Catatan

- Jangan hapus struktur `@theme` shadcn yang dibutuhkan komponen (misal `--radius`). Sesuaikan nilainya, bukan menghapus.
- Simpan komentar singkat `// As-Sakinah Mart design tokens — docs/DESIGN.md` sebagai penanda sumber.
