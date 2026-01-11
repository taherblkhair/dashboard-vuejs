<template>
  <header class="sticky top-0 z-40 bg-white/70 backdrop-blur-2xl border-b border-slate-100/50 shadow-sm">
    <div class="flex items-center justify-between h-20 px-8">
      <!-- Left Section: Title & Toggle -->
      <div class="flex items-center gap-6">
        <!-- Sidebar Toggle (Mobile) -->
        <button 
          class="lg:hidden p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-600 transition-all active:scale-95"
          @click="$emit('toggle-sidebar')"
          aria-label="تبديل القائمة"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 6h16M4 12h16m-7 6h7"/>
          </svg>
        </button>

        <div class="flex flex-col">
           <h2 class="text-xl font-black text-slate-900 tracking-tight">
             {{ currentPageTitle }}
           </h2>
           <div class="flex items-center gap-2 mt-0.5">
              <div class="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">متصل الآن</span>
           </div>
        </div>
      </div>

      <!-- Right Section: Actions & Profile -->
      <div class="flex items-center gap-4">
        <!-- Search Bar (Desktop) -->
        <div class="relative hidden xl:block group" ref="searchContainer">
          <input
            type="text"
            v-model="searchQuery"
            @input="handleSearchInput"
            @focus="showResults = true"
            placeholder="بحث عن طلب، عميل أو صنف..."
            class="w-96 bg-slate-50 border border-transparent rounded-[1.25rem] py-3 pl-12 pr-10 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-100 transition-all duration-300 placeholder:text-slate-400"
          />
          <svg v-if="!isLoading" class="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
           <svg v-else class="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-indigo-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          
          <!-- Search Results Dropdown -->
          <div v-if="showResults && searchQuery" class="absolute top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
             <div v-if="isLoading" class="p-8 text-center text-slate-400 text-sm font-medium">
               جاري البحث...
             </div>
             
             <div v-else-if="!hasResults" class="p-8 text-center text-slate-400 text-sm font-medium">
               لا توجد نتائج لـ "{{ searchQuery }}"
             </div>

             <div v-else class="max-h-[60vh] overflow-y-auto custom-scrollbar">
                <!-- Products -->
                <div v-if="searchResults.products.length" class="py-2">
                   <h3 class="px-4 py-2 text-xs font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">المنتجات</h3>
                   <button 
                     v-for="p in searchResults.products" 
                     :key="p.id"
                     @click="navigateTo('ProductDetails', { id: p.id })"
                     class="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors text-right"
                   >
                     <div class="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                     </div>
                     <div class="min-w-0 flex-1">
                        <p class="text-sm font-bold text-slate-700 truncate">{{ p.name }}</p>
                        <p class="text-xs text-slate-400 truncate font-mono">{{ p.sku }}</p>
                     </div>
                   </button>
                </div>

                <!-- Customers -->
                <div v-if="searchResults.customers.length" class="py-2 border-t border-slate-50">
                   <h3 class="px-4 py-2 text-xs font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">العملاء</h3>
                   <button 
                     v-for="c in searchResults.customers" 
                     :key="c.id"
                     @click="navigateTo('CustomersView', { id: c.id })"
                     class="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors text-right"
                   >
                     <div class="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                     </div>
                     <div class="min-w-0 flex-1">
                        <p class="text-sm font-bold text-slate-700 truncate">{{ c.name }}</p>
                        <p class="text-xs text-slate-400 truncate">{{ c.phone }}</p>
                     </div>
                   </button>
                </div>

                <!-- Orders -->
                <div v-if="searchResults.orders.length" class="py-2 border-t border-slate-50">
                   <h3 class="px-4 py-2 text-xs font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">الطلبات</h3>
                   <button 
                     v-for="o in searchResults.orders" 
                     :key="o.id"
                     @click="navigateTo('OrderDetails', { id: o.id })"
                     class="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors text-right"
                   >
                     <div class="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>
                     </div>
                     <div class="min-w-0 flex-1">
                        <p class="text-sm font-bold text-slate-700 truncate">طلب #{{ o.id }}</p>
                        <p class="text-xs text-slate-400 truncate">{{ o.customer?.name || 'عميل غير مسجل' }}</p>
                     </div>
                      <span :class="['text-[10px] font-black px-2 py-0.5 rounded', getStatusColor(o.status)]">
                        {{ getStatusText(o.status) }}
                      </span>
                   </button>
                </div>
             </div>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <!-- Quick Action -->
          <button class="p-3 rounded-2xl bg-white border border-slate-100 text-slate-500 hover:text-indigo-600 hover:border-indigo-100 hover:shadow-sm transition-all active:scale-95 group">
            <svg class="w-6 h-6 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
          </button>

          <!-- Notifications -->
          <div class="relative">
            <button class="p-3 rounded-2xl bg-white border border-slate-100 text-slate-500 hover:text-indigo-600 hover:border-indigo-100 hover:shadow-sm transition-all active:scale-95 group">
              <svg class="w-6 h-6 group-hover:animate-swing" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
              </svg>
              <span class="absolute top-3 right-3 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full"></span>
            </button>
          </div>
        </div>

        <div class="h-8 w-px bg-slate-100 mx-2"></div>

        <!-- User Menu -->
     
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../../store'
import { fetchProducts } from '../../api/products'
import { fetchCustomers } from '../../api/customers'
import { fetchOrders } from '../../api/orders'

const emit = defineEmits(['toggle-sidebar'] as const)

const route = useRoute()
const router = useRouter()
const userMenuOpen = ref(false)

const currentPageTitle = computed(() => {
  const titles: { [key: string]: string } = {
    '/': 'لوحة التحكم',
    '/products': 'إدارة الأصناف',
    '/orders': 'طلبات المبيعات',
    '/customers': 'العملاء',
    '/reports': 'التقارير التحليلية',
    '/settings': 'الإعدادات العامة',
    '/purchase-orders': 'طلبات الشراء',
    '/purchases/suppliers': 'الموردون',
    '/categories': 'الفئات والأصناف',
    '/warehouses': 'المخازن والمستودعات',
    '/delivery-providers': 'شركات التوصيل',
    '/riders': 'المناديب والموصلون'
  }
  return titles[route.path] || 'نظام بالخير المتكامل'
})

const { state, logout } = useAuth()

const displayName = computed(() => {
  return state.user?.name || state.user?.username || state.user?.email || 'أحمد محمد'
})

const userAvatar = computed(() => state.user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80')

async function handleLogout() {
  try {
    await logout()
  } catch (e) {
    // ignore
  } finally {
    userMenuOpen.value = false
    router.push({ name: 'Login' })
  }
}

// Global Search Logic
const searchQuery = ref('')
const searchResults = ref<{ products: any[], customers: any[], orders: any[] }>({ products: [], customers: [], orders: [] })
const isLoading = ref(false)
const showResults = ref(false)
const searchContainer = ref<HTMLElement | null>(null)
let searchTimeout: any = null

const hasResults = computed(() => {
  return searchResults.value.products.length > 0 || 
         searchResults.value.customers.length > 0 || 
         searchResults.value.orders.length > 0
})

const handleSearchInput = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  if (!searchQuery.value.trim()) {
    searchResults.value = { products: [], customers: [], orders: [] }
    return
  }
  
  isLoading.value = true
  showResults.value = true
  
  searchTimeout = setTimeout(async () => {
    try {
      const q = searchQuery.value
      const [productsRes, customersRes, ordersRes] = await Promise.all([
        fetchProducts(1, { search: q }),
        fetchCustomers(1, q),
        fetchOrders(1, { search: q }) // orders api supports search param
      ])
      
      searchResults.value = {
        products: (productsRes as any).data || [],
        customers: (customersRes as any).data || [],
        orders: (ordersRes as any).data || []
      }
    } catch (e) {
      console.error('Search failed', e)
    } finally {
      isLoading.value = false
    }
  }, 500)
}

const navigateTo = (routeName: string, params: any) => {
  router.push({ name: routeName, params })
  showResults.value = false
  searchQuery.value = ''
}

const statusMap: Record<string, { text: string; class: string }> = {
  pending: { text: 'قيد الانتظار', class: 'bg-amber-100 text-amber-700' },
  processing: { text: 'جاري التجهيز', class: 'bg-indigo-100 text-indigo-700' },
  shipped: { text: 'تم الشحن', class: 'bg-blue-100 text-blue-700' },
  delivered: { text: 'تم التوصيل', class: 'bg-emerald-100 text-emerald-700' },
  cancelled: { text: 'ملغى', class: 'bg-rose-100 text-rose-700' },
  returned: { text: 'مرتجع', class: 'bg-gray-100 text-gray-700' }
}

function getStatusText(status: string) {
  return statusMap[status]?.text || status
}

function getStatusColor(status: string) {
  return statusMap[status]?.class || 'bg-slate-100 text-slate-700'
}

// Close search on click outside
import { onMounted, onUnmounted } from 'vue'

const handleClickOutside = (e: MouseEvent) => {
  if (searchContainer.value && !searchContainer.value.contains(e.target as Node)) {
    showResults.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
@keyframes swing {
  0%, 100% { transform: rotate(0deg); }
  20% { transform: rotate(10deg); }
  40% { transform: rotate(-10deg); }
  60% { transform: rotate(5deg); }
  80% { transform: rotate(-5deg); }
}

.animate-swing {
  animation: swing 1s ease-in-out;
}
</style>