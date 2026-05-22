import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * @description Helper function to merge Tailwind CSS classes conditionally.
 * @param {ClassValue[]} inputs Array of classes to merge.
 * @return {string} Combined and merged Tailwind classes.
 * @example
 * // Usage:
 * cn('px-2 py-1', isActive && 'bg-green-500', className)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
