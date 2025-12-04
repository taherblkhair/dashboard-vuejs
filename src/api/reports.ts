import { request } from './index'

export async function fetchStockReport(): Promise<{ data: any }> {
  return request(`/reports/stock`)
}

export default {
  fetchStockReport,
}
