import * as React from 'react'
import { Link } from '@tanstack/react-router'
import logoImg from '../../assets/logo.png'

/**
 * @description Footer component for As-Sakinah Mart.
 * Renders contact numbers, address, store hours, navigation menu, and available payment schemes.
 * @return {React.JSX.Element} The rendered Footer layout.
 * @example
 * <Footer />
 */
export default function Footer(): React.JSX.Element {
  return (
    <footer className="bg-white border-t border-gray-100 mt-auto py-10 px-4 text-[#080808] shrink-0 font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Section 1: About & Logo */}
        <div className="flex flex-col gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#00AA5B]/20 rounded-md w-fit"
          >
            <img
              src={logoImg}
              alt="As-Sakinah Mart Logo"
              className="h-8 w-8 object-contain"
              loading="lazy"
            />
            <div className="flex items-center gap-1 font-bold text-sm">
              <span className="text-[#080808]">As-Sakinah</span>
              <span className="text-[#00AA5B]">Mart</span>
            </div>
          </Link>
          <p className="text-xs text-[#6B7280] font-semibold leading-relaxed">
            Warung kelontong modern keluarga Anda. Menyediakan segala macam kebutuhan harian rumah tangga dengan kualitas terbaik dan harga merakyat.
          </p>
        </div>

        {/* Section 2: Contacts */}
        <div className="flex flex-col gap-2">
          <span className="font-bold text-sm text-[#080808]">Hubungi Kami</span>
          <ul className="text-xs text-[#6B7280] font-semibold flex flex-col gap-2 list-none p-0 m-0">
            <li>📞 WhatsApp: 0812-3456-7890</li>
            <li>📍 Alamat Warung: Jalan Utama Desa Mekarjaya No. 42 (Dekat Balai Desa)</li>
            <li>⏰ Buka Setiap Hari: 06:00 - 21:00 WIB</li>
          </ul>
        </div>

        {/* Section 3: Navigation Menu */}
        <div className="flex flex-col gap-2">
          <span className="font-bold text-sm text-[#080808]">Menu Utama</span>
          <ul className="text-xs font-semibold flex flex-col gap-2 list-none p-0 m-0">
            <li>
              <Link
                to="/"
                className="text-[#6B7280] hover:text-[#00AA5B] transition-colors focus:outline-none focus:underline"
              >
                Beranda
              </Link>
            </li>
            <li>
              <Link
                to="/products"
                className="text-[#6B7280] hover:text-[#00AA5B] transition-colors focus:outline-none focus:underline"
              >
                Daftar Produk
              </Link>
            </li>
            <li>
              <Link
                to="/cart"
                className="text-[#6B7280] hover:text-[#00AA5B] transition-colors focus:outline-none focus:underline"
              >
                Keranjang Saya
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                className="text-[#6B7280] hover:text-[#00AA5B] transition-colors focus:outline-none focus:underline"
              >
                Profil Saya
              </Link>
            </li>
          </ul>
        </div>

        {/* Section 4: Payments */}
        <div className="flex flex-col gap-2">
          <span className="font-bold text-sm text-[#080808]">Metode Pembayaran</span>
          <div className="flex flex-wrap gap-2 mt-1">
            <span className="bg-[#F4F6F8] text-[#080808] text-[10px] font-bold px-2 py-1 rounded-sm border border-[#E5E7EB]">
              COD (Bayar di Rumah)
            </span>
            <span className="bg-[#F4F6F8] text-[#080808] text-[10px] font-bold px-2 py-1 rounded-sm border border-[#E5E7EB]">
              Transfer Bank
            </span>
            <span className="bg-[#F4F6F8] text-[#080808] text-[10px] font-bold px-2 py-1 rounded-sm border border-[#E5E7EB]">
              QRIS (Gopay/OVO/Dana)
            </span>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-6xl mx-auto border-t border-gray-100 mt-8 pt-6 text-center text-[11px] text-[#6B7280] font-semibold">
        &copy; {new Date().getFullYear()} As-Sakinah Mart. Dibuat dengan penuh cinta untuk kemakmuran warga desa.
      </div>
    </footer>
  )
}
