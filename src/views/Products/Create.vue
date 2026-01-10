<!-- createdProducts.vue -->
<template>
  <div dir="rtl" class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">إدارة الأصناف</h1>
        <p class="text-gray-600">أضف أصناف جديدة وأدر المتغيرات والمخزون</p>
      </div>

      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Left Column - Form -->
        <div class="lg:w-2/3">
          <div class="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
            <div class="flex items-center justify-between mb-8">
              <div>
                <h2 class="text-2xl font-bold text-gray-800">إضافة صنف جديد</h2>
                <p class="text-gray-500 mt-1">املأ بيانات الصنف بالتفصيل للحصول على أفضل نتائج</p>
              </div>
              <div class="flex items-center gap-2">
                <div class="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                  {{ createdProducts.length }} صنف
                </div>
              </div>
            </div>

            <!-- Stepper -->
            <div class="mb-10">
              <div class="flex items-center justify-between relative">
                <!-- Line -->
                <div class="absolute top-4 right-0 left-0 h-0.5 bg-gray-200 z-0"></div>
                <div class="absolute top-4 right-0 h-0.5 bg-blue-600 z-10 transition-all duration-300"
                     :style="{ width: stepperProgress }"></div>
                
                <!-- Steps -->
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
                  <span class="text-xs font-medium"
                        :class="currentStep >= index ? 'text-blue-600' : 'text-gray-400'">
                    {{ step }}
                  </span>
                </div>
              </div>
            </div>

              <!-- Step Content -->
              <div class="transition-all duration-300">
                <!-- Headings / info kept per-step, ProductForm mounted once below -->
                <div v-if="currentStep === 0">
                  <h3 class="text-lg font-semibold text-gray-800 mb-6">البيانات الأساسية</h3>
                </div>

                <div v-else-if="currentStep === 1">
                  <h3 class="text-lg font-semibold text-gray-800 mb-6">المتغيرات</h3>
                  <div class="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
                    <div class="flex items-start gap-3">
                      <div class="text-blue-600 mt-0.5">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                        </svg>
                      </div>
                      <div class="flex-1">
                        <p class="text-sm text-blue-800 font-medium">إدارة المتغيرات</p>
                        <p class="text-xs text-blue-600 mt-1">يمكنك إضافة متغيرات مختلفة للصنف حسب اللون، المقاس، الوزن، وغيرها من الخصائص</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Single mounted ProductForm (always present) -->
                <ProductForm
                  ref="productFormRef"
                  :categories="categories"
                  :loading="saving"
                  :key="formKey"
                  @save="onSave"
                  @next="goToNextStep"
                  @prev="goToPrevStep"
                  :show-next="currentStep < steps.length - 1"
                  :show-prev="currentStep > 0"
                  :current-step="currentStep"
                />

                <!-- Step 3: Review & Submit -->
                <div v-if="currentStep === 2" class="mt-6">
                  <h3 class="text-lg font-semibold text-gray-800 mb-6">مراجعة وتأكيد</h3>
                  <div class="bg-white border border-gray-200 rounded-xl p-6 mb-6">
                    <div class="space-y-6">
                      <!-- Product Summary -->
                      <div>
                        <h4 class="font-medium text-gray-700 mb-4">ملخص الصنف</h4>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <!-- Main Image Preview -->
                          <div class="col-span-1">
                            <div v-if="previewData.main_image" class="aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                              <img :src="getImageUrl(previewData.main_image)" class="w-full h-full object-cover" />
                            </div>
                            <div v-else class="aspect-square rounded-xl flex items-center justify-center bg-gray-50 border border-dashed border-gray-200 text-gray-400 text-xs">
                              لا توجد صورة رئيسية
                            </div>
                          </div>
                          
                          <div class="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="space-y-3">
                              <div class="flex items-center gap-3">
                                <span class="text-gray-500 text-sm w-24">الاسم:</span>
                                <span class="font-medium">{{ previewData.name || 'لم يتم التحديد' }}</span>
                              </div>
                              <div class="flex items-center gap-3">
                                <span class="text-gray-500 text-sm w-24">SKU:</span>
                                <span class="font-mono text-sm">{{ previewData.sku || 'لم يتم التحديد' }}</span>
                              </div>
                              <div class="flex items-center gap-3">
                                <span class="text-gray-500 text-sm w-24">الفئة:</span>
                                <span>{{ getCategoryName(previewData.category_id) || 'لم يتم التحديد' }}</span>
                              </div>
                            </div>
                            <div class="space-y-3">
                              <div class="flex items-center gap-3">
                                <span class="text-gray-500 text-sm w-24">الحالة:</span>
                                <span :class="previewData.is_active ? 'text-green-600' : 'text-red-600'">
                                  {{ previewData.is_active ? 'نشط' : 'غير نشط' }}
                                </span>
                              </div>
                              <div class="flex items-center gap-3">
                                <span class="text-gray-500 text-sm w-24">الوصف:</span>
                                <span class="text-sm truncate block max-w-[150px]">{{ previewData.description || 'لا يوجد وصف' }}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Variants Summary -->
                      <div v-if="previewData.variants && previewData.variants.length > 0">
                        <div class="flex items-center justify-between mb-4">
                          <h4 class="font-medium text-gray-700">المتغيرات ({{ previewData.variants.length }})</h4>
                        </div>
                        <div class="space-y-3">
                          <div v-for="(variant, index) in previewData.variants" :key="index"
                               class="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                            <div class="flex items-center justify-between mb-2">
                              <div class="flex items-center gap-3">
                                <div v-if="variant.image" class="w-10 h-10 rounded bg-gray-100 overflow-hidden border">
                                  <img :src="getImageUrl(variant.image)" class="w-full h-full object-cover" />
                                </div>
                                <div class="font-medium text-sm">{{ variant.sku_variant }}</div>
                              </div>
                              <div class="flex items-center gap-2">
                                <span class="px-2 py-1 text-xs rounded-full"
                                      :class="variant.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                                  {{ variant.is_active ? 'نشط' : 'غير نشط' }}
                                </span>
                              </div>
                            </div>
                            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                              <div>
                                <span class="text-gray-500">سعر الشراء:</span>
                                <span class="font-medium mr-2">{{ variant.purchase_price }} ر.س</span>
                              </div>
                              <div>
                                <span class="text-gray-500">سعر البيع:</span>
                                <span class="font-medium mr-2">{{ variant.sale_price }} ر.س</span>
                              </div>
                              <div v-if="variant.attributes.color">
                                <span class="text-gray-500">اللون:</span>
                                <span class="font-medium mr-2">{{ getColorName(variant.attributes.color) }}</span>
                              </div>
                              <div v-if="variant.attributes.size">
                                <span class="text-gray-500">المقاس:</span>
                                <span class="font-medium mr-2">{{ variant.attributes.size }}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Action Buttons -->
                  <div class="flex justify-between items-center">
                    <button @click="goToPrevStep"
                            class="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                      </svg>
                      السابق
                    </button>
                    <div class="flex gap-3">
                      <button @click="saveAsDraft"
                              :disabled="saving"
                              class="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        حفظ كمسودة
                      </button>
                      <button @click="saveFromForm"
                              :disabled="saving"
                              class="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                        <svg v-if="saving" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                        <span>إضافة الصنف</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
          </div>
        </div>

        <!-- Right Column - Recent Products -->
        <div class="lg:w-1/3">
          <div class="sticky top-8">
            <div class="bg-white rounded-2xl shadow-xl p-6">
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-xl font-bold text-gray-800">الأصناف المضافة حديثاً</h3>
                <button @click="refreshProducts"
                        class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                  </svg>
                </button>
              </div>

              <div v-if="createdProducts.length === 0" 
                   class="text-center py-12">
                <div class="mb-4">
                  <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                    <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
                    </svg>
                  </div>
                </div>
                <p class="text-gray-500">لا توجد أصناف مضافة بعد</p>
                <p class="text-sm text-gray-400 mt-1">ستظهر الأصناف هنا بعد إضافتها</p>
              </div>

              <div v-else class="space-y-4">
                <div v-for="product in createdProducts.slice(0, 5)" :key="product.id"
                     class="group border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                     @click="viewProduct(product.id)">
                  <div class="flex items-start gap-3">
                    <div class="flex-shrink-0">
                      <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold text-lg shadow">
                        {{ product.name?.charAt(0)?.toUpperCase() || 'P' }}
                      </div>
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-start justify-between">
                        <h4 class="font-semibold text-gray-800 truncate">{{ product.name }}</h4>
                        <span class="text-xs px-2 py-1 rounded-full"
                              :class="product.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                          {{ product.is_active ? 'نشط' : 'غير نشط' }}
                        </span>
                      </div>
                      <p class="text-xs text-gray-500 mt-1 truncate">SKU: {{ product.sku }}</p>
                      <div class="flex items-center gap-4 mt-3 text-xs text-gray-600">
                        <div class="flex items-center gap-1">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                          </svg>
                          <span>{{ product.variants?.length || 0 }} متغير</span>
                        </div>
                        <div class="flex items-center gap-1">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                          </svg>
                          <span>{{ formatDate(product.created_at) }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <button v-if="createdProducts.length > 5"
                        @click="showAllProducts = !showAllProducts"
                        class="w-full py-3 text-center text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-xl transition-colors text-sm font-medium">
                  {{ showAllProducts ? 'عرض أقل' : `عرض الكل (${createdProducts.length})` }}
                </button>
              </div>
            </div>

            <!-- Stats -->
            <div class="mt-6 grid grid-cols-2 gap-4">
              <div class="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
                <div class="text-blue-800 text-sm font-medium">إجمالي الأصناف</div>
                <div class="text-2xl font-bold text-blue-900 mt-1">{{ createdProducts.length }}</div>
              </div>
              <div class="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4">
                <div class="text-green-800 text-sm font-medium">الأصناف النشطة</div>
                <div class="text-2xl font-bold text-green-900 mt-1">
                  {{ createdProducts.filter(p => p.is_active).length }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import ProductForm from './ProductForm.vue'
import { fetchCategories, createProduct as apiCreateProduct } from '../../api/products'

const categories = ref<any[]>([])
const saving = ref(false)
const createdProducts = ref<any[]>([])
const formKey = ref<number>(Date.now())
const productFormRef = ref<any>(null)
const currentStep = ref(0)
const showAllProducts = ref(false)
const previewData = ref<any>({})

const steps = ['البيانات الأساسية', 'المتغيرات', 'التأكيد']

// Calculate stepper progress
const stepperProgress = computed(() => {
  const progress = ((currentStep.value + 1) / steps.length) * 100
  return `${progress}%`
})

const loadCategories = async () => {
  try {
    const res = await fetchCategories()
    categories.value = res.data || []
  } catch (e) {
    console.error('Failed to load categories', e)
    categories.value = []
  }
}

const refreshProducts = () => {
  // Here you would typically fetch products from API
  console.log('Refreshing products...')
}

const viewProduct = (id: number) => {
  console.log('Viewing product:', id)
  // Navigate to product detail page
}

const formatDate = (dateString: string) => {
  if (!dateString) return '--'
  const date = new Date(dateString)
  return date.toLocaleDateString('ar-SA')
}

const getCategoryName = (categoryId: string) => {
  const category = categories.value.find(c => c.id == categoryId)
  return category?.name || 'غير محدد'
}

const getColorName = (colorCode: string) => {
  const colors: Record<string, string> = {
    'red': 'أحمر',
    'blue': 'أزرق',
    'black': 'أسود',
    'white': 'أبيض',
    'green': 'أخضر',
    'yellow': 'أصفر'
  }
  return colors[colorCode] || colorCode
}

const getImageUrl = (file: File | string) => {
  if (file instanceof File) {
    return URL.createObjectURL(file)
  }
  return file // If it's already a URL
}

const goToNextStep = async () => {
  if (productFormRef.value) {
    const formData = productFormRef.value.getFormData()
    previewData.value = { ...previewData.value, ...formData }
    
    // Validate current step before proceeding
    if (currentStep.value === 0 && (!formData.name || !formData.sku)) {
      alert('يرجى ملء البيانات الأساسية أولاً')
      return
    }
  }
  
  if (currentStep.value < steps.length - 1) {
    currentStep.value++
  }
}

const goToPrevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

const sanitizePayload = (formData: any) => {
  const data = new FormData()
  
  data.append('sku', formData.sku)
  data.append('name', formData.name)
  if (formData.description) data.append('description', formData.description)
  if (formData.category_id) data.append('category_id', String(formData.category_id))
  data.append('is_active', formData.is_active ? '1' : '0')
  
  if (formData.main_image) {
    data.append('main_image', formData.main_image)
  }
  
  if (formData.images && formData.images.length > 0) {
    formData.images.forEach((img: File, idx: number) => {
      data.append(`images[${idx}]`, img)
    })
  }
  
  if (formData.variants && formData.variants.length > 0) {
    formData.variants.forEach((v: any, idx: number) => {
      data.append(`variants[${idx}][sku_variant]`, v.sku_variant || `${formData.sku}-${idx + 1}`)
      data.append(`variants[${idx}][purchase_price]`, String(v.purchase_price || 0))
      data.append(`variants[${idx}][sale_price]`, String(v.sale_price || 0))
      if (v.expiry_date) data.append(`variants[${idx}][expiry_date]`, v.expiry_date)
      data.append(`variants[${idx}][is_active]`, v.is_active ? '1' : '0')
      
      // Attributes
      if (v.attributes) {
        Object.entries(v.attributes).forEach(([key, val]) => {
          if (val) data.append(`variants[${idx}][attributes][${key}]`, String(val))
        })
      }
      
      // Variant Image
      if (v.image) {
        data.append(`variants[${idx}][image]`, v.image)
      }
    })
  }
  
  return data
}

const saveAsDraft = async () => {
  if (productFormRef.value) {
    const formData = productFormRef.value.getFormData()
    const payload = sanitizePayload(formData)
    payload.append('is_draft', '1')
    await onSave(payload)
  }
}

const onSave = async (payload: any) => {
  saving.value = true
  try {
    const res = await apiCreateProduct(payload)
    const created = res?.data || res
    createdProducts.value.unshift(created)
    formKey.value = Date.now()
    currentStep.value = 0
    previewData.value = {}
    
    // Show success message
    console.log('Product created successfully:', created)
    
  } catch (e) {
    console.error('Failed to create product', e)
  } finally {
    saving.value = false
  }
}

const saveFromForm = async () => {
  // If ProductForm instance is not mounted (e.g. we're on the review step),
  // try to use previewData as a fallback.
  if (!productFormRef.value) {
    if (previewData.value && previewData.value.name && previewData.value.sku) {
      const payload = sanitizePayload(previewData.value)
      await onSave(payload)
      return
    }
    return alert('نموذج الصنف غير متاح')
  }

  // Run validation exposed by ProductForm (validateAll)
  if (typeof productFormRef.value.validateAll === 'function') {
    const ok = await productFormRef.value.validateAll()
    if (!ok) {
      alert('يرجى تصحيح الأخطاء في النموذج قبل الحفظ')
      return
    }
  } else {
    // Fallback: basic checks
    const tmp = productFormRef.value.getFormData()
    if (!tmp.name || !tmp.sku) {
      alert('يرجى ملء الحقول الأساسية للصنف قبل الحفظ')
      return
    }
  }

  const formData = productFormRef.value.getFormData()
  const payload = sanitizePayload(formData)
  await onSave(payload)
}

onMounted(() => {
  loadCategories()
})
</script>

<style scoped>
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>