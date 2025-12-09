<template>
  <div>
    <!-- Overlay for mobile -->
    <div 
      v-if="isOpen" 
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
      role="button"
      aria-label="إغلاق القائمة"
      tabindex="0"
      @click="$emit('close')"
    ></div>

    <!-- Sidebar -->
    <aside 
      :class="asideClasses" 
      style="top:0"
      @mouseenter="hovered = true"
      @mouseleave="hovered = false"
    >
      <!-- Logo and Header -->
      <div class="p-6 border-b border-slate-700/50">
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <div class="min-w-0" v-show="!isCollapsed || hovered">
              <h1 class="text-lg font-bold truncate">نظام المبيعات</h1>
              <p class="text-xs text-slate-400 truncate">الإدارة المتكاملة</p>
            </div>
          </div>
          <button 
            v-if="!isCollapsed || hovered"
            class="lg:hidden p-2 rounded-lg hover:bg-slate-700/50 transition-colors"
            @click="$emit('close')"
            aria-label="إغلاق القائمة"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Search Bar -->
        <div class="mt-4" v-show="!isCollapsed || hovered">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="بحث في القوائم..."
              aria-label="بحث في القوائم"
              class="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 flex flex-col p-4 space-y-1 overflow-y-auto">
        <template v-for="item in filteredMenuItems" :key="item.name">
          <!-- Menu Item without Children -->
          <div v-if="!item.children" class="menu-item">
            <router-link
              :to="item.route"
              class="group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200"
              :class="[
                isActiveRoute(item.route) 
                  ? 'bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 shadow-lg shadow-blue-500/10' 
                  : 'hover:bg-slate-700/50 hover:border hover:border-slate-600/50'
              ]"
              @click="handleNavigate(item)"
            >
              <div class="relative flex-shrink-0">
                <div class="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon"/>
                  </svg>
                </div>
                <span v-if="item.badge" class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center border-2 border-slate-800">
                  {{ item.badge }}
                </span>
              </div>
              <div class="min-w-0 flex-1" v-show="!isCollapsed || hovered">
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium truncate">{{ item.name }}</span>
                
                </div>
                <p v-if="item.description" class="text-xs text-slate-400 truncate mt-0.5">
                  {{ item.description }}
                </p>
              </div>
            </router-link>
          </div>

          <!-- Menu Item with Children -->
          <div v-else class="menu-item">
            <button
              class="w-full group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 hover:bg-slate-700/50 hover:border hover:border-slate-600/50"
              :class="[
                openMenus[item.name] 
                  ? 'bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30' 
                  : ''
              ]"
              @click="toggleMenu(item.name)"
            >
              <div class="relative flex-shrink-0">
                <div class="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon"/>
                  </svg>
                </div>
                <span v-if="item.badge" class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center border-2 border-slate-800">
                  {{ item.badge }}
                </span>
              </div>
              <div class="min-w-0 flex-1 text-right" v-show="!isCollapsed || hovered">
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium truncate">{{ item.name }}</span>
                 
                </div>
              </div>
              <svg 
                v-show="!isCollapsed || hovered"
                class="w-4 h-4 flex-shrink-0 transition-transform duration-200" 
                :class="{ 'rotate-180': openMenus[item.name] }"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>

            <!-- Submenu -->
            <transition
              enter-active-class="transition-all duration-300 ease-out"
              enter-from-class="transform opacity-0 -translate-y-4"
              enter-to-class="transform opacity-100 translate-y-0"
              leave-active-class="transition-all duration-200 ease-in"
              leave-from-class="transform opacity-100 translate-y-0"
              leave-to-class="transform opacity-0 -translate-y-4"
            >
              <div 
                v-show="openMenus[item.name] && (!isCollapsed || hovered)"
                class="mt-1 ml-12 space-y-1 overflow-hidden"
              >
                <router-link
                  v-for="child in item.children"
                  :key="child.name"
                  :to="child.route"
                  class="submenu-item flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm group"
                  :class="[
                    isActiveRoute(child.route)
                      ? 'bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 shadow-lg shadow-blue-500/10'
                      : 'hover:bg-slate-700/50 hover:border hover:border-slate-600/50'
                  ]"
                  @click="handleNavigate(child)"
                >
                  <div class="relative">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="child.icon"/>
                    </svg>
                    <span v-if="child.badge" class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-slate-800"></span>
                  </div>
                  <span class="flex-1 truncate">{{ child.name }}</span>
                  <svg v-if="child.tag === 'new'" class="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1z" clip-rule="evenodd"/>
                  </svg>
                </router-link>
              </div>
            </transition>
          </div>
        </template>
      </nav>

      <!-- Collapse Toggle -->
      <div class="p-4 border-t border-slate-700/50">
        <button
          @click="toggleCollapse"
          class="w-full group flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl hover:bg-slate-700/50 transition-all duration-200"
          :title="isCollapsed ? 'توسيع القائمة' : 'طي القائمة'"
        >
          <svg 
            class="w-5 h-5 transition-transform duration-200"
            :class="{ 'rotate-180': isCollapsed }"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/>
          </svg>
          <span v-if="!isCollapsed" class="text-sm">طي القائمة</span>
        </button>
      </div>

      <!-- User Profile -->
      <div class="p-4 border-t border-slate-700/50">
        <div class="flex items-center gap-3 group cursor-pointer" @click="toggleUserMenu">
          <div class="relative flex-shrink-0">
            <img
              class="w-10 h-10 rounded-xl border-2 border-slate-700 group-hover:border-blue-500 transition-colors"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
              alt="User"
            />
            <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-800"></div>
          </div>
          <div class="min-w-0 flex-1" v-show="!isCollapsed || hovered">
            <div class="flex items-center justify-between">
              <p class="text-sm font-medium truncate">أحمد محمد</p>
              <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"/>
              </svg>
            </div>
            <p class="text-xs text-slate-400 truncate">مدير المبيعات</p>
          </div>
        </div>

        <!-- User Menu Dropdown -->
        <transition
          enter-active-class="transition-all duration-200 ease-out"
          enter-from-class="transform opacity-0 -translate-y-4"
          enter-to-class="transform opacity-100 translate-y-0"
          leave-active-class="transition-all duration-150 ease-in"
          leave-from-class="transform opacity-100 translate-y-0"
          leave-to-class="transform opacity-0 -translate-y-4"
        >
          <div 
            v-if="showUserMenu && (!isCollapsed || hovered)"
            class="mt-3 p-2 bg-slate-800/90 backdrop-blur-sm rounded-xl border border-slate-700 shadow-xl shadow-black/20 space-y-1"
          >
            <a href="#" class="user-menu-item">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              <span>الملف الشخصي</span>
            </a>
            <a href="#" class="user-menu-item">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
              </svg>
              <span>الإعدادات</span>
            </a>
            <div class="border-t border-slate-700/50 my-1"></div>
            <a href="#" class="user-menu-item text-red-400 hover:bg-red-500/10">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
              <span>تسجيل الخروج</span>
            </a>
          </div>
        </transition>
      </div>

      <!-- Quick Actions -->
      <div v-show="!isCollapsed || hovered" class="p-4 border-t border-slate-700/50">
        <div class="grid grid-cols-2 gap-2">
          <button class="quick-action-btn">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            <span class="text-xs">طلب سريع</span>
          </button>
          <button class="quick-action-btn">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
            </svg>
            <span class="text-xs">تقارير</span>
          </button>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps<{ isOpen: boolean }>()
const emit = defineEmits<{
  close: []
  navigate: []
}>()

const route = useRoute()
const router = useRouter()

// States
const isCollapsed = ref(false)
const hovered = ref(false)
const showUserMenu = ref(false)
const searchQuery = ref('')

// Menu state
const openMenus = reactive<{ [key: string]: boolean }>({
  'المبيعات': false,
  'المشتريات': false,
  'المخزون': false,
  'التقارير': false,
  'خدمات التوصيل': false
})

// Toggle menu
const toggleMenu = (menuName: string) => {
  openMenus[menuName] = !openMenus[menuName]
}

// Toggle sidebar collapse
const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
  // Close all submenus when collapsing
  if (isCollapsed.value) {
    Object.keys(openMenus).forEach(key => {
      openMenus[key] = false
    })
    showUserMenu.value = false
  }
}

// Toggle user menu
const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

// Check active route
const isActiveRoute = (routePath?: string) => {
  if (!routePath) return false
  return route.path === routePath || route.path.startsWith(routePath)
}

// Handle navigation
const handleNavigate = (item: any) => {
  if (item.route) {
    router.push(item.route)
    emit('navigate')
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 1024) {
      emit('close')
    }
  }
}

// Sidebar classes
const asideClasses = computed(() => [
  'fixed lg:sticky inset-y-0 left-0 z-50 bg-slate-900/95 backdrop-blur-xl text-white transform transition-all duration-300 ease-in-out flex flex-col border-r border-slate-700/30',
  props.isOpen ? 'translate-x-0' : '-translate-x-full',
  'lg:translate-x-0 lg:h-screen lg:top-0',
  isCollapsed.value ? 'lg:w-20' : 'lg:w-72',
  hovered.value && isCollapsed.value ? 'lg:w-72' : ''
].join(' '))

// Menu items with enhanced data
const menuItems = ref<any[]>([
  {
    name: 'لوحة التحكم',
    route: '/',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    description: 'نظرة عامة على النظام',
    tag: 'dashboard'
  },
  {
    name: 'المبيعات',
    children: [
      {
        name: 'طلبات المبيعات',
        route: '/orders',
        icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
        badge: '12',
        tag: 'new'
      },
      {
        name: 'عملاء المبيعات',
        route: '/customers',
        icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
      },
    ],
    icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
    badge: '3',
    tag: 'sales'
  },
  {
    name: 'المشتريات',
    children: [
      {
        name: 'طلبات الشراء',
        route: '/purchase-orders',
        icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
        badge: '5'
      },
      {
        name: 'الموردون',
        route: '/purchases/suppliers',
        icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
      },
      {
        name: 'استلام الطلبات',
        route: '/purchase-orders/receives',
        icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
      }
    ],
    icon: 'M3 3h18v18H3V3zm16 16V5H5v14h14zM7 7h10v2H7V7zm0 4h10v2H7v-2zm0 4h7v2H7v-2z',
    tag: 'purchases'
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
        icon: 'M3 7l9-4 9 4v10l-9 4-9-4V7zM12 3v18m0-18L3 7m9-4l9 4m-9 14l9-4m-9 4L3 17'
      }
    ],
    icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4',
    tag: 'inventory'
  },
  {
    name: 'خدمات التوصيل',
    children: [
      {
        name: 'شركات التوصيل',
        route: '/delivery-providers',
        // truck icon
        icon: 'M3 7h13l4 4v6a1 1 0 01-1 1h-1a3 3 0 11-6 0H9a3 3 0 11-6 0H3V7z'
      },
      {
        name: 'المندوبون',
        route: '/riders',
        // user/driver icon
        icon: 'M12 12a3 3 0 100-6 3 3 0 000 6z M4 20v-1a4 4 0 014-4h8a4 4 0 014 4v1'
      },
      {
        name: 'عمليات التوصيل',
        route: '/deliveries',
        // deliveries / map-pin or package icon
        icon: 'M3 3v18h18V3H3zm3 14V7h12v10H6z'
      }
    ],
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2z',
    tag: 'delivery'
  },
  {
    name: 'التقارير',
    children: [
      {
        name: 'تقرير المخزون',
        route: '/reports',
        // chart / reports icon
        icon: 'M3 3v18h18V3H3zm5 14V8h2v9H8zm4 0V4h2v18h-2zm4 0v-6h2v6h-2z'
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
      },
      {
        name: 'تقرير المشتريات',
        route: '/reports/purchases',
        icon: 'M3 3v18h18V3H3zm3 14V7h12v10H6zm3-9h6v2H9V8zm0 4h6v2H9v-2z'
      }
    ],
    icon: 'M3 3v18h18V3H3zm5 14V8h2v9H8zm4 0V4h2v18h-2zm4 0v-6h2v6h-2z',
    tag: 'reports'
  },
  {
    name: 'الإعدادات',
    route: '/settings',
    icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
    description: 'إدارة النظام',
    tag: 'settings'
  }
])

// Filter menu items based on search
const filteredMenuItems = computed(() => {
  if (!searchQuery.value.trim()) return menuItems.value

  const query = searchQuery.value.toLowerCase()
  return menuItems.value.filter(item => {
    // Check if item name matches
    if (item.name.toLowerCase().includes(query)) return true
    
    // Check if item has children and any child matches
    if (item.children) {
      const matchingChildren = item.children.filter((child: any) => 
        child.name.toLowerCase().includes(query)
      )
      if (matchingChildren.length > 0) return true
    }
    
    // Check if description matches
    if (item.description && item.description.toLowerCase().includes(query)) return true
    
    return false
  }).map(item => {
    if (!item.children) return item
    
    // Filter children for matching items
    const filteredChildren = item.children.filter((child: any) =>
      child.name.toLowerCase().includes(query) ||
      child.description?.toLowerCase().includes(query)
    )
    
    return {
      ...item,
      children: filteredChildren.length > 0 ? filteredChildren : item.children
    }
  })
})

// Close sidebar on route change for mobile
watch(() => route.path, () => {
  if (window.innerWidth < 1024) {
    emit('close')
  }
})

// Initialize open menus based on current route
onMounted(() => {
  const currentPath = route.path
  Object.keys(openMenus).forEach(key => {
    const menuItem = menuItems.value.find(item => item.name === key)
    if (menuItem?.children) {
      const hasActiveChild = menuItem.children.some((child: any) => 
        currentPath.startsWith(child.route || '')
      )
      if (hasActiveChild) {
        openMenus[key] = true
      }
    }
  })
})
</script>

<style scoped>
/* Custom scrollbar */
nav::-webkit-scrollbar {
  width: 6px;
}

nav::-webkit-scrollbar-track {
  background: rgba(30, 41, 59, 0.5);
  border-radius: 10px;
}

nav::-webkit-scrollbar-thumb {
  background: rgba(100, 116, 139, 0.5);
  border-radius: 10px;
}

nav::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.7);
}

/* Menu item hover effects */
.menu-item {
  @apply relative;
}

.menu-item::before {
  content: '';
  @apply absolute -left-2 top-1/2 transform -translate-y-1/2 w-1 h-0 bg-blue-500 rounded-r transition-all duration-300;
}

.menu-item:hover::before,
.menu-item:has(.router-link-active)::before {
  @apply h-6;
}

/* Submenu item hover effects */
.submenu-item {
  @apply relative overflow-hidden;
}

.submenu-item::before {
  content: '';
  @apply absolute left-0 top-0 bottom-0 w-1 bg-blue-500 transform -translate-x-full transition-transform duration-300;
}

.submenu-item:hover::before,
.submenu-item.router-link-active::before {
  @apply translate-x-0;
}

/* User menu item */
.user-menu-item {
  @apply flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-slate-700/50 transition-all duration-200;
}

/* Quick action button */
.quick-action-btn {
  @apply flex flex-col items-center justify-center gap-1 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 hover:border-slate-600/50 transition-all duration-200;
}

/* Collapsed state adjustments */
:deep(.router-link-active) {
  @apply relative;
}

:deep(.router-link-active)::after {
  content: '';
  @apply absolute left-2 top-1/2 transform -translate-y-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full;
}

/* Animation for badge */
@keyframes pulse-badge {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.badge-pulse {
  animation: pulse-badge 2s infinite;
}
</style>