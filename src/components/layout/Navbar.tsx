import * as React from 'react'
import { Link } from '@tanstack/react-router'
import { Search, ShoppingCart, MapPin, User } from 'lucide-react'
import logoImg from '../../assets/logo.png'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { useAuthStore } from '../../libs/zustand/authStore'
import { useCartStore } from '../../libs/zustand/cartStore'
import { SearchModal } from './modal/Search'

/**
 * @description Navbar component for As-Sakinah Mart.
 * Renders address info bar, branding logo, search button (opens search modal),
 * shopping cart status, and user profile links.
 * @return {React.JSX.Element} The rendered Navbar layout.
 * @example
 * <Navbar />
 */
export default function Navbar(): React.JSX.Element {
  const { user } = useAuthStore()
  const getTotalItems = useCartStore((state) => state.getTotalItems)
  const [isSearchOpen, setIsSearchOpen] = React.useState(false)

  const cartCount = getTotalItems()
  const addressText = user?.address || 'Alamat Pengiriman'

  return (
    <div className="w-full flex flex-col font-sans shrink-0">
      {/* Top Address Banner (Level 1) */}
      <div className="bg-[#00AA5B] text-white py-2 px-4 text-xs md:text-sm flex items-center justify-between shadow-sm select-none">
        <Link
          to="/profile/edit"
          className="flex items-center gap-2 max-w-[80%] md:max-w-none truncate hover:underline focus:outline-none focus:ring-1 focus:ring-white rounded-sm text-white"
        >
          <MapPin size={16} className="shrink-0 text-white" />
          <span className="font-semibold truncate">
            Kirim ke: <strong className="font-bold">{addressText}</strong>
          </span>
        </Link>
        <div className="hidden md:block text-xs font-semibold">
          Belanja Praktis Sembako & Alat Rumah Tangga dari Rumah!
        </div>
      </div>

      {/* Navigation Header (Level 2) */}
      <header className="sticky top-0 bg-white border-b border-[#E5E7EB] py-3 px-4 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Left Side: Logo & Brand Name */}
          <Link
            to="/"
            className="flex items-center gap-2 cursor-pointer shrink-0 focus:outline-none focus:ring-2 focus:ring-[#00AA5B]/20 rounded-md p-1"
          >
            <img
              src={logoImg}
              alt="As-Sakinah Mart Logo"
              className="h-10 w-10 object-contain"
              fetchPriority="high"
            />
            <div className="flex items-center gap-1">
              <span className="font-bold text-lg leading-none text-[#080808]">
                As-Sakinah
              </span>
              <span className="text-[#00AA5B] font-bold text-lg leading-none">
                Mart
              </span>
            </div>
          </Link>

          {/* Right Side: Search Button, Cart and Profile */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Search Trigger Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(true)}
              className="rounded-full text-[#080808] hover:text-[#00AA5B] min-h-[44px] min-w-[44px]"
              aria-label="Cari Produk"
            >
              <Search size={22} />
            </Button>

            {/* Shopping Cart Button */}
            <Link to="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-full text-[#080808] hover:text-[#00AA5B] min-h-[44px] min-w-[44px]"
                aria-label="Keranjang Belanja"
              >
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-0.5 -right-0.5 px-1.5 py-0.5 rounded-full text-[9px] min-w-[18px] h-[18px] flex items-center justify-center border-2 border-white leading-none font-bold"
                  >
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Profile Button */}
            <Link to="/profile">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 rounded-full md:rounded-md border-[#B3BBC9] px-2 md:px-3 h-9 min-h-[44px] md:min-h-[36px]"
                aria-label="Menu Profil"
              >
                <User size={16} className="text-[#080808]" />
                <span className="hidden md:inline text-xs font-bold text-[#080808] truncate max-w-[100px]">
                  {user?.name || 'Profil'}
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Search Modal Dialog */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  )
}
