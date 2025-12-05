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
                <select v-model.number="selectedRider" class="w-full border rounded px-2 py-1 text-sm">
                  <option value="">-- إعادة تعيين المناديب --</option>
                  <option v-for="r in ridersForProvider" :key="r.id" :value="r.id">{{ r.name }} — {{ r.phone }}</option>
                </select>
                <div class="mt-2 flex gap-2 justify-end">
                  <button @click="reassign" :disabled="saving" class="px-3 py-1 bg-yellow-500 text-white rounded text-sm">إعادة التعيين</button>
                </div>
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
              <select v-model="newStatus" class="w-full border rounded px-2 py-1 mt-1 text-sm">
                <option v-for="s in statuses" :key="s" :value="s">{{ s }}</option>
              </select>
              <div class="mt-2 flex justify-end">
                <button @click="changeStatus" :disabled="saving" class="px-3 py-1 bg-green-600 text-white rounded text-sm">تحديث الحالة</button>
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
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { fetchDelivery, updateDelivery, uploadProof } from '../../api/deliveries'
import { fetchRiders } from '../../api/riders'

const route = useRoute()
const id = Number(route.params.id)

const delivery = ref<any>(null)
const loading = ref(false)
const saving = ref(false)
const ridersForProvider = ref<any[]>([])
const selectedRider = ref<number | null>(null)
const statuses = ['pending', 'assigned', 'picked_up', 'in_transit', 'delivered', 'failed', 'returned']
const newStatus = ref<string>('')
const selectedFile = ref<File | null>(null)

const fileInput = ref<HTMLInputElement | null>(null)

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
    newStatus.value = delivery.value?.status ?? ''
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
  const prev = delivery.value.status
  delivery.value.status = newStatus.value // optimistic
  saving.value = true
  try {
    await updateDelivery(delivery.value.id, { status: newStatus.value })
    // success
  } catch (err) {
    delivery.value.status = prev // revert
    console.error('Failed to update status', err)
    alert('فشل تحديث الحالة')
  } finally {
    saving.value = false
  }
}

const reassign = async () => {
  if (!delivery.value || !selectedRider.value) return
  const prevRider = delivery.value.rider
  // optimistic
  delivery.value.rider = ridersForProvider.value.find(r => r.id === selectedRider.value) ?? delivery.value.rider
  saving.value = true
  try {
    await updateDelivery(delivery.value.id, { rider_id: selectedRider.value })
  } catch (err) {
    delivery.value.rider = prevRider
    console.error('Failed to reassign rider', err)
    alert('فشل إعادة التعيين')
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
    alert('تم رفع الملف بنجاح')
    // clear file input
    if (fileInput.value) fileInput.value.value = ''
    selectedFile.value = null
  } catch (err) {
    console.error('Failed to upload proof', err)
    alert('فشل رفع الملف')
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
