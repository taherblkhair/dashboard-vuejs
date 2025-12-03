<template>
  <div class="p-6 bg-gray-50 min-h-screen" dir="rtl">
    <div class="max-w-6xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold">منتجات الفئة</h1>
          <p class="text-sm text-gray-500">عرض المنتجات الخاصة بالفئة المحددة</p>
        </div>
        <div>
          <button @click="goBack" class="px-4 py-2 bg-gray-100 rounded">عودة</button>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-4">
        <template v-if="loading">
          <div class="text-center py-8">جاري التحميل...</div>
        </template>

        <template v-else>
          <div v-if="products.length === 0" class="text-center py-8 text-gray-500">لا توجد منتجات في هذه الفئة</div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="p in products" :key="p.id" class="border rounded-lg p-4 bg-white">
              <div class="flex items-start justify-between">
                <div>
                  <h3 class="font-semibold text-lg">{{ p.name }}</h3>
                  <div class="text-xs text-gray-500">SKU: {{ p.sku }}</div>
                </div>
                <div class="text-sm text-gray-500">#{{ p.id }}</div>
              </div>

              <p class="text-sm text-gray-600 mt-2">{{ p.description || 'لا يوجد وصف' }}</p>

              <div class="mt-3">
                <div class="text-xs text-gray-500">المتغيرات</div>
                <ul class="mt-2 space-y-2">
                  <li v-for="v in p.variants" :key="v.id" class="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <div>
                      <div class="text-sm font-medium">{{ v.sku_variant }}</div>
                      <div class="text-xs text-gray-500">{{ v.attributes?.color ? `لون: ${v.attributes.color}` : '' }} {{ v.attributes?.size ? ` - مقاس: ${v.attributes.size}` : '' }}</div>
                    </div>
                    <div class="text-right">
                      <div class="text-sm text-green-600">${{ v.sale_price }}</div>
                      <div class="text-xs text-gray-500">شراء: ${{ v.purchase_price }}</div>
                    </div>
                  </li>
                </ul>
              </div>

              <div class="mt-4 flex items-center justify-between">
                <button @click="viewProduct(p.id)" class="px-3 py-1 bg-blue-600 text-white rounded">عرض</button>
                <div class="text-xs text-gray-400">تم الإنشاء: {{ formatDate(p.created_at) }}</div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchCategoryProducts } from '../../api/categories'
import type { Product } from '../../api/products'

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

onMounted(load)

const goBack = () => router.back()
const viewProduct = (pid: number) => {
  router.push({ name: 'ProductDetails', params: { id: pid } })
}

const formatDate = (iso?: string) => {
  if (!iso) return ''
  try { return new Date(iso).toLocaleDateString() } catch { return iso }
}
</script>

<style scoped>
/* small local tweaks */
</style>
