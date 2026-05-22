# Plan 02: Navbar, Footer, and Search Modal

Refactor kode `navbar` dan `footer` agar sesuai dengan konsep awal dan preferensi user. Kedua komponen ini merupakan komponen yang digunakan dalam seluruh halaman utama website ( bukan halaman admin ) dan diletakkan dalam layout halaman atau `src/routes/_root_.tsx`. Selain itu, komponen `Search` yang sebelumnya berada di halaman utama, akan dipindahkan ke dalam `navbar` sebagai modal.

## Status
[ X ] Selesai & Tervalidasi ( Done & Validated )

---

## Proposed Changes

### [MODIFIED] [Navbar Component](file:///e:/PROJECT/SKRIPSI/frontend/src/components/layout/Navbar.tsx)
* Menggunakan logo yang ada di `src/assets/logo.png`
* Layout Navbar terbagi menjadi 2 bagian ( vertikal ) :
    * Bagian atas :
       * Informasi mengenai alamat pengiriman berdasarkan alamat pengguna (`user` atau jika belum login maka akan menampilkan `Alamat Pengiriman`) dan text `Belanja Praktis Sembako & Alat Rumah Tangga dari Rumah!`
       * Background : `#00AA5B`
       * Warna text : `white`
       * Icon yang digunakan : `MapPin`
       * Icon dan text bisa diclick dan mengarah ke halaman `/profil/alamat`
    * Bagian bawah :
        * Bagian Kiri : 
            * Logo dan text `As-Sakinah` `Mart` (clickable untuk kembali ke beranda).
            * Text `As-Sakinah` dan `Mart` sejajar horizontal.
            * Warna `As-Sakinah` adalah `#080808` dan `Mart` adalah `#00AA5B`.
        * Bagian Kanan : Terdiri dari 
            * Tombol search yang hanya berisi icon `Search`.
            * Tombol search berfungsi untuk membuka modal search.
            * Tombol keranjang yang berisi icon `ShoppingCart` dan angka jumlah barang yang ada di keranjang dengan `badge` dari `shadcn ui`.
            * Tombol profil yang berisi icon `User` dan nama user ( clickable untuk membuka menu profil ).

### [NEW] [Seach Component](file:///e:/PROJECT/SKRIPSI/frontend/src/components/layout/modal/Search.tsx)
* Komponen yang berisi input search dan tombol search.
* Dibawah input search terdapat tombol-tombol yang menampilkan kategori-kategori produk ( clickable untuk memfilter produk berdasarkan kategori ).
* Dibawah tombol kategori terdapat 2 tombol tipe algoritma pencarian:
    * Tombol `Levenshtein` : Akan mencari produk-produk dengan menerapkan algoritma string matching menggunakan `Levenshtein Distance`.
    * Tombol `Normal` : Akan menampilkan produk-produk dengan kata kunci yang sama persis dengan query pencarian.
* Hasil pencarian akan menampilkan produk-produk yang sesuai dengan query pencarian di halaman `/produk`.

### [NEW] [Footer Component](file:///e:/PROJECT/SKRIPSI/frontend/src/components/layout/Footer.tsx)
* Footer terdiri dari 4 bagian : 
    * Bagian Kiri : Informasi mengenai toko ( Logo, Deskripsi, dan Informasi Kontak )
    * Bagian Kanan : 
        * Menu - menu utama dari website ( Beranda, Produk, Keranjang, Profil )
* Bagian bawah footer menampilkan copyright 
* Background: #ffffff.
* border-top: `border-t border-gray-100`

---

## Reference
* `src/components/layout/Navbar.tsx`
* `src/components/layout/Footer.tsx`
* `src/components/layout/modal/Search.tsx`

---

## Batasan-Batasan (Constraints)
* Navbar dan Footer hanya ada di halaman utama (bukan halaman admin).
* Gunakan icon-icon hanya dari `Lucide React` (import dari `lucide-react`).
* Gunakan komponen `Dialog` dari `shadcn ui` untuk menampilkan modal search.
* Pastikan untuk mematuhi aturan dari [GEMINI.md](file:///e:/PROJECT/SKRIPSI/frontend/GEMINI.md)
* Pastikan kode selalu SEO friendly.
* Gunakan Tailwind CSS untuk styling.
* Jangan pernah menggunakan `inline style`.
* Gunakan TypeScript untuk typing.
* Gunakan Zod untuk validation.
* Desain harus responsif terhadap seluruh ukuran perangkat.

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
- Memeriksa responsive navbar dan footer.
- Memeriksa fungsionalitas modal search.