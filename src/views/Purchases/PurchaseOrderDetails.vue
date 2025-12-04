<template>
  <div class="p-6 bg-gray-50 min-h-screen" dir="rtl">
    <div class="max-w-4xl mx-auto">
      <div class="mb-6">
            <button @click="$router.back()" class="px-3 py-1 border rounded">رجوع</button>
            <div class="inline-block mr-3">
              <button v-if="order.status !== 'approved'" @click="onApprove" class="px-3 py-1 bg-green-600 text-white rounded">اعتماد</button>
              <button v-if="order.status !== 'received'" @click="onReceive" class="ml-2 px-3 py-1 bg-indigo-600 text-white rounded">تأكيد الاستلام</button>
            </div>
      </div>

      <div class="bg-white rounded-lg shadow p-4">
        <div v-if="loading" class="text-center py-8">جاري التحميل...</div>
        <div v-else>
          <div class="flex items-start justify-between">
            <div>
              <h2 class="text-xl font-bold mb-1">تفاصيل طلب الشراء</h2>
              <div class="text-sm text-gray-600">الرمز: <span class="font-medium">{{ order.code }}</span></div>
            </div>
            <div class="text-right">
              <div class="text-sm">الحالة: <span class="font-semibold">{{ order.status }}</span></div>
              <div class="text-sm">الإجمالي: <span class="font-semibold">{{ order.total_amount }}</span></div>
            </div>
          </div>

          <div class="mt-4 grid grid-cols-3 gap-4">
            <div>
              <div class="text-xs text-gray-500">المورد</div>
              <div class="font-medium">{{ order.supplier?.name || '-' }}</div>
              <div class="text-sm text-gray-500">{{ order.supplier?.contact_name }}</div>
            </div>
            <div>
              <div class="text-xs text-gray-500">تاريخ الطلب</div>
              <div class="font-medium">{{ formatDate(order.order_date) }}</div>
              <div class="text-xs text-gray-500 mt-2">تاريخ التوصيل المتوقع</div>
              <div class="font-medium">{{ formatDate(order.expected_delivery_date) }}</div>
            </div>
            <div>
              <div class="text-xs text-gray-500">الموافق</div>
              <div class="font-medium">{{ order.approved_by?.name || '-' }}</div>
              <div class="text-xs text-gray-500 mt-2">تم الاعتماد في</div>
              <div class="font-medium">{{ formatDate(order.approved_at) }}</div>
            </div>
          </div>

          <div class="mt-6">
            <h3 class="font-semibold mb-2">العناصر</h3>
            <div v-if="order.lines && order.lines.length" class="overflow-x-auto">
              <table class="w-full text-sm table-auto">
                <thead>
                  <tr class="text-right text-xs text-gray-500 border-b">
                    <th class="p-2">المنتج</th>
                    <th class="p-2">الكمية المطلوبة</th>
                    <th class="p-2">الكمية المستلمة</th>
                    <th class="p-2">سعر الوحدة</th>
                    <th class="p-2">المجموع</th>
                    <th class="p-2">تاريخ الانتهاء</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="i in order.lines" :key="i.id" class="border-b hover:bg-gray-50">
                    <td class="p-2 text-right">{{ i.product_variant?.product?.name || i.product_variant?.sku_variant || '-' }}</td>
                    <td class="p-2 text-right">{{ i.quantity_ordered }}</td>
                    <td class="p-2 text-right">{{ i.quantity_received }}</td>
                    <td class="p-2 text-right">{{ i.unit_price }}</td>
                    <td class="p-2 text-right">{{ i.total_price }}</td>
                    <td class="p-2 text-right">{{ formatDate(i.expiry_date) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="text-gray-500">لا توجد عناصر مُدرجة في هذا الطلب.</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { request } from '../../api'
import { approvePurchaseOrder, receivePurchaseOrder } from '../../api/purchaseOrders'

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

const onApprove = async () => {
  if (!id) return
  if (!confirm('هل تريد اعتماد طلب الشراء هذا؟')) return
  try {
    await approvePurchaseOrder(id)
    alert('تم الاعتماد')
    await load()
  } catch (e) {
    console.error('Approve failed', e)
    alert('فشل الاعتماد')
  }
}

const onReceive = async () => {
  if (!id) return
  if (!confirm('هل تأكدت من استلام الكمية؟')) return
  try {
    // send a simple receive request; payload can include actual_delivery_date if needed
    await receivePurchaseOrder(id, { actual_delivery_date: new Date().toISOString() })
    alert('تم تأكيد الاستلام')
    await load()
  } catch (e) {
    console.error('Receive failed', e)
    alert('فشل تأكيد الاستلام')
  }
}
</script>

<style scoped>
</style>
