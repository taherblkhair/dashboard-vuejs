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
          @click="openCreateModal"
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
                <div class="flex items-center gap-2 justify-end">
                  <button class="p-2 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100" title="تعديل">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                  </button>
                  <button @click="viewProductDetails(product)" class="p-2 rounded-md bg-green-50 text-green-600 hover:bg-green-100" title="عرض التفاصيل">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                  </button>
                  <button @click="deleteProduct(product)" class="p-2 rounded-md bg-red-50 text-red-600 hover:bg-red-100" title="حذف">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  </button>
                </div>
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

  <!-- Modal (view details) -->
  <!-- Modal for viewing product details -->
<div v-if="showModal && selectedProduct" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
  <!-- Backdrop -->
  <div class="fixed inset-0 bg-gray-900/70 backdrop-blur-sm transition-opacity" @click="closeModal"></div>

  <!-- Modal container -->
  <div class="flex min-h-screen items-center justify-center p-4">
    <!-- Modal content -->
    <div class="relative w-full max-w-5xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
      <!-- Modal header -->
      <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-4">
            <div class="flex h-16 w-16 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <span class="text-2xl font-bold text-white">{{ selectedProduct.name.charAt(0).toUpperCase() }}</span>
            </div>
            <div>
              <h2 class="text-2xl font-bold text-white" id="modal-title">{{ selectedProduct.name }}</h2>
              <div class="mt-2 flex items-center gap-4">
                <span class="rounded-full bg-white/20 px-3 py-1 text-sm text-white backdrop-blur-sm">
                  {{ selectedProduct.sku }}
                </span>
                <span :class="selectedProduct.is_active ? 'bg-green-500/30 text-green-100' : 'bg-red-500/30 text-red-100'" 
                      class="rounded-full px-3 py-1 text-sm font-medium">
                  {{ selectedProduct.is_active ? 'نشط' : 'غير نشط' }}
                </span>
              </div>
            </div>
          </div>
          <button @click="closeModal" class="rounded-lg p-2 text-white/80 hover:bg-white/10 hover:text-white">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Modal body -->
      <div class="max-h-[70vh] overflow-y-auto p-8">
        <!-- Loading state -->
        <div v-if="modalLoading" class="flex flex-col items-center justify-center py-12">
          <div class="h-16 w-16 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
          <p class="mt-4 text-lg font-medium text-gray-600">جاري تحميل تفاصيل المنتج...</p>
          <p class="mt-2 text-sm text-gray-400">يرجى الانتظار</p>
        </div>

        <!-- Content -->
        <div v-else>
          <!-- Quick info cards -->
          <div class="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            <!-- Category card -->
            <div class="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div class="flex items-center gap-3">
                <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500">الفئة</p>
                  <p class="text-lg font-semibold text-gray-800">{{ selectedProduct.category?.name || 'غير محدد' }}</p>
                </div>
              </div>
            </div>

            <!-- Price range card -->
            <div class="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div class="flex items-center gap-3">
                <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600">
                  <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500">نطاق السعر</p>
                  <p class="text-lg font-semibold text-gray-800">{{ getMinPrice(selectedProduct.variants) }}$ - {{ getMaxPrice(selectedProduct.variants) }}$</p>
                </div>
              </div>
            </div>

            <!-- Variants count card -->
            <div class="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div class="flex items-center gap-3">
                <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                  <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500">عدد المتغيرات</p>
                  <p class="text-lg font-semibold text-gray-800">{{ selectedProduct.variants.length }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div class="mb-8 rounded-xl border border-gray-200 bg-gray-50 p-6">
            <h3 class="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-800">
              <svg class="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              الوصف
            </h3>
            <p class="text-gray-600 leading-relaxed">{{ selectedProduct.description || 'لا يوجد وصف' }}</p>
          </div>

          <!-- Product Stock Section -->
          <div class="mb-8">
            <div class="mb-4 flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-800">مخزون المنتج</h3>
              <span class="text-sm text-gray-500">آخر تحديث: الآن</span>
            </div>

            <!-- Stock loading -->
            <div v-if="productStockLoading" class="flex items-center justify-center rounded-xl border border-gray-200 bg-gray-50 py-8">
              <div class="flex items-center gap-3">
                <div class="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
                <span class="text-gray-600">جاري تحميل بيانات المخزون...</span>
              </div>
            </div>

            <!-- Stock content -->
            <div v-else>
              <!-- Stock summary -->
              <div v-if="productStock && productStock.data" class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div class="rounded-xl border border-blue-200 bg-blue-50 p-5">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-sm font-medium text-blue-700">إجمالي المخزون</p>
                      <p class="mt-1 text-2xl font-bold text-blue-900">{{ productStock.data.total_stock }}</p>
                    </div>
                    <div class="rounded-lg bg-blue-100 p-3">
                      <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div class="rounded-xl border border-orange-200 bg-orange-50 p-5">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-sm font-medium text-orange-700">المخزون المحجوز</p>
                      <p class="mt-1 text-2xl font-bold text-orange-900">{{ productStock.data.total_reserved_stock }}</p>
                    </div>
                    <div class="rounded-lg bg-orange-100 p-3">
                      <svg class="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div class="rounded-xl border border-green-200 bg-green-50 p-5">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-sm font-medium text-green-700">المخزون المتاح</p>
                      <p class="mt-1 text-2xl font-bold text-green-900">{{ productStock.data.total_available_stock }}</p>
                    </div>
                    <div class="rounded-lg bg-green-100 p-3">
                      <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Stock by variants table -->
              <div v-if="productStock && productStock.data && productStock.data.variants.length > 0" class="mb-8">
                <div class="mb-4 flex items-center gap-2">
                  <h4 class="text-md font-semibold text-gray-700">تفاصيل المخزون حسب المتغير</h4>
                  <span class="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">{{ productStock.data.variants.length }} متغير</span>
                </div>
                <div class="overflow-hidden rounded-xl border border-gray-200">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                      <tr>
                        <th scope="col" class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">المتغير</th>
                        <th scope="col" class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">SKU</th>
                        <th scope="col" class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">المخزون الكلي</th>
                        <th scope="col" class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">المحجوز</th>
                        <th scope="col" class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">المتاح</th>
                        <th scope="col" class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">الحالة</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 bg-white">
                      <tr v-for="v in productStock.data.variants" :key="v.id" class="hover:bg-gray-50">
                        <td class="whitespace-nowrap px-6 py-4">
                          <div class="flex flex-wrap gap-1 justify-end">
                            <span v-for="(val, key) in v.attributes" :key="key" 
                                  class="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-700">
                              <span class="text-gray-500">{{ key }}:</span>
                              <span class="font-medium">{{ val }}</span>
                            </span>
                          </div>
                        </td>
                        <td class="whitespace-nowrap px-6 py-4">
                          <code class="rounded bg-gray-100 px-2 py-1 font-mono text-sm text-gray-700">{{ v.sku_variant }}</code>
                        </td>
                        <td class="whitespace-nowrap px-6 py-4 text-center text-lg font-semibold text-gray-900">{{ v.total_stock }}</td>
                        <td class="whitespace-nowrap px-6 py-4 text-center text-lg font-medium text-orange-600">{{ v.total_reserved_stock }}</td>
                        <td class="whitespace-nowrap px-6 py-4 text-center">
                          <span :class="v.total_available_stock > 0 ? 'text-green-600' : 'text-red-600'" 
                                class="text-lg font-bold">
                            {{ v.total_available_stock }}
                          </span>
                        </td>
                        <td class="whitespace-nowrap px-6 py-4">
                          <span :class="v.total_available_stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" 
                                class="inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium">
                            <span :class="v.total_available_stock > 0 ? 'bg-green-500' : 'bg-red-500'" 
                                  class="h-2 w-2 rounded-full"></span>
                            {{ v.total_available_stock > 0 ? 'متوفر' : 'نفذ' }}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div v-else-if="productStock && !productStock.data" class="rounded-xl border border-gray-200 bg-gray-50 p-8 text-center">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <h3 class="mt-4 text-lg font-medium text-gray-900">لا توجد بيانات مخزون</h3>
                <p class="mt-2 text-sm text-gray-500">لم يتم تسجيل بيانات مخزون لهذا المنتج بعد</p>
              </div>
            </div>
          </div>

          <!-- Variants Section -->
          <div>
            <div class="mb-4 flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-800">المتغيرات</h3>
              <div class="flex items-center gap-3">
                <span class="text-sm text-gray-500">{{ selectedProduct.variants.length }} متغير</span>
                <div class="h-6 w-px bg-gray-300"></div>
                <button @click="exportVariants" class="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  تصدير
                </button>
              </div>
            </div>

            <div class="overflow-hidden rounded-xl border border-gray-200">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">المتغير</th>
                    <th scope="col" class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">سعر الشراء</th>
                    <th scope="col" class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">سعر البيع</th>
                    <th scope="col" class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">تاريخ الانتهاء</th>
                    <th scope="col" class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">الحالة</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white">
                  <tr v-for="v in selectedProduct.variants" :key="v.id" class="hover:bg-gray-50">
                    <td class="px-6 py-4">
                      <div class="flex items-center justify-between">
                        <div class="flex flex-col items-end">
                          <code class="mb-2 rounded bg-gray-100 px-2 py-1 font-mono text-sm text-gray-700">{{ v.sku_variant }}</code>
                          <div class="flex flex-wrap gap-1 justify-end">
                            <span v-for="(val, key) in v.attributes" :key="key" 
                                  class="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-xs text-blue-700">
                              <span class="text-blue-500">{{ key }}:</span>
                              <span class="font-medium">{{ val }}</span>
                            </span>
                          </div>
                        </div>
                        <div class="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200"></div>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="text-right">
                        <span class="text-lg font-bold text-gray-900">{{ v.purchase_price }}$</span>
                        <div class="mt-1 text-xs text-gray-500">تكلفة الوحدة</div>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="text-right">
                        <span class="text-lg font-bold text-green-600">{{ v.sale_price }}$</span>
                        <div class="mt-1 text-xs text-gray-500">سعر البيع</div>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="text-right">
                        <span :class="isExpiringSoon(v.expiry_date) ? 'text-red-600' : 'text-gray-700'" 
                              class="font-medium">
                          {{ formatDate(v.expiry_date) }}
                        </span>
                        <div v-if="isExpiringSoon(v.expiry_date)" class="mt-1 flex items-center gap-1 text-xs text-red-500">
                          <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                          ينتهي قريباً
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <span :class="v.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" 
                            class="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium">
                        <span :class="v.is_active ? 'bg-green-500' : 'bg-red-500'" 
                              class="h-2 w-2 rounded-full"></span>
                        {{ v.is_active ? 'نشط' : 'غير نشط' }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal footer -->
      <div class="border-t border-gray-200 bg-gray-50 px-8 py-6">
        <div class="flex items-center justify-between">
          <!-- <div class="text-sm text-gray-500">
            <span class="font-medium">تاريخ الإنشاء:</span> {{ formatDate(selectedProduct.created_at) }}
            <span v-if="selectedProduct.updated_at" class="mr-4">
              • <span class="font-medium">آخر تحديث:</span> {{ formatDate(selectedProduct.updated_at) }}
            </span>
          </div> -->
          <div class="flex items-center gap-3">
            <button @click="closeModal" type="button" 
                    class="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
              إغلاق
            </button>
            <!-- <button @click="editProduct(selectedProduct)" type="button"
                    class="rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              <div class="flex items-center gap-2">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                تعديل المنتج
              </div>
            </button> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  </div>

  <!-- Modal (create product) -->
  <div v-if="showCreateModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="closeCreateModal">
    <div class="bg-white rounded-lg w-full max-w-2xl mx-4 overflow-auto">
      <header class="flex items-center justify-between p-4 border-b">
        <h3 class="font-semibold text-lg">إضافة منتج جديد</h3>
        <button class="text-gray-500 hover:text-gray-700" @click="closeCreateModal">×</button>
      </header>

<div class="p-4 max-h-[70vh] overflow-y-auto">
          <ProductForm
            :categories="categories"
            :loading="createLoading"
            :example="examplePayload"
            @save="handleCreateProduct"
            @close="closeCreateModal"
          />
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { fetchProducts as apiFetchProducts, fetchCategories } from '../../api/products'
import { fetchProduct as apiFetchProduct, createProduct as apiCreateProduct, deleteProduct as apiDeleteProduct, fetchProductStock as apiFetchProductStock } from '../../api/products'
import ProductForm from './ProductForm.vue'
// example payload used for pre-fill (can be moved to .env or fetched)
const examplePayload: Partial<Product> = {
  sku: 'PROD-4442',
  name: 'Smartphone Xm',
  description: 'Latest smartphone with advanced features',
  category_id: 1,
  is_active: true,
  variants: [
    {
      // backend may fill id/product_id
      id: Date.now(),
      product_id: 0,
      sku_variant: 'PROD-4442-1',
      attributes: { color: 'Black', storage: '128GB' },
      purchase_price: String(500),
      sale_price: String(699),
      expiry_date: '2026-12-31',
      is_active: true,
    }
  ] as any
}
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


// دوال مساعدة إضافية
const isExpiringSoon = (dateString: string) => {
  if (!dateString) return false
  const expiryDate = new Date(dateString)
  const today = new Date()
  const diffTime = expiryDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays <= 30 && diffDays > 0
}

const exportVariants = () => {
  if (!selectedProduct.value) return
  
  const data = selectedProduct.value.variants.map(variant => ({
    'SKU المتغير': variant.sku_variant,
    'الخصائص': Object.entries(variant.attributes || {}).map(([k, v]) => `${k}: ${v}`).join(', '),
    'سعر الشراء': variant.purchase_price,
    'سعر البيع': variant.sale_price,
    'تاريخ الانتهاء': formatDate(variant.expiry_date),
    'الحالة': variant.is_active ? 'نشط' : 'غير نشط'
  }))
  
  const csv = convertToCSV(data)
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `متغيرات_${selectedProduct.value.sku}_${new Date().toISOString().split('T')[0]}.csv`
  link.click()
  
  showToastMessage('تم التصدير', 'تم تصدير بيانات المتغيرات بنجاح')
}

const convertToCSV = (data: any[]) => {
  const headers = Object.keys(data[0])
  const rows = data.map(row => 
    headers.map(header => `"${row[header]}"`).join(',')
  )
  return [headers.join(','), ...rows].join('\n')
}

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
const selectedProduct = ref<Product | null>(null)
const showModal = ref(false)
const modalLoading = ref(false)
const productStock = ref<any | null>(null)
const productStockLoading = ref(false)
const showCreateModal = ref(false)

const openCreateModal = () => { showCreateModal.value = true }
const closeCreateModal = () => { showCreateModal.value = false }

const createLoading = ref(false)

const handleCreateProduct = async (payload: Partial<Product>) => {
  createLoading.value = true
  try {
    // call API to create product
    const res = await apiCreateProduct(payload)
    const created = res.data as Product

    // ensure category object is present (optional)
    if (created && created.category_id && !created.category) {
      created.category = categories.value.find(c => c.id === created.category_id)
    }

    // prepend to products list
    products.value.unshift(created)
    closeCreateModal()
  } catch (e) {
    console.error('Error creating product:', e)
    alert('حدث خطأ عند إنشاء المنتج. تحقق من الاتصال أو سجلات الخادم.')
  } finally {
    createLoading.value = false
  }
}

const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString('ar-EG')
  } catch (e) {
    return dateString
  }
}

const viewProductDetails = async (product: Product) => {
  selectedProduct.value = product
  showModal.value = true
  modalLoading.value = true
  try {
    const res = await apiFetchProduct(product.id)
    const payload = (res && (res as any).data) ? (res as any).data : res
    selectedProduct.value = payload as Product
    // fetch product stock
    try {
      productStockLoading.value = true
      const stockRes = await apiFetchProductStock(product.id)
      // normalize so template can always use productStock.data
      productStock.value = stockRes && (stockRes as any).data ? stockRes : { data: stockRes }
    } catch (e) {
      console.error('Error fetching product stock:', e)
      productStock.value = { data: null }
    } finally {
      productStockLoading.value = false
    }
  } catch (e) {
    console.error('Error fetching product details:', e)
  } finally {
    modalLoading.value = false
  }
}

const closeModal = () => {
  showModal.value = false
  selectedProduct.value = null
  productStock.value = null
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