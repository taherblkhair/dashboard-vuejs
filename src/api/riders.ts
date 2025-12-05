import { request } from './index'

export async function createRider(payload: Record<string, any>): Promise<any> {
  return request('/riders', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function fetchRiders(page = 1, params: Record<string, any> = {}): Promise<any> {
  const qs = new URLSearchParams({ page: String(page), ...Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== null)) }).toString()
  return request(`/riders?${qs}`)
}

export async function updateRiderLocation(id: number, payload: { current_location: string }): Promise<any> {
  return request(`/riders/${id}/location`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export default {
  createRider,
  fetchRiders,
  updateRiderLocation,
}
