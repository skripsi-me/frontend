import * as React from 'react'
import { toast } from 'sonner'
import heroImg from '../../assets/hero.png'
import { Button } from '../ui/Button'

/**
 * @description HeroSection displays the promotional banner, highlighting deals and free delivery.
 * @return {React.JSX.Element} The rendered HeroSection banner.
 * @example
 * <HeroSection />
 */
export default function HeroSection(): React.JSX.Element {
  return (
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
        <Button
          onClick={() => toast.info('Membuka Daftar Produk dengan filter diskon')}
          className="mt-2 bg-[#ffeb3b] hover:bg-yellow-400 text-emerald-950 font-bold px-6 py-2.5 rounded-md text-sm md:text-base shadow-lg transition transform active:scale-95 w-fit border-none"
        >
          Lihat Semua Promo
        </Button>
      </div>
      <div className="w-40 md:w-56 shrink-0 relative flex justify-center">
        <img
          src={heroImg}
          alt="Belanja Praktis"
          className="w-full h-auto object-contain filter drop-shadow-lg"
          fetchPriority="high"
        />
      </div>
    </section>
  )
}
