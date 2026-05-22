# Plan 01: Dummy Datas

Membuat dummy data untuk kebutuhan development sebelum API sebenarnya selesai dan siap untuk digunakan. Data-data ini akan berada di folder `src/datas` dan akan digunakan sebagai mock data untuk halaman Beranda, Katalog Produk, Detail Produk, Keranjang Belanja, Profil, Riwayat Pesanan, dan Halaman Admin.

## Status
[ X ] Selesai & Tervalidasi (Done & Validated)

---

## Proposed Changes

Rencana ini mencakup file-file berikut dan membuat dalam struktur data JSON.

### 1. Dummy Data (Halaman Beranda, Katalog Produk, Detail Produk, Keranjang Belanja, Profil, Riwayat Pesanan, dan Halaman Admin)

#### [NEW] [users.json](file:///e:/PROJECT/SKRIPSI/frontend/src/datas/users.json)
* Membuat dummy data users.
* Total data: 50.
* Sample:
  ```json
    {
      "id": "01HS1234567890ABCDEFGHJKLM",
      "email": "user@example.com",
      "name": "John Doe",
      "address": "123 Street Name",
      "phone_number": "08123456789",
      "role": "user",
      "created_at": "2024-03-20T10:00:00.000Z",
      "updated_at": "2024-03-20T10:00:00.000Z",
      "deleted_at": "2024-03-20T10:00:00.000Z"
    }
  ```

### [NEW] [categories.json](file:///e:/PROJECT/SKRIPSI/frontend/src/datas/categories.json)
* Membuat dummy data categories.
* Total data: 5.
* Kategori: `sembako`, `sayur & buah`, `alat dapur`, `kebutuhan bayi`, `perawatan & kesehatan`
* Sample:
  ```json
    {
        "id": "01HS1234567890ABCDEFGHJKLM",
        "name": "Category Name",
        "slug": "category-name",
        "created_at": "2024-03-20T10:00:00.000Z",
        "updated_at": "2024-03-20T10:00:00.000Z",
        "deleted_at": "2024-03-20T10:00:00.000Z"
      }
  ```

### [NEW] [products.json](file:///e:/PROJECT/SKRIPSI/frontend/src/datas/products.json)
* Membuat dummy data products.
* Total data: 200.
* Harga (`price`) dalam format integer dan support format Rupiah. Minimal `9000` dan Maksimal `45000`.
* Stock: 1 - 100.
* Produk harus sesuai dengan kategori yang ada di `categories.json`.
* Deskripsi produk dalam bentuk HTML dan minimal memiliki 3 paragraf panjang.
* Sample:
  ```json
    {
        "id": "01HS1234567890ABCDEFGHJKLM",
        "name": "Smartphone X",
        "slug": "smartphone-x",
        "price": "10000",
        "description": "<p>Product Description</p>",
        "stock": 50,
        "image_url": "https://ik.imagekit.io/...",
        "category_id": "01HS1234567890ABCDEFGHJKLM",
        "category": {
          "name": "Category Name"
        },
        "sold_count": 10,
        "created_at": "2024-03-20T10:00:00.000Z",
        "updated_at": "2024-03-20T10:00:00.000Z",
        "deleted_at": "2024-03-20T10:00:00.000Z"
      }
  ```

### [NEW] [product_best_seller.json](file:///e:/PROJECT/SKRIPSI/frontend/src/datas/product_best_seller.json)
* Membuat dummy data product best seller.
* Total data: 10.
* `id` harus sesuai dengan `products.json`
* `name` harus sesuai dengan `products.json`
* `slug` harus sesuai dengan `products.json`
* `price` harus sesuai dengan `products.json`
* `image_url` harus sesuai dengan `products.json`
* `sold_count` harus sesuai dengan `products.json`
* Sample:
  ```json
    {
      "id": "01HS1234567890ABCDEFGHJKLM",
      "name": "Product Name",
      "slug": "product-slug",
      "price": 1000,
      "image_url": "https://ik.imagekit.io/...",
      "sold_count": 10
    }
  ```

### [NEW] [report_chart.json](file:///e:/PROJECT/SKRIPSI/frontend/src/datas/report_chart.json)
* Membuat dummy data report chart.
* Total data: 10.
* `date` harus sesuai dengan `orders.json`
* `date_str` harus sesuai dengan `orders.json`
* `total_amount` harus sesuai dengan `orders.json`
* `total_amount_str` harus sesuai dengan `orders.json`
* `order_count` harus sesuai dengan `orders.json`
* `order_count_str` harus sesuai dengan `orders.json`
* Sample:
  ```json
    {
      "date": "2024-03-20",
      "total_amount": 1000,
      "order_count": 10
    }
  ```

### [NEW] [carts.json](file:///e:/PROJECT/SKRIPSI/frontend/src/datas/carts.json)
* Membuat dummy data carts.
* Total data: 200.
* Item di cart harus sesuai dengan `products.json`.
* Quantity: 1 - 10.
* Cart tidak boleh memiliki item dengan product_id yang sama lebih dari 1 kali.
* Item di cart tidak boleh memiliki quantity yang lebih besar dari stock produk.
* `user_id` harus sesuai dengan `users.json`
* Sample:
  ```json
    {
      "id": "01HS1234567890ABCDEFGHJKLM",
      "user_id": "01HS1234567890ABCDEFGHJKLM",
      "items": [
        {
          "id": "01HS1234567890ABCDEFGHJKLM",
          "product_id": "01HS1234567890ABCDEFGHJKLM",
          "quantity": 1,
          "product": {
            "name": "Product Name",
            "price": 1000,
            "image_url": "https://ik.imagekit.io/..."
          }
        }
      ],
      "created_at": "2024-03-20T10:00:00.000Z",
      "updated_at": "2024-03-20T10:00:00.000Z",
      "deleted_at": "2024-03-20T10:00:00.000Z"
    }
  ```

### [NEW] [orders.json](file:///e:/PROJECT/SKRIPSI/frontend/src/datas/orders.json)
* Membuat dummy data orders.
* Status order: `pending` | `paid` | `process` | `completed` | `cancelled`.
* `user_id` harus sesuai dengan `users.json`
* `product_id` harus sesuai dengan `products.json`
* `product_name` harus sesuai dengan `products.json`
* `product_price` harus sesuai dengan `products.json`
* `product_image_url` harus sesuai dengan `products.json`
* `quantity` harus sesuai dengan `carts.json`
* Total data: 200.
* Total `items` di cart tidak boleh lebih dari 5.
* Sample:
  ```json
    {
      "id": "01HS1234567890ABCDEFGHJKLM",
      "user_id": "01HS1234567890ABCDEFGHJKLM",
      "total_amount": 1000,
      "items": [
        {
          "id": "01HS1234567890ABCDEFGHJKLM",
          "order_id": "01HS1234567890ABCDEFGHJKLM",
          "product_id": "01HS1234567890ABCDEFGHJKLM",
          "quantity": 1,
          "product_name": "Product Name",
          "product_price": 1000,
          "product_image_url": "https://ik.imagekit.io/..."
        }
      ],
      "status": "pending",
      "created_at": "2024-03-20T10:00:00.000Z",
      "updated_at": "2024-03-20T10:00:00.000Z",
      "deleted_at": "2024-03-20T10:00:00.000Z"
    }
  ```
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
