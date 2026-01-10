<template>
  <div>
    <!-- Overlay for mobile -->
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-40 lg:hidden"
      role="button"
      aria-label="إغلاق القائمة"
      tabindex="0"
      @click="$emit('close')"
    ></div>

    <!-- Sidebar -->
    <aside
      :class="asideClasses"
      style="top: 0"
      @mouseenter="hovered = true"
      @mouseleave="hovered = false"
    >
      <!-- Logo and Header -->
      <div class="p-8 pb-6">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-100 ring-4 ring-white">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div class="min-w-0" v-show="!isCollapsed || hovered">
            <h1 class="text-xl font-black text-slate-900 leading-tight tracking-tight">بالخير</h1>
            <p class="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-0.5">نظام الإدارة المتكامل</p>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-4 py-6 space-y-8 overflow-y-auto custom-scrollbar">
        <!-- Dashboard Section -->
        <div class="space-y-1">
          <router-link
            to="/"
            class="group flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300"
            :class="[
              isActiveRoute('/') && route.path === '/'
                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900',
            ]"
          >
            <div class="flex-shrink-0">
               <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
               </svg>
            </div>
            <span v-show="!isCollapsed || hovered" class="text-sm font-bold">لوحة التحكم</span>
          </router-link>
        </div>

        <!-- Dynamic Menu Groups -->
        <template v-for="item in filteredMenuItems" :key="item.name">
          <div v-if="item.children" class="space-y-2">
            <!-- Group Header -->
            <div v-show="!isCollapsed || hovered" class="px-4 mb-2">
               <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{{ item.name }}</span>
            </div>
            
            <div class="space-y-1">
              <template v-for="child in item.children" :key="child.name">
                <router-link
                  :to="child.route"
                  class="group flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300"
                  :class="[
                    isActiveRoute(child.route)
                      ? 'bg-indigo-50 text-indigo-600 shadow-sm border border-indigo-100/50'
                      : 'text-slate-500 hover:bg-slate-50/80 hover:text-slate-900 border border-transparent',
                  ]"
                  @click="handleNavigate(child)"
                >
                  <div class="relative flex-shrink-0">
                    <div 
                      class="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300"
                      :class="isActiveRoute(child.route) ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 scale-110' : 'bg-slate-50 group-hover:bg-white group-hover:shadow-sm border border-transparent group-hover:border-slate-100'"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" :d="child.icon" />
                      </svg>
                    </div>
                    <span v-if="child.badge" class="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-sm px-1">
                      {{ child.badge }}
                    </span>
                  </div>
                  <div class="min-w-0 flex-1 flex items-center justify-between" v-show="!isCollapsed || hovered">
                    <span class="text-sm font-bold truncate">{{ child.name }}</span>
                    <div v-if="isActiveRoute(child.route)" class="w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>
                  </div>
                </router-link>
              </template>
            </div>
          </div>
        </template>
      </nav>

      <!-- User Profile & Toggle -->
      <div class="p-6 border-t border-slate-100 space-y-6">
        <!-- Collapse Toggle -->
      

        <!-- User Profile Card -->
        <div class="relative">
          <div 
            class="flex items-center gap-3 p-2 bg-slate-900 rounded-[2rem] shadow-xl shadow-slate-200/50 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer relative overflow-hidden"
            @click="toggleUserMenu"
          >
            <div class="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent"></div>
            <div class="relative flex-shrink-0">
              <img
                class="w-10 h-10 rounded-2xl object-cover ring-2 ring-white/10"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
                alt="User"
              />
              <div class="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-900 shadow-sm"></div>
            </div>
            <div class="min-w-0 flex-1 relative" v-show="!isCollapsed || hovered">
               <p class="text-[9px] font-black text-indigo-400 uppercase leading-none mb-1">أهلاً بك</p>
               <p class="text-sm font-bold text-white truncate">{{ authUser?.name || 'المستخدم' }}</p>
            </div>
            <div v-show="!isCollapsed || hovered" class="p-2 relative transition-transform duration-300" :class="{ 'rotate-180': showUserMenu }">
               <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
               </svg>
            </div>
          </div>

          <!-- User Dropdown Menu -->
          <div 
            v-if="showUserMenu" 
            class="absolute bottom-full right-0 left-0 mb-4 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in slide-in-from-bottom-2 duration-200"
          >
            <div class="p-2">
              <router-link
                to="/profile"
                class="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-all group"
                @click="showUserMenu = false"
              >
                <div class="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span class="text-sm font-bold">الملف الشخصي</span>
              </router-link>

              <button
                @click="handleLogout"
                class="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-rose-600 hover:bg-rose-50 transition-all group"
              >
                <div class="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-all">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </div>
                <span class="text-sm font-bold">تسجيل الخروج</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { logout } from "../../api/auth";

const props = defineProps<{ isOpen: boolean }>();
const emit = defineEmits<{
  close: [];
  navigate: [];
}>();

const route = useRoute();
const router = useRouter();

// States
const isCollapsed = ref(false);
const hovered = ref(false);
const showUserMenu = ref(false);
const searchQuery = ref("");
const authUser = ref<any>(null);

// All defined routes in the sidebar for best-match detection
const allRoutes = computed(() => {
  const routes = ["/"];
  menuItems.value.forEach((group) => {
    group.children?.forEach((child: any) => {
      if (child.route) routes.push(child.route);
    });
  });
  return routes;
});

// Menu state


const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
};

const handleLogout = async () => {
  try {
    await logout();
    router.push("/login");
  } catch (e) {
    console.error("Logout failed:", e);
  }
};

const isActiveRoute = (routePath?: string) => {
  if (!routePath) return false;
  
  // Exact match
  if (route.path === routePath) return true;
  
  // Prefix match (for sub-pages like /orders/1)
  // We only highlight if this is the "best match" among all sidebar links
  if (routePath !== "/" && route.path.startsWith(routePath)) {
    const hasBetterMatch = allRoutes.value.some(
      (r) =>
        r !== routePath &&
        r !== "/" &&
        route.path.startsWith(r) &&
        r.length > routePath.length
    );
    return !hasBetterMatch;
  }
  return false;
};

const handleNavigate = (item: any) => {
  if (item.route) {
    router.push(item.route);
    emit("navigate");
    if (window.innerWidth < 1024) {
      emit("close");
    }
  }
};

const asideClasses = computed(() =>
  [
    "fixed lg:sticky inset-y-0 right-0 z-50 bg-white/95 backdrop-blur-xl text-slate-900 transform transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) flex flex-col border-l border-slate-100 shadow-2xl",
    props.isOpen ? "translate-x-0" : "translate-x-full",
    "lg:translate-x-0 lg:h-screen lg:top-0",
    isCollapsed.value ? "lg:w-24" : "lg:w-80",
    hovered.value && isCollapsed.value ? "lg:w-80 shadow-indigo-100/50" : "",
  ].join(" ")
);

const menuItems = ref<any[]>([
  {
    name: "المبيعات",
    children: [
      {
        name: "طلبات المبيعات",
        route: "/orders",
        icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
      },
      {
        name: "العملاء",
        route: "/customers",
        icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
      },
    ],
  },
  {
    name: "المشتريات",
    children: [
      {
        name: "طلبات الشراء",
        route: "/purchase-orders",
        icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
      },
      {
        name: "الموردون",
        route: "/purchases/suppliers",
        icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
      },
      {
        name: "استلام الطلبات",
        route: "/purchase-orders/receives",
        icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
      },
    ],
  },
  {
    name: "المخزون",
    children: [
      {
        name: "الأصناف",
        route: "/products",
        icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
      },
      {
        name: "الفئات",
        route: "/categories",
        icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z",
      },
      {
        name: "المخازن",
        route: "/warehouses",
        icon: "M3 7l9-4 9 4v10l-9 4-9-4V7zM12 3v18m0-18L3 7m9-4l9 4m-9 14l9-4m-9 4L3 17",
      },
    ],
  },
  {
    name: "خدمات التوصيل",
    children: [
      {
        name: "المندوبون",
        route: "/riders",
        icon: "M12 12a3 3 0 100-6 3 3 0 000 6z M4 20v-1a4 4 0 014-4h8a4 4 0 014 4v1",
      },
      {
        name: "مزودو الخدمة",
        route: "/delivery-providers",
        icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
      },
      {
        name: "عمليات التوصيل",
        route: "/deliveries",
        icon: "M3 3v18h18V3H3zm3 14V7h12v10H6z",
      },
    ],
  },
  {
    name: "التقارير",
    children: [
      {
        name: "تقرير المخزون",
        route: "/reports",
        icon: "M3 3v18h18V3H3zm5 14V8h2v9H8zm4 0V4h2v18h-2zm4 0v-6h2v6h-2z",
      },
      {
        name: "تقرير المبيعات",
        route: "/reports/sales",
        icon: "M3 3v18h18V3H3zm3 14V7h12v10H6zm3-9h6v2H9V8zm0 4h6v2H9v-2z",
      },
      {
        name: "منخفض المخزون",
        route: "/reports/stock/low-stock",
        icon: "M12 8v4l3 3",
      },
    ],
  },
  {
    name: "النظام",
    children: [
      {
        name: "المستخدمون",
        route: "/users",
        icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
      },
      {
        name: "الإعدادات",
        route: "/settings",
        icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
      }
    ],
  },
]);

const filteredMenuItems = computed(() => {
  if (!searchQuery.value.trim()) return menuItems.value;
  const query = searchQuery.value.toLowerCase();
  return menuItems.value.map(item => ({
    ...item,
    children: item.children.filter((child: any) => child.name.toLowerCase().includes(query))
  })).filter(item => item.children.length > 0);
});

watch(() => route.path, () => {
  if (window.innerWidth < 1024) emit("close");
  showUserMenu.value = false;
});

onMounted(() => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      authUser.value = JSON.parse(userStr);
    } catch (e) {
      console.error('Error parsing user data', e);
    }
  }
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.1);
}
</style>
