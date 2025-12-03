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
                  <button @click="() => showDetailsModal(w.id)" class="px-3 py-1 bg-blue-600 text-white rounded">عرض التفاصيل</button>
                </div>
                <div class="text-xs text-gray-400">تم الإنشاء: {{ formatDate(w.created_at) }}</div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- تفاصيل المخزن مودال -->
    <div v-if="showDetails" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div class="bg-white rounded-lg w-full max-w-2xl p-6 overflow-auto max-h-[90vh]">
        <div class="flex items-start justify-between mb-4">
          <div>
            <h3 class="text-xl font-bold">تفاصيل المخزن</h3>
            <div class="text-sm text-gray-500">عرض معلومات المخزن والتقرير المخزون</div>
          </div>
          <button @click="closeDetails" aria-label="إغلاق" class="text-gray-600">×</button>
        </div>

        <div v-if="loadingDetails" class="text-center py-12">جاري التحميل...</div>

        <div v-else>
          <div v-if="activeWarehouse">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div class="text-sm text-gray-500">الاسم</div>
                <div class="font-medium">{{ activeWarehouse.name }}</div>
              </div>
              <div>
                <div class="text-sm text-gray-500">الرمز</div>
                <div class="font-medium">{{ activeWarehouse.code }}</div>
              </div>
              <div>
                <div class="text-sm text-gray-500">الهاتف</div>
                <div>{{ activeWarehouse.phone || '-' }}</div>
              </div>
              <div>
                <div class="text-sm text-gray-500">البريد</div>
                <div>{{ activeWarehouse.email || '-' }}</div>
              </div>
              <div>
                <div class="text-sm text-gray-500">السعة</div>
                <div>{{ activeWarehouse.capacity || '-' }}</div>
              </div>
              <div>
                <div class="text-sm text-gray-500">نسبة الاستخدام</div>
                <div>{{ activeWarehouse.current_utilization || '0' }}%</div>
              </div>
              <div class="col-span-1 md:col-span-2">
                <div class="text-sm text-gray-500">العنوان</div>
                <div>{{ activeWarehouse.address ? `${activeWarehouse.address.city}, ${activeWarehouse.address.area}, ${activeWarehouse.address.street} ${activeWarehouse.address.building}` : '-' }}</div>
              </div>
            </div>

            <hr class="my-4" />

            <div class="flex items-center justify-between">
              <h4 class="text-lg font-semibold mb-2">تقرير المخزون</h4>
              <button @click="() => router.push({ name: 'StockMovementCreate', query: { warehouse_id: activeWarehouse?.id } })" class="px-3 py-1 bg-green-600 text-white rounded text-sm">إضافة حركة مخزون</button>
            </div>
            <div v-if="stockReport">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
                <div>قيمة المخزون الإجمالية: <span class="font-medium">{{ stockReport.total_stock_value ?? 0 }}</span></div>
                <div>عدد المنتجات الفريدة: <span class="font-medium">{{ stockReport.unique_products_count ?? 0 }}</span></div>
                <div>نسبة الاستخدام: <span class="font-medium">{{ stockReport.utilization_percentage ?? activeWarehouse.current_utilization ?? '0' }}%</span></div>
                <div>السعة المتاحة: <span class="font-medium">{{ stockReport.available_capacity ?? '-' }}</span></div>
                <div>المخزن ممتلئ: <span class="font-medium">{{ stockReport.is_full ? 'نعم' : 'لا' }}</span></div>
              </div>

              <div v-if="stockReport.stock_details && stockReport.stock_details.length" class="mt-4">
                <div class="text-sm text-gray-600 mb-2">تفاصيل المخزون:</div>
                <ul class="space-y-3">
                  <li v-for="(s, idx) in stockReport.stock_details" :key="idx" class="p-4 border rounded bg-gray-50 text-sm">
                    <div class="flex items-start justify-between gap-4">
                      <div class="flex-1 min-w-0">
                        <div class="font-medium text-gray-800 truncate">{{ s.product_name || ('#' + (s.product_variant_id ?? '')) }}</div>
                        <div class="text-xs text-gray-500 mt-1 truncate">{{ formatAttributes(s.variant_attributes || s.variant_attributes_json || s.attributes || s.variant_attributes_raw) }}</div>
                      </div>

                      <div class="text-right text-sm flex-shrink-0 ml-4">
                        <div>الكمية: <span class="font-medium">{{ s.quantity ?? s.available_quantity ?? 0 }}</span></div>
                        <div>محجوز: <span class="font-medium">{{ s.reserved_quantity ?? 0 }}</span></div>
                        <div>متاح: <span class="font-medium">{{ s.available_quantity ?? 0 }}</span></div>
                      </div>
                    </div>

                    <div class="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <div>يعيد الطلب: <span class="font-medium">{{ s.needs_reorder ? 'نعم' : 'لا' }}</span></div>
                      <div>خارج المخزون: <span class="font-medium">{{ s.is_out_of_stock ? 'نعم' : 'لا' }}</span></div>
                      <div v-if="s.pendingAttributes">قيد الانتظار: <span class="font-medium">{{ s.pendingAttributes }}</span></div>
                      <div v-if="s.note">ملاحظة: <span class="font-medium">{{ s.note }}</span></div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { fetchWarehouses, fetchWarehouse, fetchWarehouseStockReport } from '../../api/warehouses'
import type { Warehouse } from '../../api/warehouses'

const warehouses = ref<Warehouse[]>([])
const loading = ref(false)
const router = useRouter()

// details modal state
const showDetails = ref(false)
const activeWarehouse = ref<Warehouse | null>(null)
const stockReport = ref<any>(null)
const loadingDetails = ref(false)

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

const showDetailsModal = async (id?: number) => {
  if (!id) return
  loadingDetails.value = true
  showDetails.value = true
  activeWarehouse.value = null
  stockReport.value = null
  try {
    const [wRes, rRes] = await Promise.allSettled([fetchWarehouse(id), fetchWarehouseStockReport(id)])
    if (wRes.status === 'fulfilled') {
      // API may return { data: { ... } }
      // normalize if necessary
      const data = (wRes.value as any)?.data ?? wRes.value
      activeWarehouse.value = data
    }
    if (rRes.status === 'fulfilled') {
      stockReport.value = (rRes.value as any)?.data ?? rRes.value
    }
  } catch (e) {
    console.error('Failed to load warehouse details', e)
  } finally {
    loadingDetails.value = false
  }
}

const closeDetails = () => {
  showDetails.value = false
  activeWarehouse.value = null
  stockReport.value = null
}

const formatDate = (iso?: string) => {
  if (!iso) return ''
  try { return new Date(iso).toLocaleDateString() } catch { return iso }
}

/**
 * Helper to format attribute objects or JSON strings into a readable inline string
 */
const formatAttributes = (attr: any) => {
  if (!attr) return ''
  if (typeof attr === 'string') {
    // some APIs return JSON as a string
    try {
      const parsed = JSON.parse(attr)
      return Object.entries(parsed).map(([k, v]) => `${k}: ${v}`).join(', ')
    } catch {
      // fallback: return raw string (but trimmed)
      return attr
    }
  }
  if (typeof attr === 'object') {
    try {
      return Object.entries(attr).map(([k, v]) => `${k}: ${v}`).join(', ')
    } catch {
      return String(attr)
    }
  }
  return String(attr)
}
</script>

<style scoped>
/* small local tweaks */
</style>
