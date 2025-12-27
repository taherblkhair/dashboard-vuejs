<template>
  <div class="p-6 bg-gray-50 min-h-screen" dir="rtl">
    <div class="max-w-2xl mx-auto space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
         <div>
            <h1 class="text-2xl font-bold text-gray-900">حركة مخزون جديدة</h1>
            <p class="text-sm text-gray-500 mt-1">تسجيل وارد أو صادر للمخزون</p>
         </div>
         <MButton variant="secondary" @click="cancel">إلغاء</MButton>
      </div>

      <MCard>
        <form @submit.prevent="submit" class="p-6 space-y-6">
           <!-- Warehouse & Variant -->
           <div class="grid grid-cols-1 gap-6">
              <div>
                 <label class="block text-sm font-medium text-gray-700 mb-2">المخزن</label>
                 <select v-model.number="form.warehouse_id" required class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white">
                    <option :value="undefined">اختر المخزن...</option>
                    <option v-for="w in warehouses" :key="w.id" :value="w.id">{{ w.name }} ({{ w.code }})</option>
                 </select>
              </div>

              <div>
                 <label class="block text-sm font-medium text-gray-700 mb-2">المنتج</label>
                 <VariantAutocomplete 
                    v-model="form.product_variant_id" 
                    :selected-label="selectedVariantLabel"
                    @select="onVariantSelect"
                    placeholder="ابحث عن المنتج (الاسم أو SKU)"
                 />
                 <p v-if="form.product_variant_id && selectedVariantSku" class="text-xs text-gray-500 mt-1">
                    SKU: {{ selectedVariantSku }}
                 </p>
              </div>
           </div>

           <!-- Movement Details -->
           <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                 <label class="block text-sm font-medium text-gray-700 mb-2">نوع الحركة</label>
                 <div class="flex items-center gap-4">
                    <label class="flex items-center gap-2 cursor-pointer">
                       <input type="radio" v-model="form.type" value="IN" class="text-green-600 focus:ring-green-500" />
                       <span class="text-sm text-gray-700 font-medium">وارد (إضافة)</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer">
                       <input type="radio" v-model="form.type" value="OUT" class="text-red-600 focus:ring-red-500" />
                       <span class="text-sm text-gray-700 font-medium">صادر (خصم)</span>
                    </label>
                 </div>
              </div>

              <div>
                 <label class="block text-sm font-medium text-gray-700 mb-2">تاريخ الحركة</label>
                 <input 
                   v-model="form.movement_date_local" 
                   type="datetime-local" 
                   class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                 />
              </div>

              <div>
                 <label class="block text-sm font-medium text-gray-700 mb-2">الكمية</label>
                 <input 
                   v-model.number="form.quantity" 
                   type="number" 
                   min="1" 
                   step="1" 
                   required
                   class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                 />
              </div>

              <div>
                 <label class="block text-sm font-medium text-gray-700 mb-2">تكلفة الوحدة (اختياري)</label>
                 <input 
                   v-model.number="form.unit_cost" 
                   type="number" 
                   step="0.01" 
                   class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                   placeholder="د.ل"
                 />
              </div>
           </div>

           <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">ملاحظات</label>
              <textarea 
                v-model="form.note" 
                rows="3" 
                class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="سبب الحركة..."
              ></textarea>
           </div>

           <div class="pt-4 flex justify-end gap-3 border-t border-gray-100">
              <MButton variant="secondary" @click="cancel">إلغاء</MButton>
              <MButton variant="primary" type="submit" :loading="submitting">حفظ الحركة</MButton>
           </div>
        </form>
      </MCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { createStockMovement } from '../../api/stockMovements'
import { fetchWarehouses } from '../../api/warehouses'
import MCard from '../../components/ui/MCard.vue'
import MButton from '../../components/ui/MButton.vue'
import VariantAutocomplete from '../../components/VariantAutocomplete.vue'
import { useToast } from '../../composables/useToast'
import { formatAttributes } from '../../utils/helpers'

const route = useRoute()
const router = useRouter()
const { addToast } = useToast()

const submitting = ref(false)
const warehouses = ref<any[]>([])
const selectedVariantLabel = ref('')
const selectedVariantSku = ref('')

const form = reactive<any>({
  warehouse_id: undefined,
  product_variant_id: undefined,
  type: 'IN',
  quantity: 1,
  unit_cost: undefined,
  note: '',
  movement_date_local: ''
})

onMounted(async () => {
    // Load warehouses
    try {
        const res = await fetchWarehouses()
        warehouses.value = res?.data || []
    } catch (e) {
        console.error(e)
    }

    // Prefill warehouse
    if (route.query.warehouse_id) {
       form.warehouse_id = Number(route.query.warehouse_id)
    }
})

const onVariantSelect = (v: any) => {
    form.product_variant_id = v.id
    selectedVariantLabel.value = v.product?.name || ''
    if (v.attributes) {
        selectedVariantLabel.value += ` (${formatAttributes(v.attributes)})`
    }
    selectedVariantSku.value = v.sku || v.sku_variant || ''
}

const toServerDate = (local: string) => {
   if (!local) return undefined
   return local.replace('T', ' ') + ':00'
}

const submit = async () => {
   if (!form.warehouse_id || !form.product_variant_id || !form.quantity) {
       addToast('يرجى ملء جميع الحقول المطلوبة', 'error')
       return
   }

   submitting.value = true
   try {
       const payload = {
           warehouse_id: form.warehouse_id,
           product_variant_id: form.product_variant_id,
           type: form.type,
           quantity: form.quantity,
           unit_cost: form.unit_cost,
           note: form.note,
           movement_date: toServerDate(form.movement_date_local)
       }
       
       await createStockMovement(payload)
       addToast('تم إنشاء الحركة بنجاح', 'success')
       router.back()
   } catch (e: any) {
       console.error(e)
       addToast(e?.response?.data?.message || 'فشل إنشاء الحركة', 'error')
   } finally {
       submitting.value = false
   }
}

const cancel = () => router.back()
</script>
