<template>
  <div class="p-6 bg-gray-50 min-h-screen" dir="rtl">
    <div class="max-w-7xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold">التوصيلات</h1>
          <p class="text-sm text-gray-500">قائمة التوصيلات مع معلومات الطلب، المزود، والمناديب.</p>
        </div>
      </div>

      <div class="bg-white rounded shadow p-4">
        <div v-if="loading" class="text-center p-6">جاري التحميل...</div>
        <div v-else>
          <table class="w-full text-sm">
            <thead class="text-gray-600">
              <tr>
                <th class="text-right py-2">#</th>
                <th class="text-right py-2">رقم التتبع</th>
                <th class="text-right py-2">الحالة</th>
                <th class="text-right py-2">الطلب</th>
                <th class="text-right py-2">المزود</th>
                <th class="text-right py-2">المناديب</th>
                <th class="text-right py-2">رسوم</th>
                <th class="text-right py-2">موعد متوقع</th>
                <th class="text-right py-2">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="d in deliveries" :key="d.id" class="border-t">
                <td class="py-2 text-right">{{ d.id }}</td>
                <td class="py-2 text-right">{{ d.tracking_number }}</td>
                <td class="py-2 text-right">{{ d.status }}</td>
                <td class="py-2 text-right">#{{ d.order?.code ?? d.order_id }}</td>
                <td class="py-2 text-right">{{ d.provider?.name ?? '-' }}</td>
                <td class="py-2 text-right">{{ d.rider?.name ?? '-' }}</td>
                <td class="py-2 text-right font-semibold">{{ formatCurrency(d.delivery_fee) }}</td>
                <td class="py-2 text-right">{{ formatDate(d.estimated_delivery_time) }}</td>
               
                <td class="py-2 text-right">
                  <router-link :to="`/deliveries/${d.id}`" class="px-3 py-1 bg-blue-600 text-white rounded text-sm">تفاصيل</router-link>
                </td>
              </tr>
            </tbody>
          </table>

          <div class="mt-4 flex items-center justify-between">
            <div class="text-sm text-gray-600">إجمالي: {{ meta?.total ?? deliveries.length }}</div>
            <div>
              <button v-if="meta && meta.current_page < meta.last_page" @click="load(meta.current_page + 1)" class="px-3 py-1 bg-gray-200 rounded">المزيد</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { fetchDeliveries } from '../../api/deliveries'

const deliveries = ref<any[]>([])
const meta = ref<any>(null)
const loading = ref(false)

const formatDate = (d?: string) => {
  if (!d) return '-'
  try { return new Date(d).toLocaleString('EN-US') } catch (e) { return d }
}

const formatCurrency = (v?: any) => {
  if (v === null || v === undefined || v === '') return '-' 
  const num = Number(v)
  if (Number.isNaN(num)) return String(v)
  return new Intl.NumberFormat('EN-US', { style: 'currency', currency: 'LYD' }).format(num)
}

const load = async (page = 1) => {
  loading.value = true
  try {
    const res = await fetchDeliveries(page)
    const d = res?.data?.data ?? res?.data ?? []
    const m = res?.data?.meta ?? res?.meta ?? null
    if (page === 1) deliveries.value = d
    else deliveries.value.push(...d)
    meta.value = m
  } catch (e) {
    console.error('Failed to load deliveries', e)
  } finally {
    loading.value = false
  }
}

onMounted(() => load(1))
</script>

<style scoped>
.text-right { text-align: right }
</style>
