<template>
  <div class="p-6 bg-gray-50 min-h-screen" dir="rtl">
    <div v-if="loading" class="text-center py-12 text-gray-500">جاري التحميل...</div>
    <div v-else class="max-w-5xl mx-auto space-y-6">
      
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <router-link to="/purchase-orders" class="text-gray-400 hover:text-gray-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </router-link>
          <div>
            <h1 class="text-2xl font-semibold text-gray-900">طلب شراء #{{ order.code || order.id }}</h1>
            <div class="flex items-center gap-2 mt-1">
              <MBadge :variant="getStatusVariant(order.status)">{{ getStatusText(order.status) }}</MBadge>
              <span class="text-xs text-gray-400">{{ formatDate(order.order_date) }}</span>
            </div>
          </div>
        </div>
        <div class="flex gap-2">
          <MButton variant="secondary" @click="printOrder">طباعة</MButton>
          <MButton v-if="canReceiveOrder" variant="primary" @click="receiveOrder">استلام الطلب</MButton>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          
          <!-- Supplier Card -->
          <MCard title="بيانات المورد">
            <div class="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                  </svg>
                </div>
                <div>
                  <p class="font-medium text-gray-900">{{ order.supplier?.name || '-' }}</p>
                  <p class="text-sm text-gray-500">{{ order.supplier?.contact_name || '-' }}</p>
                </div>
              </div>
              <div class="space-y-1">
                <p v-if="order.supplier?.phone" class="text-xs text-gray-500 flex items-center gap-1">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1.01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                  {{ order.supplier.phone }}
                </p>
                <p v-if="order.supplier?.email" class="text-xs text-gray-500 flex items-center gap-1">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 8l7.89-4.26a2 2 0 012.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                  {{ order.supplier.email }}
                </p>
              </div>
            </div>
            
            <div class="p-4 border-t border-gray-100">
              <div class="flex flex-col sm:flex-row gap-4 items-end">
                <div class="flex-1">
                  <label class="block text-xs text-gray-500 mb-1">تغيير حالة الطلب</label>
                  <select v-model="selectedStatus" :disabled="allowedStatusOptions.length === 0" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                    <option value="">{{ allowedStatusOptions.length ? 'اختر حالة جديدة' : 'لا توجد حالات متاحة' }}</option>
                    <option v-for="opt in allowedStatusOptions" :key="opt.value" :value="opt.value">{{ opt.text }}</option>
                  </select>

                </div>
                <MButton variant="secondary" size="sm" @click="saveStatus" :disabled="!selectedStatus || selectedStatus === order.status || savingStatus">تطبيق</MButton>
              </div>
            </div>
          </MCard>

          <!-- Order Items Card -->
          <MCard title="عناصر الطلب" padding="p-0">
            <MTable>
              <template #header>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">الصنف</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">الكمية</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">المستلم</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">السعر</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">المجموع</th>
              </template>
              <tr v-for="item in order.lines" :key="item.id" class="hover:bg-gray-50">
                <td class="px-4 py-3">
                  <p class="font-medium text-gray-900 text-sm">{{ item.product_variant?.product?.name }}</p>
                  <p class="text-[10px] text-gray-400">{{ item.product_variant?.sku_variant }} {{ formatAttributes(item.product_variant?.attributes) }}</p>
                </td>
                <td class="px-4 py-3 text-sm text-gray-600 font-mono">{{ item.quantity_ordered }}</td>
                <td class="px-4 py-3">
                  <MBadge :variant="item.quantity_received >= item.quantity_ordered ? 'success' : (item.quantity_received > 0 ? 'warning' : 'neutral')">
                    {{ item.quantity_received || 0 }}
                  </MBadge>
                </td>
                <td class="px-4 py-3 text-sm text-gray-600 font-mono">{{ formatCurrency(item.unit_price) }}</td>
                <td class="px-4 py-3 text-sm font-semibold text-gray-900 font-mono">{{ formatCurrency(item.quantity_ordered * item.unit_price) }}</td>
              </tr>
            </MTable>
            
            <div class="p-4 border-t border-gray-100 flex justify-end">
              <div class="w-full md:w-1/2 space-y-2">
                <div class="flex justify-between text-xs text-gray-500">
                  <span>إجمالي الكميات:</span>
                  <span class="font-medium text-gray-700 font-mono">{{ totalQuantityOrdered }}</span>
                </div>
                <div class="flex justify-between text-base font-bold text-gray-900 border-t border-gray-50 pt-2">
                  <span>الإجمالي نهائي:</span>
                  <span class="font-mono">{{ formatCurrency(order.total_amount) }}</span>
                </div>
              </div>
            </div>
          </MCard>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <MCard title="معلومات إضافية">
            <div class="p-4 space-y-4">
              <div>
                <p class="text-xs text-gray-400 uppercase mb-1">تاريخ التوصيل المتوقع</p>
                <p class="font-medium text-gray-900">{{ formatDate(order.expected_delivery_date) }}</p>
              </div>
              <div v-if="order.approved_at">
                <p class="text-xs text-gray-400 uppercase mb-1">تم الاعتماد في</p>
                <p class="font-medium text-gray-900">{{ formatDateTime(order.approved_at) }}</p>
                <p class="text-[10px] text-gray-500">بواسطة: {{ order.approved_by?.name }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-400 uppercase mb-1">حالة الدفع</p>
                <p class="font-medium text-gray-900">{{ getPaymentStatusText(order.payment_status) }}</p>
                <div class="mt-2 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div class="h-full bg-green-500" :style="{ width: `${(order.paid_amount/order.total_amount)*100}%` }"></div>
                </div>
                <div class="flex justify-between mt-1 text-[10px] font-mono text-gray-400">
                  <span>{{ formatCurrency(order.paid_amount) }}</span>
                  <span>{{ formatCurrency(order.total_amount) }}</span>
                </div>
              </div>
            </div>
          </MCard>

          <MCard title="ملاحظات الطلب">
            <div class="p-4">
              <p v-if="order.notes" class="text-sm text-gray-600 leading-relaxed">{{ order.notes }}</p>
              <p v-else class="text-sm text-gray-400 italic text-center py-4">لا توجد ملاحظات</p>
            </div>
          </MCard>
          
          <div class="space-y-2">
            <MButton variant="secondary" class="w-full" @click="editOrder">تعديل الطلب</MButton>
            <MButton variant="ghost" class="w-full text-red-500 hover:bg-red-50">إلغاء الطلب</MButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { request } from '../../api'
import { updatePurchaseOrderStatus } from '../../api/purchaseOrders'
import MButton from '../../components/ui/MButton.vue'
import MCard from '../../components/ui/MCard.vue'
import MBadge from '../../components/ui/MBadge.vue'
import MTable from '../../components/ui/MTable.vue'
import { useToast } from '../../composables/useToast'
import { useConfirm } from '../../composables/useConfirm'
import { formatAttributes, formatCurrency, formatDate ,formatDateTime } from '../../utils/helpers'

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id)
const { addToast } = useToast()
const { confirm: confirmDialog } = useConfirm()

const order = ref<any>({})
const loading = ref(false)
const selectedStatus = ref('')
const savingStatus = ref(false)

const statusMap: any = {
  draft: 'مسودة',
  pending: 'قيد الانتظار',
  ordered: 'تم الطلب',
  approved: 'معتمد',
  partially_received: 'مستلم جزئياً',
  received: 'مستلم',
  cancelled: 'ملغي'
}

const canReceiveOrder = computed(() => ['ordered', 'partially_received'].includes(order.value.status))
const totalQuantityOrdered = computed(() => order.value.lines?.reduce((s: number, l: any) => s + (l.quantity_ordered || 0), 0) || 0)

// Define allowed transitions to mirror backend business rules
const allowedTransitions: any = {
  draft: ['pending', 'cancelled'],
  pending: ['approved', 'cancelled'],
  approved: ['ordered', 'cancelled'],
  ordered: ['cancelled'],
 // partially_received: ['received', 'cancelled'],
 // received: [],
  cancelled: []
}

const allowedStatusOptions = computed(() => {
  const cur = (order.value.status || '').toLowerCase()
  const arr = allowedTransitions[cur] || []
  return arr.map((v: string) => ({ value: v, text: statusMap[v] || v }))
})



const getStatusVariant = (s?: string): any => {
  const m: any = { received: 'success', ordered: 'info', pending: 'warning', approved: 'success', cancelled: 'error', partially_received: 'warning' }
  return m[s?.toLowerCase() || ''] || 'neutral'
}

const getStatusText = (s: string) => statusMap[s] || s

const getPaymentStatusText = (status: string) => {
  const texts: any = { pending: 'قيد الانتظار', partial: 'مدفوع جزئياً', paid: 'مدفوع بالكامل', overdue: 'متأخر' }
  return texts[status] || status
}







const load = async () => {
  if (!id) return
  loading.value = true
  try {
    const res = await request(`/purchase-orders/${id}`)
    order.value = res?.data || res || {}
    selectedStatus.value = ''
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const saveStatus = async () => {
  if (!id || !selectedStatus.value) return
  const cur = (order.value.status || '').toLowerCase()
  const allowed = allowedTransitions[cur] || []
  if (!allowed.includes(selectedStatus.value)) {
    addToast('هذا الانتقال غير مسموح', 'error')
    return
  }
  
  const ok = await confirmDialog({
    title: 'تأكيد تغيير الحالة',
    message: `هل أنت متأكد من تغيير حالة الطلب إلى ${getStatusText(selectedStatus.value)}؟`,
    type: 'warning',
    confirmText: 'نعم، تغيير',
    cancelText: 'تراجع'
  })
  
  if (!ok) return
  
  savingStatus.value = true
  try {
    await updatePurchaseOrderStatus(id, selectedStatus.value)
    await load()
    addToast('تم تحديث حالة الطلب بنجاح')
  } catch (e) { 
    console.error(e) 
    addToast('فشل تحديث الحالة', 'error')
  }
  finally { savingStatus.value = false }
}

const receiveOrder = () => router.push({ name: 'PurchaseOrderReceiveCreate', query: { purchase_order_id: id } })
const editOrder = () => router.push({ name: 'PurchaseOrderEdit', params: { id } })
const printOrder = () => window.print()

onMounted(() => load())
</script>

<style scoped>
@media print {
  .bg-gray-50 { background-color: white !important; }
  .p-6 { padding: 0 !important; }
  .max-w-5xl { max-width: 100% !important; width: 100% !important; }
  button, .router-link, select, .MButton { display: none !important; }
  .MCard { border: 1px solid #eee !important; box-shadow: none !important; margin-bottom: 20px !important; }
}
</style>