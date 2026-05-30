export function formatAttributes(attrs: any): string {
  if (!attrs) return ''
  if (typeof attrs === 'string') return attrs
  if (Array.isArray(attrs)) return attrs.join(' / ')
  if (typeof attrs === 'object') {
    try {
      return Object.values(attrs).filter(v => v !== null && v !== undefined).join(' / ')
    } catch {
      return String(attrs)
    }
  }
  return String(attrs)
}

export function formatCurrency(val?: string | number, decimals = 0): string {
  if (val === null || val === undefined || val === '') return `0${decimals > 0 ? '.' + '0'.repeat(decimals) : ''} د.ل`
  const num = typeof val === 'number' ? val : Number(String(val))
  if (Number.isNaN(num)) return String(val)
  
  // Using en-US ensures English numerals (0-9)
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(num)
  
  return `${formatted} د.ل`
}

export function formatDate(iso?: string): string {
  if (!iso) return '-'
  try {
    const date = new Date(iso)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  } catch {
    return iso
  }
}

export function formatTime(iso?: string): string {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  } catch {
    return ''
  }
}

export function formatDateTime(iso?: string): string {
  if (!iso) return '-'
  try {
    const date = new Date(iso)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    const time = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
    return `${day}/${month}/${year} ${time}`
  } catch {
    return iso
  }
}

export function formatNumber(val?: string | number): string {
  if (val === null || val === undefined || val === '') return '0'
  const num = typeof val === 'number' ? val : Number(String(val))
  if (Number.isNaN(num)) return String(val)
  return new Intl.NumberFormat('en-US').format(num)
}

export const PLACEHOLDER_PRODUCT = '/placeholder-product.png'
export const PLACEHOLDER_CATEGORY = '/placeholder-category.png'

import { ASSET_BASE_URL } from '../api/index'

export function getImageUrl(url?: string | null): string {
  if (!url) return ''
  if (url.startsWith('blob:')) return url

  const base = ASSET_BASE_URL.replace(/\/+$/, '')

  // Normalize any /storage/... path through the current asset base (fixes wrong-host legacy URLs)
  const storageMatch = url.match(/\/storage\/(.+)$/)
  if (storageMatch) {
    return `${base}/storage/${storageMatch[1]}`
  }

  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }

  return `${base}${url.startsWith('/') ? '' : '/'}${url}`
}

/** Resolve a File (local preview) or server URL for display in forms. */
export function previewImageSource(source?: File | string | null): string {
  if (!source) return ''
  if (source instanceof File) return URL.createObjectURL(source)
  return getImageUrl(source)
}

export function resolveCategoryImage(category?: { images?: Array<{ url?: string; type?: string }> } | null): string {
  if (!category?.images?.length) return PLACEHOLDER_CATEGORY

  const main = category.images.find((i) => i.type === 'main')
  const url = main?.url || category.images[0]?.url
  return url ? getImageUrl(url) : PLACEHOLDER_CATEGORY
}

export function handleImageError(event: Event, fallback = PLACEHOLDER_PRODUCT): void {
  const img = event.target as HTMLImageElement
  if (!img.src.endsWith(fallback)) {
    img.src = fallback
  }
}

export function resolveProductImage(product: any, variant?: any): string {
  // 1. Try specific variant image
  if (variant?.images?.length && variant.images[0]) {
    return getImageUrl(variant.images[0].url)
  }

  // 2. Try product main image
  if (product?.images?.length) {
    const main = product.images.find((i: any) => i.type === 'main')
    if (main?.url) return getImageUrl(main.url)
    if (product.images[0]?.url) return getImageUrl(product.images[0].url)
  }

  // 3. Fallback: try to find any variant image if product has no images
  if (product?.variants?.length) {
    const v = product.variants.find((v: any) => v.images && v.images.length > 0)
    if (v?.images?.[0]?.url) return getImageUrl(v.images[0].url)
  }

  // 4. Placeholder
  return PLACEHOLDER_PRODUCT
}

export default { formatAttributes, formatCurrency, formatDate, formatTime, formatDateTime, formatNumber, getImageUrl, previewImageSource, resolveCategoryImage, resolveProductImage, handleImageError, PLACEHOLDER_PRODUCT, PLACEHOLDER_CATEGORY }
