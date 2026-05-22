import * as React from 'react'
import { ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import HeroSection from '../../components/shared/HeroSection'
import CategoryCard from '../../components/shared/CategoryCard'
import FeatureCard from '../../components/shared/FeatureCard'
import ProductCard, { type IProduct } from '../../components/shared/ProductCard'
import { Button } from '../../components/ui/Button'

/**
 * @description Komponen halaman utama (Beranda) As-Sakinah Mart yang merender banner promosi, kategori populer, produk terlaris, dan jaminan layanan.
 * @return {React.JSX.Element} Elemen JSX untuk halaman Beranda.
 * @example
 * <Home />
 */
export default function Home(): React.JSX.Element {
  const categories = [
    { id: 1, name: 'Sembako', icon: '🍚', colorClass: 'bg-green-50 text-green-700 border-green-200' },
    { id: 2, name: 'Sayur & Buah', icon: '🍎', colorClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { id: 3, name: 'Alat Dapur', icon: '🍳', colorClass: 'bg-amber-50 text-amber-700 border-amber-200' },
    { id: 4, name: 'Kebutuhan Bayi', icon: '🍼', colorClass: 'bg-blue-50 text-blue-700 border-blue-200' },
    { id: 5, name: 'Sabun & Cuci', icon: '🧼', colorClass: 'bg-purple-50 text-purple-700 border-purple-200' },
    { id: 6, name: 'Bumbu Dapur', icon: '🌶️', colorClass: 'bg-red-50 text-red-700 border-red-200' },
  ]

  const featuredProducts: IProduct[] = [
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

  return (
    <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 flex flex-col gap-8">
      {/* Banner Promo / Hero Section */}
      <HeroSection />

      {/* Kategori Populer Section */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg md:text-xl font-bold text-[#080808]">Kategori Belanja Populer</h2>
          <Button
            variant="link"
            onClick={() => toast.info('Membuka semua kategori')}
            className="text-[#00AA5B] hover:text-[#1BAA62] text-sm font-bold flex items-center gap-1 transition"
          >
            Lihat Semua <ChevronRight size={16} />
          </Button>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              name={category.name}
              icon={category.icon}
              colorClass={category.colorClass}
              onClick={() => toast.info(`Kategori ${category.name} dipilih`)}
            />
          ))}
        </div>
      </section>

      {/* Banner Tambahan untuk Membangun Kepercayaan Warga Desa */}
      <section className="bg-white border border-[#E5E7EB] rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-4 shadow-sm">
        <FeatureCard
          emoji="🤝"
          title="Pasti Amanah"
          description="Toko offline kami nyata & terpercaya"
          className="border-b md:border-b-0 md:border-r border-[#E5E7EB]"
        />
        <FeatureCard
          emoji="🚚"
          title="Pengiriman Cepat"
          description="Dikirim langsung kurir desa kami"
          className="border-b md:border-b-0 md:border-r border-[#E5E7EB]"
        />
        <FeatureCard
          emoji="💵"
          title="Bisa Bayar di Tempat (COD)"
          description="Bayar uang tunai pas barang sampai"
        />
      </section>

      {/* Produk Terlaris / Best Sellers */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-lg md:text-xl font-bold text-[#080808]">Produk Terlaris (Best Seller)</h2>
            <p className="text-xs text-[#6B7280] font-semibold">Sering dibeli tetangga Anda, stok terbatas!</p>
          </div>
          <Button
            variant="link"
            onClick={() => toast.info('Membuka Semua Produk')}
            className="text-[#00AA5B] hover:text-[#1BAA62] text-sm font-bold flex items-center gap-1 transition"
          >
            Lihat Semua <ChevronRight size={16} />
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </section>
    </main>
  )
}
