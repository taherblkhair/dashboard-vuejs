import { request } from './index'

export async function fetchDashboard(): Promise<any> {
  return request('/dashboard')
}

export default { fetchDashboard }
