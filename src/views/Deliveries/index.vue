<template>
  <div dir="rtl" class="min-h-screen bg-slate-50/50 p-4 lg:p-8">
    <div class="max-w-[1600px] mx-auto space-y-8">
      <!-- Header Section -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="space-y-1">
          <h1 class="text-3xl font-black text-slate-900 tracking-tight">عمليات التوصيل</h1>
          <p class="text-slate-500 font-medium">متابعة وإدارة مسارات الشحن والتوصيل والمناديب.</p>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MStatsCard
          label="إجمالي العمليات"
          :value="totalDeliveries"
          variant="indigo"
        >
          <template #icon>
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
            </svg>
          </template>
        </MStatsCard>

        <MStatsCard
          label="قيد الانتظار"
          :value="pendingCount"
          variant="amber"
        >
          <template #icon>
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </template>
        </MStatsCard>

        <MStatsCard
          label="قيد التوصيل"
          :value="inTransitCount"
          variant="blue"
        >
          <template #icon>
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </template>
        </MStatsCard>

        <MStatsCard
          label="تم التوصيل"
          :value="deliveredCount"
          variant="emerald"
        >
          <template #icon>
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </template>
        </MStatsCard>
      </div>

      <!-- Table Section -->
      <MCard title="جميع التوصيلات" class="min-h-[600px]">
        <MTable :loading="loading" :empty="deliveries.length === 0">
          <template #header>
            <th class="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-widest text-nowrap">رقم التتبع</th>
            <th class="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-widest text-nowrap">الحالة</th>
            <th class="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-widest text-nowrap">الطلب</th>
            <th class="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-widest text-nowrap">المزود</th>
            <th class="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-widest text-nowrap">المندوب</th>
            <th class="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-widest text-nowrap">الرسوم</th>
            <th class="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-widest text-nowrap">الموعد المتوقع</th>
            <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">إجراءات</th>
          </template>

          <tr v-for="d in deliveries" :key="d.id" class="hover:bg-slate-50/80 transition-colors group border-b border-slate-100 last:border-none">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-bold text-slate-900 font-mono tracking-wider">{{ d.tracking_number }}</div>
              <div class="text-[10px] text-slate-400 font-mono">ID: #{{ d.id }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <MBadge :variant="getStatusVariant(d.status)">
                {{ d.status }}
              </MBadge>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-bold text-indigo-600">#{{ d.order?.code ?? d.order_id }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
               <div class="text-sm text-slate-600 font-medium">{{ d.provider?.name ?? '-' }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">
              {{ d.rider?.name ?? '-' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-bold">
              {{ formatCurrency(d.delivery_fee) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">
               {{ formatDate(d.estimated_delivery_time) }}
            </td>
            <td class="px-6 py-4 text-left whitespace-nowrap">
              <ActionMenu :items="[
                { label: 'تفاصيل', action: () => router.push(`/deliveries/${d.id}`), icon: IconEye },
                { label: 'تعيين مندوب', action: () => openAssign(d), icon: IconUserPlus },
                { label: 'تحديث الحالة', action: () => openStatus(d), icon: IconRefresh }
              ]" />
            </td>
          </tr>
        </MTable>

        <div v-if="meta && meta.current_page < meta.last_page" class="mt-8 flex justify-center">
          <MButton variant="secondary" @click="load(meta.current_page + 1)" :loading="loading">
             عرض المزيد من العمليات
          </MButton>
        </div>
      </MCard>
    </div>
  </div>
      <!-- Assign Rider Modal -->
      <AssignRiderModal :show="showAssign" :providerId="activeDelivery?.provider_id ?? activeDelivery?.provider?.id" @close="showAssign = false" @confirm="onAssignConfirm" />

      <!-- Status Modal -->
      <div v-if="showStatus" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div class="bg-white rounded shadow p-4 w-96" dir="rtl">
          <h3 class="font-semibold mb-2">تغيير الحالة</h3>
          <label class="text-sm">اختر الحالة</label>
          <select v-model="statusToApply" class="w-full border rounded px-2 py-1 mt-1 text-sm">
            <option value="">-- اختر --</option>
            <option v-for="s in statuses" :key="s" :value="s">{{ s }}</option>
          </select>
          <div class="mt-4 flex justify-end gap-2">
            <button @click="showStatus = false" class="px-3 py-1 border rounded">إلغاء</button>
            <button @click="onStatusApply" :disabled="!statusToApply" class="px-3 py-1 bg-green-600 text-white rounded">تطبيق</button>
          </div>
        </div>
      </div>

      <ConfirmModal :show="showConfirm" title="تأكيد الإجراء" message="هل أنت متأكد أنك تريد تنفيذ هذا الإجراء؟" @confirm="onConfirm" @cancel="showConfirm = false" />
</template>

<script setup lang="ts">
import { ref, onMounted, computed, defineComponent, h } from 'vue'
import { useRouter } from 'vue-router'
import { fetchDeliveries, assignRiderToDelivery, updateDeliveryStatus } from '../../api/deliveries'
import { useToast } from '../../composables/useToast'
import AssignRiderModal from '../../components/AssignRiderModal.vue'
import ConfirmModal from '../../components/ConfirmModal.vue'
import MCard from '../../components/ui/MCard.vue'
import MButton from '../../components/ui/MButton.vue'
import MBadge from '../../components/ui/MBadge.vue'
import MTable from '../../components/ui/MTable.vue'
import MStatsCard from '../../components/ui/MStatsCard.vue'
import ActionMenu from '../../components/ui/ActionMenu.vue'

// Icons
const IconEye = defineComponent({ render: () => h('svg', { fill:'none', viewBox:'0 0 24 24', stroke:'currentColor', class:'w-4 h-4' }, [h('path', { 'stroke-linecap':'round', 'stroke-linejoin':'round', 'stroke-width':'2', d:'M15 12a3 3 0 11-6 0 3 3 0 016 0z' }), h('path', { 'stroke-linecap':'round', 'stroke-linejoin':'round', 'stroke-width':'2', d:'M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' })]) })
const IconUserPlus = defineComponent({ render: () => h('svg', { fill:'none', viewBox:'0 0 24 24', stroke:'currentColor', class:'w-4 h-4' }, [h('path', { 'stroke-linecap':'round', 'stroke-linejoin':'round', 'stroke-width':'2', d:'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z' })]) })
const IconRefresh = defineComponent({ render: () => h('svg', { fill:'none', viewBox:'0 0 24 24', stroke:'currentColor', class:'w-4 h-4' }, [h('path', { 'stroke-linecap':'round', 'stroke-linejoin':'round', 'stroke-width':'2', d:'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' })]) })

const router = useRouter()

const deliveries = ref<any[]>([])
const meta = ref<any>(null)
const loading = ref(false)

const { addToast } = useToast()

const statuses = ['pending', 'assigned', 'picked_up', 'in_transit', 'delivered', 'failed', 'returned']

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'delivered': return 'success'
    case 'failed':
    case 'returned': return 'danger'
    case 'pending': return 'warning'
    case 'in_transit':
    case 'picked_up': return 'info'
    default: return 'info'
  }
}

const totalDeliveries = computed(() => meta.value?.total ?? deliveries.value.length)
const pendingCount = computed(() => deliveries.value.filter(d => d.status === 'pending').length)
const inTransitCount = computed(() => deliveries.value.filter(d => ['in_transit', 'picked_up'].includes(d.status)).length)
const deliveredCount = computed(() => deliveries.value.filter(d => d.status === 'delivered').length)

const formatDate = (d?: string) => {
  if (!d) return '-'
  try { return new Date(d).toLocaleString('EN-US') } catch (e) { return d }
}

const formatCurrency = (v?: any) => {
  if (v === null || v === undefined || v === '') return '-' 
  const num = Number(v)
  if (Number.isNaN(num)) return String(v)
  return new Intl.NumberFormat('EN-US', { style: 'currency', currency: 'LYD' }).format(num)
}

const load = async (page = 1) => {
  loading.value = true
  try {
    const res = await fetchDeliveries(page)
    const d = res?.data?.data ?? res?.data ?? []
    const m = res?.data?.meta ?? res?.meta ?? null
    if (page === 1) deliveries.value = d
    else deliveries.value.push(...d)
    meta.value = m
  } catch (e) {
    console.error('Failed to load deliveries', e)
  } finally {
    loading.value = false
  }
}

// modal state
const showAssign = ref(false)
const showStatus = ref(false)
const showConfirm = ref(false)
const activeDelivery = ref<any | null>(null)
const statusToApply = ref<string>('')

const openAssign = (d: any) => {
  activeDelivery.value = d
  showAssign.value = true
}

const openStatus = (d: any) => {
  activeDelivery.value = d
  showStatus.value = true
}

const onAssignConfirm = async (riderId: number) => {
  if (!activeDelivery.value) return
  const d = activeDelivery.value
  const prev = { ...d }
  d.rider = { id: riderId }
  showAssign.value = false
  try {
    const res = await assignRiderToDelivery(d.id, { rider_id: riderId })
    const updated = res?.data?.data ?? res?.data ?? null
    if (updated) Object.assign(d, updated)
    addToast('تم تعيين المندوب', 'success')
  } catch (err) {
    Object.assign(d, prev)
    console.error('Failed to assign rider', err)
    addToast('فشل تعيين المندوب', 'error')
  }
}

const onStatusApply = async () => {
  if (!activeDelivery.value || !statusToApply.value) return
  const d = activeDelivery.value
  const prev = d.status
  // destructive statuses require confirmation
  const destructive = ['failed', 'returned']
  if (destructive.includes(statusToApply.value)) {
    showConfirm.value = true
    return
  }
  d.status = statusToApply.value
  showStatus.value = false
  try {
    const res = await updateDeliveryStatus(d.id, { status: statusToApply.value })
    const updated = res?.data?.data ?? res?.data ?? null
    if (updated) Object.assign(d, updated)
    addToast('تم تحديث الحالة', 'success')
  } catch (err) {
    d.status = prev
    console.error('Failed to change status', err)
    addToast('فشل تحديث الحالة', 'error')
  }
}

const onConfirm = async () => {
  // user confirmed destructive status
  showConfirm.value = false
  if (!activeDelivery.value) return
  const d = activeDelivery.value
  const prev = d.status
  d.status = statusToApply.value
  showStatus.value = false
  try {
    const res = await updateDeliveryStatus(d.id, { status: statusToApply.value })
    const updated = res?.data?.data ?? res?.data ?? null
    if (updated) Object.assign(d, updated)
    addToast('تم تحديث الحالة', 'success')
  } catch (err) {
    d.status = prev
    console.error('Failed to change status', err)
    addToast('فشل تحديث الحالة', 'error')
  }
}

onMounted(() => load(1))
</script>

<style scoped>
.text-right { text-align: right }
</style>
