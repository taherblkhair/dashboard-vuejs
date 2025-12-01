import { request } from './index'

export interface Category {
  id: number
  name: string
  description?: string
  parent_id?: number | null
  is_active?: boolean
}

export interface Variant {
  id: number
  product_id: number
  sku_variant: string
  attributes: Record<string, any>
  purchase_price: string
  sale_price: string
  expiry_date: string
  is_active: boolean
}

export interface Product {
  id: number
  sku: string
  name: string
  description?: string
  category_id?: number
  is_active: boolean
  category?: Category
  variants: Variant[]
}

export interface ProductsResponse {
  data: Product[]
  meta?: {
    current_page?: number
    last_page?: number
    per_page?: number
    total?: number
  }
}

export async function fetchProducts(page = 1): Promise<ProductsResponse> {
  // use relative endpoints; BASE_URL will include any /api prefix
  return request(`/products?page=${page}`)
}

export async function fetchCategories(): Promise<{ data: Category[] }>
{
  return request(`/categories`)
}

export async function fetchProduct(id: number): Promise<{ data: Product } | Product> {
  return request(`/products/${id}`)
}

export async function createProduct(payload: Partial<Product>): Promise<{ data: Product }> {
  // Expect API to return shape: { data: Product }
  return request(`/products`, { method: 'POST', body: JSON.stringify(payload) }) as Promise<{ data: Product }>
}

export async function deleteProduct(id: number): Promise<{ message?: string } | any> {
  // expect API to respond with a success message or empty body
  return request(`/products/${id}`, { method: 'DELETE' })
}
