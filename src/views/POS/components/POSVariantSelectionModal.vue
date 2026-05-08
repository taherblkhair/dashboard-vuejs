<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" @click="close"></div>

    <!-- Modal Card -->
    <div class="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200 flex flex-col max-h-[90vh]">
      <!-- Header -->
      <div class="p-6 border-b border-slate-100 flex items-start gap-4 bg-slate-50/50">
        <div class="w-20 h-20 rounded-2xl bg-white border border-slate-200 p-1 shrink-0 overflow-hidden">
           <img :src="productImage" class="w-full h-full object-contain rounded-xl" />
        </div>
        <div class="flex-1 pt-1">
          <h3 class="text-xl font-black text-slate-900 leading-tight mb-1">{{ product?.name }}</h3>
          <p class="text-sm font-bold text-slate-400">{{ product?.category?.name }}</p>
          <!-- Selected count badge -->
          <div v-if="selectedCount > 0" class="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
            {{ selectedCount }} متغير محدد
          </div>
        </div>
        <button @click="close" class="p-2 text-slate-400 hover:bg-white hover:text-rose-500 rounded-xl transition-all shadow-sm">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <!-- Body / Scrollable -->
      <div class="flex-1 overflow-y-auto p-6 space-y-6">
        
        <!-- Loading State -->
        <div v-if="loading" class="flex flex-col items-center justify-center py-12 gap-4">
          <div class="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p class="text-sm font-bold text-slate-400">جاري تحميل المتغيرات...</p>
        </div>

        <template v-else>
        <!-- Variants Selection -->
        <div v-if="variants.length > 0" class="space-y-3">
          <div class="flex items-center justify-between px-1">
            <label class="text-xs font-black text-slate-400 uppercase tracking-widest">اختر المتغيرات</label>
            <!-- Select all / Deselect all -->
            <button
              @click="toggleSelectAll"
              class="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              {{ isAllSelected ? 'إلغاء تحديد الكل' : 'تحديد الكل' }}
            </button>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              v-for="variant in variants"
              :key="variant.id"
              @click="toggleVariant(variant)"
              class="relative flex items-center gap-3 p-3 rounded-2xl border-2 transition-all text-right group cursor-pointer"
              :class="isSelected(variant.id) ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-100' : 'border-slate-100 hover:border-indigo-200 bg-white'"
            >
              <!-- Variant Image -->
              <div v-if="variant.images && variant.images.length > 0" class="w-16 h-16 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shrink-0">
                <img 
                  :src="getImageUrl(variant.images[0]?.url)" 
                  class="w-full h-full object-cover"
                  :alt="formatAttributes(variant.attributes) || variant.sku_variant"
                />
              </div>
              <!-- Placeholder for variants without images -->
              <div v-else class="w-16 h-16 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-400 shrink-0 border border-slate-200">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
              
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-0.5">
                   <span class="font-bold text-slate-700 text-sm truncate">{{ formatAttributes(variant.attributes) || variant.sku_variant }}</span>
                </div>
                <div class="text-lg font-black text-indigo-600">{{ formatCurrency(variant.sale_price) }}</div>
                
                <!-- Per-variant quantity controls (only when selected) -->
                <div v-if="isSelected(variant.id)" class="flex items-center gap-2 mt-2" @click.stop>
                  <button 
                    @click.stop="decreaseVariantQty(variant.id)" 
                    class="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-500 hover:border-rose-300 hover:text-rose-500 flex items-center justify-center transition-all active:scale-95"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M20 12H4"/></svg>
                  </button>
                  <span class="text-sm font-black text-slate-800 w-8 text-center tabular-nums">{{ getVariantQty(variant.id) }}</span>
                  <button 
                    @click.stop="increaseVariantQty(variant.id)" 
                    class="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm hover:bg-indigo-700 transition-all active:scale-95"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg>
                  </button>
                </div>
              </div>

              <!-- Checkbox indicator -->
              <div class="w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all shrink-0"
                :class="isSelected(variant.id) ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300 group-hover:border-indigo-300'"
              >
                <svg v-if="isSelected(variant.id)" class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
           <p class="text-slate-500 font-bold">لا توجد متغيرات لهذا الصنف</p>
        </div>

        </template>
      </div>

      <!-- Footer / Actions -->
      <div class="p-6 border-t border-slate-100 bg-white flex items-center justify-between gap-6">
        <div class="flex flex-col">
          <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">الإجمالي</span>
          <span class="text-2xl font-black text-slate-900">{{ formatCurrency(totalPrice) }}</span>
        </div>
        <button 
          @click="confirmAdd"
          class="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 transition-transform active:scale-[0.98] disabled:opacity-50 disabled:grayscale"
          :disabled="selectedCount === 0"
        >
          <span>إضافة للسلة ({{ selectedCount }})</span>
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, reactive } from 'vue'
import type { Product, Variant } from '../../../api/products'
import { formatCurrency, formatAttributes, resolveProductImage, getImageUrl } from '../../../utils/helpers'

const props = defineProps<{
  isOpen: boolean
  product: Product | null
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'add-to-cart', payload: { product: Product, variant: Variant, quantity: number }): void
}>()

// Map of variant.id -> quantity (only selected variants are in this map)
const selectedVariants = reactive<Map<number, number>>(new Map())

// Computed
const variants = computed(() => props.product?.variants || [])

const selectedCount = computed(() => selectedVariants.size)

const isAllSelected = computed(() => variants.value.length > 0 && selectedVariants.size === variants.value.length)

const productImage = computed(() => {
  // Show the first selected variant's image, or fallback to product image
  if (selectedVariants.size > 0) {
    const firstSelectedId = [...selectedVariants.keys()][0]
    const firstVariant = variants.value.find(v => v.id === firstSelectedId) || null
    return resolveProductImage(props.product, firstVariant)
  }
  return resolveProductImage(props.product, null)
})

const totalPrice = computed(() => {
  let total = 0
  for (const [variantId, qty] of selectedVariants) {
    const variant = variants.value.find(v => v.id === variantId)
    if (variant) {
      total += parseFloat(variant.sale_price) * qty
    }
  }
  return total
})

// Methods
const isSelected = (variantId: number) => selectedVariants.has(variantId)

const getVariantQty = (variantId: number) => selectedVariants.get(variantId) || 1

const toggleVariant = (variant: Variant) => {
  if (selectedVariants.has(variant.id)) {
    selectedVariants.delete(variant.id)
  } else {
    selectedVariants.set(variant.id, 1)
  }
}

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedVariants.clear()
  } else {
    for (const variant of variants.value) {
      if (!selectedVariants.has(variant.id)) {
        selectedVariants.set(variant.id, 1)
      }
    }
  }
}

const increaseVariantQty = (variantId: number) => {
  const current = selectedVariants.get(variantId) || 1
  selectedVariants.set(variantId, current + 1)
}

const decreaseVariantQty = (variantId: number) => {
  const current = selectedVariants.get(variantId) || 1
  if (current > 1) {
    selectedVariants.set(variantId, current - 1)
  }
}

const close = () => {
  emit('close')
}

const confirmAdd = () => {
  if (!props.product) return
  // Emit one add-to-cart event per selected variant (keeps store API unchanged)
  for (const [variantId, qty] of selectedVariants) {
    const variant = variants.value.find(v => v.id === variantId)
    if (variant) {
      emit('add-to-cart', {
        product: props.product,
        variant: variant,
        quantity: qty
      })
    }
  }
  close()
}

// Watchers
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    // Reset state when opening
    selectedVariants.clear()
    // Auto select first variant if only one exists
    if (variants.value.length === 1 && variants.value[0]) {
      selectedVariants.set(variants.value[0].id, 1)
    }
  }
})
</script>
