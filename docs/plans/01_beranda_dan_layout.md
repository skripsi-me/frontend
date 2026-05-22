# Plan 01: Beranda & Tata Letak Utama (Home & Main Layout)

Menata struktur halaman Beranda (`/`) dan tata letak utama (Header/Navbar, Footer) sesuai spesifikasi desain Tokopedia Fresh Commerce (hijau `#00AA5B`, modern, simple, ramah pengguna pedesaan) dengan struktur modular (DRY) dan verifikasi sukses (SEO, A11y, Performa).

## Status
🟢 **Selesai & Tervalidasi**

---

## Proposed Changes

Rencana ini mencakup file-file berikut untuk memisahkan logika tata letak global dari konten halaman utama.

### 1. Tata Letak Global (Global Layout & Shell)

#### [MODIFY] [__root.tsx](file:///e:/PROJECT/SKRIPSI/frontend/src/routes/__root.tsx)
*   Mengintegrasikan `Navbar` dan `Footer` global ke dalam rute root.
*   Mengaktifkan conditional rendering agar Navbar/Footer tidak muncul pada rute `/admin/*` untuk panel admin.
*   Menyertakan `@tanstack/router-devtools` di lingkungan pengembangan.

#### [NEW] [Navbar.tsx](file:///e:/PROJECT/SKRIPSI/frontend/src/components/layout/Navbar.tsx)
*   Navigasi Header utama dengan kolom pencarian sembako besar, logo As-Sakinah Mart, kontrol keranjang belanja (indikator jumlah item), dan profil pengguna.

#### [NEW] [Footer.tsx](file:///e:/PROJECT/SKRIPSI/frontend/src/components/layout/Footer.tsx)
*   Footer informatif dengan kontak warung kelontong offline (WhatsApp, alamat RT/RW Desa Mekarjaya, jam buka), deskripsi singkat, dan badge metode pembayaran yang didukung (COD, QRIS, Transfer Bank).

---

### 2. Komponen Halaman Beranda (Beranda & Komponen Pendukung)

#### [MODIFY] [Home.tsx](file:///e:/PROJECT/SKRIPSI/frontend/src/pages/main/Home.tsx)
*   Memecah markup halaman Home yang semula monolitik menjadi komponen-komponen terpisah agar mematuhi prinsip DRY.
*   Merender banner promo utama, kategori belanja populer, banner keyakinan (pasti amanah, pengiriman cepat, COD), serta daftar produk terlaris.

#### [NEW] [HeroSection.tsx](file:///e:/PROJECT/SKRIPSI/frontend/src/components/shared/HeroSection.tsx)
*   Banner promosi utama "Belanja Sembako Murah, Gratis Ongkir se-Kecamatan!" dengan visual LCP kandidat gambar yang dioptimalkan (`fetchPriority="high"`).

#### [NEW] [CategoryCard.tsx](file:///e:/PROJECT/SKRIPSI/frontend/src/components/shared/CategoryCard.tsx)
*   Kartu kategori belanja populer (Sembako, Sayur & Buah, Alat Dapur, Kebutuhan Bayi, dll.) dengan interaktivitas keyboard lengkap (`role="button"`, `tabIndex={0}`, event `onKeyDown`).

#### [NEW] [FeatureCard.tsx](file:///e:/PROJECT/SKRIPSI/frontend/src/components/shared/FeatureCard.tsx)
*   Kartu jaminan layanan yang menumbuhkan rasa percaya ibu-ibu desa (Pasti Amanah, Bayar di Tempat/COD, Pengiriman Cepat).

#### [NEW] [ProductCard.tsx](file:///e:/PROJECT/SKRIPSI/frontend/src/components/shared/ProductCard.tsx)
*   Kartu produk terlaris (Best Seller) modular dengan detail nama, rating bintang, jumlah terjual, harga, diskon, stok, unit, tombol favorit, serta tombol beli instan.

---

## Verification Plan

### Automated Tests
- Menjalankan unit test fungsionalitas komponen:
  ```bash
  npm run test
  ```
- Menjalankan validasi aturan kualitas Lighthouse:
  ```bash
  npm run validate:success
  ```
- Memverifikasi kelengkapan dokumentasi JSDoc:
  ```bash
  npm run jsdoc:check
  ```

### Manual Verification
- Membuka halaman utama di browser lokal via `npm run dev`.
- Menguji responsivitas pada ukuran layar handphone (360px - 480px) dan desktop (1440px).
- Menguji tombol navigasi keyboard (Fokus menggunakan tombol Tab, tekan Enter/Space pada Kategori).
