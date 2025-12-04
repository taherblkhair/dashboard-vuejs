<template>
  <div class="p-6 bg-gray-50 min-h-screen" dir="rtl">
    <div class="max-w-4xl mx-auto">
      <div class="mb-6">
        <h1 class="text-2xl font-bold">تفاصيل العميل</h1>
        <p class="text-sm text-gray-500">تفاصيل العميل وعناوينه.</p>
      </div>

      <div class="bg-white rounded shadow p-4 mb-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div class="text-lg font-semibold">{{ customer?.name }}</div>
            <div class="text-sm text-gray-500">{{ customer?.email }} • {{ customer?.phone }}</div>
          </div>
          <div class="space-y-1">
            <div class="text-xs text-gray-500">نوع العميل</div>
            <div class="font-medium">{{ customer?.customer_type || '—' }}</div>
            <div class="text-xs text-gray-500">الرقم الضريبي</div>
            <div class="font-medium">{{ customer?.tax_number || '—' }}</div>
          </div>
          <div class="space-y-1 text-left">
            <div class="text-xs text-gray-500">نقاط الولاء</div>
            <div class="font-medium">{{ customer?.loyalty_points ?? 0 }}</div>
            <div class="text-xs text-gray-500">إجمالي الطلبات / المبلغ</div>
            <div class="font-medium">{{ customer?.total_orders || 0 }} / {{ formatCurrency(customer?.total_spent) }}</div>
          </div>
        </div>
        <div class="mt-3 text-sm text-gray-500">الحالة: <span :class="{'text-green-600': customer?.is_active, 'text-red-600': !customer?.is_active}">{{ customer?.is_active ? 'نشط' : 'غير نشط' }}</span> • أنشئ في: {{ formatDate(customer?.created_at) }}</div>
      </div>

      <div class="bg-white rounded shadow p-4">
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-lg font-medium">العناوين</h2>
          <button @click="openAddressModal" class="px-3 py-1 bg-green-600 text-white rounded text-sm">إضافة عنوان</button>
        </div>

        <div v-if="loadingAddresses" class="text-center py-8">جاري التحميل...</div>
        <div v-else>
          <div v-if="addresses.length === 0" class="text-gray-500">لا توجد عناوين</div>
          <div v-else class="space-y-3">
            <div v-for="a in addresses" :key="a.id" class="p-3 border rounded flex justify-between items-start">
              <div>
                <div class="font-semibold">{{ a.city }} - {{ a.area }}</div>
                <div class="text-sm text-gray-600">{{ a.street }} {{ a.building ? '، ' + a.building : '' }}</div>
                <div v-if="a.notes" class="text-xs text-gray-500">{{ a.notes }}</div>
              </div>
              <div class="flex flex-col items-end gap-2">
                <div v-if="customer?.default_address_id === a.id" class="text-sm text-green-600 font-semibold">العنوان الافتراضي</div>
                <button v-else @click="makeDefault(a.id)" class="px-2 py-1 bg-blue-600 text-white rounded text-xs">تعيين كافتراضي</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded shadow p-4 mt-4">
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-lg font-medium">الطلبات ({{ customer?.total_orders || (customer?.orders || []).length }})</h2>
        </div>
        <div v-if="!customer?.orders || customer.orders.length === 0" class="text-gray-500">لا توجد طلبات</div>
        <div v-else class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead>
              <tr class="text-left text-xs text-gray-500">
                <th class="px-2 py-2">كود</th>
                <th class="px-2 py-2">الحالة</th>
                <th class="px-2 py-2">حالة الدفع</th>
                <th class="px-2 py-2">المبلغ</th>
                <th class="px-2 py-2">تاريخ الطلب</th>
                <th class="px-2 py-2">تاريخ التوصيل</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="o in customer.orders" :key="o.id" class="border-t">
                <td class="px-2 py-2">{{ o.code }}</td>
                <td class="px-2 py-2">{{ o.status }}</td>
                <td class="px-2 py-2">{{ o.payment_status }}</td>
                <td class="px-2 py-2">{{ formatCurrency(o.total) }}</td>
                <td class="px-2 py-2">{{ formatDate(o.order_date) }}</td>
                <td class="px-2 py-2">{{ formatDate(o.delivery_date) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Address modal (reuse same modal as list) -->
    <div v-if="addressModal.open">
      <div class="fixed inset-0 bg-black bg-opacity-50 z-40" @click="closeAddressModal"></div>
      <div class="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div class="bg-white w-full max-w-lg rounded shadow p-4">
          <h3 class="text-lg font-semibold mb-3">إضافة عنوان</h3>
          <div class="grid grid-cols-1 gap-3">
            <div>
              <label class="block text-sm mb-1">المدينة</label>
              <input v-model="addressModal.form.city" class="w-full border rounded px-2 py-2" />
            </div>
            <div>
              <label class="block text-sm mb-1">المنطقة</label>
              <input v-model="addressModal.form.area" class="w-full border rounded px-2 py-2" />
            </div>
            <div>
              <label class="block text-sm mb-1">الشارع</label>
              <input v-model="addressModal.form.street" class="w-full border rounded px-2 py-2" />
            </div>
            <div>
              <label class="block text-sm mb-1">المبنى</label>
              <input v-model="addressModal.form.building" class="w-full border rounded px-2 py-2" />
            </div>
            <div>
              <label class="block text-sm mb-1">ملاحظات (اختياري)</label>
              <input v-model="addressModal.form.notes" class="w-full border rounded px-2 py-2" />
            </div>
          </div>
          <div class="flex justify-end gap-2 mt-4">
            <button @click="submitAddress" :disabled="addressModal.loading" class="px-4 py-2 bg-green-600 text-white rounded">حفظ</button>
            <button @click="closeAddressModal" class="px-4 py-2 border rounded">إلغاء</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { fetchCustomer, createCustomerAddress, setCustomerDefaultAddress } from '../../api/customers'
import { fetchAddresses } from '../../api/addresses'

const route = useRoute()
const id = Number(route.params.id || 0)

const customer = ref<any>(null)
const addresses = ref<any[]>([])
const loadingAddresses = ref(false)

const addressModal = ref<any>({ open: false, loading: false, form: { city: '', area: '', street: '', building: '', notes: '' } })

const loadCustomer = async () => {
  if (!id) return
  try {
    const res = await fetchCustomer(id)
    customer.value = res?.data || null
    // if backend returns addresses within customer, use them
    if (customer.value?.addresses && Array.isArray(customer.value.addresses)) {
      addresses.value = customer.value.addresses
    }
  } catch (e) {
    console.error('Failed to load customer', e)
  }
}

const loadAddresses = async () => {
  // if addresses already populated from customer response, skip global fetch
  if (addresses.value && addresses.value.length > 0) return
  loadingAddresses.value = true
  try {
    // fetch all addresses and filter by owner
    const res = await fetchAddresses(1)
    const all = res?.data || []
    addresses.value = all.filter((a: any) => a.owner_type && a.owner_type.includes('Customer') && Number(a.owner_id) === id)
  } catch (e) {
    console.error('Failed to load addresses', e)
  } finally {
    loadingAddresses.value = false
  }
}

// small presentation helpers
const formatDate = (iso?: string) => {
  if (!iso) return '—'
  try {
    const d = new Date(iso)
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return iso
  }
}

const formatCurrency = (val?: string | number) => {
  if (val === null || val === undefined || val === '') return '0.00'
  const num = typeof val === 'number' ? val : Number(String(val))
  if (Number.isNaN(num)) return String(val)
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(num)
}

onMounted(async () => {
  await loadCustomer()
  await loadAddresses()
})

const openAddressModal = () => { addressModal.value.open = true }
const closeAddressModal = () => { addressModal.value.open = false }

const submitAddress = async () => {
  if (!id) return alert('Missing customer id')
  if (!addressModal.value.form.city) return alert('المدينة مطلوبة')
  try {
    addressModal.value.loading = true
    await createCustomerAddress(id, addressModal.value.form)
    alert('تمت إضافة العنوان')
    closeAddressModal()
    await loadAddresses()
    await loadCustomer()
  } catch (e) {
    console.error('Failed to create address', e)
    alert('فشل إضافة العنوان')
  } finally {
    addressModal.value.loading = false
  }
}

const makeDefault = async (addressId: number) => {
  if (!id || !addressId) return
  try {
    await setCustomerDefaultAddress(id, addressId)
    // refresh customer
    await loadCustomer()
  } catch (e) {
    console.error('Failed to set default address', e)
    alert('فشل تعيين العنوان الافتراضي')
  }
}

</script>

<style scoped>
</style>
