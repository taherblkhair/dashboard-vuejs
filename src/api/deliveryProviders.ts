import { request } from './index'

export async function fetchDeliveryProviders(page = 1, params: Record<string, any> = {}): Promise<{ data: any; meta?: any }> {
  const qs = new URLSearchParams({ page: String(page), ...Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== null)) }).toString()
  return request(`/delivery-providers?${qs}`)
}

export async function fetchDeliveryProvider(id: number): Promise<{ data: any }> {
  return request(`/delivery-providers/${id}`)
}

export async function createDeliveryProvider(payload: Record<string, any>): Promise<any> {
  return request('/delivery-providers', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export default {
  fetchDeliveryProviders,
  fetchDeliveryProvider,
  createDeliveryProvider,
}
