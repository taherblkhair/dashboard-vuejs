<template>
  <header class="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
    <div class="flex items-center justify-between p-4 px-6">
      <div class="flex items-center gap-4">
        <!-- Sidebar Toggle (Mobile) -->
        <button 
          class="lg:hidden p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-all duration-200"
          @click="$emit('toggle-sidebar')"
          aria-label="تبديل القائمة"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"/>
          </svg>
        </button>

        <h2 class="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-500 bg-clip-text text-transparent">
          {{ currentPageTitle }}
        </h2>
      </div>

      <div class="flex items-center gap-3">
        <!-- Search (Desktop) -->
        <div class="relative hidden lg:block group">
          <input
            type="text"
            placeholder="بحث في النظام..."
            class="w-72 bg-gray-100/50 border border-transparent rounded-xl py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white focus:border-blue-500/50 transition-all duration-300"
          />
          <svg class="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>

        <!-- Notifications -->
        <div class="relative">
          <button class="p-2.5 rounded-xl hover:bg-gray-100 text-gray-500 transition-all duration-200 relative group">
            <svg class="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
            <span class="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
          </button>
        </div>

        <div class="h-6 w-px bg-gray-200 mx-1"></div>

        <!-- User Menu -->
        <div class="relative">
          <button
            class="flex items-center gap-3 p-1.5 pr-3 rounded-xl hover:bg-gray-100 transition-all duration-200 border border-transparent hover:border-gray-200"
            @click="userMenuOpen = !userMenuOpen"
          >
            <div class="text-right hidden sm:block">
              <p class="text-xs font-semibold text-gray-900">{{ displayName }}</p>
              <p class="text-[10px] text-gray-500">مدير النظام</p>
            </div>
            <img
              class="w-9 h-9 rounded-lg object-cover ring-2 ring-transparent group-hover:ring-blue-500/20 transition-all"
              :src="userAvatar"
              alt="User"
            />
          </button>

          <!-- Dropdown Menu -->
          <transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="transform opacity-0 scale-95 -translate-y-2"
            enter-to-class="transform opacity-100 scale-100 translate-y-0"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="transform opacity-100 scale-100 translate-y-0"
            leave-to-class="transform opacity-0 scale-95 -translate-y-2"
          >
            <div
              v-if="userMenuOpen"
              class="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 overflow-hidden"
            >
              <div class="px-3 py-2 border-b border-gray-50 mb-1">
                <p class="text-xs text-gray-400 font-medium">الحساب</p>
              </div>
              <a class="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors cursor-pointer group">
                <svg class="w-4 h-4 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                الملف الشخصي
              </a>
              <a class="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors cursor-pointer group">
                <svg class="w-4 h-4 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                </svg>
                الإعدادات
              </a>
              <div class="border-t border-gray-50 my-1"></div>
              <button @click="handleLogout" class="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer group">
                <svg class="w-4 h-4 text-red-400 group-hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                </svg>
                تسجيل الخروج
              </button>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../../store'

const emit = defineEmits(['toggle-sidebar'] as const)

const route = useRoute()
const router = useRouter()
const userMenuOpen = ref(false)

const currentPageTitle = computed(() => {
  const titles: { [key: string]: string } = {
    '/': 'لوحة التحكم',
    '/products': 'إدارة المنتجات',
    '/orders': 'طلبات المبيعات',
    '/customers': 'العملاء',
    '/reports': 'التقارير التحليلية',
    '/settings': 'الإعدادات العامة',
    '/purchase-orders': 'طلبات الشراء',
    '/purchases/suppliers': 'الموردون',
    '/categories': 'الفئات والأصناف',
    '/warehouses': 'المخازن المستودعات',
    '/delivery-providers': 'شركات التوصيل',
    '/riders': 'المناديب والموصلون'
  }
  return titles[route.path] || 'نظام المبيعات المتكامل'
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
</script>