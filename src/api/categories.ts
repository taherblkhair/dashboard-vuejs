import { request } from './index'
import type { Product } from './products'

export interface CategoryImage {
  id: number
  url: string
  path: string
  type: string
  imageable_type: string
  imageable_id: number
  created_at: string
  updated_at: string
}

export interface Category {
  id: number
  name: string
  description?: string
  parent_id?: number | null
  is_active?: boolean
  parent?: Category | null
  children?: Category[]
  images?: CategoryImage[]
}

export async function fetchCategories(): Promise<{ data: Category[]; count?: number }> {
  return request(`/categories`)
}

export async function createCategory(payload: Partial<Category> | FormData): Promise<{ data: Category }> {
  const body = payload instanceof FormData ? payload : JSON.stringify(payload)
  return request(`/categories`, { method: 'POST', body }) as Promise<{ data: Category }>
}

export async function deleteCategory(id: number): Promise<any> {
  return request(`/categories/${id}`, { method: 'DELETE' })
}

export async function updateCategory(id: number, payload: Partial<Category> | FormData): Promise<{ data: Category }> {
  const body = payload instanceof FormData ? payload : JSON.stringify(payload)
  // If FormData, we might need to spoof PUT via _method if using POST
  const method = payload instanceof FormData ? 'POST' : 'PUT'
  return request(`/categories/${id}`, { method, body }) as Promise<{ data: Category }>
}

export async function fetchCategoryProducts(categoryId: number, page = 1): Promise<{ data: Product[]; count?: number }> {
  return request(`/categories/${categoryId}/products?page=${page}`)
}

export async function fetchCategory(categoryId: number): Promise<{ data: Category } | Category> {
  return request(`/categories/${categoryId}`)
}
