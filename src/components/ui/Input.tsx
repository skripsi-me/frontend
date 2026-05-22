import * as React from 'react'
import { cn } from '../../utils/cn'

export interface IInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

/**
 * @description Input component built using Shadcn UI standards and project design tokens.
 * @param {IInputProps} props Properties for the Input component.
 * @return {React.JSX.Element} The rendered Input component.
 * @example
 * // Usage:
 * <Input placeholder="Cari barang..." value={search} onChange={e => setSearch(e.target.value)} />
 */
const Input = React.forwardRef<HTMLInputElement, IInputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-[#B3BBC9] bg-[#F9FAFB] px-3 py-2 text-sm text-[#080808] file:border-0 file:bg-transparent file:text-sm file:font-semibold placeholder:text-[#6B7280] focus-visible:outline-none focus-visible:border-[#00AA5B] focus-visible:ring-2 focus-visible:ring-[#00AA5B]/20 disabled:cursor-not-allowed disabled:opacity-50 transition',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
