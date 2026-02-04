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

          <!-- Order Items - New Bulk Entry UI -->
          <MCard title="عناصر الطلب">
            <div class="p-4 space-y-6">
              <!-- Add Product Button -->
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-500">{{ productGroups.length }} صنف مضاف</span>
                <MButton variant="primary" size="sm" @click="showProductSearch = true">
                  <template #icon>
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                    </svg>
                  </template>
                  إضافة صنف
                </MButton>
              </div>

              <!-- Empty State -->
              <div v-if="productGroups.length === 0" class="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <svg class="w-12 h-12 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                </svg>
                <p class="text-gray-500 mb-4">لا توجد أصناف مضافة</p>
                <MButton variant="secondary" @click="showProductSearch = true">إضافة صنف جديد</MButton>
              </div>

              <!-- Product Groups -->
              <div v-else class="space-y-6">
                <div v-for="(group, gIdx) in productGroups" :key="group.product_id" 
                     class="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                  
                  <!-- Product Header -->
                  <div class="bg-gradient-to-l from-primary-50 to-white px-5 py-4 border-b border-gray-100">
                    <div class="flex justify-between items-center">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                          <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                          </svg>
                        </div>
                        <div>
                          <h3 class="font-semibold text-gray-900">{{ group.product_name }}</h3>
                          <p class="text-xs text-gray-500">{{ group.variants.length }} متغير</p>
                        </div>
                      </div>
                      <button @click="removeProductGroup(gIdx)" class="text-red-500 hover:text-red-700 text-sm hover:bg-red-50 px-3 py-1 rounded-lg transition-colors">
                        حذف الصنف
                      </button>
                    </div>
                  </div>

                  <!-- Bulk Controls -->
                  <div class="px-5 py-4 bg-gray-50 border-b border-gray-100">
                    <div class="flex flex-wrap items-end gap-4">
                      <div class="flex-1 min-w-[120px]">
                        <label class="block text-xs font-medium text-gray-600 mb-1">سعر موحد</label>
                        <input 
                          v-model.number="group.bulkPrice" 
                          type="number" 
                          step="0.01" 
                          min="0"
                          placeholder="0.00"
                          class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      <div class="flex-1 min-w-[100px]">
                        <label class="block text-xs font-medium text-gray-600 mb-1">كمية موحدة</label>
                        <input 
                          v-model.number="group.bulkQuantity" 
                          type="number" 
                          min="1"
                          placeholder="1"
                          class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      <MButton variant="secondary" size="sm" @click="applyBulkToGroup(gIdx)">
                        تطبيق على الكل
                      </MButton>
                    </div>
                  </div>

                  <!-- Variants Grid -->
                  <div class="p-5">
                    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      <div v-for="(variant, vIdx) in group.variants" :key="variant._uid"
                           class="bg-gray-50 rounded-xl p-3 border border-gray-100 hover:border-primary-200 transition-colors">
                        
                        <!-- Variant Info -->
                        <div class="flex justify-between items-start mb-3">
                          <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium text-gray-800 truncate">{{ formatAttributes(variant.attributes) || 'افتراضي' }}</p>
                            <p class="text-[10px] text-gray-400 font-mono">{{ variant.sku_variant || variant.sku || '—' }}</p>
                          </div>
                          <button 
                            @click="removeVariant(gIdx, vIdx)" 
                            class="text-gray-400 hover:text-red-500 p-1 -mt-1 -ml-1 rounded transition-colors"
                            title="حذف المتغير"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                          </button>
                        </div>

                        <!-- Editable Fields -->
                        <div class="space-y-2">
                          <div>
                            <label class="block text-[10px] text-gray-500 mb-0.5">الكمية</label>
                            <input 
                              v-model.number="variant.quantity_ordered" 
                              type="number" 
                              min="1"
                              class="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm text-center focus:ring-2 focus:ring-primary-500"
                            />
                          </div>
                          <div>
                            <label class="block text-[10px] text-gray-500 mb-0.5">السعر</label>
                            <input 
                              v-model.number="variant.unit_price" 
                              type="number" 
                              step="0.01"
                              min="0"
                              class="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm text-center font-mono focus:ring-2 focus:ring-primary-500"
                            />
                          </div>
                        </div>

                        <!-- Line Total -->
                        <div class="mt-3 pt-2 border-t border-gray-200 text-center">
                          <span class="text-xs text-gray-500">الإجمالي</span>
                          <p class="text-sm font-bold text-primary-600">{{ formatCurrency(variant.quantity_ordered * variant.unit_price, 2) }}</p>
                        </div>
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
                <span class="text-gray-500">عدد الأصناف</span>
                <span class="font-medium text-gray-900">{{ productGroups.length }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">عدد المتغيرات</span>
                <span class="font-medium text-gray-900">{{ totalVariants }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">إجمالي الكميات</span>
                <span class="font-medium text-gray-900">{{ totalQuantity }}</span>
              </div>
              <div class="border-t border-gray-100 pt-4 flex justify-between items-end">
                <span class="text-sm font-semibold text-gray-700">المبلغ الإجمالي</span>
                <span class="text-xl font-bold text-gray-900">{{ formatCurrency(totalAmount, 2) }}</span>
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

    <!-- Product Search Modal -->
    <div v-if="showProductSearch" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="showProductSearch = false">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-hidden">
        <div class="p-4 border-b border-gray-100">
          <div class="flex justify-between items-center mb-3">
            <h3 class="font-semibold text-gray-900">إضافة صنف</h3>
            <button @click="showProductSearch = false" class="text-gray-400 hover:text-gray-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="ابحث عن صنف..." 
            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500"
            @input="debouncedSearch"
          />
        </div>
        <div class="max-h-[50vh] overflow-y-auto p-2">
          <div v-if="searchLoading" class="text-center py-8 text-gray-500">جاري البحث...</div>
          <div v-else-if="searchResults.length === 0 && searchQuery" class="text-center py-8 text-gray-500">لا توجد نتائج</div>
          <div v-else class="space-y-1">
            <button 
              v-for="product in searchResults" 
              :key="product.id"
              @click="addProductWithAllVariants(product)"
              class="w-full text-right p-3 rounded-xl hover:bg-gray-50 transition-colors flex justify-between items-center"
            >
              <div>
                <p class="font-medium text-gray-900">{{ product.name }}</p>
                <p class="text-xs text-gray-500">{{ product.category?.name || 'بدون تصنيف' }} • {{ product.variants?.length || 0 }} متغير</p>
              </div>
              <div class="text-primary-600">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
              </div>
            </button>
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
import { fetchProducts, searchProducts } from '../../api/products'
import { createPurchaseOrder } from '../../api/purchaseOrders'
import { formatAttributes, formatCurrency } from '../../utils/helpers'
import MButton from '../../components/ui/MButton.vue'
import MCard from '../../components/ui/MCard.vue'
import { useToast } from '../../composables/useToast'

interface VariantLine {
  _uid: string
  product_variant_id: number
  sku_variant?: string
  sku?: string
  attributes?: any
  quantity_ordered: number
  unit_price: number
  expiry_date: string
  notes: string
}

interface ProductGroup {
  product_id: number
  product_name: string
  bulkPrice: number | null
  bulkQuantity: number | null
  variants: VariantLine[]
}

const router = useRouter()
const { addToast } = useToast()
const suppliers = ref<any[]>([])
const products = ref<any[]>([])
const loading = ref(false)

// Product search modal
const showProductSearch = ref(false)
const searchQuery = ref('')
const searchResults = ref<any[]>([])
const searchLoading = ref(false)
let searchTimeout: any = null

const form = reactive<any>({
  supplier_id: null,
  order_date: new Date().toISOString().split('T')[0],
  expected_delivery_date: '',
  notes: ''
})

const errors = reactive<any>({})
const productGroups = ref<ProductGroup[]>([])

const uid = (() => { let i = 0; return () => `uid-${++i}-${Date.now()}` })()

// Computed
const totalVariants = computed(() => productGroups.value.reduce((sum, g) => sum + g.variants.length, 0))
const totalQuantity = computed(() => productGroups.value.reduce((sum, g) => sum + g.variants.reduce((vs, v) => vs + (Number(v.quantity_ordered) || 0), 0), 0))
const totalAmount = computed(() => productGroups.value.reduce((sum, g) => sum + g.variants.reduce((vs, v) => vs + (Number(v.quantity_ordered) || 0) * (Number(v.unit_price) || 0), 0), 0))

// Search with debounce
const debouncedSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(async () => {
    if (!searchQuery.value.trim()) {
      searchResults.value = products.value.slice(0, 20)
      return
    }
    searchLoading.value = true
    try {
      const res = await searchProducts(searchQuery.value, 1)
      searchResults.value = res?.data || []
    } catch (e) {
      console.error('Search failed', e)
      searchResults.value = []
    } finally {
      searchLoading.value = false
    }
  }, 300)
}

// Add product with all variants
const addProductWithAllVariants = (product: any) => {
  if (!product || !product.variants?.length) {
    addToast('هذا الصنف لا يحتوي على متغيرات', 'warning')
    return
  }

  // Check if already added
  if (productGroups.value.some(g => g.product_id === product.id)) {
    addToast('هذا الصنف مضاف مسبقاً', 'warning')
    return
  }

  const variants: VariantLine[] = product.variants.map((v: any) => ({
    _uid: uid(),
    product_variant_id: v.id,
    sku_variant: v.sku_variant,
    sku: v.sku,
    attributes: v.attributes,
    quantity_ordered: 1,
    unit_price: v.cost_price || 0,
    expiry_date: '',
    notes: ''
  }))

  productGroups.value.push({
    product_id: product.id,
    product_name: product.name,
    bulkPrice: null,
    bulkQuantity: null,
    variants
  })

  showProductSearch.value = false
  searchQuery.value = ''
}

// Remove product group
const removeProductGroup = (idx: number) => {
  productGroups.value.splice(idx, 1)
}

// Remove individual variant from a group
const removeVariant = (groupIdx: number, variantIdx: number) => {
  const group = productGroups.value[groupIdx]
  if (!group) return
  
  // If this is the last variant, remove the entire group
  if (group.variants.length <= 1) {
    removeProductGroup(groupIdx)
    return
  }
  
  group.variants.splice(variantIdx, 1)
}

// Apply bulk settings to group
const applyBulkToGroup = (gIdx: number) => {
  const group = productGroups.value[gIdx]
  if (!group) return

  group.variants.forEach(v => {
    if (group.bulkPrice != null && group.bulkPrice > 0) {
      v.unit_price = group.bulkPrice
    }
    if (group.bulkQuantity != null && group.bulkQuantity > 0) {
      v.quantity_ordered = group.bulkQuantity
    }
  })

  addToast('تم تطبيق القيم على جميع المتغيرات', 'success')
}

// Validation
const validate = () => {
  Object.keys(errors).forEach(k => delete errors[k])
  let ok = true
  
  if (!form.supplier_id) { errors.supplier_id = 'المورد مطلوب'; ok = false }
  if (!form.order_date) { errors.order_date = 'تاريخ الطلب مطلوب'; ok = false }
  if (!form.expected_delivery_date) { errors.expected_delivery_date = 'تاريخ التوصيل مطلوب'; ok = false }
  
  if (productGroups.value.length === 0) {
    errors.products = 'يجب إضافة صنف واحد على الأقل'
    ok = false
  }

  let lineIdx = 0
  productGroups.value.forEach((group, gIdx) => {
    group.variants.forEach((v, vIdx) => {
      if (v.quantity_ordered <= 0) {
        errors[`line_qty_${lineIdx}`] = `${group.product_name}: الكمية يجب أن تكون أكبر من 0`
        ok = false
      }
      if (v.unit_price == null || v.unit_price <= 0) {
        errors[`line_price_${lineIdx}`] = `${group.product_name}: سعر الوحدة مطلوب`
        ok = false
      }
      lineIdx++
    })
  })

  return ok
}

// Submit
const submit = async () => {
  if (!validate()) return
  loading.value = true
  
  try {
    // Flatten all variants into lines
    const lines = productGroups.value.flatMap(group => 
      group.variants.map(v => ({
        product_variant_id: v.product_variant_id,
        quantity_ordered: v.quantity_ordered,
        unit_price: v.unit_price,
        expiry_date: v.expiry_date || null,
        notes: v.notes || null
      }))
    )

    const payload = {
      ...form,
      lines
    }

    const res = await createPurchaseOrder(payload)
    const id = res?.data?.id || res?.id
    router.push(id ? { name: 'PurchaseOrderDetails', params: { id } } : { name: 'PurchaseOrders' })
  } catch (e: any) {
    console.error(e)
    const msg = e?.response?.data?.message || 'فشل في إنشاء الطلب'
    addToast(msg, 'error')
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
    searchResults.value = products.value.slice(0, 20)
  } catch (e) { console.error(e) }
  finally { loading.value = false }
})
</script>

<style scoped>
</style>