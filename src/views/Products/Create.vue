<template>
  <div dir="rtl" class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <h1 class="text-2xl font-bold mb-2">إضافة منتج جديد</h1>
      <p class="text-sm text-gray-500 mb-4">املأ بيانات المنتج أدناه ثم اضغط حفظ — المنتجات التي تم إضافتها ستظهر في الأسفل.</p>

      <ProductForm
        :categories="categories"
        :loading="saving"
        :key="formKey"
        @save="onSave"
      />
    </div>

    <section class="max-w-3xl mx-auto mt-6">
      <h2 class="text-lg font-semibold mb-3">المنتجات المضافة حديثاً</h2>
      <div v-if="createdProducts.length === 0" class="text-gray-500 p-4 bg-white rounded shadow">لم يتم إضافة منتجات بعد.</div>

      <div v-else class="grid gap-4">
        <div v-for="p in createdProducts" :key="p.id" class="bg-white p-4 rounded shadow flex items-start gap-4">
          <div class="w-12 h-12 rounded-md bg-blue-500 text-white flex items-center justify-center font-bold text-lg">{{ p.name?.charAt(0) }}</div>
          <div class="flex-1">
            <div class="font-semibold">{{ p.name }}</div>
            <div class="text-xs text-gray-500">SKU: {{ p.sku }}</div>
            <div class="text-sm text-gray-600 mt-2">{{ p.description }}</div>
          </div>
          <div class="text-sm text-gray-500">
            <div>المتغيرات: {{ p.variants?.length || 0 }}</div>
            <div class="mt-2">الحالة: <span class="font-medium">{{ p.is_active ? 'نشط' : 'غير نشط' }}</span></div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ProductForm from './ProductForm.vue'
import { fetchCategories, createProduct as apiCreateProduct } from '../../api/products'

const categories = ref<any[]>([])
const saving = ref(false)
const createdProducts = ref<any[]>([])
const formKey = ref<number>(Date.now())

const loadCategories = async () => {
  try {
    const res = await fetchCategories()
    categories.value = res.data || []
  } catch (e) {
    console.error('Failed to load categories', e)
    categories.value = []
  }
}

onMounted(loadCategories)

const onSave = async (payload: any) => {
  saving.value = true
  try {
    const res = await apiCreateProduct(payload)
    const created = res?.data || res
    // push to created list
    createdProducts.value.unshift(created)
    // reset form by changing key
    formKey.value = Date.now()
  } catch (e) {
    console.error('Failed to create product', e)
    // could use toast here
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
</style>
