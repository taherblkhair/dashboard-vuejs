<template>
  <div class="p-6 bg-gray-50 min-h-screen" dir="rtl">
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold">استلام طلب شراء</h1>
          <p class="text-sm text-gray-500">قم بتحديد المخزن والكميات المستلمة لكل سطر ثم اضغط إرسال.</p>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-4">
        <div v-if="loading" class="text-center py-8">جاري التحميل...</div>
        <div v-else>
          <div class="mb-4">
            <div class="mb-2 text-sm">رقم الطلب: <strong>{{ order?.code || '-' }}</strong></div>
            <div class="mb-2 text-sm">المورد: {{ order?.supplier?.name || '-' }}</div>
          </div>

          <div class="mb-4">
            <label class="block text-sm mb-1">المخزن</label>
            <select v-model="form.warehouse_id" class="w-full border rounded px-2 py-2">
              <option value="">اختر المخزن</option>
              <option v-for="w in warehouses" :key="w.id" :value="w.id">{{ w.name }}</option>
            </select>
          </div>

          <div>
            <h3 class="text-lg font-medium mb-2">خطوط الطلب</h3>
            <div v-if="!order?.lines || !order.lines.length" class="text-gray-500">لا توجد خطوط في هذا الطلب</div>
            <div v-else class="space-y-3">
              <div v-for="(line, idx) in order.lines" :key="line.id" class="p-3 border rounded">
                <div class="flex justify-between items-center mb-2">
                  <div class="text-sm font-semibold">{{ line.product?.name || line.product_name || 'بند' }}</div>
                  <div class="text-sm text-gray-500">الكمية المطلوبة: {{ line.quantity_ordered ?? line.qty ?? '-' }}</div>
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-sm mb-1">الكمية المستلمة</label>
                    <input type="number" min="0" class="w-full border rounded px-2 py-2" v-model.number="lines[idx].quantity_received" />
                  </div>
                  <div>
                    <label class="block text-sm mb-1">ملاحظات (اختياري)</label>
                    <input type="text" class="w-full border rounded px-2 py-2" v-model="lines[idx].notes" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-4 flex justify-end gap-2">
            <button @click="submitReceive" class="px-4 py-2 bg-green-600 text-white rounded">إرسال الاستلام</button>
            <button @click="cancel" class="px-4 py-2 border rounded">إلغاء</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchPurchaseOrder, receivePurchaseOrder } from '../../api/purchaseOrders'
import { fetchWarehouses } from '../../api/warehouses'

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id || 0)

const loading = ref(false)
const order = ref<any>(null)
const warehouses = ref<any[]>([])

const form = ref<{ warehouse_id?: number }>({ warehouse_id: undefined })
const lines = ref<Array<any>>([])

const load = async () => {
  if (!id) return
  loading.value = true
  try {
    const res = await fetchPurchaseOrder(id)
    order.value = res?.data || null
    // initialize lines array from order.lines
    lines.value = (order.value?.lines || []).map((l: any) => ({ line_id: l.id, quantity_received: 0, notes: '' }))
    const wres = await fetchWarehouses(1)
    warehouses.value = wres?.data || []
  } catch (e) {
    console.error('Failed to load order or warehouses', e)
  } finally {
    loading.value = false
  }
}

onMounted(() => load())

const submitReceive = async () => {
  if (!id) return alert('Missing order id')
  if (!form.value.warehouse_id) return alert('اختر المخزن')
  const payload = {
    warehouse_id: form.value.warehouse_id,
    lines: lines.value.map(l => ({ line_id: l.line_id, quantity_received: l.quantity_received, notes: l.notes }))
  }
    try {
    loading.value = true
    await receivePurchaseOrder(id, payload)
    // assume success; navigate to details
    router.push({ name: 'PurchaseOrderDetails', params: { id } })
  } catch (e) {
    console.error('Failed to submit receive', e)
    alert('فشل إرسال الاستلام')
  } finally {
    loading.value = false
  }
}

const cancel = () => router.back()
</script>

<style scoped>
</style>
