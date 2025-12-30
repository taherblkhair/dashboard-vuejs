/**
 * Centralized TypeScript type definitions
 * All shared interfaces and types should be defined here
 */

// ============================================
// BASE TYPES
// ============================================

export interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export interface ApiResponse<T> {
  data: T
  meta?: PaginationMeta
  message?: string
}

// ============================================
// CUSTOMER
// ============================================

export interface Address {
  id: number
  city: string
  area: string
  street: string
  building?: string
  floor?: string
  apartment?: string
  notes?: string
  is_default?: boolean
  created_at?: string
}

export interface Customer {
  id: number
  name: string
  email?: string
  phone: string
  phone_secondary?: string
  notes?: string
  addresses?: Address[]
  default_address?: Address
  created_at?: string
  updated_at?: string
}

// ============================================
// PRODUCT
// ============================================

export interface Category {
  id: number
  name: string
  description?: string
  parent_id?: number | null
  is_active?: boolean
}

export interface ProductVariant {
  id: number
  product_id: number
  sku_variant: string
  attributes: Record<string, any>
  purchase_price: string | number
  sale_price: string | number
  expiry_date?: string
  is_active: boolean
  stock?: number
  reserved_stock?: number
  available_stock?: number
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
  variants: ProductVariant[]
  created_at?: string
  updated_at?: string
}

// ============================================
// ORDER
// ============================================

export interface OrderLine {
  id: number
  order_id: number
  product_variant_id: number
  product_variant?: ProductVariant & { product?: Product }
  quantity: number
  unit_price: number
  total_price: number
  discount_amount?: number
  notes?: string
}

export interface Order {
  id: number
  code: string
  customer_id: number
  customer?: Customer
  status: string
  payment_status: string
  order_date: string
  delivery_date?: string
  subtotal: number
  discount_amount?: number
  shipping_fee?: number
  total: number
  total_amount?: number // legacy alias
  notes?: string
  internal_notes?: string
  delivery_address?: Address
  delivery?: Delivery
  lines: OrderLine[]
  created_at?: string
  updated_at?: string
}

// ============================================
// DELIVERY
// ============================================

export interface DeliveryProvider {
  id: number
  name: string
  phone?: string
  email?: string
  pricing_rules?: {
    base_fee?: number
    weight_rate?: number
    distance_rate?: number
    area_fees?: Record<string, number>
  }
  is_active?: boolean
  created_at?: string
}

export interface Rider {
  id: number
  name: string
  phone: string
  email?: string
  provider_id?: number
  provider?: DeliveryProvider
  status: string
  current_location?: string
  is_active?: boolean
  created_at?: string
}

export interface TrackingUpdate {
  id: number
  delivery_id: number
  status: string
  notes?: string
  location?: string
  created_at: string
}

export interface Delivery {
  id: number
  order_id: number
  order?: Order
  provider_id?: number
  provider?: DeliveryProvider
  rider_id?: number
  rider?: Rider
  tracking_number: string
  status: string
  delivery_fee: number
  distance_km?: number
  weight_kg?: number
  estimated_delivery_time?: string
  actual_delivery_time?: string
  proof_of_delivery?: string
  tracking_updates?: TrackingUpdate[]
  created_at?: string
  updated_at?: string
}

// ============================================
// PURCHASE
// ============================================

export interface Supplier {
  id: number
  name: string
  email?: string
  phone?: string
  address?: string
  notes?: string
  is_active?: boolean
  created_at?: string
}

export interface PurchaseOrderLine {
  id: number
  purchase_order_id: number
  product_variant_id: number
  product_variant?: ProductVariant & { product?: Product }
  quantity: number
  unit_price: number
  total_price: number
  received_quantity?: number
}

export interface PurchaseOrder {
  id: number
  code: string
  supplier_id: number
  supplier?: Supplier
  status: string
  order_date: string
  expected_delivery_date?: string
  total_amount: number
  notes?: string
  approved_at?: string
  approved_by?: number
  lines: PurchaseOrderLine[]
  created_at?: string
  updated_at?: string
}

// ============================================
// WAREHOUSE
// ============================================

export interface Warehouse {
  id: number
  name: string
  code: string
  address?: string
  is_active?: boolean
  is_default?: boolean
  created_at?: string
}

export interface StockMovement {
  id: number
  product_variant_id: number
  product_variant?: ProductVariant
  warehouse_id: number
  warehouse?: Warehouse
  type: 'in' | 'out' | 'transfer' | 'adjustment'
  quantity: number
  reference_type?: string
  reference_id?: number
  notes?: string
  created_at?: string
}

// ============================================
// USER & AUTH
// ============================================

export interface User {
  id: number
  name: string
  email: string
  role?: string
  permissions?: string[]
  is_active?: boolean
  created_at?: string
}

export interface AuthState {
  token: string | null
  user: User | null
  loading: boolean
  error: string | null
}
