<template>
  <div dir="rtl" class="min-h-screen bg-slate-50/50 p-4 lg:p-8">
    <div class="max-w-[1600px] mx-auto space-y-8">
      <!-- Header Section -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="space-y-1">
          <h1 class="text-3xl font-black text-slate-900 tracking-tight">إدارة المنتجات</h1>
          <p class="text-slate-500 font-medium">عرض وإدارة جميع المنتجات والمخزون في النظام</p>
        </div>

        <div class="flex items-center gap-4">
          <MButton
            variant="primary"
            class="!rounded-2xl shadow-lg shadow-indigo-200"
            @click="() => router.push({ name: 'ProductCreate' })"
          >
            <template #icon>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
            </template>
            إضافة منتج جديد
          </MButton>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MStatsCard
          label="إجمالي المنتجات"
          :value="totalProducts"
          variant="indigo"
        >
          <template #icon>
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
            </svg>
          </template>
        </MStatsCard>

        <MStatsCard
          label="منتجات نشطة"
          :value="activeProducts"
          variant="emerald"
        >
          <template #icon>
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </template>
        </MStatsCard>

        <MStatsCard
          label="إجمالي المتغيرات"
          :value="totalVariants"
          variant="amber"
        >
          <template #icon>
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
            </svg>
          </template>
        </MStatsCard>
      </div>

      <!-- Filters & Table Section -->
      <MCard class="!p-0 !rounded-[2.5rem] border-none shadow-xl shadow-slate-200/50 bg-white overflow-hidden">
        <!-- Filters Area -->
        <div class="p-8 border-b border-slate-50 bg-slate-50/30">
          <div class="flex flex-wrap items-center gap-6">
            <div class="flex-1 min-w-[300px]">
              <MInput
                v-model="searchQuery"
                placeholder="البحث بالاسم أو SKU..."
                class="!rounded-2xl"
              >
                <template #prefix>
                  <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                </template>
              </MInput>
            </div>

            <div class="flex items-center gap-4">
              <select 
                v-model="categoryFilter" 
                class="h-12 px-4 rounded-2xl border-none bg-white shadow-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-sm text-slate-700 min-w-[180px]"
              >
                <option value="">جميع الفئات</option>
                <option v-for="category in categories" :key="category.id" :value="String(category.id)">{{ category.name }}</option>
              </select>

              <select 
                v-model="statusFilter" 
                class="h-12 px-4 rounded-2xl border-none bg-white shadow-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-sm text-slate-700 min-w-[150px]"
              >
                <option value="">جميع الحالات</option>
                <option value="active">نشط</option>
                <option value="inactive">غير نشط</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Table View -->
        <div class="relative min-h-[400px]">
          <div v-if="loading && products.length === 0" class="flex flex-col items-center justify-center py-20 gap-4">
            <div class="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p class="text-sm font-black text-slate-400 uppercase tracking-widest">جاري التحميل...</p>
          </div>
          
          <MTable v-else-if="filteredProducts.length > 0">
            <template #header>
              <th class="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">المعلومات الأساسية</th>
              <th class="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">الفئة</th>
              <th class="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">المتغيرات</th>
              <th class="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">نطاق السعر</th>
              <th class="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">الحالة</th>
              <th class="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest"></th>
            </template>
            
            <tr v-for="item in filteredProducts" :key="item.id" class="group hover:bg-slate-50/50 transition-colors">
              <td class="px-8 py-5">
                <div class="flex items-center gap-4">
                  <div v-if="getProductImageUrl(item)" class="w-14 h-14 rounded-2xl overflow-hidden border border-white shadow-sm shrink-0">
                    <img :src="getProductImageUrl(item)" class="w-full h-full object-cover" />
                  </div>
                  <div v-else class="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-500 font-black text-xl shadow-sm border border-white shrink-0">
                    {{ item.name.charAt(0) }}
                  </div>
                  <div class="space-y-1">
                    <p class="font-bold text-slate-900">{{ item.name }}</p>
                    <p class="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md inline-block">{{ item.sku }}</p>
                  </div>
                </div>
              </td>
              <td class="px-8 py-5">
                <MBadge v-if="item.category" variant="info" class="!px-4 !py-1.5 !rounded-xl">
                  {{ item.category.name }}
                </MBadge>
                <span v-else class="text-slate-300">-</span>
              </td>
              <td class="px-8 py-5">
                <div class="space-y-2">
                  <div class="text-xs font-black text-slate-400 uppercase tracking-widest">
                    {{ item.variants.length }} متغير متاح
                  </div>
                  <div class="flex flex-wrap gap-1.5">
                    <span 
                      v-for="variant in item.variants.slice(0, 2)" 
                      :key="variant.id" 
                      class="px-2 py-1 bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-600 rounded-lg"
                    >
                      {{ formatAttributes(variant.attributes) }}
                    </span>
                    <span v-if="item.variants.length > 2" class="px-2 py-1 bg-indigo-50 text-indigo-500 text-[10px] font-bold rounded-lg border border-indigo-100/50">
                      +{{ item.variants.length - 2 }}
                    </span>
                  </div>
                </div>
              </td>
              <td class="px-8 py-5">
                <div class="space-y-0.5">
                  <p class="text-[10px] font-black text-emerald-500 uppercase">يبدأ من</p>
                  <p class="font-black text-slate-900">{{ formatCurrency(getMinPrice(item.variants)) }}</p>
                </div>
              </td>
              <td class="px-8 py-5">
                <MBadge :variant="item.is_active ? 'success' : 'danger'" class="!px-4 !py-1.5 !rounded-xl">
                  {{ item.is_active ? 'نشط' : 'غير نشط' }}
                </MBadge>
              </td>
              <td class="px-8 py-5">
                <ActionMenu :items="[
                  { label: 'عرض التفاصيل', action: () => viewProductDetails(item), icon: IconEye },
                  { label: 'حذف', action: () => deleteProduct(item), icon: IconTrash, variant: 'danger' }
                ]" />
              </td>
            </tr>
          </MTable>

          <!-- Empty State -->
          <div v-else class="flex flex-col items-center justify-center py-20 px-6 text-center space-y-4">
            <div class="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200 mb-2">
              <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
            </div>
            <div class="space-y-1">
              <h3 class="text-xl font-black text-slate-900">لا توجد منتجات مضافة</h3>
              <p class="text-slate-500">ابدأ بإضافة أول منتج لنظام المخزون الخاص بك</p>
            </div>
            <MButton variant="primary" size="lg" @click="() => router.push({ name: 'ProductCreate' })" class="!rounded-2xl">
              إضافة منتج جديد
            </MButton>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="p-8 border-t border-slate-50 flex items-center justify-between bg-slate-50/30">
          <div class="text-sm font-bold text-slate-500">
            الصفحة <span class="text-indigo-600">{{ currentPage }}</span> من <span class="text-slate-900">{{ totalPages }}</span>
          </div>
          <div class="flex items-center gap-2">
            <MButton
              variant="secondary"
              size="sm"
              :disabled="currentPage === 1"
              @click="changePage(currentPage - 1)"
              class="!rounded-xl group"
            >
              <template #icon>
                <svg class="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </template>
              السابق
            </MButton>
            <MButton
              variant="secondary"
              size="sm"
              :disabled="currentPage === totalPages"
              @click="changePage(currentPage + 1)"
              class="!rounded-xl group flex-row-reverse"
            >
              <template #icon>
                <svg class="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
              </template>
              التالي
            </MButton>
          </div>
        </div>
      </MCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, defineComponent, h } from 'vue'
import { useRouter } from 'vue-router'
import { fetchProducts as apiFetchProducts, fetchCategories, deleteProduct as apiDeleteProduct } from '../../api/products'
import type { Product, Category, Variant } from '../../api/products'
import { formatCurrency, formatAttributes } from '../../utils/helpers'
import ActionMenu from '../../components/ui/ActionMenu.vue'
import MCard from '../../components/ui/MCard.vue'
import MButton from '../../components/ui/MButton.vue'
import MInput from '../../components/ui/MInput.vue'
import MBadge from '../../components/ui/MBadge.vue'
import MTable from '../../components/ui/MTable.vue'
import MStatsCard from '../../components/ui/MStatsCard.vue'

// Icons
const IconEye = defineComponent({ render: () => h('svg', { fill:'none', viewBox:'0 0 24 24', stroke:'currentColor', class:'w-4 h-4' }, [h('path', { 'stroke-linecap':'round', 'stroke-linejoin':'round', 'stroke-width':'2', d:'M15 12a3 3 0 11-6 0 3 3 0 016 0z' }), h('path', { 'stroke-linecap':'round', 'stroke-linejoin':'round', 'stroke-width':'2', d:'M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' })]) })
const IconTrash = defineComponent({ render: () => h('svg', { fill:'none', viewBox:'0 0 24 24', stroke:'currentColor', class:'w-4 h-4' }, [h('path', { 'stroke-linecap':'round', 'stroke-linejoin':'round', 'stroke-width':'2', d:'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' })]) })

const router = useRouter()

// Data State
const products = ref<Product[]>([])
const categories = ref<Category[]>([])
const loading = ref(false)
const searchQuery = ref('')
const categoryFilter = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const totalPages = ref(1)

// Fetch Data
const fetchProducts = async (page: number = 1) => {
  loading.value = true
  try {
    const filters = {
      search: searchQuery.value,
      category_id: categoryFilter.value,
      is_active: statusFilter.value === 'active' ? '1' : (statusFilter.value === 'inactive' ? '0' : undefined)
    }
    const data = await apiFetchProducts(page, filters)
    products.value = data.data || []
    currentPage.value = data.meta?.current_page || 1
    totalPages.value = data.meta?.last_page || 1
  } catch (error) {
    console.error('Error fetching products:', error)
  } finally {
    loading.value = false
  }
}

const fetchAllCategories = async () => {
  try {
    const res = await fetchCategories()
    categories.value = res.data || []
  } catch (e) {
    console.error('Error fetching categories:', e)
  }
}

// Stats
const totalProducts = computed(() => products.value.length)
const activeProducts = computed(() => products.value.filter(p => p.is_active).length)
const totalVariants = computed(() => 
  products.value.reduce((total, product) => total + product.variants.length, 0)
)

// Filtered List - Simplified as server handles filtering now
const filteredProducts = computed(() => products.value)

// Watchers for server-side filtering
import { watch } from 'vue'

let searchTimeout: any = null
watch(searchQuery, () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    fetchProducts(1)
  }, 500)
})

watch([categoryFilter, statusFilter], () => {
  currentPage.value = 1
  fetchProducts(1)
})

// Helpers
const getMinPrice = (variants: Variant[]) => {
  if (!variants || variants.length === 0) return 0
  return Math.min(...variants.map(v => parseFloat(String(v.sale_price) || '0')))
}

const getProductImageUrl = (product: Product): string | undefined => {
  const mainImage = product.images?.find(img => img.type === 'main')
  if (mainImage) {
    const url = mainImage.url
    if (url.startsWith('http')) return url
    // Use the same base as Categories (root domain, usually 8000)
    const baseUrl = 'http://127.0.0.1:8000'
    return `${baseUrl}${url}`
  }
  return undefined
}

const viewProductDetails = (product: Product) => {
  router.push({ name: 'ProductDetails', params: { id: String(product.id) } })
}

const deleteProduct = async (product: Product) => {
  if (!confirm(`هل أنت متأكد من حذف المنتج "${product.name}"؟`)) return

  try {
    await apiDeleteProduct(product.id)
    products.value = products.value.filter(p => p.id !== product.id)
  } catch (e) {
    console.error('Error deleting product:', e)
  }
}

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    fetchProducts(page)
  }
}

onMounted(() => {
  fetchProducts()
  fetchAllCategories()
})
</script>

<style scoped>
/* Scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

::-webkit-scrollbar-track {
  background: transparent;
}
</style>