<template>
  <div class="p-6 bg-slate-50/50 min-h-screen animate-fade-in" dir="rtl">
    <div class="max-w-7xl mx-auto">
      <!-- Header Section -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 class="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <svg class="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
            </svg>
            تقرير المشتريات
          </h1>
          <p class="text-sm text-slate-500 mt-1">متابعة أداء المشتريات، الموردين، وحالات طلبات الشراء.</p>
        </div>
        
        <div class="flex items-center gap-3">
          <button @click="load" class="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-all shadow-sm font-medium">
            <svg class="w-5 h-5" :class="{ 'animate-spin': loading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            تحديث
          </button>
          <button @click="exportJson" class="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-md font-medium">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
            </svg>
            تصدير JSON
          </button>
        </div>
      </div>

      <!-- KPI Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div class="flex items-center gap-4">
            <div class="p-4 bg-indigo-50 text-indigo-600 rounded-2xl">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <div>
              <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">إجمالي الطلبات</p>
              <h3 class="text-3xl font-black text-slate-800">{{ data.total_orders ?? 0 }}</h3>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div class="flex items-center gap-4">
            <div class="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">إجمالي المبلغ</p>
              <h3 class="text-3xl font-black text-emerald-600">{{ formatCurrency(data.total_amount) }}</h3>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-center">
          <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">حالات الطلبات</p>
          <div class="flex flex-wrap gap-2">
            <div v-for="(v,k) in data.orders_by_status || {}" :key="k" class="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100 transition-hover hover:border-indigo-200">
               <span class="text-xs font-bold text-slate-600">{{ k }}</span>
               <span class="text-xs font-black text-indigo-600 px-1.5 py-0.5 bg-indigo-50 rounded-lg">{{ v }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Tables Section -->
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="p-6 border-b border-slate-100">
          <h3 class="font-bold text-slate-800 flex items-center gap-2">
            <span class="w-2 h-2 bg-indigo-500 rounded-full"></span>
            أهم الموردين بحسب حجم المشتريات
          </h3>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-slate-50/50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <th class="px-6 py-4 text-right">#</th>
                <th class="px-6 py-4 text-right">المورد</th>
                <th class="px-6 py-4 text-center">عدد الطلبات</th>
                <th class="px-6 py-4 text-left font-sans">Total Amount</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-if="!(data.top_suppliers && data.top_suppliers.length)" class="text-center">
                <td colspan="4" class="px-6 py-12 text-slate-400 italic">لا توجد بيانات متاحة للموردين حالياً.</td>
              </tr>
              <tr v-for="(s, idx) in data.top_suppliers" :key="s.supplier_id" class="hover:bg-slate-50/50 transition-colors group">
                <td class="px-6 py-4 text-slate-400 font-bold">{{ idx + 1 }}</td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                      </svg>
                    </div>
                    <div>
                       <div class="font-bold text-slate-800">{{ s.supplier_name }}</div>
                       <div class="text-[10px] text-slate-400">مورد معتمد</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 text-center">
                  <span class="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-black">{{ s.order_count }}</span>
                </td>
                <td class="px-6 py-4 text-left font-black text-slate-900">{{ formatCurrency(s.total_amount) }}</td>
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
import { fetchPurchasesReport } from '../../api/reports'
import { formatCurrency } from '../../utils/helpers'

const data = ref<any>({})
const loading = ref(false)

const load = async () => {
  loading.value = true
  try {
    const res = await fetchPurchasesReport()
    data.value = res?.data?.data || res?.data || {}
  } catch (e) {
    console.error('Failed to fetch purchases report', e)
  } finally {
    setTimeout(() => { loading.value = false }, 500)
  }
}

onMounted(load)

const exportJson = () => {
  const blob = new Blob([JSON.stringify(data.value, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `purchases-report.json`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
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


<style scoped>
</style>
