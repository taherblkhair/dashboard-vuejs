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
              <th class="text-right py-2">الحالة</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in riders" :key="r.id" class="border-t">
              <td class="py-2 text-right">{{ r.name }}</td>
              <td class="py-2 text-right">{{ r.phone }}</td>
              <td class="py-2 text-right">{{ r.vehicle_type }} — {{ r.vehicle_number }}</td>
              <td class="py-2 text-right">{{ r.max_capacity }}</td>
              <td class="py-2 text-right">{{ r.is_available ? 'متاح' : 'مشغول' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <ToastList :toasts="toasts" @remove="removeToast" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ridersStore, loadRiders } from '../../store/riders'
import { fetchDeliveryProviders } from '../../api/deliveryProviders'
import ToastList from '../../components/ToastList.vue'

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

const filterByProvider = () => {
  // filtering is reactive via computed
}

// simple reactive filter; no external debounce required

onMounted(() => load())
</script>

<style scoped>
.text-right { text-align: right }
</style>
