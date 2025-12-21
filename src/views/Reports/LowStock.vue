<template>
  <div class="p-6 bg-slate-50/50 min-h-screen animate-fade-in" dir="rtl">
    <div class="max-w-7xl mx-auto">
      <!-- Header Section -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 class="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <svg class="w-8 h-8 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            تقرير منخفض المخزون
          </h1>
          <p class="text-sm text-slate-500 mt-1">قائمة بالأصناف التي وصلت للحد الأدنى أو نفدت، لتسهيل عملية إعادة الطلب.</p>
        </div>
        
        <div class="flex items-center gap-3">
          <div class="flex bg-white rounded-xl shadow-sm border border-slate-200 p-1">
            <button 
              @click="exportExcel" 
              class="flex items-center gap-2 px-4 py-2 hover:bg-green-50 text-green-700 rounded-lg text-sm font-medium transition-all"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              Excel
            </button>
            <div class="w-px h-6 bg-slate-200 my-auto"></div>
            <button 
              @click="exportCsv" 
              class="flex items-center gap-2 px-4 py-2 hover:bg-blue-50 text-blue-700 rounded-lg text-sm font-medium transition-all"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
              </svg>
              CSV
            </button>
          </div>
          <button @click="load" class="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all shadow-sm">
            <svg class="w-5 h-5" :class="{ 'animate-spin': loading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Summary KPI Card -->
      <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm mb-8 flex items-center justify-between overflow-hidden relative group">
        <div class="absolute -right-12 -bottom-12 w-48 h-48 bg-rose-50 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-700"></div>
        <div class="relative">
          <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">إجمالي العناصر المنخفضة</p>
          <h2 class="text-4xl font-black text-rose-600 tracking-tight">{{ report.data?.low_stock_items ?? 0 }} صنف</h2>
        </div>
        <div class="relative hidden sm:block">
           <div class="p-4 bg-rose-100/50 text-rose-600 rounded-2xl">
             <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
             </svg>
           </div>
        </div>
      </div>

      <!-- Main Table Card -->
      <div class="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div class="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <h3 class="font-bold text-slate-800">قائمة التفاصيل</h3>
          <div class="relative max-w-xs">
             <input
              v-model="searchQuery"
              type="text"
              placeholder="بحث سريع..."
              class="w-full bg-white border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500/50 transition-all font-arabic"
            />
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-slate-50/50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <th class="px-6 py-4 text-right">SKU</th>
                <th class="px-6 py-4 text-right">المنتج</th>
                <th class="px-6 py-4 text-right">المتغيرات</th>
                <th class="px-6 py-4 text-right">المخزن</th>
                <th class="px-6 py-4 text-center">الكمية</th>
                <th class="px-6 py-4 text-center">المتاح</th>
                <th class="px-6 py-4 text-center">الحالة</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-if="loading" v-for="i in 5" :key="i" class="animate-pulse">
                <td v-for="j in 7" :key="j" class="px-6 py-4"><div class="h-4 bg-slate-100 rounded"></div></td>
              </tr>
              <tr v-else-if="filteredItems.length === 0">
                <td colspan="7" class="px-6 py-12 text-center text-slate-400 italic">لا توجد عناصر منخفضة المخزون حالياً.</td>
              </tr>
              <tr v-for="it in filteredItems" :key="it.id" class="hover:bg-slate-50/50 transition-colors group">
                <td class="px-6 py-4 font-mono text-xs text-slate-400">{{ it.product_variant?.product?.sku ?? it.product_variant?.sku_variant ?? '-' }}</td>
                <td class="px-6 py-4">
                  <span class="font-bold text-slate-700 group-hover:text-rose-600 transition-colors">{{ it.product_variant?.product?.name ?? '-' }}</span>
                </td>
                <td class="px-6 py-4">
                  <span class="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{{ formatAttributes(it.product_variant?.attributes) || it.product_variant?.sku_variant || '#' + (it.product_variant_id ?? '') }}</span>
                </td>
                <td class="px-6 py-4 text-slate-600">{{ it.warehouse?.name ?? ('#' + (it.warehouse_id ?? '')) }}</td>
                <td class="px-6 py-4 text-center font-bold text-slate-700 italic">{{ it.quantity }}</td>
                <td class="px-6 py-4 text-center">
                  <span :class="it.available_quantity <= 0 ? 'text-rose-700 bg-rose-100' : 'text-amber-700 bg-amber-50'" class="px-3 py-1 rounded-full text-xs font-black">
                    {{ it.available_quantity }}
                  </span>
                </td>
                <td class="px-6 py-4 text-center">
                   <div class="flex justify-center">
                    <span v-if="it.needs_reorder" class="badge-status bg-amber-50 text-amber-600 border-amber-200">إعادة طلب</span>
                    <span v-else-if="it.out_of_stock" class="badge-status bg-rose-50 text-rose-600 border-rose-200">نفد</span>
                    <span v-else class="badge-status bg-slate-50 text-slate-400 border-slate-200">غير محدد</span>
                   </div>
                </td>
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
import { fetchLowStockReport } from '../../api/reports'
import { formatAttributes } from '../../utils/helpers'

const report = ref<any>({})
const items = ref<any[]>([])
const loading = ref(false)
const searchQuery = ref('')

const load = async () => {
  loading.value = true
  try {
    const res = await fetchLowStockReport()
    report.value = res || {}
    items.value = (res?.data?.items) || (res?.data) || []
  } catch (e) {
    console.error('Failed to fetch low-stock report', e)
  } finally {
    setTimeout(() => { loading.value = false }, 500)
  }
}

onMounted(load)

const filteredItems = computed(() => {
  if (!searchQuery.value) return items.value
  const q = searchQuery.value.toLowerCase()
  return items.value.filter(it => 
    (it.product_variant?.product?.name?.toLowerCase().includes(q)) ||
    (it.product_variant?.product?.sku?.toLowerCase().includes(q)) ||
    (it.warehouse?.name?.toLowerCase().includes(q))
  )
})

const downloadFile = (content: BlobPart, filename: string, type = 'text/csv;charset=utf-8;') => {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

const exportCsv = () => {
  if (!items.value || !items.value.length) return
  const headers = ['SKU', 'المنتج', 'متغير', 'المخزن', 'كمية', 'محجوز', 'متاح', 'حالة']
  const rows = items.value.map((it: any) => {
    const sku = it.product_variant?.product?.sku ?? it.product_variant?.sku_variant ?? ''
    const product = it.product_variant?.product?.name ?? ''
    const variant = formatAttributes(it.product_variant?.attributes) || it.product_variant?.sku_variant || ''
    const warehouse = it.warehouse?.name ?? ''
    const qty = it.quantity ?? ''
    const reserved = it.reserved_quantity ?? ''
    const avail = it.available_quantity ?? ''
    const status = it.needs_reorder ? 'إعادة طلب' : (it.out_of_stock ? 'خارج المخزون' : 'سليم')
    return [sku, product, variant, warehouse, qty, reserved, avail, status]
  })

  const csvContent = "\ufeff" + [headers, ...rows].map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n')
  const filename = `low-stock-${new Date().toISOString().slice(0,10)}.csv`
  downloadFile(csvContent, filename, 'text/csv;charset=utf-8;')
}

const exportExcel = () => {
  if (!items.value || !items.value.length) return
  const headerRow = `<tr style="background:#fef2f2"><th>SKU</th><th>المنتج</th><th>متغير</th><th>المخزن</th><th>كمية</th><th>محجوز</th><th>متاح</th><th>حالة</th></tr>`
  const bodyRows = items.value.map((it: any) => {
    const sku = it.product_variant?.product?.sku ?? it.product_variant?.sku_variant ?? ''
    const product = it.product_variant?.product?.name ?? ''
    const variant = formatAttributes(it.product_variant?.attributes) || it.product_variant?.sku_variant || ''
    const warehouse = it.warehouse?.name ?? ''
    const qty = it.quantity ?? ''
    const reserved = it.reserved_quantity ?? ''
    const avail = it.available_quantity ?? ''
    const status = it.needs_reorder ? 'إعادة طلب' : (it.out_of_stock ? 'خارج المخزون' : 'سليم')
    return `<tr><td>${sku}</td><td>${product}</td><td>${variant}</td><td>${warehouse}</td><td>${qty}</td><td>${reserved}</td><td>${avail}</td><td>${status}</td></tr>`
  }).join('')

  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>table{width:100%;border-collapse:collapse}th,td{border:1px solid #ddd;padding:8px;text-align:right}</style></head><body><table>${headerRow}${bodyRows}</table></body></html>`
  const filename = `low-stock-${new Date().toISOString().slice(0,10)}.xls`
  downloadFile(html, filename, 'application/vnd.ms-excel')
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

.badge-status {
  padding: 0.25rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  border-width: 1px;
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
