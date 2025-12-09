<template>
  <div class="p-4 md:p-6 bg-gradient-to-b from-gray-50 to-white min-h-screen" dir="rtl">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-200">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-md">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
            </div>
            <div>
              <h1 class="text-2xl md:text-3xl font-bold text-gray-900">إنشاء طلب شراء جديد</h1>
              <p class="text-gray-600 mt-2">أدخل بيانات طلب الشراء وأضف العناصر المطلوبة من المورد</p>
            </div>
          </div>

        
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading && !form.lines.length" class="bg-white rounded-2xl shadow-lg p-12 border border-gray-200">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p class="text-gray-600">جاري تحميل البيانات...</p>
        </div>
      </div>

      <!-- Main Form -->
      <div v-else class="space-y-8">
        <!-- Order Information -->
        <div class="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <div class="flex items-center gap-3 mb-6">
            <div class="p-2 bg-blue-100 rounded-lg">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-800">معلومات الطلب الأساسية</h3>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Supplier -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                المورد
                <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <select 
                  v-model.number="form.supplier_id" 
                  required
                  :class="[
                    'w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 appearance-none bg-white',
                    errors.supplier_id ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                  ]"
                >
                  <option value="">اختر المورد</option>
                  <option 
                    v-for="s in suppliers" 
                    :key="s.id" 
                    :value="s.id"
                    class="py-2"
                  >
                    {{ s.name }} — {{ s.contact_person || s.email || s.phone || '' }}
                  </option>
                </select>
                <div class="absolute left-4 top-3.5 pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </div>
                <div v-if="errors.supplier_id" class="absolute left-0 top-full mt-1 text-xs text-red-600">{{ errors.supplier_id }}</div>
              </div>
            </div>

            <!-- Order Date -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                تاريخ الطلب
                <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <input 
                  v-model="form.order_date" 
                  type="date" 
                  required
                  :class="[
                    'w-full px-4 py-3 border-2 rounded-xl transition-all duration-200',
                    errors.order_date ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                  ]"
                />
                <div v-if="errors.order_date" class="absolute left-0 top-full mt-1 text-xs text-red-600">{{ errors.order_date }}</div>
              </div>
            </div>

            <!-- Expected Delivery Date -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                تاريخ التوصيل المتوقع
                <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <input 
                  v-model="form.expected_delivery_date" 
                  type="date" 
                  required
                  :class="[
                    'w-full px-4 py-3 border-2 rounded-xl transition-all duration-200',
                    errors.expected_delivery_date ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                  ]"
                />
                <div v-if="errors.expected_delivery_date" class="absolute left-0 top-full mt-1 text-xs text-red-600">{{ errors.expected_delivery_date }}</div>
              </div>
            </div>

            <!-- Notes -->
            <div class="md:col-span-2 space-y-2">
              <label class="block text-sm font-medium text-gray-700">ملاحظات إضافية</label>
              <textarea 
                v-model="form.notes" 
                rows="3"
                :class="[
                  'w-full px-4 py-3 border-2 rounded-xl transition-all duration-200',
                  errors.notes ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                ]"
                placeholder="أضف أي ملاحظات أو تعليمات خاصة بطلب الشراء..."
              ></textarea>
              <div v-if="errors.notes" class="absolute left-0 top-full mt-1 text-xs text-red-600">{{ errors.notes }}</div>
            </div>
          </div>
        </div>

        <!-- Order Items -->
        <div class="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-green-100 rounded-lg">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-semibold text-gray-800">عناصر الطلب</h3>
                <p class="text-gray-600 text-sm">أضف المنتجات والمتغيرات المطلوبة مع الكميات والأسعار</p>
              </div>
            </div>
            
            <button 
              @click="addLine"
              class="px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              إضافة عنصر جديد
            </button>
          </div>

          <!-- Empty Items State -->
          <div v-if="form.lines.length === 0" class="text-center py-12">
            <div class="w-24 h-24 mx-auto mb-6 text-gray-300">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
              </svg>
            </div>
            <h4 class="text-lg font-semibold text-gray-800 mb-2">لا توجد عناصر مضافة</h4>
            <p class="text-gray-600 mb-6">استخدم الزر أعلاه لإضافة عناصر إلى طلب الشراء</p>
          </div>

          <!-- Items List -->
          <div v-else class="space-y-6">
            <div 
              v-for="(line, idx) in form.lines" 
              :key="line._uid"
              class="border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-all duration-200"
            >
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg flex items-center justify-center font-bold">
                    {{ idx + 1 }}
                  </div>
                  <h4 class="text-lg font-semibold text-gray-800">العنصر #{{ idx + 1 }}</h4>
                </div>
                
                <button 
                  @click="removeLine(idx)"
                  class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  :disabled="form.lines.length <= 1"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- Product -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">
                    المنتج
                    <span class="text-red-500">*</span>
                  </label>
                    <ProductAutocomplete
                      v-model="line.product_id"
                      @select="(p) => onProductSelected(idx, p)"
                      :class="[
                        'w-full px-0 py-0 transition-all duration-200',
                        errors[`lines.${idx}.product_id`] ? 'border-red-500' : ''
                      ]"
                    />
                  <div v-if="errors[`lines.${idx}.product_id`]" class="text-xs text-red-600">{{ errors[`lines.${idx}.product_id`] }}</div>
                </div>

                <!-- Variant -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">
                    المتغير
                    <span class="text-red-500">*</span>
                  </label>
                  <select 
                    v-model.number="line.product_variant_id"
                    :class="[
                      'w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 appearance-none bg-white',
                      errors[`lines.${idx}.product_variant_id`] ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                    ]"
                    :disabled="!line.product_id || variantsForLine(idx).length === 0"
                  >
                    <option value="">اختر المتغير</option>
                    <option 
                      v-for="v in variantsForLine(idx)" 
                      :key="v.id" 
                      :value="v.id"
                    >
                      {{ v.sku_variant || v.sku || 'بدون SKU' }} — {{ formatAttributes(v.attributes) }}
                    </option>
                  </select>
                  <div v-if="!line.product_id" class="text-xs text-gray-500">اختر المنتج أولاً</div>
                  <div v-else-if="variantsForLine(idx).length === 0" class="text-xs text-yellow-600">هذا المنتج لا يحتوي على متغيرات</div>
                  <div v-if="errors[`lines.${idx}.product_variant_id`]" class="text-xs text-red-600">{{ errors[`lines.${idx}.product_variant_id`] }}</div>
                </div>

                <!-- Quantity -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">
                    الكمية
                    <span class="text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <input 
                      v-model.number="line.quantity_ordered" 
                      type="number" 
                      min="1"
                      required
                      :class="[
                        'w-full px-4 py-3 border-2 rounded-xl transition-all duration-200',
                        errors[`lines.${idx}.quantity_ordered`] ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                      ]"
                      placeholder="أدخل الكمية"
                    />
                    <div v-if="errors[`lines.${idx}.quantity_ordered`]" class="text-xs text-red-600">{{ errors[`lines.${idx}.quantity_ordered`] }}</div>
                  </div>
                </div>

                <!-- Unit Price -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">
                    سعر الوحدة
                    <span class="text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <div class="relative">
                      <input 
                        v-model.number="line.unit_price" 
                        type="number" 
                        step="0.01"
                        min="0"
                        required
                        :class="[
                          'w-full px-4 py-3 border-2 rounded-xl transition-all duration-200',
                          errors[`lines.${idx}.unit_price`] ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                        ]"
                        placeholder="0.00"
                      />
                      <span class="absolute left-4 top-3.5 text-gray-500">د.ل</span>
                    </div>
                    <div v-if="errors[`lines.${idx}.unit_price`]" class="text-xs text-red-600">{{ errors[`lines.${idx}.unit_price`] }}</div>
                  </div>
                </div>

                <!-- Expiry Date -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">تاريخ الانتهاء</label>
                  <input 
                    v-model="line.expiry_date" 
                    type="date"
                    class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  />
                </div>

                <!-- Line Notes -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">ملاحظات العنصر</label>
                  <input 
                    v-model="line.notes" 
                    type="text"
                    class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                    placeholder="ملاحظات خاصة بهذا العنصر..."
                  />
                </div>
              </div>

              <!-- Line Total -->
              <div class="mt-6 pt-6 border-t">
                <div class="flex items-center justify-between">
                  <span class="text-gray-600">إجمالي العنصر</span>
                  <span class="text-xl font-bold text-blue-600">{{ formatCurrency(line.quantity_ordered * line.unit_price) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Summary -->
          <div v-if="form.lines.length > 0" class="mt-8 pt-8 border-t">
            <div class="flex justify-end">
              <div class="w-full md:w-1/2 space-y-4">
                <div class="flex justify-between text-lg">
                  <span class="text-gray-700">إجمالي العناصر:</span>
                  <span class="font-semibold">{{ form.lines.length }}</span>
                </div>
                <div class="flex justify-between text-lg">
                  <span class="text-gray-700">إجمالي الكميات:</span>
                  <span class="font-semibold">{{ totalQuantity }}</span>
                </div>
                <div class="flex justify-between text-2xl font-bold pt-4 border-t">
                  <span class="text-gray-800">المبلغ الإجمالي:</span>
                  <span class="text-gray-900">{{ formatCurrency(totalAmount) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="flex flex-col md:flex-row justify-between gap-4 p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
          <div class="text-sm text-gray-600">
            <p class="flex items-center gap-2">
              <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              جميع الحقول المميزة بـ <span class="text-red-500">*</span> إلزامية
            </p>
            <p class="mt-1">سيتم إنشاء طلب الشراء بعد التحقق من جميع البيانات</p>
          </div>
          
          <div class="flex gap-3">
            <button 
              @click="$router.back()"
              class="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200 flex items-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
              إلغاء
            </button>
            
            <button 
              @click="submit"
              :disabled="loading"
              :class="[
                'px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2',
                loading 
                  ? 'bg-green-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl'
              ]"
            >
              <svg v-if="loading" class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              {{ loading ? 'جاري إنشاء الطلب...' : 'إنشاء طلب الشراء' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { fetchSuppliers } from '../../api/suppliers'
import { fetchProducts } from '../../api/products'
import { createPurchaseOrder } from '../../api/purchaseOrders'
import { formatAttributes } from '../../utils/helpers'
import ProductAutocomplete from '../../components/ProductAutocomplete.vue'

const router = useRouter()

// State
const suppliers = ref<any[]>([])
const products = ref<any[]>([])
const loading = ref(false)

// Form
const form = reactive<any>({
  supplier_id: null,
  order_date: '',
  expected_delivery_date: '',
  notes: '',
  lines: [] as any[]
})

// Errors
const errors = reactive<any>({})

// Computed
const totalQuantity = computed(() => {
  return form.lines.reduce((sum: number, line: any) => sum + (Number(line.quantity_ordered) || 0), 0)
})

const totalAmount = computed(() => {
  return form.lines.reduce((sum: number, line: any) => {
    const quantity = Number(line.quantity_ordered) || 0
    const price = Number(line.unit_price) || 0
    return sum + (quantity * price)
  }, 0)
})

// Methods
const addLine = () => {
  form.lines.push({ 
    _uid: Date.now() + Math.random(), 
    product_id: null, 
    product_variant_id: null, 
    quantity_ordered: 1, 
    unit_price: 0, 
    expiry_date: '', 
    notes: '',
    product_name: null
  })
}

const removeLine = (idx: number) => {
  if (form.lines.length > 1) {
    form.lines.splice(idx, 1)
  }
}

const variantsForLine = (idx: number) => {
  const line = form.lines[idx]
  if (!line || !line.product_id) return []
  const prod = products.value.find((p: any) => p.id === line.product_id)
  return prod?.variants || []
}

// (product change handled by ProductAutocomplete via onProductSelected)

const onProductSelected = (idx: number, product: any) => {
  if (!product) return
  form.lines[idx].product_id = product.id
  form.lines[idx].product_name = product.name || null
  // set default variant if available
  const v = product.variants || []
  form.lines[idx].product_variant_id = v.length > 0 ? v[0].id : null
}

const formatCurrency = (val?: number) => {
  if (!val) return '0.00'
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'LYD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(val)
}

const validateForm = () => {
  let isValid = true
  errors.supplier_id = ''
  errors.order_date = ''
  errors.expected_delivery_date = ''
  
  // Reset line errors
  Object.keys(errors).forEach(key => {
    if (key.startsWith('lines.')) delete errors[key]
  })

  // Validate basic fields
  if (!form.supplier_id) {
    errors.supplier_id = 'يجب اختيار المورد'
    isValid = false
  }

  if (!form.order_date) {
    errors.order_date = 'يجب تحديد تاريخ الطلب'
    isValid = false
  }

  if (!form.expected_delivery_date) {
    errors.expected_delivery_date = 'يجب تحديد تاريخ التوصيل المتوقع'
    isValid = false
  }

  // Validate lines
  form.lines.forEach((line: any, idx: number) => {
    if (!line.product_id) {
      errors[`lines.${idx}.product_id`] = 'يجب اختيار المنتج'
      isValid = false
    }

    if (!line.product_variant_id) {
      errors[`lines.${idx}.product_variant_id`] = 'يجب اختيار المتغير'
      isValid = false
    }

    if (!line.quantity_ordered || line.quantity_ordered <= 0) {
      errors[`lines.${idx}.quantity_ordered`] = 'يجب إدخال كمية صحيحة أكبر من صفر'
      isValid = false
    }

    if (line.unit_price === undefined || line.unit_price === null || line.unit_price < 0) {
      errors[`lines.${idx}.unit_price`] = 'يجب إدخال سعر صحيح'
      isValid = false
    }
  })

  return isValid
}

// Submit
const submit = async () => {
  if (!validateForm()) {
    alert('يرجى تصحيح الأخطاء في النموذج')
    return
  }

  if (form.lines.length === 0) {
    alert('يجب إضافة عنصر واحد على الأقل')
    return
  }

  loading.value = true

  // Prepare payload
  const payload: any = {
    supplier_id: Number(form.supplier_id),
    order_date: form.order_date,
    expected_delivery_date: form.expected_delivery_date,
    notes: form.notes || null,
    lines: form.lines.map((l: any) => ({
      product_variant_id: Number(l.product_variant_id),
      quantity_ordered: Number(l.quantity_ordered),
      unit_price: Number(l.unit_price),
      expiry_date: l.expiry_date || null,
      notes: l.notes || null
    }))
  }

  try {
    const res = await createPurchaseOrder(payload)
    alert('تم إنشاء طلب الشراء بنجاح')

    // Navigate to details of created order
    const id = res?.data?.id || res?.id
    if (id) {
      router.push({ name: 'PurchaseOrderDetails', params: { id } })
    } else {
      router.push({ name: 'PurchaseOrders' })
    }
  } catch (e: any) {
    console.error('Failed to create purchase order', e)
    const errorMessage = e?.response?.data?.message || 'فشل إنشاء طلب الشراء'
    alert(errorMessage)
  } finally {
    loading.value = false
  }
}

// Lifecycle: load suppliers/products and ensure at least one line
onMounted(async () => {
  loading.value = true
  try {
    const s = await fetchSuppliers()
    suppliers.value = s?.data || s || []

    const p = await fetchProducts()
    products.value = p?.data || p || []

    if (!form.lines.length) addLine()
  } catch (e) {
    console.error('Failed to load initial data', e)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
/* Custom animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.bg-white {
  animation: fadeIn 0.3s ease-out;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* Form field focus styles */
input:focus, select:focus, textarea:focus {
  outline: none;
}
</style>