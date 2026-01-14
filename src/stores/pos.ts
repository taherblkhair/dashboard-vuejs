import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Product, Variant } from '../api/products'

export interface CartItem {
  id: string // unique ID for cart item (product_id + variant_id + attributes)
  product: Product
  variant: Variant
  quantity: number
  price: number // unit price at time of addition
}

export const usePosStore = defineStore('pos', () => {
  const cart = ref<CartItem[]>([])
  const searchQuery = ref('')
  const selectedCategory = ref<number | null>(null)
  
  // Actions
  const addToCart = (product: Product, variant: Variant, quantity = 1) => {
    const existingItem = cart.value.find(item => item.product.id === product.id && item.variant.id === variant.id)
    
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.value.push({
        id: `${product.id}-${variant.id}`,
        product,
        variant,
        quantity,
        price: Number(variant.sale_price)
      })
    }
  }

  const removeFromCart = (cartItemId: string) => {
    cart.value = cart.value.filter(item => item.id !== cartItemId)
  }

  const updateQuantity = (cartItemId: string, quantity: number) => {
    const item = cart.value.find(i => i.id === cartItemId)
    if (item) {
      item.quantity = quantity
      if (item.quantity <= 0) {
        removeFromCart(cartItemId)
      }
    }
  }

  const clearCart = () => {
    cart.value = []
  }

  // Getters
  const cartTotal = computed(() => {
    return cart.value.reduce((total, item) => total + (item.price * item.quantity), 0)
  })

  const cartItemCount = computed(() => {
    return cart.value.reduce((total, item) => total + item.quantity, 0)
  })

  return {
    cart,
    searchQuery,
    selectedCategory,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    cartItemCount
  }
})
