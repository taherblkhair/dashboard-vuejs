<template>
  <div class="p-6 bg-gray-50 min-h-screen" dir="rtl">
    <div class="max-w-6xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold">طلبات الشراء للمورد</h1>
          <p class="text-sm text-gray-500">عرض طلبات الشراء المتعلقة بالمورد.</p>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-4">
        <div v-if="loading" class="text-center py-8">جاري التحميل...</div>
        <div v-else>
          <div class="flex justify-between items-center mb-4">
            <div></div>
            <div class="flex gap-2">
              <button @click="exportCsv" class="px-3 py-1 border rounded bg-gray-100 text-sm">تصدير CSV</button>
              <button @click="exportExcel" class="px-3 py-1 border rounded bg-gray-100 text-sm">تصدير Excel</button>
            </div>
          </div>
          <div v-if="orders.length === 0" class="text-center py-8 text-gray-500">لا توجد طلبات شراء</div>
          <div v-else class="overflow-x-auto">
            <table class="w-full table-auto text-sm">
              <thead>
                <tr class="text-right text-xs text-gray-500 border-b">
                  <th class="p-2">#</th>
                  <th class="p-2">الرمز</th>
                  <th class="p-2">الحالة</th>
                  <th class="p-2">إجمالي</th>
                  <th class="p-2">تاريخ الطلب</th>
                  <th class="p-2">تاريخ التوصيل المتوقع</th>
                  <th class="p-2">الاجراءات</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="o in orders" :key="o.id" class="border-b hover:bg-gray-50">
                  <td class="p-2 text-right">{{ o.id }}</td>
                  <td class="p-2 text-right">{{ o.code }}</td>
                  <td class="p-2 text-right">{{ o.status }}</td>
                  <td class="p-2 text-right">{{ o.total_amount }}</td>
                  <td class="p-2 text-right">{{ formatDate(o.order_date) }}</td>
                  <td class="p-2 text-right">{{ formatDate(o.expected_delivery_date) }}</td>
                  <td class="p-2 text-right">
                    <div class="flex justify-end gap-2">
                      <button @click="viewOrder(o.id)" class="px-2 py-1 bg-blue-600 text-white rounded text-xs">عرض</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="mt-4 flex items-center justify-between">
            <div class="text-sm text-gray-500">الصفحة {{ meta.current_page }} من {{ meta.last_page }}</div>
            <div class="flex gap-2">
              <button :disabled="meta.current_page <= 1" @click="changePage(meta.current_page - 1)" class="px-3 py-1 border rounded">السابق</button>
              <button :disabled="meta.current_page >= meta.last_page" @click="changePage(meta.current_page + 1)" class="px-3 py-1 border rounded">التالي</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchSupplierPurchaseOrders } from '../../api/suppliers'

const route = useRoute()
const router = useRouter()
const supplierId = Number(route.params.id || route.query?.supplier_id || 0)

const orders = ref<any[]>([])
const loading = ref(false)
const meta = ref<any>({ current_page: 1, last_page: 1 })

const load = async (page = 1) => {
  if (!supplierId) return
  loading.value = true
  try {
    const res = await fetchSupplierPurchaseOrders(supplierId, page)
    orders.value = res?.data || []
    meta.value = res?.meta || meta.value
  } catch (e) {
    console.error('Failed to fetch purchase orders', e)
  } finally {
    loading.value = false
  }
}

onMounted(() => load())

const changePage = (p: number) => { load(p) }

const formatDate = (iso?: string) => {
  if (!iso) return '-'
  try { return new Date(iso).toLocaleDateString() } catch { return iso }
}

const viewOrder = (id?: number) => {
  if (!id) return
  // navigate to a generic purchase order details page if exists
  router.push({ name: 'PurchaseOrderDetails', params: { id } })
}

const escapeCsv = (val: any) => {
  if (val === null || val === undefined) return ''
  const s = String(val)
  if (s.includes('"')) return `"${s.replace(/"/g, '""')}"`
  if (s.search(/[",\n]/) >= 0) return `"${s}"`
  return s
}

const exportCsv = () => {
  if (!orders.value.length) return alert('لا توجد بيانات للتصدير')
  const headers = ['id', 'code', 'status', 'total_amount', 'order_date', 'expected_delivery_date']
  const rows = orders.value.map(o => headers.map(h => escapeCsv(o[h] ?? '')))
  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `supplier-${supplierId}-purchase-orders.csv`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

const exportExcel = () => {
  if (!orders.value.length) return alert('لا توجد بيانات للتصدير')
  const headers = ['الرمز', 'الحالة', 'إجمالي', 'تاريخ الطلب', 'تاريخ التوصيل المتوقع']
  const rows = orders.value.map(o => [o.code, o.status, o.total_amount, formatDate(o.order_date), formatDate(o.expected_delivery_date)])
  let table = '<table border="1"><thead><tr>' + headers.map(h => `<th>${h}</th>`).join('') + '</tr></thead><tbody>'
  table += rows.map(r => '<tr>' + r.map(c => `<td>${c ?? ''}</td>`).join('') + '</tr>').join('')
  table += '</tbody></table>'
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>${table}</body></html>`
  const blob = new Blob([html], { type: 'application/vnd.ms-excel' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `supplier-${supplierId}-purchase-orders.xls`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
</style>
