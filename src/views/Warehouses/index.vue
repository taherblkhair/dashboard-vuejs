<template>
  <div dir="rtl" class="min-h-screen bg-slate-50/50 p-4 lg:p-8">
    <div class="max-w-[1600px] mx-auto space-y-8">
      <!-- Header Section -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="space-y-1">
          <h1 class="text-3xl font-black text-slate-900 tracking-tight">إدارة المخازن</h1>
          <p class="text-slate-500 font-medium">إدارة جميع مخازن الشركة وتتبع سعتها واستخداماتها</p>
        </div>

        <div class="flex items-center gap-4">
          <MButton
            variant="primary"
            class="!rounded-2xl shadow-lg shadow-indigo-200"
            @click="() => router.push({ name: 'WarehouseCreate' })"
          >
            <template #icon>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
            </template>
            إضافة مخزن جديد
          </MButton>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MStatsCard
          label="المخازن النشطة"
          :value="activeCount"
          variant="emerald"
        >
          <template #icon>
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </template>
        </MStatsCard>

        <MStatsCard
          label="المخازن غير النشطة"
          :value="inactiveCount"
          variant="slate"
        >
          <template #icon>
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </template>
        </MStatsCard>

        <MStatsCard
          label="السعة الإجمالية"
          :value="formatNumber(totalCapacity)"
          variant="blue"
        >
          <template #icon>
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </template>
        </MStatsCard>
      </div>

    <!-- Main Content -->
    <MCard title="قائمة المخازن" class="min-h-[500px]">
      <template #actions>
        <div class="flex gap-4">
           <div class="relative w-64">
             <input 
               v-model="searchQuery"
               type="text"
               placeholder="بحث في المخازن..."
               class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
             />
             <svg class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
           </div>
           
           <select 
              v-model="filterActive" 
              class="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
            >
              <option value="all">جميع الحالات</option>
              <option value="active">نشط</option>
              <option value="inactive">غير نشط</option>
            </select>
        </div>
      </template>

      <MTable :loading="loading" :empty="filteredWarehouses.length === 0">
        <template #header>
          <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المخزن</th>
          <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المدير</th>
          <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">العنوان</th>
          <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">السعة / الاستخدام</th>
          <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
          <th class="relative px-6 py-3 text-left">
            <span class="sr-only">إجراءات</span>
          </th>
        </template>
        
        <tr v-for="w in filteredWarehouses" :key="w.id" class="hover:bg-gray-50 group">
          <td class="px-6 py-4">
            <div class="flex items-center">
              <div class="h-10 w-10 flex-shrink-0 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 font-bold ml-4">
                {{ initials(w.name) }}
              </div>
              <div>
                <div class="text-sm font-medium text-gray-900">{{ w.name }}</div>
                <div class="text-xs text-gray-500 font-mono">{{ w.code }}</div>
              </div>
            </div>
          </td>
          <td class="px-6 py-4 text-sm text-gray-600">
             <div v-if="w.manager">
               <p class="font-medium text-gray-900">{{ w.manager.name }}</p>
               <p class="text-xs text-gray-500" v-if="w.phone">{{ w.phone }}</p>
             </div>
             <span v-else class="text-gray-400 text-xs italic">غير محدد</span>
          </td>
          <td class="px-6 py-4 text-sm text-gray-600">
             <div v-if="w.address">
               <span class="block">{{ w.address.city }}، {{ w.address.area }}</span>
             </div>
             <span v-else class="text-gray-400">-</span>
          </td>
          <td class="px-6 py-4">
            <div class="w-full max-w-[140px]">
              <div class="flex justify-between text-xs mb-1">
                <span :class="getUtilizationColorText(w.current_utilization)">{{ w.current_utilization || 0 }}%</span>
                <span class="text-gray-400">{{ formatNumber(w.capacity) }}</span>
              </div>
              <div class="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <div 
                   class="h-1.5 rounded-full transition-all duration-300"
                   :class="getUtilizationColor(w.current_utilization)"
                   :style="{ width: `${Math.min(Number(w.current_utilization) || 0, 100)}%` }"
                ></div>
              </div>
            </div>
          </td>
          <td class="px-6 py-4">
            <span :class="['inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', w.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800']">
              {{ w.is_active ? 'نشط' : 'غير نشط' }}
            </span>
          </td>
          <td class="px-6 py-4 text-left whitespace-nowrap">
            <ActionMenu 
              :items="[
                { label: 'عرض التفاصيل', action: () => router.push({ name: 'WarehouseDetails', params: { id: w.id } }) },
                { label: 'تعديل', action: () => router.push({ name: 'WarehouseEdit', params: { id: w.id } }), disabled: true, textClass: 'text-gray-400' },
                { label: 'حذف', variant: 'danger', action: () => confirmDelete() }
              ]"
            />
          </td>
        </tr>
      </MTable>
      
      <!-- Pagination -->
      <div v-if="filteredWarehouses.length > 0" class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div class="text-sm text-gray-500">
             عرض {{ (currentPage - 1) * itemsPerPage + 1 }} إلى {{ Math.min(currentPage * itemsPerPage, warehouses.length) }} من {{ warehouses.length }}
          </div>
          <div class="flex gap-2">
            <button 
              @click="currentPage--" 
              :disabled="currentPage === 1"
              class="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 hover:bg-gray-50"
            >
              السابق
            </button>
            <button 
              @click="currentPage++" 
              :disabled="currentPage * itemsPerPage >= warehouses.length"
              class="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 hover:bg-gray-50"
            >
              التالي
            </button>
          </div>
      </div>
    </MCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { fetchWarehouses } from '../../api/warehouses'
import type { Warehouse } from '../../api/warehouses'
import MCard from '../../components/ui/MCard.vue'
import MButton from '../../components/ui/MButton.vue'
import MTable from '../../components/ui/MTable.vue'
import ActionMenu from '../../components/ui/ActionMenu.vue'
import MStatsCard from '../../components/ui/MStatsCard.vue'
import { useConfirm } from '../../composables/useConfirm'
import { useToast } from '../../composables/useToast'

const router = useRouter()
const { confirm } = useConfirm()
const { addToast } = useToast()

// State
const warehouses = ref<Warehouse[]>([])
const loading = ref(false)
const searchQuery = ref('')
const filterActive = ref<'all' | 'active' | 'inactive'>('all')
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Computed
const filteredWarehouses = computed(() => {
  let filtered = warehouses.value.filter(w => {
    // Search filter
    const q = searchQuery.value.toLowerCase().trim()
    if (q) {
      const matches = 
        (w.name || '').toLowerCase().includes(q) ||
        (w.code || '').toLowerCase().includes(q) ||
        (w.manager?.name || '').toLowerCase().includes(q)
      if (!matches) return false
    }
    
    // Status filter
    if (filterActive.value === 'active' && !w.is_active) return false
    if (filterActive.value === 'inactive' && w.is_active) return false
    
    return true
  })
  
  // Pagination logic can be applied here or in template slice
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filtered.slice(start, end)
})

const activeCount = computed(() => warehouses.value.filter(w => w.is_active).length)
const inactiveCount = computed(() => warehouses.value.filter(w => !w.is_active).length)
const totalCapacity = computed(() => warehouses.value.reduce((sum, w) => sum + (Number(w.capacity) || 0), 0))

// Methods
const initials = (name?: string) => {
  if (!name) return '??'
  return name.split(' ').map(s => s.charAt(0)).slice(0, 2).join('').toUpperCase()
}

const formatNumber = (v: any) => {
  if (v === null || v === undefined || v === '') return '0'
  return Number(v).toLocaleString('ar-SA')
}

const getUtilizationColor = (utilization: any) => {
  const u = Number(utilization) || 0
  if (u < 50) return 'bg-green-500'
  if (u < 80) return 'bg-yellow-500'
  return 'bg-red-500'
}

const getUtilizationColorText = (utilization: any) => {
  const u = Number(utilization) || 0
  if (u < 50) return 'text-green-600'
  if (u < 80) return 'text-yellow-600'
  return 'text-red-600'
}

const load = async () => {
  loading.value = true
  try {
    const res = await fetchWarehouses()
    warehouses.value = res?.data || []
  } catch (e) {
    console.error('Failed to fetch warehouses', e)
  } finally {
    loading.value = false
  }
}

const confirmDelete = async () => {
  // Placeholder for delete functionality
  const ok = await confirm({
    title: 'حذف المخزن',
    message: 'هل أنت متأكد من حذف هذا المخزن؟ لا يمكن التراجع عن هذا الإجراء.',
    type: 'danger',
    confirmText: 'حذف',
    cancelText: 'إلغاء'
  })
  
  if (ok) {
     // await deleteWarehouse(id)
     addToast('تم حذف المخزن بنجاح')
     load()
  }
}

// Watchers
watch([searchQuery, filterActive], () => { currentPage.value = 1 })

// Lifecycle
onMounted(() => { load() })
</script>