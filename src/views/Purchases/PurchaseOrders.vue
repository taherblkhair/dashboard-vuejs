<template>
  <div class="p-6 bg-gray-50 min-h-screen" dir="rtl">
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900">طلبات الشراء</h1>
          <p class="text-sm text-gray-500 mt-1">إدارة جميع طلبات الشراء من الموردين</p>
        </div>
        <div class="flex gap-3">
          <MButton variant="secondary" @click="receiveOrders">استلام الطلبات</MButton>
          <MButton variant="primary" @click="createOrder">إنشاء طلب شراء</MButton>
        </div>
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
              <div class="flex gap-2">
                <MButton variant="ghost" size="sm" @click="viewOrder(order.id)">عرض</MButton>
                <!-- <MButton v-if="canReceiveOrder(order)" variant="ghost" size="sm" @click="receiveOrder(order.id)">استلام</MButton> -->
              </div>
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
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { fetchPurchaseOrders } from '../../api/purchaseOrders'
import MButton from '../../components/ui/MButton.vue'
import MInput from '../../components/ui/MInput.vue'
import MCard from '../../components/ui/MCard.vue'
import MBadge from '../../components/ui/MBadge.vue'
import MTable from '../../components/ui/MTable.vue'

const router = useRouter()
const orders = ref<any[]>([])
const loading = ref(false)
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
    const res = await fetchPurchaseOrders(page)
    orders.value = res?.data || []
    meta.value = res?.meta || meta.value
  } catch (e) { console.error(e) }
  finally { loading.value = false }
}

const changePage = (p: number) => { if (p >= 1 && p <= meta.value.last_page) load(p) }
const clearFilters = () => { searchQuery.value = ''; statusFilter.value = 'all'; dateFilter.value = 'all' }

const createOrder = () => router.push({ name: 'PurchaseOrderCreate' })
const viewOrder = (id?: number) => id && router.push({ name: 'PurchaseOrderDetails', params: { id } })
const receiveOrders = () => router.push({ name: 'PurchaseOrderReceives' })
const receiveOrder = (id?: number) => id && router.push({ name: 'PurchaseOrderReceiveCreate', params: { id } })
const canReceiveOrder = (o: any) => ['ordered', 'partially_received'].includes(o.status)

const getStatusText = (s: string) => {
  const m: any = { pending: 'معلق', ordered: 'تم الطلب', partially_received: 'مستلم جزئياً', received: 'مستلم', cancelled: 'ملغي' }
  return m[s] || s
}

const getStatusVariant = (s: string): 'success' | 'warning' | 'error' | 'info' | 'neutral' => {
  const m: any = { pending: 'warning', ordered: 'info', partially_received: 'warning', received: 'success', cancelled: 'error' }
  return m[s] || 'neutral'
}

const formatCurrency = (v?: number) => {
  if (v == null) return '0.00 د.ل'
  return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(v) + ' د.ل'
}

const formatDate = (iso?: string) => {
  if (!iso) return '-'
  try { return new Date(iso).toLocaleDateString('ar-SA', { year: 'numeric', month: 'short', day: 'numeric' }) } catch { return iso }
}

onMounted(() => load())
</script>

<style scoped>
</style>