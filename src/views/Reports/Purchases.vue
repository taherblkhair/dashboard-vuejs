<template>
  <div class="p-6 bg-gray-50 min-h-screen" dir="rtl">
    <div class="max-w-4xl mx-auto">
      <div class="mb-6">
        <h1 class="text-2xl font-bold">تقرير المشتريات</h1>
        <p class="text-sm text-gray-500">ملخّص أداء المشتريات.</p>
      </div>

      <div class="grid grid-cols-3 gap-4 mb-6">
        <div class="bg-white p-4 rounded shadow">
          <div class="text-sm text-gray-500">إجمالي الطلبات</div>
          <div class="text-xl font-bold">{{ data.total_orders ?? 0 }}</div>
        </div>
        <div class="bg-white p-4 rounded shadow">
          <div class="text-sm text-gray-500">إجمالي المبلغ</div>
          <div class="text-xl font-bold">{{ data.total_amount ?? 0 }}</div>
        </div>
        <div class="bg-white p-4 rounded shadow">
          <div class="text-sm text-gray-500">حالات الطلبات</div>
          <div class="text-lg">
            <div v-for="(v,k) in data.orders_by_status || {}" :key="k" class="flex justify-between">
              <div class="text-sm">{{ k }}</div>
              <div class="font-semibold">{{ v }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded shadow p-4 mb-6">
        <h2 class="text-lg font-medium mb-3">أهم الموردين</h2>
        <div v-if="!(data.top_suppliers && data.top_suppliers.length)" class="text-gray-500">لا توجد بيانات</div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="text-right text-xs text-gray-500 border-b">
                <th class="p-2">#</th>
                <th class="p-2">اسم المورد</th>
                <th class="p-2">عدد الطلبات</th>
                <th class="p-2">الإجمالي</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(s, idx) in data.top_suppliers" :key="s.supplier_id" class="border-b hover:bg-gray-50">
                <td class="p-2 text-right">{{ idx + 1 }}</td>
                <td class="p-2 text-right">{{ s.supplier_name }}</td>
                <td class="p-2 text-right">{{ s.order_count }}</td>
                <td class="p-2 text-right">{{ s.total_amount }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="flex justify-end gap-2">
        <button @click="refresh" class="px-4 py-2 border rounded bg-gray-100">تحديث</button>
        <button @click="exportJson" class="px-4 py-2 border rounded bg-gray-100">تصدير JSON</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { fetchPurchasesReport } from '../../api/reports'

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
    loading.value = false
  }
}

onMounted(() => load())

const refresh = () => load()

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
</style>
