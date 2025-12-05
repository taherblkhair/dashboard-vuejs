<template>
  <div>
    <!-- Overlay for mobile -->
    <div 
      v-if="isOpen" 
      class="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
      @click="$emit('close')"
    ></div>

    <!-- Sidebar -->
    <aside :class="asideClasses" style="top:0">
      <!-- Logo and Title -->
      <div class="flex items-center justify-between p-4 border-b border-slate-700">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <span class="font-bold text-white">S</span>
          </div>
          <h1 class="text-xl font-bold">نظام المبيعات</h1>
        </div>
        <button 
          class="md:hidden p-1 rounded hover:bg-slate-700"
          @click="$emit('close')"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Navigation Links -->
      <nav class="flex-1 flex flex-col gap-1 p-4 overflow-y-auto">
        <div v-for="item in menuItems" :key="item.name">
          <!-- Main Menu Items -->
          <div v-if="!item.children" class="mb-1">
            <router-link
              v-if="item.route"
              :to="item.route"
              class="sidebar-link flex items-center gap-3 px-3 py-3 rounded-lg transition-colors"
              :class="{ 
                'bg-blue-600 text-white': isActiveRoute(item.route),
                'hover:bg-slate-700': !isActiveRoute(item.route)
              }"
              @click="handleNavigate(item)"
            >
              <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon"/>
              </svg>
              <span class="flex-1">{{ item.name }}</span>
              <span v-if="item.badge" class="bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-5 h-5 flex items-center justify-center">
                {{ item.badge }}
              </span>
            </router-link>
          </div>

          <!-- Menu Items with Children -->
          <div v-else class="mb-1">
            <button
              class="w-full sidebar-link flex items-center gap-3 px-3 py-3 rounded-lg transition-colors hover:bg-slate-700"
              :class="{ 'bg-slate-700': openMenus[item.name] }"
              @click="toggleMenu(item.name)"
            >
              <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon"/>
              </svg>
              <span class="flex-1 text-right">{{ item.name }}</span>
              <span v-if="item.badge" class="bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-5 h-5 flex items-center justify-center">
                {{ item.badge }}
              </span>
              <svg 
                class="w-4 h-4 transition-transform duration-200 flex-shrink-0" 
                :class="{ 'rotate-180': openMenus[item.name] }"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>

            <!-- Submenu -->
            <div 
              v-show="openMenus[item.name]"
              class="mt-1 ml-4 space-y-1 overflow-hidden transition-all duration-200"
            >
              <template v-for="child in item.children" :key="child.name">
                <router-link
                  v-if="child.route"
                  :to="child.route"
                  class="submenu-link flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm"
                  :class="{ 
                    'bg-blue-600 text-white': isActiveRoute(child.route),
                    'hover:bg-slate-700': !isActiveRoute(child.route)
                  }"
                  @click="handleNavigate(child)"
                >
                  <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="child.icon"/>
                  </svg>
                  <span class="flex-1">{{ child.name }}</span>
                  <span v-if="child.badge" class="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-4 h-4 flex items-center justify-center">
                    {{ child.badge }}
                  </span>
                </router-link>
              </template>
            </div>
          </div>
        </div>
      </nav>

      <!-- User Section -->
      <div class="p-4 border-t border-slate-700">
        <div class="flex items-center gap-3">
          <img
            class="w-10 h-10 rounded-full border-2 border-slate-600"
            src="https://via.placeholder.com/40"
            alt="User"
          />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium truncate">أحمد محمد</p>
            <p class="text-xs text-slate-400 truncate">مدير المبيعات</p>
          </div>
          <button class="p-1 rounded hover:bg-slate-700">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps<{ isOpen: boolean }>()
const emit = defineEmits<{
  close: []
  navigate: []
}>()

const route = useRoute()
const router = useRouter()

// تعريف الأنواع
interface MenuItem {
  name: string
  route?: string
  icon: string
  badge?: string | number
  children?: MenuItem[]
}

// حالة القوائم المفتوحة
const openMenus = reactive<{ [key: string]: boolean }>({
  'المبيعات': false,
  'المشتريات': false,
  'المخزون': false,
  'التقارير': false
})

// دالة لفتح/إغلاق القوائم
const toggleMenu = (menuName: string) => {
  openMenus[menuName] = !openMenus[menuName]
}

// دالة للتحقق من المسار النشط
const isActiveRoute = (routePath?: string) => {
  return routePath && route.path === routePath
}

// دالة للتنقل
const handleNavigate = (item: MenuItem) => {
  if (item.route) {
    router.push(item.route)
    emit('navigate')
  }
}

// compute classes for aside
const asideClasses = computed(() => [
  'fixed inset-y-0 left-0 z-40 w-64 bg-slate-800 text-white transform transition-transform duration-200 ease-in-out flex flex-col',
  props.isOpen ? 'translate-x-0' : '-translate-x-full',
  'md:relative md:translate-x-0 md:h-screen'
].join(' '))

// قائمة القوائم مع القوائم الفرعية
const menuItems = ref<MenuItem[]>([
  {
    name: 'لوحة التحكم',
    route: '/',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
  },
  {
    name: 'المبيعات',
    children: [
      {
        name: 'فواتير المبيعات',
        route: '/sales/invoices',
        icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
        badge: '3'
      },
      {
        name: 'طلبات المبيعات',
        route: '/orders',
        icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
        badge: '12'
      },
      {
        name: 'عملاء المبيعات',
        route: '/customers',
        icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
      },
      {
        name: 'تقارير المبيعات',
        route: '/sales/reports',
        icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
      }
    ],
    icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
    badge: '15'
  },
  {
    name: 'المشتريات',
    children: [
      {
        name: 'فواتير المشتريات',
        route: '/purchases/invoices',
        icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
        badge: '5'
      },
      {
        name: 'طلبات الشراء',
        route: '/purchase-orders',
        icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
      },
      {
        name: 'الموردون',
        route: '/purchases/suppliers',
        icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
      }
    ],
    icon: 'M3 3h18v18H3V3zm16 16V5H5v14h14zM7 7h10v2H7V7zm0 4h10v2H7v-2zm0 4h7v2H7v-2z'
  },
  {
    name: 'المخزون',
    children: [
      {
        name: 'الأصناف',
        route: '/products',
        icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
        badge: '45'
      },
      {
        name: 'الفئات',
        route: '/categories',
        icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z'
      },
      {
        name: 'المخازن',
        route: '/warehouses',
        icon: 'M3 7l9-4 9 4v10l-9 4-9-4V7zM12 3v18m0-18L3 7m9-4l9 4m-9 14l9-4m-9 4L3 17',},
      {
        name: 'جرد المخزون',
        route: '/inventory/stocktaking',
        icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01'
      }
    ],
    icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4'
  },
  // شركات الشحن والتوصيل 
   {
    name: 'خدمات التوصيل',
    children: [
      {
        name: 'شركات التوصيل',
        route: '/delivery-providers',
        icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2'
      },
      {
        name: 'المندوبون',
        route: '/riders',
        icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2'
      },
      {
        name: 'عمليات التوصيل',
        route: '/deliveries',
        icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2'
      }
    
    ],
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2'
  },
  {
    name: 'التقارير',
    children: [
      {
        name: 'تقرير المخزون',
        route: '/reports',
        icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2'
      },
      {
        name: 'تقرير المبيعات',
        route: '/reports/sales',
        icon: 'M3 3v18h18V3H3zm3 14V7h12v10H6zm3-9h6v2H9V8zm0 4h6v2H9v-2z'
      },
      {
        name: 'منخفض المخزون',
        route: '/reports/stock/low-stock',
        icon: 'M12 8v4l3 3'
      }
          ,{
            name: 'تقرير المشتريات',
            route: '/reports/purchases',
            icon: 'M3 3v18h18V3H3zm3 14V7h12v10H6zm3-9h6v2H9V8zm0 4h6v2H9v-2z'
          }
    ],
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2'
  },
  {
    name: 'الإعدادات',
    route: '/settings',
    icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
  }
])
</script>

<style scoped>
.sidebar-link {
  @apply flex items-center gap-3 px-3 py-3 rounded-lg transition-colors duration-200;
}

.submenu-link {
  @apply flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 text-sm;
}

.router-link-active {
  @apply bg-blue-600 text-white;
}

/* Scrollbar styling for sidebar */
nav::-webkit-scrollbar {
  width: 4px;
}

nav::-webkit-scrollbar-track {
  background: #1e293b;
}

nav::-webkit-scrollbar-thumb {
  background: #475569;
  border-radius: 2px;
}

nav::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}
</style>