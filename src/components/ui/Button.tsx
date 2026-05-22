import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '../../utils/cn'

export interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  asChild?: boolean
}

/**
 * @description Button component built using Shadcn UI standards and project design tokens.
 * @param {IButtonProps} props Properties for the Button component.
 * @return {React.JSX.Element} The rendered Button component.
 * @example
 * // Usage:
 * <Button variant="primary" onClick={handleClick}>Click me</Button>
 */
const Button = React.forwardRef<HTMLButtonElement, IButtonProps>(
  ({ className, variant = 'primary', size = 'default', asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    
    // Custom style mappings based on GEMINI.md Design Tokens
    const variants = {
      primary: 'bg-[#00AA5B] text-white hover:bg-[#1BAA62] active:scale-95 shadow-sm',
      secondary: 'bg-[#F4F6F8] text-[#080808] hover:bg-[#E5E7EB] active:scale-95',
      outline: 'bg-white border border-[#B3BBC9] text-[#080808] hover:border-[#00AA5B] hover:bg-gray-50 active:scale-95',
      ghost: 'bg-transparent text-[#080808] hover:bg-gray-100',
      link: 'bg-transparent text-[#00AA5B] hover:underline p-0 h-auto',
    }

    const sizes = {
      default: 'h-10 px-4 py-2 text-sm font-bold',
      sm: 'h-9 px-3 text-xs font-bold',
      lg: 'h-11 px-8 text-base font-bold',
      icon: 'h-10 w-10 p-0 flex items-center justify-center',
    }

    return (
      <Comp
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00AA5B]/20 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button }
