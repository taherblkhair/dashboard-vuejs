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

export default { fetchCustomers, fetchCustomer, createCustomer }
