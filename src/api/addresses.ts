import { request } from './index'

export async function fetchAddresses(page = 1): Promise<{ data: any[]; meta?: any }> {
  return request(`/addresses?page=${page}`)
}

export default {
  fetchAddresses,
}
