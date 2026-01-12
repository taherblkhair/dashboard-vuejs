<template>
  <div class="p-6 bg-gray-50 min-h-screen" dir="rtl">
    <div class="max-w-6xl mx-auto space-y-6">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900">العملاء</h1>
          <p class="text-sm text-gray-500 mt-1">قائمة جميع العملاء</p>
        </div>
        <div class="flex items-center gap-3">
          <MInput v-model="search" placeholder="ابحث عن عميل بالاسم أو الهاتف" class="w-64" @input="onSearchInput" />
          <MButton variant="primary" @click="createCustomer">إضافة عميل</MButton>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-12 text-gray-500">جاري التحميل...</div>

      <!-- Empty -->
      <MCard v-else-if="customers.length === 0" padding="p-12">
        <div class="text-center">
          <p class="text-gray-500 mb-4">لا يوجد عملاء</p>
          <MButton variant="primary" @click="createCustomer">إضافة عميل جديد</MButton>
        </div>
      </MCard>

      <!-- Customers Table -->
        <MCard v-else padding="p-0">
          <MTable>
            <template #header>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">#</th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">الاسم</th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">الهاتف</th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">البريد</th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">النوع</th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">الطلبات</th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">المجموع</th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">إجراءات</th>
            </template>
            <tr v-for="c in customers" :key="c.id" class="hover:bg-gray-50">
              <td class="px-4 py-3 text-gray-500">{{ c.id }}</td>
              <td class="px-4 py-3 font-medium text-gray-900">{{ c.name }}</td>
              <td class="px-4 py-3 text-gray-600" dir="ltr">{{ c.phone }}</td>
              <td class="px-4 py-3 text-gray-600">{{ c.email }}</td>
              <td class="px-4 py-3">
                <MBadge :variant="c.customer_type === 'business' ? 'warning' : 'neutral'">
                  {{ c.customer_type === 'business' ? 'شركة' : (c.customer_type === 'wholesale' ? 'جملة' : 'فرد') }}
                </MBadge>
              </td>
              <td class="px-4 py-3 text-gray-600">{{ c.total_orders }}</td>
              <td class="px-4 py-3 text-gray-600">{{ c.total_spent }}</td>
              <td class="px-4 py-3">
                 <ActionMenu :items="[
                    { label: 'تعديل', action: () => openEditModal(c), icon: IconEdit },
                    { label: 'العنوان', action: () => openAddressModal(c.id), icon: IconMapPin },
                    { label: 'التفاصيل', action: () => viewCustomer(c.id), icon: IconEye }
                 ]" />
              </td>
            </tr>
          </MTable>
          
          <!-- Pagination -->
          <div class="px-4 py-3 border-t border-gray-100 flex items-center justify-between" v-if="meta.last_page > 1">
            <div class="text-sm text-gray-500">
              صفحة {{ meta.current_page }} من {{ meta.last_page }}
            </div>
            <div class="flex gap-2">
              <MButton variant="secondary" size="sm" :disabled="meta.current_page === 1" @click="load(meta.current_page - 1, search)">السابق</MButton>
              <MButton variant="secondary" size="sm" :disabled="meta.current_page === meta.last_page" @click="load(meta.current_page + 1, search)">التالي</MButton>
            </div>
          </div>
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
      
      <!-- Edit Customer Modal -->
      <div v-if="editModal.open" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click.self="closeEditModal">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
          <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h3 class="text-lg font-bold text-gray-900">تعديل بيانات العميل</h3>
            <button @click="closeEditModal" class="text-gray-400 hover:text-gray-600">✕</button>
          </div>
          
          <div class="p-6 space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">الاسم <span class="text-red-500">*</span></label>
                <input v-model="editModal.form.name" type="text" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف <span class="text-red-500">*</span></label>
                <input v-model="editModal.form.phone" type="tel" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500" dir="ltr" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">نوع العميل</label>
                <select v-model="editModal.form.customer_type" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500">
                  <option value="individual">فرد</option>
                  <option value="business">شركة</option>
                  <option value="wholesale">جملة</option>
                </select>
              </div>
              <div class="col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
                <input v-model="editModal.form.email" type="email" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500" dir="ltr" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">الرقم الضريبي</label>
                <input v-model="editModal.form.tax_number" type="text" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div class="flex items-center pt-6">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" v-model="editModal.form.is_active" class="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" />
                  <span class="text-sm font-medium text-gray-700">نشط</span>
                </label>
              </div>
            </div>
          </div>
  
          <div class="px-6 py-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
            <MButton variant="secondary" @click="closeEditModal">إلغاء</MButton>
            <MButton variant="primary" @click="saveEditCustomer" :loading="editModal.loading">حفظ التغييرات</MButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineComponent, h } from 'vue'
import { useRouter } from 'vue-router'
import { fetchCustomers, createCustomerAddress, updateCustomer } from '../../api/customers'
import { useToast } from '../../composables/useToast'
import MButton from '../../components/ui/MButton.vue'
import MInput from '../../components/ui/MInput.vue'
import MCard from '../../components/ui/MCard.vue'
import MBadge from '../../components/ui/MBadge.vue'
import MTable from '../../components/ui/MTable.vue'
import ActionMenu from '../../components/ui/ActionMenu.vue'

// Icons
const IconEye = defineComponent({ render: () => h('svg', { fill:'none', viewBox:'0 0 24 24', stroke:'currentColor', class:'w-4 h-4' }, [h('path', { 'stroke-linecap':'round', 'stroke-linejoin':'round', 'stroke-width':'2', d:'M15 12a3 3 0 11-6 0 3 3 0 016 0z' }), h('path', { 'stroke-linecap':'round', 'stroke-linejoin':'round', 'stroke-width':'2', d:'M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' })]) })
const IconMapPin = defineComponent({ render: () => h('svg', { fill:'none', viewBox:'0 0 24 24', stroke:'currentColor', class:'w-4 h-4' }, [h('path', { 'stroke-linecap':'round', 'stroke-linejoin':'round', 'stroke-width':'2', d:'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' }), h('path', { 'stroke-linecap':'round', 'stroke-linejoin':'round', 'stroke-width':'2', d:'M15 11a3 3 0 11-6 0 3 3 0 016 0z' })]) })
const IconEdit = defineComponent({ render: () => h('svg', { fill:'none', viewBox:'0 0 24 24', stroke:'currentColor', class:'w-4 h-4' }, [h('path', { 'stroke-linecap':'round', 'stroke-linejoin':'round', 'stroke-width':'2', d:'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' })]) })


const router = useRouter()
const { addToast } = useToast()
const customers = ref<any[]>([])
const loading = ref(false)
const meta = ref<any>({ current_page: 1, last_page: 1 })

const search = ref('')
let searchTimer: number | undefined = undefined

const load = async (page = 1, q: string | null = null) => {
  loading.value = true
  try {
    const res = await fetchCustomers(page, q)
    customers.value = res?.data || []
    meta.value = res?.meta || meta.value
  } catch (e) {
    console.error('Failed to fetch customers', e)
  } finally {
    loading.value = false
  }
}

const onSearchInput = () => {
  // debounce user input
  if (searchTimer) window.clearTimeout(searchTimer)
  searchTimer = window.setTimeout(async () => {
    await load(1, search.value || null)
  }, 450) as unknown as number
}

onMounted(() => load())

const createCustomer = () => router.push({ name: 'CustomersCreate' })
const viewCustomer = (id?: number) => {
  if (!id) return
  router.push({ name: 'CustomersView', params: { id } })
}

// Address modal
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
    await load()
  } catch (e) {
    console.error('Failed to create address', e)
    alert('فشل إضافة العنوان')
  } finally {
    addressModal.value.loading = false
  }
}

// Edit Modal
const editModal = ref<any>({ 
  open: false, 
  loading: false, 
  id: null,
  form: { name: '', phone: '', email: '', customer_type: 'individual', tax_number: '', is_active: true } 
})

const openEditModal = (c: any) => {
  editModal.value.open = true
  editModal.value.id = c.id
  editModal.value.form = { 
    name: c.name, 
    phone: c.phone, 
    email: c.email, 
    customer_type: c.customer_type || 'individual', 
    tax_number: c.tax_number || '', 
    is_active: c.is_active !== false 
  }
}

const closeEditModal = () => {
  editModal.value.open = false
  editModal.value.id = null
}

const saveEditCustomer = async () => {
  if (!editModal.value.form.name || !editModal.value.form.phone) {
    return addToast('الاسم ورقم الهاتف مطلوبان', 'error')
  }
  
  editModal.value.loading = true
  try {
    await updateCustomer(editModal.value.id, editModal.value.form)
    addToast('تم تعديل بيانات العميل', 'success')
    closeEditModal()
    // reload current page to reflect changes
    await load(meta.value.current_page, search.value)
  } catch (e) {
    console.error(e)
    addToast('فشل تعديل البيانات', 'error')
  } finally {
    editModal.value.loading = false
  }
}
</script>

<style scoped>
</style>
