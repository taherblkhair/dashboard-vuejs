<template>
  <div class="p-6 bg-gray-50 min-h-screen" dir="rtl">
    <div class="max-w-6xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold">قائمة المندوبين</h1>
          <p class="text-sm text-gray-500">عرض المندوبين ويمكن تصفيتهم حسب مزود التوصيل.</p>
        </div>
        <div>
          <router-link to="/riders/create" class="px-3 py-2 border rounded">إضافة مندوب</router-link>
        </div>
      </div>

      <div class="bg-white p-4 rounded shadow mb-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label class="text-sm">المزود</label>
            <select v-model.number="selectedProvider" @change="filterByProvider" class="w-full border rounded px-2 py-1 mt-1">
              <option value="">كل المزودين</option>
              <option v-for="p in providers" :key="p.id" :value="p.id">{{ p.name }}</option>
            </select>
          </div>
          <div>
            <label class="text-sm">بحث الاسم</label>
            <input v-model="q" placeholder="ابحث باسم المندوب" class="w-full border rounded px-2 py-1 mt-1" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded shadow p-4">
        <div v-if="!riders.length" class="text-gray-500 py-8 text-center">لا توجد نتائج</div>
        <table v-else class="w-full text-sm">
          <thead class="text-gray-600">
            <tr>
              <th class="text-right py-2">الاسم</th>
              <th class="text-right py-2">الهاتف</th>
              <th class="text-right py-2">مركبة</th>
              <th class="text-right py-2">السعة</th>
              <th class="text-right py-2">الموقع الحالي</th>
              <th class="text-right py-2">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in riders" :key="r.id" class="border-t">
              <td class="py-2 text-right">{{ r.name }}</td>
              <td class="py-2 text-right">{{ r.phone }}</td>
              <td class="py-2 text-right">{{ r.vehicle_type }} — {{ r.vehicle_number }}</td>
              <td class="py-2 text-right">{{ r.max_capacity }}</td>
              <td class="py-2 text-right">
                <div v-if="editingId !== r.id">{{ r.current_location ?? '-' }}</div>
                <div v-else class="flex items-center gap-2">
                  <input v-model="editingLocation" class="border rounded px-2 py-1 text-sm w-64" />
                </div>
              </td>
              <td class="py-2 text-right">
                <div v-if="editingId !== r.id" class="flex gap-2 justify-end">
                   <ActionMenu :items="[
                     { label: 'تعديل الموقع', action: () => startEdit(r), icon: IconPencil }
                   ]" />
                </div>
                <div v-else class="flex gap-2 justify-end">
                  <button @click="saveLocation(r)" :disabled="saving" class="px-2 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700">حفظ</button>
                  <button @click="cancelEdit" class="px-2 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300">إلغاء</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <ToastList :toasts="toasts" @remove="removeToast" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, defineComponent, h } from 'vue'
import { ridersStore, loadRiders } from '../../store/riders'
import { fetchDeliveryProviders } from '../../api/deliveryProviders'
import ToastList from '../../components/ToastList.vue'
import { updateRiderLocationOptimistic } from '../../services/ridersService'
import ActionMenu from '../../components/ui/ActionMenu.vue'

// Icons
const IconPencil = defineComponent({ render: () => h('svg', { fill:'none', viewBox:'0 0 24 24', stroke:'currentColor', class:'w-4 h-4' }, [h('path', { 'stroke-linecap':'round', 'stroke-linejoin':'round', 'stroke-width':'2', d:'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z' })]) })


const providers = ref<any[]>([])
const selectedProvider = ref<number | ''>('')
const q = ref('')
const toasts = ref<Array<{ id: number; message: string; type?: string }>>([])

const riders = computed(() => ridersStore.value.filter((r: any) => {
  if (selectedProvider.value && r.provider_id !== selectedProvider.value) return false
  if (q.value && !r.name.toLowerCase().includes(q.value.toLowerCase())) return false
  return true
}))

const addToast = (msg: string, type = 'success') => {
  const id = Date.now()
  toasts.value.push({ id, message: msg, type })
  setTimeout(() => { const idx = toasts.value.findIndex(t => t.id === id); if (idx !== -1) toasts.value.splice(idx, 1) }, 4000)
}

const removeToast = (id: number) => {
  const idx = toasts.value.findIndex(t => t.id === id)
  if (idx !== -1) toasts.value.splice(idx, 1)
}

const load = async () => {
  try {
    await loadRiders(1)
    const res = await fetchDeliveryProviders(1)
    const d = res?.data?.data ?? res?.data ?? []
    providers.value = d
  } catch (e) {
    addToast('فشل جلب البيانات', 'error')
  }
}

const editingId = ref<number | null>(null)
const editingLocation = ref<string>('')
const saving = ref(false)

const startEdit = (r: any) => {
  editingId.value = r.id
  editingLocation.value = r.current_location ?? ''
}

const cancelEdit = () => {
  editingId.value = null
  editingLocation.value = ''
}

const saveLocation = async (r: any) => {
  if (!editingId.value) return
  saving.value = true
  try {
    await updateRiderLocationOptimistic(r.id, editingLocation.value)
    addToast('تم تحديث الموقع', 'success')
    cancelEdit()
  } catch (err: any) {
    console.error('Failed to update location', err)
    addToast('فشل تحديث الموقع', 'error')
  } finally {
    saving.value = false
  }
}

const filterByProvider = () => {
  // filtering is reactive via computed
}

// simple reactive filter; no external debounce required

onMounted(() => load())
</script>

<style scoped>
.text-right { text-align: right }
</style>
