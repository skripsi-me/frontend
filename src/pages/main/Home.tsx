import { useState } from 'react'
import { Search, ShoppingCart, MapPin, User, ChevronRight, Star, Heart } from 'lucide-react'
import logoImg from '../../assets/logo.png'
import heroImg from '../../assets/hero.png'
import { toast } from 'sonner'

/**
 * @description Komponen halaman utama (Beranda) As-Sakinah Mart yang merender banner promosi, kategori populer, produk terlaris, dan footer.
 * @return {JSX.Element} Elemen JSX untuk halaman Beranda.
 * @example
 * <Home />
 */
export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')

  const categories = [
    { id: 1, name: 'Sembako', icon: '🍚', color: 'bg-green-50 text-green-700 border-green-200' },
    { id: 2, name: 'Sayur & Buah', icon: '🍎', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { id: 3, name: 'Alat Dapur', icon: '🍳', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { id: 4, name: 'Kebutuhan Bayi', icon: '🍼', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { id: 5, name: 'Sabun & Cuci', icon: '🧼', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    { id: 6, name: 'Bumbu Dapur', icon: '🌶️', color: 'bg-red-50 text-red-700 border-red-200' },
  ]

  const featuredProducts = [
    {
      id: '01HSY1',
      name: 'Minyak Goreng Sawit Premium 2L',
      price: 34500,
      originalPrice: 38000,
      discount: '9%',
      stock: 45,
      unit: 'Pouch',
      sold: 120,
      image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80',
      rating: 4.8,
    },
    {
      id: '01HSY2',
      name: 'Beras Premium Cianjur Pandan Wangi 5kg',
      price: 79000,
      originalPrice: 85000,
      discount: '7%',
      stock: 12,
      unit: 'Karung',
      sold: 85,
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80',
      rating: 4.9,
    },
    {
      id: '01HSY3',
      name: 'Telur Ayam Negeri Segar isi 10 butir',
      price: 18500,
      originalPrice: 18500,
      discount: null,
      stock: 30,
      unit: 'Pak',
      sold: 210,
      image: 'https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?auto=format&fit=crop&w=400&q=80',
      rating: 4.7,
    },
    {
      id: '01HSY4',
      name: 'Gula Pasir Putih Kristal Murni 1kg',
      price: 16000,
      originalPrice: 17500,
      discount: '8%',
      stock: 50,
      unit: 'Bungkus',
      sold: 340,
      image: 'https://images.unsplash.com/photo-1581781870027-04212e231e96?auto=format&fit=crop&w=400&q=80',
      rating: 4.9,
    },
  ]

  const handleAddToCart = (productName: string) => {
    toast.success(`${productName} berhasil ditambahkan ke keranjang belanja!`)
  }

  const formatIDR = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="flex-1 flex flex-col font-sans bg-[#F4F6F8]">
      {/* Top Banner Alamat - Menambah kesan ramah bagi warga desa */}
      <div className="bg-[#00AA5B] text-white py-2 px-4 text-sm flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2 max-w-[80%] md:max-w-none truncate">
          <MapPin size={16} className="shrink-0 text-white" />
          <span className="font-semibold text-xs md:text-sm truncate">
            Kirim ke: <strong className="underline cursor-pointer">Dusun Karangsari, RT 03/RW 04, Desa Mekarjaya</strong>
          </span>
        </div>
        <div className="hidden md:block text-xs font-semibold">
          Belanja Praktis Sembako & Alat Rumah Tangga dari Rumah!
        </div>
      </div>

      {/* Main Header / Navigation */}
      <header className="sticky top-0 bg-white border-b border-[#E5E7EB] py-3 px-4 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Brand Name */}
          <div className="flex items-center gap-2 cursor-pointer shrink-0">
            <img src={logoImg} alt="As-Sakinah Mart Logo" className="h-10 w-10 object-contain" fetchPriority="high" />
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight text-[#080808]">As-Sakinah</span>
              <span className="text-[#00AA5B] font-bold text-xs tracking-wider uppercase leading-none">Mart</span>
            </div>
          </div>

          {/* Search Bar - Dibuat besar agar mudah digunakan oleh target pengguna */}
          <div className="flex-1 max-w-xl relative">
            <input
              type="text"
              placeholder="Cari beras, minyak goreng, sabun, dll..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F9FAFB] text-[#080808] pl-10 pr-4 py-2 rounded-md border border-[#B3BBC9] focus:outline-none focus:border-[#00AA5B] focus:ring-2 focus:ring-[#00AA5B]/20 text-sm font-semibold transition"
            />
            <Search className="absolute left-3 top-2.5 text-[#6B7280]" size={18} />
          </div>

          {/* Cart & Profile Controls */}
          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={() => toast.info('Membuka halaman Keranjang Saya')}
              className="relative p-2 text-[#080808] hover:text-[#00AA5B] transition rounded-full hover:bg-gray-100"
              aria-label="Keranjang Belanja"
            >
              <ShoppingCart size={22} />
              <span className="absolute -top-1 -right-1 bg-[#E5484D] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                3
              </span>
            </button>
            <button
              onClick={() => toast.info('Membuka Profil Saya')}
              className="flex items-center gap-2 p-1.5 border border-[#B3BBC9] rounded-full md:rounded-md hover:border-[#00AA5B] transition"
              aria-label="Menu Profil"
            >
              <User size={18} className="text-[#080808]" />
              <span className="hidden md:inline text-xs font-bold text-[#080808]">Ibu Fatimah</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 flex flex-col gap-8">
        
        {/* Banner Promo / Hero Section */}
        <section className="bg-gradient-to-r from-emerald-600 to-[#00AA5B] text-white rounded-lg p-6 md:p-8 flex flex-col-reverse md:flex-row items-center justify-between gap-6 shadow-md overflow-hidden relative">
          <div className="flex-1 flex flex-col gap-4 z-10">
            <span className="bg-[#ffeb3b] text-emerald-900 text-xs md:text-sm font-bold px-3 py-1 rounded-full w-fit">
              Promo Spesial Minggu Ini! 🎉
            </span>
            <h1 className="text-2xl md:text-4xl font-bold leading-tight">
              Belanja Sembako Murah, <br className="hidden md:inline" />
              Gratis Ongkir se-Kecamatan!
            </h1>
            <p className="text-sm md:text-base text-emerald-50 font-semibold">
              Tidak perlu capek ke pasar. Pesan hari ini, langsung kami antar sampai depan pintu rumah!
            </p>
            <button 
              onClick={() => toast.info('Membuka Daftar Produk dengan filter diskon')}
              className="mt-2 bg-[#ffeb3b] hover:bg-yellow-400 text-emerald-950 font-bold px-6 py-2.5 rounded-md text-sm md:text-base shadow-lg transition transform active:scale-95 w-fit"
            >
              Lihat Semua Promo
            </button>
          </div>
          <div className="w-40 md:w-56 shrink-0 relative flex justify-center">
            <img src={heroImg} alt="Belanja Praktis" className="w-full h-auto object-contain filter drop-shadow-lg" fetchPriority="high" />
          </div>
        </section>

        {/* Kategori Populer Section */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg md:text-xl font-bold text-[#080808]">Kategori Belanja Populer</h2>
            <button 
              onClick={() => toast.info('Membuka semua kategori')}
              className="text-[#00AA5B] hover:text-[#1BAA62] text-sm font-bold flex items-center gap-1 transition"
            >
              Lihat Semua <ChevronRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {categories.map((category) => (
              <div
                key={category.id}
                role="button"
                tabIndex={0}
                onClick={() => toast.info(`Kategori ${category.name} dipilih`)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    toast.info(`Kategori ${category.name} dipilih`)
                  }
                }}
                className={`border p-4 rounded-md flex flex-col items-center gap-2 cursor-pointer transition transform hover:-translate-y-1 hover:shadow-md ${category.color} focus:outline-none focus:ring-2 focus:ring-[#00AA5B]`}
              >
                <span className="text-3xl" role="img" aria-label={category.name}>{category.icon}</span>
                <span className="text-xs font-bold text-center leading-snug">{category.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Banner Tambahan untuk Membangun Kepercayaan Warga Desa */}
        <section className="bg-white border border-[#E5E7EB] rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-4 shadow-sm">
          <div className="flex items-center gap-3 p-2 border-b md:border-b-0 md:border-r border-[#E5E7EB]">
            <span className="text-3xl">🤝</span>
            <div className="flex flex-col">
              <span className="font-bold text-sm text-[#080808]">Pasti Amanah</span>
              <span className="text-[#6B7280] text-xs font-semibold">Toko offline kami nyata & terpercaya</span>
            </div>
          </div>
          <div className="flex items-center gap-3 p-2 border-b md:border-b-0 md:border-r border-[#E5E7EB]">
            <span className="text-3xl">🚚</span>
            <div className="flex flex-col">
              <span className="font-bold text-sm text-[#080808]">Pengiriman Cepat</span>
              <span className="text-[#6B7280] text-xs font-semibold">Dikirim langsung kurir desa kami</span>
            </div>
          </div>
          <div className="flex items-center gap-3 p-2">
            <span className="text-3xl">💵</span>
            <div className="flex flex-col">
              <span className="font-bold text-sm text-[#080808]">Bisa Bayar di Tempat (COD)</span>
              <span className="text-[#6B7280] text-xs font-semibold">Bayar uang tunai pas barang sampai</span>
            </div>
          </div>
        </section>

        {/* Produk Terlaris / Best Sellers */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h2 className="text-lg md:text-xl font-bold text-[#080808]">Produk Terlaris (Best Seller)</h2>
              <p className="text-xs text-[#6B7280] font-semibold">Sering dibeli tetangga Anda, stok terbatas!</p>
            </div>
            <button 
              onClick={() => toast.info('Membuka Semua Produk')}
              className="text-[#00AA5B] hover:text-[#1BAA62] text-sm font-bold flex items-center gap-1 transition"
            >
              Lihat Semua <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featuredProducts.map((product) => (
              <div 
                key={product.id}
                className="bg-white border border-[#E5E7EB] rounded-md overflow-hidden flex flex-col hover:shadow-md transition group relative"
              >
                {/* Wishlist Button */}
                <button 
                  onClick={() => toast.success(`${product.name} disimpan ke Favorit`)}
                  className="absolute top-2 right-2 p-1.5 bg-white/80 hover:bg-white rounded-full border border-gray-100 text-gray-400 hover:text-red-500 transition z-10"
                  aria-label="Tambah ke Favorit"
                >
                  <Heart size={16} />
                </button>

                {/* Product Image */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => toast.info(`Detail Produk: ${product.name}`)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      toast.info(`Detail Produk: ${product.name}`)
                    }
                  }}
                  className="relative aspect-square w-full bg-gray-100 overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#00AA5B]"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  {product.discount && (
                    <span className="absolute top-2 left-2 bg-[#E5484D] text-white text-[10px] font-bold px-2 py-0.5 rounded-sm">
                      Diskon {product.discount}
                    </span>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-3 flex-1 flex flex-col gap-1.5 justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-[#6B7280] font-bold uppercase tracking-wider">Sembako</span>
                    <h3 
                      onClick={() => toast.info(`Detail Produk: ${product.name}`)}
                      className="text-xs md:text-sm font-bold text-[#080808] line-clamp-2 leading-snug hover:text-[#00AA5B] cursor-pointer"
                    >
                      {product.name}
                    </h3>
                    <span className="text-[10px] text-[#6B7280] font-semibold">Stok {product.stock} {product.unit}</span>
                  </div>

                  <div className="mt-2">
                    {/* Rating & Sold count */}
                    <div className="flex items-center gap-1 text-[11px] text-amber-500 font-semibold mb-1">
                      <Star size={12} fill="currentColor" />
                      <span>{product.rating}</span>
                      <span className="text-gray-300 font-normal">|</span>
                      <span className="text-[#6B7280] font-normal">Terjual {product.sold}+</span>
                    </div>

                    {/* Price Tag */}
                    <div className="flex flex-col">
                      {product.discount && (
                        <span className="text-[10px] text-[#6B7280] line-through">
                          {formatIDR(product.originalPrice)}
                        </span>
                      )}
                      <span className="text-sm md:text-base font-bold text-[#00AA5B]">
                        {formatIDR(product.price)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <div className="px-3 pb-3 pt-0">
                  <button
                    onClick={() => handleAddToCart(product.name)}
                    className="w-full bg-[#00AA5B] hover:bg-[#1BAA62] text-white font-bold text-xs py-2 rounded-md transition transform active:scale-95 flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <ShoppingCart size={14} /> Beli Sekarang
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer Area - Sederhana dan Jelas */}
      <footer className="bg-white border-t border-[#E5E7EB] mt-12 py-8 px-4 text-[#080808]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <img src={logoImg} alt="As-Sakinah Mart Logo" className="h-8 w-8 object-contain" loading="lazy" />
              <span className="font-bold text-base">As-Sakinah Mart</span>
            </div>
            <p className="text-xs text-[#6B7280] font-semibold leading-relaxed">
              Warung kelontong modern keluarga Anda. Menyediakan segala macam kebutuhan harian rumah tangga dengan kualitas terbaik dan harga merakyat.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-bold text-sm">Hubungi Kami</span>
            <ul className="text-xs text-[#6B7280] font-semibold flex flex-col gap-2">
              <li>📞 WhatsApp: 0812-3456-7890</li>
              <li>📍 Alamat Warung: Jalan Utama Desa Mekarjaya No. 42 (Dekat Balai Desa)</li>
              <li>⏰ Buka Setiap Hari: 06:00 - 21:00 WIB</li>
            </ul>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-bold text-sm">Metode Pembayaran</span>
            <div className="flex flex-wrap gap-2 mt-1">
              <span className="bg-gray-100 text-gray-700 text-[10px] font-bold px-2 py-1 rounded-sm border border-gray-200">COD (Bayar di Rumah)</span>
              <span className="bg-gray-100 text-gray-700 text-[10px] font-bold px-2 py-1 rounded-sm border border-gray-200">Transfer Bank</span>
              <span className="bg-gray-100 text-gray-700 text-[10px] font-bold px-2 py-1 rounded-sm border border-gray-200">QRIS (Gopay/OVO/Dana)</span>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto border-t border-gray-100 mt-6 pt-4 text-center text-[11px] text-[#6B7280] font-semibold">
          &copy; {new Date().getFullYear()} As-Sakinah Mart. Dibuat dengan penuh cinta untuk kemakmuran warga desa.
        </div>
      </footer>
    </div>
  )
}
