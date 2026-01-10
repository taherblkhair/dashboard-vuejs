<template>
  <div dir="rtl" class="min-h-screen bg-slate-50/50 p-4 lg:p-8">
    <div class="max-w-6xl mx-auto space-y-8">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="space-y-1">
          <div class="flex items-center gap-2 text-slate-400 mb-2">
            <button @click="goBack" class="hover:text-indigo-600 transition-colors flex items-center gap-1 font-bold text-xs uppercase tracking-widest">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
              العودة للفئات
            </button>
          </div>
          <h1 class="text-3xl font-black text-slate-900 tracking-tight">آصناف الفئة</h1>
          <p class="text-slate-500 font-medium">قائمة كاملة بالآصناف المندرجة تحت هذه الفئة</p>
        </div>

        <MButton
          variant="secondary"
          size="sm"
          @click="load"
          :loading="loading"
          class="!rounded-xl"
        >
          <template #icon>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
          </template>
          تحديث القائمة
        </MButton>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-24 gap-4">
        <div class="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p class="text-sm font-black text-slate-400 uppercase tracking-widest">جاري تحميل الآصناف...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="products.length === 0" class="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] shadow-sm border border-slate-50 space-y-6">
        <div class="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-200">
          <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
          </svg>
        </div>
        <div class="text-center space-y-2">
          <h3 class="text-xl font-black text-slate-900">المخزن فارغ هنا</h3>
          <p class="text-slate-400 font-medium">لا توجد أصناف مسجلة لهذه الفئة حتى الآن</p>
        </div>
        <MButton variant="primary" size="lg" @click="goBack" class="!rounded-2xl">
          العودة لاختيار فئة أخرى
        </MButton>
      </div>

      <!-- Products Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <MCard 
          v-for="p in products" 
          :key="p.id" 
          class="group !p-0 !rounded-[2.5rem] border-none shadow-sm hover:shadow-xl hover:shadow-indigo-100/50 transition-all duration-500 bg-white overflow-hidden flex flex-col"
        >
          <div class="p-8 space-y-6 flex-1">
            <div class="flex items-start justify-between">
              <div class="space-y-1">
                <p class="text-[10px] font-black text-indigo-600 uppercase tracking-widest leading-none">ID: #{{ p.id }}</p>
                <h3 class="text-xl font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">{{ p.name }}</h3>
              </div>
              <MBadge variant="neutral" class="!rounded-xl !px-3 !py-1 !text-[10px] !font-black uppercase tracking-widest">
                SKU: {{ p.sku }}
              </MBadge>
            </div>

            <p class="text-slate-500 text-sm font-medium leading-relaxed line-clamp-2">
              {{ p.description || 'لا يوجد وصف متاح لهذا الصنف حالياً.' }}
            </p>

            <div class="space-y-3">
              <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">المتغيرات المتاحة</h4>
              <div class="space-y-2">
                <div v-for="v in p.variants.slice(0, 3)" :key="v.id" class="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100/50 group/item hover:bg-white hover:border-indigo-100 transition-all">
                  <div class="space-y-0.5">
                    <p class="text-xs font-black text-slate-700 leading-tight">{{ v.sku_variant }}</p>
                    <p class="text-[10px] font-bold text-slate-400 leading-tight">{{ formatAttributes(v.attributes) }}</p>
                  </div>
                  <div class="text-left font-mono">
                    <p class="text-xs font-black text-indigo-600 tracking-tight">{{ formatCurrency(v.sale_price) }}</p>
                  </div>
                </div>
                <div v-if="p.variants.length > 3" class="text-center">
                   <span class="text-[10px] font-black text-slate-300 uppercase">+ {{ p.variants.length - 3 }} متغيرات إضافية</span>
                </div>
              </div>
            </div>
          </div>

          <div class="p-6 bg-slate-50/50 border-t border-slate-50 mt-auto flex items-center justify-between">
            <div class="flex flex-col">
              <span class="text-[9px] font-black text-slate-400 uppercase tracking-tighter">تاريخ الإضافة</span>
              <span class="text-[11px] font-bold text-slate-600">{{ formatDate(p.created_at) }}</span>
            </div>
            <MButton
              variant="primary"
              size="sm"
              @click="viewProduct(p.id)"
              class="!rounded-xl shadow-md shadow-indigo-100 hover:scale-105 transition-transform"
            >
              عرض التفاصيل
            </MButton>
          </div>
        </MCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchCategoryProducts } from '../../api/categories'
import type { Product } from '../../api/products'
import MCard from '../../components/ui/MCard.vue'
import MButton from '../../components/ui/MButton.vue'
import MBadge from '../../components/ui/MBadge.vue'
import { formatCurrency, formatDate, formatAttributes } from '../../utils/helpers'

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id || 0)

const products = ref<Product[]>([])
const loading = ref(false)

const load = async () => {
  if (!id) return
  loading.value = true
  try {
    const res = await fetchCategoryProducts(id)
    products.value = res?.data || []
  } catch (e) {
    console.error('Failed to fetch category products', e)
  } finally {
    loading.value = false
  }
}

const goBack = () => router.push({ name: 'Categories' })
const viewProduct = (pid: number) => {
  router.push({ name: 'ProductDetails', params: { id: pid } })
}

onMounted(load)
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

