export const BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

/** Base URL for static assets (storage images). Strips /api from API base. */
export const ASSET_BASE_URL = (() => {
  const fromEnv = import.meta.env.VITE_ASSET_BASE_URL as string | undefined
  if (fromEnv) return fromEnv.replace(/\/+$/, '')

  if (BASE_URL) {
    return BASE_URL.replace(/\/api\/?$/i, '').replace(/\/+$/, '')
  }

  if (import.meta.env.PROD) {
    return 'https://karamstore.ly/sales-system/public'
  }

  return 'http://127.0.0.1:8000'
})()

export class ApiError extends Error {
  status: number
  errors?: Record<string, string[]>

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors
  }
}

export interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

export function parsePaginated<T>(response: unknown): PaginatedResponse<T> {
  const payload = response as PaginatedResponse<T>
  return {
    data: payload.data ?? [],
    meta: payload.meta ?? {
      current_page: 1,
      last_page: 1,
      per_page: payload.data?.length ?? 0,
      total: payload.data?.length ?? 0,
    },
  }
}

type RequestOptions = RequestInit & { query?: Record<string, any> }

async function request(path: string, options: RequestOptions = {}) {
  const headers: Record<string, string> = Object.assign(
    options.body instanceof FormData
      ? { Accept: 'application/json' }
      : {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
    (options.headers as Record<string, string>) || {}
  )

  const token = localStorage.getItem('token')
  if (token) headers.Authorization = `Bearer ${token}`

  const isAbsolute = /^https?:\/\//i.test(path)
  const normalizedBase = BASE_URL.replace(/\/+$/, '')
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const url = isAbsolute ? path : normalizedBase ? `${normalizedBase}${normalizedPath}` : normalizedPath

  const res = await fetch(url, { ...options, headers })

  if (!res.ok) {
    let message = res.statusText
    let errors: Record<string, string[]> | undefined

    try {
      const body = await res.json()
      message = body.message || message
      errors = body.errors
    } catch {
      const text = await res.text()
      if (text) message = text
    }

    throw new ApiError(message, res.status, errors)
  }

  if (res.status === 204) return null

  return res.json()
}

export { request }
