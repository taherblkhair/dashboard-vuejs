<template>
  <div class="p-6 bg-gray-50 min-h-screen" dir="rtl">
    <div class="max-w-5xl mx-auto space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900">إنشاء طلب شراء</h1>
          <p class="text-sm text-gray-500 mt-1">أدخل بيانات طلب الشراء من المورد</p>
        </div>
      </div>

      <!-- Quick Add (if needed, but keeping original flow) -->
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Supplier & Info -->
        <div class="lg:col-span-2 space-y-6">
          <MCard title="بيانات المورد والطلب">
            <div class="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">المورد <span class="text-red-500">*</span></label>
                <select 
                  v-model.number="form.supplier_id" 
                  class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                  :class="{'border-red-500': errors.supplier_id}"
                >
                  <option value="">اختر المورد</option>
                  <option v-for="s in suppliers" :key="s.id" :value="s.id">{{ s.name }}</option>
                </select>
                <p v-if="errors.supplier_id" class="mt-1 text-xs text-red-600">{{ errors.supplier_id }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">تاريخ الطلب <span class="text-red-500">*</span></label>
                <input 
                  v-model="form.order_date" 
                  type="date" 
                  class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                  :class="{'border-red-500': errors.order_date}"
                />
                <p v-if="errors.order_date" class="mt-1 text-xs text-red-600">{{ errors.order_date }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">تاريخ التوصيل المتوقع <span class="text-red-500">*</span></label>
                <input 
                  v-model="form.expected_delivery_date" 
                  type="date" 
                  class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                  :class="{'border-red-500': errors.expected_delivery_date}"
                />
                <p v-if="errors.expected_delivery_date" class="mt-1 text-xs text-red-600">{{ errors.expected_delivery_date }}</p>
              </div>
            </div>
          </MCard>

          <!-- Order Items -->
          <MCard title="عناصر الطلب">
            <div class="p-4 space-y-4">
              <div class="flex justify-end">
                <MButton variant="secondary" size="sm" @click="addLine">+ إضافة بند</MButton>
              </div>

              <div v-if="form.lines.length === 0" class="text-center py-12 text-gray-400">
                لا توجد عناصر مضافة. اضغط على الزر أعلاه لإضافة عناصر الجملة.
              </div>

              <div v-else class="space-y-4">
                <div v-for="(line, idx) in form.lines" :key="line._uid" class="border border-gray-100 rounded-xl p-4 space-y-4">
                  <div class="flex justify-between items-center">
                    <span class="text-sm font-medium text-gray-700">البند #{{ idx + 1 }} {{ line.product_name ? `(${line.product_name})` : '' }}</span>
                    <button @click="removeLine(idx)" class="text-red-500 hover:text-red-700 text-sm" :disabled="form.lines.length <= 1">حذف</button>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-xs text-gray-500 mb-1">المنتج</label>
                      <ProductAutocomplete
                        v-model="line.product_id"
                        @select="(p) => onProductSelected(idx, p)"
                        @select-all="(p) => addAllVariants(idx, p)"
                      />
                    </div>
                    <div>
                      <label class="block text-xs text-gray-500 mb-1">المتغير</label>
                      <select 
                        v-model.number="line.product_variant_id"
                        class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm disabled:bg-gray-50"
                        :disabled="!line.product_id || variantsForLine(idx).length === 0"
                      >
                        <option value="">اختر المتغير</option>
                        <option v-for="v in variantsForLine(idx)" :key="v.id" :value="v.id">
                          {{ v.sku_variant || v.sku || 'بدون SKU' }} — {{ formatAttributes(v.attributes) }}
                        </option>
                      </select>
                    </div>
                  </div>

                  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label class="block text-xs text-gray-500 mb-1">الكمية</label>
                      <input v-model.number="line.quantity_ordered" type="number" min="1" class="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm" />
                    </div>
                    <div>
                      <label class="block text-xs text-gray-500 mb-1">سعر الوحدة</label>
                      <input v-model.number="line.unit_price" type="number" step="0.01" min="0" class="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-mono" />
                    </div>
                    <div>
                      <label class="block text-xs text-gray-500 mb-1">تاريخ الانتهاء</label>
                      <input v-model="line.expiry_date" type="date" class="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm" />
                    </div>
                    <div class="flex items-end justify-end">
                      <div class="text-right">
                        <p class="text-[10px] text-gray-400 uppercase">الإجمالي</p>
                        <p class="font-bold text-primary-600">{{ formatCurrency(line.quantity_ordered * line.unit_price) }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </MCard>

          <MCard title="ملاحظات">
            <div class="p-4">
              <textarea v-model="form.notes" rows="3" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm" placeholder="أضف أي ملاحظات إضافية هنا..."></textarea>
            </div>
          </MCard>
        </div>

        <!-- Sidebar Summary -->
        <div class="space-y-6">
          <MCard title="ملخص الطلب" class="sticky top-6">
            <div class="p-4 space-y-4">
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">عدد بنود الطلب</span>
                <span class="font-medium text-gray-900">{{ form.lines.length }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">إجمالي الكميات</span>
                <span class="font-medium text-gray-900">{{ totalQuantity }}</span>
              </div>
              <div class="border-t border-gray-100 pt-4 flex justify-between items-end">
                <span class="text-sm font-semibold text-gray-700">المبلغ الإجمالي</span>
                <span class="text-xl font-bold text-gray-900">{{ formatCurrency(totalAmount) }}</span>
              </div>
              
              <div class="pt-4 space-y-3">
                <MButton variant="primary" class="w-full" @click="submit" :loading="loading">
                  إرسال طلب الشراء
                </MButton>
                <MButton variant="secondary" class="w-full" @click="$router.back()">
                  إلغاء
                </MButton>
              </div>
            </div>
          </MCard>
          
          <div v-if="Object.keys(errors).length > 0" class="p-4 bg-red-50 rounded-lg border border-red-100">
            <p class="text-xs text-red-700 font-medium mb-1">يرجى تصحيح الأخطاء التالية:</p>
            <ul class="list-disc list-inside text-[11px] text-red-600 space-y-0.5">
              <li v-for="(err, key) in errors" :key="key">{{ err }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { fetchSuppliers } from '../../api/suppliers'
import { fetchProducts } from '../../api/products'
import { createPurchaseOrder } from '../../api/purchaseOrders'
import { formatAttributes } from '../../utils/helpers'
import ProductAutocomplete from '../../components/ProductAutocomplete.vue'
import MButton from '../../components/ui/MButton.vue'
import MCard from '../../components/ui/MCard.vue'

const router = useRouter()
const suppliers = ref<any[]>([])
const products = ref<any[]>([])
const loading = ref(false)

const form = reactive<any>({
  supplier_id: null,
  order_date: new Date().toISOString().split('T')[0],
  expected_delivery_date: '',
  notes: '',
  lines: []
})

const errors = reactive<any>({})

const totalQuantity = computed(() => form.lines.reduce((sum: number, line: any) => sum + (Number(line.quantity_ordered) || 0), 0))
const totalAmount = computed(() => form.lines.reduce((sum: number, line: any) => sum + (Number(line.quantity_ordered || 0) * Number(line.unit_price || 0)), 0))

const uid = (() => { let i = 0; return () => `uid-${++i}-${Date.now()}` })()

const addLine = () => {
  form.lines.push({ 
    _uid: uid(), 
    product_id: null, 
    product_variant_id: null, 
    quantity_ordered: 1, 
    unit_price: 0, 
    expiry_date: '', 
    notes: '',
    product_name: null
  })
}

const removeLine = (idx: number) => {
  if (form.lines.length > 1) {
    form.lines.splice(idx, 1)
  }
}

const variantsForLine = (idx: number) => {
  const line = form.lines[idx]
  if (!line || !line.product_id) return []
  const prod = products.value.find((p: any) => p.id === line.product_id)
  return prod?.variants || []
}

const onProductSelected = (idx: number, product: any) => {
  if (!product) return
  form.lines[idx].product_id = product.id
  form.lines[idx].product_name = product.name || null
  const v = product.variants || []
  form.lines[idx].product_variant_id = v.length > 0 ? v[0].id : null
  form.lines[idx].unit_price = v.length > 0 ? (v[0].cost_price || 0) : 0
}

const addAllVariants = (idx: number, product: any) => {
  if (!product || !product.variants?.length) return
  
  const variants = product.variants
  // Update current line
  form.lines[idx].product_id = product.id
  form.lines[idx].product_name = product.name
  form.lines[idx].product_variant_id = variants[0].id
  form.lines[idx].unit_price = variants[0].cost_price || 0

  // Add remaining
  const moreLines = variants.slice(1).map((v: any) => ({
    _uid: uid(),
    product_id: product.id,
    product_name: product.name,
    product_variant_id: v.id,
    quantity_ordered: 1,
    unit_price: v.cost_price || 0,
    expiry_date: '',
    notes: ''
  }))
  form.lines.splice(idx + 1, 0, ...moreLines)
}

const formatCurrency = (val?: number) => {
  if (val == null) return '0.00 د.ل'
  return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(val) + ' د.ل'
}

const validate = () => {
  Object.keys(errors).forEach(k => delete errors[k])
  let ok = true
  if (!form.supplier_id) { errors.supplier_id = 'المورد مطلوب'; ok = false }
  if (!form.order_date) { errors.order_date = 'تاريخ الطلب مطلوب'; ok = false }
  if (!form.expected_delivery_date) { errors.expected_delivery_date = 'تاريخ التوصيل مطلوب'; ok = false }
  
  form.lines.forEach((l: any, i: number) => {
    if (!l.product_variant_id) { errors[`line_${i}`] = `البند ${i+1}: المنتج مطلوب`; ok = false }
    if (l.quantity_ordered <= 0) { errors[`line_qty_${i}`] = `البند ${i+1}: الكمية يجب أن تكون أكبر من 0`; ok = false }
  })
  return ok
}

const submit = async () => {
  if (!validate()) return
  loading.value = true
  try {
    const payload = {
      ...form,
      lines: form.lines.map((l: any) => ({
        product_variant_id: l.product_variant_id,
        quantity_ordered: l.quantity_ordered,
        unit_price: l.unit_price,
        expiry_date: l.expiry_date || null,
        notes: l.notes || null
      }))
    }
    const res = await createPurchaseOrder(payload)
    const id = res?.data?.id || res?.id
    router.push(id ? { name: 'PurchaseOrderDetails', params: { id } } : { name: 'PurchaseOrders' })
  } catch (e: any) {
    console.error(e)
    alert(e?.response?.data?.message || 'فشل في إنشاء الطلب')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  loading.value = true
  try {
    const [s, p] = await Promise.all([fetchSuppliers(), fetchProducts()])
    suppliers.value = s?.data || s || []
    products.value = p?.data || p || []
    if (!form.lines.length) addLine()
  } catch (e) { console.error(e) }
  finally { loading.value = false }
})
</script>

<style scoped>
</style>