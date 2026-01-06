/**
 * Centralized constants for the application
 * All status labels, maps and configuration should be defined here
 */

// ============================================
// ORDER STATUS
// ============================================

export const ORDER_STATUSES = {
  DRAFT: 'draft',
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  RETURNED: 'returned',
} as const

export type OrderStatus = typeof ORDER_STATUSES[keyof typeof ORDER_STATUSES]

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  draft: 'مسودة',
  pending: 'قيد الانتظار',
  confirmed: 'معتمد',
  processing: 'قيد التجهيز',
  shipped: 'تم الشحن',
  delivered: 'تم التسليم',
  cancelled: 'ملغي',
  returned: 'معاد',
}

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  draft: 'bg-gray-100 text-gray-600',
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-indigo-100 text-indigo-800',
  shipped: 'bg-blue-100 text-blue-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  returned: 'bg-gray-100 text-gray-800',
}

export const ORDER_STATUS_BADGE_VARIANTS: Record<OrderStatus, 'success' | 'warning' | 'error' | 'neutral' | 'info'> = {
  draft: 'neutral',
  pending: 'warning',
  confirmed: 'info',
  processing: 'info',
  shipped: 'info',
  delivered: 'success',
  cancelled: 'error',
  returned: 'neutral',
}

export const ORDER_VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  draft: ['pending', 'cancelled'],
  pending: ['confirmed', 'cancelled'],
  confirmed: ['processing', 'cancelled'],
  processing: ['delivered', 'cancelled'],
  shipped: ['delivered', 'returned'],
  delivered: ['returned'],
  cancelled: [],
  returned: [],
}

// ============================================
// PAYMENT STATUS
// ============================================

export const PAYMENT_STATUSES = {
  PENDING: 'pending',
  PARTIAL: 'partial',
  PAID: 'paid',
  FAILED: 'failed',
} as const

export type PaymentStatus = typeof PAYMENT_STATUSES[keyof typeof PAYMENT_STATUSES]

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: 'معلق',
  partial: 'جزئي',
  paid: 'مدفوع',
  failed: 'فشل',
}

export const PAYMENT_STATUS_BADGE_VARIANTS: Record<PaymentStatus, 'success' | 'warning' | 'error' | 'neutral'> = {
  pending: 'warning',
  partial: 'warning',
  paid: 'success',
  failed: 'error',
}

// ============================================
// DELIVERY STATUS
// ============================================

export const DELIVERY_STATUSES = {
  PENDING: 'pending',
  ASSIGNED: 'assigned',
  PICKED_UP: 'picked_up',
  IN_TRANSIT: 'in_transit',
  DELIVERED: 'delivered',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  RETURNED: 'returned',
} as const

export type DeliveryStatus = typeof DELIVERY_STATUSES[keyof typeof DELIVERY_STATUSES]

export const DELIVERY_STATUS_LABELS: Record<DeliveryStatus, string> = {
  pending: 'قيد الانتظار',
  assigned: 'معين',
  picked_up: 'لدى المندوب',
  in_transit: 'قيد التوصيل',
  delivered: 'تم التسليم',
  failed: 'فشل التسليم',
  cancelled: 'ملغي',
  returned: 'معاد',
}

export const DELIVERY_STATUS_COLORS: Record<DeliveryStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  assigned: 'bg-blue-100 text-blue-800',
  picked_up: 'bg-indigo-100 text-indigo-800',
  in_transit: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-800',
  returned: 'bg-orange-100 text-orange-800',
}

export const DELIVERY_VALID_TRANSITIONS: Record<DeliveryStatus, DeliveryStatus[]> = {
  pending: ['assigned', 'cancelled'],
  assigned: ['picked_up', 'cancelled'],
  picked_up: ['in_transit', 'failed', 'cancelled'],
  in_transit: ['delivered', 'failed', 'returned'],
  delivered: ['returned'],
  failed: ['assigned'],
  cancelled: [],
  returned: ['assigned'],
}

// ============================================
// PURCHASE ORDER STATUS
// ============================================

export const PURCHASE_ORDER_STATUSES = {
  DRAFT: 'draft',
  PENDING: 'pending',
  APPROVED: 'approved',
  ORDERED: 'ordered',
  PARTIALLY_RECEIVED: 'partially_received',
  RECEIVED: 'received',
  CANCELLED: 'cancelled',
} as const

export type PurchaseOrderStatus = typeof PURCHASE_ORDER_STATUSES[keyof typeof PURCHASE_ORDER_STATUSES]

export const PURCHASE_ORDER_STATUS_LABELS: Record<PurchaseOrderStatus, string> = {
  draft: 'مسودة',
  pending: 'قيد المراجعة',
  approved: 'معتمد',
  ordered: 'تم الطلب',
  partially_received: 'استلام جزئي',
  received: 'مستلم بالكامل',
  cancelled: 'ملغي',
}

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getOrderStatusLabel(status: string): string {
  return ORDER_STATUS_LABELS[status as OrderStatus] || status
}

export function getOrderStatusColor(status: string): string {
  return ORDER_STATUS_COLORS[status as OrderStatus] || 'bg-gray-100 text-gray-800'
}

export function getOrderStatusBadgeVariant(status: string): 'success' | 'warning' | 'error' | 'neutral' | 'info' {
  return ORDER_STATUS_BADGE_VARIANTS[status as OrderStatus] || 'neutral'
}

export function getPaymentStatusLabel(status: string): string {
  return PAYMENT_STATUS_LABELS[status as PaymentStatus] || status
}

export function getPaymentStatusBadgeVariant(status: string): 'success' | 'warning' | 'error' | 'neutral' {
  return PAYMENT_STATUS_BADGE_VARIANTS[status as PaymentStatus] || 'neutral'
}

export function getDeliveryStatusLabel(status: string): string {
  return DELIVERY_STATUS_LABELS[status as DeliveryStatus] || status
}

export function getDeliveryStatusColor(status: string): string {
  return DELIVERY_STATUS_COLORS[status as DeliveryStatus] || 'bg-gray-100 text-gray-800'
}

export function getAllowedOrderTransitions(currentStatus: string): OrderStatus[] {
  return ORDER_VALID_TRANSITIONS[currentStatus as OrderStatus] || []
}

export function getAllowedDeliveryTransitions(currentStatus: string): DeliveryStatus[] {
  return DELIVERY_VALID_TRANSITIONS[currentStatus as DeliveryStatus] || []
}
