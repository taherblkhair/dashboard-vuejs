<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6" dir="rtl">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center gap-3 mb-4">
          <button 
            @click="cancel"
            class="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            title="رجوع"
          >
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 class="text-2xl md:text-3xl font-bold text-gray-800">استلام طلب شراء</h1>
            <p class="text-sm text-gray-600 mt-1">قم بتحديد المخزن والكميات المستلمة لكل بند ثم تأكيد الاستلام</p>
          </div>
        </div>

        <!-- Order Info Card -->
        <div class="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <div class="p-2 bg-blue-50 rounded-lg">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div class="text-sm text-gray-500">رقم طلب الشراء</div>
                  <div class="font-semibold text-lg text-gray-800">{{ order?.code || '-' }}</div>
                </div>
              </div>
              
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <div class="text-sm text-gray-600">المورد: <span class="font-medium">{{ order?.supplier?.name || '-' }}</span></div>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <div class="text-center">
                <div class="text-2xl font-bold text-gray-800">{{ totalRequestedQty }}</div>
                <div class="text-xs text-gray-500">الكمية المطلوبة</div>
              </div>
              <div class="h-10 w-px bg-gray-300"></div>
              <div class="text-center">
                <div class="text-2xl font-bold text-green-600">{{ totalReceivedQty }}</div>
                <div class="text-xs text-gray-500">الكمية المستلمة</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Form -->
      <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <div class="text-gray-600">جاري تحميل بيانات الطلب...</div>
        </div>

        <!-- Warehouse Selection -->
        <div v-else class="space-y-6">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              <span class="text-red-500">*</span> المخزن المستلم فيه
            </label>
            <div class="relative">
              <select 
                v-model="form.warehouse_id" 
                class="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition appearance-none"
                :class="!form.warehouse_id ? 'border-red-300 bg-red-50' : ''"
              >
                <option value="" disabled>اختر المخزن من القائمة</option>
                <option v-for="w in warehouses" :key="w.id" :value="w.id">{{ w.name }}</option>
              </select>
              <div class="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                </svg>
              </div>
            </div>
            <p v-if="!form.warehouse_id" class="text-sm text-red-600 mt-1">يرجى اختيار المخزن</p>
          </div>

          <!-- Order Lines -->
          <div>
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-semibold text-gray-800">بنود الطلب</h3>
              <div class="text-sm text-gray-500">
                {{ order?.lines?.length || 0 }} بند
              </div>
            </div>

            <div v-if="!order?.lines || !order.lines.length" class="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl">
              <svg class="w-16 h-16 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p class="text-gray-500">لا توجد بنود في هذا الطلب</p>
            </div>

            <div v-else class="space-y-4">
              <div 
                v-for="(line, idx) in order.lines" 
                :key="line.id"
                class="bg-gray-50 rounded-xl p-4 border border-gray-200 transition-all hover:border-blue-300"
                :class="{'bg-red-50 border-red-200': lineErrors[idx]}"
              >
                <!-- Product Header -->
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 pb-3 border-b border-gray-200">
                  <div class="flex-1">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 bg-white rounded-lg border border-gray-300 flex items-center justify-center">
                        <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                      <div class="min-w-0">
                        <div class="font-semibold text-gray-800 truncate">
                          {{ line.product?.name || line.product_name || 'بند بدون اسم' }}
                        </div>
                        <div v-if="line.product_variant || line.variant" class="text-sm text-gray-600 mt-1">
                          {{ formatVariant(line) }}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="flex items-center gap-4">
                    <div class="text-center">
                      <div class="text-sm text-gray-500">المطلوب</div>
                      <div class="font-bold text-gray-800 text-lg">
                        {{ line.quantity_ordered ?? line.qty ?? '-' }}
                      </div>
                    </div>
                    <div class="h-8 w-px bg-gray-300"></div>
                    <div class="text-center">
                      <div class="text-sm text-gray-500">المستلم</div>
                      <div class="font-bold text-green-600 text-lg">
                        {{ lines[idx]?.quantity_received || 0 }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Input Fields -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Quantity Received -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      الكمية المستلمة
                      <span class="text-xs text-gray-500">(بحد أقصى {{ getRequestedQtyForLine(line.id) }})</span>
                    </label>
                    <div class="relative">
                      <input
                        type="number"
                        :min="0"
                        :max="getRequestedQtyForLine(line.id)"
                        v-model.number="lines[idx].quantity_received"
                        @input="() => validateLine(idx)"
                        :class="lineErrors[idx] ? 'border-red-300 bg-red-50' : 'border-gray-300'"
                        class="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        placeholder="أدخل الكمية"
                      />
                      <div v-if="lineErrors[idx]" class="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <div v-if="lineErrors[idx]" class="text-sm text-red-600 mt-2 flex items-center gap-1">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      {{ lineErrors[idx] }}
                    </div>
                    
                    <!-- Quantity Slider -->
                    <div class="mt-3">
                      <input
                        type="range"
                        :min="0"
                        :max="getRequestedQtyForLine(line.id)"
                        v-model.number="lines[idx].quantity_received"
                        class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        :class="lineErrors[idx] ? 'accent-red-500' : 'accent-blue-500'"
                      />
                      <div class="flex justify-between text-xs text-gray-500 mt-1">
                        <span>0</span>
                        <span>{{ Math.floor(getRequestedQtyForLine(line.id) / 2) }}</span>
                        <span>{{ getRequestedQtyForLine(line.id) }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Notes -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      ملاحظات
                      <span class="text-xs text-gray-400">(اختياري)</span>
                    </label>
                    <div class="relative">
                      <textarea
                        v-model="lines[idx].notes"
                        rows="3"
                        class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        placeholder="أضف ملاحظات حول هذا البند..."
                      ></textarea>
                      <div class="absolute left-3 top-3 pointer-events-none">
                        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                      </div>
                    </div>
                    <div class="text-xs text-gray-500 mt-1 text-left">
                      {{ lines[idx].notes?.length || 0 }}/200
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Summary Card -->
          <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div class="space-y-2">
                <div class="text-lg font-semibold text-gray-800">ملخص الاستلام</div>
                <div class="flex items-center gap-4">
                  <div class="flex items-center gap-2">
                    <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div class="text-sm text-gray-600">
                      <span class="font-medium">{{ totalRequestedQty }}</span> كمية مطلوبة
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div class="text-sm text-gray-600">
                      <span class="font-medium">{{ totalReceivedQty }}</span> كمية مستلمة
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="w-3 h-3 bg-gray-400 rounded-full"></div>
                    <div class="text-sm text-gray-600">
                      <span class="font-medium">{{ remainingQty }}</span> كمية متبقية
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="text-right">
                <div class="text-sm text-gray-600 mb-1">حالة الإتمام</div>
                <div class="flex items-center gap-3">
                  <div class="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      class="h-full bg-green-500 transition-all duration-500"
                      :style="{ width: `${completionPercentage}%` }"
                    ></div>
                  </div>
                  <div class="text-lg font-bold text-gray-800">
                    {{ completionPercentage }}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
            <button
              @click="cancel"
              class="flex-1 px-6 py-3.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              إلغاء
            </button>
            
            <button
              @click="submitReceive"
              :disabled="!canSubmit"
              :class="canSubmit ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-300 cursor-not-allowed'"
              class="flex-1 px-6 py-3.5 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              تأكيد استلام البضاعة
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchPurchaseOrder, receivePurchaseOrder } from '../../api/purchaseOrders'
import { formatAttributes } from '../../utils/helpers'
import { fetchWarehouses } from '../../api/warehouses'

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id || 0)

const loading = ref(false)
const order = ref<any>(null)
const warehouses = ref<any[]>([])

const form = ref<{ warehouse_id?: number }>({ warehouse_id: undefined })
const lines = ref<Array<any>>([])
const lineErrors = ref<Record<number, string>>({})

// Computed properties
const totalRequestedQty = computed(() => {
  if (!order.value?.lines) return 0
  return order.value.lines.reduce((sum: number, line: any) => {
    return sum + (Number(line.quantity_ordered ?? line.qty ?? 0))
  }, 0)
})

const totalReceivedQty = computed(() => {
  return lines.value.reduce((sum, line) => sum + (Number(line.quantity_received) || 0), 0)
})

const remainingQty = computed(() => {
  return totalRequestedQty.value - totalReceivedQty.value
})

const completionPercentage = computed(() => {
  if (totalRequestedQty.value === 0) return 0
  return Math.round((totalReceivedQty.value / totalRequestedQty.value) * 100)
})

const canSubmit = computed(() => {
  const hasWarehouse = !!form.value.warehouse_id
  const hasValidLines = !Object.values(lineErrors.value).some(error => !!error)
  const hasSomeQuantity = totalReceivedQty.value > 0
  return hasWarehouse && hasValidLines && hasSomeQuantity && !loading.value
})

const load = async () => {
  if (!id) return
  loading.value = true
  try {
    const res = await fetchPurchaseOrder(id)
    order.value = res?.data || null
    
    // Initialize lines array
    lines.value = (order.value?.lines || []).map((l: any) => ({
      line_id: l.id,
      quantity_received: 0,
      notes: ''
    }))
    
    // Initialize error tracking
    lineErrors.value = {}
    lines.value.forEach((_, idx) => { lineErrors.value[idx] = '' })
    
    // Load warehouses
    const wres = await fetchWarehouses(1)
    warehouses.value = wres?.data || []
  } catch (e) {
    console.error('Failed to load order or warehouses', e)
  } finally {
    loading.value = false
  }
}

onMounted(() => load())

const getRequestedQtyForLine = (line_id: number) => {
  const l = order.value?.lines?.find((ll: any) => ll.id === line_id)
  return Number(l?.quantity_ordered ?? l?.qty ?? 0)
}

const formatVariant = (line: any) => {
  const v = line.product_variant || line.variant
  if (!v) return ''
  
  const parts: string[] = []
  
  if (v.sku_variant) {
    parts.push(`SKU: ${v.sku_variant}`)
  }
  
  const attrs = v.attributes
  if (attrs) {
    if (typeof attrs === 'object' && !Array.isArray(attrs)) {
      const formatted = Object.entries(attrs)
        .map(([k, val]) => `${k}: ${val}`)
        .join(' | ')
      if (formatted) parts.push(formatted)
    } else {
      const a = formatAttributes(attrs)
      if (a) parts.push(a)
    }
  }
  
  return parts.join(' | ')
}

const validateLine = (idx: number) => {
  const item = lines.value[idx]
  if (!item) return
  
  const requested = getRequestedQtyForLine(item.line_id)
  const received = Number(item.quantity_received || 0)
  
  if (received > requested) {
    lineErrors.value[idx] = `تجاوز الحد الأقصى (${requested})`
    lines.value[idx].quantity_received = requested
  } else if (received < 0) {
    lineErrors.value[idx] = 'الكمية لا يمكن أن تكون سالبة'
    lines.value[idx].quantity_received = 0
  } else {
    lineErrors.value[idx] = ''
  }
}

const validateAllLines = () => {
  lines.value.forEach((_, idx) => validateLine(idx))
  return !Object.values(lineErrors.value).some(v => v && v.length)
}

const submitReceive = async () => {
  if (!id) {
    alert('خطأ: رقم الطلب غير موجود')
    return
  }
  
  if (!form.value.warehouse_id) {
    alert('يرجى اختيار المخزن')
    return
  }
  
  if (!validateAllLines()) {
    alert('يرجى تصحيح الأخطاء في الكميات المدخلة')
    return
  }
  
  if (totalReceivedQty.value === 0) {
    if (!confirm('لم يتم إدخال أي كمية مستلمة. هل تريد المتابعة؟')) {
      return
    }
  }
  
  const payload = {
    warehouse_id: form.value.warehouse_id,
    lines: lines.value.map(l => ({
      line_id: l.line_id,
      quantity_received: l.quantity_received,
      notes: l.notes
    }))
  }
  
  try {
    loading.value = true
    await receivePurchaseOrder(id, payload)
    
    // Show success message
    alert('تم استلام البضاعة بنجاح!')
    
    // Navigate to order details
    router.push({ name: 'PurchaseOrderDetails', params: { id } })
  } catch (e: any) {
    console.error('Failed to submit receive', e)
    const errorMsg = e.response?.data?.message || 'فشل إرسال الاستلام. يرجى المحاولة مرة أخرى.'
    alert(`خطأ: ${errorMsg}`)
  } finally {
    loading.value = false
  }
}

const cancel = () => {
  if (totalReceivedQty.value > 0) {
    if (confirm('هناك كميات مدخلة لم يتم حفظها. هل تريد المغادرة دون حفظ؟')) {
      router.back()
    }
  } else {
    router.back()
  }
}
</script>

<style scoped>
/* Custom range slider styling */
input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

input[type="range"]::-moz-range-thumb {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

/* Smooth transitions */
* {
  transition: background-color 0.3s ease, border-color 0.3s ease, transform 0.2s ease;
}

/* Custom scrollbar for textareas */
textarea::-webkit-scrollbar {
  width: 6px;
}

textarea::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

textarea::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

textarea::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
</style>