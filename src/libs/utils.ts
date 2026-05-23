import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * @description 
 * @return 
 * @example
 * 
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}