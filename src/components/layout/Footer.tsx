import * as React from 'react'
import logoImg from '../../assets/logo.png'

/**
 * @description Footer component for As-Sakinah Mart. Renders contact numbers, address, store hours, and available payment schemes.
 * @return {React.JSX.Element} The rendered Footer layout.
 * @example
 * <Footer />
 */
export default function Footer(): React.JSX.Element {
  return (
    <footer className="bg-white border-t border-[#E5E7EB] mt-auto py-8 px-4 text-[#080808] shrink-0">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* About / Logo */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <img src={logoImg} alt="As-Sakinah Mart Logo" className="h-8 w-8 object-contain" loading="lazy" />
            <span className="font-bold text-base">As-Sakinah Mart</span>
          </div>
          <p className="text-xs text-[#6B7280] font-semibold leading-relaxed">
            Warung kelontong modern keluarga Anda. Menyediakan segala macam kebutuhan harian rumah tangga dengan kualitas terbaik dan harga merakyat.
          </p>
        </div>

        {/* Contacts */}
        <div className="flex flex-col gap-2">
          <span className="font-bold text-sm">Hubungi Kami</span>
          <ul className="text-xs text-[#6B7280] font-semibold flex flex-col gap-2 list-none p-0 m-0">
            <li>📞 WhatsApp: 0812-3456-7890</li>
            <li>📍 Alamat Warung: Jalan Utama Desa Mekarjaya No. 42 (Dekat Balai Desa)</li>
            <li>⏰ Buka Setiap Hari: 06:00 - 21:00 WIB</li>
          </ul>
        </div>

        {/* Payments */}
        <div className="flex flex-col gap-2">
          <span className="font-bold text-sm">Metode Pembayaran</span>
          <div className="flex flex-wrap gap-2 mt-1">
            <span className="bg-gray-100 text-gray-700 text-[10px] font-bold px-2 py-1 rounded-sm border border-gray-200">
              COD (Bayar di Rumah)
            </span>
            <span className="bg-gray-100 text-gray-700 text-[10px] font-bold px-2 py-1 rounded-sm border border-gray-200">
              Transfer Bank
            </span>
            <span className="bg-gray-100 text-gray-700 text-[10px] font-bold px-2 py-1 rounded-sm border border-gray-200">
              QRIS (Gopay/OVO/Dana)
            </span>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-6xl mx-auto border-t border-gray-100 mt-6 pt-4 text-center text-[11px] text-[#6B7280] font-semibold">
        &copy; {new Date().getFullYear()} As-Sakinah Mart. Dibuat dengan penuh cinta untuk kemakmuran warga desa.
      </div>
    </footer>
  )
}
