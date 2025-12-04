import { request } from './index'

export async function fetchPurchaseOrders(page = 1) {
  return request(`/purchase-orders?page=${page}`)
}

export async function fetchPurchaseOrder(id: number) {
  return request(`/purchase-orders/${id}`)
}

export async function approvePurchaseOrder(id: number) {
  return request(`/purchase-orders/${id}/approve`, { method: 'POST' })
}

export async function receivePurchaseOrder(id: number, payload: any = {}) {
  return request(`/purchase-orders/${id}/receive`, { method: 'POST', body: JSON.stringify(payload) })
}

export default { fetchPurchaseOrders, fetchPurchaseOrder }
