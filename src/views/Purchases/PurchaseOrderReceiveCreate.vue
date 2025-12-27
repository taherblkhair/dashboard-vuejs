<template>
  <div class="p-6 bg-gray-50 min-h-screen" dir="rtl">
    <div class="max-w-4xl mx-auto space-y-6">
      
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900">استلام طلب شراء</h1>
          <p class="text-sm text-gray-500 mt-1">قم بتحديد المخزن والكميات المستلمة لكل بند</p>
        </div>
        <MButton variant="secondary" @click="cancel">إلغاء</MButton>
      </div>

      <!-- Order Info -->
      <MCard v-if="order">
        <div class="flex flex-col md:flex-row gap-6 justify-between items-center">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-primary-50 rounded-lg">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 text-lg">طلب #{{ order.code }}</h3>
              <p class="text-sm text-gray-500">المورد: {{ order.supplier?.name }}</p>
            </div>
          </div>
          
          <div class="flex gap-8 text-center">
            <div>
              <div class="text-2xl font-bold text-gray-900">{{ totalRequestedQty }}</div>
              <div class="text-xs text-gray-500">مطلوب</div>
            </div>
            <div class="w-px bg-gray-200"></div>
            <div>
              <div class="text-2xl font-bold text-green-600">{{ totalReceivedQty }}</div>
              <div class="text-xs text-gray-500">مستلم حالياً</div>
            </div>
          </div>
        </div>
      </MCard>

      <!-- Main Form -->
      <MCard :loading="loading">
        <div class="space-y-8">
          
          <!-- Warehouse -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">المخزن المستلم فيه <span class="text-red-500">*</span></label>
            <select 
              v-model="form.warehouse_id" 
              class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            >
              <option :value="undefined" disabled>اختر المخزن</option>
              <option v-for="w in warehouses" :key="w.id" :value="w.id">{{ w.name }}</option>
            </select>
          </div>

          <div class="border-t border-gray-100 my-6"></div>

          <!-- Lines -->
          <div class="space-y-6">
            <h3 class="font-medium text-gray-900 flex items-center gap-2">
              بنود الطلب
              <span class="text-sm font-normal text-gray-500">({{ order?.lines?.length || 0 }} بند)</span>
            </h3>

            <div v-if="!order?.lines?.length" class="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
               <span class="text-gray-400">لا توجد بنود</span>
            </div>

            <div v-else class="space-y-4">
              <div v-for="(line, idx) in order.lines" :key="line.id" 
                   class="bg-gray-50 rounded-xl p-5 border border-gray-200 hover:border-primary-200 transition-colors"
                   :class="{'border-red-300 bg-red-50': lineErrors[idx]}">
                
                <!-- Line Header -->
                <div class="flex justify-between items-start mb-4">
                  <div>
                    <h4 class="font-medium text-gray-900">{{ line.product?.name || line.product_name }}</h4>
                    <p class="text-sm text-gray-500 mt-0.5">{{ formatVariant(line) }}</p>
                  </div>
                  <div class="text-right">
                    <span class="text-xs text-gray-500 block mb-1">الكمية المطلوبة</span>
                    <span class="font-mono font-medium text-gray-900 bg-white px-2 py-1 rounded border border-gray-200">
                      {{ getRequestedQtyForLine(line.id) }}
                    </span>
                  </div>
                </div>

                <!-- Inputs -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">الكمية المستلمة</label>
                    <div class="flex items-center gap-3">
                         <input 
                           type="number"
                           v-model.number="lines[idx].quantity_received"
                           :max="getRequestedQtyForLine(line.id)"
                           min="0"
                           class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 font-mono text-center"
                           @input="validateLine(idx)"
                         />
                    </div>
                    
                    <!-- Slider -->
                    <input 
                      type="range"
                      v-model.number="lines[idx].quantity_received"
                      :max="getRequestedQtyForLine(line.id)"
                      min="0"
                      class="w-full mt-3 accent-primary-600"
                      @input="validateLine(idx)"
                    />
                    
                    <p v-if="lineErrors[idx]" class="text-xs text-red-600 mt-1">{{ lineErrors[idx] }}</p>
                  </div>

                  <div>
                     <label class="block text-xs font-medium text-gray-700 mb-1">ملاحظات</label>
                     <textarea 
                       v-model="lines[idx].notes" 
                       rows="2"
                       class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
                       placeholder="ملاحظات على الاستلام..."
                     ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Summary & Actions -->
          <div class="bg-primary-50 rounded-xl p-6 border border-primary-100 flex flex-col md:flex-row justify-between items-center gap-6">
             <div>
                <span class="text-sm text-gray-600 block mb-1">التقدم الكلي</span>
                <div class="flex items-center gap-3">
                   <div class="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div class="h-full bg-green-500 transition-all duration-500" :style="{ width: `${completionPercentage}%` }"></div>
                   </div>
                   <span class="font-bold text-gray-900">{{ completionPercentage }}%</span>
                </div>
             </div>

             <div class="flex gap-3 w-full md:w-auto">
                <MButton variant="secondary" class="flex-1 md:flex-none" @click="cancel">إلغاء</MButton>
                <MButton 
                  variant="primary" 
                  class="flex-1 md:flex-none" 
                  :disabled="!canSubmit"
                  :loading="loading"
                  @click="submitReceive"
                >
                  تأكيد الاستلام
                </MButton>
             </div>
          </div>

        </div>
      </MCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchPurchaseOrder, receivePurchaseOrder } from '../../api/purchaseOrders'
import { formatAttributes } from '../../utils/helpers'
import { fetchWarehouses } from '../../api/warehouses'
import MCard from '../../components/ui/MCard.vue'
import MButton from '../../components/ui/MButton.vue'
import { useToast } from '../../composables/useToast'
import { useConfirm } from '../../composables/useConfirm'

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id || 0)

const { addToast } = useToast()
const { confirm: confirmDialog } = useConfirm()

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
    addToast('خطأ: رقم الطلب غير موجود', 'error')
    return
  }
  
  if (!form.value.warehouse_id) {
    addToast('يرجى اختيار المخزن', 'error')
    return
  }
  
  if (!validateAllLines()) {
    addToast('يرجى تصحيح الأخطاء في الكميات المدخلة', 'error')
    return
  }
  
  if (totalReceivedQty.value === 0) {
    const ok = await confirmDialog({
      title: 'تأكيد الاستلام',
      message: 'لم يتم إدخال أي كمية مستلمة. هل أنت متأكد من المتابعة؟',
      type: 'warning',
      confirmText: 'نعم، متابعة'
    })
    if (!ok) return
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
    
    addToast('تم استلام البضاعة بنجاح!')
    
    router.push({ name: 'PurchaseOrderDetails', params: { id } })
  } catch (e: any) {
    console.error('Failed to submit receive', e)
    const errorMsg = e.response?.data?.message || 'فشل إرسال الاستلام. يرجى المحاولة مرة أخرى.'
    addToast(`خطأ: ${errorMsg}`, 'error')
  } finally {
    loading.value = false
  }
}

const cancel = async () => {
  if (totalReceivedQty.value > 0) {
    const ok = await confirmDialog({
      title: 'إلغاء الاستلام',
      message: 'هناك كميات مدخلة لم يتم حفظها. هل تريد المغادرة دون حفظ؟',
      type: 'warning',
      confirmText: 'نعم، مغادرة'
    })
    if (ok) router.back()
  } else {
    router.back()
  }
}
</script>

<style scoped>
</style>