import { request } from './index'

export interface Supplier {
  id?: number
  name: string
  contact_name?: string
  phone?: string
  email?: string
  address_id?: number
  tax_number?: string
  payment_terms?: string
  lead_time_days?: number
  is_active?: boolean
  notes?: string | null
  created_at?: string
  updated_at?: string
  address?: any
}

export async function fetchSuppliers(page = 1): Promise<{ data: Supplier[]; meta?: any }> {
  return request(`/suppliers?page=${page}`)
}

export async function createSupplier(payload: Partial<Supplier>): Promise<{ data: Supplier }> {
  return request(`/suppliers`, { method: 'POST', body: JSON.stringify(payload) }) as Promise<{ data: Supplier }>
}

export async function fetchSupplier(id: number): Promise<{ data: Supplier }> {
  return request(`/suppliers/${id}`)
}

export async function updateSupplier(id: number, payload: Partial<Supplier>): Promise<{ data: Supplier }> {
  return request(`/suppliers/${id}`, { method: 'PUT', body: JSON.stringify(payload) }) as Promise<{ data: Supplier }>
}

export async function deleteSupplier(id: number): Promise<any> {
  return request(`/suppliers/${id}`, { method: 'DELETE' })
}

export default {
  fetchSuppliers,
  createSupplier,
}
