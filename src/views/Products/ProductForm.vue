<template>
  <form @submit.prevent="onSubmit" class="space-y-4 relative">

    <!-- البيانات الأساسية -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 ">
      <div>
        <label class="block text-sm text-gray-700 mb-1">اسم المنتج</label>
        <input v-model="form.name" type="text" required class="w-full px-3 py-2 border border-gray-200 rounded-lg" />
      </div>

      <div>
        <label class="block text-sm text-gray-700 mb-1">SKU</label>
        <input v-model="form.sku" type="text" class="w-full px-3 py-2 border border-gray-200 rounded-lg" />
      </div>

      <div>
        <label class="block text-sm text-gray-700 mb-1">الفئة</label>
        <select v-model="form.category_id" class="w-full px-3 py-2 border border-gray-200 rounded-lg" aria-label="فئة المنتج">
          <option value="">حدد فئة</option>
          <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
        </select>
        <div v-if="selectedCategory" class="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
          <div class="font-medium">معلومات الفئة</div>
          <div class="text-xs">الوصف: {{ selectedCategory.description || '-' }}</div>
          <div v-if="selectedCategory.parent" class="text-xs">الأب: {{ selectedCategory.parent.name }}</div>
        </div>
      </div>

      <div>
        <label class="block text-sm text-gray-700 mb-1">الحالة</label>
        <div class="flex items-center gap-3">
          <label class="inline-flex items-center gap-2">
            <input type="checkbox" v-model="form.is_active" class="rounded" />
            <span class="text-sm text-gray-700">نشط</span>
          </label>
        </div>
      </div>
    </div>

    <!-- الوصف -->
    <div>
      <label class="block text-sm text-gray-700 mb-1">الوصف</label>
      <textarea v-model="form.description" rows="3" class="w-full px-3 py-2 border border-gray-200 rounded-lg"></textarea>
    </div>

    <!-- المتغيرات -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <label class="block text-sm text-gray-700">المتغيرات</label>
          <button type="button"
                  @click="addVariant"
                  class="px-3 py-1 bg-green-600 text-white rounded inline-flex items-center gap-2">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
            <span>إضافة متغير</span>
          </button>
        </div>

        <div class="space-y-2">
          <div v-if="form.variants.length === 0" class="text-sm text-gray-500">لا توجد متغيرات بعد. أضف متغيرًا جديدًا.</div>

          <div v-for="(v, i) in form.variants" :key="v.id" class="border rounded-lg bg-white shadow-sm" :ref="(el) => (variantRefs[i] = el)">
            <div class="p-3 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <button type="button" @click="toggleVariant(i)" class="p-1 rounded hover:bg-gray-100">
                  <svg :class="{'rotate-90': v._open}" class="w-4 h-4 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                </button>
                <div>
                  <div class="font-medium">{{ v.sku_variant }}</div>
                  <div class="text-xs text-gray-500">سعر بيع: {{ v.sale_price }} — سعر شراء: {{ v.purchase_price }}</div>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <button type="button" @click="removeVariant(i)" class="text-red-600 text-sm">حذف</button>
              </div>
            </div>

            <div v-show="v._open" class="p-3 border-t bg-gray-50">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <div>
                  <label class="text-xs text-gray-700">SKU المتغير</label>
                  <input v-model="v.sku_variant" type="text" class="w-full px-3 py-2 border rounded-lg bg-gray-100 cursor-not-allowed" />
                </div>
                <div>
                  <label class="text-xs text-gray-700">سعر الشراء</label>
                  <input v-model="v.purchase_price" type="number" class="w-full px-3 py-2 border rounded-lg" />
                  <div v-if="variantErrors[i] && variantErrors[i].purchase_price" class="text-red-600 text-xs mt-1">{{ variantErrors[i].purchase_price }}</div>
                </div>
                <div>
                  <label class="text-xs text-gray-700">سعر البيع</label>
                  <input v-model="v.sale_price" type="number" class="w-full px-3 py-2 border rounded-lg" />
                  <div v-if="variantErrors[i] && variantErrors[i].sale_price" class="text-red-600 text-xs mt-1">{{ variantErrors[i].sale_price }}</div>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label class="text-xs text-gray-700">اللون</label>
                  <select v-model="v.attributes.color" class="w-full px-3 py-2 border rounded-lg">
                    <option value="">اختر لون</option>
                    <option value="red">أحمر</option>
                    <option value="blue">أزرق</option>
                    <option value="black">أسود</option>
                    <option value="white">أبيض</option>
                  </select>
                </div>

                <div>
                  <label class="text-xs text-gray-700">المقاس</label>
                  <select v-model="v.attributes.size" class="w-full px-3 py-2 border rounded-lg">
                    <option value="">اختر مقاس</option>
                    <option value="S">صغير (S)</option>
                    <option value="M">متوسط (M)</option>
                    <option value="L">كبير (L)</option>
                    <option value="XL">XL</option>
                  </select>
                </div>

                <div>
                  <label class="text-xs text-gray-700">الوزن</label>
                  <input type="text" v-model="v.attributes.weight" placeholder="مثال: 1kg" class="px-3 py-2 border rounded-lg w-full" />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                <div>
                  <label class="text-xs text-gray-700">تاريخ الانتهاء</label>
                  <input v-model="v.expiry_date" type="date" class="px-3 py-2 border rounded-lg w-full" />
                </div>
                <div class="flex items-center gap-2">
                  <input type="checkbox" v-model="v.is_active" />
                  <span class="text-sm text-gray-700">نشط</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    <!-- الأزرار -->
    <div class="flex justify-end gap-3">
      <button type="button" @click="$emit('close')" class="px-4 py-2 rounded bg-gray-100 text-gray-700">إلغاء</button>
      <button :disabled="props.loading" type="submit"
              class="px-4 py-2 rounded bg-blue-600 text-white flex items-center gap-2">
        <svg v-if="props.loading" class="w-4 h-4 animate-spin text-white" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10"
                  stroke="currentColor" stroke-width="4" fill="none"></circle>
          <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
        <span>حفظ</span>
      </button>
    </div>

  </form>
</template>

<script setup lang="ts">
import { reactive, watch, ref, onMounted, nextTick, computed } from 'vue'
import { fetchCategory } from '../../api/categories'

interface Category { id: number; name: string }

const props = defineProps<{ categories?: Category[], loading?: boolean }>()
const emit = defineEmits(['save', 'close'])

const categories = computed(() => props.categories || [])

const form = reactive({
  name: '',
  sku: '',
  description: '',
  category_id: '',
  is_active: true,
  variants: [] as any[]
})

const selectedCategory = ref<any>(null)

// when category_id changes, fetch category details
watch(() => form.category_id, async (newVal) => {
  selectedCategory.value = null
  if (newVal) {
    try {
      const res = await fetchCategory(Number(newVal))
      selectedCategory.value = (res && (res as any).data) ? (res as any).data : res
    } catch (e) {
      console.error('Failed to fetch category', e)
      selectedCategory.value = null
    }
  }
})

// counter to generate incremental SKUs for variants (SKU-1, SKU-2, ...)
let variantCounter = 1

// if the product SKU changes, update existing variant SKUs to follow the new base
watch(() => form.sku, (newSku) => {
  const base = newSku && newSku.toString().trim() !== '' ? newSku.toString().trim() : 'SKU'
  form.variants.forEach((v, idx) => {
    v.sku_variant = `${base}-${idx + 1}`
  })
  // next counter should continue after existing variants
  variantCounter = form.variants.length + 1
})

/* إضافة متغير جديد */
const addVariant = async () => {
  const base = form.sku && form.sku.toString().trim() !== '' ? form.sku.toString().trim() : 'SKU'
  form.variants.push({
    id: `v-${Date.now()}`,
    // generate SKU using product SKU as base (e.g. PROD-44422-1)
    sku_variant: `${base}-${variantCounter++}`,
    _open: false,
    purchase_price: 0,
    sale_price: 0,
    expiry_date: '',
    is_active: true,
    attributes: {
      color: '',
      size: '',
      weight: ''
    }
  })
  // ensure errors array stays in sync
  variantErrors.value.push({ sale_price: '', purchase_price: '' })

  // focus the newly added variant's first input (sale_price) to help keyboard users
  await nextTick()
  const idx = form.variants.length - 1
  const el = variantRefs.value[idx]
  if (el) {
    const input = el.querySelector('input[type="number"]') as HTMLInputElement | null
    if (input) input.focus()
  }
}

// per-variant validation errors
const variantErrors = ref<Array<{ sale_price: string; purchase_price: string }>>([])

// refs to variant DOM nodes for focusing (Element|any because template ref can be Element or component)
const variantRefs = ref<Array<any | null>>([])

// ensure each variant has an explicit _open flag (used by the template)
const normalizeVariants = () => {
  form.variants.forEach((v, idx) => {
    if (typeof v._open === 'undefined') {
      v._open = false
    }
    // ensure SKU numbering consistency
    if (!v.sku_variant) v.sku_variant = `${form.sku || 'SKU'}-${idx + 1}`
    // ensure errors array is in sync
    if (!variantErrors.value[idx]) variantErrors.value[idx] = { sale_price: '', purchase_price: '' }
    // ensure variantRefs has a slot
    if (typeof variantRefs.value[idx] === 'undefined') variantRefs.value[idx] = null
  })
  // trim any extra error slots if variants were removed
  if (variantErrors.value.length > form.variants.length) {
    variantErrors.value.splice(form.variants.length)
  }
  if (variantRefs.value.length > form.variants.length) {
    variantRefs.value.splice(form.variants.length)
  }
}

// toggle visibility for a variant's details
const toggleVariant = (index: number) => {
  const v = form.variants[index]
  if (!v) return
  v._open = !v._open
}

const removeVariant = (index: number) => {
  form.variants.splice(index, 1)
  // keep error & ref arrays in sync
  if (variantErrors.value.length > index) variantErrors.value.splice(index, 1)
  if (variantRefs.value.length > index) variantRefs.value.splice(index, 1)
}

const validateVariants = () => {
  let ok = true
  // reset errors and validate
  for (let i = 0; i < form.variants.length; i++) {
    if (!variantErrors.value[i]) variantErrors.value[i] = { sale_price: '', purchase_price: '' }
    const e = variantErrors.value[i]!
    e.sale_price = ''
    e.purchase_price = ''

    const v = form.variants[i]
    const sale = Number(v.sale_price)
    const purchase = Number(v.purchase_price)
    if (!(sale > 0)) {
      e.sale_price = 'سعر البيع يجب أن يكون أكبر من 0'
      ok = false
    }
    if (!(purchase >= 0)) {
      e.purchase_price = 'سعر الشراء يجب أن يكون قيمه صالحة'
      ok = false
    }
    if (sale < purchase) {
      e.sale_price = 'سعر البيع يجب أن يكون أكبر أو يساوي سعر الشراء'
      ok = false
    }
  }

  return ok
}

// initialize variant flags on mount
onMounted(() => {
  normalizeVariants()
})

/* إرسال النموذج */
const onSubmit = () => {
  // validate variants before emitting save
  const valid = validateVariants()
  if (!valid) {
    // open first invalid variant and focus
    const firstInvalid = variantErrors.value.findIndex(e => e.sale_price || e.purchase_price)
    if (firstInvalid >= 0 && form.variants[firstInvalid]) {
      form.variants[firstInvalid]._open = true
      nextTick(() => {
        const el = variantRefs.value[firstInvalid]
        if (el) {
          const input = el.querySelector('input[type="number"]') as HTMLInputElement | null
          if (input) input.focus()
        }
      })
    }
    return
  }

  emit('save', {
    name: form.name,
    sku: form.sku,
    description: form.description,
    category_id: form.category_id || undefined,
    is_active: form.is_active,
    variants: form.variants
  })
}
</script>