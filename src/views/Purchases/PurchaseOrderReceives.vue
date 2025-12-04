<template>
  <div class="p-6 bg-gray-50 min-h-screen" dir="rtl">
    <div class="max-w-6xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold">استلام طلبات الشراء</h1>
          <p class="text-sm text-gray-500">قائمة الطلبات المتاحة للاستلام أو سجل الاستلام.</p>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-4">
        <div v-if="loading" class="text-center py-8">جاري التحميل...</div>
        <div v-else>
          <div v-if="orders.length === 0" class="text-center py-8 text-gray-500">لا توجد طلبات</div>
          <div v-else class="overflow-x-auto">
            <table class="w-full table-auto text-sm">
              <thead>
                <tr class="text-right text-xs text-gray-500 border-b">
                  <th class="p-2">#</th>
                  <th class="p-2">الرمز</th>
                  <th class="p-2">المورد</th>
                  <th class="p-2">الحالة</th>
                  <th class="p-2">الإجمالي</th>
                  <th class="p-2">تاريخ الطلب</th>
                  <th class="p-2">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="o in orders" :key="o.id" class="border-b hover:bg-gray-50">
                  <td class="p-2 text-right">{{ o.id }}</td>
                  <td class="p-2 text-right">{{ o.code }}</td>
                  <td class="p-2 text-right">{{ o.supplier?.name || '-' }}</td>
                  <td class="p-2 text-right">{{ o.status }}</td>
                  <td class="p-2 text-right">{{ o.total_amount }}</td>
                  <td class="p-2 text-right">{{ formatDate(o.order_date) }}</td>
                  <td class="p-2 text-right">
                    <div class="flex justify-end gap-2">
                      <button @click="receiveOrder(o.id)" class="px-2 py-1 bg-green-600 text-white rounded text-xs">استلام</button>
                      <button @click="viewOrder(o.id)" class="px-2 py-1 bg-blue-600 text-white rounded text-xs">عرض</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { fetchPurchaseOrders } from '../../api/purchaseOrders'

const router = useRouter()
const orders = ref<any[]>([])
const loading = ref(false)

const load = async () => {
  loading.value = true
  try {
    const res = await fetchPurchaseOrders(1)
    // show only orders that are still 'ordered' (ready to be received)
    const all = res?.data || []
    orders.value = all.filter((o: any) => (o.status || '').toString().toLowerCase() === 'ordered')
  } catch (e) {
    console.error('Failed to fetch purchase orders for receives', e)
  } finally {
    loading.value = false
  }
}

onMounted(() => load())

const formatDate = (iso?: string) => {
  if (!iso) return '-'
  try { return new Date(iso).toLocaleDateString() } catch { return iso }
}

const receiveOrder = (id?: number) => {
  if (!id) return
  router.push({ name: 'PurchaseOrderReceiveCreate', params: { id } })
}

const viewOrder = (id?: number) => {
  if (!id) return
  router.push({ name: 'PurchaseOrderDetails', params: { id } })
}
</script>

<style scoped>
</style>
