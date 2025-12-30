<template>
  <div class="p-6 bg-gray-50 min-h-screen" dir="rtl">
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="space-y-1">
          <h1 class="text-3xl font-black text-slate-900 tracking-tight">إدارة الطلبات</h1>
          <p class="text-slate-500 font-medium">قائمة وشاملة لجميع طلبات المبيعات وتحصيلها</p>
        </div>
        <div class="flex items-center gap-4">
          <MButton
            variant="secondary"
            size="sm"
            @click="loadOrders(1)"
            :loading="loading"
            class="!rounded-xl"
          >
            <template #icon>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
            </template>
            تحديث
          </MButton>
          <MButton
            variant="primary"
            class="!rounded-2xl shadow-lg shadow-indigo-200"
            @click="createOrder"
          >
            <template #icon>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
            </template>
            إنشاء طلب جديد
          </MButton>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MStatsCard
          label="إجمالي الطلبات"
          :value="stats.total_orders || 0"
          variant="indigo"
        >
          <template #icon>
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </template>
        </MStatsCard>

        <MStatsCard
          label="طلبات اليوم"
          :value="stats.today_orders || 0"
          variant="emerald"
        >
          <template #icon>
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 00-2 2z" />
            </svg>
          </template>
        </MStatsCard>

        <MStatsCard
          label="قيد المعالجة"
          :value="stats.processing_orders || 0"
          variant="amber"
        >
          <template #icon>
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </template>
        </MStatsCard>

        <MStatsCard
          label="طلبات معلقة"
          :value="stats.pending_orders || 0"
          variant="rose"
        >
          <template #icon>
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </template>
        </MStatsCard>
      </div>

      <!-- Filters -->
      <MCard title="تصفية الطلبات">
        <div class="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <MInput v-model="filters.q" label="بحث" placeholder="كود الطلب، اسم العميل..." />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">حالة الطلب</label>
            <select v-model="filters.status" class="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="">كل الحالات</option>
              <option value="pending">معلق</option>
              <option value="confirmed">تم التأكيد</option>
              <option value="processing">قيد المعالجة</option>
              <option value="shipped">تم الشحن</option>
              <option value="delivered">تم التسليم</option>
              <option value="cancelled">ملغي</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">حالة الدفع</label>
            <select v-model="filters.payment_status" class="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="">كل حالات الدفع</option>
              <option value="pending">معلق</option>
              <option value="partial">جزئي</option>
              <option value="paid">مدفوع</option>
            </select>
          </div>
          <div class="flex items-end gap-2">
            <MButton variant="primary" @click="applyFilters" class="flex-1">تطبيق</MButton>
          </div>
        </div>
      </MCard>

      <!-- Loading -->
      <div v-if="loading && orders.length === 0" class="text-center py-12 text-gray-500">
        جاري التحميل...
      </div>

      <!-- Empty -->
      <MCard v-else-if="orders.length === 0" padding="p-12">
        <div class="text-center">
          <p class="text-gray-500 mb-4">لا توجد طلبات</p>
          <MButton variant="primary" @click="createOrder">إنشاء طلب جديد</MButton>
        </div>
      </MCard>

      <!-- Orders Table -->
      <MCard v-else padding="p-0">
        <MTable>
          <template #header>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">كود</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">العميل</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">الحالة</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">الدفع</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">المبلغ</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">التاريخ</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">إجراءات</th>
          </template>
          <tr v-for="order in orders" :key="order.id" class="hover:bg-gray-50">
            <td class="px-4 py-3">
              <router-link :to="{ name: 'OrderDetails', params: { id: order.id } }" class="text-primary-600 hover:underline font-medium">
                {{ order.code }}
              </router-link>
            </td>
            <td class="px-4 py-3 text-gray-900">{{ order.customer?.name || '-' }}</td>
            <td class="px-4 py-3">
              <MBadge :variant="getStatusVariant(order.status)">{{ getStatusText(order.status) }}</MBadge>
            </td>
            <td class="px-4 py-3">
              <MBadge :variant="getPaymentVariant(order.payment_status)">{{ getPaymentText(order.payment_status) }}</MBadge>
            </td>
            <td class="px-4 py-3 font-medium text-gray-900">{{ formatCurrency(order.total) }}</td>
            <td class="px-4 py-3 text-gray-500 text-sm">{{ formatDate(order.order_date) }}</td>
            <td class="px-4 py-3">
               <ActionMenu :items="[
                 { label: 'عرض التفاصيل', to: { name: 'OrderDetails', params: { id: order.id } }, icon: IconEye },
                 { label: 'تعديل', to: { name: 'OrderEdit', params: { id: order.id } }, icon: IconPencil }
               ]" />
            </td>
          </tr>
        </MTable>

        <!-- Pagination -->
        <div class="flex items-center justify-between p-4 border-t border-gray-100">
          <span class="text-sm text-gray-500">صفحة {{ meta.current_page }} من {{ meta.last_page }}</span>
          <div class="flex gap-2">
            <MButton variant="secondary" size="sm" @click="loadOrders(meta.current_page - 1)" :disabled="meta.current_page <= 1">السابق</MButton>
            <MButton variant="secondary" size="sm" @click="loadOrders(meta.current_page + 1)" :disabled="meta.current_page >= meta.last_page">التالي</MButton>
          </div>
        </div>
      </MCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineComponent, h } from 'vue'
import { useRouter } from 'vue-router'
import { fetchOrders } from '../../api/orders'
import MButton from '../../components/ui/MButton.vue'
import MCard from '../../components/ui/MCard.vue'
import MTable from '../../components/ui/MTable.vue'
import MInput from '../../components/ui/MInput.vue'
import ActionMenu from '../../components/ui/ActionMenu.vue'
import MBadge from '../../components/ui/MBadge.vue'
import MStatsCard from '../../components/ui/MStatsCard.vue'
import { formatCurrency, formatDate } from '../../utils/helpers'
import { getOrderStatusLabel, getOrderStatusBadgeVariant, getPaymentStatusLabel, getPaymentStatusBadgeVariant } from '../../constants'
import { useToast } from '../../composables/useToast'
import type { Order, PaginationMeta } from '../../types'

// Icons
const IconEye = defineComponent({ render: () => h('svg', { fill:'none', viewBox:'0 0 24 24', stroke:'currentColor', class:'w-4 h-4' }, [h('path', { 'stroke-linecap':'round', 'stroke-linejoin':'round', 'stroke-width':'2', d:'M15 12a3 3 0 11-6 0 3 3 0 016 0z' }), h('path', { 'stroke-linecap':'round', 'stroke-linejoin':'round', 'stroke-width':'2', d:'M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' })]) })
const IconPencil = defineComponent({ render: () => h('svg', { fill:'none', viewBox:'0 0 24 24', stroke:'currentColor', class:'w-4 h-4' }, [h('path', { 'stroke-linecap':'round', 'stroke-linejoin':'round', 'stroke-width':'2', d:'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z' })]) })

const router = useRouter()
const { addToast } = useToast()

const orders = ref<Order[]>([])
const loading = ref(false)
const stats = ref<{ total_orders: number; today_orders: number; processing_orders: number; pending_orders: number }>({
  total_orders: 0, today_orders: 0, processing_orders: 0, pending_orders: 0
})
const meta = ref<PaginationMeta>({ current_page: 1, last_page: 1, per_page: 25, total: 0 })
const filters = ref({ q: '', status: '', payment_status: '' })

const loadOrders = async (page = 1) => {
  loading.value = true
  try {
    const params: Record<string, any> = { page, per_page: 25 }
    if (filters.value.q) params.search = filters.value.q
    if (filters.value.status) params.status = filters.value.status
    if (filters.value.payment_status) params.payment_status = filters.value.payment_status

    const res = await fetchOrders(page, params)
    orders.value = res?.data || []
    meta.value = res?.meta || meta.value
    calculateStats()
  } catch (e) {
    addToast('فشل تحميل الطلبات', 'error')
  } finally {
    loading.value = false
  }
}

const calculateStats = () => {
  const today: string = new Date().toISOString().split('T')[0] || ''
  stats.value = {
    total_orders: meta.value.total || 0,
    today_orders: orders.value.filter(o => o.order_date && o.order_date.startsWith(today)).length,
    processing_orders: orders.value.filter(o => o.status === 'processing').length,
    pending_orders: orders.value.filter(o => o.status === 'pending').length,
  }
}

const applyFilters = () => loadOrders(1)
const createOrder = () => router.push({ name: 'OrderCreate' })

// Use centralized helpers
const getStatusText = (s?: string) => getOrderStatusLabel(s || '')
const getStatusVariant = (s?: string) => getOrderStatusBadgeVariant(s || '')
const getPaymentText = (s?: string) => getPaymentStatusLabel(s || '')
const getPaymentVariant = (s?: string) => getPaymentStatusBadgeVariant(s || '')

onMounted(() => loadOrders())
</script>