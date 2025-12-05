<template>
  <div class="p-6 bg-gray-50 min-h-screen" dir="rtl">
    <div class="max-w-5xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold">تفاصيل مزود التوصيل</h1>
          <p class="text-sm text-gray-500">عرض معلومات المزود، قواعد التسعير، المناديب والطلبات.</p>
        </div>
        <div>
          <router-link to="/delivery-providers" class="px-3 py-2 border rounded">العودة للقائمة</router-link>
        </div>
      </div>

      <div v-if="loading" class="text-center py-8">جاري التحميل...</div>
      <div v-else-if="!provider" class="text-center py-8 text-gray-500">لم يتم العثور على مزود</div>

      <div v-else class="space-y-4">
        <div class="bg-white rounded shadow p-4">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h2 class="text-xl font-semibold">{{ provider.name }}</h2>
              <div class="text-sm text-gray-500">{{ provider.type === 'company' ? 'شركة' : 'مستقل' }}</div>
            </div>
            <div class="text-right">
              <div class="text-sm">حالة: <span :class="provider.is_active ? 'text-green-600' : 'text-red-500'">{{ provider.is_active ? 'نشط' : 'غير نشط' }}</span></div>
              <div class="text-sm">منطقة: {{ provider.address }}</div>
            </div>
          </div>

          <div class="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-700">
            <div><strong>الشخص المسؤول:</strong> {{ provider.contact_person }}</div>
            <div><strong>الهاتف:</strong> <a :href="`tel:${provider.phone}`" class="text-blue-600">{{ provider.phone }}</a></div>
            <div v-if="provider.email"><strong>البريد:</strong> {{ provider.email }}</div>
          </div>
        </div>

        <div class="bg-white rounded shadow p-4">
          <h3 class="font-medium mb-2">قواعد التسعير</h3>
          <div class="text-sm text-gray-700 space-y-2">
            <div><strong>الرسوم الأساسية:</strong> {{ formatCurrency(provider.pricing_rules?.base_fee) }}</div>
            <div><strong>معدل الوزن:</strong> {{ provider.pricing_rules?.weight_rate ?? '-' }} /kg</div>
            <div><strong>معدل المسافة:</strong> {{ provider.pricing_rules?.distance_rate ?? '-' }} /km</div>
            <div v-if="provider.pricing_rules?.area_fees">
              <strong>رسوم المناطق:</strong>
              <ul class="list-disc mr-6 text-sm">
                <li v-for="(fee, area) in provider.pricing_rules.area_fees" :key="area">{{ area }}: {{ formatCurrency(fee) }}</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="bg-white rounded shadow p-4">
          <h3 class="font-medium mb-2">المناديب ({{ provider.riders?.length || 0 }})</h3>
          <div v-if="!(provider.riders || []).length" class="text-gray-500">لا توجد مناديب</div>
          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div v-for="r in provider.riders" :key="r.id" class="p-3 border rounded">
              <div class="flex justify-between items-start">
                <div>
                  <div class="font-semibold">{{ r.name }}</div>
                  <div class="text-xs text-gray-500">{{ r.vehicle_type }} — {{ r.vehicle_number }}</div>
                </div>
                <div class="text-right text-sm">
                  <div :class="r.is_available ? 'text-green-600' : 'text-yellow-600'">{{ r.is_available ? 'متاح' : 'مشغول' }}</div>
                  <div class="text-gray-500">تقييم: {{ r.rating }}</div>
                </div>
              </div>
              <div class="text-sm text-gray-600 mt-2">الهاتف: <a :href="`tel:${r.phone}`" class="text-blue-600">{{ r.phone }}</a></div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded shadow p-4">
          <h3 class="font-medium mb-2">التوصيلات الأخيرة ({{ provider.deliveries?.length || 0 }})</h3>
          <div v-if="!(provider.deliveries || []).length" class="text-gray-500">لا توجد توصيلات</div>
          <table v-else class="w-full text-sm">
            <thead class="text-gray-600">
              <tr>
                <th class="text-right py-1">رقم التتبع</th>
                <th class="text-right py-1">الحالة</th>
                <th class="text-right py-1">العميل/الطلب</th>
                <th class="text-right py-1">الرسوم</th>
                <th class="text-right py-1">تاريخ التقدير</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="d in provider.deliveries" :key="d.id" class="border-t">
                <td class="py-2 text-right">{{ d.tracking_number }}</td>
                <td class="py-2 text-right">{{ d.status }}</td>
                <td class="py-2 text-right">#{{ d.order_id }}</td>
                <td class="py-2 text-right font-semibold">{{ formatCurrency(d.delivery_fee) }}</td>
                <td class="py-2 text-right">{{ formatDate(d.estimated_delivery_time) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchDeliveryProvider } from '../../api/deliveryProviders'

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id)

const provider = ref<any>(null)
const loading = ref(false)

const load = async () => {
  loading.value = true
  try {
    const res = await fetchDeliveryProvider(id)
    provider.value = res?.data?.data || res?.data || null
  } catch (e) {
    console.error('Failed to load provider', e)
  } finally {
    loading.value = false
  }
}

const formatCurrency = (v?: any) => {
  if (v === null || v === undefined || v === '') return '0.00'
  const num = Number(v)
  if (Number.isNaN(num)) return String(v)
  return new Intl.NumberFormat('en-UK', { style: 'currency', currency: 'LYD' }).format(num)
}

const formatDate = (d?: string) => {
  if (!d) return '-'
  try { return new Date(d).toLocaleString('ar-SA') } catch (e) { return d }
}

onMounted(() => {
  if (!id) return router.push({ path: '/delivery-providers' })
  load()
})
</script>

<style scoped>
.text-right { text-align: right }
</style>
