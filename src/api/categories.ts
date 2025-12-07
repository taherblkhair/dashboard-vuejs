import { request } from './index'
import type { Product } from './products'

export interface Category {
  id: number
  name: string
  description?: string
  parent_id?: number | null
  is_active?: boolean
  parent?: Category | null
  children?: Category[]
}

export async function fetchCategories(): Promise<{ data: Category[]; count?: number }> {
  return request(`/categories`)
}

export async function createCategory(payload: Partial<Category>): Promise<{ data: Category }> {
  return request(`/categories`, { method: 'POST', body: JSON.stringify(payload) }) as Promise<{ data: Category }>
}

export async function deleteCategory(id: number): Promise<any> {
  return request(`/categories/${id}`, { method: 'DELETE' })
}

export async function updateCategory(id: number, payload: Partial<Category>): Promise<{ data: Category }> {
  return request(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(payload) }) as Promise<{ data: Category }>
}

export async function fetchCategoryProducts(categoryId: number, page = 1): Promise<{ data: Product[]; count?: number }> {
  return request(`/categories/${categoryId}/products?page=${page}`)
}

export async function fetchCategory(categoryId: number): Promise<{ data: Category } | Category> {
  return request(`/categories/${categoryId}`)
}
