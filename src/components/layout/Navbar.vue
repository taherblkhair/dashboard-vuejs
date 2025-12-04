<template>
  <header class="bg-white shadow-sm border-b border-gray-200">
    <div class="flex items-center justify-between p-4">
      <div class="flex items-center gap-4">
        <button
          class="p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
          @click="$emit('toggle-sidebar')"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
        
        <h2 class="text-xl font-semibold text-gray-800">
          {{ currentPageTitle }}
        </h2>
      </div>

      <div class="flex items-center gap-4">
        <!-- Quick Reports Shortcut -->
        <button @click="router.push('/reports')" class="p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors" title="التقارير">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3v18h18"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 14l3-3 3 3 4-4"/>
          </svg>
        </button>
        <!-- Search -->
        <div class="relative hidden md:block">
          <input
            type="text"
            placeholder="بحث..."
            class="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <svg class="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>

        <!-- Notifications -->
        <button class="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
          <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
          </svg>
          <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <!-- User Menu -->
        <div class="relative">
          <button
            class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            @click="userMenuOpen = !userMenuOpen"
          >
            <img
              class="w-8 h-8 rounded-full"
              :src="userAvatar"
              alt="User"
            />
            <span class="hidden md:block text-sm font-medium">{{ displayName }}</span>
          </button>

          <!-- Dropdown Menu -->
          <div
            v-if="userMenuOpen"
            class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
          >
            <a class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">الملف الشخصي</a>
            <a class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">الإعدادات</a>
            <div class="border-t border-gray-200 my-1"></div>
            <button @click="handleLogout" class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">تسجيل الخروج</button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../../store'

// declare emits in an array form (supports hyphenated event names)
const emit = defineEmits(['toggle-sidebar'] as const)

const route = useRoute()
const router = useRouter()
const userMenuOpen = ref(false)

const currentPageTitle = computed(() => {
  const titles: { [key: string]: string } = {
    '/': 'لوحة التحكم',
    '/products': 'إدارة المنتجات',
    '/orders': 'الطلبات',
    '/customers': 'العملاء',
    '/reports': 'التقارير',
    '/settings': 'الإعدادات'
  }
  return titles[route.path] || 'نظام المبيعات'
})

const { state, logout } = useAuth()

const displayName = computed(() => {
  return state.user?.name || state.user?.username || state.user?.email || 'مستخدم'
})

const userAvatar = computed(() => state.user?.avatar || 'https://via.placeholder.com/32')

async function handleLogout() {
  try {
    // wait for logout to finish so token is removed before navigation
    await logout()
  } catch (e) {
    // ignore errors from logout API, still navigate to login
    // could log e if needed
  } finally {
    userMenuOpen.value = false
    router.push({ name: 'Login' })
  }
}

</script>