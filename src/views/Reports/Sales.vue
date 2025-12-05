<template>
  <div class="p-6 bg-gray-50 min-h-screen" dir="rtl">
    <div class="max-w-5xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold">تقرير المبيعات</h1>
          <p class="text-sm text-gray-500">ملخص المبيعات، العملاء الأعلى، والمبيعات اليومية.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div class="bg-white p-4 rounded shadow text-center">
          <div class="text-sm text-gray-500">إجمالي الطلبات</div>
          <div class="text-2xl font-bold">{{ data.total_orders ?? '-' }}</div>
        </div>
        <div class="bg-white p-4 rounded shadow text-center">
          <div class="text-sm text-gray-500">إجمالي الإيرادات</div>
          <div class="text-2xl font-bold text-green-600">{{ formatCurrency(data.total_revenue) }}</div>
        </div>
        <div class="bg-white p-4 rounded shadow text-center">
          <div class="text-sm text-gray-500">متوسط قيمة الطلب</div>
          <div class="text-2xl font-bold">{{ formatCurrency(data.average_order_value) }}</div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div class="bg-white rounded shadow p-4">
          <h3 class="font-medium mb-3">الطلبات بحسب المصدر</h3>
          <div class="space-y-2">
            <div v-for="(count, source) in data.orders_by_source || {}" :key="source" class="flex justify-between items-center">
              <div class="capitalize">{{ source }}</div>
              <div class="font-semibold">{{ count }}</div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded shadow p-4">
          <h3 class="font-medium mb-3">أفضل العملاء</h3>
          <table class="w-full text-sm">
            <thead class="text-gray-600">
              <tr>
                <th class="text-right py-1">العميل</th>
                <th class="text-right py-1">عدد الطلبات</th>
                <th class="text-right py-1">الإجمالي</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="c in data.top_customers || []" :key="c.customer_id" class="border-t">
                <td class="py-2 text-right">{{ c.customer_name }}</td>
                <td class="py-2 text-right">{{ c.order_count }}</td>
                <td class="py-2 text-right font-semibold">{{ formatCurrency(c.total_spent) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="bg-white rounded shadow p-4 mt-4">
        <h3 class="font-medium mb-3">المبيعات اليومية</h3>
        <div v-if="(data.daily_sales || []).length === 0" class="text-gray-500">لا توجد بيانات</div>
        <table v-else class="w-full text-sm">
          <thead class="text-gray-600">
            <tr>
              <th class="text-right py-1">التاريخ</th>
              <th class="text-right py-1">عدد الطلبات</th>
              <th class="text-right py-1">إجمالي المبيعات</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="d in data.daily_sales" :key="d.date" class="border-t">
              <td class="py-2 text-right">{{ formatDate(d.date) }}</td>
              <td class="py-2 text-right">{{ d.orders_count }}</td>
              <td class="py-2 text-right font-semibold">{{ formatCurrency(d.total_sales) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { fetchSalesReport } from '../../api/reports'

const data = ref<any>({})
const loading = ref(false)

const load = async () => {
  loading.value = true
  try {
    const res = await fetchSalesReport()
    data.value = res?.data?.data || res?.data || {}
  } catch (e) {
    console.error('Failed to load sales report', e)
  } finally {
    loading.value = false
  }
}

onMounted(load)

const formatCurrency = (v?: number) => {
  if (v === null || v === undefined) return '0.00'
  return new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'LYD' }).format(Number(v))
}

const formatDate = (d: string) => {
  try {
    const dt = new Date(d)
    return dt.toLocaleDateString('en-US')
  } catch (e) {
    return d
  }
}
</script>

<style scoped>
.text-right { text-align: right }
</style>
