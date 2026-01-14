<template>
  <div class="h-screen w-screen flex overflow-hidden bg-slate-100" dir="rtl">
    <!-- Right Section: Products Grid (Allocated more space) -->
    <div class="flex-1 flex flex-col h-full overflow-hidden border-l border-slate-200">
      <!-- Top Bar: Search & Filter -->
      <div class="p-4 bg-white border-b border-slate-200 flex items-center gap-4 shadow-sm z-10">
        <div class="relative flex-1">
          <svg class="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input 
            type="text" 
            v-model="posStore.searchQuery"
            placeholder="بحث عن الأصناف..." 
            class="w-full h-12 pr-12 pl-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 font-bold text-slate-700 placeholder-slate-400 transition-all"
          />
        </div>
        <!-- Categories Filter (Simplified for now) -->
        <div class="flex gap-2 overflow-x-auto pb-1 max-w-[40%] custom-scrollbar">
          <button 
            @click="posStore.selectedCategory = null"
            class="px-4 py-2 rounded-xl text-sm font-black whitespace-nowrap transition-colors"
            :class="!posStore.selectedCategory ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'"
          >
            الكل
          </button>
           <button 
            v-for="cat in categories" 
            :key="cat.id"
            @click="posStore.selectedCategory = cat.id"
            class="px-4 py-2 rounded-xl text-sm font-black whitespace-nowrap transition-colors"
            :class="posStore.selectedCategory === cat.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'"
          >
            {{ cat.name }}
          </button>
        </div>
      </div>

      <!-- Products Grid -->
      <div class="flex-1 overflow-y-auto p-4 bg-slate-50/50">
        <POSProductGrid />
      </div>
    </div>

    <!-- Left Section: Cart (Fixed width) -->
    <div class="w-[400px] flex flex-col h-full bg-white shadow-2xl z-20">
      <!-- Order Header -->
      <div class="p-4 border-b border-slate-100 flex items-center justify-between">
        <h2 class="text-xl font-black text-slate-900">سلة الطلب</h2>
        <div class="flex items-center gap-2">
           <button class="p-2 text-slate-400 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 rounded-xl transition-colors" title="إلغاء الطلب" @click="posStore.clearCart">
             <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
           </button>
        </div>
      </div>

      <!-- Cart Items -->
      <div class="flex-1 overflow-y-auto p-4 space-y-3">
        <POSCart />
      </div>

      <!-- Totals & Actions -->
      <div class="p-6 bg-slate-50 border-t border-slate-100 space-y-4">
        <!-- Totals -->
        <div class="space-y-2 text-sm">
           <div class="flex justify-between text-slate-500 font-bold">
             <span>المجموع الفرعي</span>
             <span>{{ formatCurrency(posStore.cartTotal) }}</span>
           </div>
           <div class="flex justify-between text-slate-500 font-bold">
             <span>الضريبة (0%)</span>
             <span>{{ formatCurrency(0) }}</span>
           </div>
           <div class="flex justify-between text-xl font-black text-slate-900 pt-2 border-t border-slate-200 mt-2">
             <span>الإجمالي</span>
             <span>{{ formatCurrency(posStore.cartTotal) }}</span>
           </div>
        </div>

        <!-- Checkout Button -->
        <button 
          @click="handleCheckout"
          class="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black text-lg shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="posStore.cart.length === 0"
        >
          <span>إتمام البيع</span>
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
        </button>
      </div>
    </div>
    
    <!-- Modals -->
    <POSCheckoutModal 
      :is-open="checkoutModalOpen" 
      :cart-total="posStore.cartTotal"
      :cart-count="posStore.cartItemCount"
      @close="checkoutModalOpen = false" 
      @completed="onCheckoutCompleted"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { usePosStore } from '../../stores/pos'
import { fetchCategories } from '../../api/products'
import type { Category } from '../../api/products'
import { formatCurrency } from '../../utils/helpers'
import POSProductGrid from './components/POSProductGrid.vue'
import POSCart from './components/POSCart.vue'
import POSCheckoutModal from './components/POSCheckoutModal.vue'

const posStore = usePosStore()
const categories = ref<Category[]>([])
const checkoutModalOpen = ref(false)

const handleCheckout = () => {
  checkoutModalOpen.value = true
}

const onCheckoutCompleted = () => {
    posStore.clearCart()
}

onMounted(async () => {
  try {
    const res = await fetchCategories()
    categories.value = res.data
  } catch (e) {
    console.error('Failed to fetch categories', e)
  }
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  height: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 100px;
}
</style>
