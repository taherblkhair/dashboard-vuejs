<template>
  <div dir="rtl" class="min-h-screen bg-gray-50 p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">إدارة المنتجات</h1>
        <p class="text-sm text-gray-500">عرض وإدارة جميع المنتجات في النظام</p>
      </div>

      <div class="flex items-center gap-3">
        <button
          @click="() => router.push({ name: 'ProductCreate' })"
          class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
          إضافة منتج جديد
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div class="bg-white rounded-lg p-4 shadow flex items-center gap-4">
        <div class="w-12 h-12 rounded-lg bg-blue-500 flex items-center justify-center text-white">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
          </svg>
        </div>
        <div>
          <div class="text-xl font-semibold text-gray-800">{{ totalProducts }}</div>
          <div class="text-sm text-gray-500">إجمالي المنتجات</div>
        </div>
      </div>

      <div class="bg-white rounded-lg p-4 shadow flex items-center gap-4">
        <div class="w-12 h-12 rounded-lg bg-green-500 flex items-center justify-center text-white">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <div>
          <div class="text-xl font-semibold text-gray-800">{{ activeProducts }}</div>
          <div class="text-sm text-gray-500">منتجات نشطة</div>
        </div>
      </div>

      <div class="bg-white rounded-lg p-4 shadow flex items-center gap-4">
        <div class="w-12 h-12 rounded-lg bg-purple-500 flex items-center justify-center text-white">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
          </svg>
        </div>
        <div>
          <div class="text-xl font-semibold text-gray-800">{{ totalVariants }}</div>
          <div class="text-sm text-gray-500">إجمالي المتغيرات</div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap items-center gap-4 mb-6">
      <div class="flex-1 min-w-[220px] relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="ابحث عن منتج..."
          class="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg bg-white text-sm"
        />
        <svg class="w-5 h-5 absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
      </div>

      <select v-model="categoryFilter" class="px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm">
        <option value="">جميع الفئات</option>
        <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
      </select>

      <select v-model="statusFilter" class="px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm">
        <option value="">جميع الحالات</option>
        <option value="active">نشط</option>
        <option value="inactive">غير نشط</option>
      </select>
    </div>

    <!-- Products table -->
    <div class="bg-white rounded-lg shadow overflow-hidden mb-6">
      <div class="overflow-x-auto">
        <table class="w-full table-auto min-w-[800px]">
          <thead class="bg-gray-50">
            <tr>
              <th class="text-right px-6 py-3 text-sm font-medium text-gray-700">المعلومات الأساسية</th>
              <th class="text-right px-6 py-3 text-sm font-medium text-gray-700">الفئة</th>
              <th class="text-right px-6 py-3 text-sm font-medium text-gray-700">المتغيرات</th>
              <th class="text-right px-6 py-3 text-sm font-medium text-gray-700">السعر</th>
              <th class="text-right px-6 py-3 text-sm font-medium text-gray-700">الحالة</th>
              <th class="text-right px-6 py-3 text-sm font-medium text-gray-700">الإجراءات</th>
            </tr>
          </thead>
          <tbody class="divide-y">
            <tr v-for="product in filteredProducts" :key="product.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 align-top">
                <div class="flex items-start gap-4">
                  <div class="w-12 h-12 rounded-md bg-blue-500 text-white flex items-center justify-center font-bold text-lg">{{ product.name.charAt(0) }}</div>
                  <div>
                    <div class="font-semibold text-gray-800">{{ product.name }}</div>
                    <div class="text-xs text-gray-500">{{ product.sku }}</div>
                    <div class="text-sm text-gray-500 mt-1">{{ product.description }}</div>
                  </div>
                </div>
              </td>

              <td class="px-6 py-4 text-right">
                <span class="inline-block bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm">{{ product.category?.name || '-' }}</span>
              </td>

              <td class="px-6 py-4 text-right">
                <div class="text-sm text-gray-600">{{ product.variants.length }} متغير</div>
                <div class="flex flex-wrap gap-1 mt-2">
                  <span v-for="variant in product.variants.slice(0,3)" :key="variant.id" class="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">{{ getVariantLabel(variant) }}</span>
                  <span v-if="product.variants.length > 3" class="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">+{{ product.variants.length - 3 }}</span>
                </div>
              </td>

              <td class="px-6 py-4 text-right">
                <div class="text-sm text-gray-800">من {{ getMinPrice(product.variants) }} $</div>
                <div class="text-sm text-gray-500">إلى {{ getMaxPrice(product.variants) }} $</div>
              </td>

              <td class="px-6 py-4 text-right">
                <span :class="product.is_active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'" class="px-3 py-1 rounded-full text-sm font-medium">
                  {{ product.is_active ? 'نشط' : 'غير نشط' }}
                </span>
              </td>

              <td class="px-6 py-4 text-right">
                <ActionMenu :items="[
                  { label: 'عرض التفاصيل', action: () => viewProductDetails(product), icon: IconEye },
                  { label: 'حذف', action: () => deleteProduct(product), icon: IconTrash, variant: 'danger' }
                ]" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Loading / Empty states -->
      <div v-if="loading" class="p-6 flex flex-col items-center justify-center">
        <div class="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
        <p class="text-gray-600">جاري تحميل المنتجات...</p>
      </div>

      <div v-if="!loading && products.length === 0" class="p-8 text-center">
        <svg class="mx-auto w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
        <h3 class="text-lg font-semibold text-gray-800">لا توجد منتجات</h3>
        <p class="text-sm text-gray-500 mb-4">لم يتم العثور على أي منتجات في النظام</p>
        <button class="bg-blue-600 text-white px-4 py-2 rounded-lg">إضافة منتج جديد</button>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="products.length > 0" class="flex items-center justify-center gap-4 mb-6">
      <button :disabled="currentPage === 1" @click="changePage(currentPage - 1)" class="px-3 py-1 border rounded disabled:opacity-50">السابق</button>
      <div class="text-sm text-gray-600">الصفحة {{ currentPage }} من {{ totalPages }}</div>
      <button :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)" class="px-3 py-1 border rounded disabled:opacity-50">التالي</button>
    </div>

  </div>

  <!-- Creation moved to dedicated page: /products/create -->
</template>

<script setup lang="ts">
import { ref, computed, onMounted, defineComponent, h } from 'vue'
import { useRouter } from 'vue-router'
import { fetchProducts as apiFetchProducts, fetchCategories, deleteProduct as apiDeleteProduct } from '../../api/products'
import type { Product, Category, Variant } from '../../api/products'
import ActionMenu from '../../components/ui/ActionMenu.vue'

// Icons
const IconEye = defineComponent({ render: () => h('svg', { fill:'none', viewBox:'0 0 24 24', stroke:'currentColor', class:'w-4 h-4' }, [h('path', { 'stroke-linecap':'round', 'stroke-linejoin':'round', 'stroke-width':'2', d:'M15 12a3 3 0 11-6 0 3 3 0 016 0z' }), h('path', { 'stroke-linecap':'round', 'stroke-linejoin':'round', 'stroke-width':'2', d:'M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' })]) })
const IconTrash = defineComponent({ render: () => h('svg', { fill:'none', viewBox:'0 0 24 24', stroke:'currentColor', class:'w-4 h-4' }, [h('path', { 'stroke-linecap':'round', 'stroke-linejoin':'round', 'stroke-width':'2', d:'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' })]) })


// البيانات التفاعلية
const products = ref<Product[]>([])
const categories = ref<Category[]>([])
const loading = ref(false)
const searchQuery = ref('')
const categoryFilter = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const totalPages = ref(1)

// جلب البيانات من API
const fetchProducts = async (page: number = 1) => {
  loading.value = true
  try {
    const data = await apiFetchProducts(page)

    products.value = data.data || []
    currentPage.value = data.meta?.current_page || 1
    totalPages.value = data.meta?.last_page || 1
  } catch (error) {
    console.error('خطأ في جلب البيانات:', error)
  } finally {
    loading.value = false
  }
}

const fetchAllCategories = async () => {
  try {
    const res = await fetchCategories()
    categories.value = res.data || []
  } catch (e) {
    console.error('خطأ في جلب الفئات:', e)
  }
}

// الإحصائيات
const totalProducts = computed(() => products.value.length)
const activeProducts = computed(() => products.value.filter(p => p.is_active).length)
const totalVariants = computed(() => 
  products.value.reduce((total, product) => total + product.variants.length, 0)
)


// (removed modal-only helpers: exportVariants, convertToCSV, isExpiringSoon)

const showToastMessage = (title: string, description: string) => {
  // يمكن استبدال هذا بتنفيذ toast حقيقي
  alert(`${title}: ${description}`)
}

// المنتجات المصفاة
const filteredProducts = computed(() => {
  return products.value.filter(product => {
    const q = searchQuery.value.toLowerCase()
    const matchesSearch = product.name.toLowerCase().includes(q) || product.sku.toLowerCase().includes(q)
    const matchesCategory = !categoryFilter.value || (product.category && product.category.id.toString() === categoryFilter.value)
    const matchesStatus = !statusFilter.value || 
                         (statusFilter.value === 'active' && product.is_active) ||
                         (statusFilter.value === 'inactive' && !product.is_active)

    return matchesSearch && matchesCategory && matchesStatus
  })
})

// دوال مساعدة
const getVariantLabel = (variant: Variant) => {
  return `${variant.attributes?.color || ''}-${variant.attributes?.size || ''}`
}

const getMinPrice = (variants: Variant[]) => {
  if (!variants || variants.length === 0) return 0
  return Math.min(...variants.map(v => parseFloat(String(v.sale_price) || '0')))
}

const getMaxPrice = (variants: Variant[]) => {
  if (!variants || variants.length === 0) return 0
  return Math.max(...variants.map(v => parseFloat(String(v.sale_price) || '0')))
}

// الإجراءات
const router = useRouter()

// formatDate removed (was used only by modal/export helpers)

const viewProductDetails = (product: Product) => {
  // navigate to the dedicated product details page
  router.push({ name: 'ProductDetails', params: { id: String(product.id) } })
}

onMounted(() => {
  fetchProducts()
  fetchAllCategories()
})

const deleteProduct = async (product: Product) => {
  if (!confirm(`هل أنت متأكد من حذف المنتج "${product.name}"؟`)) return

  // optimistic UI: mark loading or remove after success
  try {
    // Optionally, you could set a local loading state per-product here
    const res = await apiDeleteProduct(product.id)
    // If deletion succeeded, remove from local list
    products.value = products.value.filter(p => p.id !== product.id)

    // show success using toast helper
    const msg = (res && (res as any).message) ? (res as any).message : 'تم حذف المنتج'
    showToastMessage('تم الحذف', msg)
  } catch (e) {
    console.error('خطأ عند حذف المنتج:', e)
    // show friendly message
    showToastMessage('خطأ', 'حدث خطأ أثناء حذف المنتج. حاول مرة أخرى.')
  }
}

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    fetchProducts(page)
  }
}

// جلب البيانات عند التحميل (handled earlier to attach event listener as well)
</script>

<!-- Styles are handled by Tailwind utilities; no local scoped CSS required -->

<style scoped>
.products-page {
  direction: rtl;
  padding: 1.5rem;
}

/* (modal styles removed) */

/* رأس الصفحة */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}
/* scroll-bar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-thumb {
  background: #c5c5c5;
  border-radius: 10px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.page-title {
  font-size: 1.875rem;
  font-weight: bold;
  color: #1f2937;
  margin: 0;
}

.page-description {
  color: #6b7280;
  margin: 0.5rem 0 0 0;
}

/* الإحصائيات */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-value {
  font-size: 1.875rem;
  font-weight: bold;
  color: #1f2937;
  margin: 0;
}

.stat-label {
  color: #6b7280;
  margin: 0;
}

/* شريط التصفية */
.filters-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 300px;
}

.search-icon {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.25rem;
  height: 1.25rem;
  color: #9ca3af;
}

.search-input {
  width: 100%;
  padding: 0.75rem 3rem 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background: white;
}

.filter-group {
  display: flex;
  gap: 0.5rem;
}

.filter-select {
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background: white;
  min-width: 150px;
}

/* الجدول */
.products-table-container {
  background: white;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
}

.products-table {
  width: 100%;
  border-collapse: collapse;
}

.table-header {
  background: #f9fafb;
  padding: 1rem;
  text-align: right;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
}

.table-row {
  border-bottom: 1px solid #e5e7eb;
  transition: background-color 0.2s;
}

.table-row:hover {
  background: #f9fafb;
}

.table-cell {
  padding: 1rem;
  vertical-align: top;
}

/* معلومات المنتج */
.product-info {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
}

.product-avatar {
  width: 3rem;
  height: 3rem;
  border-radius: 0.5rem;
  background: #3b82f6;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.125rem;
  flex-shrink: 0;
}

.product-name {
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
}

.product-sku {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0 0 0.25rem 0;
}

.product-description {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
  line-height: 1.4;
}

/* البادجات */
.category-badge {
  background: #dbeafe;
  color: #1e40af;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.status-badge {
  padding: 0.375rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.status-active {
  background: #dcfce7;
  color: #166534;
}

.status-inactive {
  background: #fef2f2;
  color: #991b1b;
}

/* المتغيرات */
.variants-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.variants-count {
  color: #6b7280;
  font-size: 0.875rem;
}

.variants-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.variant-tag {
  background: #f3f4f6;
  color: #374151;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
}

.more-variants {
  background: #e5e7eb;
  color: #6b7280;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
}

/* الأسعار */
.price-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.price-range {
  color: #374151;
  font-size: 0.875rem;
}

/* الإجراءات */
.actions {
  display: flex;
  gap: 0.5rem;
}

.btn-action {
  padding: 0.5rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-edit {
  background: #dbeafe;
  color: #1d4ed8;
}

.btn-edit:hover {
  background: #bfdbfe;
}

.btn-view {
  background: #f0fdf4;
  color: #15803d;
}

.btn-view:hover {
  background: #dcfce7;
}

.btn-delete {
  background: #fef2f2;
  color: #dc2626;
}

.btn-delete:hover {
  background: #fecaca;
}

/* الأزرار */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
}

/* الحالات */
.loading-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
}

.loading-spinner {
  width: 3rem;
  height: 3rem;
  border: 3px solid #e5e7eb;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.empty-icon {
  width: 4rem;
  height: 4rem;
  color: #9ca3af;
  margin-bottom: 1rem;
}

.empty-state h3 {
  color: #374151;
  margin: 0 0 0.5rem 0;
}

.empty-state p {
  color: #6b7280;
  margin: 0 0 1.5rem 0;
}

/* التصفح */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

.pagination-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  background: #f9fafb;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  color: #6b7280;
  font-size: 0.875rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* تصميم متجاوب */
@media (max-width: 768px) {
  .products-page {
    padding: 1rem;
  }
  
  .page-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .filters-bar {
    flex-direction: column;
  }
  
  .search-box {
    min-width: auto;
  }
  
  .products-table-container {
    overflow-x: auto;
  }
  
  .products-table {
    min-width: 800px;
  }
}
</style>