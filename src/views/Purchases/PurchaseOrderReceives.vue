<template>
  <div class="p-6 bg-gray-50 min-h-screen" dir="rtl">
    <div class="max-w-7xl mx-auto space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900">استلام طلبات الشراء</h1>
          <p class="text-sm text-gray-500 mt-1">قائمة الطلبات المتاحة للاستلام أو سجل الاستلام</p>
        </div>
      </div>

      <MCard padding="p-0">
        <div v-if="loading" class="text-center py-12 text-gray-500">جاري التحميل...</div>
        <div v-else-if="orders.length === 0" class="text-center py-12 text-gray-500">لا توجد طلبات متاحة للاستلام</div>
        
        <MTable v-else>
          <template #header>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">الرمز</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">المورد</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">الحالة</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">الإجمالي</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">تاريخ الطلب</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">الإجراءات</th>
          </template>
          <tr v-for="o in orders" :key="o.id" class="hover:bg-gray-50">
            <td class="px-4 py-3">
              <span class="font-medium text-gray-900">{{ o.code }}</span>
              <span class="text-xs text-gray-400 block">#{{ o.id }}</span>
            </td>
            <td class="px-4 py-3 text-gray-600">{{ o.supplier?.name || '-' }}</td>
            <td class="px-4 py-3">
              <MBadge :variant="getStatusVariant(o.status)">{{ getStatusText(o.status) }}</MBadge>
            </td>
            <td class="px-4 py-3 font-medium text-gray-900">{{ formatCurrency(o.total_amount) }}</td>
            <td class="px-4 py-3 text-gray-600 text-sm">{{ formatDate(o.order_date) }}</td>
            <td class="px-4 py-3">
              <ActionMenu :items="getActions(o)" />
            </td>
          </tr>
        </MTable>
      </MCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineComponent, h } from 'vue'
import { useRouter } from 'vue-router'
import { fetchPurchaseOrders } from '../../api/purchaseOrders'
import MCard from '../../components/ui/MCard.vue'
import MBadge from '../../components/ui/MBadge.vue'
import MTable from '../../components/ui/MTable.vue'
import ActionMenu from '../../components/ui/ActionMenu.vue'

// Icons
const IconEye = defineComponent({ render: () => h('svg', { fill:'none', viewBox:'0 0 24 24', stroke:'currentColor', class:'w-4 h-4' }, [h('path', { 'stroke-linecap':'round', 'stroke-linejoin':'round', 'stroke-width':'2', d:'M15 12a3 3 0 11-6 0 3 3 0 016 0z' }), h('path', { 'stroke-linecap':'round', 'stroke-linejoin':'round', 'stroke-width':'2', d:'M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' })]) })
const IconInboxIn = defineComponent({ render: () => h('svg', { fill:'none', viewBox:'0 0 24 24', stroke:'currentColor', class:'w-4 h-4' }, [h('path', { 'stroke-linecap':'round', 'stroke-linejoin':'round', 'stroke-width':'2', d:'M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20' })]) })

const router = useRouter()
const orders = ref<any[]>([])
const loading = ref(false)

const load = async () => {
  loading.value = true
  try {
    const res = await fetchPurchaseOrders(1)
    // show only orders that are still 'ordered' (ready to be received)
    const all = res?.data || []
    orders.value = all.filter((o: any) => (o.status || '').toString().toLowerCase() === 'ordered' || (o.status || '').toString().toLowerCase() === 'partially_received')
  } catch (e) {
    console.error('Failed to fetch purchase orders for receives', e)
  } finally {
    loading.value = false
  }
}

onMounted(() => load())

const getActions = (order: any) => {
  const actions = [
    { label: 'عرض التفاصيل', action: () => viewOrder(order.id), icon: IconEye }
  ]
  
  // Allow receive if ordered or partially_received
  if (['ordered', 'partially_received'].includes(order.status)) {
    actions.unshift({ label: 'استلام المخزون', action: () => receiveOrder(order.id), icon: IconInboxIn })
  }
  
  return actions
}

const formatDate = (iso?: string) => {
  if (!iso) return '-'
  try { return new Date(iso).toLocaleDateString('ar-SA', { year: 'numeric', month: 'short', day: 'numeric' }) } catch { return iso }
}

const formatCurrency = (v?: number) => {
  if (v == null) return '0.00 د.ل'
  return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(v) + ' د.ل'
}

const getStatusText = (s: string) => {
  const m: any = { pending: 'معلق', ordered: 'تم الطلب', partially_received: 'مستلم جزئياً', received: 'مستلم', cancelled: 'ملغي' }
  return m[s] || s
}

const getStatusVariant = (s: string): 'success' | 'warning' | 'error' | 'info' | 'neutral' => {
  const m: any = { pending: 'warning', ordered: 'info', partially_received: 'warning', received: 'success', cancelled: 'error' }
  return m[s] || 'neutral'
}

const receiveOrder = (id?: number) => {
  if (!id) return
  router.push({ name: 'PurchaseOrderReceiveCreate', params: { id } })
}

const viewOrder = (id?: number) => {
  if (!id) return
  router.push({ name: 'PurchaseOrderDetails', params: { id } })
}
</script>

<style scoped>
</style>
