---
name: success-criteria-validator
description: Verifies code quality, accessibility (A11y), performance, and SEO compliance to target high Lighthouse scores (SEO: 100, A11y: 98-100, Performance: 95-100, Best Practice: 95-100).
---

# Success Criteria Validator Skill

Skill lokal ini dirancang untuk memastikan bahwa setiap kode, komponen, dan halaman yang ditulis untuk **As-Sakinah Mart** mematuhi target kualitas tinggi yang telah ditentukan dalam kriteria Lighthouse.

---

## 📋 1. Panduan Verifikasi Manual & Praktik Terbaik

### A. Search Engine Optimization (SEO) — Target: 100
Setiap halaman web (page) wajib memenuhi kriteria berikut:
1.  **Tag Title Dinamis:** Setiap halaman harus memiliki judul yang deskriptif dan unik (misal: "Daftar Produk Sembako Murah | As-Sakinah Mart").
2.  **Meta Description:** Setiap halaman wajib memiliki deskripsi meta untuk SEO yang meringkas konten halaman secara menarik bagi pengguna.
3.  **Struktur Heading (H1-H6):**
    *   Hanya boleh ada **satu** tag `<h1>` per halaman.
    *   Sub-heading harus terstruktur secara hierarkis (`<h1>` -> `<h2>` -> `<h3>`). Jangan melompati tingkatan (misal: `<h1>` langsung ke `<h4>`).
4.  **Atribut Alt Gambar:** Setiap elemen `<img>` wajib memiliki atribut `alt` yang deskriptif (hindari alt kosong `alt=""` kecuali gambar tersebut murni dekoratif dan memiliki `aria-hidden="true"`).

### B. Aksesibilitas (Accessibility / A11y) — Target: 98 - 100
1.  **Aria-Label untuk Tombol Icon:**
    *   Jika sebuah tombol (`<button>`) atau link (`<a>`) hanya berisi icon (seperti `Search`, `ShoppingCart`, `User`, dll.) tanpa teks yang terlihat oleh mata, wajib ditambahkan atribut `aria-label` (contoh: `<button aria-label="Keranjang Belanja"><ShoppingCart /></button>`).
2.  **Elemen Non-Semantik Interaktif:**
    *   Hindari memberikan event `onClick` pada elemen non-semantik seperti `div` atau `span`.
    *   Jika terpaksa melakukannya, Anda wajib menyertakan:
        *   `role="button"`
        *   `tabIndex={0}` (agar dapat difokus menggunakan keyboard)
        *   Keyboard event handler (`onKeyDown` atau `onKeyPress`) untuk menangani tombol `Enter` atau `Space`.
3.  **Kontras Warna:**
    *   Teks harus memiliki kontras warna yang cukup terhadap latar belakangnya sesuai standar WCAG AA (minimal rasio kontras 4.5:1 untuk teks normal dan 3:1 untuk teks besar).
    *   Gunakan warna-warna dari palet `GEMINI.md` yang telah diuji kontrasnya (misal: jangan menggunakan teks abu-abu terang di atas latar belakang putih).

### C. Performa — Target: 95 - 100
1.  **Lazy Loading Gambar:**
    *   Semua gambar yang berada di bawah lipatan layar (below-the-fold) wajib menggunakan atribut `loading="lazy"`.
    *   Gambar utama/banner di atas lipatan layar (above-the-fold / LCP candidate) harus dimuat secara cepat dengan priority tinggi (tambahkan `fetchpriority="high"` jika didukung atau hindari lazy loading pada gambar tersebut).
2.  **Code Splitting & Lazy Routing:**
    *   Rute-rute halaman utama dan admin panel harus dimuat secara malas (lazy loading) melalui mekanisme router.
3.  **Aset Gambar Teroptimasi:**
    *   Hindari mengimpor gambar mentah yang terlalu besar. Gunakan format modern seperti WebP/AVIF atau manfaatkan CDN pengoptimal gambar jika tersedia.

---

## ⚙️ 2. Script Validator Otomatis

Kami menyediakan script pembantu otomatis untuk mendeteksi pelanggaran aturan ini secara cepat di folder `.agents/skills/success-criteria-validator/scripts/validate.js`.

### Cara Menjalankan
Jalankan perintah berikut di root directory proyek Anda:
```bash
npm run validate:success
```

### Penanganan Laporan Pelanggaran
Script akan mengembalikan output laporan dalam kategori berikut:
*   ❌ **[ERROR]:** Pelanggaran keras yang wajib diperbaiki segera karena akan langsung menjatuhkan skor Lighthouse atau melanggar aturan TypeScript/proyek.
*   ⚠️ **[WARNING]:** Hal-hal yang berpotensi melanggar atau perlu ditinjau secara manual (misalnya: verifikasi apakah gambar tertentu berada di *above-the-fold* sehingga tidak perlu di-*lazy load*).
