<template>
  <div v-if="posStore.cart.length === 0" class="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
    <svg class="w-16 h-16 mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
    </svg>
    <p class="font-bold text-sm">السلة فارغة</p>
  </div>

  <div v-else class="space-y-4 pb-4">
    <div 
      v-for="item in posStore.cart" 
      :key="item.id"
      class="flex items-start gap-3 p-3 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-100 transition-colors group"
    >
      <!-- Thumb -->
      <div class="w-16 h-16 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden shrink-0">
         <img :src="getItemImage(item)" class="w-full h-full object-cover" />
      </div>

      <!-- Info -->
      <div class="flex-1 min-w-0 pt-0.5">
        <h4 class="font-bold text-slate-900 text-sm truncate leading-tight mb-1">{{ item.product.name }}</h4>
        <div class="flex flex-wrap gap-1 mb-2">
           <span v-for="(val, key) in item.variant.attributes" :key="key" class="text-[10px] font-bold text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
             {{ val }}
           </span>
        </div>
        <div class="flex items-center justify-between">
          <div class="text-sm font-black text-indigo-600">{{ formatCurrency(item.price * item.quantity) }}</div>
          
          <!-- Qty Control -->
          <div class="flex items-center gap-3 bg-slate-50 rounded-lg p-1 border border-slate-100">
            <button @click="posStore.updateQuantity(item.id, item.quantity - 1)" class="w-6 h-6 rounded-md bg-white text-slate-500 hover:text-rose-600 shadow-sm flex items-center justify-center transition-colors">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M20 12H4"/></svg>
            </button>
            <span class="text-xs font-bold text-slate-900 w-4 text-center tabular-nums">{{ item.quantity }}</span>
            <button @click="posStore.updateQuantity(item.id, item.quantity + 1)" class="w-6 h-6 rounded-md bg-white text-slate-500 hover:text-indigo-600 shadow-sm flex items-center justify-center transition-colors">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Remove -->
      <button @click="posStore.removeFromCart(item.id)" class="text-slate-300 hover:text-rose-500 -mt-1 -ml-1 p-1 transition-colors opacity-0 group-hover:opacity-100">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePosStore } from '../../../stores/pos'
import { formatCurrency, getImageUrl } from '../../../utils/helpers'
import type { CartItem } from '../../../stores/pos'

const posStore = usePosStore()

const getItemImage = (item: CartItem) => {
  if (item.variant.images?.length && item.variant.images[0]) return getImageUrl(item.variant.images[0].url)
  if (item.product.images?.length && item.product.images[0]) {
      const main = item.product.images.find(i => i.type === 'main')
      return getImageUrl(main?.url || item.product.images[0].url)
  }
  
  // Fallback
  const v = item.product.variants.find(v => v.images && v.images.length > 0)
  if (v?.images?.[0]) return getImageUrl(v.images[0].url)

  return '/placeholder-product.png'
}
</script>
