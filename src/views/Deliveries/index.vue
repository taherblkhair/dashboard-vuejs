<template>
  <div class="p-6 bg-gray-50 min-h-screen" dir="rtl">
    <div class="max-w-7xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold">التوصيلات</h1>
          <p class="text-sm text-gray-500">قائمة التوصيلات مع معلومات الطلب، المزود، والمناديب.</p>
        </div>
      </div>

      <div class="bg-white rounded shadow p-4">
        <div v-if="loading" class="text-center p-6">جاري التحميل...</div>
        <div v-else>
          <table class="w-full text-sm">
            <thead class="text-gray-600">
              <tr>
                <th class="text-right py-2">#</th>
                <th class="text-right py-2">رقم التتبع</th>
                <th class="text-right py-2">الحالة</th>
                <th class="text-right py-2">الطلب</th>
                <th class="text-right py-2">المزود</th>
                <th class="text-right py-2">المناديب</th>
                <th class="text-right py-2">رسوم</th>
                <th class="text-right py-2">موعد متوقع</th>
                <th class="text-right py-2">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="d in deliveries" :key="d.id" class="border-t">
                <td class="py-2 text-right">{{ d.id }}</td>
                <td class="py-2 text-right">{{ d.tracking_number }}</td>
                <td class="py-2 text-right">{{ d.status }}</td>
                <td class="py-2 text-right">#{{ d.order?.code ?? d.order_id }}</td>
                <td class="py-2 text-right">{{ d.provider?.name ?? '-' }}</td>
                <td class="py-2 text-right">{{ d.rider?.name ?? '-' }}</td>
                <td class="py-2 text-right font-semibold">{{ formatCurrency(d.delivery_fee) }}</td>
                <td class="py-2 text-right">{{ formatDate(d.estimated_delivery_time) }}</td>
               
                <td class="py-2 text-right">
                  <div class="flex gap-2 justify-end">
                    <router-link :to="`/deliveries/${d.id}`" class="px-3 py-1 bg-blue-600 text-white rounded text-sm">تفاصيل</router-link>
                    <button @click.prevent="openAssign(d)" class="px-2 py-1 bg-yellow-500 text-white rounded text-sm">تعيين</button>
                    <button @click.prevent="openStatus(d)" class="px-2 py-1 bg-green-600 text-white rounded text-sm">حالة</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div class="mt-4 flex items-center justify-between">
            <div class="text-sm text-gray-600">إجمالي: {{ meta?.total ?? deliveries.length }}</div>
            <div>
              <button v-if="meta && meta.current_page < meta.last_page" @click="load(meta.current_page + 1)" class="px-3 py-1 bg-gray-200 rounded">المزيد</button>
            </div>
          </div>
        </div>
      </div>
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
import { ref, onMounted } from 'vue'
import { fetchDeliveries, assignRiderToDelivery, updateDeliveryStatus } from '../../api/deliveries'
import { useToast } from '../../composables/useToast'
import AssignRiderModal from '../../components/AssignRiderModal.vue'
import ConfirmModal from '../../components/ConfirmModal.vue'

const deliveries = ref<any[]>([])
const meta = ref<any>(null)
const loading = ref(false)

const { addToast } = useToast()

const statuses = ['pending', 'assigned', 'picked_up', 'in_transit', 'delivered', 'failed', 'returned']

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
