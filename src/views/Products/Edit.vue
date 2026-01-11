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
            <!-- Stepper -->
            <div class="mb-10">
              <div class="flex items-center justify-between relative px-2">
                <div class="absolute top-4 right-0 left-0 h-0.5 bg-gray-200 z-0 mx-8"></div>
                <div class="absolute top-4 right-0 h-0.5 bg-blue-600 z-10 transition-all duration-300 mx-8"
                     :style="{ width: stepperProgress }"></div>
                
                <div v-for="(step, index) in steps" :key="index"
                     class="flex flex-col items-center relative z-20 cursor-pointer"
                     @click="currentStep = index">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center mb-2 transition-all"
                       :class="[
                         currentStep >= index 
                           ? 'bg-blue-600 text-white shadow-lg' 
                           : 'bg-gray-100 text-gray-400'
                       ]">
                    <span v-if="currentStep > index">✓</span>
                    <span v-else>{{ index + 1 }}</span>
                  </div>
                  <span class="text-xs font-bold"
                        :class="currentStep >= index ? 'text-blue-600' : 'text-gray-400'">
                    {{ step }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Form -->
            <ProductForm
              ref="productFormRef"
              :categories="categories"
              :loading="saving"
              :initial-data="product"
              @save="onSave"
              @next="currentStep++"
              @prev="currentStep--"
              @goToStep="(s) => currentStep = s"
              :show-next="currentStep < steps.length - 1"
              :show-prev="currentStep > 0"
              :current-step="currentStep"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProductForm from './ProductForm.vue'
import { fetchCategories, fetchProduct, updateProduct, updateProductVariant } from '../../api/products'
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
const currentStep = ref(0)
const steps = ['البيانات الأساسية', 'المتغيرات', 'التسعير']

const stepperProgress = computed(() => {
  return `${(currentStep.value / (steps.length - 1)) * 100}%`
})

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
    
    // Update main product
    await updateProduct(id, payload)
    
    // Update variants via their specific endpoint if they exist
    if (formData.variants && formData.variants.length > 0) {
      const variantPromises = formData.variants.map((v: any) => {
        // Only update if it's an existing variant (has real ID)
        if (v.id && !String(v.id).startsWith('v-')) {
          // Filter attributes to only include non-empty values
          const cleanAttributes: Record<string, any> = {}
          if (v.attributes) {
            Object.entries(v.attributes).forEach(([key, val]) => {
              if (val !== '' && val !== null && val !== undefined) {
                cleanAttributes[key] = val
              }
            })
          }

          const variantPayload = {
            attributes: cleanAttributes,
            purchase_price: Number(v.purchase_price || 0),
            sale_price: Number(v.sale_price || 0),
            expiry_date: v.expiry_date || null,
            is_active: Boolean(v.is_active)
          }

          console.log('Updating variant:', v.id, variantPayload)
          return updateProductVariant(v.id, variantPayload)
        }
        return null
      }).filter(Boolean)
      
      if (variantPromises.length > 0) {
        await Promise.all(variantPromises)
      }
    }
    
    addToast('تم تحديث الصنف بنجاح', 'success')
    router.push({ name: 'ProductDetails', params: { id } })
  } catch (e) {
    console.error('Failed to update product or variants', e)
    addToast('فشل تحديث الصنف والمكونات', 'error')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>
