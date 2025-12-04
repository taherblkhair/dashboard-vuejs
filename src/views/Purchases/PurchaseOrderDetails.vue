<template>
  <div class="p-6 bg-gray-50 min-h-screen" dir="rtl">
    <div class="max-w-4xl mx-auto">
      <div class="mb-6">
        <button @click="$router.back()" class="px-3 py-1 border rounded">رجوع</button>
      </div>

      <div class="bg-white rounded-lg shadow p-4">
        <div v-if="loading" class="text-center py-8">جاري التحميل...</div>
        <div v-else>
          <h2 class="text-xl font-bold mb-2">تفاصيل طلب الشراء #{{ order.id }}</h2>
          <div class="text-sm text-gray-600 mb-4">الرمز: {{ order.code }}</div>

          <div class="grid grid-cols-2 gap-4 mb-4">
            <div><strong>الحالة:</strong> {{ order.status }}</div>
            <div><strong>الإجمالي:</strong> {{ order.total_amount }}</div>
            <div><strong>تاريخ الطلب:</strong> {{ formatDate(order.order_date) }}</div>
            <div><strong>تاريخ التوصيل المتوقع:</strong> {{ formatDate(order.expected_delivery_date) }}</div>
          </div>

          <div v-if="order.items && order.items.length">
            <h3 class="font-semibold mb-2">العناصر</h3>
            <table class="w-full text-sm table-auto">
              <thead>
                <tr class="text-right text-xs text-gray-500 border-b">
                  <th class="p-2">المنتج</th>
                  <th class="p-2">الكمية</th>
                  <th class="p-2">سعر الوحدة</th>
                  <th class="p-2">المجموع</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="i in order.items" :key="i.id" class="border-b hover:bg-gray-50">
                  <td class="p-2 text-right">{{ i.product_name || i.name || '-' }}</td>
                  <td class="p-2 text-right">{{ i.quantity }}</td>
                  <td class="p-2 text-right">{{ i.unit_cost }}</td>
                  <td class="p-2 text-right">{{ (i.quantity * (i.unit_cost || 0)).toFixed(2) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-else class="text-gray-500">لا توجد عناصر مُدرجة في هذا الطلب.</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { request } from '../../api'

const route = useRoute()
const id = Number(route.params.id)
const order = ref<any>({})
const loading = ref(false)

const load = async () => {
  if (!id) return
  loading.value = true
  try {
    const res = await request(`/purchase-orders/${id}`)
    order.value = res?.data || res || {}
  } catch (e) {
    console.error('Failed to fetch purchase order', e)
  } finally {
    loading.value = false
  }
}

onMounted(load)

const formatDate = (iso?: string) => {
  if (!iso) return '-'
  try { return new Date(iso).toLocaleDateString() } catch { return iso }
}
</script>

<style scoped>
</style>
