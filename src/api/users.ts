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
export async function fetchUsers(page = 1): Promise<any> {
  return request(`/users?page=${page}`)
}

export default {
  fetchUsers,
}
