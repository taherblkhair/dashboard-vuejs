<template>
    <div class="flex flex-col items-center justify-center h-screen">
        <div class="flex flex-col items-center justify-center">
            <h1 class="text-3xl font-bold mb-4">قائمة العناوين</h1>
            <div v-if="loading" class="text-gray-500">جاري التحميل...</div>
            <div v-else>
                    <div class="mb-4 flex items-center gap-2">
                      <button @click="openAdd" class="px-3 py-1 bg-green-600 text-white rounded text-sm">إضافة عنوان</button>
                    </div>
                    <div v-if="addresses.length === 0" class="text-gray-500">لا توجد عناوين متاحة.</div>
                    <ul v-else class="space-y-2">
          <li v-for="address in addresses" :key="address.id" class="p-4 border rounded w-96 bg-white">
            <div class="font-semibold">{{ address.city }} - {{ address.area }}</div>
            <div class="text-sm text-gray-600">{{ address.street }} {{ address.building ? '، ' + address.building : '' }}</div>
                        <div v-if="address.owner_name || address.owner_type_label" class="mt-2 text-sm text-gray-700">
                            <template v-if="address.owner_type && address.owner_type.includes('Supplier')">
                              <strong class="text-gray-600">عنوان مورد:</strong>
                              <span class="font-semibold">{{ address.owner_name }}</span>
                            </template>
                            <template v-else-if="address.owner_type && address.owner_type.includes('Customer')">
                              <strong class="text-gray-600">عنوان عميل:</strong>
                              <span class="font-semibold">{{ address.owner_name }}</span>
                            </template>
                            <template v-else-if="address.owner_type && address.owner_type.includes('Warehouse')">
                              <strong class="text-gray-600">عنوان مخزن:</strong>
                              <span class="font-semibold">{{ address.owner_name }}</span>
                            </template>
                            <template v-else-if="address.owner_type && address.owner_type.includes('User')">
                              <strong class="text-gray-600">عنوان مستخدم:</strong>
                              <span class="font-semibold">{{ address.owner_name }}</span>
                            </template>
                            <template v-else>
                              <strong class="text-gray-600">المالك:</strong>
                              <span class="mr-2">{{ address.owner_type_label }}</span>
                              <span class="font-semibold">{{ address.owner_name }}</span>
                            </template>
                        </div>
            <div v-if="address.notes" class="text-xs text-gray-500">ملاحظات: {{ address.notes }}</div>
          </li>
                </ul>   
            </div>
        </div>
    </div>
    <!-- Add Address Modal -->
    <div v-if="showAdd" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div class="bg-white rounded shadow p-4 w-96" dir="rtl">
        <h3 class="font-semibold mb-2">إضافة عنوان جديد</h3>
        <div class="space-y-2">
          <div>
            <label class="block text-sm mb-1">نوع المالك</label>
            <select v-model="addForm.owner_type" @change="() => loadOwnersFor(addForm.owner_type)" class="w-full border rounded px-2 py-1">
              <option value="">-- اختر نوع المالك --</option>
              <option v-for="o in ownerTypeOptions" :key="o.value" :value="o.value">{{ o.label }}</option>
            </select>
          </div>

          <div v-if="addForm.owner_type">
              <!-- Owner is fixed to manager (User id 1) for this interface; keep field hidden but show small label -->
              <div class="text-sm text-gray-600">
                <input type="hidden" v-model="addForm.owner_type" />
                <input type="hidden" v-model="addForm.owner_id" />
                <div class="mb-2"><strong>المالك:</strong> عنوان مدير (ID: 1)</div>
              </div>
          </div>

          <div>
            <label class="block text-sm mb-1">المدينة</label>
            <input v-model="addForm.city" class="w-full border rounded px-2 py-1" />
          </div>
          <div>
            <label class="block text-sm mb-1">المنطقة</label>
            <input v-model="addForm.area" class="w-full border rounded px-2 py-1" />
          </div>
          <div>
            <label class="block text-sm mb-1">الشارع</label>
            <input v-model="addForm.street" class="w-full border rounded px-2 py-1" />
          </div>
          <div>
            <label class="block text-sm mb-1">المبنى</label>
            <input v-model="addForm.building" class="w-full border rounded px-2 py-1" />
          </div>
          <div>
            <label class="block text-sm mb-1">ملاحظات</label>
            <input v-model="addForm.notes" class="w-full border rounded px-2 py-1" />
          </div>

          <div class="flex justify-end gap-2 mt-3">
            <button @click="showAdd = false" class="px-3 py-1 border rounded">إلغاء</button>
            <button @click="submitAdd" class="px-3 py-1 bg-blue-600 text-white rounded">حفظ</button>
          </div>
        </div>
      </div>
    </div>
</template>
<script setup lang="ts">
// مرحباً بك في مشروع Vue + Tailwind 🚀
import { ref, onMounted } from 'vue'
import { fetchAddresses, createAddress } from '../../api/addresses'
import { fetchWarehouse, fetchWarehouses } from '../../api/warehouses'
import { fetchCustomer, fetchCustomers } from '../../api/customers'
import { fetchSupplier, fetchSuppliers } from '../../api/suppliers'
import { useToast } from '../../composables/useToast'


const addresses = ref<any[]>([])
const loading = ref(false)

// cache owner names to avoid duplicate requests
const ownerCache: Record<string, string> = {}

const ownerLabel = (type: string) => {
  if (!type) return 'غير معروف'
  if (type.includes('Warehouse')) return 'مخزن'
  if (type.includes('Customer')) return 'عميل'
  if (type.includes('Supplier')) return 'مورد'
  if (type.includes('User')) return 'مستخدم'
  return type.split('\\').pop() || type
}

const fetchOwnerName = async (addr: any) => {
  const key = `${addr.owner_type}::${addr.owner_id}`
  if (ownerCache[key]) return ownerCache[key]
  try {
    if (addr.owner_type && addr.owner_type.includes('Warehouse')) {
      const res = await fetchWarehouse(Number(addr.owner_id))
      const w = res?.data ?? res
      ownerCache[key] = w?.name || `مخزن #${addr.owner_id}`
      return ownerCache[key]
    }
    if (addr.owner_type && addr.owner_type.includes('Customer')) {
      const res = await fetchCustomer(Number(addr.owner_id))
      const c = res?.data ?? res
      ownerCache[key] = c?.name || `عميل #${addr.owner_id}`
      return ownerCache[key]
    }
    if (addr.owner_type && addr.owner_type.includes('Supplier')) {
      const res = await fetchSupplier(Number(addr.owner_id))
      const s = res?.data ?? res
      ownerCache[key] = s?.name || `مورد #${addr.owner_id}`
      return ownerCache[key]
    }
  } catch (e) {
    console.error('Failed to fetch owner', e)
  }
  ownerCache[key] = `${ownerLabel(addr.owner_type)} #${addr.owner_id}`
  return ownerCache[key]
}

  const load = async () => {
  loading.value = true
  try {
    const res = await fetchAddresses()
    const arr = res || []
    // enrich with owner label and owner name
    addresses.value = await Promise.all(arr.map(async (a: any) => ({
      ...a,
      owner_type_label: ownerLabel(a.owner_type),
      owner_name: await fetchOwnerName(a)
    })))
  } catch (e) {
    console.error('Failed to fetch addresses', e)
  } finally {
    loading.value = false
  }
}

onMounted(load)

// Add address modal state and logic
const { addToast } = useToast()
const showAdd = ref(false)
const ownersList = ref<any[]>([])
const addForm = ref<any>({ owner_type: '', owner_id: '', city: '', area: '', street: '', building: '', notes: '' })

const ownerTypeOptions = [
  { label: 'عنوان مخزن', value: 'App\\Models\\Warehouse' },
  { label: 'عنوان عميل', value: 'App\\Models\\Customer' },
  { label: 'عنوان مورد', value: 'App\\Models\\Supplier' },
  { label: 'عنوان مستخدم', value: 'App\\Models\\User' },
]

const loadOwnersFor = async (ownerType: string) => {
  ownersList.value = []
  try {
    if (!ownerType) return
    if (ownerType.includes('Warehouse')) {
      const res = await fetchWarehouses(1)
      const arr = (res as any)?.data ?? res ?? []
      ownersList.value = arr
    } else if (ownerType.includes('Customer')) {
      const res = await fetchCustomers(1)
      const arr = (res as any)?.data ?? res ?? []
      ownersList.value = arr
    } else if (ownerType.includes('Supplier')) {
      const res = await fetchSuppliers(1)
      const arr = (res as any)?.data ?? res ?? []
      ownersList.value = arr
    }
  } catch (e) {
    console.error('Failed to load owners list', e)
  }
}

const openAdd = () => {
  // This interface is for manager by default: set owner to User id 1 and hide the owner field
  addForm.value = { owner_type: 'App\\Models\\User', owner_id: 1, city: '', area: '', street: '', building: '', notes: '' }
  ownersList.value = []
  showAdd.value = true
}

const submitAdd = async () => {
  // basic validation
  if (!addForm.value.owner_type) { addToast('اختر نوع المالك', 'error'); return }
  if (!addForm.value.owner_id) { addToast('اختر/ادخل معرف المالك', 'error'); return }
  if (!addForm.value.city) { addToast('المدينة مطلوبة', 'error'); return }

  try {
    const payload = {
      owner_type: addForm.value.owner_type,
      owner_id: Number(addForm.value.owner_id),
      city: addForm.value.city,
      area: addForm.value.area,
      street: addForm.value.street,
      building: addForm.value.building,
      notes: addForm.value.notes,
    }
    await createAddress(payload)
    addToast('تمت إضافة العنوان', 'success')
    showAdd.value = false
    await load()
  } catch (e) {
    console.error('Failed to create address', e)
    addToast('فشل إضافة العنوان', 'error')
  }
}
</script>
<style scoped>
</style>