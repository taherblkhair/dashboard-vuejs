import { request } from './index'

export async function fetchCustomers(page = 1) {
  return request(`/customers?page=${page}`)
}

export async function fetchCustomer(id: number) {
  return request(`/customers/${id}`)
}

export async function createCustomer(payload: any) {
  return request(`/customers`, { method: 'POST', body: JSON.stringify(payload) })
}

export async function createCustomerAddress(customerId: number, payload: any) {
  return request(`/customers/${customerId}/addresses`, { method: 'POST', body: JSON.stringify(payload) })
}

export async function setCustomerDefaultAddress(customerId: number, addressId: number) {
  return request(`/customers/${customerId}/addresses/${addressId}/default`, { method: 'POST' })
}

export default { fetchCustomers, fetchCustomer, createCustomer }
