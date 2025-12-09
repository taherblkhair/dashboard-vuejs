<!-- ProductForm.vue -->
<template>
  <form @submit.prevent="onSubmit" class="space-y-6">
    <!-- Step 1: Basic Information -->
    <div v-if="currentStep === 0" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Product Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            اسم المنتج <span class="text-red-500">*</span>
          </label>
          <input v-model="form.name" 
                 type="text" 
                 required
                 placeholder="أدخل اسم المنتج"
                 class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                 :class="{ 'border-red-300': errors.name }" />
          <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
        </div>

        <!-- SKU -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            SKU <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <input v-model="form.sku" 
                   type="text" 
                   required
                   placeholder="مثال: PROD-001"
                   class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                   :class="{ 'border-red-300': errors.sku }" />
            <div class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
              </svg>
            </div>
          </div>
          <p v-if="errors.sku" class="mt-1 text-sm text-red-600">{{ errors.sku }}</p>
        </div>

        <!-- Category -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">الفئة</label>
          <div class="relative">
            <select v-model="form.category_id" 
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white transition-all">
              <option value="">اختر فئة</option>
              <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
            <div class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </div>
          </div>
          
          <!-- Category Info -->
          <div v-if="selectedCategory" class="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
            <div class="flex items-start gap-3">
              <div class="text-blue-600 mt-0.5">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                </svg>
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-blue-800">{{ selectedCategory.name }}</p>
                <p class="text-xs text-blue-600 mt-1">{{ selectedCategory.description || 'لا يوجد وصف' }}</p>
                <p v-if="selectedCategory.parent" class="text-xs text-blue-500 mt-1">
                  الفئة الأم: {{ selectedCategory.parent.name }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Status -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-3">الحالة</label>
          <div class="flex items-center gap-6">
            <label class="flex items-center gap-3 cursor-pointer">
              <div class="relative">
                <input type="checkbox" 
                       v-model="form.is_active" 
                       class="sr-only" />
                <div class="w-12 h-6 rounded-full shadow-inner transition-colors"
                     :class="form.is_active ? 'bg-green-500' : 'bg-gray-300'"></div>
                <div class="absolute left-0 top-0 w-6 h-6 rounded-full shadow transform transition-transform"
                     :class="form.is_active ? 'translate-x-6 bg-white' : 'translate-x-0 bg-white'"></div>
              </div>
              <span class="text-sm text-gray-700">{{ form.is_active ? 'نشط' : 'غير نشط' }}</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Description -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">الوصف</label>
        <textarea v-model="form.description" 
                  rows="4"
                  placeholder="أدخل وصفاً تفصيلياً للمنتج..."
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"></textarea>
        <div class="flex justify-between items-center mt-1">
          <span class="text-xs text-gray-500">يمكنك إضافة وصف مفصل للمنتج</span>
          <span class="text-xs text-gray-400">{{ form.description.length }}/500</span>
        </div>
      </div>
    </div>

    <!-- Step 2: Variants -->
    <div v-else-if="currentStep === 1" class="space-y-6">
      <!-- Variants Header -->
      <div class="flex items-center justify-between">
        <div>
          <h4 class="text-lg font-medium text-gray-800">المتغيرات</h4>
          <p class="text-sm text-gray-500 mt-1">أضف متغيرات مختلفة للمنتج حسب الخصائص</p>
        </div>
        <div class="flex items-center gap-3">
          <button type="button"
                  @click="addVariant"
                  class="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow hover:shadow-md flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            إضافة متغير
          </button>
        </div>
      </div>

      <!-- No Variants Message -->
      <div v-if="form.variants.length === 0" 
           class="text-center py-12 border-2 border-dashed border-gray-300 rounded-2xl">
        <div class="mb-4">
          <svg class="w-16 h-16 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <p class="text-gray-500">لا توجد متغيرات مضافة</p>
        <p class="text-sm text-gray-400 mt-1">انقر على "إضافة متغير" لبدء الإضافة</p>
      </div>

      <!-- Variants List -->
      <div v-else class="space-y-4">
        <div v-for="(v, i) in form.variants" :key="v.id" 
             class="border border-gray-200 rounded-2xl bg-white overflow-hidden transition-all hover:shadow-lg"
             :ref="(el) => (variantRefs[i] = el)">
          
          <!-- Variant Header -->
          <div class="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <button type="button" 
                        @click="toggleVariant(i)"
                        class="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <svg :class="{ 'rotate-90': v._open }" 
                       class="w-4 h-4 transition-transform" 
                       fill="none" 
                       stroke="currentColor" 
                       viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </button>
                <div>
                  <div class="font-medium text-gray-800">{{ v.sku_variant }}</div>
                  <div class="text-xs text-gray-500 flex items-center gap-4 mt-1">
                    <span>الشراء: {{ v.purchase_price }} ر.س</span>
                    <span>البيع: {{ v.sale_price }} ر.س</span>
                    <span v-if="v.attributes.color" class="flex items-center gap-1">
                      <span class="w-3 h-3 rounded-full" :style="{ backgroundColor: getColorCode(v.attributes.color) }"></span>
                      {{ getColorName(v.attributes.color) }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <button type="button"
                        @click="removeVariant(i)"
                        class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Variant Details -->
          <div v-show="v._open" class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <!-- Variant SKU -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  SKU المتغير
                </label>
                <input v-model="v.sku_variant" 
                       type="text" 
                       class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl cursor-not-allowed" 
                       disabled />
              </div>

              <!-- Purchase Price -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  سعر الشراء <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <input v-model="v.purchase_price" 
                         type="number" 
                         min="0"
                         step="0.01"
                         class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all pr-12"
                         :class="{ 'border-red-300': variantErrors[i]?.purchase_price }" />
                  <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">ر.س</span>
                </div>
                <p v-if="variantErrors[i]?.purchase_price" class="mt-1 text-sm text-red-600">
                  {{ variantErrors[i].purchase_price }}
                </p>
              </div>

              <!-- Sale Price -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  سعر البيع <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <input v-model="v.sale_price" 
                         type="number" 
                         min="0"
                         step="0.01"
                         class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all pr-12"
                         :class="{ 'border-red-300': variantErrors[i]?.sale_price }" />
                  <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">ر.س</span>
                </div>
                <p v-if="variantErrors[i]?.sale_price" class="mt-1 text-sm text-red-600">
                  {{ variantErrors[i].sale_price }}
                </p>
              </div>
            </div>

            <!-- Attributes -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <!-- Color -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">اللون</label>
                <select v-model="v.attributes.color" 
                        class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white">
                  <option value="">اختر لون</option>
                  <option value="red">أحمر</option>
                  <option value="blue">أزرق</option>
                  <option value="black">أسود</option>
                  <option value="white">أبيض</option>
                  <option value="green">أخضر</option>
                  <option value="yellow">أصفر</option>
                </select>
              </div>

              <!-- Size -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">المقاس</label>
                <select v-model="v.attributes.size" 
                        class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white">
                  <option value="">اختر مقاس</option>
                  <option value="S">صغير (S)</option>
                  <option value="M">متوسط (M)</option>
                  <option value="L">كبير (L)</option>
                  <option value="XL">XL</option>
                  <option value="XXL">XXL</option>
                </select>
              </div>

              <!-- Weight -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">الوزن</label>
                <div class="relative">
                  <input v-model="v.attributes.weight" 
                         type="text" 
                         placeholder="مثال: 1kg"
                         class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" />
                </div>
              </div>
            </div>

            <!-- Expiry Date & Status -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Expiry Date -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">تاريخ الانتهاء</label>
                <input v-model="v.expiry_date" 
                       type="date" 
                       class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" />
              </div>

              <!-- Variant Status -->
              <div class="flex items-center gap-4">
                <label class="flex items-center gap-3 cursor-pointer">
                  <div class="relative">
                    <input type="checkbox" 
                           v-model="v.is_active" 
                           class="sr-only" />
                    <div class="w-12 h-6 rounded-full shadow-inner transition-colors"
                         :class="v.is_active ? 'bg-green-500' : 'bg-gray-300'"></div>
                    <div class="absolute left-0 top-0 w-6 h-6 rounded-full shadow transform transition-transform"
                         :class="v.is_active ? 'translate-x-6 bg-white' : 'translate-x-0 bg-white'"></div>
                  </div>
                  <span class="text-sm text-gray-700">نشط</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation Buttons -->
    <div v-if="showNavigation" class="pt-6 border-t border-gray-200">
      <div class="flex justify-between">
        <!-- Previous Button -->
        <button v-if="showPrev"
                type="button"
                @click="$emit('prev')"
                class="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          السابق
        </button>

        <!-- Next/Submit Button -->
        <div class="flex gap-3">
          <button v-if="showNext && currentStep < 2"
                  type="button"
                  @click="$emit('next')"
                  class="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl flex items-center gap-2">
            التالي
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>

          <button v-else-if="!props.loading"
                  type="submit"
                  class="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            حفظ المنتج
          </button>

          <button v-else
                  disabled
                  class="px-8 py-3 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-xl cursor-not-allowed flex items-center gap-2">
            <svg class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            جاري الحفظ...
          </button>
        </div>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, watch, ref, onMounted, nextTick, computed } from 'vue'
import { fetchCategory } from '../../api/categories'

interface Category { id: number; name: string }

const props = defineProps<{ 
  categories?: Category[], 
  loading?: boolean,
  showNext?: boolean,
  showPrev?: boolean,
  currentStep?: number
}>()

const emit = defineEmits(['save', 'close', 'next', 'prev'])

const categories = computed(() => props.categories || [])
const showNavigation = computed(() => props.showNext || props.showPrev)
const showNext = computed(() => props.showNext)
const showPrev = computed(() => props.showPrev)
const currentStep = computed(() => props.currentStep || 0)

const form = reactive({
  name: '',
  sku: '',
  description: '',
  category_id: '',
  is_active: true,
  variants: [] as any[]
})

const errors = reactive({
  name: '',
  sku: ''
})

const selectedCategory = ref<any>(null)

const variantErrors = ref<Array<{ sale_price: string; purchase_price: string }>>([])
const variantRefs = ref<Array<any | null>>([])
let variantCounter = 1

// Watch for category changes
watch(() => form.category_id, async (newVal) => {
  selectedCategory.value = null
  if (newVal) {
    try {
      const res = await fetchCategory(Number(newVal))
      selectedCategory.value = (res && (res as any).data) ? (res as any).data : res
    } catch (e) {
      console.error('Failed to fetch category', e)
      selectedCategory.value = null
    }
  }
})

// Watch for SKU changes to update variant SKUs
watch(() => form.sku, (newSku) => {
  const base = newSku && newSku.toString().trim() !== '' ? newSku.toString().trim() : 'SKU'
  form.variants.forEach((v, idx) => {
    v.sku_variant = `${base}-${idx + 1}`
  })
  variantCounter = form.variants.length + 1
})

// Helper functions
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

const getColorCode = (colorCode: string) => {
  const colors: Record<string, string> = {
    'red': '#ef4444',
    'blue': '#3b82f6',
    'black': '#000000',
    'white': '#ffffff',
    'green': '#10b981',
    'yellow': '#f59e0b'
  }
  return colors[colorCode] || colorCode
}

// Variant management
const addVariant = async () => {
  const base = form.sku && form.sku.toString().trim() !== '' ? form.sku.toString().trim() : 'SKU'
  form.variants.push({
    id: `v-${Date.now()}`,
    sku_variant: `${base}-${variantCounter++}`,
    _open: true,
    purchase_price: 0,
    sale_price: 0,
    expiry_date: '',
    is_active: true,
    attributes: {
      color: '',
      size: '',
      weight: ''
    }
  })
  variantErrors.value.push({ sale_price: '', purchase_price: '' })

  await nextTick()
  const idx = form.variants.length - 1
  const el = variantRefs.value[idx]
  if (el) {
    const input = el.querySelector('input[type="number"]') as HTMLInputElement | null
    if (input) input.focus()
  }
}

const toggleVariant = (index: number) => {
  const v = form.variants[index]
  if (!v) return
  v._open = !v._open
}

const removeVariant = (index: number) => {
  form.variants.splice(index, 1)
  if (variantErrors.value.length > index) variantErrors.value.splice(index, 1)
  if (variantRefs.value.length > index) variantRefs.value.splice(index, 1)
}

// Normalize variants on mount
const normalizeVariants = () => {
  form.variants.forEach((v, idx) => {
    if (typeof v._open === 'undefined') {
      v._open = false
    }
    if (!v.sku_variant) v.sku_variant = `${form.sku || 'SKU'}-${idx + 1}`
    if (!variantErrors.value[idx]) variantErrors.value[idx] = { sale_price: '', purchase_price: '' }
    if (typeof variantRefs.value[idx] === 'undefined') variantRefs.value[idx] = null
  })
  if (variantErrors.value.length > form.variants.length) {
    variantErrors.value.splice(form.variants.length)
  }
  if (variantRefs.value.length > form.variants.length) {
    variantRefs.value.splice(form.variants.length)
  }
}

// Validation
const validateForm = () => {
  let valid = true
  
  // Reset errors
  errors.name = ''
  errors.sku = ''
  
  if (!form.name.trim()) {
    errors.name = 'اسم المنتج مطلوب'
    valid = false
  }
  
  if (!form.sku.trim()) {
    errors.sku = 'SKU مطلوب'
    valid = false
  }
  
  return valid
}

const validateVariants = () => {
  let ok = true
  for (let i = 0; i < form.variants.length; i++) {
    if (!variantErrors.value[i]) variantErrors.value[i] = { sale_price: '', purchase_price: '' }
    const e = variantErrors.value[i]!
    e.sale_price = ''
    e.purchase_price = ''

    const v = form.variants[i]
    const sale = Number(v.sale_price)
    const purchase = Number(v.purchase_price)
    
    if (!(sale > 0)) {
      e.sale_price = 'سعر البيع يجب أن يكون أكبر من 0'
      ok = false
    }
    if (!(purchase >= 0)) {
      e.purchase_price = 'سعر الشراء يجب أن يكون قيمة صالحة'
      ok = false
    }
    if (sale < purchase) {
      e.sale_price = 'سعر البيع يجب أن يكون أكبر أو يساوي سعر الشراء'
      ok = false
    }
  }
  return ok
}

// Form submission
const onSubmit = () => {
  if (currentStep.value === 0 && !validateForm()) {
    return
  }
  
  if (currentStep.value === 1 && !validateVariants()) {
    const firstInvalid = variantErrors.value.findIndex(e => e.sale_price || e.purchase_price)
    if (firstInvalid >= 0 && form.variants[firstInvalid]) {
      form.variants[firstInvalid]._open = true
      nextTick(() => {
        const el = variantRefs.value[firstInvalid]
        if (el) {
          const input = el.querySelector('input[type="number"]') as HTMLInputElement | null
          if (input) input.focus()
        }
      })
    }
    return
  }
  
  emit('save', {
    name: form.name,
    sku: form.sku,
    description: form.description,
    category_id: form.category_id || undefined,
    is_active: form.is_active,
    variants: form.variants.map(v => ({
      sku_variant: v.sku_variant,
      purchase_price: v.purchase_price,
      sale_price: v.sale_price,
      expiry_date: v.expiry_date,
      is_active: v.is_active,
      attributes: v.attributes
    }))
  })
}

// Expose form data for parent component
const getFormData = () => {
  return {
    name: form.name,
    sku: form.sku,
    description: form.description,
    category_id: form.category_id,
    is_active: form.is_active,
    variants: form.variants
  }
}

// Expose a validation helper that parents can call before saving
const validateAll = () => {
  const basic = validateForm()
  const variantsOk = validateVariants()
  return basic && variantsOk
}

defineExpose({ getFormData, validateAll })

// Initialize
onMounted(() => {
  normalizeVariants()
})
</script>

<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  opacity: 1;
}
</style>