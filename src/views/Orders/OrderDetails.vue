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
</script>

<style scoped>
</style>
