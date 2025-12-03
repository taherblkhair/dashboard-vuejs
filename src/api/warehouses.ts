import { request } from './index'

export interface Address {
  id: number
  owner_type?: string
  owner_id?: number
  city?: string
  area?: string
  street?: string
  building?: string
  notes?: string | null
  created_at?: string
  updated_at?: string
}

export interface Manager {
  id: number
  name: string
  email?: string
  phone?: string | null
  role_id?: number
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

export interface Warehouse {
  id: number
  name: string
  code: string
  manager_id?: number
  phone?: string | null
  email?: string | null
  is_active?: boolean
  capacity?: string
  current_utilization?: string
  notes?: string | null
  created_at?: string
  updated_at?: string
  address?: Address
  manager?: Manager
}

export async function fetchWarehouses(page = 1): Promise<{ data: Warehouse[]; meta?: any }> {
  return request(`/warehouses?page=${page}`)
}

export async function createWarehouse(payload: Partial<Warehouse>): Promise<{ data: Warehouse }> {
  return request(`/warehouses`, { method: 'POST', body: JSON.stringify(payload) }) as Promise<{ data: Warehouse }>
}
