<template>
  <div class="p-6 bg-gray-50 min-h-screen" dir="rtl">
    <div class="max-w-6xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold">العملاء</h1>
          <p class="text-sm text-gray-500">قائمة العملاء.</p>
        </div>
      </div>

      <div class="flex justify-end gap-3 mt-6">
        <button @click="createCustomer" class="px-4 py-2 border rounded bg-gray-100 text-sm">إضافة عميل</button>
      </div>

      <div class="bg-white rounded-lg shadow p-4 mt-4">
        <div v-if="loading" class="text-center py-8">جاري التحميل...</div>
        <div v-else>
          <div v-if="customers.length === 0" class="text-center py-8 text-gray-500">لا يوجد عملاء</div>
          <div v-else class="overflow-x-auto">
            <table class="w-full table-auto text-sm">
              <thead>
                <tr class="text-right text-xs text-gray-500 border-b">
                  <th class="p-2">#</th>
                  <th class="p-2">الاسم</th>
                  <th class="p-2">الهاتف</th>
                  <th class="p-2">البريد الإلكتروني</th>
                  <th class="p-2">النوع</th>
                  <th class="p-2">الطلبات</th>
                  <th class="p-2">المجموع</th>
                  <th class="p-2">آخر طلب</th>
                  <th class="p-2">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="c in customers" :key="c.id" class="border-b hover:bg-gray-50">
                  <td class="p-2 text-right">{{ c.id }}</td>
                  <td class="p-2 text-right">{{ c.name }}</td>
                  <td class="p-2 text-right">{{ c.phone }}</td>
                  <td class="p-2 text-right">{{ c.email }}</td>
                  <td class="p-2 text-right">{{ c.customer_type }}</td>
                  <td class="p-2 text-right">{{ c.total_orders }}</td>
                  <td class="p-2 text-right">{{ c.total_spent }}</td>
                  <td class="p-2 text-right">{{ formatDate(c.last_order_date) }}</td>
                  <td class="p-2 text-right">
                    <div class="flex justify-end gap-1">
                      <button @click="viewCustomer(c.id)" class="px-2 py-1 bg-blue-600 text-white rounded text-xs">عرض</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Address modal -->
      <div v-if="addressModal.open">
        <div class="fixed inset-0 bg-black bg-opacity-50 z-40" @click="closeAddressModal"></div>
        <div class="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div class="bg-white w-full max-w-lg rounded shadow p-4">
            <h3 class="text-lg font-semibold mb-3">إضافة عنوان للعميل</h3>
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { fetchCustomers, createCustomerAddress } from '../../api/customers'

const router = useRouter()
const customers = ref<any[]>([])
const loading = ref(false)
const meta = ref<any>({ current_page: 1, last_page: 1 })

const load = async (page = 1) => {
  loading.value = true
  try {
    const res = await fetchCustomers(page)
    customers.value = res?.data || []
    meta.value = res?.meta || meta.value
  } catch (e) {
    console.error('Failed to fetch customers', e)
  } finally {
    loading.value = false
  }
}

onMounted(() => load())

const formatDate = (iso?: string) => {
  if (!iso) return '-'
  try { return new Date(iso).toLocaleDateString() } catch { return iso }
}

const createCustomer = () => router.push({ name: 'CustomersCreate' })
const viewCustomer = (id?: number) => { if (!id) return; router.push({ name: 'CustomersView', params: { id } }) }

// Address modal state & handlers
const addressModal = ref<any>({ open: false, customerId: null, loading: false, form: { city: '', area: '', street: '', building: '', notes: '' } })

const openAddressModal = (customerId?: number) => {
  if (!customerId) return
  addressModal.value.open = true
  addressModal.value.customerId = customerId
  addressModal.value.form = { city: '', area: '', street: '', building: '', notes: '' }
}

const closeAddressModal = () => {
  addressModal.value.open = false
  addressModal.value.customerId = null
}

const submitAddress = async () => {
  const cid = addressModal.value.customerId
  if (!cid) return alert('Missing customer id')
  if (!addressModal.value.form.city) return alert('المدينة مطلوبة')
  try {
    addressModal.value.loading = true
    await createCustomerAddress(cid, addressModal.value.form)
    alert('تمت إضافة العنوان')
    closeAddressModal()
    await load() // refresh customers list
  } catch (e) {
    console.error('Failed to create address', e)
    alert('فشل إضافة العنوان')
  } finally {
    addressModal.value.loading = false
  }
}

</script>

<style scoped>
</style>
