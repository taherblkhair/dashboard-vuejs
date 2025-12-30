<template>
  <div class="p-6 bg-gray-50 min-h-screen" dir="rtl">
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Header Section -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="space-y-1">
          <h1 class="text-3xl font-black text-slate-900 tracking-tight">إدارة طلبات الشراء</h1>
          <p class="text-slate-500 font-medium">إدارة ومتابعة جميع طلبات التوريد والمشتريات من الموردين</p>
        </div>

        <div class="flex items-center gap-4">
          <MButton
            variant="secondary"
            size="sm"
            @click="receiveOrders"
            class="!rounded-xl"
          >
            <template #icon>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0l-8 4-8-4m8 4v6"/>
              </svg>
            </template>
            استلام الطلبات
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
            إنشاء طلب شراء
          </MButton>
        </div>
      </div>
      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MStatsCard
          label="إجمالي الطلبات"
          :value="dashboardData.total_orders || 0"
          variant="indigo"
        >
          <template #icon>
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </template>
        </MStatsCard>

        <MStatsCard
          label="المبالغ المستلمة"
          :value="formatCurrency(dashboardData.total_received_amount || 0)"
          variant="emerald"
        >
          <template #icon>
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </template>
        </MStatsCard>

        <MStatsCard
          label="طلبات معلقة"
          :value="dashboardData.pending_orders || 0"
          variant="amber"
        >
          <template #icon>
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </template>
        </MStatsCard>

        <MStatsCard
          label="متأخرة"
          :value="dashboardData.overdue_orders || 0"
          variant="rose"
        >
          <template #icon>
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </template>
        </MStatsCard>
      </div>

      <!-- Filters -->
      <MCard title="تصفية الطلبات">
        <div class="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <MInput v-model="searchQuery" label="بحث" placeholder="رمز الطلب، اسم المورد..." />
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">حالة الطلب</label>
            <select v-model="statusFilter" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500">
              <option value="all">جميع الحالات</option>
              <option value="pending">معلق</option>
              <option value="ordered">تم الطلب</option>
              <option value="partially_received">مستلم جزئياً</option>
              <option value="received">مستلم</option>
              <option value="cancelled">ملغي</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">تاريخ الطلب</label>
            <select v-model="dateFilter" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500">
              <option value="all">جميع التواريخ</option>
              <option value="today">اليوم</option>
              <option value="week">هذا الأسبوع</option>
              <option value="month">هذا الشهر</option>
            </select>
          </div>
          <div class="flex items-end">
            <MButton v-if="hasActiveFilters" variant="ghost" @click="clearFilters">مسح الفلاتر</MButton>
          </div>
        </div>
      </MCard>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-12 text-gray-500">جاري التحميل...</div>

      <!-- Empty -->
      <MCard v-else-if="filteredOrders.length === 0" padding="p-12">
        <div class="text-center">
          <p class="text-gray-500 mb-4">لا توجد طلبات شراء</p>
          <MButton variant="primary" @click="createOrder">إنشاء طلب شراء جديد</MButton>
        </div>
      </MCard>

      <!-- Orders Table -->
      <MCard v-else padding="p-0">
        <MTable>
          <template #header>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">الرمز</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">المورد</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">الحالة</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">الإجمالي</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">تاريخ الطلب</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">التوصيل المتوقع</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">إجراءات</th>
          </template>
          <tr v-for="order in filteredOrders" :key="order.id" class="hover:bg-gray-50">
            <td class="px-4 py-3">
              <span class="font-medium text-gray-900">{{ order.code }}</span>
              <span class="text-xs text-gray-400 block">#{{ order.id }}</span>
            </td>
            <td class="px-4 py-3 text-gray-600">{{ order.supplier?.name || '-' }}</td>
            <td class="px-4 py-3">
              <MBadge :variant="getStatusVariant(order.status)">{{ getStatusText(order.status) }}</MBadge>
            </td>
            <td class="px-4 py-3 font-medium text-gray-900">{{ formatCurrency(order.total_amount) }}</td>
            <td class="px-4 py-3 text-gray-600 text-sm">{{ formatDate(order.order_date) }}</td>
            <td class="px-4 py-3 text-gray-600 text-sm">{{ formatDate(order.expected_delivery_date) }}</td>
            <td class="px-4 py-3">
              <ActionMenu :items="getActions(order)" />
            </td>
          </tr>
        </MTable>

        <!-- Pagination -->
        <div class="flex items-center justify-between p-4 border-t border-gray-100">
          <span class="text-sm text-gray-500">صفحة {{ meta.current_page }} من {{ meta.last_page }}</span>
          <div class="flex gap-2">
            <MButton variant="secondary" size="sm" @click="changePage(meta.current_page - 1)" :disabled="meta.current_page <= 1">السابق</MButton>
            <MButton variant="secondary" size="sm" @click="changePage(meta.current_page + 1)" :disabled="meta.current_page >= meta.last_page">التالي</MButton>
          </div>
        </div>
      </MCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, defineComponent, h } from 'vue'
import { useRouter } from 'vue-router'
import { fetchPurchaseOrders, fetchPurchaseOrderDashboard } from '../../api/purchaseOrders'
import MButton from '../../components/ui/MButton.vue'
import MInput from '../../components/ui/MInput.vue'
import MCard from '../../components/ui/MCard.vue'
import MBadge from '../../components/ui/MBadge.vue'
import MTable from '../../components/ui/MTable.vue'
import ActionMenu from '../../components/ui/ActionMenu.vue'
import MStatsCard from '../../components/ui/MStatsCard.vue'
import { formatCurrency, formatDate } from '../../utils/helpers'
import { useToast } from '../../composables/useToast'

// Icons (reusing existing or importing new, define inline for simplicity)
const IconEye = defineComponent({ render: () => h('svg', { fill:'none', viewBox:'0 0 24 24', stroke:'currentColor', class:'w-4 h-4' }, [h('path', { 'stroke-linecap':'round', 'stroke-linejoin':'round', 'stroke-width':'2', d:'M15 12a3 3 0 11-6 0 3 3 0 016 0z' }), h('path', { 'stroke-linecap':'round', 'stroke-linejoin':'round', 'stroke-width':'2', d:'M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' })]) })
const IconPencil = defineComponent({ render: () => h('svg', { fill:'none', viewBox:'0 0 24 24', stroke:'currentColor', class:'w-4 h-4' }, [h('path', { 'stroke-linecap':'round', 'stroke-linejoin':'round', 'stroke-width':'2', d:'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z' })]) })

const router = useRouter()
const { addToast } = useToast()
const orders = ref<any[]>([])
const loading = ref(false)
const dashboardData = ref<any>({})
const meta = ref<any>({ current_page: 1, last_page: 1, total: 0 })
const searchQuery = ref('')
const statusFilter = ref('all')
const dateFilter = ref('all')

const filteredOrders = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  return orders.value.filter(o => {
    if (q && !(o.code?.toLowerCase().includes(q) || o.supplier?.name?.toLowerCase().includes(q))) return false
    if (statusFilter.value !== 'all' && o.status !== statusFilter.value) return false
    return true
  })
})

const hasActiveFilters = computed(() => searchQuery.value || statusFilter.value !== 'all' || dateFilter.value !== 'all')

const load = async (page = 1) => {
  loading.value = true
  try {
    const [res, dashboardRes] = await Promise.all([
      fetchPurchaseOrders(page),
      fetchPurchaseOrderDashboard()
    ])
    orders.value = res?.data || []
    meta.value = res?.meta || meta.value
    dashboardData.value = dashboardRes?.data || {}
  } catch (e) { 
    addToast('فشل تحميل طلبات الشراء', 'error')
  }
  finally { loading.value = false }
}

const changePage = (p: number) => { if (p >= 1 && p <= meta.value.last_page) load(p) }
const clearFilters = () => { searchQuery.value = ''; statusFilter.value = 'all'; dateFilter.value = 'all' }

const createOrder = () => router.push({ name: 'PurchaseOrderCreate' })
const viewOrder = (id?: number) => id && router.push({ name: 'PurchaseOrderDetails', params: { id } })
const editOrder = (id?: number) => id && router.push({ name: 'PurchaseOrderEdit', params: { id } })
const receiveOrders = () => router.push({ name: 'PurchaseOrderReceives' })

const getActions = (order: any) => {
  const actions = [
    { label: 'عرض التفاصيل', action: () => viewOrder(order.id), icon: IconEye }
  ]
  
  if (['draft', 'pending'].includes(order.status)) {
    actions.push({ label: 'تعديل', action: () => editOrder(order.id), icon: IconPencil })
  }
  
  return actions
}

const getStatusText = (s: string) => {
  const m: any = { pending: 'معلق', ordered: 'تم الطلب', partially_received: 'مستلم جزئياً', received: 'مستلم', cancelled: 'ملغي' }
  return m[s] || s
}

const getStatusVariant = (s: string): 'success' | 'warning' | 'error' | 'info' | 'neutral' => {
  const m: any = { pending: 'warning', ordered: 'info', partially_received: 'warning', received: 'success', cancelled: 'error' }
  return m[s] || 'neutral'
}

onMounted(() => load())
</script>

<style scoped>
</style>