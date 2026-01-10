<template>
  <div class="p-6 bg-gray-50 min-h-screen" dir="rtl">
    <div class="max-w-5xl mx-auto space-y-6">
      <!-- Toast removed, using global toaster -->

      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900">تعديل الطلب #{{ orderId }}</h1>
          <p class="text-sm text-gray-500 mt-1">تحديث بيانات الطلب</p>
        </div>
      </div>

      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Customer & Delivery -->
        <div class="lg:col-span-2 space-y-6">
          <MCard title="بيانات العميل">
            <div class="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">العميل <span class="text-red-500">*</span></label>
                <select v-model="form.customer_id" @change="() => onCustomerChange()" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500">
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
                <label class="block text-sm font-medium text-gray-700 mb-1">الموظف المسئول</label>
                <select v-model="form.assigned_to" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500">
                  <option :value="null">لم يتم التعيين</option>
                  <option v-for="u in users" :key="u.id" :value="u.id">{{ u.name }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">تاريخ التوصيل</label>
                <input v-model="form.delivery_date" type="date" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500" />
              </div>
            </div>
          </MCard>

          <!-- Order Items -->
          <MCard title="عناصر الفاتورة">
            <div class="p-4">
              <div class="flex justify-end mb-4">
                <MButton variant="primary" size="sm" @click="addLine">+ إضافة بند</MButton>
              </div>

              <div v-if="form.lines.length === 0" class="text-center py-8 text-gray-400">
                لا توجد أصناف. استخدم البحث أو الزر أعلاه لإضافة أصناف.
              </div>

              <div v-else class="space-y-3">
                <div v-for="(line, idx) in form.lines" :key="line._uid" class="border border-gray-100 rounded-lg p-4">
                  <div class="flex justify-between items-start mb-3">
                    <span class="text-sm font-medium text-gray-700">
                      {{ line.product_name || `البند #${Number(idx) + 1}` }}
                      <span v-if="line.product_sku" class="text-gray-400">— {{ line.product_sku }}</span>
                    </span>
                    <button @click="removeLine(Number(idx))" type="button" class="text-red-500 hover:text-red-700 text-sm">حذف</button>
                  </div>
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div class="col-span-2">
                      <label class="block text-xs text-gray-500 mb-1">المنتج</label>
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
            <div class="p-4 space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">ملاحظات العميل</label>
                <textarea v-model="form.notes" rows="2" placeholder="ملاحظات للعميل..." class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">ملاحظات داخلية</label>
                <textarea v-model="form.internal_notes" rows="2" placeholder="ملاحظات داخلية..." class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"></textarea>
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

          <!-- Actions -->
          <div class="mt-6 space-y-3">
            <MButton variant="primary" class="w-full" @click="submit" :loading="submitting">
              {{ submitting ? 'جاري الحفظ...' : 'حفظ التغييرات' }}
            </MButton>
            <router-link :to="{ name: 'OrderDetails', params: { id: orderId } }" class="block">
              <MButton variant="secondary" class="w-full">إلغاء</MButton>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { fetchCustomers, fetchCustomer } from '../../api/customers'
import { fetchOrder, updateOrder } from '../../api/orders'
import { fetchUsers } from '../../api/users'
import VariantAutocomplete from '../../components/VariantAutocomplete.vue'
import MButton from '../../components/ui/MButton.vue'
import MCard from '../../components/ui/MCard.vue'
import { formatCurrency } from '../../utils/helpers'
import { useToast } from '../../composables/useToast'

const router = useRouter()
const route = useRoute()
const orderId = Number(route.params.id)
const { addToast } = useToast()

const customers = ref<any[]>([])
const users = ref<any[]>([])
const customerAddresses = ref<any[]>([])
const submitting = ref(false)
const loading = ref(true)

const form = ref<any>({
  customer_id: null,
  source: 'internal',
  discount_amount: 0,
  shipping_fee: 0,
  delivery_date: '',
  delivery_time_slot: '',
  notes: '',
  internal_notes: '',
  delivery_address_id: null,
  billing_address_id: null,
  assigned_to: null,
  lines: []
})

const uid = (() => { let i = 0; return () => ++i })()

const loadOrder = async () => {
  try {
    loading.value = true
    const res = await fetchOrder(orderId)
    const order = res?.data
    if (order) {
      form.value = {
        customer_id: order.customer_id,
        source: order.source || 'internal',
        discount_amount: order.discount_amount || 0,
        shipping_fee: order.shipping_fee || 0,
        delivery_date: order.delivery_date || '',
        delivery_time_slot: order.delivery_time_slot || '',
        notes: order.notes || '',
        internal_notes: order.internal_notes || '',
        delivery_address_id: order.delivery_address_id,
        billing_address_id: order.billing_address_id,
        assigned_to: order.assigned_to,
        lines: (order.lines || []).map((l: any) => ({
          _uid: uid(),
          id: l.id,
          product_variant_id: l.product_variant_id,
          quantity: l.quantity,
          unit_price: l.unit_price,
          discount_amount: l.discount_amount || 0,
          notes: l.notes || '',
          product_name: l.product_variant?.product?.name || l.product_variant?.name || 'المنتج',
          product_sku: l.product_variant?.sku_variant || ''
        }))
      }
      if (order.customer_id) {
        await onCustomerChange(false)
      }
    }
  } catch (e) {
    addToast('فشل تحميل بيانات الطلب', 'error')
  } finally {
    loading.value = false
  }
}

const loadCustomers = async () => {
  try {
    const res = await fetchCustomers(1)
    customers.value = res?.data || []
  } catch (e) { addToast('فشل تحميل العملاء', 'error') }
}

const loadUsers = async () => {
  try {
    const res = await fetchUsers(1)
    users.value = res?.data || []
  } catch (e) { addToast('فشل تحميل المستخدمين', 'error') }
}

const onCustomerChange = async (resetAddress = true) => {
  const id = form.value.customer_id
  customerAddresses.value = []
  if (resetAddress === true) form.value.delivery_address_id = null
  if (!id) return
  try {
    const res = await fetchCustomer(Number(id))
    const cust = res?.data || null
    if (cust?.addresses) customerAddresses.value = cust.addresses
  } catch (e) { console.error(e) }
}

onMounted(async () => {
  await Promise.all([loadCustomers(), loadUsers(), loadOrder()])
})

const addLine = () => {
  form.value.lines.push({ 
    _uid: uid(), 
    product_variant_id: null, 
    quantity: 1, 
    unit_price: 0, 
    discount_amount: 0, 
    notes: '', 
    product_name: null, 
    product_sku: '' 
  })
}

const removeLine = (idx: number) => form.value.lines.splice(idx, 1)

const onVariantSelected = (idx: number, v: any) => {
  if (!v) return
  form.value.lines[idx].product_variant_id = v.id
  form.value.lines[idx].unit_price = Number(v.sale_price || 0)
  form.value.lines[idx].product_name = v.product?.name || v.name || 'المنتج'
  form.value.lines[idx].product_sku = v.sku_variant || ''
}

const lineTotal = (l: any) => (Number(l.quantity || 0) * Number(l.unit_price || 0)) - Number(l.discount_amount || 0)
const subtotal = computed(() => form.value.lines.reduce((s: number, l: any) => s + lineTotal(l), 0))
const grandTotal = computed(() => subtotal.value - Number(form.value.discount_amount || 0) + Number(form.value.shipping_fee || 0))

const submit = async () => {
  if (!form.value.customer_id) return addToast('اختر عميل', 'error')
  if (!form.value.lines.length) return addToast('أضف بند واحد على الأقل', 'error')
  for (const l of form.value.lines) {
    if (!l.product_variant_id) return addToast('اختر منتج لكل بند', 'error')
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
      internal_notes: form.value.internal_notes || null,
      delivery_address_id: form.value.delivery_address_id || null,
      billing_address_id: form.value.billing_address_id || null,
      assigned_to: form.value.assigned_to || null,
      lines: form.value.lines.map((l: any) => {
        const line: any = {
          product_variant_id: l.product_variant_id,
          quantity: l.quantity,
          unit_price: Number(l.unit_price || 0),
          discount_amount: Number(l.discount_amount || 0),
          notes: l.notes || null
        }
        if (l.id) line.id = l.id
        return line
      })
    }
    await updateOrder(orderId, payload)
    addToast('تم تحديث الطلب بنجاح', 'success')
    setTimeout(() => router.push({ name: 'OrderDetails', params: { id: orderId } }), 1000)
  } catch (e) {
    addToast('فشل تحديث الطلب', 'error')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
</style>
