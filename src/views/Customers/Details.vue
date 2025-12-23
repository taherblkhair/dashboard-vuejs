<template>
  <div class="p-6 bg-gray-50 min-h-screen" dir="rtl">
    <div class="max-w-6xl mx-auto space-y-6">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">تفاصيل العميل</h1>
          <p class="text-sm text-gray-500 mt-1">عرض تفاصيل العميل، حالة العميل، وعرض الطلبات والعناوين.</p>
        </div>
        <div class="flex items-center gap-3">
          <MButton variant="secondary" @click="() => router.push({ name: 'Customers' })">العودة للقائمة</MButton>
          <MButton variant="primary" @click="openAddressModal">إضافة عنوان</MButton>
        </div>
      </div>

      <!-- Top summary + addresses -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Summary -->
        <MCard class="lg:col-span-1">
          <div class="flex items-center gap-4">
            <div class="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">{{ customer?.name ? customer.name.charAt(0) : '-' }}</div>
            <div>
              <h2 class="text-lg font-semibold">{{ customer?.name || '—' }}</h2>
              <div class="text-sm text-gray-600">{{ customer?.customer_type || '—' }}</div>
            </div>
          </div>

          <div class="mt-4 space-y-2 text-sm text-gray-700">
            <div><strong>الهاتف:</strong> <span class="mr-2">{{ customer?.phone || '—' }}</span></div>
            <div><strong>البريد:</strong> <span class="mr-2">{{ customer?.email || '—' }}</span></div>
            <div><strong>نقاط الولاء:</strong> <span class="mr-2">{{ customer?.loyalty_points ?? 0 }}</span></div>
            <div><strong>إجمالي الطلبات:</strong> <span class="mr-2">{{ customer?.total_orders ?? 0 }}</span></div>
            <div><strong>المجموع المدفوع:</strong> <span class="mr-2">{{ formatCurrency(customer?.total_spent) }}</span></div>
          </div>
        </MCard>

        <!-- Addresses -->
        <MCard class="lg:col-span-2" title="عناوين العميل">
          <div class="space-y-3">
            <div v-if="loadingAddresses" class="text-gray-500">جاري التحميل...</div>
            <div v-else-if="addresses.length === 0" class="text-gray-500">لا توجد عناوين</div>
            <ul v-else class="space-y-3">
              <li v-for="a in addresses" :key="a.id" class="p-4 border rounded-lg bg-white flex items-start justify-between">
                <div>
                  <div class="font-semibold">{{ a.city }} — {{ a.area }}</div>
                  <div class="text-sm text-gray-600">{{ a.street }} {{ a.building ? '، ' + a.building : '' }}</div>
                  <div v-if="a.notes" class="text-xs text-gray-500 mt-1">ملاحظات: {{ a.notes }}</div>
                </div>
                <div class="flex flex-col items-end gap-2">
                  <div>
                    <MButton size="sm" variant="secondary" @click="() => makeDefault(a.id)" :disabled="customer?.default_address_id === a.id">تعيين كافتراضي</MButton>
                  </div>
                  <div class="text-xs text-gray-500">{{ formatDate(a.created_at) }}</div>
                </div>
              </li>
            </ul>
          </div>
        </MCard>
      </div>

      <!-- Orders -->
      <MCard title="الطلبات" padding="p-0">
        <MTable>
          <template #header>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">الرمز</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">تاريخ الطلب</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">التوصيل</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">الإجمالي</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">الحالة</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">إجراءات</th>
          </template>
          <tr v-for="o in customer?.orders || []" :key="o.id" class="hover:bg-gray-50">
            <td class="px-4 py-3 text-gray-700 font-medium">{{ o.code }}</td>
            <td class="px-4 py-3 text-gray-600">{{ formatDate(o.order_date) }}</td>
            <td class="px-4 py-3 text-gray-600">{{ formatDate(o.delivery_date) }}</td>
            <td class="px-4 py-3 text-gray-600">{{ formatCurrency(o.total) }}</td>
            <td class="px-4 py-3"><MBadge :variant="o.payment_status === 'paid' ? 'success' : 'warning'">{{ o.payment_status }}</MBadge></td>
            <td class="px-4 py-3 flex gap-2">
              <MButton size="sm" variant="ghost" @click="() => viewOrder(o.id)">عرض</MButton>
            </td>
          </tr>
          </MTable>
      </MCard>

      <!-- Address Modal -->
      <div v-if="addressModal.open" class="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div class="fixed inset-0 bg-black/30" @click="closeAddressModal"></div>
        <MCard class="relative z-10 w-full max-w-lg" title="إضافة عنوان">
          <div class="p-4 space-y-4">
            <MInput v-model="addressModal.form.city" label="المدينة" />
            <MInput v-model="addressModal.form.area" label="المنطقة" />
            <MInput v-model="addressModal.form.street" label="الشارع" />
            <MInput v-model="addressModal.form.building" label="المبنى" />
            <MInput v-model="addressModal.form.notes" label="ملاحظات (اختياري)" />
          </div>
          <div class="flex justify-end gap-2 p-4 border-t border-gray-100">
            <MButton variant="secondary" @click="closeAddressModal">إلغاء</MButton>
            <MButton variant="primary" @click="submitAddress" :loading="addressModal.loading">حفظ</MButton>
          </div>
        </MCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchCustomer, createCustomerAddress, setCustomerDefaultAddress } from '../../api/customers'
import { fetchAddresses } from '../../api/addresses'
import MButton from '../../components/ui/MButton.vue'
import MInput from '../../components/ui/MInput.vue'
import MCard from '../../components/ui/MCard.vue'
import MBadge from '../../components/ui/MBadge.vue'
import MTable from '../../components/ui/MTable.vue'

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id || 0)

const customer = ref<any>(null)
const addresses = ref<any[]>([])
const loadingAddresses = ref(false)
const loadingCustomer = ref(false)

const showToast = (message: string, type = 'success') => {
  // minimal toast: use alert fallback for now; log type so it's used
  // Replace with `useToast()` composable later if desired
  // eslint-disable-next-line no-console
  console.log('toast', type)
  // eslint-disable-next-line no-alert
  alert(message)
}

const addressModal = ref<any>({ open: false, loading: false, form: { city: '', area: '', street: '', building: '', notes: '' } })

const loadCustomer = async () => {
  if (!id) return
  loadingCustomer.value = true
  try {
    const res = await fetchCustomer(id)
    customer.value = res?.data || null
    // if backend returns addresses within customer, use them
    if (customer.value?.addresses && Array.isArray(customer.value.addresses)) {
      addresses.value = customer.value.addresses
    }
  } catch (e) {
    console.error('Failed to load customer', e)
    showToast('فشل تحميل بيانات العميل', 'error')
  } finally {
    loadingCustomer.value = false
  }
}

const loadAddresses = async () => {
  // if addresses already populated from customer response, skip global fetch
  if (addresses.value && addresses.value.length > 0) return
  loadingAddresses.value = true
  try {
    // fetch all addresses and filter by owner
    const res = await fetchAddresses()
    const all = res || []
    addresses.value = all.filter((a: any) => a.owner_type && a.owner_type.includes('Customer') && Number(a.owner_id) === id)
  } catch (e) {
    console.error('Failed to load addresses', e)
    showToast('فشل تحميل العناوين', 'error')
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
  if (!id) return showToast('معرف العميل مفقود', 'error')
  if (!addressModal.value.form.city) return showToast('المدينة مطلوبة', 'error')
  try {
    addressModal.value.loading = true
    await createCustomerAddress(id, addressModal.value.form)
    showToast('تمت إضافة العنوان', 'success')
    closeAddressModal()
    // refresh
    addresses.value = []
    await loadAddresses()
    await loadCustomer()
  } catch (e) {
    console.error('Failed to create address', e)
    showToast('فشل إضافة العنوان', 'error')
  } finally {
    addressModal.value.loading = false
  }
}

const makeDefault = async (addressId: number) => {
  if (!id || !addressId) return showToast('معرف العميل أو العنوان مفقود', 'error')
  try {
    await setCustomerDefaultAddress(id, addressId)
    // refresh customer
    await loadCustomer()
    showToast('تم تعيين العنوان الافتراضي', 'success')
  } catch (e) {
    console.error('Failed to set default address', e)
    showToast('فشل تعيين العنوان الافتراضي', 'error')
  }
}

const viewOrder = (orderId?: number) => {
  if (!orderId) return
  router.push({ name: 'OrdersView', params: { id: orderId } })
}

</script>

<style scoped>
</style>
