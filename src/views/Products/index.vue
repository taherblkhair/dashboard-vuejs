<template>
  <div class="products-page">
    <!-- رأس الصفحة -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">إدارة المنتجات</h1>
        <p class="page-description">عرض وإدارة جميع المنتجات في النظام</p>
      </div>
      <div class="header-actions">
        <button class="btn btn-primary">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
          إضافة منتج جديد
        </button>
      </div>
    </div>

    <!-- إحصائيات سريعة -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon bg-blue-500">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
          </svg>
        </div>
        <div class="stat-content">
          <h3 class="stat-value">{{ totalProducts }}</h3>
          <p class="stat-label">إجمالي المنتجات</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon bg-green-500">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <div class="stat-content">
          <h3 class="stat-value">{{ activeProducts }}</h3>
          <p class="stat-label">منتجات نشطة</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon bg-purple-500">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
          </svg>
        </div>
        <div class="stat-content">
          <h3 class="stat-value">{{ totalVariants }}</h3>
          <p class="stat-label">إجمالي المتغيرات</p>
        </div>
      </div>
    </div>

    <!-- شريط البحث والتصفية -->
    <div class="filters-bar">
      <div class="search-box">
        <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="ابحث عن منتج..."
          class="search-input"
        >
      </div>
      
      <div class="filter-group">
        <select v-model="categoryFilter" class="filter-select">
          <option value="">جميع الفئات</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
        
        <select v-model="statusFilter" class="filter-select">
          <option value="">جميع الحالات</option>
          <option value="active">نشط</option>
          <option value="inactive">غير نشط</option>
        </select>
      </div>
    </div>

    <!-- جدول المنتجات -->
    <div class="products-table-container">
      <table class="products-table">
        <thead>
          <tr>
            <th class="table-header">المعلومات الأساسية</th>
            <th class="table-header">الفئة</th>
            <th class="table-header">المتغيرات</th>
            <th class="table-header">السعر</th>
            <th class="table-header">الحالة</th>
            <th class="table-header">الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in filteredProducts" :key="product.id" class="table-row">
            <td class="table-cell">
              <div class="product-info">
                <div class="product-avatar">
                  {{ product.name.charAt(0) }}
                </div>
                <div class="product-details">
                  <h4 class="product-name">{{ product.name }}</h4>
                  <p class="product-sku">{{ product.sku }}</p>
                  <p class="product-description">{{ product.description }}</p>
                </div>
              </div>
            </td>
            
            <td class="table-cell">
              <span class="category-badge">{{ product.category?.name || '-' }}</span>
            </td>
            
            <td class="table-cell">
              <div class="variants-info">
                <span class="variants-count">{{ product.variants.length }} متغير</span>
                <div class="variants-preview">
                  <span 
                    v-for="variant in product.variants.slice(0, 3)" 
                    :key="variant.id"
                    class="variant-tag"
                  >
                    {{ getVariantLabel(variant) }}
                  </span>
                  <span v-if="product.variants.length > 3" class="more-variants">
                    +{{ product.variants.length - 3 }}
                  </span>
                </div>
              </div>
            </td>
            
            <td class="table-cell">
              <div class="price-info">
                <div class="price-range">
                  من {{ getMinPrice(product.variants) }} $
                </div>
                <div class="price-range">
                  إلى {{ getMaxPrice(product.variants) }} $
                </div>
              </div>
            </td>
            
            <td class="table-cell">
              <span 
                class="status-badge"
                :class="product.is_active ? 'status-active' : 'status-inactive'"
              >
                {{ product.is_active ? 'نشط' : 'غير نشط' }}
              </span>
            </td>
            
            <td class="table-cell">
              <div class="actions">
                <button class="btn-action btn-edit" title="تعديل">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                </button>
                <button class="btn-action btn-view" title="عرض التفاصيل" @click="viewProductDetails(product)">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                </button>
                <button 
                  class="btn-action btn-delete" 
                  title="حذف"
                  @click="deleteProduct(product)"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- حالة التحميل -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>جاري تحميل المنتجات...</p>
      </div>

      <!-- حالة عدم وجود بيانات -->
      <div v-if="!loading && products.length === 0" class="empty-state">
        <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
        </svg>
        <h3>لا توجد منتجات</h3>
        <p>لم يتم العثور على أي منتجات في النظام</p>
        <button class="btn btn-primary">إضافة منتج جديد</button>
      </div>
    </div>

    <!-- التصفح -->
    <div v-if="products.length > 0" class="pagination">
      <button 
        class="pagination-btn"
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
      >
        السابق
      </button>
      
      <div class="pagination-info">
        الصفحة {{ currentPage }} من {{ totalPages }}
      </div>
      
      <button 
        class="pagination-btn"
        :disabled="currentPage === totalPages"
        @click="changePage(currentPage + 1)"
      >
        التالي
      </button>
    </div>

    <!-- تفاصيل المنتج (مودال) -->
    <div v-if="showModal && selectedProduct" class="modal-backdrop" @click.self="closeModal">
      <div class="modal" role="dialog" aria-modal="true">
        <header class="modal-header">
          <h3>{{ selectedProduct.name }}</h3>
          <button class="modal-close" @click="closeModal">×</button>
        </header>

        <div class="modal-body">
          <div v-if="modalLoading" class="modal-loading">
            <div class="loading-spinner" style="width:2rem;height:2rem;border-width:3px"></div>
            <p>جاري جلب تفاصيل المنتج...</p>
          </div>
          <div v-else>
          <div class="modal-row">
            <div><strong>SKU:</strong> {{ selectedProduct.sku }}</div>
            <div><strong>الفئة:</strong> {{ selectedProduct.category?.name || '-' }}</div>
          </div>

          <p class="modal-description">{{ selectedProduct.description }}</p>

          <section class="modal-section">
            <h4>المتغيرات (Variants)</h4>
            <table class="modal-table">
              <thead>
                <tr>
                  <th>SKU متغير</th>
                  <th>الخصائص</th>
                  <th>سعر الشراء</th>
                  <th>سعر البيع</th>
                  <th>تاريخ الانتهاء</th>
                  <th>الحالة</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="v in selectedProduct.variants" :key="v.id">
                  <td>{{ v.sku_variant }}</td>
                  <td>
                    <span v-for="(val, key) in v.attributes" :key="key">{{ key }}: {{ val }} </span>
                  </td>
                  <td>{{ v.purchase_price }}</td>
                  <td>{{ v.sale_price }}</td>
                  <td>{{ formatDate(v.expiry_date) }}</td>
                  <td>{{ v.is_active ? 'نشط' : 'غير نشط' }}</td>
                </tr>
              </tbody>
            </table>
          </section>
          </div>
        </div>

        <footer class="modal-footer">
          <button class="btn btn-primary" @click="closeModal">إغلاق</button>
        </footer>
      </div>
    </div>
  </div>
  
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { fetchProducts as apiFetchProducts, fetchCategories } from '../../api/products'
import { fetchProduct as apiFetchProduct } from '../../api/products'
import type { Product, Category, Variant } from '../../api/products'

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

// الفئات (من API)
// `categories` ref مُعبّأ من endpoint /categories

// المنتجات المصفاة
const filteredProducts = computed(() => {
  return products.value.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchQuery.value.toLowerCase())
    
  const matchesCategory = !categoryFilter.value || (product.category && product.category.id.toString() === categoryFilter.value)
    
    const matchesStatus = !statusFilter.value || 
                         (statusFilter.value === 'active' && product.is_active) ||
                         (statusFilter.value === 'inactive' && !product.is_active)
    
    return matchesSearch && matchesCategory && matchesStatus
  })
})

// دوال مساعدة
const getVariantLabel = (variant: Variant) => {
  return `${variant.attributes.color}-${variant.attributes.size}`
}

const getMinPrice = (variants: Variant[]) => {
  return Math.min(...variants.map(v => parseFloat(v.sale_price)))
}

const getMaxPrice = (variants: Variant[]) => {
  return Math.max(...variants.map(v => parseFloat(v.sale_price)))
}

// date formatting helper removed (unused)

// الإجراءات
// حالة المودال والمنتج المحدد
const selectedProduct = ref<Product | null>(null)
const showModal = ref(false)
const modalLoading = ref(false)

const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString('ar-EG')
  } catch (e) {
    return dateString
  }
}

const viewProductDetails = async (product: Product) => {
  // open modal immediately with the provided product (optimistic), then fetch latest
  selectedProduct.value = product
  showModal.value = true
  modalLoading.value = true
  try {
    const res = await apiFetchProduct(product.id)
    // API might return { data: Product } or Product directly
    const payload = (res && (res as any).data) ? (res as any).data : res
    selectedProduct.value = payload as Product
  } catch (e) {
    console.error('Error fetching product details:', e)
    // keep optimistic product in case fetch fails
  } finally {
    modalLoading.value = false
  }
}

const closeModal = () => {
  showModal.value = false
  selectedProduct.value = null
}

// close on Escape
const onKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && showModal.value) closeModal()
}

onMounted(() => {
  fetchProducts()
  fetchAllCategories()
  document.addEventListener('keydown', onKeyDown)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeyDown)
})

const deleteProduct = (product: Product) => {
  if (confirm(`هل أنت متأكد من حذف المنتج "${product.name}"؟`)) {
    console.log('حذف المنتج:', product)
    // يمكنك إضافة منطق الحذف هنا
  }
}

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    fetchProducts(page)
  }
}

// جلب البيانات عند التحميل
onMounted(() => {
  fetchProducts()
  fetchAllCategories()
})
</script>

<style scoped>
.products-page {
  direction: rtl;
  padding: 1.5rem;
}

/* Modal styles */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 60;
}

.modal {
  width: 90%;
  max-width: 900px;
  background: white;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.modal-header {
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:1rem 1.25rem;
  border-bottom:1px solid #eef2f7;
}

.modal-body { padding:1rem 1.25rem; max-height:60vh; overflow:auto }
.modal-footer { padding:0.75rem 1.25rem; border-top:1px solid #eef2f7; text-align:right }
.modal-close { background:transparent; border:none; font-size:1.25rem; cursor:pointer }
.modal-row { display:flex; gap:1rem; justify-content:space-between; margin-bottom:0.75rem }
.modal-description { color:#374151; margin-bottom:1rem }
.modal-section h4 { margin:0 0 0.5rem 0 }
.modal-table { width:100%; border-collapse:collapse }
.modal-table th, .modal-table td { padding:0.5rem; border:1px solid #e6eef5; text-align:right }
.modal-loading { display:flex; flex-direction:column; align-items:center; gap:0.5rem; padding:2rem }

/* رأس الصفحة */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
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