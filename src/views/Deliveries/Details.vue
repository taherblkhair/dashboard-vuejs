<template>
  <div class="p-6 bg-gray-50 min-h-screen" dir="rtl">
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold">تفاصيل التوصيل</h1>
          <p class="text-sm text-gray-500">عرض تفاصيل التوصيل، حالة التتبع، وإجراءات الإدارة.</p>
        </div>
        <div>
          <router-link to="/deliveries" class="px-3 py-2 border rounded">العودة للقائمة</router-link>
        </div>
      </div>

      <div v-if="loading" class="text-center py-6">جارٍ التحميل...</div>
      <div v-else-if="!delivery" class="text-center py-6 text-gray-500">لم يتم العثور على التوصيل</div>

      <div v-else class="space-y-4">
        <div class="bg-white rounded shadow p-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <h2 class="font-semibold">رقم التتبع: <span class="text-blue-600">{{ delivery.tracking_number }}</span></h2>
              <div class="text-sm text-gray-600 mt-1">الحالة الحالية: <strong>{{ delivery.status }}</strong></div>
              <div class="text-sm text-gray-600 mt-1">المسافة: {{ delivery.distance_km }} km — الوزن: {{ delivery.weight_kg }} kg</div>
            </div>
            <div class="text-right">
              <div>رسوم التوصيل: <span class="font-semibold">{{ formatCurrency(delivery.delivery_fee) }}</span></div>
              <div class="text-sm text-gray-500">وقت الإنشاء: {{ formatDate(delivery.created_at) }}</div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded shadow p-4">
          <h3 class="font-medium mb-2">الطلب المرتبط</h3>
          <div class="text-sm text-gray-700">
            <div>كود الطلب: <strong>#{{ delivery.order?.code ?? delivery.order_id }}</strong></div>
            <div>حالة الطلب: {{ delivery.order?.status ?? '-' }}</div>
            <div>تاريخ الطلب: {{ formatDate(delivery.order?.order_date) }}</div>
            <div>العميل: {{ delivery.order?.customer?.name ?? '-' }} — {{ delivery.order?.customer?.phone ?? '' }}</div>
          </div>
        </div>

        <div class="bg-white rounded shadow p-4">
          <h3 class="font-medium mb-2">المزود والمناديب</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
            <div>
              <div class="font-semibold">المزود</div>
              <div>{{ delivery.provider?.name ?? '-' }}</div>
              <div class="text-xs text-gray-500">{{ delivery.provider?.phone ?? '' }}</div>
            </div>
            <div>
              <div class="font-semibold">المناديب</div>
              <div v-if="ridersForProvider.length">
                <select v-model.number="selectedRider" :disabled="!canAssign && !canReassign" class="w-full border rounded px-2 py-1 text-sm">
                  <option value="">{{ canAssign ? '-- اختر مندوب للتعيين --' : (canReassign ? '-- اختر مندوب لإعادة التعيين --' : '-- غير متاح حالياً --') }}</option>
                  <option v-for="r in ridersForProvider" :key="r.id" :value="r.id">{{ r.name }} — {{ r.phone }}</option>
                </select>
                <div class="mt-2 flex gap-2 justify-end">
                  <button @click="reassign" :disabled="saving || !selectedRider || (!canAssign && !canReassign)" class="px-3 py-1 bg-yellow-500 text-white rounded text-sm">{{ canAssign ? 'تعيين المندوب' : (canReassign ? 'إعادة التعيين' : 'غير متاح') }}</button>
                </div>
                <p v-if="!canAssign && !canReassign" class="text-xs text-gray-400 mt-2 italic">لا يمكن (تعيين/إعادة تعيين) المندوب في هذه الحالة: <span class="font-medium">{{ statusLabels[delivery.status] ?? delivery.status }}</span></p>
              </div>
              <div v-else class="text-gray-500">لا تتوفر بيانات مناديب للمزود</div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded shadow p-4">
          <h3 class="font-medium mb-2">إجراءات</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label class="text-sm">تغيير الحالة</label>
              <select v-model="newStatus" :disabled="allowedStatusOptions.length === 0" class="w-full border rounded px-2 py-1 mt-1 text-sm">
                <option value="">{{ allowedStatusOptions.length ? 'اختر حالة جديدة' : 'لا توجد حالات متاحة' }}</option>
                <option v-for="opt in allowedStatusOptions" :key="opt.value" :value="opt.value">{{ opt.text }}</option>
              </select>
              <p v-if="allowedStatusOptions.length" class="text-xs text-gray-400 mt-1">الحالات المتاحة: <span class="font-medium text-gray-700">{{ allowedStatusText }}</span></p>
              <p v-else class="text-xs text-gray-400 mt-1 italic">لا يمكن تغيير حالة التوصيل في المرحلة الحالية</p>
              <div class="mt-2 flex justify-end">
                <button @click="changeStatus"
                  :disabled="saving || !newStatus || !allowedStatusOptions.map(o => o.value).includes(newStatus)"
                  class="px-3 py-1 bg-green-600 text-white rounded text-sm">تحديث الحالة</button>
              </div>
            </div>

            <div>
              <label class="text-sm">رفع إثبات التسليم</label>
              <input ref="fileInput" type="file" @change="onFileChange" class="w-full mt-1 text-sm" />
              <div class="mt-2 flex justify-end">
                <button @click="upload" :disabled="saving || !selectedFile" class="px-3 py-1 bg-blue-600 text-white rounded text-sm">رفع الملف</button>
              </div>
            </div>

            <div>
              <label class="text-sm">تحديثات التتبع</label>
              <div class="mt-2 text-sm text-gray-600">أضف ملاحظة أو تحديث حالة عبر التتبع في واجهة الخادم.</div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded shadow p-4">
          <h3 class="font-medium mb-2">خط زمني للتتبع</h3>
          <div v-if="!(delivery.tracking_updates || []).length" class="text-gray-500">لا توجد تحديثات بعد</div>
          <ul v-else class="space-y-2 text-sm">
            <li v-for="u in delivery.tracking_updates" :key="u.id" class="border rounded p-2">
              <div class="flex justify-between items-start">
                <div>
                  <div class="font-semibold">{{ u.status }}</div>
                  <div class="text-gray-600 text-xs">{{ u.notes }}</div>
                </div>
                <div class="text-xs text-gray-500">{{ formatDate(u.created_at) }}</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { fetchDelivery, uploadProof, assignRiderToDelivery, updateDeliveryStatus } from '../../api/deliveries'
import { fetchRiders } from '../../api/riders'
import { useToast } from '../../composables/useToast'

const route = useRoute()
const id = Number(route.params.id)

const delivery = ref<any>(null)
const loading = ref(false)
const saving = ref(false)
const ridersForProvider = ref<any[]>([])
const selectedRider = ref<number | null>(null)

// backend-allowed transitions for delivery statuses
const allowedTransitions: Record<string, string[]> = {
  pending: ['assigned', 'cancelled'],
  assigned: ['picked_up', 'cancelled'],
  picked_up: ['in_transit', 'failed', 'cancelled'],
  in_transit: ['delivered', 'failed', 'returned'],
  delivered: [],
  failed: ['assigned'],
  cancelled: [],
  returned: ['assigned'],
}

const statusLabels: any = {
  pending: 'قيد الانتظار',
  assigned: 'معين',
  picked_up: 'تم استلام الطرد من المستودع',
  in_transit: 'قيد التوصيل',
  delivered: 'تم التسليم',
  failed: 'فشل التسليم',
  cancelled: 'ملغي',
  returned: 'معاد',
}

const newStatus = ref<string>('')

const allowedStatusOptions = computed(() => {
  const cur = String(delivery.value?.status || '').toLowerCase()
  const arr = allowedTransitions[cur] || []
  return arr
    .filter((s: string) => s !== 'assigned')
    .map((s: string) => ({ value: s, text: statusLabels[s] || s }))
})

const allowedStatusText = computed(() => allowedStatusOptions.value.map((o: any) => o.text).join('، '))

const canAssign = computed(() => (delivery.value?.status || '') === 'pending')
const canReassign = computed(() => ['assigned', 'picked_up', 'failed', 'returned'].includes((delivery.value?.status || '')))
const selectedFile = ref<File | null>(null)

const fileInput = ref<HTMLInputElement | null>(null)
const { addToast } = useToast()

const formatDate = (d?: string) => {
  if (!d) return '-'
  try { return new Date(d).toLocaleString('ar-SA') } catch (e) { return d }
}

const formatCurrency = (v?: any) => {
  if (v === null || v === undefined || v === '') return '-' 
  const num = Number(v)
  if (Number.isNaN(num)) return String(v)
  return new Intl.NumberFormat('en-uk', { style: 'currency', currency: 'LYD' }).format(num)
}

const load = async () => {
  loading.value = true
  try {
    const res = await fetchDelivery(id)
    delivery.value = res?.data?.data ?? res?.data ?? null
    // reset newStatus so user must choose a next state
    newStatus.value = ''
    // load riders for provider if provider id present
    const pid = delivery.value?.provider_id ?? delivery.value?.provider?.id
    if (pid) {
      const rres = await fetchRiders(1, { provider_id: pid })
      const rd = rres?.data?.data ?? rres?.data ?? []
      ridersForProvider.value = rd
    }
  } catch (e) {
    console.error('Failed to load delivery', e)
  } finally {
    loading.value = false
  }
}

const changeStatus = async () => {
  if (!delivery.value) return
  const cur = String(delivery.value.status || '').toLowerCase()
  const allowed = allowedTransitions[cur] || []
  if (!newStatus.value || !allowed.includes(newStatus.value)) {
    alert('هذا الانتقال غير مسموح من ' + (statusLabels[cur] || cur) + ' إلى ' + (statusLabels[newStatus.value] || newStatus.value))
    return
  }
  // 'assigned' transition is handled exclusively through the rider assign button;
  // the status selector never exposes 'assigned'. Continue with normal updates.

  // normal status update for other states
  const prev = delivery.value.status
  delivery.value.status = newStatus.value // optimistic
  saving.value = true
  try {
    const res = await updateDeliveryStatus(delivery.value.id, { status: newStatus.value })
    const updated = res?.data?.data ?? res?.data ?? null
    if (updated) delivery.value = { ...delivery.value, ...updated }
    addToast('تم تحديث حالة التوصيل', 'success')
    newStatus.value = ''
  } catch (err) {
    delivery.value.status = prev // revert
    console.error('Failed to update status', err)
    addToast('فشل تحديث الحالة', 'error')
  } finally {
    saving.value = false
  }
}

const reassign = async () => {
  if (!delivery.value || !selectedRider.value) return

  // only allow assign when pending OR reassign when assigned/picked_up/failed/returned
  const st = String(delivery.value.status || '').toLowerCase()
  if (!(st === 'pending' || ['assigned', 'picked_up', 'failed', 'returned'].includes(st))) {
    alert('لا يمكن (تعيين/إعادة تعيين) المندوب في هذه الحالة: ' + (statusLabels[st] || st))
    return
  }

  const prevRider = delivery.value.rider
  // optimistic: set to selected rider object if available
  delivery.value.rider = ridersForProvider.value.find(r => r.id === selectedRider.value) ?? { id: selectedRider.value }
  saving.value = true
  try {
    const res = await assignRiderToDelivery(delivery.value.id, { rider_id: selectedRider.value })
    const updated = res?.data?.data ?? res?.data ?? null
    if (updated) delivery.value = { ...delivery.value, ...updated }
    addToast('تم تعيين المندوب بنجاح', 'success')
  } catch (err) {
    delivery.value.rider = prevRider
    console.error('Failed to reassign rider', err)
    addToast('فشل إعادة التعيين', 'error')
  } finally {
    saving.value = false
  }
}

const onFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const f = target.files?.[0] ?? null
  selectedFile.value = f
}

const upload = async () => {
  if (!delivery.value || !selectedFile.value) return
  saving.value = true
  try {
    const res = await uploadProof(delivery.value.id, selectedFile.value)
    // merge returned data if any
    const updated = res?.data?.data ?? res?.data ?? null
    if (updated) delivery.value = { ...delivery.value, ...updated }
  addToast('تم رفع الملف بنجاح', 'success')
    // clear file input
    if (fileInput.value) fileInput.value.value = ''
    selectedFile.value = null
  } catch (err) {
  console.error('Failed to upload proof', err)
  addToast('فشل رفع الملف', 'error')
  } finally {
    saving.value = false
  }
}

onMounted(() => load())

watch(() => route.params.id, (nv) => {
  // if route changed load new
  if (nv) load()
})
</script>

<style scoped>
.text-right { text-align: right }
</style>
