<template>
  <div class="p-6 bg-slate-50/50 min-h-screen animate-fade-in" dir="rtl">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 class="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <svg class="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 7h18M3 12h18M3 17h18" />
            </svg>
            تقرير المخزون
          </h1>
          <p class="text-sm text-slate-500 mt-1">نظرة شاملة على المخزون الحالي، الكميات المتاحة والمحجوزة.</p>
        </div>
        <div class="flex items-center gap-3">
          <button @click="load" class="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-all shadow-sm font-medium">
            <svg class="w-5 h-5" :class="{ 'animate-spin': loading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            تحديث البيانات
          </button>
        </div>
      </div>

      <!-- KPI Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div class="absolute -right-6 -top-6 w-24 h-24 bg-amber-50 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
          <div class="flex items-center gap-4">
            <div class="p-4 bg-amber-100/50 text-amber-600 rounded-2xl">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 7h18M3 12h18M3 17h18" />
              </svg>
            </div>
            <div>
              <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">إجمالي الأصناف</p>
              <h3 class="text-3xl font-black text-slate-800">{{ report.data?.total_items ?? 0 }}</h3>
            </div>
          </div>
        </div>
        <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div class="absolute -right-6 -top-6 w-24 h-24 bg-emerald-50 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
          <div class="flex items-center gap-4">
            <div class="p-4 bg-emerald-100/50 text-emerald-600 rounded-2xl">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V7.618a1 1 0 011.553-.894L9 9" />
              </svg>
            </div>
            <div>
              <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">إجمالي الكمية</p>
              <h3 class="text-3xl font-black text-slate-800">{{ formatNumber(report.data?.total_quantity) }}</h3>
            </div>
          </div>
        </div>
        <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div class="absolute -right-6 -top-6 w-24 h-24 bg-rose-50 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
          <div class="flex items-center gap-4">
            <div class="p-4 bg-rose-100/50 text-rose-600 rounded-2xl">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4l3 3" />
              </svg>
            </div>
            <div>
              <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">القيمة الإجمالية</p>
              <h3 class="text-3xl font-black text-rose-600">{{ formatCurrency(report.data?.total_value) }}</h3>
            </div>
          </div>
        </div>
      </div>

      <!-- Stock Items Table -->
      <div class="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div class="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <h3 class="font-bold text-slate-800">قائمة الأصناف</h3>
          <div class="relative max-w-xs">
            <input v-model="searchQuery" type="text" placeholder="بحث سريع..."
              class="w-full bg-white border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500/50 transition-all" />
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-slate-50/50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <th class="px-6 py-4 text-right">SKU</th>
                <th class="px-6 py-4 text-right">المنتج</th>
                <th class="px-6 py-4 text-center">الكمية</th>
                <th class="px-6 py-4 text-center">المحجوز</th>
                <th class="px-6 py-4 text-center">المتاح</th>
                <th class="px-6 py-4 text-center">القيمة</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-if="loading" v-for="i in 5" :key="i" class="animate-pulse">
                <td v-for="j in 6" :key="j" class="px-6 py-4"><div class="h-4 bg-slate-100 rounded"></div></td>
              </tr>
              <tr v-else-if="filteredItems.length === 0">
                <td colspan="6" class="px-6 py-12 text-center text-slate-400 italic">لا توجد بيانات مخزون حالياً.</td>
              </tr>
              <tr v-else v-for="it in filteredItems" :key="it.id" class="hover:bg-slate-50/50 transition-colors group">
                <td class="px-6 py-4 text-right font-mono text-xs text-slate-400">{{ it.product_variant?.product?.sku ?? it.product_variant?.sku_variant ?? '-' }}</td>
                <td class="px-6 py-4 text-right font-bold text-slate-700">{{ it.product_variant?.product?.name ?? '-' }}</td>
                <td class="px-6 py-4 text-center font-bold text-slate-700">{{ it.quantity ?? 0 }}</td>
                <td class="px-6 py-4 text-center text-slate-600">{{ it.reserved_quantity ?? 0 }}</td>
                <td class="px-6 py-4 text-center text-slate-600">{{ it.available_quantity ?? 0 }}</td>
                <td class="px-6 py-4 text-center text-emerald-600 font-bold">{{ formatCurrency(it.total_value) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { fetchStockReport } from '../../api/reports'
import { formatCurrency } from '../../utils/helpers'

const report = ref<any>({})
const loading = ref(false)
const searchQuery = ref('')

const load = async () => {
  loading.value = true
  try {
    const res = await fetchStockReport()
    report.value = res?.data?.data || res?.data || {}
  } catch (e) {
    console.error('Failed to fetch stock report', e)
  } finally {
    setTimeout(() => (loading.value = false), 500)
  }
}

onMounted(load)

function formatNumber(value: any): string {
  if (value === null || value === undefined) return '0'
  const num = typeof value === 'number' ? value : Number(String(value))
  if (Number.isNaN(num)) return String(value)
  return new Intl.NumberFormat('en-US').format(num)
}

const filteredItems = computed(() => {
  const items = report.value?.items || []
  if (!searchQuery.value) return items
  const q = searchQuery.value.toLowerCase()
  return items.filter((it: any) =>
    (it.product_variant?.product?.name?.toLowerCase().includes(q)) ||
    (it.product_variant?.product?.sku?.toLowerCase().includes(q)) ||
    (it.warehouse?.name?.toLowerCase().includes(q))
  )
})
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: #f8fafc; }
::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
</style>
