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
  created_at?: string
  updated_at?: string
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
  created_at?: string
  updated_at?: string
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

export async function fetchProducts(page = 1, filters: { search?: string, category_id?: string, is_active?: string } = {}): Promise<ProductsResponse> {
  const params = new URLSearchParams()
  params.append('page', String(page))
  
  if (filters.search) params.append('search', filters.search)
  if (filters.category_id) params.append('category_id', filters.category_id)
  if (filters.is_active) params.append('is_active', filters.is_active)

  return request(`/products?${params.toString()}`)
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

export async function fetchProductStock(productId: number): Promise<any> {
  // returns { data: { total_stock, total_reserved_stock, total_available_stock, variants: [...] } }
  return request(`/products/${productId}/stock`)
}

export async function fetchProductVariants(search = '', page = 1): Promise<{ data: any[]; meta?: any }> {
  const qs = new URLSearchParams()
  if (search) qs.append('search', String(search))
  qs.append('page', String(page))
  return request(`/product-variants?${qs.toString()}`)
}

export async function searchProducts(q = '', page = 1): Promise<{ data: any[]; meta?: any }> {
  const qs = new URLSearchParams()
  if (q) qs.append('q', String(q))
  qs.append('page', String(page))
  return request(`/products/search?${qs.toString()}`)
}
