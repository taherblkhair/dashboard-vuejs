import { request, BASE_URL } from './index'

export async function fetchDeliveries(page = 1, params: Record<string, any> = {}): Promise<any> {
  const qs = new URLSearchParams({ page: String(page), ...Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== null)) }).toString()
  return request(`/deliveries?${qs}`)
}

export async function fetchDelivery(id: number): Promise<any> {
  return request(`/deliveries/${id}`)
}

export async function updateDelivery(id: number, payload: Record<string, any>): Promise<any> {
  return request(`/deliveries/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export async function uploadProof(id: number, file: File): Promise<any> {
  // Use fetch directly so we can send multipart/form-data without forcing JSON content-type
  const isAbsolute = /^https?:\/\//i.test(BASE_URL)
  const normalizedBase = (BASE_URL || '').replace(/\/+$/, '')
  const normalizedPath = `/deliveries/${id}/proof`
  const url = isAbsolute ? `${normalizedBase}${normalizedPath}` : (normalizedBase ? `${normalizedBase}${normalizedPath}` : normalizedPath)

  const token = localStorage.getItem('token')
  const headers: Record<string, string> = {}
  if (token) headers.Authorization = `Bearer ${token}`

  const fd = new FormData()
  fd.append('proof', file)

  const res = await fetch(url, { method: 'POST', headers, body: fd })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || res.statusText)
  }
  return res.json()
}

export default {
  fetchDeliveries,
  fetchDelivery,
  updateDelivery,
  uploadProof,
}

export async function createDeliveryForOrder(orderId: number, payload: Record<string, any>): Promise<any> {
  return request(`/deliveries/orders/${orderId}/deliveries`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function assignRiderToDelivery(id: number, payload: { rider_id: number }): Promise<any> {
  return request(`/deliveries/${id}/assign-rider`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export async function updateDeliveryStatus(id: number, payload: { status: string; notes?: string; location?: string }): Promise<any> {
  return request(`/deliveries/${id}/update-status`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}
