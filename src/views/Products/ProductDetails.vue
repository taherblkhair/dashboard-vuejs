<template>
  <div dir="rtl" class="min-h-screen bg-slate-50/50 p-4 lg:p-8">
    <div class="max-w-6xl mx-auto space-y-8">
      <!-- Header Area -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="flex items-center gap-4">
          <MButton
            variant="secondary"
            size="sm"
            class="!rounded-xl group"
            @click="goBack"
          >
            <template #icon>
              <svg class="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/>
              </svg>
            </template>
            العودة
          </MButton>
          <div class="space-y-1">
            <h1 class="text-3xl font-black text-slate-900 tracking-tight">{{ product?.name || 'جاري التحميل...' }}</h1>
            <div class="flex items-center gap-3">
              <span v-if="product?.sku" class="text-xs font-mono text-slate-400 bg-white px-2 py-0.5 rounded-md border border-slate-100">SKU: {{ product?.sku }}</span>
              <MBadge v-if="product" :variant="product.is_active ? 'success' : 'danger'" class="!px-3 !py-1 !rounded-lg !text-[10px] !font-black uppercase tracking-widest">
                {{ product.is_active ? 'نشط' : 'غير نشط' }}
              </MBadge>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <MButton
            variant="primary"
            class="!rounded-2xl shadow-lg shadow-indigo-100"
            @click="() => router.push({ name: 'ProductEdit', params: { id } })"
          >
            <template #icon>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
            </template>
            تعديل الصنف
          </MButton>
        </div>
      </div>

      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Column -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Information Grid -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MCard class="!p-6 !rounded-[2rem] border-none shadow-sm bg-white text-center space-y-2">
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">الفئة</p>
              <p class="text-lg font-black text-slate-900">{{ product?.category?.name || '-' }}</p>
            </MCard>

            <MCard class="!p-6 !rounded-[2rem] border-none shadow-sm bg-white text-center space-y-2">
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">نطاق السعر</p>
              <div class="flex items-center justify-center gap-2">
                <span class="text-lg font-black text-emerald-600 tracking-tight">{{ formatCurrency(getMinPrice(product?.variants || [])) }}</span>
                <span class="text-slate-300">-</span>
                <span class="text-lg font-black text-emerald-600 tracking-tight">{{ formatCurrency(getMaxPrice(product?.variants || [])) }}</span>
              </div>
            </MCard>

            <MCard class="!p-6 !rounded-[2rem] border-none shadow-sm bg-white text-center space-y-2">
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">المتغيرات</p>
              <p class="text-lg font-black text-slate-900 tracking-tight">{{ (product?.variants || []).length }}</p>
            </MCard>
          </div>

          <!-- Product Images Gallery -->
          <MCard class="!p-8 !rounded-[2rem] border-none shadow-sm bg-white space-y-6">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
              <h3 class="text-xl font-black text-slate-900 tracking-tight">معرض الصور</h3>
            </div>
            
            <div v-if="product?.images?.length || hasVariantImages(product)" class="space-y-6">
              <!-- Feature Image -->
              <div class="relative aspect-video md:aspect-[21/9] rounded-3xl overflow-hidden bg-slate-100 border border-slate-100 group">
                <img 
                  :src="getImageUrl(getMainImage(product)?.url)" 
                  class="w-full h-full object-contain bg-white"
                />
                <div class="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-black text-indigo-600 shadow-lg border border-white/50">
                  الصورة الرئيسية
                </div>
              </div>

              <!-- Gallery Grid -->
              <div v-if="product?.images && product.images.length > 1" class="grid grid-cols-3 sm:grid-cols-6 gap-4">
                <div 
                  v-for="img in (product?.images || []).filter(i => i.type !== 'main')" 
                  :key="img.id"
                  class="aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-all cursor-zoom-in"
                >
                  <img :src="getImageUrl(img.url)" class="w-full h-full object-cover" />
                </div>
              </div>
            </div>
            
            <div v-else class="py-12 flex flex-col items-center justify-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-200 text-slate-400">
              <svg class="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              <p class="font-bold text-xs uppercase tracking-widest">لا توجد صور لهذا الصنف</p>
            </div>
          </MCard>

          <!-- Description -->
          <MCard class="!p-8 !rounded-[2rem] border-none shadow-sm bg-white space-y-4">
            <div class="flex items-center gap-3 mb-2">
              <div class="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"/>
                </svg>
              </div>
              <h3 class="text-xl font-black text-slate-900 tracking-tight">الوصف</h3>
            </div>
            <p class="text-slate-600 leading-relaxed font-medium">
              {{ product?.description || 'لا يوجد وصف متاح لهذا الصنف.' }}
            </p>
          </MCard>

          <!-- Variants Table -->
        <MCard class="!p-0 !rounded-[2.5rem] border-none shadow-xl shadow-slate-200/50 bg-white overflow-hidden">
  <div class="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
      <h3 class="text-xl font-black text-slate-900 tracking-tight">قائمة المتغيرات</h3>
    </div>
    <div class="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold tracking-widest uppercase">
      {{ product?.variants?.length || 0 }} إجمالي
    </div>
  </div>

  <MTable v-if="product?.variants?.length" class="w-full">
    <template #header>
      <tr>
        <th class="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest w-[25%]">المتغير</th>
        <th class="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest w-[35%]">الخصائص</th>
        <th class="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest w-[15%]">سعر البيع</th>
        <th class="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest w-[10%]">الحالة</th>
        <th class="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest w-[15%]">الإجراءات</th>
      </tr>
    </template>
    
    <tbody>
      <tr v-for="item in product.variants" :key="item.id" class="group hover:bg-slate-50/50 transition-colors">
        <td class="px-8 py-5 w-[25%]">
          <div class="flex items-center gap-3">
            <div v-if="item.images && item.images.length > 0" class="w-10 h-10 rounded-lg overflow-hidden border border-slate-100 bg-slate-50 shrink-0">
              <img :src="getImageUrl(item.images?.[0]?.url)" class="w-full h-full object-cover" />
            </div>
            <code class="text-[10px] font-mono font-black text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200/50">
              {{ item.sku_variant }}
            </code>
          </div>
        </td>
        <td class="px-8 py-5 w-[35%]">
          <div class="flex flex-wrap gap-1.5 py-1">
            <span v-for="(val, key) in item.attributes" :key="key" class="px-2 py-1 bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-500 rounded-lg">
              <span class="text-slate-400 font-medium">{{ key }}: </span>{{ val }}
            </span>
          </div>
        </td>
        <td class="px-8 py-5 w-[15%]">
          <p class="font-black text-emerald-600 text-lg">{{ formatCurrency(item.sale_price) }}</p>
        </td>
        <td class="px-8 py-5 w-[10%] text-center">
          <div class="flex justify-center">
            <MBadge :variant="item.is_active ? 'success' : 'danger'" class="!px-3 !py-1 !rounded-lg shrink-0">
              {{ item.is_active ? 'نشط' : 'غير نشط' }}
            </MBadge>
          </div>
        </td>
        <td class="px-8 py-5 w-[15%]">
          <MButton 
            variant="secondary" 
            size="sm" 
            class="!rounded-xl !text-indigo-600 !bg-indigo-50 hover:!bg-indigo-100 border-none font-bold whitespace-nowrap"
            @click="openVariantModal(item)"
          >
            تعديل
          </MButton>
        </td>
      </tr>
    </tbody>
  </MTable>

  <div v-else class="py-20 text-center">
    <p class="text-slate-400 font-medium italic">لا توجد متغيرات لهذا الصنف.</p>
  </div>
</MCard>
        </div>

        <!-- Sidebar Column (Stock) -->
        <div class="space-y-8">
          <MCard class="!p-8 !rounded-[2.5rem] border-none shadow-xl shadow-slate-200/50 bg-white space-y-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                  </svg>
                </div>
                <h3 class="text-xl font-black text-slate-900 tracking-tight">نظرة على المخزون</h3>
              </div>
              <button @click="fetchStock" class="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors">
                <svg class="w-5 h-5" :class="{ 'animate-spin': stockLoading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
              </button>
            </div>

            <div v-if="stockLoading" class="py-12 flex flex-col items-center justify-center text-slate-400 gap-3">
              <div class="w-8 h-8 border-3 border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
              <span class="text-sm font-bold tracking-widest uppercase">جاري التحديث...</span>
            </div>

            <div v-else-if="stock?.data" class="space-y-6">
              <!-- Summary Mini Cards -->
              <div class="space-y-3">
                <div class="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100/50 flex items-center justify-between">
                  <span class="text-sm font-bold text-indigo-600 uppercase tracking-widest">إجمالي المخزون</span>
                  <span class="text-2xl font-black text-indigo-900 leading-none">{{ stock.data.total_stock }}</span>
                </div>
                <div class="p-4 rounded-2xl bg-amber-50/50 border border-amber-100/50 flex items-center justify-between">
                  <span class="text-sm font-bold text-amber-600 uppercase tracking-widest">المحجوز</span>
                  <span class="text-2xl font-black text-amber-900 leading-none">{{ stock.data.total_reserved_stock }}</span>
                </div>
                <div class="p-4 rounded-2xl bg-emerald-50 border border-emerald-100/50 flex items-center justify-between">
                  <span class="text-sm font-bold text-emerald-600 uppercase tracking-widest">المتاح للبيع</span>
                  <span class="text-2xl font-black text-emerald-900 leading-none">{{ stock.data.total_available_stock }}</span>
                </div>
              </div>

              <!-- Stock per Warehouse (if available) -->
              <div class="space-y-4 pt-4 border-t border-slate-50">
                <h4 class="text-xs font-black text-slate-400 uppercase tracking-widest">توزيع المخزون</h4>
                <div v-if="stock.data.warehouses?.length" class="space-y-3">
                   <!-- Simplified list for sidebar -->
                   <div v-for="w in stock.data.warehouses" :key="w.id" class="flex items-center justify-between p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                     <span class="text-sm font-bold text-slate-700">{{ w.warehouse_name }}</span>
                     <span class="font-black text-slate-900">{{ w.total_stock }}</span>
                   </div>
                </div>
                <p v-else class="text-xs text-slate-400 font-medium italic">سيظهر التوزيع حسب المخازن هنا عند توفره.</p>
              </div>
            </div>

            <div v-else class="py-12 text-center space-y-3">
               <div class="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 mx-auto">
                 <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                 </svg>
               </div>
               <p class="text-sm font-bold text-slate-400 tracking-widest uppercase">لا توجد بيانات مخزون</p>
            </div>
          </MCard>
        </div>
      </div>
    </div>

    <!-- Edit Variant Modal -->
    <div v-if="editingVariant" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="closeVariantModal"></div>
      <MCard class="relative w-full max-w-2xl !p-0 !rounded-[2.5rem] border-none shadow-2xl bg-white overflow-hidden animate-in zoom-in duration-300">
        <div class="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
          <div class="space-y-1">
            <h3 class="text-2xl font-black text-slate-900 tracking-tight">تعديل المتغير</h3>
            <p class="text-slate-400 text-xs font-medium">تحديث بيانات المتغير: {{ editingVariant.sku_variant }}</p>
          </div>
          <button @click="closeVariantModal" class="p-2 text-slate-400 hover:bg-white rounded-xl transition-all shadow-sm">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="saveVariantUpdate" class="p-8 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-1.5">
              <label class="text-xs font-black text-slate-700 block px-1">سعر الشراء</label>
              <MInput v-model="variantForm.purchase_price" type="number" step="0.01" class="!rounded-2xl" required />
            </div>
            <div class="space-y-1.5">
              <label class="text-xs font-black text-slate-700 block px-1">سعر البيع</label>
              <MInput v-model="variantForm.sale_price" type="number" step="0.01" class="!rounded-2xl" required />
            </div>
            <div class="space-y-1.5">
              <label class="text-xs font-black text-slate-700 block px-1">تاريخ الانتهاء</label>
              <MInput v-model="variantForm.expiry_date" type="date" class="!rounded-2xl" />
            </div>
            <div class="space-y-1.5 flex flex-col justify-end">
              <label class="text-xs font-black text-slate-700 block px-1 mb-2">الحالة</label>
              <div class="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <button type="button" @click="variantForm.is_active = !variantForm.is_active" 
                        class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none" 
                        :class="variantForm.is_active ? 'bg-indigo-600' : 'bg-slate-200'">
                  <span class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" 
                        :class="variantForm.is_active ? '-translate-x-5' : 'translate-x-0'"></span>
                </button>
                <span class="text-xs font-bold" :class="variantForm.is_active ? 'text-indigo-600' : 'text-slate-400'">{{ variantForm.is_active ? 'نشط' : 'غير نشط' }}</span>
              </div>
            </div>
          </div>

          <div class="pt-4">
            <h4 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">الخصائص</h4>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div class="space-y-1.5">
                <label class="text-[10px] font-black text-slate-500 block px-1">اللون</label>
                <MInput v-model="variantForm.attributes.color" placeholder="أحمر" class="!rounded-xl" />
              </div>
              <div class="space-y-1.5">
                <label class="text-[10px] font-black text-slate-500 block px-1">المقاس</label>
                <MInput v-model="variantForm.attributes.size" placeholder="XL" class="!rounded-xl" />
              </div>
              <div class="space-y-1.5">
                <label class="text-[10px] font-black text-slate-500 block px-1">الوزن</label>
                <MInput v-model="variantForm.attributes.weight" placeholder="1kg" class="!rounded-xl" />
              </div>
            </div>
          </div>

          <div class="pt-6 flex gap-3">
             <MButton variant="secondary" size="lg" type="button" @click="closeVariantModal" class="flex-1 !rounded-2xl">إلغاء</MButton>
             <MButton variant="primary" size="lg" type="submit" class="flex-[2] !rounded-2xl shadow-lg shadow-indigo-100" :loading="variantUpdating">
                حفظ التعديلات
             </MButton>
          </div>
        </form>
      </MCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchProduct as apiFetchProduct, fetchProductStock as apiFetchProductStock, updateProductVariant } from '../../api/products'
import type { Product, Variant } from '../../api/products'
import { formatCurrency } from '../../utils/helpers'
import MCard from '../../components/ui/MCard.vue'
import MButton from '../../components/ui/MButton.vue'
import MBadge from '../../components/ui/MBadge.vue'
import MTable from '../../components/ui/MTable.vue'
import MInput from '../../components/ui/MInput.vue'
import { useToast } from '../../composables/useToast'

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id)
const { addToast } = useToast()

const product = ref<Product | null>(null)
const loading = ref(true)
const stock = ref<any | null>(null)
const stockLoading = ref(false)

const editingVariant = ref<Variant | null>(null)
const variantUpdating = ref(false)
const variantForm = reactive({
  purchase_price: '',
  sale_price: '',
  expiry_date: '',
  is_active: true,
  attributes: {
    color: '',
    size: '',
    weight: ''
  }
})

const openVariantModal = (v: Variant) => {
  editingVariant.value = v
  variantForm.purchase_price = String(v.purchase_price)
  variantForm.sale_price = String(v.sale_price)
  variantForm.expiry_date = v.expiry_date || ''
  variantForm.is_active = !!v.is_active
  variantForm.attributes = {
    color: v.attributes.color || '',
    size: v.attributes.size || '',
    weight: v.attributes.weight || ''
  }
}

const closeVariantModal = () => {
  editingVariant.value = null
}

const saveVariantUpdate = async () => {
  if (!editingVariant.value) return
  
  variantUpdating.value = true
  try {
    const cleanAttributes: Record<string, any> = {}
    Object.entries(variantForm.attributes).forEach(([key, val]) => {
      if (val !== '' && val !== null && val !== undefined) {
        cleanAttributes[key] = val
      }
    })

    const payload = {
      attributes: cleanAttributes,
      purchase_price: parseFloat(variantForm.purchase_price) || 0,
      sale_price: parseFloat(variantForm.sale_price) || 0,
      expiry_date: variantForm.expiry_date || null,
      is_active: variantForm.is_active
    }

    await updateProductVariant(editingVariant.value.id, payload)
    addToast('تم تحديث المتغير بنجاح', 'success')
    closeVariantModal()
    await Promise.all([fetchProductData(), fetchStock()])
  } catch (e) {
    console.error('Failed to update variant', e)
    addToast('فشل تحديث المتغير', 'error')
  } finally {
    variantUpdating.value = false
  }
}

const getMinPrice = (variants: Variant[]) => {
  if (!variants || variants.length === 0) return 0
  return Math.min(...variants.map(v => parseFloat(String(v.sale_price) || '0')))
}

const getMaxPrice = (variants: Variant[]) => {
  if (!variants || variants.length === 0) return 0
  return Math.max(...variants.map(v => parseFloat(String(v.sale_price) || '0')))
}

const fetchProductData = async () => {
  loading.value = true
  try {
    const res = await apiFetchProduct(id)
    const payload = (res && (res as any).data) ? (res as any).data : res
    product.value = payload as Product
  } catch (e) {
    console.error('Error fetching product:', e)
  } finally {
    loading.value = false
  }
}

const fetchStock = async () => {
  stockLoading.value = true
  try {
    const res = await apiFetchProductStock(id)
    stock.value = res && (res as any).data ? res : { data: res }
  } catch (e) {
    console.error('Error fetching stock:', e)
    stock.value = { data: null }
  } finally {
    stockLoading.value = false
  }
}

const goBack = () => router.back()

const getImageUrl = (url?: string) => {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return `http://127.0.0.1:8000${url}`
}

const getMainImage = (product: Product | null) => {
  if (product?.images?.length) {
    return product.images.find(img => img.type === 'main') || product.images[0]
  }
  // Fallback to first variant image
  const firstVariantWithImage = product?.variants?.find(v => v.images?.length)
  return firstVariantWithImage?.images?.[0]
}

const hasVariantImages = (product: Product | null) => {
  return product?.variants?.some(v => v.images?.length)
}

onMounted(async () => {
  await fetchProductData()
  await fetchStock()
})
</script>

<style scoped>
/* Scoped custom transitions or utilities if needed */
</style>
