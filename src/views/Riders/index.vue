<template>
  <div dir="rtl" class="min-h-screen bg-slate-50/50 p-4 lg:p-8">
    <div class="max-w-[1600px] mx-auto space-y-8">
      <!-- Header Section -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="space-y-1">
          <h1 class="text-3xl font-black text-slate-900 tracking-tight">قائمة المندوبين</h1>
          <p class="text-slate-500 font-medium">إدارة ومتابعة جميع مناديب التوصيل حسب مزود التوصيل.</p>
        </div>

        <div class="flex items-center gap-4">
          <MButton
            variant="primary"
            class="!rounded-2xl shadow-lg shadow-indigo-200"
            @click="() => router.push('/riders/create')"
          >
            <template #icon>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
            </template>
            إضافة مندوب جديد
          </MButton>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MStatsCard
          label="إجمالي المندوبين"
          :value="totalRidersCount"
          variant="indigo"
        >
          <template #icon>
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </template>
        </MStatsCard>

        <MStatsCard
          label="المزودين النشطين"
          :value="activeProvidersCount"
          variant="emerald"
        >
          <template #icon>
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </template>
        </MStatsCard>

        <MStatsCard
          label="متوسط الشحنات"
          value="--"
          variant="amber"
        >
          <template #icon>
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </template>
        </MStatsCard>
      </div>

      <!-- Filters & Table Section -->
      <MCard title="قائمة المندوبين" class="min-h-[600px]">
        <template #actions>
          <div class="flex flex-col md:flex-row gap-4">
            <div class="relative w-full md:w-80">
              <MInput
                v-model="q"
                placeholder="بحث باسم المندوب..."
                class="!mb-0"
              >
                <template #icon>
                  <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </template>
              </MInput>
            </div>
            <select
              v-model.number="selectedProvider"
              class="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
            >
              <option value="">كل المزودين</option>
              <option v-for="p in providers" :key="p.id" :value="p.id">{{ p.name }}</option>
            </select>
          </div>
        </template>

        <MTable :loading="loading" :empty="riders.length === 0">
          <template #header>
            <th class="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-widest">المندوب</th>
            <th class="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-widest">الهاتف</th>
            <th class="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-widest">المركبة</th>
            <th class="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-widest">السعة القصوى</th>
            <th class="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-widest">الموقع الحالي</th>
            <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">إجراءات</th>
          </template>

          <tr v-for="r in riders" :key="r.id" class="hover:bg-slate-50/80 transition-colors group border-b border-slate-100 last:border-none">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                  {{ r.name.charAt(0) }}
                </div>
                <div>
                  <div class="text-sm font-bold text-slate-900">{{ r.name }}</div>
                  <div class="text-[10px] text-slate-400 font-mono">ID: #{{ r.id }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">
              {{ r.phone }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-slate-600 font-medium">{{ r.vehicle_type }}</div>
              <div class="text-xs text-slate-400">{{ r.vehicle_number }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-bold">
              {{ r.max_capacity }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div v-if="editingId !== r.id" class="text-sm text-slate-600 font-medium">
                {{ r.current_location ?? '-' }}
              </div>
              <div v-else class="flex items-center gap-2">
                <input v-model="editingLocation" class="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm w-48 focus:ring-2 focus:ring-indigo-500/20 outline-none" />
                <button @click="saveLocation(r)" :disabled="saving" class="p-1.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
                </button>
                <button @click="cancelEdit" class="p-1.5 bg-slate-100 text-slate-500 rounded-lg hover:bg-slate-200 transition-colors">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
            </td>
            <td class="px-6 py-4 text-left whitespace-nowrap">
               <ActionMenu :items="[
                 { label: 'تعديل الموقع', action: () => startEdit(r), icon: IconPencil }
               ]" />
            </td>
          </tr>
        </MTable>
      </MCard>
    </div>
    <ToastList :toasts="toasts" @remove="removeToast" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, defineComponent, h } from 'vue'
import { useRouter } from 'vue-router'
import { ridersStore, loadRiders } from '../../store/riders'
import { fetchDeliveryProviders } from '../../api/deliveryProviders'
import ToastList from '../../components/ToastList.vue'
import { updateRiderLocationOptimistic } from '../../services/ridersService'
import ActionMenu from '../../components/ui/ActionMenu.vue'
import MCard from '../../components/ui/MCard.vue'
import MButton from '../../components/ui/MButton.vue'
import MInput from '../../components/ui/MInput.vue'
import MTable from '../../components/ui/MTable.vue'
import MStatsCard from '../../components/ui/MStatsCard.vue'

// Icons
const IconPencil = defineComponent({ render: () => h('svg', { fill:'none', viewBox:'0 0 24 24', stroke:'currentColor', class:'w-4 h-4' }, [h('path', { 'stroke-linecap':'round', 'stroke-linejoin':'round', 'stroke-width':'2', d:'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z' })]) })

const router = useRouter()


const providers = ref<any[]>([])
const selectedProvider = ref<number | ''>('')
const q = ref('')
const toasts = ref<Array<{ id: number; message: string; type?: string }>>([])
const loading = ref(false)

const riders = computed(() => ridersStore.value.filter((r: any) => {
  if (selectedProvider.value && r.provider_id !== selectedProvider.value) return false
  if (q.value && !r.name.toLowerCase().includes(q.value.toLowerCase())) return false
  return true
}))

const totalRidersCount = computed(() => ridersStore.value.length)
const activeProvidersCount = computed(() => new Set(ridersStore.value.map(r => r.provider_id).filter(id => !!id)).size)

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
  loading.value = true
  try {
    await loadRiders(1)
    const res = await fetchDeliveryProviders(1)
    const d = res?.data?.data ?? res?.data ?? []
    providers.value = d
  } catch (e) {
    addToast('فشل جلب البيانات', 'error')
  } finally {
    loading.value = false
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


// simple reactive filter; no external debounce required

onMounted(() => load())
</script>

<style scoped>
.text-right { text-align: right }
</style>
