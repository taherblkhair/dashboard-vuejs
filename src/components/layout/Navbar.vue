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
        <div class="relative hidden xl:block group">
          <input
            type="text"
            placeholder="بحث عن طلب، عميل أو منتج..."
            class="w-96 bg-slate-50 border border-transparent rounded-[1.25rem] py-3 pl-12 pr-5 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-100 transition-all duration-300 placeholder:text-slate-400"
          />
          <svg class="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <div class="absolute right-4 top-1/2 -translate-y-1/2 hidden group-focus-within:flex items-center gap-1">
             <kbd class="px-1.5 py-0.5 text-[10px] font-bold text-slate-400 bg-slate-100 rounded border border-slate-200">⌘</kbd>
             <kbd class="px-1.5 py-0.5 text-[10px] font-bold text-slate-400 bg-slate-100 rounded border border-slate-200">K</kbd>
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
        <div class="relative">
          <button
            class="flex items-center gap-3 p-1.5 pl-4 rounded-2xl hover:bg-slate-50 transition-all duration-300 border border-transparent hover:border-slate-100 group"
            @click="userMenuOpen = !userMenuOpen"
          >
            <img
              class="w-10 h-10 rounded-xl object-cover ring-2 ring-white shadow-sm group-hover:ring-indigo-100 transition-all"
              :src="userAvatar"
              alt="User"
            />
            <div class="text-right hidden sm:block">
              <p class="text-sm font-bold text-slate-900 leading-none">{{ displayName }}</p>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">مدير النظام</p>
            </div>
            <svg class="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- Dropdown Menu -->
          <transition
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="transform opacity-0 scale-95 translate-y-4"
            enter-to-class="transform opacity-100 scale-100 translate-y-0"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="transform opacity-100 scale-100 translate-y-0"
            leave-to-class="transform opacity-0 scale-95 translate-y-4"
          >
            <div
              v-if="userMenuOpen"
              class="absolute right-0 mt-3 w-64 bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-indigo-100/50 border border-slate-100 p-3 z-50 overflow-hidden"
            >
              <div class="p-4 bg-slate-50 rounded-2xl mb-2">
                 <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">الحساب النشط</p>
                 <p class="text-xs font-bold text-slate-900 truncate">{{ state.user?.email || 'admin@sabine.ly' }}</p>
              </div>
              
              <div class="space-y-1">
                <a class="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all cursor-pointer group">
                  <div class="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                  </div>
                  الملف الشخصي
                </a>
                <a class="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all cursor-pointer group">
                  <div class="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                    </svg>
                  </div>
                  الإعدادات
                </a>
                <div class="h-px bg-slate-50 my-2 px-4"></div>
                <button @click="handleLogout" class="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer group text-right">
                  <div class="w-8 h-8 rounded-lg bg-rose-100/50 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all text-rose-500">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                    </svg>
                  </div>
                  تسجيل الخروج
                </button>
              </div>
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
    '/products': 'إدارة الآصناف',
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