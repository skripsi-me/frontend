import * as React from 'react'
import { cn } from '../../utils/cn'

/**
 * @description Card container component.
 * @param {React.HTMLAttributes<HTMLDivElement>} props Card props.
 * @return {React.JSX.Element} The rendered Card container.
 */
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-md border border-[#E5E7EB] bg-white text-[#080808] shadow-sm overflow-hidden',
        className
      )}
      {...props}
    />
  )
)
Card.displayName = 'Card'

/**
 * @description CardHeader component to hold titles and descriptions.
 * @param {React.HTMLAttributes<HTMLDivElement>} props CardHeader props.
 * @return {React.JSX.Element} The rendered CardHeader.
 */
const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 p-6', className)}
      {...props}
    />
  )
)
CardHeader.displayName = 'CardHeader'

/**
 * @description CardTitle component.
 * @param {React.HTMLAttributes<HTMLHeadingElement>} props CardTitle props.
 * @return {React.JSX.Element} The rendered CardTitle.
 */
const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-lg font-bold leading-none tracking-tight text-[#080808]', className)}
      {...props}
    />
  )
)
CardTitle.displayName = 'CardTitle'

/**
 * @description CardDescription component.
 * @param {React.HTMLAttributes<HTMLParagraphElement>} props CardDescription props.
 * @return {React.JSX.Element} The rendered CardDescription.
 */
const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-xs text-[#6B7280] font-semibold', className)}
      {...props}
    />
  )
)
CardDescription.displayName = 'CardDescription'

/**
 * @description CardContent component for primary card content.
 * @param {React.HTMLAttributes<HTMLDivElement>} props CardContent props.
 * @return {React.JSX.Element} The rendered CardContent.
 */
const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
)
CardContent.displayName = 'CardContent'

/**
 * @description CardFooter component.
 * @param {React.HTMLAttributes<HTMLDivElement>} props CardFooter props.
 * @return {React.JSX.Element} The rendered CardFooter.
 */
const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center p-6 pt-0', className)}
      {...props}
    />
  )
)
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
