<!-- ProductForm.vue -->
<template>
  <form @submit.prevent="onSubmit" class="space-y-6">
    <!-- Progressive Indicator -->
    <div class="relative px-2 mb-12">
      <div class="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 rounded-full overflow-hidden">
        <div 
          class="h-full bg-indigo-600 transition-all duration-500 ease-out"
          :style="{ width: `${(currentStep) * 50}%` }"
        ></div>
      </div>
      <div class="relative flex justify-between">
        <div 
          v-for="i in 3" 
          :key="i-1"
          class="flex flex-col items-center gap-2 group cursor-pointer"
          @click="(i-1) < currentStep ? $emit('goToStep', i-1) : null"
        >
          <div 
            class="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm transition-all duration-300 border-2"
            :class="[
              currentStep >= (i-1) ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white border-slate-200 text-slate-400',
              currentStep === (i-1) ? 'ring-4 ring-indigo-50 scale-110' : ''
            ]"
          >
            <svg v-if="currentStep > (i-1)" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
            </svg>
            <span v-else>{{ i }}</span>
          </div>
          <span class="text-[10px] font-black uppercase tracking-widest transition-colors duration-300" :class="currentStep >= (i-1) ? 'text-indigo-600' : 'text-slate-400'">
            {{ i === 1 ? 'المعلومات' : i === 2 ? 'المتغيرات' : 'التسعير' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Step 1: Basic Information -->
    <div v-if="currentStep === 0" class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Product Name -->
        <div class="space-y-2">
          <label class="text-sm font-black text-slate-700 block px-1">
            اسم المنتج <span class="text-rose-500">*</span>
          </label>
          <MInput v-model="form.name" 
                 placeholder="أدخل اسم المنتج"
                 :error="errors.name" />
        </div>

        <!-- SKU -->
        <div class="space-y-2">
          <label class="text-sm font-black text-slate-700 block px-1">
            SKU <span class="text-rose-500">*</span>
          </label>
          <MInput v-model="form.sku" 
                 placeholder="مثال: PROD-001"
                 :error="errors.sku" />
        </div>

        <!-- Category -->
        <div class="space-y-2">
          <label class="text-sm font-black text-slate-700 block px-1">الفئة</label>
          <div class="relative">
            <select v-model="form.category_id" 
                    class="w-full h-14 px-4 rounded-2xl border-none bg-slate-50 ring-1 ring-slate-100 focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-slate-700 appearance-none">
              <option value="">اختر فئة</option>
              <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
            <div class="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- Status -->
        <div class="space-y-2">
          <label class="text-sm font-black text-slate-700 block px-1">الحالة</label>
          <div class="flex items-center h-14 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <input type="checkbox" 
                   v-model="form.is_active" 
                   id="active-toggle"
                   class="w-5 h-5 rounded-lg border-slate-300 text-indigo-600 focus:ring-indigo-600 transition-all cursor-pointer" />
            <label for="active-toggle" class="mr-3 text-sm font-black text-slate-700 cursor-pointer">
              {{ form.is_active ? 'المنتج نشط' : 'المنتج غير نشط' }}
            </label>
          </div>
        </div>
      </div>

      <!-- Description -->
      <div class="space-y-2">
        <label class="text-sm font-black text-slate-700 block px-1">الوصف</label>
        <textarea v-model="form.description" 
                  rows="4"
                  placeholder="أدخل وصفاً تفصيلياً للمنتج..."
                  class="w-full p-4 rounded-2xl border-none bg-slate-50 ring-1 ring-slate-100 focus:ring-2 focus:ring-indigo-600 transition-all font-medium text-slate-600 resize-none"></textarea>
        <div class="flex justify-between items-center mt-1">
          <span class="text-[10px] font-black text-slate-300 uppercase">يمكنك إضافة وصف مفصل للمنتج</span>
          <span class="text-[10px] font-bold text-slate-400">{{ form.description.length }}/500</span>
        </div>
      </div>
    </div>

    <!-- Step 2: Variants -->
    <div v-else-if="currentStep === 1" class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div class="flex items-center justify-between">
        <div class="space-y-1">
          <h4 class="text-xl font-black text-slate-900 tracking-tight">قائمة المتغيرات</h4>
          <p class="text-sm font-medium text-slate-400">أضف متغيرات مختلفة للمنتج حسب الخصائص</p>
        </div>
        <MButton type="button"
                variant="secondary"
                size="sm"
                @click="addVariant"
                class="!rounded-xl bg-indigo-50 !text-indigo-600 border-none hover:bg-indigo-100">
          <template #icon>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
          </template>
          إضافة متغير
        </MButton>
      </div>

      <!-- No Variants Message -->
      <div v-if="form.variants.length === 0" 
           class="py-20 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-[2.5rem] bg-slate-50/30 text-center space-y-4">
        <div class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-200 shadow-sm">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
          </svg>
        </div>
        <div class="space-y-1">
          <p class="font-black text-slate-900">لا توجد متغيرات مضافة</p>
          <p class="text-sm text-slate-400 font-medium">ابدأ بإضافة متغيرات لتعريف خصائص المنتج</p>
        </div>
      </div>

      <!-- Variants List -->
      <div v-else class="space-y-6">
        <div v-for="(v, i) in form.variants" :key="v.id" 
             class="group relative bg-white rounded-[2rem] border border-slate-100 transition-all hover:shadow-xl hover:shadow-slate-200/50"
             :ref="(el) => (variantRefs[i] = el)">
          
          <!-- Variant Header -->
          <div class="p-6 cursor-pointer flex items-center justify-between"
               @click="toggleVariant(i)">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                <svg :class="{ 'rotate-180': v._open }" class="w-5 h-5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/>
                </svg>
              </div>
              <div>
                <h4 class="font-black text-slate-900 tracking-tight">{{ v.sku_variant }}</h4>
                <div class="flex gap-2 mt-1">
                  <span v-for="(val, key) in v.attributes" :key="key" class="text-[10px] font-bold text-slate-400 px-1.5 py-0.5 bg-slate-50 rounded-md border border-slate-100">
                    {{ key }}: {{ val }}
                  </span>
                  <span v-if="!Object.keys(v.attributes).length" class="text-[10px] font-bold text-slate-300 italic">لا توجد خصائص محددة</span>
                </div>
              </div>
            </div>
            <MButton 
              variant="secondary" 
              size="sm" 
              type="button"
              class="!p-2 !rounded-xl !text-rose-500 hover:!bg-rose-50 border-none transition-all opacity-0 group-hover:opacity-100"
              @click.stop="removeVariant(i)"
            >
              <template #icon>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </template>
            </MButton>
          </div>

          <!-- Variant Content -->
          <div v-show="v._open" class="px-8 pb-8 pt-2 space-y-6 border-t border-slate-50 animate-in fade-in duration-300">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-4">
                <h5 class="text-xs font-black text-slate-400 uppercase tracking-widest px-1">البيانات الأساسية</h5>
                <div class="space-y-4">
                  <div class="space-y-1.5">
                    <label class="text-[11px] font-black text-slate-500 block px-1">SKU المتغير</label>
                    <MInput v-model="v.sku_variant" class="!rounded-xl bg-slate-50/50" disabled />
                  </div>
                  <div class="space-y-1.5">
                    <label class="text-[11px] font-black text-slate-500 block px-1">تاريخ الانتهاء (اختياري)</label>
                    <input v-model="v.expiry_date" 
                           type="date" 
                           class="w-full h-11 px-4 rounded-xl border-none bg-slate-50/50 ring-1 ring-slate-100 focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-sm text-slate-700" />
                  </div>
                </div>
              </div>

              <div class="space-y-4">
                <h5 class="text-xs font-black text-slate-400 uppercase tracking-widest px-1">الخصائص المميزة</h5>
                <div class="grid grid-cols-1 gap-4">
                  <div class="space-y-1.5">
                    <label class="text-[11px] font-black text-slate-500 block px-1">اللون</label>
                    <select v-model="v.attributes.color" 
                            class="w-full h-11 px-4 rounded-xl border-none bg-slate-50/50 ring-1 ring-slate-100 focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-sm text-slate-700">
                      <option value="">اختر لون</option>
                      <option value="red">أحمر</option>
                      <option value="blue">أزرق</option>
                      <option value="black">أسود</option>
                      <option value="white">أبيض</option>
                      <option value="green">أخضر</option>
                      <option value="yellow">أصفر</option>
                    </select>
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-1.5">
                      <label class="text-[11px] font-black text-slate-500 block px-1">المقاس</label>
                      <select v-model="v.attributes.size" 
                              class="w-full h-11 px-4 rounded-xl border-none bg-slate-50/50 ring-1 ring-slate-100 focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-sm text-slate-700">
                        <option value="">اختر مقاس</option>
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                        <option value="XXL">XXL</option>
                      </select>
                    </div>
                    <div class="space-y-1.5">
                      <label class="text-[11px] font-black text-slate-500 block px-1">الوزن</label>
                      <MInput v-model="v.attributes.weight" placeholder="مثال: 1kg" class="!rounded-xl !h-11 bg-slate-50/50" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="flex items-center gap-4 px-1">
              <label class="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" 
                       v-model="v.is_active" 
                       class="w-5 h-5 rounded-lg border-slate-300 text-indigo-600 focus:ring-indigo-600 transition-all" />
                <span class="text-sm font-black text-slate-700">نشط</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Step 3: Pricing & Review -->
    <div v-else-if="currentStep === 2" class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div class="space-y-1">
        <h4 class="text-xl font-black text-slate-900 tracking-tight">إعدادات التسعير</h4>
        <p class="text-sm font-medium text-slate-400">حدد أسعار الشراء والبيع للمتغيرات</p>
      </div>

      <div class="space-y-4">
        <div v-for="(v, i) in form.variants" :key="v.id" class="p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100 flex flex-col md:flex-row items-center gap-8 group hover:bg-white hover:border-indigo-100 transition-all">
          <div class="flex-1 space-y-1">
            <h5 class="text-sm font-black text-slate-900">{{ v.sku_variant }}</h5>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{{ formatAttributes(v.attributes) }}</p>
          </div>
          
          <div class="flex items-center gap-6 w-full md:w-auto">
            <div class="space-y-2 flex-1 md:w-32">
              <label class="text-[11px] font-black text-slate-500 block px-1 leading-none mb-1">سعر الشراء</label>
              <MInput v-model="v.purchase_price" type="number" step="0.01" placeholder="0.00" class="!h-12 !rounded-xl" :error="variantErrors[i]?.purchase_price" />
            </div>
            <div class="space-y-2 flex-1 md:w-32">
              <label class="text-[11px] font-black text-slate-500 block px-1 leading-none mb-1">سعر البيع</label>
              <MInput v-model="v.sale_price" type="number" step="0.01" placeholder="0.00" class="!h-12 !rounded-xl" :error="variantErrors[i]?.sale_price" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation Buttons -->
    <div v-if="showNavigation" class="flex items-center justify-between pt-10 border-t border-slate-50 mt-10">
      <div>
        <MButton v-if="showPrev" 
                type="button" 
                variant="secondary" 
                @click="$emit('prev')"
                class="!rounded-2xl !px-8 hover:bg-slate-50 border-none !text-slate-400 font-black">
          <template #icon>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </template>
          السابق
        </MButton>
      </div>
      <div class="flex items-center gap-4">
        <MButton type="button" 
                variant="secondary" 
                @click="$emit('close')"
                class="!rounded-2xl !px-8 border-none !text-slate-400 font-bold">
          إلغاء
        </MButton>
        <MButton v-if="showNext && currentStep < 2" 
                type="button" 
                variant="primary" 
                @click="$emit('next')"
                class="!rounded-2xl !px-10 shadow-lg shadow-indigo-100">
          التالي
          <template #icon-right>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </template>
        </MButton>
        <MButton v-else 
                type="submit" 
                variant="primary" 
                :loading="loading"
                class="!rounded-2xl !px-10 shadow-lg shadow-indigo-100">
          <template #icon>
            <svg v-if="!loading" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            <svg v-else class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
          </template>
          {{ loading ? 'جاري الحفظ...' : 'حفظ المنتج' }}
        </MButton>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, watch, ref, onMounted, nextTick, computed } from 'vue'
import { fetchCategory } from '../../api/categories'
import MInput from '../../components/ui/MInput.vue'
import MButton from '../../components/ui/MButton.vue'

interface Category { id: number; name: string }

const props = defineProps<{ 
  categories?: Category[], 
  loading?: boolean,
  showNext?: boolean,
  showPrev?: boolean,
  currentStep?: number
}>()

const emit = defineEmits(['save', 'close', 'next', 'prev', 'goToStep'])

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


// Helper for attributes display
const formatAttributes = (attrs: any) => {
  if (!attrs || Object.keys(attrs).length === 0) return 'لا توجد خصائص'
  return Object.entries(attrs)
    .filter(([_, val]) => !!val)
    .map(([key, val]) => `${key}: ${val}`)
    .join(' - ')
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