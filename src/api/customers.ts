import { request } from './index'

export async function fetchCustomers(page = 1, q: string | null = null) {
  let url = `/customers?page=${page}`
  if (q && q.toString().trim() !== '') {
    url += `&search=${encodeURIComponent(q.toString())}`
  }
  return request(url)
}

export async function fetchCustomer(id: number) {
  return request(`/customers/${id}`)
}

export async function createCustomer(payload: any) {
  return request(`/customers`, { method: 'POST', body: JSON.stringify(payload) })
}

export async function updateCustomer(id: number, payload: any) {
  return request(`/customers/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
}

export async function createCustomerAddress(customerId: number, payload: any) {
  return request(`/customers/${customerId}/addresses`, { method: 'POST', body: JSON.stringify(payload) })
}

export async function setCustomerDefaultAddress(customerId: number, addressId: number) {
  return request(`/customers/${customerId}/addresses/${addressId}/default`, { method: 'POST' })
}

export default { fetchCustomers, fetchCustomer, createCustomer }
