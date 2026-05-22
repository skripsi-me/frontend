import * as React from 'react'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import { toast } from 'sonner'
import { formatIDR } from '../../utils/format'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { Card } from '../ui/Card'

export interface IProduct {
  id: string
  name: string
  price: number
  originalPrice: number
  discount: string | null
  stock: number
  unit: string
  sold: number
  image: string
  rating: number
}

export interface IProductCardProps {
  product: IProduct
  onAddToCart: (name: string) => void
}

/**
 * @description ProductCard renders a details card for products, complete with photos, badge discounts, price tags, and cart actions.
 * @param {IProductCardProps} props Properties for the ProductCard component.
 * @return {React.JSX.Element} The rendered ProductCard component.
 * @example
 * // Usage:
 * <ProductCard product={productData} onAddToCart={handleAddToCart} />
 */
export default function ProductCard({
  product,
  onAddToCart,
}: IProductCardProps): React.JSX.Element {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    toast.success(`${product.name} disimpan ke Favorit`)
  }

  const handleProductDetailClick = () => {
    toast.info(`Detail Produk: ${product.name}`)
  }

  return (
    <Card className="flex flex-col hover:shadow-md transition group relative h-full">
      {/* Wishlist Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleFavoriteClick}
        className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/80 hover:bg-white rounded-full border border-gray-100 text-gray-400 hover:text-red-500 transition z-10"
        aria-label="Tambah ke Favorit"
      >
        <Heart size={16} />
      </Button>

      {/* Product Image Wrapper */}
      <div
        role="button"
        tabIndex={0}
        onClick={handleProductDetailClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleProductDetailClick()
          }
        }}
        className="relative aspect-square w-full bg-gray-100 overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#00AA5B] rounded-t-md"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
        {product.discount && (
          <Badge
            variant="destructive"
            className="absolute top-2 left-2 px-2 py-0.5 rounded-sm"
          >
            Diskon {product.discount}
          </Badge>
        )}
      </div>

      {/* Product Information Body */}
      <div className="p-3 flex-1 flex flex-col justify-between gap-2">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-[#6B7280] font-bold uppercase tracking-wider">
            Sembako
          </span>
          <h3
            onClick={handleProductDetailClick}
            className="text-xs md:text-sm font-bold text-[#080808] line-clamp-2 leading-snug hover:text-[#00AA5B] cursor-pointer"
          >
            {product.name}
          </h3>
          <span className="text-[10px] text-[#6B7280] font-semibold">
            Stok {product.stock} {product.unit}
          </span>
        </div>

        <div className="mt-auto">
          {/* Rating & Sold Volume */}
          <div className="flex items-center gap-1 text-[11px] text-amber-500 font-semibold mb-1">
            <Star size={12} fill="currentColor" />
            <span>{product.rating}</span>
            <span className="text-gray-300 font-normal">|</span>
            <span className="text-[#6B7280] font-normal">Terjual {product.sold}+</span>
          </div>

          {/* Pricing */}
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

      {/* Purchase Action Button */}
      <div className="px-3 pb-3 pt-0 mt-auto">
        <Button
          onClick={() => onAddToCart(product.name)}
          className="w-full text-xs font-bold py-2 h-9 flex items-center justify-center gap-1.5 shadow-sm rounded-md"
        >
          <ShoppingCart size={14} /> Beli Sekarang
        </Button>
      </div>
    </Card>
  )
}
