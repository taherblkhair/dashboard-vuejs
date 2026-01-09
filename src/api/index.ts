export const BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

type RequestOptions = RequestInit & { query?: Record<string, any> }

async function request(path: string, options: RequestOptions = {}) {
  // normalize headers to a plain object for easy merging
  const headers: Record<string, string> = Object.assign(
    (options.body instanceof FormData) 
      ? { 'Accept': 'application/json' }
      : { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
    (options.headers as Record<string, string>) || {}
  )

  const token = localStorage.getItem('token')
  if (token) headers.Authorization = `Bearer ${token}`

  // If path is an absolute URL, use it directly
  const isAbsolute = /^https?:\/\//i.test(path)

  // Normalize base and path to avoid duplicated slashes or duplicated /api
  const normalizedBase = BASE_URL.replace(/\/+$/, '')
  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  const url = isAbsolute ? path : (normalizedBase ? `${normalizedBase}${normalizedPath}` : normalizedPath)

  const res = await fetch(url, { ...options, headers })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || res.statusText)
  }

  return res.json()
}

export { request }
