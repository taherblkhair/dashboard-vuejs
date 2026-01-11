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

export function formatCurrency(val?: string | number): string {
  if (val === null || val === undefined || val === '') return '0.00 د.ل'
  const num = typeof val === 'number' ? val : Number(String(val))
  if (Number.isNaN(num)) return String(val)
  
  // Using en-US ensures English numerals (0-9)
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
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

export function getImageUrl(url?: string): string {
  if (!url) return ''
  if (url.startsWith('http') || url.startsWith('blob:')) return url
  // If we have a base URL in env, use it but strip /api if present
  const base = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000').replace(/\/api\/?$/, '')
  return `${base}${url.startsWith('/') ? '' : '/'}${url}`
}

export default { formatAttributes, formatCurrency, formatDate, formatTime, formatDateTime, formatNumber, getImageUrl }
