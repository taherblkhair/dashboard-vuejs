<template>
  <div class="p-6" dir="rtl">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">{{ product?.name || 'تفاصيل المنتج' }}</h1>
        <p class="text-sm text-gray-500">SKU: {{ product?.sku }}</p>
      </div>
      <div>
        <button @click="goBack" class="px-4 py-2 rounded bg-gray-100">العودة</button>
      </div>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
    </div>

    <div v-else>
      <section class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div class="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <p class="text-sm text-gray-500">الفئة</p>
          <p class="text-lg font-semibold text-gray-800">{{ product?.category?.name || '-' }}</p>
        </div>

        <div class="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <p class="text-sm text-gray-500">نطاق السعر</p>
          <p class="text-lg font-semibold text-gray-800">{{ getMinPrice(product?.variants || []) }}$ - {{ getMaxPrice(product?.variants || []) }}$</p>
        </div>

        <div class="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <p class="text-sm text-gray-500">عدد المتغيرات</p>
          <p class="text-lg font-semibold text-gray-800">{{ (product?.variants || []).length }}</p>
        </div>
      </section>

      <section class="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-6">
        <h3 class="text-lg font-semibold mb-2">الوصف</h3>
        <p class="text-gray-600">{{ product?.description || 'لا يوجد وصف' }}</p>
      </section>

      <!-- Stock -->
      <section class="mb-6">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-lg font-semibold">مخزون المنتج</h3>
          <button @click="fetchStock" class="text-sm text-blue-600">تحديث</button>
        </div>

        <div v-if="stockLoading" class="py-6 text-center text-gray-600">جاري جلب بيانات المخزون...</div>

        <div v-else-if="stock && stock.data">
          <div class="grid grid-cols-1 gap-4 md:grid-cols-3 mb-4">
            <div class="rounded-xl border border-blue-200 bg-blue-50 p-5">
              <p class="text-sm text-blue-700">إجمالي المخزون</p>
              <p class="mt-1 text-2xl font-bold text-blue-900">{{ stock.data.total_stock }}</p>
            </div>
            <div class="rounded-xl border border-orange-200 bg-orange-50 p-5">
              <p class="text-sm text-orange-700">المخزون المحجوز</p>
              <p class="mt-1 text-2xl font-bold text-orange-900">{{ stock.data.total_reserved_stock }}</p>
            </div>
            <div class="rounded-xl border border-green-200 bg-green-50 p-5">
              <p class="text-sm text-green-700">المخزون المتاح</p>
              <p class="mt-1 text-2xl font-bold text-green-900">{{ stock.data.total_available_stock }}</p>
            </div>
          </div>

          <div v-if="stock.data.variants && stock.data.variants.length > 0" class="overflow-hidden rounded-xl border border-gray-200">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500">المتغير</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500">SKU</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500">المخزون الكلي</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500">المحجوز</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500">المتاح</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="v in stock.data.variants" :key="v.id">
                  <td class="px-6 py-4">
                    <div class="flex flex-wrap gap-1 justify-end">
                      <span v-for="(val, key) in v.attributes" :key="key" class="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-700">
                        <span class="text-gray-500">{{ key }}:</span>
                        <span class="font-medium">{{ val }}</span>
                      </span>
                    </div>
                  </td>
                  <td class="px-6 py-4"><code class="rounded bg-gray-100 px-2 py-1 font-mono text-sm text-gray-700">{{ v.sku_variant }}</code></td>
                  <td class="px-6 py-4 text-center font-semibold">{{ v.total_stock }}</td>
                  <td class="px-6 py-4 text-center text-orange-600">{{ v.total_reserved_stock }}</td>
                  <td class="px-6 py-4 text-center"><span :class="v.total_available_stock > 0 ? 'text-green-600' : 'text-red-600'">{{ v.total_available_stock }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-else class="rounded-xl border border-gray-200 bg-gray-50 p-6 text-center text-gray-600">لا توجد بيانات مخزون</div>
      </section>

      <!-- Variants list -->
      <section>
        <h3 class="text-lg font-semibold mb-3">المتغيرات</h3>
        <div class="overflow-hidden rounded-xl border border-gray-200">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500">SKU</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500">الخصائص</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500">سعر البيع</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500">الحالة</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="v in product?.variants || []" :key="v.id">
                <td class="px-6 py-4"><code class="rounded bg-gray-100 px-2 py-1 font-mono text-sm text-gray-700">{{ v.sku_variant }}</code></td>
                <td class="px-6 py-4"><div class="flex flex-wrap gap-1"> <span v-for="(val, key) in v.attributes" :key="key" class="inline-block text-xs text-gray-700">{{ key }}: {{ val }}</span></div></td>
                <td class="px-6 py-4 text-right font-semibold">{{ v.sale_price }}$</td>
                <td class="px-6 py-4"><span :class="v.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" class="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium">{{ v.is_active ? 'نشط' : 'غير نشط' }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchProduct as apiFetchProduct, fetchProductStock as apiFetchProductStock } from '../../api/products'
import type { Product } from '../../api/products'

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id)

const product = ref<Product | null>(null)
const loading = ref(true)
const stock = ref<any | null>(null)
const stockLoading = ref(false)

const getMinPrice = (variants: any[]) => {
  if (!variants || variants.length === 0) return 0
  return Math.min(...variants.map(v => parseFloat(String(v.sale_price) || '0')))
}

const getMaxPrice = (variants: any[]) => {
  if (!variants || variants.length === 0) return 0
  return Math.max(...variants.map(v => parseFloat(String(v.sale_price) || '0')))
}

const fetch = async () => {
  loading.value = true
  try {
    const res = await apiFetchProduct(id)
    const payload = (res && (res as any).data) ? (res as any).data : res
    product.value = payload as Product
  } catch (e) {
    console.error('Error fetching product:', e)
  } finally {
    loading.value = false
  }
}

const fetchStock = async () => {
  stockLoading.value = true
  try {
    const res = await apiFetchProductStock(id)
    stock.value = res && (res as any).data ? res : { data: res }
  } catch (e) {
    console.error('Error fetching stock:', e)
    stock.value = { data: null }
  } finally {
    stockLoading.value = false
  }
}

const goBack = () => router.back()

onMounted(async () => {
  await fetch()
  await fetchStock()
})
</script>

<style scoped>
/* Keep page-specific styles minimal; layout uses global Tailwind utilities */
</style>
