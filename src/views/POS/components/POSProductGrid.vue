<template>
  <div class="h-full">
    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="i in 8" :key="i" class="aspect-square bg-white rounded-2xl shadow-sm animate-pulse flex flex-col p-4 gap-3">
        <div class="h-32 bg-slate-100 rounded-xl w-full"></div>
        <div class="h-4 bg-slate-100 rounded w-3/4"></div>
        <div class="h-4 bg-slate-100 rounded w-1/2"></div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="products.length === 0" class="h-full flex flex-col items-center justify-center text-slate-400">
      <svg class="w-16 h-16 mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
      </svg>
      <p class="font-bold text-lg">لا توجد أصناف مطابقة</p>
    </div>

    <!-- Products Grid -->
    <div v-else class="flex flex-col h-full"> 
      <div class="flex-1 overflow-y-auto pb-20 grid grid-cols-2 lg:grid-cols-4 gap-4 content-start">
        <div 
        v-for="product in products" 
        :key="product.id"
        @click="handleProductClick(product)"
        class="bg-white rounded-2xl p-3 shadow-sm hover:shadow-md transition-all cursor-pointer border border-slate-100 group flex flex-col gap-3 relative overflow-hidden"
      >
        <!-- Image -->
        <div class="aspect-square rounded-xl bg-slate-50 overflow-hidden relative">
           <img 
            :src="getProductImage(product)" 
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-3">
             <span class="text-white text-xs font-bold">إضافة +</span>
          </div>
        </div>

        <!-- Info -->
        <div class="space-y-1">
          <h3 class="font-bold text-slate-800 text-sm line-clamp-2 leading-relaxed">{{ product.name }}</h3>
          <div class="flex items-center justify-between">
            <span class="font-black text-indigo-600">{{ formatPriceRange(product) }}</span>
            <span class="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">{{ product.variants?.length || 0 }} خيارات</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="pagination.last_page > 1" class="flex justify-center items-center gap-2 mt-6 select-none">
      <button
        class="px-3 py-1 rounded-lg border text-sm font-bold"
        :disabled="pagination.current_page === 1"
        @click="changePage(pagination.current_page - 1)"
      >
        السابق
      </button>
      <button
        v-for="page in Math.min(pagination.last_page, 7)"
        :key="page + 'page-btn'"
        class="px-3 py-1 rounded-lg border text-sm font-bold"
        :class="pagination.current_page === page ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 border-slate-200'"
        @click="changePage(page)"
      >
        {{ page }}
      </button>
      <span v-if="pagination.last_page > 7 && pagination.current_page < pagination.last_page - 3">...</span>
      <button
        v-if="pagination.last_page > 7"
        class="px-3 py-1 rounded-lg border text-sm font-bold"
        :class="pagination.current_page === pagination.last_page ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 border-slate-200'"
        @click="changePage(pagination.last_page)"
      >
        {{ pagination.last_page }}
      </button>
      <button
        class="px-3 py-1 rounded-lg border text-sm font-bold"
        :disabled="pagination.current_page === pagination.last_page"
        @click="changePage(pagination.current_page + 1)"
      >
        التالي
      </button>
    </div>

    <POSVariantSelectionModal 
      :isOpen="showModal"
      :product="selectedProduct"
      @close="closeModal"
      @add-to-cart="handleAddToCart"
    />
  </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { fetchProducts } from '../../../api/products'
import type { Product, Variant } from '../../../api/products'
import { usePosStore } from '../../../stores/pos'
import { formatCurrency, resolveProductImage } from '../../../utils/helpers'
import POSVariantSelectionModal from './POSVariantSelectionModal.vue'

const posStore = usePosStore()
const products = ref<Product[]>([])
const loading = ref(false)
const pagination = ref({
  current_page: 1,
  last_page: 1,
  per_page: 15,
  total: 0
})

const showModal = ref(false)
const selectedProduct = ref<Product | null>(null)
let searchTimeout: any = null

const loadProducts = async (page = 1) => {
  loading.value = true
  try {
    const filters: any = {
      is_active: '1'
    }
    
    if (posStore.searchQuery) {
      filters.search = posStore.searchQuery
    }
    
    if (posStore.selectedCategory) {
      filters.category_id = String(posStore.selectedCategory)
    }

    const res = await fetchProducts(page, filters)
    products.value = res.data
    // Update pagination
    if (res.meta) {
      pagination.value = {
        current_page: res.meta.current_page || page,
        last_page: res.meta.last_page || 1,
        per_page: res.meta.per_page || 15,
        total: res.meta.total || 0
      }
    }
  } catch (e) {
    console.error('Failed to load products', e)
  } finally {
    loading.value = false
  }
}

// Custom debounce watch
watch(() => [posStore.searchQuery, posStore.selectedCategory], () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    loadProducts(1) // Reset to page 1 on filter change
  }, 300)
})

const changePage = (page: number) => {
  if (page < 1 || page > pagination.value.last_page) return
  loadProducts(page)
}

onMounted(() => {
  loadProducts(1)
})

const getProductImage = (product: Product) => {
  return resolveProductImage(product)
}

const formatPriceRange = (product: Product) => {
  if (!product.variants || product.variants.length === 0) return formatCurrency(0)
  
  const prices = product.variants.map(v => parseFloat(v.sale_price))
  const min = Math.min(...prices)
  const max = Math.max(...prices)

  if (min === max) return formatCurrency(min)
  return `${formatCurrency(min)}` // Just show starting from or range
}

const handleProductClick = (product: Product) => {
  selectedProduct.value = product
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedProduct.value = null
}

const handleAddToCart = (payload: { product: Product, variant: Variant, quantity: number }) => {
  posStore.addToCart(payload.product, payload.variant, payload.quantity)
  // Optional: Show partial toast or sound effect here
}
</script>
