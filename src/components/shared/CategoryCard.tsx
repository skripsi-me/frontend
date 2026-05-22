import * as React from 'react'
import { cn } from '../../utils/cn'

export interface ICategoryCardProps {
  name: string
  icon: string
  colorClass: string
  onClick: () => void
}

/**
 * @description CategoryCard displays a single category option with its emoji icon and custom styling.
 * @param {ICategoryCardProps} props Properties for the CategoryCard component.
 * @return {React.JSX.Element} The rendered CategoryCard component.
 * @example
 * // Usage:
 * <CategoryCard name="Sembako" icon="🍚" colorClass="bg-green-50 text-green-700 border-green-200" onClick={handleCategoryClick} />
 */
export default function CategoryCard({
  name,
  icon,
  colorClass,
  onClick,
}: ICategoryCardProps): React.JSX.Element {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
      className={cn(
        'border p-4 rounded-md flex flex-col items-center gap-2 cursor-pointer transition transform hover:-translate-y-1 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#00AA5B] select-none',
        colorClass
      )}
    >
      <span className="text-3xl" role="img" aria-label={name}>
        {icon}
      </span>
      <span className="text-xs font-bold text-center leading-snug">{name}</span>
    </div>
  )
}
