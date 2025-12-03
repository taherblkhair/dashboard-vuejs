import { request } from './index'

export interface StockMovement {
  id?: number
  warehouse_id: number
  product_variant_id: number
  type: 'IN' | 'OUT' | string
  quantity: number
  unit_cost?: number
  note?: string | null
  movement_date?: string // e.g. "2024-01-15 10:00:00"
  created_at?: string
  updated_at?: string
}

/**
 * Create a stock movement (IN / OUT)
 * POST /stock-movements
 */
export async function createStockMovement(payload: Partial<StockMovement>): Promise<{ data: StockMovement }> {
  return request(`/stock-movements`, { method: 'POST', body: JSON.stringify(payload) }) as Promise<{ data: StockMovement }>
}

/**
 * Transfer stock between warehouses
 * POST /stock-movements/transfer
 */
export async function transferStockMovement(payload: Record<string, any>): Promise<{ data: any }> {
  return request(`/stock-movements/transfer`, { method: 'POST', body: JSON.stringify(payload) }) as Promise<{ data: any }>
}

export default {
  createStockMovement,
  transferStockMovement,
}
