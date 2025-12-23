<template>
  <div class="p-6 bg-gray-50 min-h-screen" dir="rtl">
    <div class="max-w-5xl mx-auto space-y-6">
      <!-- Toast -->
      <div v-if="toast.visible" 
           :class="['fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg text-white text-sm',
                    toast.type === 'success' ? 'bg-green-600' : 'bg-gray-700']">
        {{ toast.message }}
      </div>

      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900">إنشاء فاتورة مبيعات</h1>
          <p class="text-sm text-gray-500 mt-1">أدخل بيانات الطلب</p>
        </div>
      </div>

      <!-- Quick Add -->
      <MCard title="إضافة سريعة بالباركود">
        <div class="p-4">
          <VariantAutocomplete @select="addVariantLine" placeholder="ابحث عن المنتج (SKU أو الاسم)..." />
        </div>
      </MCard>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Customer & Delivery -->
        <div class="lg:col-span-2 space-y-6">
          <MCard title="بيانات العميل">
            <div class="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">العميل <span class="text-red-500">*</span></label>
                <select v-model="form.customer_id" @change="onCustomerChange" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500">
                  <option value="">اختر عميلاً</option>
                  <option v-for="c in customers" :key="c.id" :value="c.id">{{ c.name }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">المصدر</label>
                <select v-model="form.source" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500">
                  <option value="internal">داخلي</option>
                  <option value="webstore">متجر إلكتروني</option>
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
              <div class="flex justify-between text-sm items-center">
                <span class="text-gray-500">الشحن</span>
                <input v-model.number="form.shipping_fee" type="number" min="0" step="0.01" class="w-20 px-2 py-1 border border-gray-200 rounded text-left text-sm" />
              </div>
              <div class="border-t pt-3 flex justify-between">
                <span class="font-semibold text-gray-900">الإجمالي</span>
                <span class="font-bold text-lg text-gray-900">{{ formatCurrency(grandTotal) }}</span>
              </div>
            </div>
          </MCard>
        </div>
      </div>

      <!-- Order Items -->
      <MCard title="عناصر الفاتورة">
        <div class="p-4">
          <div class="flex justify-end mb-4">
            <MButton variant="primary" size="sm" @click="addLine">+ إضافة بند</MButton>
          </div>

          <div v-if="form.lines.length === 0" class="text-center py-8 text-gray-400">
            لا توجد منتجات. استخدم البحث أو الزر أعلاه لإضافة منتجات.
          </div>

          <div v-else class="space-y-3">
            <div v-for="(line, idx) in form.lines" :key="line._uid" class="border border-gray-100 rounded-lg p-4">
              <div class="flex justify-between items-start mb-3">
                <span class="text-sm font-medium text-gray-700">
                  {{ line.product_name || `البند #${idx + 1}` }}
                  <span v-if="line.product_sku" class="text-gray-400">— {{ line.product_sku }}</span>
                </span>
                <button @click="removeLine(idx)" class="text-red-500 hover:text-red-700 text-sm">حذف</button>
              </div>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div class="col-span-2">
                  <label class="block text-xs text-gray-500 mb-1">المنتج</label>
                  <VariantAutocomplete 
                    v-model="line.product_variant_id" 
                    :selected-label="line.product_name || ''"
                    @select="(v) => onVariantSelected(idx, v)" 
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

      <!-- Actions -->
      <div class="flex justify-end gap-3">
        <router-link to="/orders">
          <MButton variant="secondary">إلغاء</MButton>
        </router-link>
        <MButton variant="primary" @click="submit" :loading="submitting">
          {{ submitting ? 'جاري الحفظ...' : 'إنشاء الفاتورة' }}
        </MButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { fetchCustomers, fetchCustomer } from '../../api/customers'
import { fetchProducts } from '../../api/products'
import { createOrder } from '../../api/orders'
import { fetchAddresses } from '../../api/addresses'
import VariantAutocomplete from '../../components/VariantAutocomplete.vue'
import MButton from '../../components/ui/MButton.vue'
import MCard from '../../components/ui/MCard.vue'

const router = useRouter()
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

const toast = ref<{ visible: boolean; message: string; type: string }>({ visible: false, message: '', type: 'success' })

const showToast = (message: string, type = 'success', ms = 2500) => {
  toast.value = { visible: true, message, type }
  setTimeout(() => { toast.value.visible = false }, ms)
}

const loadCustomers = async () => {
  try {
    const res = await fetchCustomers(1)
    customers.value = res?.data || []
  } catch (e) { console.error(e) }
}

const loadProducts = async () => {
  try {
    const res = await fetchProducts(1)
    products.value = res?.data || []
  } catch (e) { console.error(e) }
}

const onCustomerChange = async () => {
  const id = form.value.customer_id
  customerAddresses.value = []
  form.value.delivery_address_id = null
  if (!id) return
  try {
    const res = await fetchCustomer(Number(id))
    const cust = res?.data || null
    if (cust?.addresses) customerAddresses.value = cust.addresses
    else {
      const ares = await fetchAddresses()
      customerAddresses.value = (ares || []).filter((a: any) => a.owner_type?.includes('Customer') && Number(a.owner_id) === Number(id))
    }
    if (cust?.default_address_id) form.value.delivery_address_id = cust.default_address_id
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
  form.value.lines[idx].product_name = v.product?.name || v.name || 'المنتج'
  form.value.lines[idx].product_sku = v.sku_variant || ''
}

const addVariantLine = (v: any) => {
  if (!v) return
  form.value.lines.push({ _uid: uid(), product_variant_id: v.id, quantity: 1, unit_price: Number(v.sale_price || 0), discount_amount: 0, notes: '', product_name: v.product?.name || v.name || '', product_sku: v.sku_variant || '' })
  showToast(`تمت إضافة: ${v.product?.name || v.name}`)
}

const lineTotal = (l: any) => (Number(l.quantity || 0) * Number(l.unit_price || 0)) - Number(l.discount_amount || 0)
const subtotal = computed(() => form.value.lines.reduce((s: number, l: any) => s + lineTotal(l), 0))
const grandTotal = computed(() => subtotal.value - Number(form.value.discount_amount || 0) + Number(form.value.shipping_fee || 0))

const formatCurrency = (val?: number) => {
  if (val == null) return '0.00 د.ل'
  return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(val) + ' د.ل'
}

const submit = async () => {
  if (!form.value.customer_id) return showToast('اختر عميل', 'error')
  if (!form.value.lines.length) return showToast('أضف بند واحد على الأقل', 'error')
  for (const l of form.value.lines) {
    if (!l.product_variant_id) return showToast('اختر منتج لكل بند', 'error')
  }
  try {
    submitting.value = true
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
    showToast('تم إنشاء الفاتورة', 'success')
    setTimeout(() => router.push(res?.data?.id ? { name: 'OrderDetails', params: { id: res.data.id } } : { name: 'Orders' }), 1000)
  } catch (e) {
    console.error(e)
    showToast('فشل إنشاء الفاتورة', 'error')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
</style>