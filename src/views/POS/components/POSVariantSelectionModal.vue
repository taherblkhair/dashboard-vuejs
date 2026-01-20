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
        </div>
        <button @click="close" class="p-2 text-slate-400 hover:bg-white hover:text-rose-500 rounded-xl transition-all shadow-sm">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <!-- Body / Scrollable -->
      <div class="flex-1 overflow-y-auto p-6 space-y-6">
        
        <!-- Variants Selection -->
        <div v-if="variants.length > 0" class="space-y-3">
          <label class="text-xs font-black text-slate-400 uppercase tracking-widest px-1">اختر المتغير</label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              v-for="variant in variants"
              :key="variant.id"
              @click="selectedVariant = variant"
              class="relative flex items-center gap-3 p-3 rounded-2xl border-2 transition-all text-right group"
              :class="selectedVariant?.id === variant.id ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 hover:border-indigo-200 bg-white'"
            >
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-0.5">
                   <span class="font-bold text-slate-700 text-sm truncate">{{ formatAttributes(variant.attributes) || variant.sku_variant }}</span>
                </div>
                <div class="text-lg font-black text-indigo-600">{{ formatCurrency(variant.sale_price) }}</div>
              </div>
              <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors"
                :class="selectedVariant?.id === variant.id ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'"
              >
                <svg v-if="selectedVariant?.id === variant.id" class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
              </div>
            </button>
          </div>
        </div>

        <div v-else class="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
           <p class="text-slate-500 font-bold">لا توجد متغيرات لهذا الصنف</p>
        </div>

        <!-- Quantity -->
        <div class="space-y-3">
          <label class="text-xs font-black text-slate-400 uppercase tracking-widest px-1">الكمية</label>
          <div class="flex items-center justify-center gap-6 p-4 bg-slate-50 rounded-3xl border border-slate-100 max-w-xs mx-auto">
            <button @click="decreaseQty" class="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 flex items-center justify-center shadow-sm transition-all active:scale-95 disabled:opacity-50">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M20 12H4"/></svg>
            </button>
            <span class="text-3xl font-black text-slate-900 w-16 text-center tabular-nums">{{ quantity }}</span>
            <button @click="increaseQty" class="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg>
            </button>
          </div>
        </div>
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
          :disabled="!selectedVariant"
        >
          <span>إضافة للسلة</span>
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Product, Variant } from '../../../api/products'
import { formatCurrency, formatAttributes, getImageUrl } from '../../../utils/helpers'

const props = defineProps<{
  isOpen: boolean
  product: Product | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'add-to-cart', payload: { product: Product, variant: Variant, quantity: number }): void
}>()

const quantity = ref(1)
const selectedVariant = ref<Variant | null>(null)

// Computed
const variants = computed(() => props.product?.variants || [])

const productImage = computed(() => {
  if (selectedVariant.value?.images?.length && selectedVariant.value.images[0]) {
    // @ts-ignore
    return getImageUrl(selectedVariant.value.images[0].url)
  }
  if (props.product?.images?.length && props.product.images[0]) {
    const main = props.product.images.find(i => i.type === 'main')
    return getImageUrl(main?.url || props.product.images[0].url)
  }
  // Fallback to first variant image if available
  const v = props.product?.variants?.find(v => v.images?.length)
  if (v?.images?.[0]) return getImageUrl(v.images[0].url)
  
  return '/placeholder-product.png'
})

const totalPrice = computed(() => {
  if (!selectedVariant.value) return 0
  return parseFloat(selectedVariant.value.sale_price) * quantity.value
})

// Methods
const increaseQty = () => quantity.value++
const decreaseQty = () => {
  if (quantity.value > 1) quantity.value--
}

const close = () => {
  emit('close')
}

const confirmAdd = () => {
  if (props.product && selectedVariant.value) {
    emit('add-to-cart', {
      product: props.product,
      variant: selectedVariant.value,
      quantity: quantity.value
    })
    close()
  }
}

// Watchers
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    // Reset state when opening
    quantity.value = 1
    // Auto select first variant if only one exists
    if (variants.value.length === 1 && variants.value[0]) {
      selectedVariant.value = variants.value[0]
    } else {
       selectedVariant.value = null
    }
  }
})
</script>
