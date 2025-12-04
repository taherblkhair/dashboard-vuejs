<template>
  <div class="p-6 bg-gray-50 min-h-screen" dir="rtl">
    <div class="max-w-6xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold">تقرير المخزون</h1>
          <p class="text-sm text-gray-500">نظرة عامة على حالة المخزون عبر المخازن.</p>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-end gap-2 mb-4">
          <button @click="exportExcel" class="px-3 py-1 bg-yellow-600 text-white rounded text-sm">تصدير Excel</button>
          <button @click="exportCsv" class="px-3 py-1 bg-blue-600 text-white rounded text-sm">تصدير CSV</button>
        </div>
        <div v-if="loading" class="text-center py-12">جاري التحميل...</div>
        <div v-else>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700 mb-6">
            <div class="p-4 border rounded">
              <div class="text-xs text-gray-500">عدد السجلات</div>
              <div class="font-medium text-lg">{{ report.data?.total_items ?? 0 }}</div>
            </div>
            <div class="p-4 border rounded">
              <div class="text-xs text-gray-500">إجمالي الكمية</div>
              <div class="font-medium text-lg">{{ report.data?.total_quantity ?? 0 }}</div>
            </div>
            <div class="p-4 border rounded">
              <div class="text-xs text-gray-500">المتاح</div>
              <div class="font-medium text-lg">{{ report.data?.total_available ?? 0 }}</div>
            </div>
          </div>

          <div class="mb-4">
            <h3 class="text-lg font-semibold">الملخص المالي</h3>
            <div class="text-sm text-gray-700">قيمة المخزون: <span class="font-medium">{{ report.data?.total_value ?? 0 }}</span></div>
            <div class="text-sm text-gray-700">عناصر منخفضة المخزون: <span class="font-medium">{{ report.data?.low_stock_items ?? 0 }}</span></div>
          </div>

          <div>
            <h3 class="text-lg font-semibold mb-2">قائمة العناصر</h3>
            <div v-if="!items.length" class="text-sm text-gray-500">لا توجد عناصر.</div>

            <div v-else class="overflow-x-auto">
              <table class="w-full table-auto text-sm">
                <thead>
                  <tr class="text-right text-xs text-gray-500 border-b">
                    <th class="p-2">SKU</th>
                    <th class="p-2">المنتج</th>
                    <th class="p-2">متغير</th>
                    <th class="p-2">المخزن</th>
                    <th class="p-2">كمية</th>
                    <th class="p-2">محجوز</th>
                    <th class="p-2">متاح</th>
                    <th class="p-2">حالة</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="it in items" :key="it.id" class="border-b hover:bg-gray-50">
                    <td class="p-2 text-right">{{ it.product_variant?.product?.sku ?? it.product_variant?.sku_variant ?? '-' }}</td>
                    <td class="p-2 text-right">{{ it.product_variant?.product?.name ?? '-' }}</td>
                    <td class="p-2 text-right">{{ formatAttributes(it.product_variant?.attributes) || it.product_variant?.sku_variant || ('#' + (it.product_variant_id ?? '')) }}</td>
                    <td class="p-2 text-right">{{ it.warehouse?.name ?? ('#' + (it.warehouse_id ?? '')) }}</td>
                    <td class="p-2 text-right">{{ it.quantity }}</td>
                    <td class="p-2 text-right">{{ it.reserved_quantity }}</td>
                    <td class="p-2 text-right">{{ it.available_quantity }}</td>
                    <td class="p-2 text-right text-xs">
                      <span v-if="it.needs_reorder" class="text-yellow-700">إعادة طلب</span>
                      <span v-else-if="it.out_of_stock" class="text-red-600">خارج المخزون</span>
                      <span v-else-if="it.overstocked" class="text-green-600">فائض</span>
                      <span v-else>سليم</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { fetchStockReport } from '../api/reports'

const report = ref<any>({})
const items = ref<any[]>([])
const loading = ref(false)
const error = ref('')

const load = async () => {
  loading.value = true
  try {
    const res = await fetchStockReport()
    report.value = res || {}
    items.value = (res?.data?.items) || (res?.data) || []
  } catch (e) {
    console.error('Failed to fetch stock report', e)
    error.value = 'حدث خطأ أثناء جلب تقرير المخزون'
  } finally {
    loading.value = false
  }
}

onMounted(load)

const formatAttributes = (attr: any) => {
  if (!attr) return ''
  if (typeof attr === 'string') {
    try { const parsed = JSON.parse(attr); return Object.entries(parsed).map(([k, v]) => `${k}: ${v}`).join(', ') } catch { return attr }
  }
  if (typeof attr === 'object') { try { return Object.entries(attr).map(([k, v]) => `${k}: ${v}`).join(', ') } catch { return String(attr) } }
  return String(attr)
}

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
    const status = it.needs_reorder ? 'إعادة طلب' : (it.out_of_stock ? 'خارج المخزون' : (it.overstocked ? 'فائض' : 'سليم'))
    return [sku, product, variant, warehouse, qty, reserved, avail, status]
  })

  const csvContent = [headers, ...rows].map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n')
  const filename = `stock-report-${new Date().toISOString().slice(0,10)}.csv`
  downloadFile(csvContent, filename, 'text/csv;charset=utf-8;')
}

const exportExcel = () => {
  if (!items.value || !items.value.length) return
  // build a simple HTML table and download with xls mime type (opens in Excel)
  const headerRow = `<tr><th>SKU</th><th>المنتج</th><th>متغير</th><th>المخزن</th><th>كمية</th><th>محجوز</th><th>متاح</th><th>حالة</th></tr>`
  const bodyRows = items.value.map((it: any) => {
    const sku = it.product_variant?.product?.sku ?? it.product_variant?.sku_variant ?? ''
    const product = it.product_variant?.product?.name ?? ''
    const variant = formatAttributes(it.product_variant?.attributes) || it.product_variant?.sku_variant || ''
    const warehouse = it.warehouse?.name ?? ''
    const qty = it.quantity ?? ''
    const reserved = it.reserved_quantity ?? ''
    const avail = it.available_quantity ?? ''
    const status = it.needs_reorder ? 'إعادة طلب' : (it.out_of_stock ? 'خارج المخزون' : (it.overstocked ? 'فائض' : 'سليم'))
    return `<tr><td>${sku}</td><td>${product}</td><td>${variant}</td><td>${warehouse}</td><td>${qty}</td><td>${reserved}</td><td>${avail}</td><td>${status}</td></tr>`
  }).join('')

  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body><table>${headerRow}${bodyRows}</table></body></html>`
  const filename = `stock-report-${new Date().toISOString().slice(0,10)}.xls`
  downloadFile(html, filename, 'application/vnd.ms-excel')
}
</script>
<script lang="ts">
// exports implemented in <script setup> above via functions
</script>