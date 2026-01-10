import { request } from './index'

export interface User {
  id: number
  name: string
  email?: string
  phone?: string | null
  role_id?: number
  is_active?: boolean
  role?: any
}

// returns paginated users response from API
export async function fetchUsers(page = 1, search = ''): Promise<any> {
  const query = search ? `&search=${search}` : ''
  return request(`/users?page=${page}${query}`)
}

export async function createUser(data: any): Promise<any> {
  return request('/users', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

export async function updateUser(id: number, data: any): Promise<any> {
  return request(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}

export async function deleteUser(id: number): Promise<any> {
  return request(`/users/${id}`, {
    method: 'DELETE'
  })
}

export async function fetchRoles(): Promise<any> {
  return request('/roles')
}

export async function toggleUserStatus(id: number): Promise<any> {
  return request(`/users/${id}/toggle-active`, {
    method: 'PATCH'
  })
}

export default {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  fetchRoles,
}
