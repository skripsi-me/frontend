import * as React from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Search as SearchIcon, Tag, SlidersHorizontal } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../ui/Dialog'
import { Button } from '../../ui/Button'
import { Input } from '../../ui/Input'
import categoriesData from '../../../datas/categories.json'
import { type ICategory } from '../../../types/ICategory'

export interface ISearchModalProps {
  isOpen: boolean
  onClose: () => void
}

/**
 * @description Search modal component for As-Sakinah Mart.
 * Allows users to search for products using either Normal (exact) or Levenshtein (fuzzy) string matching,
 * filter by category, and navigate to the products list page.
 * @param {ISearchModalProps} props Properties for the SearchModal component.
 * @return {React.JSX.Element} The rendered SearchModal dialog.
 * @example
 * <SearchModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
 */
export function SearchModal({ isOpen, onClose }: ISearchModalProps): React.JSX.Element {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null)
  const [searchAlgo, setSearchAlgo] = React.useState<'normal' | 'levenshtein'>('levenshtein')

  const categories = categoriesData as ICategory[]

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Navigate to products route with query parameters
    navigate({
      to: '/products',
      search: {
        q: searchQuery.trim() || undefined,
        algo: searchAlgo,
        category: selectedCategory || undefined,
      },
    })

    onClose()
  }

  const selectCategory = (categorySlug: string) => {
    setSelectedCategory((prev) => (prev === categorySlug ? null : categorySlug))
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[calc(100%-2rem)] sm:w-full max-w-lg p-5 md:p-6 gap-6 rounded-lg bg-white border border-[#E5E7EB] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base md:text-lg font-bold text-[#080808]">
            Cari Sembako & Kebutuhan Rumah
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSearchSubmit} className="flex flex-col gap-5 w-full">
          {/* Input & Search Button */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Cari beras, minyak goreng, sabun..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-3 h-11 text-sm md:text-base border-[#B3BBC9] focus-visible:border-[#00AA5B]"
                autoFocus
              />
              <SearchIcon
                className="absolute left-3.5 top-3.5 text-[#6B7280]"
                size={18}
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              className="h-11 px-5 text-sm md:text-base font-bold shrink-0 min-h-[44px]"
            >
              Cari
            </Button>
          </div>

          {/* Category Filter */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5 text-xs md:text-sm font-bold text-[#080808]">
              <Tag size={16} className="text-[#6B7280]" />
              <span>Pilih Kategori Produk:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.slug
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => selectCategory(cat.slug)}
                    className={`px-3 py-2 text-xs md:text-sm font-bold rounded-full transition-all border min-h-[44px] md:min-h-[36px] cursor-pointer ${isSelected
                      ? 'bg-[#00AA5B] text-white border-[#00AA5B]'
                      : 'bg-[#F4F6F8] text-[#080808] border-[#E5E7EB] hover:bg-[#E5E7EB]'
                      }`}
                  >
                    {cat.name}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Search Algorithm Selection */}
          <div className="flex flex-col gap-2 border-t border-[#E5E7EB] pt-4">
            <div className="flex items-center gap-1.5 text-xs md:text-sm font-bold text-[#080808]">
              <SlidersHorizontal size={16} className="text-[#6B7280]" />
              <span>Metode Pencarian:</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSearchAlgo('levenshtein')}
                className={`flex flex-col items-center justify-center p-3 rounded-md border text-center transition-all min-h-[44px] cursor-pointer ${searchAlgo === 'levenshtein'
                  ? 'border-[#00AA5B] bg-[#00AA5B]/5 text-[#00AA5B]'
                  : 'border-[#B3BBC9] bg-white text-[#6B7280] hover:bg-[#F9FAFB]'
                  }`}
              >
                <span className="text-sm font-bold">Levenshtein</span>
                <span className="text-[10px] md:text-xs text-neutral-500 mt-0.5">
                  Fuzzy (Toleransi Typo)
                </span>
              </button>
              <button
                type="button"
                onClick={() => setSearchAlgo('normal')}
                className={`flex flex-col items-center justify-center p-3 rounded-md border text-center transition-all min-h-[44px] cursor-pointer ${searchAlgo === 'normal'
                  ? 'border-[#00AA5B] bg-[#00AA5B]/5 text-[#00AA5B]'
                  : 'border-[#B3BBC9] bg-white text-[#6B7280] hover:bg-[#F9FAFB]'
                  }`}
              >
                <span className="text-sm font-bold">Normal</span>
                <span className="text-[10px] md:text-xs text-neutral-500 mt-0.5">
                  Sama Persis Teks
                </span>
              </button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
