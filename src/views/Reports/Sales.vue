<template>
  <div class="p-6 bg-slate-50/50 min-h-screen animate-fade-in" dir="rtl">
    <div class="max-w-7xl mx-auto">
      <!-- Header Section -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 class="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <svg class="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
            تقرير المبيعات
          </h1>
          <p class="text-sm text-slate-500 mt-1">تحليل شامل للمبيعات، العملاء الأكثر تفاعلاً، وأداء القنوات المختلفة.</p>
        </div>
        
        <div class="flex items-center gap-3">
          <button @click="load" class="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-all shadow-sm font-medium">
            <svg class="w-5 h-5" :class="{ 'animate-spin': loading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            تحديث البيانات
          </button>
        </div>
      </div>

      <!-- KPI Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div class="absolute -right-6 -top-6 w-24 h-24 bg-blue-50 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
          <div class="relative flex items-center gap-4">
            <div class="p-4 bg-blue-100/50 text-blue-600 rounded-2xl">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
            </div>
            <div>
              <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">إجمالي الطلبات</p>
              <h3 class="text-3xl font-black text-slate-800">{{ data.total_orders ?? '0' }}</h3>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div class="absolute -right-6 -top-6 w-24 h-24 bg-emerald-50 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
          <div class="relative flex items-center gap-4">
            <div class="p-4 bg-emerald-100/50 text-emerald-600 rounded-2xl">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">إجمالي الإيرادات</p>
              <h3 class="text-3xl font-black text-emerald-600">{{ formatCurrency(data.total_revenue) }}</h3>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div class="absolute -right-6 -top-6 w-24 h-24 bg-indigo-50 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
          <div class="relative flex items-center gap-4">
            <div class="p-4 bg-indigo-100/50 text-indigo-600 rounded-2xl">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
              </svg>
            </div>
            <div>
              <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">متوسط قيمة الطلب</p>
              <h3 class="text-3xl font-black text-slate-800">{{ formatCurrency(data.average_order_value) }}</h3>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
        <!-- Orders by Source -->
        <div class="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div class="p-6 border-b border-slate-100">
            <h3 class="font-bold text-slate-800 flex items-center gap-2">
              <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
              الطلبات بحسب المصدر
            </h3>
          </div>
          <div class="p-6 flex-1">
            <div v-if="!data.orders_by_source || Object.keys(data.orders_by_source).length === 0" class="flex flex-col items-center justify-center py-12 text-slate-400">
              <svg class="w-12 h-12 mb-3 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
              </svg>
              لا توجد بيانات متاحة
            </div>
            <div v-else class="space-y-6">
              <div v-for="(count, source) in data.orders_by_source" :key="source">
                <div class="flex justify-between items-center mb-2">
                  <span class="text-sm font-bold text-slate-600 capitalize">{{ String(source) === 'pos' ? 'نقطة بيع' : (String(source) === 'online' ? 'أونلاين' : source) }}</span>
                  <span class="text-xs font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{{ count }} طلب</span>
                </div>
                <div class="h-3 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                  <div 
                    class="h-full bg-gradient-to-l from-blue-500 to-blue-400 rounded-full transition-all duration-1000"
                    :style="{ width: `${(count / data.total_orders) * 100}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Top Customers -->
        <div class="lg:col-span-3 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 class="font-bold text-slate-800 flex items-center gap-2">
              <span class="w-2 h-2 bg-emerald-500 rounded-full"></span>
              أفضل العملاء
            </h3>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="bg-slate-50/50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                  <th class="px-6 py-4 text-right">العميل</th>
                  <th class="px-6 py-4 text-center">الطلبات</th>
                  <th class="px-6 py-4 text-left font-sans">Total Spent</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-if="!data.top_customers?.length">
                  <td colspan="3" class="px-6 py-12 text-center text-slate-400 italic">لا توجد بيانات متاحة حالياً.</td>
                </tr>
                <tr v-for="c in data.top_customers" :key="c.customer_id" class="hover:bg-slate-50/50 transition-colors group">
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                        </svg>
                      </div>
                      <span class="font-bold text-slate-700">{{ c.customer_name }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-center">
                    <span class="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-black">{{ c.order_count }}</span>
                  </td>
                  <td class="px-6 py-4 text-left font-black text-emerald-600">{{ formatCurrency(c.total_spent) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Daily Sales -->
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="p-6 border-b border-slate-100">
          <h3 class="font-bold text-slate-800 flex items-center gap-2">
            <span class="w-2 h-2 bg-indigo-500 rounded-full"></span>
            تحليل المبيعات اليومية
          </h3>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-slate-50/50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <th class="px-6 py-4 text-right">التاريخ</th>
                <th class="px-6 py-4 text-center">عدد الطلبات</th>
                <th class="px-6 py-4 text-left font-sans">Revenue</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-if="!data.daily_sales?.length">
                <td colspan="3" class="px-6 py-12 text-center text-slate-400 italic">لا توجد مبيعات مسجلة مؤخراً.</td>
              </tr>
              <tr v-for="d in data.daily_sales" :key="d.date" class="hover:bg-slate-50/50 transition-colors group">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="p-2 bg-slate-50 text-slate-400 rounded-lg group-hover:text-indigo-600 transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                    </div>
                    <span class="font-bold text-slate-700">{{ formatDate(d.date) }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 text-center font-black text-slate-500">{{ d.orders_count }}</td>
                <td class="px-6 py-4 text-left font-black text-slate-800">{{ formatCurrency(d.total_sales) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { fetchSalesReport } from '../../api/reports'
import { formatCurrency, formatDate } from '../../utils/helpers'
import { useToast } from '../../composables/useToast'

const data = ref<any>({})
const loading = ref(false)
const { addToast } = useToast()

const load = async () => {
  loading.value = true
  try {
    const res = await fetchSalesReport()
    data.value = res?.data?.data || res?.data || {}
  } catch (e) {
    addToast('فشل تحميل تقرير المبيعات', 'error')
  } finally {
    setTimeout(() => { loading.value = false }, 500)
  }
}

onMounted(load)
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: #f8fafc;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
</style>

