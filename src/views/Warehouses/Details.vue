<template>
  <div class="p-4 md:p-6 bg-gradient-to-b from-gray-50 to-white min-h-screen" dir="rtl">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-200">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div class="flex items-center gap-4">
            <div 
              :class="[
                'w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg',
                warehouse?.is_active 
                  ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                  : 'bg-gradient-to-br from-gray-500 to-gray-600'
              ]"
            >
              {{ warehouse?.name ? initials(warehouse.name) : '??' }}
            </div>
            <div>
              <div class="flex items-center gap-3">
                <h1 class="text-2xl md:text-3xl font-bold text-gray-900">{{ warehouse?.name || 'تحميل...' }}</h1>
                <span 
                  :class="[
                    'px-3 py-1 rounded-full text-sm font-medium',
                    warehouse?.is_active 
                      ? 'bg-green-100 text-green-800 border border-green-200' 
                      : 'bg-gray-100 text-gray-800 border border-gray-200'
                  ]"
                >
                  {{ warehouse?.is_active ? 'نشط' : 'غير نشط' }}
                </span>
              </div>
              <p class="text-gray-600 mt-2">تفاصيل المخزن والتقرير المخزون</p>
            </div>
          </div>

          <div class="flex flex-wrap gap-3">
            <button 
              @click="goBack"
              class="px-5 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200 flex items-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
              </svg>
              عودة
            </button>
            
            <button 
              @click="() => router.push({ name: 'StockMovementCreate', query: { warehouse_id: warehouseId } })"
              class="px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              إضافة حركة مخزون
            </button>
            
            <button 
              @click="() => router.push({ name: 'StockMovementTransfer', query: { from_warehouse_id: warehouseId } })"
              class="px-5 py-2.5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl font-medium hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
              </svg>
              نقل مخزون
            </button>
            
            <button 
              @click="openEdit"
              class="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
              تعديل المخزن
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="bg-white rounded-2xl shadow-lg p-12 border border-gray-200">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p class="text-gray-600">جاري تحميل تفاصيل المخزن...</p>
        </div>
      </div>

      <!-- Main Content -->
      <div v-else-if="warehouse" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column - Warehouse Info -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Warehouse Details Card -->
          <div class="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div class="flex items-center gap-3 mb-6">
              <div class="p-2 bg-blue-100 rounded-lg">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-800">معلومات المخزن</h3>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Basic Info -->
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-500 mb-1">الاسم</label>
                  <p class="text-lg font-semibold text-gray-800">{{ warehouse.name }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-500 mb-1">الرمز</label>
                  <div class="flex items-center gap-2">
                    <span class="px-3 py-1 bg-gray-100 text-gray-800 rounded-lg font-mono font-semibold">{{ warehouse.code }}</span>
                    <span class="text-sm text-gray-400">#{{ warehouse.id }}</span>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-500 mb-1">الحالة</label>
                  <span 
                    :class="[
                      'inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium',
                      warehouse.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    ]"
                  >
                    <span class="w-2 h-2 rounded-full" :class="warehouse.is_active ? 'bg-green-500' : 'bg-gray-500'"></span>
                    {{ warehouse.is_active ? 'نشط' : 'غير نشط' }}
                  </span>
                </div>
              </div>

              <!-- Contact Info -->
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-500 mb-1">الهاتف</label>
                  <div class="flex items-center gap-2">
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                    <span class="text-gray-800">{{ warehouse.phone || 'غير محدد' }}</span>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-500 mb-1">البريد الإلكتروني</label>
                  <div class="flex items-center gap-2">
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89-4.26a2 2 0 012.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                    <span class="text-gray-800">{{ warehouse.email || 'غير محدد' }}</span>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-500 mb-1">المدير</label>
                  <div v-if="warehouse.manager" class="flex items-center gap-2">
                    <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                      </svg>
                    </div>
                    <span class="text-gray-800 font-medium">{{ warehouse.manager.name }}</span>
                  </div>
                  <span v-else class="text-gray-500">غير محدد</span>
                </div>
              </div>

              <!-- Address -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-500 mb-1">العنوان</label>
                <div class="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <svg class="w-6 h-6 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <div>
                    <p v-if="warehouse.address" class="text-gray-800">
                      {{ warehouse.address.city }}، {{ warehouse.address.area }}، {{ warehouse.address.street }} 
                      <span v-if="warehouse.address.building">مبنى {{ warehouse.address.building }}</span>
                    </p>
                    <p v-else class="text-gray-500">لم يتم إضافة عنوان</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Stock Details Card -->
          <div class="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div class="flex items-center gap-3 mb-6">
              <div class="p-2 bg-green-100 rounded-lg">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-800">تفاصيل المخزون</h3>
            </div>

            <div v-if="stockReport">
              <!-- Stock Summary -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div class="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-2xl border border-blue-200">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-sm text-blue-600 font-medium">قيمة المخزون</p>
                      <p class="text-2xl font-bold text-gray-800 mt-1">{{ formatCurrency(stockReport.total_stock_value) }}</p>
                    </div>
                    <div class="p-3 bg-white rounded-xl">
                      <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                  </div>
                </div>

                <div class="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-2xl border border-green-200">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-sm text-green-600 font-medium">المنتجات الفريدة</p>
                      <p class="text-2xl font-bold text-gray-800 mt-1">{{ stockReport.unique_products_count || 0 }}</p>
                    </div>
                    <div class="p-3 bg-white rounded-xl">
                      <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                      </svg>
                    </div>
                  </div>
                </div>

                <div class="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-2xl border border-purple-200">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-sm text-purple-600 font-medium">السعة المتاحة</p>
                      <p class="text-2xl font-bold text-gray-800 mt-1">{{ stockReport.available_capacity || warehouse.capacity || 0 }}</p>
                    </div>
                    <div class="p-3 bg-white rounded-xl">
                      <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Capacity Progress -->
              <div class="mb-8">
                <div class="flex items-center justify-between mb-3">
                  <h4 class="text-lg font-semibold text-gray-800">نسبة استخدام السعة</h4>
                  <span class="text-2xl font-bold" :class="getUtilizationColor(stockReport.utilization_percentage).replace('bg-', 'text-')">
                    {{ stockReport.utilization_percentage || 0 }}%
                  </span>
                </div>
                <div class="h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    :class="[
                      'h-full rounded-full transition-all duration-1000',
                      getUtilizationColor(stockReport.utilization_percentage)
                    ]"
                    :style="{ width: `${Math.min(stockReport.utilization_percentage || 0, 100)}%` }"
                  ></div>
                </div>
                <div class="flex justify-between text-sm text-gray-500 mt-2">
                  <span>0%</span>
                  <span>{{ warehouse.capacity }} وحدة</span>
                  <span>100%</span>
                </div>
              </div>

              <!-- Stock Items Table -->
              <div v-if="stockReport.stock_details && stockReport.stock_details.length">
                <div class="flex items-center justify-between mb-4">
                  <h4 class="text-lg font-semibold text-gray-800">المنتجات في المخزن</h4>
                  <div class="text-sm text-gray-500">
                    إجمالي {{ stockReport.stock_details.length }} منتج
                  </div>
                </div>

                <div class="overflow-x-auto rounded-2xl border border-gray-200">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                      <tr>
                        <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المنتج</th>
                        <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المتغيرات</th>
                        <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الكمية</th>
                        <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">محجوز</th>
                        <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">متاح</th>
                        <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr 
                        v-for="(s, idx) in stockReport.stock_details" 
                        :key="idx"
                        class="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td class="px-6 py-4">
                          <div class="flex items-center">
                            <div class="ml-4">
                              <div class="text-sm font-medium text-gray-900">{{ s.product_name || `#${s.product_variant_id}` }}</div>
                              <div class="text-sm text-gray-500">{{ s.sku || 'بدون SKU' }}</div>
                            </div>
                          </div>
                        </td>
                        <td class="px-6 py-4">
                          <div class="text-sm text-gray-900 max-w-xs">
                            {{ formatAttributes(s.variant_attributes || s.variant_attributes_json || s.attributes || s.variant_attributes_raw) }}
                          </div>
                        </td>
                        <td class="px-6 py-4">
                          <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                            {{ s.quantity || 0 }}
                          </span>
                        </td>
                        <td class="px-6 py-4">
                          <span class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                            {{ s.reserved_quantity || 0 }}
                          </span>
                        </td>
                        <td class="px-6 py-4">
                          <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                            {{ s.available_quantity || 0 }}
                          </span>
                        </td>
                        <td class="px-6 py-4">
                          <span 
                            :class="[
                              'px-3 py-1 rounded-full text-xs font-medium',
                              (s.available_quantity || 0) <= 0 ? 'bg-red-100 text-red-800' :
                              (s.available_quantity || 0) < 10 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            ]"
                          >
                            {{ (s.available_quantity || 0) <= 0 ? 'نفذ' : (s.available_quantity || 0) < 10 ? 'قليل' : 'متوفر' }}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Empty Stock State -->
              <div v-else class="text-center py-12">
                <div class="w-24 h-24 mx-auto mb-6 text-gray-300">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                  </svg>
                </div>
                <h4 class="text-lg font-semibold text-gray-800 mb-2">لا توجد منتجات في المخزن</h4>
                <p class="text-gray-600 mb-6">لم يتم إضافة أي منتجات إلى هذا المخزن بعد</p>
                <button 
                  @click="() => router.push({ name: 'StockMovementCreate', query: { warehouse_id: warehouseId } })"
                  class="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center gap-2 mx-auto"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                  </svg>
                  إضافة منتجات
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Stats & Actions -->
        <div class="space-y-8">
          <!-- Capacity Stats -->
          <div class="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div class="flex items-center gap-3 mb-6">
              <div class="p-2 bg-purple-100 rounded-lg">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-800">إحصائيات السعة</h3>
            </div>

            <div class="space-y-4">
              <div class="flex justify-between items-center">
                <span class="text-gray-600">السعة الإجمالية</span>
                <span class="font-semibold text-gray-800">{{ warehouse.capacity || 0 }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">السعة المستخدمة</span>
                <span class="font-semibold text-blue-600">{{ stockReport?.utilization_percentage || 0 }}%</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">السعة المتاحة</span>
                <span class="font-semibold text-green-600">{{ stockReport?.available_capacity || warehouse.capacity || 0 }}</span>
              </div>
              <div class="flex justify-between items-center pt-4 border-t">
                <span class="text-gray-600">حالة الامتلاء</span>
                <span 
                  :class="[
                    'px-3 py-1 rounded-full text-sm font-medium',
                    stockReport?.is_full ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  ]"
                >
                  {{ stockReport?.is_full ? 'ممتلئ' : 'متاح' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div class="flex items-center gap-3 mb-6">
              <div class="p-2 bg-orange-100 rounded-lg">
                <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-800">إجراءات سريعة</h3>
            </div>

            <div class="space-y-3">
              <button 
                @click="() => router.push({ name: 'WarehouseEdit', params: { id: warehouseId } })"
                class="w-full px-4 py-3 bg-gradient-to-r from-gray-50 to-white border border-gray-300 text-gray-800 rounded-xl font-medium hover:bg-gray-100 transition-all duration-200 flex items-center justify-between group"
              >
                <span>تعديل المخزن</span>
                <svg class="w-5 h-5 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
              </button>
              
              <button 
                @click="() => router.push({ name: 'StockMovementCreate', query: { warehouse_id: warehouseId } })"
                class="w-full px-4 py-3 bg-gradient-to-r from-green-50 to-green-100 border border-green-300 text-green-800 rounded-xl font-medium hover:bg-green-100 transition-all duration-200 flex items-center justify-between group"
              >
                <span>إضافة حركة مخزون</span>
                <svg class="w-5 h-5 text-green-400 group-hover:text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
              </button>
              
              <button 
                @click="() => router.push({ name: 'StockMovementTransfer', query: { from_warehouse_id: warehouseId } })"
                class="w-full px-4 py-3 bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-300 text-yellow-800 rounded-xl font-medium hover:bg-yellow-100 transition-all duration-200 flex items-center justify-between group"
              >
                <span>نقل مخزون</span>
                <svg class="w-5 h-5 text-yellow-400 group-hover:text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                </svg>
              </button>
              
              <button 
                @click="generateReport"
                class="w-full px-4 py-3 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-300 text-blue-800 rounded-xl font-medium hover:bg-blue-100 transition-all duration-200 flex items-center justify-between group"
              >
                <span>تقرير المخزن</span>
                <svg class="w-5 h-5 text-blue-400 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Metadata -->
          <div class="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div class="flex items-center gap-3 mb-6">
              <div class="p-2 bg-gray-100 rounded-lg">
                <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-800">المعلومات</h3>
            </div>

            <div class="space-y-3 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">معرف المخزن</span>
                <span class="font-mono font-semibold">#{{ warehouse.id }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">تم الإنشاء</span>
                <span>{{ formatDate(warehouse.created_at) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">تم التحديث</span>
                <span>{{ formatDate(warehouse.updated_at) }}</span>
              </div>
              <div class="pt-3 border-t">
                <div class="text-gray-600 mb-1">ملاحظات</div>
                <p class="text-gray-800">{{ warehouse.notes || 'لا توجد ملاحظات' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Warehouse Modal -->
    <div v-if="showEdit" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div class="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-75" @click="closeEdit"></div>

        <!-- Modal panel -->
        <div class="inline-block w-full max-w-2xl my-8 text-right align-middle bg-white rounded-2xl shadow-xl transform transition-all">
          <!-- Modal header -->
          <div class="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-t-2xl text-white">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-xl font-bold">تعديل معلومات المخزن</h3>
                <p class="text-sm text-blue-100 mt-1">قم بتعديل بيانات المخزن ثم احفظ التغييرات</p>
              </div>
              <button 
                @click="closeEdit"
                class="p-2 rounded-full hover:bg-white/20 transition-colors duration-200"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Modal body -->
          <form @submit.prevent="submitEdit" class="p-6 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  اسم المخزن
                  <span class="text-red-500">*</span>
                </label>
                <input 
                  v-model="editForm.name" 
                  required
                  class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  placeholder="أدخل اسم المخزن"
                />
              </div>

              <!-- Code -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">رمز المخزن</label>
                <input 
                  v-model="editForm.code" 
                  class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  placeholder="أدخل رمز المخزن"
                />
              </div>

              <!-- Address -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">العنوان</label>
                <select 
                  v-model="editForm.address_id"
                  class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white appearance-none"
                >
                  <option :value="null">اختر عنوان</option>
                  <option v-for="a in addresses" :key="a.id" :value="a.id">
                    {{ a.city }} - {{ a.area }} - {{ a.street }} {{ a.building || '' }}
                  </option>
                </select>
              </div>

              <!-- Manager -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">المدير</label>
                <select 
                  v-model="editForm.manager_id"
                  class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white appearance-none"
                >
                  <option :value="null">اختر مدير</option>
                  <option v-for="u in users" :key="u.id" :value="u.id">
                    {{ u.name }}
                  </option>
                </select>
              </div>

              <!-- Phone -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label>
                <input 
                  v-model="editForm.phone" 
                  class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  placeholder="أدخل رقم الهاتف"
                />
              </div>

              <!-- Email -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
                <input 
                  v-model="editForm.email" 
                  type="email"
                  class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  placeholder="أدخل البريد الإلكتروني"
                />
              </div>

              <!-- Capacity -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">السعة</label>
                <input 
                  v-model="editForm.capacity" 
                  type="number"
                  min="0"
                  class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  placeholder="أدخل سعة المخزن"
                />
              </div>

              <!-- Status -->
              <div class="flex items-center gap-3">
                <label class="relative inline-flex items-center cursor-pointer">
                  <input 
                    v-model="editForm.is_active" 
                    type="checkbox" 
                    class="sr-only peer"
                  />
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
                <div>
                  <span class="text-sm font-medium text-gray-700">حالة المخزن</span>
                  <p class="text-xs text-gray-500">{{ editForm.is_active ? 'نشط' : 'غير نشط' }}</p>
                </div>
              </div>
            </div>

            <!-- Notes -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">ملاحظات</label>
              <textarea 
                v-model="editForm.notes" 
                rows="4"
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                placeholder="أضف أي ملاحظات حول المخزن"
              ></textarea>
            </div>

            <!-- Modal footer -->
            <div class="flex justify-end gap-3 pt-4 border-t">
              <button 
                type="button" 
                @click="closeEdit"
                class="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200"
              >
                إلغاء
              </button>
              <button 
                type="submit" 
                :disabled="editLoading"
                :class="[
                  'px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2',
                  editLoading 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg'
                ]"
              >
                <svg v-if="editLoading" class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                <span>{{ editLoading ? 'جاري الحفظ...' : 'حفظ التغييرات' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchWarehouse, fetchWarehouseStockReport } from '../../api/warehouses'
import { fetchAddresses } from '../../api/addresses'
import { fetchUsers } from '../../api/users'
import { updateWarehouse } from '../../api/warehouses'
import type { Warehouse } from '../../api/warehouses'

const route = useRoute()
const router = useRouter()
const warehouseId = Number(route.params.id || 0)

const warehouse = ref<Warehouse | null>(null)
const stockReport = ref<any>(null)
const loading = ref(false)

// Edit modal state
const showEdit = ref(false)
const editLoading = ref(false)
const addresses = ref<any[]>([])
const users = ref<any[]>([])
const editForm = ref<any>({})

// Helper functions
const initials = (name?: string) => {
  if (!name) return '??'
  return name
    .split(' ')
    .map(s => s.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

const formatCurrency = (val?: number) => {
  if (!val) return '0.00'
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(val)
}

const formatDate = (iso?: string) => {
  if (!iso) return '--'
  try {
    return new Date(iso).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch {
    return iso
  }
}

const getUtilizationColor = (utilization: number) => {
  if (!utilization) return 'bg-gray-300'
  if (utilization < 50) return 'bg-green-500'
  if (utilization < 80) return 'bg-yellow-500'
  return 'bg-red-500'
}

const formatAttributes = (attr: any) => {
  if (!attr) return 'بدون متغيرات'
  if (typeof attr === 'string') {
    try { 
      const parsed = JSON.parse(attr)
      return Object.entries(parsed)
        .map(([k, v]) => `${k}: ${v}`)
        .join('، ')
    } catch { 
      return attr 
    }
  }
  if (typeof attr === 'object') {
    try {
      return Object.entries(attr)
        .map(([k, v]) => `${k}: ${v}`)
        .join('، ')
    } catch {
      return String(attr)
    }
  }
  return String(attr)
}

// Load data
const load = async () => {
  if (!warehouseId) return
  loading.value = true
  try {
    const [wRes, rRes] = await Promise.allSettled([
      fetchWarehouse(warehouseId),
      fetchWarehouseStockReport(warehouseId)
    ])
    
    if (wRes.status === 'fulfilled') {
      warehouse.value = (wRes.value as any)?.data ?? wRes.value
    }
    
    if (rRes.status === 'fulfilled') {
      stockReport.value = (rRes.value as any)?.data ?? rRes.value
    }
  } catch (e) {
    console.error('Failed to load warehouse details', e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  load()
  
  // Open edit modal if query param exists
  if (route.query?.openEdit) {
    const waitForData = async () => {
      if (warehouse.value) {
        openEdit()
        return
      }
      
      const start = Date.now()
      while (!warehouse.value && Date.now() - start < 3000) {
        await new Promise(r => setTimeout(r, 100))
      }
      
      if (warehouse.value) {
        openEdit()
      }
    }
    waitForData()
  }
})

// Navigation
const goBack = () => router.back()

const generateReport = () => {
  // Implement report generation logic
  console.log('Generating report for warehouse:', warehouseId)
}

// Edit modal functions
const openEdit = async () => {
  if (!warehouse.value) return
  
  editForm.value = {
    name: warehouse.value.name,
    code: warehouse.value.code,
    address_id: warehouse.value.address?.id ?? null,
    manager_id: warehouse.value.manager_id ?? warehouse.value.manager?.id ?? null,
    phone: warehouse.value.phone ?? '',
    email: warehouse.value.email ?? '',
    capacity: warehouse.value.capacity ?? '',
    notes: warehouse.value.notes ?? '',
    is_active: warehouse.value.is_active ?? true,
  }

  try {
    const a = await fetchAddresses()
    addresses.value = Array.isArray(a) ? a : (a.data || [])
  } catch (e) {
    console.error('Failed to load addresses', e)
    addresses.value = []
  }

  try {
    const uRes = await fetchUsers()
    users.value = (uRes && uRes.data) ? uRes.data : (Array.isArray(uRes) ? uRes : [])
  } catch (e) {
    console.error('Failed to load users', e)
    users.value = []
  }

  showEdit.value = true
}

const closeEdit = () => {
  showEdit.value = false
}

const submitEdit = async () => {
  if (!warehouseId) return
  
  editLoading.value = true
  try {
    const payload = { ...editForm.value }
    await updateWarehouse(warehouseId, payload)
    
    await load()
    showEdit.value = false
  } catch (e) {
    console.error('Failed to update warehouse', e)
  } finally {
    editLoading.value = false
  }
}
</script>

<style scoped>
/* Custom animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.grid > div {
  animation: fadeIn 0.3s ease-out;
  animation-fill-mode: both;
}

/* Table hover effects */
tbody tr {
  transition: all 0.2s ease;
}

tbody tr:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

/* Custom scrollbar for tables */
.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
</style>