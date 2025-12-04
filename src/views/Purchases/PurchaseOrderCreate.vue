<template>
  <div class="p-6 bg-gray-50 min-h-screen" dir="rtl">
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold">إنشاء طلب شراء جديد</h1>
          <p class="text-sm text-gray-500">أدخل بيانات طلب الشراء وأضاف العناصر المطلوبة.</p>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-4">
        <form @submit.prevent="submit">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm text-gray-600">المورد</label>
              <select v-model.number="form.supplier_id" class="w-full mt-1 p-2 border rounded bg-white">
                <option value="">اختر المورد</option>
                <option v-for="s in suppliers" :key="s.id" :value="s.id">{{ s.name }}</option>
              </select>
            </div>

            <div>
              <label class="text-sm text-gray-600">تاريخ الطلب</label>
              <input v-model="form.order_date" type="date" class="w-full mt-1 p-2 border rounded" />
            </div>

            <div>
              <label class="text-sm text-gray-600">تاريخ التوصيل المتوقع</label>
              <input v-model="form.expected_delivery_date" type="date" class="w-full mt-1 p-2 border rounded" />
            </div>

            <div>
              <label class="text-sm text-gray-600">ملاحظات</label>
              <input v-model="form.notes" type="text" class="w-full mt-1 p-2 border rounded" />
            </div>
          </div>

          <div class="mt-6">
            <h3 class="font-semibold mb-2">العناصر</h3>

            <div v-for="(line, idx) in form.lines" :key="line._uid" class="mb-3 p-3 border rounded bg-gray-50">
              <div class="flex justify-between items-center mb-2">
                <div class="text-sm font-medium">العنصر {{ idx + 1 }}</div>
                <div>
                  <button type="button" @click="removeLine(idx)" class="px-2 py-1 bg-red-500 text-white rounded text-xs">حذف</button>
                </div>
              </div>

              <div class="grid grid-cols-3 gap-3">
                <div>
                  <label class="text-xs text-gray-600">المنتج</label>
                  <select v-model.number="line.product_id" @change="onProductChange(idx)" class="w-full mt-1 p-2 border rounded bg-white text-sm">
                    <option value="">اختر المنتج</option>
                    <option v-for="p in products" :key="p.id" :value="p.id">{{ p.name }}</option>
                  </select>
                </div>

                <div>
                  <label class="text-xs text-gray-600">المتغير (variant)</label>
                  <select v-model.number="line.product_variant_id" class="w-full mt-1 p-2 border rounded bg-white text-sm">
                    <option value="">اختر المتغير</option>
                    <option v-for="v in variantsForLine(idx)" :key="v.id" :value="v.id">{{ v.sku_variant }} - {{ formatAttributes(v.attributes) }}</option>
                  </select>
                </div>

                <div>
                  <label class="text-xs text-gray-600">الكمية</label>
                  <input v-model.number="line.quantity_ordered" type="number" min="0" class="w-full mt-1 p-2 border rounded text-sm" />
                </div>

                <div>
                  <label class="text-xs text-gray-600">سعر الوحدة</label>
                  <input v-model.number="line.unit_price" type="number" step="0.01" class="w-full mt-1 p-2 border rounded text-sm" />
                </div>

                <div>
                  <label class="text-xs text-gray-600">تاريخ الانتهاء</label>
                  <input v-model="line.expiry_date" type="date" class="w-full mt-1 p-2 border rounded text-sm" />
                </div>

                <div>
                  <label class="text-xs text-gray-600">ملاحظات</label>
                  <input v-model="line.notes" type="text" class="w-full mt-1 p-2 border rounded text-sm" />
                </div>
              </div>
            </div>

            <div>
              <button type="button" @click="addLine" class="px-3 py-2 bg-blue-600 text-white rounded">إضافة عنصر</button>
            </div>
          </div>

          <div class="mt-6 flex justify-end gap-2">
            <button type="button" @click="$router.back()" class="px-4 py-2 border rounded">إلغاء</button>
            <button type="submit" class="px-4 py-2 bg-green-600 text-white rounded">حفظ وإنشاء</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { fetchSuppliers } from '../../api/suppliers'
import { fetchProducts } from '../../api/products'
import { createPurchaseOrder } from '../../api/purchaseOrders'
import { formatAttributes } from '../../utils/helpers'

const router = useRouter()
const suppliers = ref<any[]>([])
const products = ref<any[]>([])
const loading = ref(false)

const form = ref<any>({
  supplier_id: null,
  order_date: '',
  expected_delivery_date: '',
  notes: '',
  lines: [] as any[]
})

const addLine = () => {
  form.value.lines.push({ _uid: Date.now() + Math.random(), product_id: null, product_variant_id: null, quantity_ordered: 0, unit_price: 0, expiry_date: '', notes: '' })
}

const removeLine = (idx: number) => {
  form.value.lines.splice(idx, 1)
}

const variantsForLine = (idx: number) => {
  const line = form.value.lines[idx]
  if (!line || !line.product_id) return []
  const prod = products.value.find((p: any) => p.id === line.product_id)
  return prod?.variants || []
}

const onProductChange = (idx: number) => {
  const v = variantsForLine(idx)
  if (v && v.length) {
    form.value.lines[idx].product_variant_id = v[0].id
  } else {
    form.value.lines[idx].product_variant_id = null
  }
}

onMounted(async () => {
  loading.value = true
  try {
    const sp = await fetchSuppliers()
    suppliers.value = sp?.data || []
  } catch (e) { console.error('Failed to load suppliers', e) }

  try {
    const pr = await fetchProducts(1)
    products.value = pr?.data || []
  } catch (e) { console.error('Failed to load products', e) }

  // start with one empty line
  addLine()
  loading.value = false
})

const submit = async () => {
  // basic validation
  if (!form.value.supplier_id) return alert('اختر المورد')
  if (!form.value.order_date) return alert('حدد تاريخ الطلب')
  if (!form.value.expected_delivery_date) return alert('حدد تاريخ التوصيل المتوقع')
  if (!form.value.lines.length) return alert('أضف على الأقل عنصرًا واحدًا')

  // prepare payload
  const payload: any = {
    supplier_id: Number(form.value.supplier_id),
    order_date: form.value.order_date,
    expected_delivery_date: form.value.expected_delivery_date,
    notes: form.value.notes || null,
    lines: form.value.lines.map((l: any) => ({
      product_variant_id: Number(l.product_variant_id),
      quantity_ordered: Number(l.quantity_ordered),
      unit_price: Number(l.unit_price),
      expiry_date: l.expiry_date || null,
      notes: l.notes || null
    }))
  }

  try {
    const res = await createPurchaseOrder(payload)
    alert('تم إنشاء طلب الشراء')
    // navigate to details of created order if API returns id
    const id = res?.data?.id || (res?.id)
    if (id) router.push({ name: 'PurchaseOrderDetails', params: { id } })
    else router.push({ name: 'PurchaseOrders' })
  } catch (e) {
    console.error('Failed to create purchase order', e)
    alert('فشل إنشاء طلب الشراء')
  }
}
</script>

<style scoped>
</style>
