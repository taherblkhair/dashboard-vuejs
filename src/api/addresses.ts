import { request } from './index'

export async function fetchAddresses(): Promise<any> {
  // API may return either an array (raw) or a wrapped object { data: [...] }
  const res = await request(`/addresses`)
  // if response is wrapped, return the data array; otherwise return the raw response
  return (res && (res as any).data) ? (res as any).data : res
}

export default {
  fetchAddresses,
}

export async function createAddress(payload: Record<string, any>): Promise<any> {
  return request(`/addresses`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
