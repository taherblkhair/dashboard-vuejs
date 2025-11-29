

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
      <nav class="flex-1 flex flex-col gap-1 p-4">
        <router-link
          v-for="item in menuItems"
          :key="item.name"
          :to="item.route"
          class="sidebar-link flex items-center gap-3 px-3 py-3 rounded-lg transition-colors"
          :class="{ 
            'bg-blue-600 text-white': route.path === item.route,
            'hover:bg-slate-700': route.path !== item.route
          }"
          @click="$emit('navigate')"
        >
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon"/>
          </svg>
          <span class="flex-1">{{ item.name }}</span>
          <span v-if="item.badge" class="bg-red-500 text-xs px-2 py-1 rounded-full">
            {{ item.badge }}
          </span>
        </router-link>
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
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps<{ isOpen: boolean }>()
const emit = defineEmits<{
  close: []
  navigate: []
}>()

const route = useRoute()

// compute classes for aside
const asideClasses = computed(() => [
  'fixed inset-y-0 left-0 z-40 w-64 bg-slate-800 text-white transform transition-transform duration-200 ease-in-out flex flex-col',
  props.isOpen ? 'translate-x-0' : '-translate-x-full',
  'md:relative md:translate-x-0 md:h-screen'
].join(' '))

// قائمة القوائم مع الأيقونات
const menuItems = ref([
  {
    name: 'لوحة التحكم',
    route: '/',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
  },
  {
    name: 'المنتجات',
    route: '/products',
    icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
    badge: '5'
  },
  {
    name: 'الطلبات',
    route: '/orders',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    badge: '12'
  },
  {
    name: 'العملاء',
    route: '/customers',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
  },
  {
    name: 'التقارير',
    route: '/reports',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
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

.router-link-active {
  @apply bg-blue-600 text-white;
}
</style>