import { request } from './index'
import { BASE_URL } from './index'

export async function fetchOrders(page = 1, params: Record<string, any> = {}) {
	const query: Record<string, any> = { page, ...params }
	const qs = new URLSearchParams()
	Object.keys(query).forEach(k => {
		if (query[k] !== undefined && query[k] !== null) qs.append(k, String(query[k]))
	})

	return request(`/orders?${qs.toString()}`)
}

export default { fetchOrders }

export async function fetchOrder(id: number) {
	if (!id) throw new Error('Missing order id')
	return request(`/orders/${id}`)
}

export async function updateOrderStatus(id: number, status: string) {
	return request(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) })
}

export function getOrderInvoiceUrl(id: number) {
	const base = BASE_URL.replace(/\/+$/, '')
	return base ? `${base}/orders/${id}/invoice` : `/orders/${id}/invoice`
}

export async function createOrder(payload: any) {
	return request(`/orders`, { method: 'POST', body: JSON.stringify(payload) })
}

export async function updateOrder(id: number, payload: any) {
	return request(`/orders/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
}
