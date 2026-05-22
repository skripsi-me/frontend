import * as React from 'react'
import { cn } from '../../utils/cn'

export interface IFeatureCardProps {
  emoji: string
  title: string
  description: string
  className?: string
}

/**
 * @description FeatureCard displays a trust/value proposition with an emoji, title, and detailed caption.
 * @param {IFeatureCardProps} props Properties for the FeatureCard component.
 * @return {React.JSX.Element} The rendered FeatureCard component.
 * @example
 * // Usage:
 * <FeatureCard emoji="🤝" title="Pasti Amanah" description="Toko offline kami nyata & terpercaya" />
 */
export default function FeatureCard({
  emoji,
  title,
  description,
  className,
}: IFeatureCardProps): React.JSX.Element {
  return (
    <div className={cn('flex items-center gap-3 p-2', className)}>
      <span className="text-3xl select-none" role="img" aria-label={title}>
        {emoji}
      </span>
      <div className="flex flex-col">
        <span className="font-bold text-sm text-[#080808]">{title}</span>
        <span className="text-[#6B7280] text-xs font-semibold">{description}</span>
      </div>
    </div>
  )
}
