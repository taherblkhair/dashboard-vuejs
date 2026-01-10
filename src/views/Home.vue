<template>
  <div class="p-6 space-y-8 bg-[#f8fafc] min-h-screen " dir="rtl">
    <div class="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      <!-- Premium Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">نظرة عامة</h1>
          <p class="text-slate-500 mt-1 font-medium ">أهلاً بك، إليك نبذة عن أداء اليوم</p>
        </div>
        
        <div class="flex items-center gap-4">
          <div class="hidden lg:flex flex-col items-end">
            <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">حالة المزامنة</span>
            <div class="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 shadow-sm">
               <div class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
               <span class="text-xs font-bold">{{ lastUpdateTime }}</span>
            </div>
          </div>
          
          <div class="h-10 w-px bg-slate-200 hidden md:block"></div>
          
          <MButton 
            variant="primary" 
            class="!rounded-2xl !px-6 bg-slate-900 hover:bg-slate-800 shadow-lg shadow-slate-200/50 transform active:scale-95 transition-all"
            @click="load" 
            :loading="loading"
          >
            <template #icon>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            </template>
            تحديث البيانات
          </MButton>
        </div>
      </div>

      <!-- Sophisticated Stat Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="(metric, idx) in statMetrics" :key="idx" 
             class="group relative bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-default"
        >
          <div :class="['absolute top-0 right-0 w-32 h-32 -mr-12 -mt-12 bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-opacity rounded-full blur-3xl', metric.colorClass]"></div>
          
          <div class="flex items-center justify-between relative z-10">
            <div :class="['p-3 rounded-2xl bg-white shadow-sm border border-slate-50', metric.textClass]">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" v-html="metric.iconPath"></svg>
            </div>
            <div class="text-right">
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{{ metric.label }}</span>
              <h3 class="text-3xl font-black text-slate-900 mt-1">{{ metric.value }}</h3>
            </div>
          </div>
          
          <div class="mt-6 flex items-center gap-2 relative z-10">
            <span class="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
              {{ metric.trend }}
            </span>
            <span class="text-[10px] text-slate-400 font-medium">بالنسبة للأمس</span>
          </div>
        </div>
      </div>

      <!-- Mega Dashboard Section -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Hero Revenue Card -->
        <div class="lg:col-span-2 relative group flex flex-col">
           <div class="absolute inset-0 bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden">
              <div class="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
              <div class="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px]"></div>
           </div>
           
           <div class="relative z-10 p-8 flex flex-col h-full text-white">
              <div class="flex items-start justify-between">
                <div>
                   <h2 class="text-indigo-400 font-bold text-xs uppercase tracking-[0.2em] mb-2">تقرير الإيرادات</h2>
                   <p class="text-indigo-100 text-sm opacity-80">إجمالي المبيعات خلال الشهر الحالي</p>
                </div>
                <div class="flex flex-col items-end">
                   <span class="text-4xl font-extrabold tracking-tight text-white">{{ formatCurrency(dashboard.revenue?.last_30_days) }}</span>
                </div>
              </div>

              <!-- Simple Wave Chart Placeholder (SVG) -->
              <div class="mt-8 flex-1 min-h-[140px] flex items-end">
                <svg class="w-full h-24 overflow-visible" viewBox="0 0 400 100" preserveAspectRatio="none">
                  <path d="M0,80 Q50,40 100,60 T200,30 T300,70 T400,20" fill="none" stroke="url(#lineGradient)" stroke-width="6" stroke-linecap="round" />
                  <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stop-color="#818cf8" />
                      <stop offset="100%" stop-color="#c084fc" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div class="mt-8 grid grid-cols-2 gap-4">
                 <div class="bg-white/5 border border-white/10 p-5 rounded-[2rem] backdrop-blur-md">
                    <p class="text-indigo-300 text-[10px] font-bold uppercase mb-2">مبيعات اليوم</p>
                    <p class="text-2xl font-bold">{{ formatCurrency(dashboard.revenue?.today) }}</p>
                 </div>
                 <div class="bg-white/5 border border-white/10 p-5 rounded-[2rem] backdrop-blur-md">
                    <p class="text-indigo-300 text-[10px] font-bold uppercase mb-2">متوسط السلة</p>
                    <p class="text-2xl font-bold">{{ formatCurrency(dashboard.revenue?.average_order_value) }}</p>
                 </div>
              </div>
           </div>
        </div>

        <!-- Performance & Distribution -->
        <MCard class="!p-8 !rounded-[3rem] shadow-xl shadow-slate-200/50 flex flex-col justify-between">
           <div>
             <div class="flex items-center gap-3 mb-8">
               <div class="w-1.5 h-6 bg-slate-900 rounded-full"></div>
               <h3 class="text-lg font-black text-slate-900 uppercase">توزيع العمليات</h3>
             </div>
             
             <div class="space-y-6">
                <div v-for="status in ordersByStatus" :key="status.key" class="group">
                   <div class="flex items-center justify-between mb-2">
                      <div class="flex items-center gap-3">
                         <div :class="['w-2 h-2 rounded-full', status.dotColor]"></div>
                         <span class="text-sm font-bold text-slate-700">{{ status.label }}</span>
                      </div>
                      <span class="text-sm font-black text-slate-900">{{ status.count }}</span>
                   </div>
                   <div class="w-full h-2.5 bg-slate-50 rounded-full overflow-hidden p-0.5 border border-slate-100">
                      <div class="h-full rounded-full transition-all duration-1000 ease-out" 
                           :class="status.barColor"
                           :style="{ width: `${status.percentage}%` }"
                      ></div>
                   </div>
                </div>
             </div>
           </div>

           <div class="mt-12 bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
              <div class="flex items-center justify-between">
                 <div>
                    <p class="text-[10px] font-bold text-slate-400 uppercase">قوة الأداء</p>
                    <p class="text-2xl font-black text-slate-900">{{ getCompletionRate() }}%</p>
                 </div>
                 <div class="flex -space-x-2 space-x-reverse">
                    <div v-for="i in 3" :key="i" class="w-8 h-8 rounded-full border-2 border-white bg-slate-200"></div>
                 </div>
              </div>
           </div>
        </MCard>
      </div>

      <!-- Advanced Tables Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <!-- Recent Orders -->
        <div class="bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-1 overflow-hidden">
          <div class="p-8 flex items-center justify-between">
            <h3 class="text-xl font-black text-slate-900">أحدث الحركات</h3>
            <MButton variant="secondary" size="sm" class="!rounded-xl" @click="router.push('/orders')">القائمة الكاملة</MButton>
          </div>
          
          <div class="overflow-x-auto">
            <MTable :loading="loading" :empty="!dashboard.recent_orders?.length" class="!border-none">
              <template #header>
                <th class="px-8 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest border-none">التعريف</th>
                <th class="px-8 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest border-none">العميل</th>
                <th class="px-8 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest border-none text-center">التاريخ</th>
                <th class="px-8 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest border-none text-center">الحالة</th>
                <th class="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-none">القيمة</th>
              </template>
              <tr v-for="order in dashboard.recent_orders" :key="order.id" 
                  class="group hover:bg-slate-50 transition-colors cursor-pointer border-t first:border-none border-slate-50"
                  @click="router.push({ name: 'OrderDetails', params: { id: order.id } })"
              >
                <td class="px-8 py-5 whitespace-nowrap">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-mono text-xs font-bold ring-4 ring-white shadow-md">
                      #{{ order.id }}
                    </div>
                  </div>
                </td>
                <td class="px-8 py-5 whitespace-nowrap">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 uppercase">
                      {{ initials(order.customer?.name) }}
                    </div>
                    <span class="text-sm font-bold text-slate-900">{{ order.customer?.name }}</span>
                  </div>
                </td>
                <td class="px-8 py-5 whitespace-nowrap text-sm text-slate-400 text-center">
                   {{ formatDate(order.created_at) }}
                </td>
                <td class="px-8 py-5 whitespace-nowrap text-center">
                  <span :class="getStatusBadgeClass(order.status)" class="px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider">
                    {{ getStatusText(order.status) }}
                  </span>
                </td>
                <td class="px-8 py-5 whitespace-nowrap text-left font-black text-slate-900 text-sm">
                   {{ formatCurrency(order.total) }}
                </td>
              </tr>
            </MTable>
          </div>
        </div>

        <!-- Top Products & Inventory -->
        <div class="flex flex-col gap-8">
           <!-- Top Products -->
           <div class="bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-8">
              <h3 class="text-xl font-black text-slate-900 mb-6">الأفضل أداءً</h3>
              <div class="space-y-4">
                 <div v-for="(p, idx) in dashboard.top_products" :key="idx" 
                      class="flex items-center gap-4 p-4 rounded-[2rem] bg-slate-50 border border-slate-100 hover:border-indigo-100 hover:bg-white transition-all duration-300 group"
                 >
                    <div class="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center font-black text-slate-900 shadow-sm group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-colors">
                      {{ Number(idx) + 1 }}
                    </div>
                    <div class="flex-1 min-w-0">
                       <p class="text-sm font-black text-slate-900 truncate">{{ getProductName(p.product_variant_id) }}</p>
                       <p class="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">معرّف المتغير: {{ p.product_variant_id }}</p>
                    </div>
                    <div class="text-right">
                       <p class="text-lg font-black text-slate-900">{{ p.total_sold }}</p>
                       <p class="text-[10px] font-bold text-emerald-500 uppercase">وحدة مباعة</p>
                    </div>
                 </div>
              </div>
           </div>

           <!-- Low Stock mini widget -->
           <div class="bg-white rounded-[3rem] border-2 border-dashed border-slate-100 p-8 flex items-center justify-between group cursor-pointer" @click="router.push('/reports/stock/low-stock')">
              <div class="flex items-center gap-4">
                 <div class="p-4 bg-rose-50 text-rose-500 rounded-[2rem]">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.698-.833-2.464 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
                 </div>
                 <div>
                    <h4 class="text-sm font-black text-slate-900">تنبيهات المخزون</h4>
                    <p class="text-xs text-slate-400 mt-1">يوجد <span class="text-rose-600 font-bold">{{ dashboard.low_stock?.length || 0 }}</span> أصناف بحاجة لإعادة التزويد</p>
                 </div>
              </div>
              <div class="w-10 h-10 rounded-full flex items-center justify-center bg-slate-50 group-hover:translate-x-[-10px] transition-transform">
                 <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/></svg>
              </div>
           </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { fetchDashboard } from '../api/dashboard'
import MCard from '../components/ui/MCard.vue'
import MButton from '../components/ui/MButton.vue'
import MTable from '../components/ui/MTable.vue'
import { formatCurrency, formatDate, formatTime } from '../utils/helpers'
import { getOrderStatusLabel, getOrderStatusColor } from '../constants'
import { useToast } from '../composables/useToast'

const router = useRouter()
const dashboard = ref<any>({})
const loading = ref(false)
const lastUpdateTime = ref<string>('')
const { addToast } = useToast()

const meta = computed(() => dashboard.value.meta || {})

// Stat Metrics Generator ... (unchanged)
const statMetrics = computed(() => [
  { 
    label: 'إجمالي الطلبات', 
    value: meta.value.total_orders ?? 0, 
    trend: '+12%',
    colorClass: 'from-indigo-500 to-blue-500',
    textClass: 'text-indigo-600',
    iconPath: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>'
  },
  { 
    label: 'قاعدة العملاء', 
    value: meta.value.customers ?? 0, 
    trend: '+4%',
    colorClass: 'from-emerald-500 to-teal-500',
    textClass: 'text-emerald-600',
    iconPath: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-4.201V5a4 4 0 00-8 0v2.153"/>'
  },
  { 
    label: 'المناديب النشطون', 
    value: meta.value.active_riders ?? 0, 
    trend: '+20%',
    colorClass: 'from-fuchsia-500 to-purple-500',
    textClass: 'text-fuchsia-600',
    iconPath: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z"/>'
  },
  { 
    label: 'توصيلات قيد العمل', 
    value: dashboard.value.pending_deliveries ?? 0, 
    trend: '-3%',
    colorClass: 'from-orange-500 to-amber-500',
    textClass: 'text-orange-600',
    iconPath: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>'
  },
])

const ordersByStatus = computed(() => {
  const data = dashboard.value.orders_by_status || {}
  const statuses = [
    { key: 'draft', label: 'المسودات', dotColor: 'bg-slate-300', barColor: 'bg-slate-200', count: 0 },
    { key: 'pending', label: 'قيد المراجعة', dotColor: 'bg-amber-400', barColor: 'bg-amber-400', count: 0 },
    { key: 'confirmed', label: 'طلبات مؤكدة', dotColor: 'bg-indigo-500', barColor: 'bg-indigo-500', count: 0 },
    { key: 'delivered', label: 'سلمت بنجاح', dotColor: 'bg-emerald-500', barColor: 'bg-emerald-500', count: 0 },
  ]
  
  const total = Object.values(data).reduce((s: number, c: any) => s + (Number(c) || 0), 0)
  
  return statuses.map(s => {
    const count = Number(data[s.key] || 0)
    return {
      ...s,
      count,
      percentage: total > 0 ? (count / total) * 100 : 0
    }
  })
})

const getCompletionRate = () => {
  const orders = dashboard.value.orders_by_status || {}
  const total = Object.values(orders).reduce((sum: number, item: any) => sum + (Number(item) || 0), 0)
  const completed = Number(orders.delivered || 0)
  return total > 0 ? Math.round((completed / total) * 100) : 0
}

const initials = (name?: string) => name ? name.split(' ').map(n=>n[0]).slice(0,2).join('').toUpperCase() : '??'

const getProductName = (id: number) => `منتج متغير #${id}`

const getStatusText = getOrderStatusLabel
const getStatusBadgeClass = getOrderStatusColor

const updateTime = () => {
  lastUpdateTime.value = formatTime(new Date().toISOString())
}

const load = async () => {
  loading.value = true
  try {
    const res = await fetchDashboard()
    dashboard.value = res?.data ?? res ?? {}
    updateTime()
  } catch (e) {
    addToast('فشل تحميل لوحة التحكم', 'error')
  } finally {
    loading.value = false
  }
}

let timer: any = null
onMounted(() => {
  load()
  timer = setInterval(load, 5 * 60 * 1000)
})
onUnmounted(() => { if (timer) clearInterval(timer) })
</script>

<style scoped>
/* Advanced Layout Styling */
.font-sans {
  font-family: 'Inter', 'Noto Sans Arabic', sans-serif;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-in {
  animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Hide scrollbar but allow scrolling */
.overflow-x-auto::-webkit-scrollbar {
  display: none;
}
.overflow-x-auto {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>