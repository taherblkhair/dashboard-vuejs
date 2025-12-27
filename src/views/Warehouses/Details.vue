<template>
  <div class="p-6 space-y-6" v-if="warehouse">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="flex items-center gap-4">
         <div class="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-sm">
            {{ initials(warehouse.name) }}
         </div>
         <div>
            <h1 class="text-2xl font-bold text-gray-900 flex items-center gap-3">
              {{ warehouse.name }}
              <span :class="['text-xs px-2 py-0.5 rounded-full border', warehouse.is_active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-700 border-gray-200']">
                 {{ warehouse.is_active ? 'نشط' : 'غير نشط' }}
              </span>
            </h1>
            <div class="flex items-center gap-4 mt-1 text-sm text-gray-500">
               <span class="font-mono bg-gray-100 px-1.5 rounded text-gray-600">{{ warehouse.code }}</span>
               <span v-if="warehouse.address">📍 {{ warehouse.address.city }} - {{ warehouse.address.area }}</span>
            </div>
         </div>
      </div>

      <div class="flex flex-wrap gap-2">
         <MButton variant="secondary" @click="generateReport">
            <span class="flex items-center gap-2">
               <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
               تقرير
            </span>
         </MButton>
         <MButton variant="secondary" @click="openEdit">
            <span class="flex items-center gap-2">
               <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
               تعديل
            </span>
         </MButton>
         <div class="w-px h-8 bg-gray-200 mx-1 hidden md:block"></div>
         <MButton variant="primary" @click="router.push({ name: 'StockMovementCreate', query: { warehouse_id: warehouse.id } })">
             حركة مخزون
         </MButton>
         <MButton variant="warning" @click="router.push({ name: 'StockMovementTransfer', query: { from_warehouse_id: warehouse.id } })">
             نقل مخزون
         </MButton>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6" v-if="stockReport">
       <MCard class="!p-4 bg-blue-50 border-blue-100">
          <p class="text-sm text-blue-600 font-medium mb-1">قيمة المخزون</p>
          <p class="text-xl font-bold text-gray-900">{{ formatCurrency(stockReport.total_stock_value) }}</p>
       </MCard>
       <MCard class="!p-4">
          <p class="text-sm text-gray-500 font-medium mb-1">عدد المنتجات</p>
          <p class="text-xl font-bold text-gray-900">{{ stockReport.unique_products_count || 0 }}</p>
       </MCard>
       <MCard class="!p-4">
          <p class="text-sm text-gray-500 font-medium mb-1">السعة المستخدمة</p>
          <div class="flex items-center justify-between">
             <p class="text-xl font-bold text-gray-900">{{ stockReport.utilization_percentage || 0 }}%</p>
             <span class="text-xs text-gray-400 font-mono">{{ warehouse.capacity || '∞' }} max</span>
          </div>
          <div class="w-full bg-gray-100 rounded-full h-1.5 mt-2 overflow-hidden">
             <div class="h-full bg-blue-500 rounded-full" :style="{ width: `${Math.min(stockReport.utilization_percentage || 0, 100)}%` }"></div>
          </div>
       </MCard>
       <MCard class="!p-4">
          <p class="text-sm text-gray-500 font-medium mb-1">السعة المتاحة</p>
          <p class="text-xl font-bold text-green-600">{{ stockReport.available_capacity || warehouse.capacity || 0 }}</p>
       </MCard>
    </div>

    <!-- Content Tabs -->
    <div class="border-b border-gray-200">
       <nav class="-mb-px flex space-x-8 space-x-reverse" aria-label="Tabs">
         <button 
           @click="activeTab = 'stock'"
           :class="[activeTab === 'stock' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300', 'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors']"
         >
           المخزون الحالي
         </button>
         <button 
           @click="activeTab = 'info'"
           :class="[activeTab === 'info' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300', 'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors']"
         >
           معلومات المخزن
         </button>
       </nav>
    </div>

    <!-- Tab Panels -->
    <div v-if="activeTab === 'stock'">
       <MCard title="تفاصيل المخزون">
          <template #actions>
             <div class="w-64">
                <input v-model="searchStock" type="text" placeholder="بحث باسم المنتج أو SKU..." class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" />
             </div>
          </template>

          <MTable :loading="loading" :empty="!filteredStock.length">
            <template #header>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المنتج</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المواصفات</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الكمية الكلية</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">محجوز</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">متاح</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الحالة</th>
            </template>
            <tr v-for="(s, idx) in filteredStock" :key="idx" class="hover:bg-gray-50">
               <td class="px-6 py-4">
                  <div>
                     <p class="text-sm font-medium text-gray-900">{{ s.product_name || 'منتج غير معروف' }}</p>
                     <p class="text-xs text-gray-500 font-mono">{{ s.sku }}</p>
                  </div>
               </td>
               <td class="px-6 py-4 text-sm text-gray-600">
                  {{ formatAttributes(s.variant_attributes || s.attributes) }}
               </td>
               <td class="px-6 py-4 text-sm font-medium text-gray-900">
                  {{ s.quantity }}
               </td>
               <td class="px-6 py-4 text-sm text-yellow-600">
                  {{ s.reserved_quantity }}
               </td>
               <td class="px-6 py-4 text-sm font-bold text-green-600">
                  {{ s.available_quantity }}
               </td>
               <td class="px-6 py-4">
                  <span :class="getStatusClasses(s.available_quantity)">
                     {{ getStatusLabel(s.available_quantity) }}
                  </span>
               </td>
            </tr>
          </MTable>
       </MCard>
    </div>

    <div v-else-if="activeTab === 'info'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
       <MCard title="بيانات الاتصال" class="h-full">
          <div class="space-y-4">
             <div class="flex justify-between py-2 border-b border-gray-50">
                <span class="text-gray-500 text-sm">الهاتف</span>
                <span class="text-gray-900 font-medium dir-ltr">{{ warehouse.phone || '--' }}</span>
             </div>
             <div class="flex justify-between py-2 border-b border-gray-50">
                <span class="text-gray-500 text-sm">البريد الإلكتروني</span>
                <span class="text-gray-900 font-medium">{{ warehouse.email || '--' }}</span>
             </div>
             <div class="flex justify-between py-2 border-b border-gray-50">
                <span class="text-gray-500 text-sm">المدير المسؤول</span>
                <span class="text-gray-900 font-medium">{{ warehouse.manager?.name || '--' }}</span>
             </div>
          </div>
       </MCard>
       
       <MCard title="العنوان والملاحظات" class="h-full">
          <div class="space-y-4">
             <div v-if="warehouse.address" class="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <p class="text-sm font-medium text-gray-900 mb-1">
                   {{ warehouse.address.city }} - {{ warehouse.address.area }}
                </p>
                <p class="text-xs text-gray-500">
                   {{ warehouse.address.street }} {{ warehouse.address.building ? `(مبنى ${warehouse.address.building})` : '' }}
                </p>
             </div>
             <div v-else class="text-sm text-gray-400 italic">لا يوجد عنوان</div>

             <div class="pt-2">
                <p class="text-xs text-gray-500 mb-1">ملاحظات</p>
                <p class="text-sm text-gray-700 bg-yellow-50 p-3 rounded-lg border border-yellow-100 min-h-[60px]">
                   {{ warehouse.notes || 'لا توجد ملاحظات' }}
                </p>
             </div>
          </div>
       </MCard>
    </div>
  </div>

  <!-- Loading State -->
  <div v-else-if="loading" class="min-h-screen flex items-center justify-center">
     <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
  </div>

  <!-- Edit Modal -->
  <div v-if="showEdit" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm" @click.self="closeEdit">
     <div class="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-fade-in">
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
           <h3 class="text-lg font-bold text-gray-900">تعديل المخزن</h3>
           <button @click="closeEdit" class="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        <form @submit.prevent="submitEdit" class="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
           <!-- Reusing form layout from Create but simpler -->
           <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1">
                 <label class="text-sm font-medium text-gray-700">الاسم</label>
                 <input v-model="editForm.name" required class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 sm:text-sm" />
              </div>
              <div class="space-y-1">
                 <label class="text-sm font-medium text-gray-700">الرمز</label>
                 <input v-model="editForm.code" required class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 sm:text-sm font-mono" />
              </div>
              <div class="space-y-1">
                 <label class="text-sm font-medium text-gray-700">الهاتف</label>
                 <input v-model="editForm.phone" class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 sm:text-sm" />
              </div>
              <div class="space-y-1">
                 <label class="text-sm font-medium text-gray-700">البريد</label>
                 <input v-model="editForm.email" type="email" class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 sm:text-sm" />
              </div>
              <div class="col-span-2 space-y-1">
                 <label class="text-sm font-medium text-gray-700">السعة</label>
                 <input v-model.number="editForm.capacity" type="number" class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 sm:text-sm" />
              </div>
              <div class="col-span-2 flex items-center gap-2 pt-2">
                 <input type="checkbox" v-model="editForm.is_active" class="rounded text-primary-600" />
                 <span class="text-sm text-gray-700">نشط</span>
              </div>
              <div class="col-span-2 space-y-1">
                 <label class="text-sm font-medium text-gray-700">ملاحظات</label>
                 <textarea v-model="editForm.notes" rows="3" class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 sm:text-sm"></textarea>
              </div>
           </div>
           
           <div class="pt-4 flex justify-end gap-3 border-t border-gray-100">
              <MButton variant="secondary" @click="closeEdit">إلغاء</MButton>
              <MButton variant="primary" type="submit" :loading="editLoading">حفظ التغييرات</MButton>
           </div>
        </form>
     </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchWarehouse, fetchWarehouseStockReport, updateWarehouse } from '../../api/warehouses'
import MCard from '../../components/ui/MCard.vue'
import MButton from '../../components/ui/MButton.vue'
import MTable from '../../components/ui/MTable.vue'
import { useToast } from '../../composables/useToast'
import { formatAttributes } from '../../utils/helpers'

const route = useRoute()
const router = useRouter()
const { addToast } = useToast()
const warehouseId = Number(route.params.id)

// State
const warehouse = ref<any>(null)
const stockReport = ref<any>(null)
const loading = ref(false)
const activeTab = ref<'stock' | 'info'>('stock')
const searchStock = ref('')

// Edit State
const showEdit = ref(false)
const editLoading = ref(false)
const editForm = ref<any>({})

// Computeds
const filteredStock = computed(() => {
   if (!stockReport.value?.stock_details) return []
   const q = searchStock.value.toLowerCase()
   if (!q) return stockReport.value.stock_details
   return stockReport.value.stock_details.filter((s: any) => 
      (s.product_name || '').toLowerCase().includes(q) || 
      (s.sku || '').toLowerCase().includes(q)
   )
})

// Methods
const load = async () => {
   loading.value = true
   try {
      const [wRes, sRes] = await Promise.allSettled([
         fetchWarehouse(warehouseId),
         fetchWarehouseStockReport(warehouseId)
      ])

      if (wRes.status === 'fulfilled') {
         warehouse.value = wRes.value?.data || null
      } else {
         console.error('Failed to load warehouse', wRes.reason)
         addToast('فشل في تحميل بيانات المخزن', 'error')
      }

      if (sRes.status === 'fulfilled') {
         stockReport.value = sRes.value?.data || null
      }
   } catch (e) {
      console.error(e)
   } finally {
      loading.value = false
   }
}

const formatCurrency = (val?: number) => {
   if (val == null) return '0.00 د.ل'
   return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(val) + ' د.ل'
}

const initials = (name?: string) => name ? name.split(' ').map(n=>n[0]).slice(0,2).join('').toUpperCase() : '??'

const getStatusClasses = (qty: number) => {
   if (qty <= 0) return 'px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800'
   if (qty < 10) return 'px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800'
   return 'px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'
}

const getStatusLabel = (qty: number) => {
   if (qty <= 0) return 'نفذ'
   if (qty < 10) return 'منخفض'
   return 'متوفر'
}

// Edit Logic
const openEdit = () => {
   if (!warehouse.value) return
   editForm.value = { ...warehouse.value }
   showEdit.value = true
}

const closeEdit = () => showEdit.value = false

const submitEdit = async () => {
   editLoading.value = true
   try {
      await updateWarehouse(warehouseId, editForm.value)
      addToast('تم تحديث المخزن بنجاح', 'success')
      await load()
      closeEdit()
   } catch (e) {
      addToast('فشل التحديث', 'error')
   } finally {
      editLoading.value = false
   }
}

const generateReport = () => {
    addToast('جاري إنشاء التقرير...', 'info')
    // Placeholder logic
}

onMounted(load)
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
.animate-fade-in {
  animation: fade-in 0.2s ease-out;
}
</style>