<template>
  <div dir="rtl" class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="mb-8 flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-800 mb-2">تعديل الصنف</h1>
          <p class="text-gray-600">تحديث بيانات الصنف والمتغيرات والصور</p>
        </div>
        <MButton variant="secondary" @click="$router.back()" class="!rounded-xl">
          إلغاء
        </MButton>
      </div>

      <div v-if="loading" class="flex flex-col items-center justify-center py-40 gap-6">
        <div class="w-16 h-16 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p class="text-sm font-black text-slate-400 uppercase tracking-widest">جاري تحميل بيانات الصنف...</p>
      </div>

      <div v-else-if="product" class="flex flex-col lg:flex-row gap-8">
        <!-- Main Content -->
        <div class="lg:w-full">
          <div class="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
            <!-- Form -->
            <ProductForm
              ref="productFormRef"
              :categories="categories"
              :loading="saving"
              :initial-data="product"
              :hide-variants="true"
              @save="onSave"
              @close="$router.back()"
              :current-step="0"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProductForm from './ProductForm.vue'
import { fetchCategories } from '../../api/categories'
import { fetchProduct, updateProduct } from '../../api/products'
import MButton from '../../components/ui/MButton.vue'
import { useToast } from '../../composables/useToast'

const route = useRoute()
const router = useRouter()
const { addToast } = useToast()
const id = Number(route.params.id)

const categories = ref<any[]>([])
const product = ref<any>(null)
const loading = ref(true)
const saving = ref(false)

const loadData = async () => {
  try {
    const [catRes, prodRes] = await Promise.all([
      fetchCategories(),
      fetchProduct(id)
    ])
    categories.value = catRes.data || []
    product.value = (prodRes as any).data || prodRes
  } catch (e) {
    console.error('Failed to load data', e)
    addToast('فشل تحميل بيانات الصنف', 'error')
  } finally {
    loading.value = false
  }
}

const onSave = async (formData: any) => {
  saving.value = true
  try {
    const payload = new FormData()
    payload.append('_method', 'PUT')
    payload.append('sku', formData.sku)
    payload.append('name', formData.name)
    if (formData.description) payload.append('description', formData.description)
    if (formData.category_id) payload.append('category_id', String(formData.category_id))
    payload.append('is_active', formData.is_active ? '1' : '0')
    
    if (formData.main_image instanceof File) {
      payload.append('main_image', formData.main_image)
    }
    
    if (formData.images && formData.images.length > 0) {
      formData.images.forEach((img: any, idx: number) => {
        if (img instanceof File) {
          payload.append(`images[${idx}]`, img)
        }
      })
    }
    
    // Update main product details only
    await updateProduct(id, payload)
    
    addToast('تم تحديث بيانات الصنف الأساسية بنجاح', 'success')
    router.push({ name: 'ProductDetails', params: { id } })
  } catch (e) {
    console.error('Failed to update product details', e)
    addToast('فشل تحديث بيانات الصنف', 'error')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>
