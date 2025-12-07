<template>
  <div class="p-4 md:p-6 bg-gradient-to-b from-gray-50 to-white min-h-screen" dir="rtl">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div class="flex items-start gap-4">
            <div class="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-md">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
            </div>
            <div>
              <h1 class="text-2xl md:text-3xl font-bold text-gray-900">إدارة المخازن</h1>
              <p class="text-gray-600 mt-1">إدارة جميع مخازن الشركة وتتبع سعتها واستخداماتها</p>
              <div class="flex items-center gap-4 mt-3">
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span class="text-sm text-gray-700">{{ activeCount }} مخزن نشط</span>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <span class="text-sm text-gray-700">{{ inactiveCount }} مخزن غير نشط</span>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span class="text-sm text-gray-700">{{ totalCapacity }} وحدة سعة إجمالية</span>
                </div>
              </div>
            </div>
          </div>

          <button 
            @click="() => router.push({ name: 'WarehouseCreate' })"
            class="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 group"
          >
            <svg class="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            إضافة مخزن جديد
          </button>
        </div>
      </div>

      <!-- Filters & Search -->
      <div class="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-200">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Search -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">بحث سريع</label>
            <div class="relative">
              <input 
                v-model="searchQuery" 
                placeholder="ابحث باسم المخزن، الرمز، الموقع، أو المدير..."
                class="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-xl hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              />
              <svg class="absolute left-4 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
          </div>

          <!-- Status Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">حالة المخزن</label>
            <div class="relative">
              <select 
                v-model="filterActive"
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl appearance-none hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white"
              >
                <option value="all">جميع المخازن</option>
                <option value="active">المخازن النشطة</option>
                <option value="inactive">المخازن غير النشطة</option>
              </select>
              <div class="absolute left-4 top-3.5 pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- Sort By -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">ترتيب حسب</label>
            <select 
              v-model="sortBy"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl appearance-none hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white"
            >
              <option value="name_asc">الاسم (أ → ي)</option>
              <option value="name_desc">الاسم (ي → أ)</option>
              <option value="capacity_desc">السعة (الأكبر)</option>
              <option value="capacity_asc">السعة (الأصغر)</option>
              <option value="utilization_desc">الاستخدام (الأعلى)</option>
              <option value="utilization_asc">الاستخدام (الأقل)</option>
            </select>
          </div>
        </div>

        <!-- Active Filters -->
        <div v-if="hasActiveFilters" class="mt-4 flex flex-wrap gap-2">
          <span class="text-sm text-gray-600">التصفيات النشطة:</span>
          <span 
            v-if="searchQuery"
            class="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
          >
            بحث: "{{ searchQuery }}"
            <button @click="searchQuery = ''" class="text-blue-600 hover:text-blue-800">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </span>
          <span 
            v-if="filterActive !== 'all'"
            class="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
          >
            {{ filterActive === 'active' ? 'نشط' : 'غير نشط' }}
            <button @click="filterActive = 'all'" class="text-green-600 hover:text-green-800">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </span>
          <button 
            @click="clearFilters"
            class="text-sm text-gray-600 hover:text-gray-800 underline"
          >
            مسح الكل
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="bg-white rounded-2xl shadow-lg p-12 border border-gray-200">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p class="text-gray-600">جاري تحميل المخازن...</p>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredWarehouses.length === 0" class="bg-white rounded-2xl shadow-lg p-12 border border-gray-200">
        <div class="text-center max-w-md mx-auto">
          <div class="w-24 h-24 mx-auto mb-6 text-gray-300">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-800 mb-2">لا توجد مخازن</h3>
          <p class="text-gray-600 mb-6">لم يتم العثور على مخازن تطابق معايير البحث الخاصة بك</p>
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <button 
              @click="clearFilters"
              class="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors duration-200"
            >
              عرض جميع المخازن
            </button>
            <button 
              @click="() => router.push({ name: 'WarehouseCreate' })"
              class="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
            >
              إضافة مخزن جديد
            </button>
          </div>
        </div>
      </div>

      <!-- Warehouses Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="w in filteredWarehouses" 
          :key="w.id"
          class="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-blue-300 group overflow-hidden"
        >
          <!-- Status Badge -->
          <div class="absolute top-4 left-4 z-10">
            <span 
              :class="[
                'px-3 py-1 rounded-full text-xs font-medium',
                w.is_active 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-gray-100 text-gray-800 border border-gray-200'
              ]"
            >
              {{ w.is_active ? 'نشط' : 'غير نشط' }}
            </span>
          </div>

          <!-- Header with Avatar -->
          <div class="p-6 pb-4">
            <div class="flex items-start gap-4">
              <div 
                :class="[
                  'w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md',
                  w.is_active 
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                    : 'bg-gradient-to-br from-gray-400 to-gray-500'
                ]"
              >
                {{ initials(w.name) }}
              </div>
              
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2">
                  <div>
                    <h3 class="font-bold text-xl text-gray-900 truncate group-hover:text-blue-600 transition-colors duration-200">{{ w.name }}</h3>
                    <div class="flex items-center gap-2 mt-1">
                      <span class="text-sm text-gray-500">الرمز:</span>
                      <span class="text-sm font-mono font-semibold bg-gray-100 px-2 py-1 rounded">{{ w.code }}</span>
                      <span class="text-sm text-gray-400">#{{ w.id }}</span>
                    </div>
                  </div>
                </div>

                <!-- Manager Info -->
                <div v-if="w.manager" class="flex items-center gap-2 mt-3">
                  <div class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                  </div>
                  <div>
                    <span class="text-xs text-gray-500">المدير</span>
                    <p class="text-sm font-medium text-gray-800">{{ w.manager.name }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Details -->
          <div class="px-6 pb-4">
            <div class="space-y-3">
              <!-- Contact Info -->
              <div v-if="w.phone || w.email" class="flex items-center gap-3">
                <div class="flex-1">
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                    <span class="text-sm text-gray-600">{{ w.phone || 'لا يوجد هاتف' }}</span>
                  </div>
                  <div class="flex items-center gap-2 mt-1">
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89-4.26a2 2 0 012.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                    <span class="text-sm text-gray-600 truncate">{{ w.email || 'لا يوجد بريد' }}</span>
                  </div>
                </div>
              </div>

              <!-- Address -->
              <div v-if="w.address" class="flex items-start gap-2">
                <svg class="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <div>
                  <span class="text-xs text-gray-500">الموقع</span>
                  <p class="text-sm text-gray-700">{{ w.address.city }}، {{ w.address.area }}</p>
                </div>
              </div>

              <!-- Capacity Progress -->
              <div class="space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">السعة والاستخدام</span>
                  <span class="font-semibold">{{ formatNumber(w.capacity) }} وحدة</span>
                </div>
                <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    :class="[
                      'h-full rounded-full transition-all duration-500',
                      getUtilizationColor(w.current_utilization)
                    ]"
                    :style="{ width: `${Math.min(Number(w.current_utilization) || 0, 100)}%` }"
                  ></div>
                </div>
                <div class="flex justify-between text-xs">
                  <span class="text-gray-500">0%</span>
                  <span :class="[
                    'font-semibold',
                    getUtilizationColor(w.current_utilization).replace('bg-', 'text-')
                  ]">
                    {{ w.current_utilization || 0 }}%
                  </span>
                  <span class="text-gray-500">100%</span>
                </div>
              </div>

              <!-- Created Date -->
              <div class="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
                <span>تم الإنشاء: {{ formatDate(w.created_at) }}</span>
                <span class="text-gray-400">ID: {{ w.id }}</span>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <button 
                  @click="() => router.push({ name: 'WarehouseDetails', params: { id: w.id } })"
                  class="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center gap-2 text-sm font-medium shadow-sm hover:shadow"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                  عرض التفاصيل
                </button>
            
              </div>
              
              <button 
                v-if="w.is_active"
                class="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors duration-200 flex items-center gap-1"
              >
                <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                نشط
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="!loading && filteredWarehouses.length > 0" class="mt-8">
        <div class="bg-white rounded-2xl shadow-lg p-4 border border-gray-200">
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="text-sm text-gray-600">
              عرض <span class="font-semibold">{{ filteredWarehouses.length }}</span> من أصل <span class="font-semibold">{{ warehouses.length }}</span> مخزن
            </div>
            
            <div class="flex items-center gap-2">
              <button 
                class="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                :disabled="currentPage === 1"
                @click="currentPage--"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
              
              <div class="flex items-center gap-1">
                <button 
                  v-for="page in visiblePages"
                  :key="page"
                  @click="currentPage = page"
                  :class="[
                    'w-10 h-10 rounded-lg transition-colors duration-200',
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-gray-100 text-gray-700'
                  ]"
                >
                  {{ page }}
                </button>
                <span v-if="showEllipsis" class="px-2">...</span>
              </div>
              
              <button 
                class="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                :disabled="currentPage === totalPages"
                @click="currentPage++"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
              </button>
            </div>
            
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-600">عناصر لكل صفحة:</span>
              <select 
                v-model="itemsPerPage"
                class="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
              >
                <option value="6">6</option>
                <option value="12">12</option>
                <option value="24">24</option>
                <option value="48">48</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { fetchWarehouses } from '../../api/warehouses'
import type { Warehouse } from '../../api/warehouses'

const router = useRouter()

// State
const warehouses = ref<Warehouse[]>([])
const loading = ref(false)
const searchQuery = ref('')
const filterActive = ref<'all' | 'active' | 'inactive'>('all')
const sortBy = ref<string>('name_asc')
const currentPage = ref(1)
const itemsPerPage = ref(12)

// Computed
const filteredWarehouses = computed(() => {
  let filtered = warehouses.value.filter(w => {
    // Search filter
    const q = searchQuery.value.toLowerCase().trim()
    if (q) {
      const matches = 
        (w.name || '').toLowerCase().includes(q) ||
        (w.code || '').toLowerCase().includes(q) ||
        (w.phone || '').includes(q) ||
        (w.email || '').toLowerCase().includes(q) ||
        (w.manager?.name || '').toLowerCase().includes(q) ||
        (w.address?.city || '').toLowerCase().includes(q) ||
        (w.address?.area || '').toLowerCase().includes(q)
      if (!matches) return false
    }
    
    // Status filter
    if (filterActive.value === 'active' && !w.is_active) return false
    if (filterActive.value === 'inactive' && w.is_active) return false
    
    return true
  })
  
  // Sorting
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'name_asc':
        return (a.name || '').localeCompare(b.name || '')
      case 'name_desc':
        return (b.name || '').localeCompare(a.name || '')
      case 'capacity_desc':
            return Number(b.capacity || 0) - Number(a.capacity || 0)
      case 'capacity_asc':
            return Number(a.capacity || 0) - Number(b.capacity || 0)
      case 'utilization_desc':
            return Number(b.current_utilization || 0) - Number(a.current_utilization || 0)
      case 'utilization_asc':
            return Number(a.current_utilization || 0) - Number(b.current_utilization || 0)
      default:
        return 0
    }
  })
  
  // Pagination
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filtered.slice(start, end)
})

const activeCount = computed(() => 
  warehouses.value.filter(w => w.is_active).length
)

const inactiveCount = computed(() => 
  warehouses.value.filter(w => !w.is_active).length
)

const totalCapacity = computed(() => 
  warehouses.value.reduce((sum, w) => sum + (Number(w.capacity) || 0), 0)
)

const hasActiveFilters = computed(() => 
  searchQuery.value !== '' || filterActive.value !== 'all'
)

const totalPages = computed(() => 
  Math.ceil(warehouses.value.length / itemsPerPage.value)
)

const visiblePages = computed(() => {
  const pages: number[] = []
  const maxVisible = 5
  
  if (totalPages.value <= maxVisible) {
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i)
    }
  } else {
    let start = Math.max(1, currentPage.value - 2)
    let end = Math.min(totalPages.value, start + maxVisible - 1)
    
    if (end - start + 1 < maxVisible) {
      start = end - maxVisible + 1
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
  }
  
  return pages
})

const showEllipsis = computed(() => 
  totalPages.value > visiblePages.value.length && 
  !visiblePages.value.includes(totalPages.value)
)

// Methods
const initials = (name?: string) => {
  if (!name) return '??'
  return name
    .split(' ')
    .map(s => s.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

const formatNumber = (v: any) => {
  if (v === null || v === undefined || v === '') return '0'
  const n = Number(v)
  return Number.isNaN(n) ? String(v) : n.toLocaleString('ar-SA')
}

const formatDate = (iso?: string) => {
  if (!iso) return '--'
  try {
    return new Date(iso).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch {
    return iso
  }
}

const getUtilizationColor = (utilization: any) => {
  const u = Number(utilization) || 0
  if (!u) return 'bg-gray-300'
  if (u < 50) return 'bg-green-500'
  if (u < 80) return 'bg-yellow-500'
  return 'bg-red-500'
}

const clearFilters = () => {
  searchQuery.value = ''
  filterActive.value = 'all'
  sortBy.value = 'name_asc'
  currentPage.value = 1
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

// Watchers
watch([searchQuery, filterActive, sortBy], () => {
  currentPage.value = 1
})

watch(itemsPerPage, () => {
  currentPage.value = 1
})

// Lifecycle
onMounted(() => {
  load()
})
</script>

<style scoped>
/* Custom animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.grid > div {
  animation: fadeInUp 0.3s ease-out;
  animation-fill-mode: both;
}

.grid > div:nth-child(1) { animation-delay: 0.1s; }
.grid > div:nth-child(2) { animation-delay: 0.2s; }
.grid > div:nth-child(3) { animation-delay: 0.3s; }
.grid > div:nth-child(4) { animation-delay: 0.4s; }
.grid > div:nth-child(5) { animation-delay: 0.5s; }
.grid > div:nth-child(6) { animation-delay: 0.6s; }

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* Selection styles */
::selection {
  background-color: rgba(59, 130, 246, 0.1);
  color: #1e40af;
}

/* Focus styles */
:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
</style>