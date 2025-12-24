<template>
  <div class="p-6 bg-gray-50 min-h-screen" dir="rtl">
    <div class="max-w-5xl mx-auto space-y-6">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <router-link to="/orders" class="text-gray-400 hover:text-gray-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </router-link>
          <div>
            <h1 class="text-2xl font-semibold text-gray-900">تفاصيل الطلب</h1>
            <div class="flex items-center gap-2 mt-1">
              <span class="text-sm text-gray-500">#{{ order?.code }}</span>
              <MBadge :variant="getStatusVariant(order?.status)">{{ order?.status }}</MBadge>
            </div>
          </div>
        </div>
        <div class="flex gap-2">
          <MButton variant="secondary" @click="openInvoice">طباعة الفاتورة</MButton>
          <MButton v-if="canEdit" variant="ghost" @click="editOrder">تعديل الطلب</MButton>
          <MButton variant="primary" @click="openCreateDelivery">إنشاء توصيل</MButton>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Info -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Order Info -->
          <MCard title="معلومات الطلب">
            <div class="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p class="text-sm text-gray-500">العميل</p>
                <router-link v-if="order?.customer" :to="{ name: 'CustomersView', params: { id: order.customer.id } }" class="font-medium text-primary-600 hover:underline">
                  {{ order.customer.name }}
                </router-link>
                <p class="text-xs text-gray-400">{{ order?.customer?.phone }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">تاريخ الطلب</p>
                <p class="font-medium">{{ formatDate(order?.order_date) }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">المبلغ الإجمالي</p>
                <p class="text-xl font-bold text-gray-900">{{ formatCurrency(order?.total) }}</p>
              </div>
            </div>
            <div class="p-4 border-t border-gray-100">
              <div class="flex flex-col sm:flex-row gap-3 items-end">
                <div class="flex-1">
                  <label class="block text-sm text-gray-500 mb-1">تحديث الحالة</label>
                  <select v-model="statusToSet" class="w-full px-3 py-2 border border-gray-200 rounded-lg">
                    <option value="">اختر الحالة</option>
                    <option v-for="s in allowedStatuses" :key="s" :value="s">{{ s }}</option>
                  </select>
                </div>
                <MButton variant="primary" @click="changeStatus" :disabled="!statusToSet">تطبيق</MButton>
              </div>
            </div>
          </MCard>

          <!-- Order Items -->
          <MCard title="عناصر الطلب" padding="p-0">
            <MTable>
              <template #header>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">المنتج</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">المتغير</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">الكمية</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">السعر</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">الإجمالي</th>
              </template>
              <tr v-for="l in order?.lines" :key="l.id" class="hover:bg-gray-50">
                <td class="px-4 py-3 font-medium text-gray-900">{{ l.product_variant?.product?.name }}</td>
                <td class="px-4 py-3 text-gray-500 text-sm">{{ formatAttributes(l.product_variant?.attributes) }}</td>
                <td class="px-4 py-3"><MBadge variant="info">{{ l.quantity }}</MBadge></td>
                <td class="px-4 py-3 text-gray-600">{{ formatCurrency(l.unit_price) }}</td>
                <td class="px-4 py-3 font-medium text-gray-900">{{ formatCurrency(l.total_price) }}</td>
              </tr>
            </MTable>
            <div class="p-4 border-t border-gray-100 text-left">
              <span class="text-gray-500">الإجمالي:</span>
              <span class="text-lg font-bold mr-2">{{ formatCurrency(order?.total) }}</span>
            </div>
          </MCard>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Delivery Address -->
          <MCard title="عنوان التوصيل">
            <div class="p-4">
              <div v-if="order?.delivery_address">
                <p class="font-medium text-gray-900">{{ order.delivery_address.city }} — {{ order.delivery_address.area }}</p>
                <p class="text-sm text-gray-500 mt-1">{{ order.delivery_address.street }}</p>
                <p v-if="order.delivery_address.notes" class="text-xs text-gray-400 mt-2 bg-yellow-50 p-2 rounded">{{ order.delivery_address.notes }}</p>
              </div>
              <p v-else class="text-gray-400 text-center py-4">لا يوجد عنوان</p>
            </div>
          </MCard>

          <!-- Summary -->
          <MCard title="ملخص">
            <div class="p-4 space-y-3">
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">عدد المنتجات</span>
                <span class="font-medium">{{ order?.lines?.length || 0 }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">حالة الطلب</span>
                <span class="font-medium">{{ order?.status }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">حالة الدفع</span>
                <MBadge :variant="getPaymentVariant(order?.payment_status)">{{ order?.payment_status }}</MBadge>
              </div>
              <div class="border-t pt-3 flex justify-between">
                <span class="font-semibold text-gray-900">الإجمالي</span>
                <span class="font-bold text-lg">{{ formatCurrency(order?.total) }}</span>
              </div>
            </div>
          </MCard>
        </div>
      </div>

      <!-- Create Delivery Modal -->
      <div v-if="showCreateDelivery" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-black/30" @click="closeCreate"></div>
        <MCard class="relative z-10 w-full max-w-md" title="إنشاء توصيل">
          <div class="p-4 space-y-4">
            <div>
              <label class="block text-sm text-gray-700 mb-1">مزود التوصيل</label>
              <select v-model.number="createForm.provider_id" class="w-full px-3 py-2 border border-gray-200 rounded-lg">
                <option value="">اختر مزوداً</option>
                <option v-for="p in providers" :key="p.id" :value="p.id">{{ p.name }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm text-gray-700 mb-1">الوقت المتوقع</label>
              <input v-model="createForm.estimated_delivery_time" type="datetime-local" class="w-full px-3 py-2 border border-gray-200 rounded-lg" />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm text-gray-700 mb-1">الوزن (كجم)</label>
                <input v-model.number="createForm.weight_kg" type="number" step="0.01" class="w-full px-3 py-2 border border-gray-200 rounded-lg" />
              </div>
              <div>
                <label class="block text-sm text-gray-700 mb-1">المسافة (كم)</label>
                <input v-model.number="createForm.distance_km" type="number" step="0.01" class="w-full px-3 py-2 border border-gray-200 rounded-lg" />
              </div>
            </div>
            <div class="bg-gray-50 p-3 rounded-lg">
              <p class="text-sm text-gray-500">التكلفة المتوقعة</p>
              <p class="text-lg font-bold">{{ previewFee !== null ? formatCurrency(previewFee) : '--' }}</p>
            </div>
          </div>
          <div class="flex gap-2 p-4 border-t border-gray-100">
            <MButton variant="secondary" @click="closeCreate" class="flex-1">إلغاء</MButton>
            <MButton variant="primary" @click="submitCreateDelivery" :loading="creating" :disabled="!createForm.provider_id" class="flex-1">إنشاء</MButton>
          </div>
        </MCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchOrder, updateOrderStatus, getOrderInvoiceUrl } from '../../api/orders'
import { fetchDeliveryProviders } from '../../api/deliveryProviders'
import { createDeliveryForOrder } from '../../api/deliveries'
import { formatAttributes } from '../../utils/helpers'
import MButton from '../../components/ui/MButton.vue'
import MCard from '../../components/ui/MCard.vue'
import MBadge from '../../components/ui/MBadge.vue'
import MTable from '../../components/ui/MTable.vue'

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id || 0)
const order = ref<any>(null)
const statusToSet = ref('')

const validTransitions: Record<string, string[]> = {
  draft: ['pending', 'cancelled'],
  pending: ['confirmed', 'cancelled'],
  confirmed: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered', 'returned'],
  delivered: ['returned'],
  cancelled: [],
  returned: []
}

const allowedStatuses = computed(() => validTransitions[order.value?.status] || [])

const load = async () => {
  if (!id) return
  try {
    const res = await fetchOrder(id)
    order.value = res?.data || null
  } catch (e) { console.error(e) }
}

const canEdit = computed(() => {
  const s = (order.value?.status || '').toString().toLowerCase()
  return s === 'pending' || s === 'draft'
})

const editOrder = () => {
  if (!order.value?.id) return
  router.push({ name: 'OrderEdit', params: { id: order.value.id } })
}

onMounted(() => load())

const formatDate = (iso?: string) => {
  if (!iso) return '—'
  try { return new Date(iso).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' }) } catch { return iso }
}

const formatCurrency = (val?: number) => {
  if (val == null) return '0.00 د.ل'
  return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(val) + ' د.ل'
}

const getStatusVariant = (s?: string): 'success' | 'warning' | 'error' | 'neutral' | 'info' => {
  const m: any = { delivered: 'success', shipped: 'info', processing: 'warning', cancelled: 'error', pending: 'warning' }
  return m[s?.toLowerCase() || ''] || 'neutral'
}

const getPaymentVariant = (s?: string): 'success' | 'warning' | 'error' | 'neutral' => {
  const m: any = { paid: 'success', pending: 'warning', failed: 'error' }
  return m[s?.toLowerCase() || ''] || 'neutral'
}

const openInvoice = () => {
  if (!order.value?.id) return
  window.open(getOrderInvoiceUrl(order.value.id), '_blank')
}

const changeStatus = async () => {
  if (!order.value?.id || !statusToSet.value) return
  try {
    await updateOrderStatus(order.value.id, statusToSet.value)
    await load()
    statusToSet.value = ''
  } catch (e) { console.error(e) }
}

// Delivery Modal
const showCreateDelivery = ref(false)
const providers = ref<any[]>([])
const createForm = ref<any>({ provider_id: null, estimated_delivery_time: '', weight_kg: null, distance_km: null })
const creating = ref(false)

const openCreateDelivery = async () => {
  showCreateDelivery.value = true
  try {
    const res = await fetchDeliveryProviders(1)
    providers.value = res?.data?.data ?? res?.data ?? []
  } catch (e) { providers.value = [] }
}

const closeCreate = () => {
  showCreateDelivery.value = false
  createForm.value = { provider_id: null, estimated_delivery_time: '', weight_kg: null, distance_km: null }
}

const previewFee = computed(() => {
  const prov = providers.value.find((p: any) => p.id === createForm.value.provider_id)
  if (!prov) return null
  const pr = prov.pricing_rules || {}
  const base = Number(pr.base_fee || 0)
  const w = Number(createForm.value.weight_kg || 0) * Number(pr.weight_rate || 0)
  const d = Number(createForm.value.distance_km || 0) * Number(pr.distance_rate || 0)
  return base + w + d
})

const submitCreateDelivery = async () => {
  if (!order.value?.id || !createForm.value.provider_id) return
  creating.value = true
  try {
    const res = await createDeliveryForOrder(order.value.id, createForm.value)
    closeCreate()
    if (res?.data?.id) router.push({ path: `/deliveries/${res.data.id}` })
  } catch (e) { console.error(e) }
  finally { creating.value = false }
}
</script>

<style scoped>
</style>