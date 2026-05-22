# As-Sakinah Mart - Frontend Rules & Guidelines

File ini berisi aturan global, standarisasi coding, struktur folder, arsitektur, dan referensi desain untuk agen AI (Antigravity) dalam membangun dan memelihara frontend **As-Sakinah Mart**.

---

## 📌 1. Informasi Proyek & Konteks

*   **Nama Aplikasi:** As-Sakinah Mart
*   **Jenis Platform:** Website Toko Online (Online Store) untuk kebutuhan rumah tangga.
*   **Target Pengguna:** Wanita usia 30 - 40 tahun, warga pedesaan.
    *   *Desain UX/UI Konsekuensi:* Navigasi harus sangat intuitif, teks terbaca jelas (ukuran font cukup besar dan kontras tinggi), tombol mudah ditekan, proses checkout sangat ringkas, serta menggunakan istilah yang sederhana/familiar (hindari jargon teknis yang rumit).
*   **Tema Desain:** Modern, Simple, dan Pendekatan Ramah Pengguna.
*   **Warna Utama (Primary Color):** `#00AA5B` (Hijau Tokopedia Fresh).

---

## 🛠️ 2. Tech Stack & Preferensi Library

Semua kode harus ditulis menggunakan library dan tool berikut:

*   **Bahasa Pemrograman:** TypeScript (Strict Mode aktif).
*   **Framework:** React Vite (Vite v8+, React v19+).
*   **HTTP Client:** Axios (dikonfigurasi dengan `withCredentials: true` karena auth menggunakan HttpOnly cookies).
*   **State Management (Global Client State):** **Zustand** (untuk keranjang belanja offline, session state, filter pencarian, dll.).
*   **Cache Management (Server State):** Tanstack Query (React Query) v5+.
*   **Routing Library:** **@tanstack/react-router** (file-based routing).
*   **Form Management:** Tanstack Forms.
*   **Data Table:** Tanstack Table.
*   **Validasi Schema & Input:** Zod.
*   **Icon Library:** Lucide React.
*   **Chart Library:** Recharts (digunakan pada dashboard admin).
*   **Atomic Components:** Shadcn UI (Radix UI + Tailwind CSS v4).
*   **Alert & Notification:** Sonner.
*   **Unit Testing:** Vitest.

---

## 📂 3. Struktur Folder Wajib

Struktur folder wajib di dalam folder `/src` adalah sebagai berikut:

```text
src/
├── assets/         # Aset statis seperti logo, gambar, ilustrasi
├── components/     # Komponen React reusable
│   ├── ui/         # Atomic components (Shadcn UI default/custom)
│   ├── shared/     # Molecules components (card produk, item keranjang, modal detail)
│   └── layout/     # Organism components (Navbar utama, Sidebar Admin, Footer)
├── pages/          # Halaman utama aplikasi (actual view components)
│   ├── main/       # Halaman untuk Website Utama (Pembeli/User)
│   └── admin/      # Halaman untuk Admin Panel
├── routes/         # Entrypoint file-based routing untuk @tanstack/react-router
├── hooks/          # Custom hooks reusable
├── libs/           # Inisialisasi library (Axios instance, Tanstack Query client, Zustand store)
├── utils/          # Helper functions dan formatter (format IDR, tanggal)
├── constants/      # Konstanta statis (route paths, status enum, dll.)
├── services/       # Integrasi API (fungsi fetch, mutasi query)
├── types/          # Type & Interface TypeScript (Wajib menggunakan prefix 'I')
├── datas/          # Data dummy/mock lokals untuk development/testing
└── config/         # Konfigurasi sistem (env loader, setting global)
```

### 📌 Aturan Standar Penamaan (Naming Convention)

Untuk menjaga konsistensi kode dan memudahkan kolaborasi, seluruh penulisan kode dan berkas harus mengikuti aturan konvensi penamaan berikut:

| Elemen | Naming Convention | Contoh |
| :--- | :--- | :--- |
| **Variabel & Fungsi Biasa** | `camelCase` | `const totalAmount = 0`, `function calculateTotal()` |
| **Class** | `PascalCase` | `class AxiosService`, `class HttpClient` |
| **Komponen React (Function)** | `PascalCase` | `function ProductCard()`, `export default function Home()` |
| **Type & Interface** | `PascalCase` (Wajib prefix `I`) | `interface IUser`, `type IOrderStatus` |
| **Berkas Komponen (`components/`)** | `PascalCase` | `ProductCard.tsx`, `Sidebar.tsx` |
| **Berkas Halaman (`pages/`)** | `PascalCase` | `Home.tsx`, `ProductDetail.tsx`, `DashboardPage.tsx` |
| **Berkas Route (`routes/`)** | Aturan TanStack Router | `__root.tsx`, `index.tsx`, `products.$slug.tsx` |
| **Berkas Hooks** | `camelCase` (Prefix `use`) | `useAuth.ts`, `useCart.ts` |
| **Berkas Utils & Helper** | `camelCase` | `formatDate.ts`, `currencyFormatter.ts` |
| **Berkas Service / API** | `camelCase` (Suffix `Service`) | `authService.ts`, `productService.ts` |
| **Tipe Data / Interface Berkas** | `PascalCase` (Prefix `I`) | `IUser.ts`, `IProduct.ts` |

---

## 🎨 4. Panduan Desain & CSS (Berdasarkan `.agents/DESIGN.md` & Tailwind CSS v4)

Desain frontend harus mengikuti token dan tema dari spesifikasi **Tokopedia Fresh Commerce** menggunakan **Tailwind CSS v4**:

### A. Palet Warna (Color System)
*   **Primary (`#00AA5B`):** Hijau utama untuk aksi utama, tombol primary, link aktif, dan indikator terpilih.
*   **Secondary (`#FFFFFF`):** Latar belakang utama dan base tombol sekunder.
*   **Tertiary (`#F4F6F8`):** Pembatas warna lembut antar modul atau section.
*   **Neutral (`#080808`):** Warna font utama untuk heading, label penting, dan teks krusial.
*   **Neutral-60 (`#6B7280`):** Abu-abu untuk deskripsi pendukung, metadata, teks tidak aktif.
*   **Neutral-30 (`#B3BBC9`):** Outline input form, border card tipis, dan tombol sekunder.
*   **Neutral-10 (`#E5E7EB`):** Pembatas structural yang sangat tipis.
*   **Surface (`#FFFFFF`):** Latar belakang card, dialog, popover.
*   **Surface-2 (`#F9FAFB`):** Latar belakang section/container minor.
*   **Error (`#E5484D`):** Validasi gagal, pesan kesalahan, state destruktif.

### B. Tipografi (Typography)
*   **Font Utama:** `Open Sauce One` (Fallback: `Nunito Sans` untuk pembacaan maksimal oleh target pengguna berusia 30-40 tahun).
*   **Heading:** Tebal (font-weight 600/700) dengan ukuran berkisar antara 18px hingga 32px.
*   **Body & Label:** Dominan semi-bold/bold untuk kejelasan tinggi. Ukuran font body default minimal 14px (body-md) dan 16px (body-lg) agar mudah dibaca oleh warga desa.

### C. Bentuk & Struktur Layout
*   **Border Radius:**
    *   Standard (card, input, button): `8px` (`rounded-md`).
    *   Kecil (badge, tag): `4px` (`rounded-sm`).
    *   Pills/Chips: `9999px` (`rounded-full`).
*   **Spacing Rhythm:** 6px (micro), 16px (internal padding), 32px (section gap), 50px (banner gap), 110px (hero gap).
*   **Elevation:** Hindari shadow tebal dan efek glassmorphism berlebihan. Gunakan outline border tipis (`Neutral-30` atau `Neutral-10`) dan shadow halus untuk memperkuat struktur.

---

## 📡 5. Standarisasi API Response & Config

Semua request API menggunakan Axios dan wajib dikonfigurasi melalui instance di `src/libs/axios.ts` dengan memanfaatkan variabel lingkungan:

*   **API Base URL:** Diambil dari variabel lingkungan `import.meta.env.VITE_API_URL` yang dideklarasikan di file `.env`.
*   **Credentials:** `withCredentials: true` diaktifkan secara default untuk mendukung cookie HttpOnly.

### Format JSON Response standard
```typescript
interface IApiResponse<T> {
  metadata: {
    code: number;
    message: string;
  };
  data: T | null;
  error?: {
    [key: string]: string; // Validasi field error
  };
}
```

Setiap pemanggilan API dengan Axios harus menangani status code dan menampilkan pesan kesalahan/sukses menggunakan **Sonner** alert.
*   **200 / 201:** Success state. Tampilkan toast jika dirasa perlu (misal: "Produk berhasil ditambahkan ke keranjang").
*   **400 / 422:** Validation state. Tampilkan pesan error pada field yang sesuai di form (integrasi Zod + Tanstack Forms).
*   **401:** Unauthorized. Lakukan redirect ke login atau panggil endpoint refresh token `/api/auth/refresh`.

---

## 📝 6. Daftar Halaman yang Wajib Diimplementasikan

Setiap halaman di bawah ini akan direpresentasikan oleh berkas route di folder `src/routes/` yang secara tipis akan memanggil modul utama dari `src/pages/main/` dan `src/pages/admin/`.

### Halaman Website Utama (Pembeli):
1.  **Beranda (`/`):** Banner promosi, kategori populer, produk terlaris (Best Sellers), rekomendasi produk.
2.  **Daftar Produk (`/products`):** Pencarian produk, filter kategori, pagination, urutan harga/terpopuler.
3.  **Detail Produk (`/products/:slug`):** Foto produk, deskripsi lengkap, stok, harga, tombol tambah ke keranjang, dan kuantitas input.
4.  **Keranjang Saya (`/cart`):** Daftar belanjaan, edit kuantitas, hapus item, ringkasan belanja, tombol checkout.
5.  **Riwayat Pesanan (`/orders`):** Daftar pesanan yang pernah dibuat, status pembayaran, dan status pengiriman.
6.  **Detail Riwayat Pesanan (`/orders/:id`):** Rincian item yang dibeli, alamat pengiriman, metode pembayaran, total biaya, dan timeline status pesanan.
7.  **Profil Saya (`/profile`):** Informasi biodata pengguna.
8.  **Ubah Profil (`/profile/edit`):** Form edit nama, nomor telepon, dan alamat.
9.  **Ubah Password (`/profile/change-password`):** Form ganti password dengan verifikasi password lama.

### Admin Panel (`/admin`):
1.  **Dashboard (`/admin/dashboard`):** Ringkasan statistik (total penjualan, pesanan baru, pengguna terdaftar) dengan chart grafik penjualan (Recharts).
2.  **Manajemen Produk (`/admin/products`):** Tabel produk (Tanstack Table) dengan fitur pencarian, filter, edit, tambah, dan hapus.
3.  **Detail Produk Admin (`/admin/products/:id`):** Tampilan detail performa produk atau view sebelum diedit.
4.  **Manajemen Kategori (`/admin/categories`):** List kategori, form tambah/edit kategori, dan opsi hapus kategori.
5.  **Manajemen Pesanan (`/admin/orders`):** Tabel list pesanan masuk, filter status pesanan (pending, processing, shipped, completed, cancelled), dan aksi ubah status.
6.  **Detail Pesanan Admin (`/admin/orders/:id`):** Detail pesanan, data pembeli, rincian pembayaran, dan logs status pesanan.
7.  **Manajemen Pengguna (`/admin/users`):** Tabel list pengguna terdaftar (pembeli & admin), pencarian, dan ganti role/status akun.
8.  **Detail Pengguna Admin (`/admin/users/:id`):** Profil lengkap pengguna dan riwayat transaksi mereka.

---

## 🚀 7. Kriteria Keberhasilan & Lighthouse Target

Aplikasi harus memenuhi standar kualitas tinggi:
1.  **Responsiveness:** Berfungsi penuh di resolusi mobile (360px) hingga desktop besar (1440px). Target pengguna wanita pedesaan mayoritas akan mengakses dari mobile.
2.  **Lighthouse Target:**
    *   **SEO:** 100 (Wajib menyertakan meta tags, semantic HTML tags, image alt text, title page dinamis).
    *   **Best Practice:** 95 - 100 (HTTPS, dependency aman, no console errors).
    *   **Accessibility (A11y):** 98 - 100 (Kontras warna sesuai standar WCAG AA, aria-labels pada tombol icon, support screen reader, keyboard navigation).
    *   **Performance:** 95 - 100 (Lazy load images, lazy load pages/routes, optimasi aset gambar, bundle splitting).
3.  **Validasi Input:** Seluruh input form divalidasi ketat menggunakan Zod schema sebelum disubmit ke backend. Tampilkan feedback visual error yang ramah pengguna.
4.  **Clean Code:** Tidak boleh ada runtime error, TS error (no implicit `any`), dan warnings di console log.

---

## 🤝 8. Keputusan Teknis Disepakati (Technical Decisions)

Berdasarkan keputusan pengguna, konfigurasi dasar disepakati sebagai berikut:
1.  **Tailwind CSS v4:** Digunakan sebagai engine utility CSS utama, diintegrasikan langsung menggunakan Vite plugin `@tailwindcss/vite` (tanpa postcss/tailwind config tradisional).
2.  **Tanstack Router (`@tanstack/react-router`):** Diimplementasikan dengan file-based routing. File route di `src/routes/` berfungsi sebagai loader dan entrypoint, merender visual page yang ada di `src/pages/`.
3.  **Environment Variable:** Endpoint API dikonfigurasi melalui berkas `.env` dengan variabel `VITE_API_URL=http://localhost:3000/api`.
4.  **Zustand:** Digunakan sebagai state manager di sisi client untuk menangani persistensi keranjang belanja offline dan UI global state (sidebar, mode, dll.).

---

## 🏃‍♂️ 9. Workflow Perintah (Commands)

*   **Development Server:** `npm run dev`
*   **Build Production:** `npm run build`
*   **Preview Build:** `npm run preview`
*   **Unit Testing:** `npm run test`
*   **Lighthouse Success Validator:** `npm run validate:success`

---

## 🔄 10. Alur Kerja Pengembang & Agen (Developer & Agent Workflow)

Setiap kali melakukan perubahan kode pada repositori ini, ikuti alur kerja wajib berikut:
1.  **Modifikasi Berkas:** Lakukan pembuatan, pembaruan, atau penghapusan kode/berkas (`Create/Update/Delete`) sesuai kebutuhan fitur.
2.  **Pengujian & Validasi Otomatis:** Selalu jalankan pengujian unit (`npm run test`) dan verifikasi kepatuhan kriteria sukses Lighthouse (`npm run validate:success`) untuk memastikan fungsionalitas berjalan dengan benar dan mematuhi aturan SEO, Aksesibilitas, Performa, dan Naming Convention.
3.  **Git Commit:** Lakukan commit perubahan menggunakan perintah `git commit` dengan pesan berbasis **Conventional Commits** (misal: `feat: ...`, `fix: ...`, `docs: ...`, `refactor: ...`, `test: ...`).
4.  **Batas Git Push:** **JANGAN** pernah melakukan `git push` ke repositori jauh (remote). Biarkan pengguna yang meninjau kembali dan melakukan push secara manual.
