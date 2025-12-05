<template>
  <div class="p-6 bg-gray-50 min-h-screen" dir="rtl">
    <div class="max-w-4xl mx-auto">
      <div class="mb-4">
        <h1 class="text-2xl font-bold">تفاصيل الطلب</h1>
        <p class="text-sm text-gray-500">#{{ order?.code }}</p>
      </div>

  <div class="bg-white rounded shadow p-4 mb-4 flex items-start justify-between gap-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div class="text-sm text-gray-500">العميل</div>
            <div class="font-medium"><router-link :to="{ name: 'CustomersView', params: { id: order?.customer?.id } }" class="text-blue-600">{{ order?.customer?.name }}</router-link></div>
            <div class="text-xs text-gray-500">{{ order?.customer?.email }} • {{ order?.customer?.phone }}</div>
          </div>
          <div>
            <div class="text-sm text-gray-500">حالة الطلب</div>
              <div class="font-medium">{{ order?.status }}</div>
              <div class="text-sm text-gray-500">حالة الدفع</div>
              <div class="font-medium">{{ order?.payment_status }}</div>
          </div>
            <div class="text-left">
            <div class="text-sm text-gray-500">المبلغ</div>
            <div class="font-medium">{{ formatCurrency(order?.total) }}</div>
            <div class="text-xs text-gray-500">تاريخ الطلب: {{ formatDate(order?.order_date) }}</div>
          </div>
            <div class="flex flex-col items-end gap-2">
              <div class="flex gap-2">
                <button @click="openInvoice" class="px-3 py-1 bg-gray-100 rounded">طباعة / فاتورة</button>
              </div>
              <div class="flex items-center gap-2">
                          <button @click="openCreateDelivery" class="px-3 py-1 bg-green-600 text-white rounded text-sm">إنشاء توصيل</button>
                <select v-model="statusToSet" class="border rounded px-2 py-1 text-sm">
                  <option value="">تغيير الحالة</option>
                  <option v-for="s in allowedStatuses" :key="s" :value="s">{{ s }}</option>
                </select>
                <button @click="changeStatus" :disabled="!statusToSet" class="px-3 py-1 bg-blue-600 text-white rounded text-sm">تطبيق</button>
              </div>
            </div>
        </div>
      </div>

      <div class="bg-white rounded shadow p-4 mb-4">
        <h3 class="font-medium mb-2">عنوان التوصيل</h3>
        <div v-if="order?.delivery_address">
          <div class="font-semibold">{{ order.delivery_address.city }} — {{ order.delivery_address.area }}</div>
          <div class="text-sm text-gray-600">{{ order.delivery_address.street }} {{ order.delivery_address.building ? '، ' + order.delivery_address.building : '' }}</div>
          <div v-if="order.delivery_address.notes" class="text-xs text-gray-500">{{ order.delivery_address.notes }}</div>
        </div>
        <div v-else class="text-gray-500">لا يوجد عنوان توصيل</div>
      </div>

      <div class="bg-white rounded shadow p-4">
        <h3 class="font-medium mb-3">العناصر</h3>
        <div v-if="!order?.lines || order.lines.length === 0" class="text-gray-500">لا توجد عناصر</div>
        <div v-else class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead>
              <tr class="text-left text-xs text-gray-500">
                <th class="px-2 py-2">المنتج</th>
                <th class="px-2 py-2">SKU / المتغير</th>
                <th class="px-2 py-2">الكمية</th>
                <th class="px-2 py-2">سعر الوحدة</th>
                <th class="px-2 py-2">الإجمالي</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="l in order.lines" :key="l.id" class="border-t">
                <td class="px-2 py-2">{{ l.product_variant?.product?.name }}</td>
                <td class="px-2 py-2">{{ l.product_variant?.sku_variant }} {{ formatAttributes(l.product_variant?.attributes) ? '— ' + formatAttributes(l.product_variant?.attributes) : '' }}</td>
                <td class="px-2 py-2">{{ l.quantity }}</td>
                <td class="px-2 py-2">{{ formatCurrency(l.unit_price) }}</td>
                <td class="px-2 py-2">{{ formatCurrency(l.total_price) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  <!-- Create Delivery Modal -->
  <div v-if="showCreateDelivery" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div class="bg-white rounded shadow max-w-md w-full p-4">
      <h3 class="font-semibold mb-2">إنشاء توصيل للطلب #{{ order?.code }}</h3>
      <div class="space-y-2">
        <div>
          <label class="text-sm">مزود التوصيل</label>
          <select v-model.number="createForm.provider_id" class="w-full border rounded px-2 py-1 mt-1">
            <option value="" disabled>اختر مزوداً</option>
            <option v-for="p in providers" :key="p.id" :value="p.id">{{ p.name }} — {{ p.phone }}</option>
          </select>
        </div>

        <div>
          <label class="text-sm">التاريخ والوقت المتوقع</label>
          <input v-model="createForm.estimated_delivery_time" type="datetime-local" class="w-full border rounded px-2 py-1 mt-1" />
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="text-sm">الوزن (kg)</label>
            <input v-model.number="createForm.weight_kg" type="number" step="0.01" class="w-full border rounded px-2 py-1 mt-1" />
          </div>
          <div>
            <label class="text-sm">المسافة (km)</label>
            <input v-model.number="createForm.distance_km" type="number" step="0.01" class="w-full border rounded px-2 py-1 mt-1" />
          </div>
        </div>

        <div>
          <div class="text-sm text-gray-600">المعاينة: <strong v-if="previewFee !== null">{{ formatCurrency(previewFee) }}</strong><span v-else>اختَر مزوداً لرؤية المعاينة</span></div>
        </div>

        <div class="flex justify-end gap-2 mt-3">
          <button @click="closeCreate" class="px-3 py-1 bg-gray-200 rounded">إلغاء</button>
          <button @click="submitCreateDelivery" :disabled="creating" class="px-3 py-1 bg-green-600 text-white rounded">{{ creating ? 'جارٍ الإنشاء...' : 'إنشاء' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { fetchOrder } from '../../api/orders'
import { formatAttributes } from '../../utils/helpers'
import { updateOrderStatus, getOrderInvoiceUrl } from '../../api/orders'

const route = useRoute()
const id = Number(route.params.id || 0)
const order = ref<any>(null)
const statusToSet = ref('')

// valid transitions map (keys are current status -> allowed next statuses)
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

const allowedStatuses = computed(() => {
  const cur = order.value?.status
  if (!cur) return []
  return validTransitions[cur] || []
})

const load = async () => {
  if (!id) return
  try {
    const res = await fetchOrder(id)
    order.value = res?.data || null
  } catch (e) {
    console.error('Failed to load order', e)
  }
}

onMounted(() => load())

const formatDate = (iso?: string) => {
  if (!iso) return '—'
  try { return new Date(iso).toLocaleDateString() } catch { return iso }
}

const formatCurrency = (val?: string | number) => {
  if (val === null || val === undefined || val === '') return '0.00'
  const num = typeof val === 'number' ? val : Number(String(val))
  if (Number.isNaN(num)) return String(val)
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(num)
}

const openInvoice = () => {
  if (!order.value?.id) return
  const url = getOrderInvoiceUrl(order.value.id)
  window.open(url, '_blank')
}

const changeStatus = async () => {
  if (!order.value?.id || !statusToSet.value) return
  try {
    await updateOrderStatus(order.value.id, statusToSet.value)
    // reload
    await load()
    statusToSet.value = ''
    alert('تم تحديث حالة الطلب')
  } catch (e) {
    console.error('Failed to update status', e)
    alert('فشل تحديث الحالة')
  }
}

// Create delivery modal logic
import { useRouter } from 'vue-router'
import { fetchDeliveryProviders } from '../../api/deliveryProviders'
import { createDeliveryForOrder } from '../../api/deliveries'

const router = useRouter()
const showCreateDelivery = ref(false)
const providers = ref<any[]>([])
const createForm = ref<any>({ provider_id: null, estimated_delivery_time: '', weight_kg: null, distance_km: null })
const creating = ref(false)

const openCreateDelivery = async () => {
  showCreateDelivery.value = true
  // preload providers
  try {
    const res = await fetchDeliveryProviders(1)
    providers.value = res?.data?.data ?? res?.data ?? []
  } catch (e) {
    console.error('Failed to load providers', e)
    providers.value = []
  }
}

const closeCreate = () => {
  showCreateDelivery.value = false
}

const previewFee = computed(() => {
  const pid = createForm.value.provider_id
  const prov = providers.value.find((p: any) => p.id === pid)
  if (!prov) return null
  const pr = prov.pricing_rules || {}
  const base = Number(pr.base_fee || 0)
  const weightRate = Number(pr.weight_rate || 0)
  const distanceRate = Number(pr.distance_rate || 0)
  const areaFee = (() => {
    try {
      const city = order.value?.delivery_address?.city
      return Number(pr.area_fees?.[city] ?? 0)
    } catch { return 0 }
  })()
  const w = Number(createForm.value.weight_kg || 0)
  const d = Number(createForm.value.distance_km || 0)
  return base + areaFee + (w * weightRate) + (d * distanceRate)
})

const submitCreateDelivery = async () => {
  if (!order.value?.id) return
  if (!createForm.value.provider_id) return alert('الرجاء اختيار مزود')
  creating.value = true
  try {
    const payload = {
      provider_id: createForm.value.provider_id,
      estimated_delivery_time: createForm.value.estimated_delivery_time,
      weight_kg: createForm.value.weight_kg,
      distance_km: createForm.value.distance_km,
    }
    const res = await createDeliveryForOrder(order.value.id, payload)
    const created = res?.data?.data ?? res?.data ?? res
    alert('تم إنشاء التوصيل بنجاح')
    showCreateDelivery.value = false
    // navigate to delivery details
    if (created?.id) router.push({ path: `/deliveries/${created.id}` })
  } catch (e) {
    console.error('Failed to create delivery', e)
    alert('فشل إنشاء التوصيل')
  } finally {
    creating.value = false
  }
}
</script>

<style scoped>
</style>
