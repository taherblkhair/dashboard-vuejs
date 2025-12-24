<template>
  <div class="p-6 bg-gray-50 min-h-screen" dir="rtl">
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900">إدارة الطلبات</h1>
          <p class="text-sm text-gray-500 mt-1">قائمة جميع طلبات المبيعات</p>
        </div>
        <div class="flex items-center gap-3">
          <MButton variant="secondary" @click="loadOrders(1)" :loading="loading">
            تحديث
          </MButton>
          <MButton variant="primary" @click="createOrder">
            إنشاء طلب
          </MButton>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MCard padding="p-4">
          <p class="text-sm text-gray-500">إجمالي الطلبات</p>
          <p class="text-2xl font-semibold text-gray-900 mt-1">{{ stats.total_orders || 0 }}</p>
        </MCard>
        <MCard padding="p-4">
          <p class="text-sm text-gray-500">طلبات اليوم</p>
          <p class="text-2xl font-semibold text-gray-900 mt-1">{{ stats.today_orders || 0 }}</p>
        </MCard>
        <MCard padding="p-4">
          <p class="text-sm text-gray-500">قيد المعالجة</p>
          <p class="text-2xl font-semibold text-gray-900 mt-1">{{ stats.processing_orders || 0 }}</p>
        </MCard>
        <MCard padding="p-4">
          <p class="text-sm text-gray-500">معلقة</p>
          <p class="text-2xl font-semibold text-gray-900 mt-1">{{ stats.pending_orders || 0 }}</p>
        </MCard>
      </div>

      <!-- Filters -->
      <MCard title="تصفية الطلبات">
        <div class="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <MInput v-model="filters.q" label="بحث" placeholder="كود الطلب، اسم العميل..." />
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
          <div class="flex items-end">
            <MButton variant="primary" @click="applyFilters" class="w-full">تطبيق</MButton>
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
            <td class="px-4 py-3 flex gap-2">
              <router-link :to="{ name: 'OrderDetails', params: { id: order.id } }" class="text-primary-600 hover:underline text-sm">
                عرض
              </router-link>
              <router-link :to="{ name: 'OrderEdit', params: { id: order.id } }" class="text-gray-600 hover:underline text-sm">
                تعديل
              </router-link>
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { fetchOrders } from '../../api/orders'
import MButton from '../../components/ui/MButton.vue'
import MInput from '../../components/ui/MInput.vue'
import MCard from '../../components/ui/MCard.vue'
import MBadge from '../../components/ui/MBadge.vue'
import MTable from '../../components/ui/MTable.vue'

const router = useRouter()

const orders = ref<any[]>([])
const loading = ref(false)
const stats = ref<any>({})
const meta = ref({ current_page: 1, last_page: 1, total: 0 })
const filters = ref({ q: '', status: '', payment_status: '' })

const loadOrders = async (page = 1) => {
  loading.value = true
  try {
    const params: Record<string, any> = { page, per_page: 25 }
    if (filters.value.q) params.q = filters.value.q
    if (filters.value.status) params.status = filters.value.status
    if (filters.value.payment_status) params.payment_status = filters.value.payment_status

    const res = await fetchOrders(page, params)
    orders.value = res?.data || []
    meta.value = res?.meta || meta.value
    calculateStats()
  } catch (e) {
    console.error('Failed to load orders', e)
  } finally {
    loading.value = false
  }
}

const calculateStats = () => {
  const today = new Date().toISOString().split('T')[0]
  stats.value = {
    total_orders: meta.value.total || 0,
    today_orders: orders.value.filter(o => o.order_date?.startsWith(today)).length,
    processing_orders: orders.value.filter(o => o.status === 'processing').length,
    pending_orders: orders.value.filter(o => o.status === 'pending').length,
  }
}

const applyFilters = () => loadOrders(1)
const createOrder = () => router.push({ name: 'OrderCreate' })

const getStatusText = (s?: string) => {
  const map: any = { pending: 'معلق', confirmed: 'تم التأكيد', processing: 'قيد المعالجة', shipped: 'تم الشحن', delivered: 'تم التسليم', cancelled: 'ملغي' }
  return map[s || ''] || s || '-'
}

const getStatusVariant = (s?: string): 'success' | 'warning' | 'error' | 'neutral' | 'info' => {
  const map: any = { pending: 'warning', confirmed: 'info', processing: 'info', shipped: 'info', delivered: 'success', cancelled: 'error' }
  return map[s || ''] || 'neutral'
}

const getPaymentText = (s?: string) => {
  const map: any = { pending: 'معلق', partial: 'جزئي', paid: 'مدفوع', failed: 'فشل' }
  return map[s || ''] || s || '-'
}

const getPaymentVariant = (s?: string): 'success' | 'warning' | 'error' | 'neutral' => {
  const map: any = { pending: 'warning', partial: 'warning', paid: 'success', failed: 'error' }
  return map[s || ''] || 'neutral'
}

const formatDate = (iso?: string) => {
  if (!iso) return '-'
  try { return new Date(iso).toLocaleDateString('ar-SA') } catch { return iso }
}

const formatCurrency = (val?: number) => {
  if (val == null) return '0.00 د.ل'
  return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(val) + ' د.ل'
}

onMounted(() => loadOrders())
</script>