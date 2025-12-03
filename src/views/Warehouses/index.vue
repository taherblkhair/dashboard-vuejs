<template>
  <div class="p-6 bg-gray-50 min-h-screen" dir="rtl">
    <div class="max-w-6xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold">المخازن</h1>
          <p class="text-sm text-gray-500">قائمة بجميع المخازن.</p>
        </div>
        <div>
          <button @click="() => router.push({ name: 'WarehouseCreate' })" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">إضافة مخزن جديد</button>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-4">
        <template v-if="loading">
          <div class="text-center py-8">جاري التحميل...</div>
        </template>

        <template v-else>
          <div v-if="warehouses.length === 0" class="text-center py-8 text-gray-500">لا توجد مخازن بعد</div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="w in warehouses" :key="w.id" class="border rounded-lg p-4 bg-white">
              <div class="flex items-start justify-between">
                <div>
                  <h3 class="font-semibold text-lg">{{ w.name }}</h3>
                  <div class="text-xs text-gray-500">الرمز: {{ w.code }}</div>
                </div>
                <div class="text-sm text-gray-500">#{{ w.id }}</div>
              </div>

              <div class="mt-3 text-sm text-gray-600">
                <div v-if="w.manager">مدير: <span class="font-medium">{{ w.manager.name }}</span></div>
                <div>الهاتف: {{ w.phone || '-' }}</div>
                <div>البريد: {{ w.email || '-' }}</div>
                <div>السعة: {{ w.capacity || '-' }} — الاستخدام الحالي: {{ w.current_utilization || '0' }}%</div>
              </div>

              <div class="mt-3 text-sm text-gray-600">
                <div v-if="w.address">العنوان: {{ w.address.city }}, {{ w.address.area }}, {{ w.address.street }} {{ w.address.building }}</div>
              </div>

              <div class="mt-4 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <button @click="() => router.push({ name: 'WarehouseDetails', params: { id: w.id } })" class="px-3 py-1 bg-blue-600 text-white rounded">عرض التفاصيل</button>
                </div>
                <div class="text-xs text-gray-400">تم الإنشاء: {{ formatDate(w.created_at) }}</div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { fetchWarehouses } from '../../api/warehouses'
import type { Warehouse } from '../../api/warehouses'

const warehouses = ref<Warehouse[]>([])
const loading = ref(false)
const router = useRouter()

const load = async () => {
  loading.value = true
  try {
    const res = await fetchWarehouses()
    warehouses.value = res?.data || []
  } catch (e) {
    console.error('Failed to fetch warehouses', e)
  } finally {
    loading.value = false
  }
}

onMounted(load)

const formatDate = (iso?: string) => {
  if (!iso) return ''
  try { return new Date(iso).toLocaleDateString() } catch { return iso }
}

/**
 * Helper to format attribute objects or JSON strings into a readable inline string
 */
// keep simple helpers
</script>

<style scoped>
/* small local tweaks */
</style>
