<template>
  <div class="p-6 bg-gray-50 min-h-screen" dir="rtl">
    <div class="max-w-2xl mx-auto space-y-6">
       <!-- Header -->
       <div class="flex items-center justify-between">
          <div>
             <h1 class="text-2xl font-bold text-gray-900">نقل مخزون</h1>
             <p class="text-sm text-gray-500 mt-1">نقل كميات من مخزن إلى آخر</p>
          </div>
          <MButton variant="secondary" @click="cancel">إلغاء</MButton>
       </div>

       <MCard>
          <form @submit.prevent="submit" class="p-6 space-y-6">
             <!-- Warehouses -->
             <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                   <label class="block text-sm font-medium text-gray-700 mb-2">من المخزن</label>
                   <select 
                      v-model.number="form.from_warehouse_id" 
                      class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
                   >
                      <option :value="null">اختر المخزن المرسل</option>
                      <option v-for="w in warehouses" :key="w.id" :value="w.id">{{ w.name }} (#{{ w.id }})</option>
                   </select>
                </div>
                <div>
                   <label class="block text-sm font-medium text-gray-700 mb-2">إلى المخزن</label>
                   <select 
                      v-model.number="form.to_warehouse_id" 
                      class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
                   >
                      <option :value="null">اختر المخزن المستقبل</option>
                       <!-- Filter out source warehouse if selected -->
                      <option v-for="w in targetWarehouses" :key="w.id" :value="w.id">{{ w.name }} (#{{ w.id }})</option>
                   </select>
                </div>
             </div>

             <!-- Product Selection (Filtered by source warehouse) -->
             <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">المنتج المراد نقله</label>
                <div v-if="!form.from_warehouse_id" class="p-3 bg-gray-50 rounded-lg text-sm text-gray-500 text-center">
                   يرجى اختيار المخزن المرسل أولاً لعرض الأصناف المتاحة
                </div>
                <div v-else-if="loadingVariants" class="flex items-center gap-2 text-sm text-gray-500 p-2">
                   <div class="animate-spin h-4 w-4 border-2 border-primary-500 rounded-full border-t-transparent"></div>
                   جاري تحميل الأصناف...
                </div>
                <div v-else-if="variants.length === 0" class="p-3 bg-yellow-50 text-yellow-700 rounded-lg text-sm border border-yellow-200">
                   لا توجد أصناف متاحة في هذا المخزن
                </div>
                <select 
                   v-else
                   v-model.number="form.product_variant_id"
                   class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
                >
                   <option :value="null">اختر المنتج...</option>
                   <option v-for="v in variants" :key="v.id" :value="v.id">
                      {{ v.label }} (متاح: {{ v.available }})
                   </option>
                </select>
             </div>

             <!-- Quantity & Cost -->
             <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                   <label class="block text-sm font-medium text-gray-700 mb-2">الكمية</label>
                   <input 
                      v-model.number="form.quantity" 
                      type="number" 
                      min="1" 
                      required
                      class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                   />
                </div>
                <div>
                   <label class="block text-sm font-medium text-gray-700 mb-2">سعر الوحدة (اختياري)</label>
                   <input 
                      v-model.number="form.unit_cost" 
                      type="number" 
                      step="0.01" 
                      class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="للحفاظ على نفس التكلفة اتركه فارغاً"
                   />
                </div>
             </div>

             <!-- Notes -->
             <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">ملاحظات</label>
                <textarea 
                   v-model="form.note" 
                   rows="3" 
                   class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                ></textarea>
             </div>

             <div class="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <MButton variant="secondary" @click="cancel">إلغاء</MButton>
                <MButton variant="primary" type="submit" :loading="submitting">نقل المخزون</MButton>
             </div>
          </form>
       </MCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { fetchWarehouses, fetchWarehouseStockReport } from '../../api/warehouses'
import { transferStockMovement } from '../../api/stockMovements'
import MCard from '../../components/ui/MCard.vue'
import MButton from '../../components/ui/MButton.vue'
import { useToast } from '../../composables/useToast'


const router = useRouter()
const route = useRoute()
const { addToast } = useToast()

const warehouses = ref<any[]>([])
const variants = ref<any[]>([])
const loading = ref(false)
const loadingVariants = ref(false)
const submitting = ref(false)

const form = ref({
  from_warehouse_id: null as number | null,
  to_warehouse_id: null as number | null,
  product_variant_id: null as number | null,
  quantity: 1,
  unit_cost: null as number | null,
  note: ''
})

// Filter target warehouses to exclude source
const targetWarehouses = computed(() => {
   if (!form.value.from_warehouse_id) return warehouses.value
   return warehouses.value.filter(w => w.id !== form.value.from_warehouse_id)
})

const loadWarehouses = async () => {
   loading.value = true
   try {
      const res = await fetchWarehouses()
      warehouses.value = res?.data || []
   } catch (e) {
      console.error(e)
   } finally {
      loading.value = false
   }
}

const loadVariants = async (wId: number) => {
   loadingVariants.value = true
   variants.value = []
   try {
      const res = await fetchWarehouseStockReport(wId)
      const data = res?.data?.stock_details || res?.data || []
      variants.value = data.map((d: any) => ({
         id: d.product_variant_id,
         label: d.product_name || `Variant #${d.product_variant_id}`,
         available: d.available_quantity || 0
      }))
      
      // Auto select first if needed? Maybe better not to
   } catch (e) {
      console.error(e)
   } finally {
      loadingVariants.value = false
   }
}

watch(() => form.value.from_warehouse_id, (newVal) => {
   if (newVal) {
      loadVariants(newVal)
      // Reset logic if needed
      form.value.product_variant_id = null
      if (form.value.to_warehouse_id === newVal) form.value.to_warehouse_id = null
   } else {
      variants.value = []
   }
})

onMounted(async () => {
   await loadWarehouses()
   
   // Query params
   if (route.query.from_warehouse_id) {
      form.value.from_warehouse_id = Number(route.query.from_warehouse_id)
   }
   if (route.query.to_warehouse_id) {
      form.value.to_warehouse_id = Number(route.query.to_warehouse_id)
   }
})

const submit = async () => {
   if (!form.value.from_warehouse_id || !form.value.to_warehouse_id) {
      addToast('يرجى اختيار المخزنين', 'error')
      return
   }
   if (!form.value.product_variant_id) {
      addToast('يرجى اختيار المنتج', 'error')
      return
   }
   if (form.value.quantity <= 0) {
      addToast('الكمية يجب أن تكون أكبر من صفر', 'error')
      return
   }

   submitting.value = true
   try {
      await transferStockMovement({
         ...form.value,
         from_warehouse_id: form.value.from_warehouse_id,
         to_warehouse_id: form.value.to_warehouse_id,
         product_variant_id: form.value.product_variant_id
      })
      addToast('تم نقل المخزون بنجاح', 'success')
      router.push({ name: 'WarehouseDetails', params: { id: form.value.to_warehouse_id } })
   } catch (e: any) {
      // Check for specific error message
      const msg = e?.response?.data?.message || e?.message || ''
      if (msg.toLowerCase().includes('stock') || msg.includes('insufficient')) {
         addToast('الكمية غير متوفرة في المخزن المرسل', 'error')
      } else {
         addToast(msg || 'فشل عملية النقل', 'error')
      }
   } finally {
      submitting.value = false
   }
}

const cancel = () => router.back()
</script>
