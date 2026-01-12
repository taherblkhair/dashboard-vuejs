<template>
  <div class="p-6 bg-gray-50 min-h-screen" dir="rtl">
    <div class="max-w-5xl mx-auto space-y-6">
      <!-- Toast removed, using global toaster -->

      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900">إنشاء فاتورة مبيعات</h1>
          <p class="text-sm text-gray-500 mt-1">أدخل بيانات الطلب</p>
        </div>
      </div>

   

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Customer & Delivery -->
        <div class="lg:col-span-2 space-y-6">
          <MCard title="بيانات العميل">
            <div class="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div class="flex items-center justify-between mb-1">
                  <label class="block text-sm font-medium text-gray-700">العميل <span class="text-red-500">*</span></label>
                  <button @click="openCustomerModal" class="text-xs text-indigo-600 hover:text-indigo-800 font-medium">+ عميل جديد</button>
                </div>
                <!-- Replaced select with Autocomplete -->
                <CustomerAutocomplete 
                  v-model="form.customer_id" 
                  @select="onCustomerSelect"
                  :initial-label="customers.find(c => c.id === form.customer_id)?.name" 
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">المصدر</label>
                <select v-model="form.source" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500">
                  <option value="internal">داخلي</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">عنوان التوصيل</label>
                <select v-model="form.delivery_address_id" :disabled="!customerAddresses.length" class="w-full px-3 py-2 border border-gray-200 rounded-lg disabled:bg-gray-100">
                  <option value="">اختر عنوان</option>
                  <option v-for="a in customerAddresses" :key="a.id" :value="a.id">{{ a.city }} — {{ a.area }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">تاريخ التوصيل</label>
                <input v-model="form.delivery_date" type="date" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500" />
              </div>
            </div>
          </MCard>
        </div>

      
      </div>

      <!-- Order Items -->
      <MCard title="عناصر الفاتورة">
        <div class="p-4">
          <div class="flex justify-end mb-4">
            <MButton variant="primary" size="sm" @click="addLine">+ إضافة صنف</MButton>
          </div>

          <div v-if="form.lines.length === 0" class="text-center py-8 text-gray-400">
            لا توجد أصناف. استخدم البحث أو الزر أعلاه لإضافة أصناف.
          </div>

          <div v-else class="space-y-3">
            <div v-for="(line, idx) in form.lines" :key="line._uid" class="border border-gray-100 rounded-lg p-4">
              <div class="flex justify-between items-start mb-3">
                <span class="text-sm font-medium text-gray-700">
                  {{ line.product_name || `الصنف #${Number(idx) + 1}` }}
                  <span v-if="line.product_sku" class="text-gray-400">— {{ line.product_sku }}</span>
                </span>
                <button @click="removeLine(Number(idx))" class="text-red-500 hover:text-red-700 text-sm">حذف</button>
              </div>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div class="col-span-2">
                  <label class="block text-xs text-gray-500 mb-1">الصنف</label>
                  <VariantAutocomplete 
                    v-model="line.product_variant_id" 
                    :selected-label="line.product_name || ''"
                    @select="(v) => onVariantSelected(Number(idx), v)" 
                    placeholder="ابحث..."
                  />
                </div>
                <div>
                  <label class="block text-xs text-gray-500 mb-1">الكمية</label>
                  <input v-model.number="line.quantity" type="number" min="1" class="w-full px-2 py-1.5 border border-gray-200 rounded text-sm" />
                </div>
                <div>
                  <label class="block text-xs text-gray-500 mb-1">السعر</label>
                  <input v-model.number="line.unit_price" type="number" step="0.01" class="w-full px-2 py-1.5 border border-gray-200 rounded text-sm" />
                </div>
              </div>
              <div class="flex justify-end mt-2 text-sm text-primary-600 font-medium">
                {{ formatCurrency(lineTotal(line)) }}
              </div>
            </div>
          </div>
        </div>
      </MCard>

      <!-- Notes -->
      <MCard>
        <div class="p-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">ملاحظات</label>
          <textarea v-model="form.notes" rows="2" placeholder="ملاحظات الفاتورة..." class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"></textarea>
        </div>
      </MCard>

      <!-- Summary Sidebar -->
         <div>
          <MCard title="ملخص الفاتورة" class="sticky top-6">
            <div class="p-4 space-y-3">
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">عدد الأصناف</span>
                <span class="font-medium">{{ form.lines.length }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">المجموع الجزئي</span>
                <span class="font-medium text-primary-600">{{ formatCurrency(subtotal) }}</span>
              </div>
              <div class="flex justify-between text-sm items-center">
                <span class="text-gray-500">الخصم</span>
                <input v-model.number="form.discount_amount" type="number" min="0" step="0.01" class="w-20 px-2 py-1 border border-gray-200 rounded text-left text-sm" />
              </div>
              <div class="border-t pt-3 flex justify-between">
                <span class="font-semibold text-gray-900">الإجمالي</span>
                <span class="font-bold text-lg text-gray-900">{{ formatCurrency(grandTotal) }}</span>
              </div>
            </div>
          </MCard>
        </div>

      <!-- Actions -->
      <div class="flex justify-end gap-3">
        <router-link to="/orders">
          <MButton variant="secondary">إلغاء</MButton>
        </router-link>
        <MButton variant="primary" @click="submit" :loading="submitting" :disabled="submitting">
          {{ submitting ? 'جاري الحفظ...' : 'إنشاء الفاتورة' }}
        </MButton>
      </div>
    </div>

    <!-- New Customer Modal -->
    <div v-if="showCustomerModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click.self="closeCustomerModal">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 class="text-lg font-bold text-gray-900">إضافة عميل جديد</h3>
          <button @click="closeCustomerModal" class="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">اسم العميل <span class="text-red-500">*</span></label>
            <input v-model="newCustomer.name" type="text" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="الاسم كامل" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف <span class="text-red-500">*</span></label>
            <input v-model="newCustomer.phone" type="tel" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="09XXXXXXXX" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني (اختياري)</label>
            <input v-model="newCustomer.email" type="email" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500" />
          </div>
        </div>

        <div class="px-6 py-4 bg-gray-50 flex justify-end gap-3">
          <MButton variant="secondary" size="sm" @click="closeCustomerModal">إلغاء</MButton>
          <MButton variant="primary" size="sm" @click="saveNewCustomer" :loading="savingCustomer" :disabled="savingCustomer">حفظ العميل</MButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { fetchCustomer, createCustomer } from '../../api/customers'
import { fetchProducts } from '../../api/products'
import { createOrder } from '../../api/orders'
import VariantAutocomplete from '../../components/VariantAutocomplete.vue'
import CustomerAutocomplete from '../../components/CustomerAutocomplete.vue'
import MButton from '../../components/ui/MButton.vue'
import MCard from '../../components/ui/MCard.vue'
import { formatCurrency } from '../../utils/helpers'
import { useToast } from '../../composables/useToast'

const router = useRouter()
const { addToast } = useToast()
const customers = ref<any[]>([])
const products = ref<any[]>([])
const customerAddresses = ref<any[]>([])
const submitting = ref(false)

const form = ref<any>({
  customer_id: null,
  source: 'internal',
  discount_amount: 0,
  shipping_fee: 0,
  delivery_date: '',
  delivery_time_slot: '',
  notes: '',
  delivery_address_id: null,
  billing_address_id: null,
  lines: []
})

const loadCustomers = async () => {
  // Autocomplete handles searching, we don't need to load all customers initially
  // But we keep the customers ref if we need it for other things, or we can remove it.
  // For now, let's just leave it empty or fetch a default set if really needed.
}

const loadProducts = async () => {
  try {
    const res = await fetchProducts(1)
    products.value = res?.data || []
  } catch (e) { addToast('فشل تحميل الآصناف', 'error') }
}

const onCustomerSelect = async (customer: any) => {
  if (!customer) {
    form.value.customer_id = null
    customerAddresses.value = []
    form.value.delivery_address_id = null
    return
  }
  
  form.value.customer_id = customer.id
  customerAddresses.value = []
  form.value.delivery_address_id = null
  
  try {
    // use the customer object directly if addresses are present, otherwise fetch details
    if (customer.addresses && customer.addresses.length > 0) {
        customerAddresses.value = customer.addresses
        if (customer.default_address_id) form.value.delivery_address_id = customer.default_address_id
    } else {
        // fetch full details to get addresses
        const res = await fetchCustomer(customer.id)
        const fullCust = res?.data
        if (fullCust?.addresses) customerAddresses.value = fullCust.addresses
        if (fullCust?.default_address_id) form.value.delivery_address_id = fullCust.default_address_id
    }
  } catch (e) { console.error(e) }
}

onMounted(async () => {
  await Promise.all([loadCustomers(), loadProducts()])
  addLine()
})

const uid = (() => { let i = 0; return () => ++i })()

const addLine = () => {
  form.value.lines.push({ _uid: uid(), product_variant_id: null, quantity: 1, unit_price: 0, discount_amount: 0, notes: '', product_name: null, product_sku: '' })
}

const removeLine = (idx: number) => form.value.lines.splice(idx, 1)

const onVariantSelected = (idx: number, v: any) => {
  if (!v) return
  form.value.lines[idx].product_variant_id = v.id
  form.value.lines[idx].unit_price = Number(v.sale_price || 0)
  form.value.lines[idx].product_name = v.product?.name || v.name || 'الصنف'
  form.value.lines[idx].product_sku = v.sku_variant || ''
}

const lineTotal = (l: any) => (Number(l.quantity || 0) * Number(l.unit_price || 0)) - Number(l.discount_amount || 0)
const subtotal = computed(() => form.value.lines.reduce((s: number, l: any) => s + lineTotal(l), 0))
const grandTotal = computed(() => subtotal.value - Number(form.value.discount_amount || 0) + Number(form.value.shipping_fee || 0))

const submit = async () => {
  if (submitting.value) return
  submitting.value = true

  if (!form.value.customer_id) {
    submitting.value = false
    return addToast('اختر عميل', 'error')
  }
  if (!form.value.lines.length) {
    submitting.value = false
    return addToast('أضف بند واحد على الأقل', 'error')
  }
  for (const l of form.value.lines) {
    if (!l.product_variant_id) {
      submitting.value = false
      return addToast('اختر صنف لكل بند', 'error')
    }
  }

  try {
    const payload = {
      customer_id: form.value.customer_id,
      source: form.value.source,
      discount_amount: Number(form.value.discount_amount || 0),
      shipping_fee: Number(form.value.shipping_fee || 0),
      delivery_date: form.value.delivery_date || null,
      delivery_time_slot: form.value.delivery_time_slot || null,
      notes: form.value.notes || null,
      delivery_address_id: form.value.delivery_address_id || null,
      billing_address_id: form.value.billing_address_id || null,
      lines: form.value.lines.map((l: any) => ({
        product_variant_id: l.product_variant_id,
        quantity: l.quantity,
        unit_price: Number(l.unit_price || 0),
        discount_amount: Number(l.discount_amount || 0),
        notes: l.notes || null
      }))
    }
    const res = await createOrder(payload)
    addToast('تم إنشاء الفاتورة', 'success')
    setTimeout(() => router.push(res?.data?.id ? { name: 'OrderDetails', params: { id: res.data.id } } : { name: 'Orders' }), 1000)
  } catch (e) {
    addToast('فشل إنشاء الفاتورة', 'error')
    submitting.value = false
  }
}

// Inline Customer Creation
const showCustomerModal = ref(false)
const savingCustomer = ref(false)
const newCustomer = ref({ name: '', phone: '', email: '', customer_type: 'individual', is_active: true })

const openCustomerModal = () => {
  newCustomer.value = { name: '', phone: '', email: '', customer_type: 'individual', is_active: true }
  showCustomerModal.value = true
}

const closeCustomerModal = () => {
  showCustomerModal.value = false
}

const saveNewCustomer = async () => {
  if (!newCustomer.value.name || !newCustomer.value.phone) {
    return addToast('يرجى إدخال الاسم ورقم الهاتف', 'error')
  }

  savingCustomer.value = true
  try {
    const res: any = await createCustomer(newCustomer.value)
    addToast('تم إضافة العميل بنجاح', 'success')
    
    // List refresh is not needed for autocomplete, but we might want to set the initial label
    // or just trigger the select manually. 
    // Since we are setting form.customer_id, we need to ensure the Autocomplete updates its display.
    // The Autocomplete doesn't assume we passed the object unless we emit select. 
    // Ideally, we just call onCustomerSelect with the new customer object.
    
    if (res.data?.id) {
       // We can pass the new customer object directly
       await onCustomerSelect(res.data)
    }
    
    closeCustomerModal()
  } catch (e) {
    addToast('فشل إضافة العميل', 'error')
    console.error(e)
  } finally {
    savingCustomer.value = false
  }
}
</script>

<style scoped>
</style>