import * as React from 'react'
import { cn } from '../../utils/cn'

export interface IBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'primary' | 'secondary' | 'destructive' | 'outline'
}

/**
 * @description Badge component built using Shadcn UI standards and project design tokens.
 * @param {IBadgeProps} props Properties for the Badge component.
 * @return {React.JSX.Element} The rendered Badge component.
 * @example
 * // Usage:
 * <Badge variant="destructive">Diskon 10%</Badge>
 */
function Badge({ className, variant = 'primary', ...props }: IBadgeProps): React.JSX.Element {
  const variants = {
    primary: 'bg-[#00AA5B] text-white border-transparent',
    secondary: 'bg-[#F4F6F8] text-[#080808] border-transparent',
    destructive: 'bg-[#E5484D] text-white border-transparent',
    outline: 'text-[#080808] border border-[#B3BBC9]',
  }

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-sm border px-2 py-0.5 text-[10px] font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-[#00AA5B]/20',
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
