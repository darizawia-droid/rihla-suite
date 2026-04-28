import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combines Tailwind classes with clsx and twMerge.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Optimizes Unsplash URLs by adding resizing parameters.
 * @param url The original Unsplash URL
 * @param width Target width
 * @param quality Image quality (1-100)
 */
export function optimizeImage(url: string | undefined | null, width = 800, quality = 80) {
  if (!url) return ''
  if (url.includes('images.unsplash.com')) {
    // Remove existing parameters and add optimization ones
    const baseUrl = url.split('?')[0]
    return `${baseUrl}?q=${quality}&w=${width}&auto=format&fit=crop`
  }
  return url
}
