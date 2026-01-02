<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
         <h1 class="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span class="p-2 bg-rose-100 rounded-lg text-rose-600">
               <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            </span>
            تقرير منخفض المخزون
         </h1>
         <p class="text-sm text-gray-500 mt-1 mr-12">قائمة بالأصناف التي وصلت للحد الأدنى أو نفدت</p>
      </div>

      <div class="flex gap-2">
         <MButton variant="secondary" @click="exportExcel">
            <span class="flex items-center gap-2">
               <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
               Excel
            </span>
         </MButton>
         <MButton variant="secondary" @click="exportCsv">
            <span class="flex items-center gap-2">
               <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
               CSV
            </span>
         </MButton>
         <MButton variant="secondary" @click="load" :disabled="loading">
             <svg class="w-4 h-4" :class="{ 'animate-spin': loading }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
         </MButton>
      </div>
    </div>

    <!-- Stats -->
    <MCard class="bg-gradient-to-br from-rose-50 to-white border-rose-100">
       <div class="flex items-center justify-between p-4">
          <div>
             <p class="text-sm font-medium text-rose-600 mb-1">إجمالي العناصر المنخفضة</p>
             <p class="text-3xl font-bold text-gray-900">{{ report.data?.low_stock_items ?? 0 }}</p>
          </div>
          <div class="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center text-rose-600">
             <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
       </div>
    </MCard>

    <!-- Table -->
    <MCard title="القائمة التفصيلية">
      <template #actions>
         <div class="w-64">
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="بحث في التقرير..." 
              class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
         </div>
      </template>

      <MTable :loading="loading" :empty="!filteredItems.length">
         <template #header>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المنتج</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المتغير</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المخزن</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الكمية</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المتاح</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الحالة</th>
         </template>

         <tr v-for="it in filteredItems" :key="it.id" class="hover:bg-gray-50 group">
            <td class="px-6 py-4">
               <div>
                  <p class="text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                     {{ it.product_variant?.product?.name || '-' }}
                  </p>
                  <p class="text-xs text-gray-500 font-mono">
                     {{ it.product_variant?.product?.sku || it.product_variant?.sku_variant || '-' }}
                  </p>
               </div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-600">
               {{ formatAttributes(it.product_variant?.attributes) || '-' }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-900">
               {{ it.warehouse?.name || '#' + it.warehouse_id }}
            </td>
            <td class="px-6 py-4 text-sm font-medium">
               {{ it.quantity }}
            </td>
            <td class="px-6 py-4">
               <span :class="['px-2 py-1 rounded-full text-xs font-bold', it.available_quantity <= 0 ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700']">
                  {{ it.available_quantity }}
               </span>
            </td>
            <td class="px-6 py-4">
               <span v-if="it.needs_reorder" class="px-2 py-1 bg-amber-50 text-amber-600 rounded text-xs font-medium border border-amber-200">إعادة طلب</span>
               <span v-else-if="it.out_of_stock" class="px-2 py-1 bg-rose-50 text-rose-600 rounded text-xs font-medium border border-rose-200">نفد</span>
            </td>
         </tr>
      </MTable>
    </MCard>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { fetchLowStockReport } from '../../api/reports'
import { formatAttributes } from '../../utils/helpers'
import MCard from '../../components/ui/MCard.vue'
import MButton from '../../components/ui/MButton.vue'
import MTable from '../../components/ui/MTable.vue'
import { useToast } from '../../composables/useToast'

const { addToast } = useToast()

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
    addToast('فشل تحميل التقرير', 'error')
  } finally {
    loading.value = false
  }
}

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
  if (!items.value || !items.value.length) return addToast('لا توجد بيانات للتصدير', 'warning')
  
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
  addToast('تمت عملية التصدير بنجاح', 'success')
}

const exportExcel = () => {
  if (!items.value || !items.value.length) return addToast('لا توجد بيانات للتصدير', 'warning')
  
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
  addToast('تمت عملية التصدير بنجاح', 'success')
}

onMounted(load)
</script>
