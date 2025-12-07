<template>
  <div class="p-6 bg-gray-50 min-h-screen" dir="rtl">
    <div class="max-w-6xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold">تفاصيل المخزن</h1>
          <p class="text-sm text-gray-500">عرض معلومات المخزن والتقرير المخزون</p>
        </div>
        <div class="flex items-center gap-3">
          <button @click="goBack" class="px-4 py-2 border rounded">عودة</button>
          <button @click="() => router.push({ name: 'StockMovementCreate', query: { warehouse_id: warehouseId } })" class="px-4 py-2 bg-green-600 text-white rounded">إضافة حركة مخزون</button>
          <button @click="() => router.push({ name: 'StockMovementTransfer', query: { from_warehouse_id: warehouseId } })" class="px-4 py-2 bg-yellow-600 text-white rounded">نقل مخزون</button>
          <button @click="openEdit" class="px-4 py-2 bg-blue-600 text-white rounded">تعديل</button>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <template v-if="loading">
          <div class="text-center py-12">جاري التحميل...</div>
        </template>

        <template v-else>
          <div v-if="warehouse">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div class="text-sm text-gray-500">الاسم</div>
                <div class="font-medium">{{ warehouse.name }}</div>
              </div>
              <div>
                <div class="text-sm text-gray-500">الرمز</div>
                <div class="font-medium">{{ warehouse.code }}</div>
              </div>
              <div>
                <div class="text-sm text-gray-500">الهاتف</div>
                <div>{{ warehouse.phone || '-' }}</div>
              </div>
              <div>
                <div class="text-sm text-gray-500">البريد</div>
                <div>{{ warehouse.email || '-' }}</div>
              </div>
              <div>
                <div class="text-sm text-gray-500">السعة</div>
                <div>{{ warehouse.capacity || '-' }}</div>
              </div>
              <div>
                <div class="text-sm text-gray-500">نسبة الاستخدام</div>
                <div>{{ warehouse.current_utilization || '0' }}%</div>
              </div>
              <div class="col-span-1 md:col-span-2">
                <div class="text-sm text-gray-500">العنوان</div>
                <div>{{ warehouse.address ? `${warehouse.address.city}, ${warehouse.address.area}, ${warehouse.address.street} ${warehouse.address.building}` : '-' }}</div>
              </div>
            </div>

            <hr class="my-4" />

            <h4 class="text-lg font-semibold mb-2">تقرير المخزون</h4>
            <div v-if="stockReport">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
                <div>قيمة المخزون الإجمالية: <span class="font-medium">{{ stockReport.total_stock_value ?? 0 }}</span></div>
                <div>عدد المنتجات الفريدة: <span class="font-medium">{{ stockReport.unique_products_count ?? 0 }}</span></div>
                <div>نسبة الاستخدام: <span class="font-medium">{{ stockReport.utilization_percentage ?? warehouse.current_utilization ?? '0' }}%</span></div>
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
                      <!-- <div>يعيد الطلب: <span class="font-medium">{{ s.needs_reorder ? 'نعم' : 'لا' }}</span></div> -->
                      <!-- <div>خارج المخزون: <span class="font-medium">{{ s.is_out_of_stock ? 'نعم' : 'لا' }}</span></div> -->
                      <div v-if="s.pendingAttributes">قيد الانتظار: <span class="font-medium">{{ s.pendingAttributes }}</span></div>
                      <div v-if="s.note">ملاحظة: <span class="font-medium">{{ s.note }}</span></div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
  <!-- Edit Warehouse Modal -->
  <div v-if="showEdit" class="fixed inset-0 z-50 flex items-center justify-center p-4" :class="showEdit ? 'bg-black/50' : ''" @click.self="closeEdit">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
      <div class="bg-gradient-to-r from-blue-600 to-blue-700 p-5 text-white flex items-center justify-between">
        <div>
          <h3 class="text-lg font-bold">تعديل معلومات المخزن</h3>
          <p class="text-sm text-blue-100">قم بتعديل بيانات المخزن ثم احفظ</p>
        </div>
        <button @click="closeEdit" class="p-1.5 rounded-full hover:bg-white/20">
          ✕
        </button>
      </div>

      <form @submit.prevent="submitEdit" class="p-6 space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm text-gray-700 mb-1">الاسم</label>
            <input v-model="editForm.name" required class="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label class="block text-sm text-gray-700 mb-1">الرمز</label>
            <input v-model="editForm.code" class="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label class="block text-sm text-gray-700 mb-1">العنوان</label>
            <select v-model="editForm.address_id" class="w-full px-3 py-2 border rounded-lg">
              <option :value="null">-- اختر عنوان --</option>
              <option v-for="a in addresses" :key="a.id" :value="a.id">{{ a.city }} - {{ a.area }} - {{ a.street }} {{ a.building || '' }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm text-gray-700 mb-1">المدير</label>
            <select v-model="editForm.manager_id" class="w-full px-3 py-2 border rounded-lg">
              <option :value="null">-- اختر مستخدماً --</option>
              <option v-for="u in users" :key="u.id" :value="u.id">{{ u.name }}</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm text-gray-700 mb-1">الهاتف</label>
            <input v-model="editForm.phone" class="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label class="block text-sm text-gray-700 mb-1">البريد</label>
            <input v-model="editForm.email" class="w-full px-3 py-2 border rounded-lg" />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm text-gray-700 mb-1">السعة</label>
            <input v-model="editForm.capacity" type="number" class="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div class="flex items-center gap-3">
            <input type="checkbox" v-model="editForm.is_active" class="rounded" />
            <span class="text-sm text-gray-700">نشط</span>
          </div>
        </div>

        <div>
          <label class="block text-sm text-gray-700 mb-1">ملاحظات</label>
          <textarea v-model="editForm.notes" rows="3" class="w-full px-3 py-2 border rounded-lg"></textarea>
        </div>

        <div class="flex justify-end gap-3">
          <button type="button" @click="closeEdit" class="px-4 py-2 rounded bg-gray-100">إلغاء</button>
          <button :disabled="editLoading" type="submit" class="px-4 py-2 rounded bg-blue-600 text-white flex items-center gap-2">
            <svg v-if="editLoading" class="w-4 h-4 animate-spin" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle></svg>
            <span>حفظ</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchWarehouse, fetchWarehouseStockReport } from '../../api/warehouses'
import { fetchAddresses } from '../../api/addresses'
import { fetchUsers } from '../../api/users'
import { updateWarehouse } from '../../api/warehouses'
import type { Warehouse } from '../../api/warehouses'

const route = useRoute()
const router = useRouter()
const warehouseId = Number(route.params.id || 0)

const warehouse = ref<Warehouse | null>(null)
const stockReport = ref<any>(null)
const loading = ref(false)

// edit modal state
const showEdit = ref(false)
const editLoading = ref(false)
const addresses = ref<any[]>([])
const users = ref<any[]>([])
const editForm = ref<any>({})

const load = async () => {
  if (!warehouseId) return
  loading.value = true
  try {
    const [wRes, rRes] = await Promise.allSettled([fetchWarehouse(warehouseId), fetchWarehouseStockReport(warehouseId)])
    if (wRes.status === 'fulfilled') {
      warehouse.value = (wRes.value as any)?.data ?? wRes.value
    }
    if (rRes.status === 'fulfilled') {
      stockReport.value = (rRes.value as any)?.data ?? rRes.value
    }
  } catch (e) {
    console.error('Failed to load warehouse details', e)
  } finally {
    loading.value = false
  }
}

onMounted(load)

const openEdit = async () => {
  if (!warehouse.value) return
  // populate form
  editForm.value = {
    name: warehouse.value.name,
    code: warehouse.value.code,
    address_id: warehouse.value.address?.id ?? null,
    manager_id: warehouse.value.manager_id ?? warehouse.value.manager?.id ?? null,
    phone: warehouse.value.phone ?? '',
    email: warehouse.value.email ?? '',
    capacity: warehouse.value.capacity ?? '',
    notes: warehouse.value.notes ?? '',
    is_active: warehouse.value.is_active ?? true,
  }

  // load addresses and users for selects
  try {
    const a = await fetchAddresses()
    addresses.value = Array.isArray(a) ? a : (a.data || [])
  } catch (e) {
    console.error('Failed to load addresses', e)
    addresses.value = []
  }

  try {
    const uRes = await fetchUsers()
    // fetchUsers returns a paginated object with data[]
    users.value = (uRes && uRes.data) ? uRes.data : (Array.isArray(uRes) ? uRes : [])
  } catch (e) {
    console.error('Failed to load users', e)
    users.value = []
  }

  showEdit.value = true
}

const closeEdit = () => {
  showEdit.value = false
}

const submitEdit = async () => {
  if (!warehouseId) return
  editLoading.value = true
  try {
    const payload = { ...editForm.value }
    await updateWarehouse(warehouseId, payload)
    // reload details
    await load()
    showEdit.value = false
  } catch (e) {
    console.error('Failed to update warehouse', e)
    // TODO: show toast
  } finally {
    editLoading.value = false
  }
}

const goBack = () => router.back()

const formatAttributes = (attr: any) => {
  if (!attr) return ''
  if (typeof attr === 'string') {
    try { const parsed = JSON.parse(attr); return Object.entries(parsed).map(([k, v]) => `${k}: ${v}`).join(', ') } catch { return attr }
  }
  if (typeof attr === 'object') { try { return Object.entries(attr).map(([k, v]) => `${k}: ${v}`).join(', ') } catch { return String(attr) } }
  return String(attr)
}
</script>

<style scoped>
</style>
