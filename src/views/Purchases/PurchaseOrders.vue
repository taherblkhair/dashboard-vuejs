<template>
  <div class="p-4 md:p-6 bg-gradient-to-b from-gray-50 to-white min-h-screen" dir="rtl">
    <div class="max-w-7xl mx-auto">
      <!-- Header Section -->
      <div class="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-200">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-md">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
              </svg>
            </div>
            <div>
              <h1 class="text-2xl md:text-3xl font-bold text-gray-900">طلبات الشراء</h1>
              <p class="text-gray-600 mt-2">إدارة جميع طلبات الشراء من الموردين ومتابعة حالاتها</p>
            </div>
          </div>

          <div class="flex flex-wrap gap-3">
            <button 
              @click="receiveOrders"
              class="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              استلام طلبات الشراء
            </button>
            
            <button 
              @click="createOrder"
              class="px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              إنشاء طلب شراء جديد
            </button>
          </div>
        </div>
      </div>

      <!-- Filters & Search -->
      <div class="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-200">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Search -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">بحث</label>
            <div class="relative">
              <input 
                v-model="searchQuery"
                placeholder="ابحث برمز الطلب، اسم المورد، أو الحالة..."
                class="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-xl hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              />
              <svg class="absolute left-4 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
          </div>

          <!-- Status Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">حالة الطلب</label>
            <select 
              v-model="statusFilter"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl appearance-none hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white"
            >
              <option value="all">جميع الحالات</option>
              <option value="pending">معلق</option>
              <option value="ordered">تم الطلب</option>
              <option value="partially_received">مستلم جزئياً</option>
              <option value="received">مستلم</option>
              <option value="cancelled">ملغي</option>
            </select>
          </div>

          <!-- Date Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">تاريخ الطلب</label>
            <select 
              v-model="dateFilter"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl appearance-none hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white"
            >
              <option value="all">جميع التواريخ</option>
              <option value="today">اليوم</option>
              <option value="week">هذا الأسبوع</option>
              <option value="month">هذا الشهر</option>
              <option value="last_month">الشهر الماضي</option>
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
            v-if="statusFilter !== 'all'"
            class="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
          >
            حالة: {{ getStatusText(statusFilter) }}
            <button @click="statusFilter = 'all'" class="text-green-600 hover:text-green-800">
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
          <p class="text-gray-600">جاري تحميل طلبات الشراء...</p>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredOrders.length === 0" class="bg-white rounded-2xl shadow-lg p-12 border border-gray-200">
        <div class="text-center max-w-md mx-auto">
          <div class="w-24 h-24 mx-auto mb-6 text-gray-300">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-800 mb-2">لا توجد طلبات شراء</h3>
          <p class="text-gray-600 mb-6">لم يتم العثور على طلبات شراء تطابق معايير البحث الخاصة بك</p>
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <button 
              @click="clearFilters"
              class="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors duration-200"
            >
              عرض جميع الطلبات
            </button>
            <button 
              @click="createOrder"
              class="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200"
            >
              إنشاء طلب شراء جديد
            </button>
          </div>
        </div>
      </div>

      <!-- Orders Table -->
      <div v-else class="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
        <!-- Table Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-b border-gray-200 bg-gray-50">
          <div class="text-sm text-gray-600">
            عرض <span class="font-semibold">{{ filteredOrders.length }}</span> من أصل <span class="font-semibold">{{ meta.total || 0 }}</span> طلب
          </div>
          
          <div class="flex items-center gap-3">
            <button 
              @click="exportCsv"
              class="px-4 py-2 bg-gradient-to-r from-gray-100 to-white border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200 flex items-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              تصدير CSV
            </button>
            
            <button 
              @click="exportExcel"
              class="px-4 py-2 bg-gradient-to-r from-green-100 to-white border border-green-300 text-green-700 rounded-xl font-medium hover:bg-green-50 transition-all duration-200 flex items-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              تصدير Excel
            </button>
          </div>
        </div>

        <!-- Orders Table -->
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="p-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الرمز</th>
                <th class="p-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المورد</th>
                <th class="p-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
                <th class="p-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجمالي</th>
                <th class="p-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تاريخ الطلب</th>
                <th class="p-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">التوصيل المتوقع</th>
                <th class="p-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr 
                v-for="order in filteredOrders" 
                :key="order.id"
                class="hover:bg-gray-50 transition-colors duration-150"
              >
                <!-- Code -->
                <td class="p-4">
                  <div class="flex items-center gap-3">
                    <div class="p-2 bg-gray-100 rounded-lg">
                      <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      </svg>
                    </div>
                    <div>
                      <div class="font-semibold text-gray-900">{{ order.code }}</div>
                      <div class="text-xs text-gray-500">#{{ order.id }}</div>
                    </div>
                  </div>
                </td>

                <!-- Supplier -->
                <td class="p-4">
                  <div v-if="order.supplier" class="flex items-center gap-2">
                    <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                      </svg>
                    </div>
                    <div>
                      <div class="font-medium text-gray-900">{{ order.supplier.name }}</div>
                      <div v-if="order.supplier.phone" class="text-xs text-gray-500">{{ order.supplier.phone }}</div>
                    </div>
                  </div>
                  <span v-else class="text-gray-500">-</span>
                </td>

                <!-- Status -->
                <td class="p-4">
                  <span 
                    :class="getStatusBadgeClass(order.status)"
                    class="px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1"
                  >
                    <span class="w-2 h-2 rounded-full" :class="getStatusColor(order.status)"></span>
                    {{ getStatusText(order.status) }}
                  </span>
                </td>

                <!-- Total Amount -->
                <td class="p-4">
                  <div class="font-semibold text-gray-900">{{ formatCurrency(order.total_amount) }}</div>
                </td>

                <!-- Order Date -->
                <td class="p-4">
                  <div class="text-gray-900">{{ formatDate(order.order_date) }}</div>
                  <div class="text-xs text-gray-500">{{ formatTime(order.order_date) }}</div>
                </td>

                <!-- Expected Delivery Date -->
                <td class="p-4">
                  <div class="text-gray-900">{{ formatDate(order.expected_delivery_date) }}</div>
                  <div 
                    :class="getDeliveryDateClass(order.expected_delivery_date)"
                    class="text-xs mt-1"
                  >
                    {{ getDeliveryDateText(order.expected_delivery_date) }}
                  </div>
                </td>

                <!-- Actions -->
                <td class="p-4">
                  <div class="flex items-center gap-2">
                    <button 
                      @click="viewOrder(order.id)"
                      class="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center gap-1 text-sm"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                      </svg>
                      عرض
                    </button>
                    
                    <button 
                      v-if="canReceiveOrder(order)"
                      @click="receiveOrder(order.id)"
                      class="px-3 py-1.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center gap-1 text-sm"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      استلام
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 border-t border-gray-200 bg-gray-50">
          <div class="text-sm text-gray-600">
            الصفحة {{ meta.current_page }} من {{ meta.last_page }} • إجمالي {{ meta.total || 0 }} طلب
          </div>
          
          <div class="flex items-center gap-2">
            <button 
              :disabled="meta.current_page <= 1"
              @click="changePage(meta.current_page - 1)"
              :class="[
                'px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2',
                meta.current_page <= 1 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              ]"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
              السابق
            </button>
            
            <div class="flex items-center gap-1">
              <button 
                v-for="page in visiblePages"
                :key="page"
                @click="changePage(page)"
                :class="[
                  'w-10 h-10 rounded-lg transition-colors duration-200',
                  meta.current_page === page
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-100 text-gray-700'
                ]"
              >
                {{ page }}
              </button>
              <span v-if="showEllipsis" class="px-2 text-gray-500">...</span>
            </div>
            
            <button 
              :disabled="meta.current_page >= meta.last_page"
              @click="changePage(meta.current_page + 1)"
              :class="[
                'px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2',
                meta.current_page >= meta.last_page
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              ]"
            >
              التالي
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { fetchPurchaseOrders } from '../../api/purchaseOrders'

const router = useRouter()

// State
const orders = ref<any[]>([])
const loading = ref(false)
const meta = ref<any>({ current_page: 1, last_page: 1, total: 0 })

// Filters
const searchQuery = ref('')
const statusFilter = ref('all')
const dateFilter = ref('all')

// Computed
const filteredOrders = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  const status = statusFilter.value
  const date = dateFilter.value
  
  return orders.value.filter(order => {
    // Search filter
    if (query) {
      const matches = 
        (order.code || '').toLowerCase().includes(query) ||
        (order.supplier?.name || '').toLowerCase().includes(query) ||
        (order.status || '').toLowerCase().includes(query)
      if (!matches) return false
    }
    
    // Status filter
    if (status !== 'all' && order.status !== status) return false
    
    // Date filter
    if (date !== 'all' && order.order_date) {
      const orderDate = new Date(order.order_date)
      const today = new Date()
      const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()))
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
      const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
      
      switch (date) {
        case 'today':
          return orderDate.toDateString() === new Date().toDateString()
        case 'week':
          return orderDate >= startOfWeek
        case 'month':
          return orderDate >= startOfMonth
        case 'last_month':
          return orderDate >= lastMonth && orderDate < startOfMonth
      }
    }
    
    return true
  })
})

const hasActiveFilters = computed(() => 
  searchQuery.value !== '' || statusFilter.value !== 'all' || dateFilter.value !== 'all'
)

const visiblePages = computed(() => {
  const pages: number[] = []
  const maxVisible = 5
  
  if (meta.value.last_page <= maxVisible) {
    for (let i = 1; i <= meta.value.last_page; i++) {
      pages.push(i)
    }
  } else {
    let start = Math.max(1, meta.value.current_page - 2)
    let end = Math.min(meta.value.last_page, start + maxVisible - 1)
    
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
  meta.value.last_page > visiblePages.value.length && 
  !visiblePages.value.includes(meta.value.last_page)
)

// Helper functions
const getStatusColor = (status: string) => {
  const colors: any = {
    'pending': 'bg-yellow-500',
    'ordered': 'bg-blue-500',
    'partially_received': 'bg-orange-500',
    'received': 'bg-green-500',
    'cancelled': 'bg-red-500'
  }
  return colors[status] || 'bg-gray-400'
}

const getStatusText = (status: string) => {
  const texts: any = {
    'pending': 'معلق',
    'ordered': 'تم الطلب',
    'partially_received': 'مستلم جزئياً',
    'received': 'مستلم',
    'cancelled': 'ملغي'
  }
  return texts[status] || status
}

const getStatusBadgeClass = (status: string) => {
  const classes: any = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'ordered': 'bg-blue-100 text-blue-800',
    'partially_received': 'bg-orange-100 text-orange-800',
    'received': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const formatCurrency = (v?: any) => {
  if (v === null || v === undefined || v === '') return '0.00'
  const num = Number(v)
  if (Number.isNaN(num)) return String(v)
  return new Intl.NumberFormat('en-us', { 
    style: 'currency', 
    currency: 'LYD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num)
}

const formatDate = (iso?: string) => {
  if (!iso) return '-'
  try {
    return new Date(iso).toLocaleDateString('en-us', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch {
    return iso
  }
}

const formatTime = (iso?: string) => {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleTimeString('en-us', {
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return ''
  }
}

const getDeliveryDateClass = (date?: string) => {
  if (!date) return 'text-gray-500'
  
  const deliveryDate = new Date(date)
  const today = new Date()
  const diffDays = Math.ceil((deliveryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) return 'text-red-600'
  if (diffDays <= 3) return 'text-orange-600'
  return 'text-green-600'
}

const getDeliveryDateText = (date?: string) => {
  if (!date) return 'غير محدد'
  
  const deliveryDate = new Date(date)
  const today = new Date()
  const diffDays = Math.ceil((deliveryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) return 'متأخر'
  if (diffDays === 0) return 'اليوم'
  if (diffDays === 1) return 'غداً'
  if (diffDays <= 7) return `بعد ${diffDays} أيام`
  return 'أبعد من أسبوع'
}

const canReceiveOrder = (order: any) => {
  return ['ordered', 'partially_received'].includes(order.status)
}

// Navigation functions
const createOrder = () => {
  router.push({ name: 'PurchaseOrderCreate' })
}

const viewOrder = (id?: number) => {
  if (!id) return
  router.push({ name: 'PurchaseOrderDetails', params: { id } })
}

const receiveOrders = () => {
  router.push({ name: 'PurchaseOrderReceives' })
}

const receiveOrder = (id?: number) => {
  if (!id) return
  router.push({ name: 'PurchaseOrderReceiveCreate', params: { id } })
}

// Filter functions
const clearFilters = () => {
  searchQuery.value = ''
  statusFilter.value = 'all'
  dateFilter.value = 'all'
}

// Data loading
const load = async (page = 1) => {
  loading.value = true
  try {
    const res = await fetchPurchaseOrders(page)
    orders.value = res?.data || []
    meta.value = res?.meta || meta.value
  } catch (e) {
    console.error('Failed to fetch purchase orders', e)
  } finally {
    loading.value = false
  }
}

const changePage = (page: number) => {
  if (page >= 1 && page <= meta.value.last_page) {
    load(page)
  }
}

// Export functions (keep original implementation with improvements)
const escapeCsv = (val: any) => {
  if (val === null || val === undefined) return ''
  const s = String(val)
  if (s.includes('"')) return `"${s.replace(/"/g, '""')}"`
  if (s.search(/[",\n]/) >= 0) return `"${s}"`
  return s
}

const exportCsv = () => {
  if (!filteredOrders.value.length) {
    alert('لا توجد بيانات للتصدير')
    return
  }
  
  const headers = ['الرمز', 'المورد', 'الحالة', 'الإجمالي', 'تاريخ الطلب', 'التوصيل المتوقع']
  const rows = filteredOrders.value.map(o => [
    escapeCsv(o.code),
    escapeCsv(o.supplier?.name || ''),
    escapeCsv(getStatusText(o.status)),
    escapeCsv(o.total_amount),
    escapeCsv(formatDate(o.order_date)),
    escapeCsv(formatDate(o.expected_delivery_date))
  ])
  
  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `طلبات-الشراء-${new Date().toISOString().split('T')[0]}.csv`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

const exportExcel = () => {
  if (!filteredOrders.value.length) {
    alert('لا توجد بيانات للتصدير')
    return
  }
  
  const headers = ['الرمز', 'المورد', 'الحالة', 'الإجمالي', 'تاريخ الطلب', 'التوصيل المتوقع']
  const rows = filteredOrders.value.map(o => [
    o.code,
    o.supplier?.name || '',
    getStatusText(o.status),
    o.total_amount,
    formatDate(o.order_date),
    formatDate(o.expected_delivery_date)
  ])
  
  let table = '<table border="1"><thead><tr>' + 
    headers.map(h => `<th style="background-color: #f3f4f6; padding: 8px;">${h}</th>`).join('') + 
    '</tr></thead><tbody>'
  
  table += rows.map(r => 
    '<tr>' + r.map(c => `<td style="padding: 6px;">${c ?? ''}</td>`).join('') + '</tr>'
  ).join('')
  
  table += '</tbody></table>'
  
  const html = `
    <!DOCTYPE html>
    <html dir="rtl">
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; }
        table { border-collapse: collapse; width: 100%; }
      </style>
    </head>
    <body>
      <h2>طلبات الشراء - ${new Date().toLocaleDateString('en-us')}</h2>
      ${table}
    </body>
    </html>
  `
  
  const blob = new Blob(['\uFEFF' + html], { type: 'application/vnd.ms-excel' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `طلبات-الشراء-${new Date().toISOString().split('T')[0]}.xls`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

// Initialize
onMounted(() => load())

// Watch filters
watch([searchQuery, statusFilter, dateFilter], () => {
  // If you want to implement real-time filtering without reloading from API
  // The filteredOrders computed property already handles this
})
</script>

<style scoped>
/* Custom animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

tbody tr {
  animation: fadeIn 0.3s ease-out;
  animation-fill-mode: both;
}

/* Stagger animations for table rows */
tbody tr:nth-child(1) { animation-delay: 0.1s; }
tbody tr:nth-child(2) { animation-delay: 0.2s; }
tbody tr:nth-child(3) { animation-delay: 0.3s; }
tbody tr:nth-child(4) { animation-delay: 0.4s; }
tbody tr:nth-child(5) { animation-delay: 0.5s; }

/* Custom scrollbar for table */
.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* Hover effects */
.hover-lift:hover {
  transform: translateY(-2px);
  transition: transform 0.2s ease;
}

/* Focus styles */
:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
</style>