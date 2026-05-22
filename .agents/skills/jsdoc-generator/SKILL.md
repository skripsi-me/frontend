---
name: jsdoc-generator
description: Validates and automatically generates JSDoc documentation blocks for functions, classes, and React components to ensure code readability and strict standardization.
---

# JSDoc Generator & DRY Guidelines Skill

Skill lokal ini membantu memastikan seluruh kode dalam proyek **As-Sakinah Mart** memiliki dokumentasi standar yang lengkap menggunakan JSDoc serta mematuhi prinsip **Don't Repeat Yourself (DRY)** demi menjaga keterbacaan dan reusabilitas kode.

---

## 📋 1. Format JSDoc Wajib

Setiap deklarasi **Fungsi biasa (Helper)**, **Kelas (Class)**, **Custom Hooks**, dan **React Components** wajib didokumentasikan menggunakan komentar JSDoc dengan struktur:

```typescript
/**
 * @description Penjelasan singkat mengenai fungsi, kelas, atau komponen ini.
 * @param {tipe} namaParam Penjelasan singkat parameter (opsional jika tidak ada param).
 * @returns {tipe} Penjelasan nilai kembalian (opsional jika tidak mengembalikan apa-apa / JSX.Element).
 * @example
 * // Contoh penggunaan:
 * const hasil = hitungTotal(10, 20);
 */
```

### Aturan Format:
1.  **`@description`**: Deskripsi wajib diisi dan menjelaskan *apa* yang dilakukan oleh modul tersebut.
2.  **`@param`**: Setiap parameter harus dituliskan tipenya di dalam kurung kurawal `{}` dan nama parameternya. Jika tidak ada parameter, bagian ini dapat dihilangkan.
3.  **`@returns`** atau **`@return`**: Wajib diisi jika fungsi mengembalikan nilai (misalnya fungsi pembantu/helper). Dapat diabaikan jika return type-nya adalah `void` atau jika berupa komponen React.
4.  **`@example`**: Menyertakan minimal satu contoh nyata penggunaan kode tersebut.

---

## ⚙️ 2. Alat Validator & Generator Otomatis

Kami menyediakan alat otomatis di folder `.agents/skills/jsdoc-generator/scripts/jsdoc-generator.cjs`.

### Menjalankan Validasi JSDoc
Untuk memverifikasi apakah ada fungsi, kelas, atau komponen yang belum didokumentasikan:
```bash
npm run jsdoc:check
```

### Menghasilkan Template JSDoc Secara Otomatis
Untuk menyisipkan template JSDoc kosong secara otomatis pada deklarasi yang belum memilikinya:
```bash
npm run jsdoc:generate
```
Alat ini akan langsung menuliskan placeholder JSDoc di atas fungsi, kelas, atau komponen Anda secara otomatis!

---

## 🔄 3. Prinsip DRY (Don't Repeat Yourself)

Untuk menghindari duplikasi kode yang tidak efisien, ikuti panduan berikut:
1.  **Logika Bisnis & Format Data:** Jika sebuah logika pemrosesan data (seperti memformat mata uang rupiah, tanggal, atau validasi teks) digunakan di lebih dari satu tempat, pindahkan logika tersebut ke dalam berkas utilitas baru di folder [src/utils/](file:///e:/PROJECT/SKRIPSI/frontend/src/utils).
2.  **Pengelolaan State & Efek:** Jika ada logic stateful (seperti fetching data dengan handling loading/error) yang dipakai berulang, buatlah custom React hook di folder [src/hooks/](file:///e:/PROJECT/SKRIPSI/frontend/src/hooks).
3.  **Komponen UI:** Hindari menulis ulang markup HTML/Tailwind yang sama untuk komponen visual (seperti kartu produk, input field, atau layout tombol). Gunakan dan perluas komponen dari [src/components/ui/](file:///e:/PROJECT/SKRIPSI/frontend/src/components/ui) atau [src/components/shared/](file:///e:/PROJECT/SKRIPSI/frontend/src/components/shared).
