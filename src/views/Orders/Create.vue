<template>
  <div class="p-6 bg-gray-50 min-h-screen" dir="rtl">
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold">إنشاء فاتورة مبيعات</h1>
          <p class="text-sm text-gray-500">أدخل بيانات الطلب وأضف العناصر.</p>
        </div>
        <div>
          <button @click="submit" :disabled="submitting" class="px-4 py-2 bg-blue-600 text-white rounded">حفظ و انشاء</button>
        </div>
      </div>

      <div class="bg-white rounded shadow p-4 mb-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label class="text-xs text-gray-500">العميل</label>
            <select v-model="form.customer_id" @change="onCustomerChange" class="w-full border rounded px-2 py-2">
              <option value="">اختر عميل</option>
              <option v-for="c in customers" :key="c.id" :value="c.id">{{ c.name }} — {{ c.phone || c.email }}</option>
            </select>
          </div>

          <div>
            <label class="text-xs text-gray-500">عنوان التوصيل</label>
            <select v-model="form.delivery_address_id" class="w-full border rounded px-2 py-2">
              <option value="">اختر عنوان</option>
              <option v-for="a in customerAddresses" :key="a.id" :value="a.id">{{ a.city }} — {{ a.area }} — {{ a.street }}</option>
            </select>
          </div>

          <div>
            <label class="text-xs text-gray-500">عنوان الفوترة</label>
            <select v-model="form.billing_address_id" class="w-full border rounded px-2 py-2">
              <option value="">اختر عنوان</option>
              <option v-for="a in customerAddresses" :key="a.id" :value="a.id">{{ a.city }} — {{ a.area }} — {{ a.street }}</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
          <div>
            <label class="text-xs text-gray-500">مصدر الطلب</label>
            <select v-model="form.source" class="w-full border rounded px-2 py-2">
              <option value="internal">internal</option>
              <option value="webstore">webstore</option>
            </select>
          </div>
          <div>
            <label class="text-xs text-gray-500">تاريخ التوصيل</label>
            <input v-model="form.delivery_date" type="date" class="w-full border rounded px-2 py-2" />
          </div>
          <div>
            <label class="text-xs text-gray-500">فترة التوصيل</label>
            <input v-model="form.delivery_time_slot" placeholder="15:00-18:00" class="w-full border rounded px-2 py-2" />
          </div>
        </div>

        <div class="mt-3">
          <label class="text-xs text-gray-500">ملاحظات</label>
          <textarea v-model="form.notes" class="w-full border rounded px-2 py-2" rows="2"></textarea>
        </div>
      </div>

      <div class="bg-white rounded shadow p-4 mb-4">
        <div class="flex items-center justify-between mb-2">
          <h3 class="font-medium">العناصر</h3>
          <button @click="addLine" class="px-3 py-1 bg-green-600 text-white rounded text-sm">إضافة بند</button>
        </div>

        <div v-for="(line, idx) in form.lines" :key="line._uid" class="border rounded p-3 mb-2">
          <div class="grid grid-cols-1 md:grid-cols-6 gap-2 items-center">
            <div class="md:col-span-2">
              <label class="text-xs text-gray-500">المنتج / المتغير</label>
              <select v-model.number="line.product_variant_id" @change="onVariantSelect(idx)" class="w-full border rounded px-2 py-2">
                <option value="">اختر متغير</option>
                <optgroup v-for="p in products" :label="p.name" :key="'g-' + p.id">
                  <option v-for="v in p.variants" :key="v.id" :value="v.id">{{ p.name }} — {{ v.sku_variant }} — {{ formatAttributes(v.attributes) }}</option>
                </optgroup>
              </select>
            </div>
            <div>
              <label class="text-xs text-gray-500">الكمية</label>
              <input v-model.number="line.quantity" type="number" min="1" class="w-full border rounded px-2 py-2" />
            </div>
            <div>
              <label class="text-xs text-gray-500">سعر الوحدة</label>
              <input v-model.number="line.unit_price" type="number" step="0.01" class="w-full border rounded px-2 py-2" />
            </div>
            <div>
              <label class="text-xs text-gray-500">خصم</label>
              <input v-model.number="line.discount_amount" type="number" step="0.01" class="w-full border rounded px-2 py-2" />
            </div>
            <div>
              <label class="text-xs text-gray-500">ملاحظات</label>
              <input v-model="line.notes" class="w-full border rounded px-2 py-2" />
            </div>
            <div class="flex items-center gap-2">
              <button @click="removeLine(idx)" class="px-3 py-1 bg-red-600 text-white rounded text-sm">حذف</button>
            </div>
          </div>
          <div class="mt-2 text-sm text-gray-600">الإجمالي للبند: {{ formatCurrency(lineTotal(line)) }}</div>
        </div>

        <div class="mt-4 text-right space-y-1">
          <div>المجموع الجزئي: {{ formatCurrency(subtotal) }}</div>
          <div>الخصم: {{ formatCurrency(form.discount_amount) }}</div>
          <div>رسوم الشحن: {{ formatCurrency(form.shipping_fee) }}</div>
          <div class="font-semibold">الإجمالي: {{ formatCurrency(grandTotal) }}</div>
        </div>
      </div>

      <div class="flex justify-between gap-2">
        <button @click="submit" :disabled="submitting" class="px-4 py-2 bg-blue-600 text-white rounded">حفظ و انشاء</button>
        <router-link to="/orders" class="px-4 py-2 border rounded">إلغاء</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { fetchCustomers } from '../../api/customers'
import { fetchProducts } from '../../api/products'
import { createOrder } from '../../api/orders'
import { fetchAddresses } from '../../api/addresses'
import { fetchCustomer } from '../../api/customers'
import { formatAttributes } from '../../utils/helpers'

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
  assigned_to: null,
  lines: []
})

const loadCustomers = async () => {
  try {
    const res = await fetchCustomers(1)
    customers.value = res?.data || []
  } catch (e) {
    console.error('Failed to load customers', e)
  }
}

const loadProducts = async () => {
  try {
    const res = await fetchProducts(1)
    products.value = res?.data || []
  } catch (e) {
    console.error('Failed to load products', e)
  }
}

const onCustomerChange = async () => {
  const id = form.value.customer_id
  customerAddresses.value = []
  form.value.delivery_address_id = null
  form.value.billing_address_id = null
  if (!id) return
  try {
    // preferred: fetch customer which may include addresses and default_address_id
    const res = await fetchCustomer(Number(id))
    const cust = res?.data || null
    if (cust?.addresses && Array.isArray(cust.addresses)) {
      customerAddresses.value = cust.addresses
    } else {
      // fallback to global addresses endpoint
      const ares = await fetchAddresses(1)
      const all = ares?.data || []
      customerAddresses.value = all.filter((a: any) => a.owner_type && a.owner_type.includes('Customer') && Number(a.owner_id) === Number(id))
    }

    // auto-select default address when available
    if (cust?.default_address_id) {
      form.value.delivery_address_id = cust.default_address_id
      form.value.billing_address_id = cust.default_address_id
    }
  } catch (e) {
    console.error('Failed to load addresses', e)
  }
}

onMounted(async () => {
  await Promise.all([loadCustomers(), loadProducts()])
  // add one empty line by default
  addLine()
})

const uid = (() => {
  let i = 1
  return () => ++i
})()

const addLine = () => {
  form.value.lines.push({ _uid: uid(), product_variant_id: null, quantity: 1, unit_price: 0, discount_amount: 0, notes: '' })
}

const removeLine = (idx: number) => {
  form.value.lines.splice(idx, 1)
}

const onVariantSelect = (idx: number) => {
  const vId = form.value.lines[idx].product_variant_id
  if (!vId) return
  // find variant sale price
  for (const p of products.value) {
    const v = (p.variants || []).find((x: any) => Number(x.id) === Number(vId))
    if (v) {
      form.value.lines[idx].unit_price = Number(v.sale_price || v.sale_price || 0)
      return
    }
  }
}

const lineTotal = (l: any) => {
  const qty = Number(l.quantity || 0)
  const unit = Number(l.unit_price || 0)
  const disc = Number(l.discount_amount || 0)
  return qty * unit - disc
}

const subtotal = computed(() => form.value.lines.reduce((sum: number, l: any) => sum + lineTotal(l), 0))
const grandTotal = computed(() => subtotal.value - Number(form.value.discount_amount || 0) + Number(form.value.shipping_fee || 0))

const formatCurrency = (val?: string | number) => {
  if (val === null || val === undefined || val === '') return '0.00'
  const num = typeof val === 'number' ? val : Number(String(val))
  if (Number.isNaN(num)) return String(val)
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(num)
}

const submit = async () => {
  // basic validation
  if (!form.value.customer_id) return alert('الرجاء اختيار عميل')
  if (!form.value.lines || form.value.lines.length === 0) return alert('أضف بندًا واحدًا على الأقل')
  for (const l of form.value.lines) {
    if (!l.product_variant_id) return alert('اختر متغيرًا لكل بند')
    if (!l.quantity || Number(l.quantity) <= 0) return alert('الكمية يجب أن تكون أكبر من صفر')
  }

  const payload: any = {
    customer_id: form.value.customer_id,
    source: form.value.source,
    discount_amount: Number(form.value.discount_amount || 0),
    shipping_fee: Number(form.value.shipping_fee || 0),
    delivery_date: form.value.delivery_date || null,
    delivery_time_slot: form.value.delivery_time_slot || null,
    notes: form.value.notes || null,
    delivery_address_id: form.value.delivery_address_id || null,
    billing_address_id: form.value.billing_address_id || null,
    assigned_to: form.value.assigned_to || null,
    lines: form.value.lines.map((l: any) => ({
      product_variant_id: l.product_variant_id,
      quantity: l.quantity,
      unit_price: Number(l.unit_price || 0),
      discount_amount: Number(l.discount_amount || 0),
      notes: l.notes || null
    }))
  }

  try {
    submitting.value = true
    const res = await createOrder(payload)
    const id = res?.data?.id
    alert('تم إنشاء الطلب')
    if (id) router.push({ name: 'OrderDetails', params: { id } })
    else router.push({ name: 'Orders' })
  } catch (e) {
    console.error('Failed to create order', e)
    alert('فشل إنشاء الطلب')
  } finally {
    submitting.value = false
  }
}

</script>

<style scoped>
</style>
