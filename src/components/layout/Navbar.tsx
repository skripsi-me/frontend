import * as React from 'react'
import { Search, ShoppingCart, MapPin, User } from 'lucide-react'
import { toast } from 'sonner'
import logoImg from '../../assets/logo.png'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'

/**
 * @description Navbar component for As-Sakinah Mart. Renders address details, search bar, shopping cart trigger, and profile menu.
 * @return {React.JSX.Element} The rendered Navbar layout.
 * @example
 * <Navbar />
 */
export default function Navbar(): React.JSX.Element {
  const [searchQuery, setSearchQuery] = React.useState('')

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      toast.info(`Mencari produk: "${searchQuery}"`)
    }
  }

  return (
    <div className="w-full flex flex-col font-sans shrink-0">
      {/* Top Address Banner */}
      <div className="bg-[#00AA5B] text-white py-2 px-4 text-sm flex items-center justify-between shadow-sm select-none">
        <div className="flex items-center gap-2 max-w-[80%] md:max-w-none truncate">
          <MapPin size={16} className="shrink-0 text-white" />
          <span className="font-semibold text-xs md:text-sm truncate">
            Kirim ke:{' '}
            <strong
              role="button"
              tabIndex={0}
              className="underline cursor-pointer focus:outline-none focus:ring-1 focus:ring-white rounded-sm"
              onClick={() => toast.info('Mengubah alamat pengiriman')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  toast.info('Mengubah alamat pengiriman')
                }
              }}
            >
              Dusun Karangsari, RT 03/RW 04, Desa Mekarjaya
            </strong>
          </span>
        </div>
        <div className="hidden md:block text-xs font-semibold">
          Belanja Praktis Sembako & Alat Rumah Tangga dari Rumah!
        </div>
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 bg-white border-b border-[#E5E7EB] py-3 px-4 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Brand Name */}
          <div
            role="button"
            tabIndex={0}
            className="flex items-center gap-2 cursor-pointer shrink-0 focus:outline-none focus:ring-2 focus:ring-[#00AA5B]/20 rounded-md p-1"
            onClick={() => {
              window.location.href = '/'
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                window.location.href = '/'
              }
            }}
          >
            <img src={logoImg} alt="As-Sakinah Mart Logo" className="h-10 w-10 object-contain" fetchPriority="high" />
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight text-[#080808]">As-Sakinah</span>
              <span className="text-[#00AA5B] font-bold text-xs tracking-wider uppercase leading-none">Mart</span>
            </div>
          </div>

          {/* Search Bar using Shadcn UI Input */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl relative">
            <Input
              type="text"
              placeholder="Cari beras, minyak goreng, sabun, dll..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 font-semibold text-xs md:text-sm"
            />
            <Search className="absolute left-3 top-2.5 text-[#6B7280]" size={18} />
          </form>

          {/* Cart & Profile Controls */}
          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toast.info('Membuka halaman Keranjang Saya')}
              className="relative rounded-full text-[#080808] hover:text-[#00AA5B]"
              aria-label="Keranjang Belanja"
            >
              <ShoppingCart size={22} />
              <span className="absolute top-1 right-1 bg-[#E5484D] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                3
              </span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.info('Membuka Profil Saya')}
              className="flex items-center gap-2 rounded-full md:rounded-md border-[#B3BBC9] px-2 md:px-3 h-9"
              aria-label="Menu Profil"
            >
              <User size={16} className="text-[#080808]" />
              <span className="hidden md:inline text-xs font-bold text-[#080808]">Ibu Fatimah</span>
            </Button>
          </div>
        </div>
      </header>
    </div>
  )
}
