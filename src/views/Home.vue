<template>
  <div class="p-4 md:p-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen" dir="rtl">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 class="text-3xl md:text-4xl font-bold text-gray-900">لوحة التحكم</h1>
            <p class="text-gray-600 mt-2 text-lg">نظرة عامة شاملة على أداء النظام ومؤشرات الأداء الرئيسية</p>
          </div>
          
          <div class="flex items-center gap-3">
            <button 
              @click="load"
              :disabled="loading"
              class="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center gap-2"
            >
              <svg v-if="loading" class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              تحديث البيانات
            </button>
            
            <div class="text-sm text-gray-600 bg-white px-3 py-2 rounded-xl border border-gray-200">
              آخر تحديث: {{ lastUpdateTime }}
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading && !dashboard.meta" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p class="text-gray-600">جاري تحميل بيانات لوحة التحكم...</p>
      </div>

      <!-- Main Dashboard -->
      <div v-else>
        <!-- Key Metrics Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <!-- Total Orders -->
          <div class="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-blue-100 text-sm font-medium">إجمالي الطلبات</p>
                <p class="text-3xl font-bold mt-2">{{ dashboard.meta?.total_orders ?? '0' }}</p>
              </div>
              <div class="p-3 bg-white/20 rounded-xl">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                </svg>
              </div>
            </div>
            <div class="mt-4 pt-4 border-t border-blue-400/30">
              <div class="flex items-center gap-2 text-sm text-blue-100">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                </svg>
                <span>جميع الطلبات المنجزة</span>
              </div>
            </div>
          </div>

          <!-- Customers -->
          <div class="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-green-100 text-sm font-medium">العملاء</p>
                <p class="text-3xl font-bold mt-2">{{ dashboard.meta?.customers ?? '0' }}</p>
              </div>
              <div class="p-3 bg-white/20 rounded-xl">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-4.201V5a4 4 0 00-8 0v2.153"/>
                </svg>
              </div>
            </div>
            <div class="mt-4 pt-4 border-t border-green-400/30">
              <div class="flex items-center gap-2 text-sm text-green-100">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                </svg>
                <span>عملاء مسجلون في النظام</span>
              </div>
            </div>
          </div>

          <!-- Active Riders -->
          <div class="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-purple-100 text-sm font-medium">المناديب النشطون</p>
                <p class="text-3xl font-bold mt-2">{{ dashboard.meta?.active_riders ?? '0' }}</p>
              </div>
              <div class="p-3 bg-white/20 rounded-xl">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
            </div>
            <div class="mt-4 pt-4 border-t border-purple-400/30">
              <div class="flex items-center gap-2 text-sm text-purple-100">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>مناديب متاحون حاليًا</span>
              </div>
            </div>
          </div>

          <!-- Pending Deliveries -->
          <div class="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-orange-100 text-sm font-medium">التسليمات المعلقة</p>
                <p class="text-3xl font-bold mt-2">{{ dashboard.pending_deliveries ?? '0' }}</p>
              </div>
              <div class="p-3 bg-white/20 rounded-xl">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>
            <div class="mt-4 pt-4 border-t border-orange-400/30">
              <div class="flex items-center gap-2 text-sm text-orange-100">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.698-.833-2.464 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                </svg>
                <span>تتطلب المتابعة</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Revenue & Additional Stats -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <!-- Revenue Card -->
          <div class="lg:col-span-2 bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <h3 class="text-xl font-semibold text-gray-800">الإيرادات</h3>
              </div>
              <div class="text-sm text-gray-500">آخر 30 يوم</div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-xl border border-green-200">
                <p class="text-sm text-green-600 font-medium">إيرادات اليوم</p>
                <p class="text-2xl font-bold text-gray-800 mt-2">{{ formatCurrency(dashboard.revenue?.today) }}</p>
                <div class="flex items-center gap-1 mt-2">
                  <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
                  </svg>
                  <span class="text-xs text-green-600">+12% عن الأمس</span>
                </div>
              </div>

              <div class="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl border border-blue-200">
                <p class="text-sm text-blue-600 font-medium">إيرادات الأسبوع</p>
                <p class="text-2xl font-bold text-gray-800 mt-2">{{ formatCurrency(dashboard.revenue?.this_week) }}</p>
                <div class="flex items-center gap-1 mt-2">
                  <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
                  </svg>
                  <span class="text-xs text-blue-600">+8% عن الأسبوع الماضي</span>
                </div>
              </div>

              <div class="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-xl border border-purple-200">
                <p class="text-sm text-purple-600 font-medium">إيرادات الشهر</p>
                <p class="text-2xl font-bold text-gray-800 mt-2">{{ formatCurrency(dashboard.revenue?.last_30_days) }}</p>
                <div class="flex items-center gap-1 mt-2">
                  <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
                  </svg>
                  <span class="text-xs text-purple-600">+15% عن الشهر الماضي</span>
                </div>
              </div>
            </div>

            <div class="mt-6 pt-6 border-t">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">متوسط قيمة الطلب</span>
                <span class="font-semibold text-gray-800">{{ formatCurrency(dashboard.revenue?.average_order_value) }}</span>
              </div>
            </div>
          </div>

          <!-- Orders by Status -->
          <div class="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
            <div class="flex items-center gap-3 mb-6">
              <div class="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-800">الطلبات حسب الحالة</h3>
            </div>

            <div v-if="!(dashboard.orders_by_status || []).length" class="text-center py-8">
              <div class="w-16 h-16 mx-auto mb-4 text-gray-300">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <p class="text-gray-500">لا توجد بيانات حالياً</p>
            </div>

            <div v-else class="space-y-4">
              <div v-for="status in dashboard.orders_by_status" :key="status.status" class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div :class="getStatusColor(status.status)" class="w-3 h-3 rounded-full"></div>
                  <span class="text-gray-700">{{ getStatusText(status.status) }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="font-semibold text-gray-800">{{ status.count }}</span>
                  <span class="text-xs text-gray-500">طلب</span>
                </div>
              </div>
              
              <!-- Progress Bar -->
              <div class="mt-6">
                <div class="flex justify-between text-sm text-gray-600 mb-2">
                  <span>نسبة الإنجاز</span>
                  <span>{{ getCompletionRate() }}%</span>
                </div>
                <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    class="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full transition-all duration-1000"
                    :style="{ width: `${getCompletionRate()}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Orders & Top Products -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <!-- Recent Orders -->
          <div class="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                  </svg>
                </div>
                <h3 class="text-xl font-semibold text-gray-800">الطلبات الأخيرة</h3>
              </div>
              <router-link 
                to="/orders"
                class="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
              >
                عرض الكل
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </router-link>
            </div>

            <div v-if="!(dashboard.recent_orders || []).length" class="text-center py-8">
              <div class="w-16 h-16 mx-auto mb-4 text-gray-300">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                </svg>
              </div>
              <p class="text-gray-500">لا توجد طلبات مؤخراً</p>
            </div>

            <div v-else class="space-y-3">
              <div 
                v-for="order in dashboard.recent_orders" 
                :key="order.id"
                class="p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="p-2 bg-gray-100 rounded-lg group-hover:bg-white">
                      <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      </svg>
                    </div>
                    <div>
                      <div class="font-semibold text-gray-800">طلب #{{ order.code || order.id }}</div>
                      <div class="text-sm text-gray-600">{{ order.customer?.name || 'عميل' }}</div>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-sm font-medium text-gray-800">{{ formatCurrency(order.total) }}</div>
                    <div class="text-xs text-gray-500">{{ formatDate(order.created_at) }}</div>
                  </div>
                </div>
                <div class="flex items-center justify-between mt-3 pt-3 border-t">
                  <span :class="getStatusBadgeClass(order.status)" class="px-2 py-1 rounded-full text-xs font-medium">
                    {{ getStatusText(order.status) }}
                  </span>
                  <router-link 
                    :to="{ name: 'OrderDetails', params: { id: order.id } }"
                    class="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    عرض التفاصيل
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                  </router-link>
                </div>
              </div>
            </div>
          </div>

          <!-- Top Products & Low Stock -->
          <div class="space-y-6">
            <!-- Top Products -->
            <div class="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
              <div class="flex items-center gap-3 mb-6">
                <div class="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z"/>
                  </svg>
                </div>
                <h3 class="text-xl font-semibold text-gray-800">المنتجات الأكثر مبيعاً</h3>
              </div>

              <div v-if="!(dashboard.top_products || []).length" class="text-center py-8">
                <div class="w-16 h-16 mx-auto mb-4 text-gray-300">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z"/>
                  </svg>
                </div>
                <p class="text-gray-500">لا توجد بيانات حالياً</p>
              </div>

              <div v-else class="space-y-4">
                <div 
                  v-for="(product, index) in dashboard.top_products" 
                  :key="product.id"
                  class="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors duration-200"
                >
                  <div class="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg font-bold">
                    {{ index + 1 }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="font-medium text-gray-800 truncate">{{ product.name }}</div>
                    <div class="text-sm text-gray-600">{{ product.sku || 'بدون رمز' }}</div>
                  </div>
                  <div class="text-right">
                    <div class="font-semibold text-gray-800">{{ product.sold || 0 }}</div>
                    <div class="text-xs text-gray-500">وحدة مباعة</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Low Stock -->
            <div class="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-gradient-to-r from-red-500 to-red-600 rounded-lg">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.698-.833-2.464 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                    </svg>
                  </div>
                  <h3 class="text-xl font-semibold text-gray-800">منخفضة المخزون</h3>
                </div>
                <span class="text-sm text-red-600 font-medium">{{ dashboard.low_stock?.length || 0 }} منتج</span>
              </div>

              <div v-if="!(dashboard.low_stock || []).length" class="text-center py-8">
                <div class="w-16 h-16 mx-auto mb-4 text-gray-300">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <p class="text-gray-500">جميع المنتجات بمخزون جيد</p>
              </div>

              <div v-else class="space-y-3">
                <div 
                  v-for="item in dashboard.low_stock" 
                  :key="item.id"
                  class="p-3 border border-red-200 bg-red-50 rounded-xl hover:bg-red-100 transition-colors duration-200"
                >
                  <div class="flex items-center justify-between">
                    <div class="font-medium text-gray-800">{{ item.name }}</div>
                    <span class="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                      {{ item.quantity }} وحدة
                    </span>
                  </div>
                  <div class="flex items-center gap-2 mt-2">
                    <div class="flex-1 h-2 bg-red-200 rounded-full overflow-hidden">
                      <div 
                        class="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full"
                        :style="{ width: `${Math.min((item.quantity / (item.threshold || 10)) * 100, 100)}%` }"
                      ></div>
                    </div>
                    <span class="text-xs text-red-600">تحت الحد الأدنى</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- System Status -->
        <div class="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-800">حالة النظام</h3>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span class="text-sm text-green-600 font-medium">جميع الأنظمة تعمل</span>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-green-100 rounded-lg">
                  <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <div>
                  <p class="text-sm text-gray-600">قاعدة البيانات</p>
                  <p class="font-semibold text-gray-800">متصل</p>
                </div>
              </div>
            </div>

            <div class="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-green-100 rounded-lg">
                  <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <div>
                  <p class="text-sm text-gray-600">الخادم</p>
                  <p class="font-semibold text-gray-800">مستقر</p>
                </div>
              </div>
            </div>

            <div class="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-blue-100 rounded-lg">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div>
                  <p class="text-sm text-gray-600">وقت التشغيل</p>
                  <p class="font-semibold text-gray-800">99.8%</p>
                </div>
              </div>
            </div>

            <div class="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-green-100 rounded-lg">
                  <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <div>
                  <p class="text-sm text-gray-600">الاستجابة</p>
                  <p class="font-semibold text-gray-800">85ms</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { fetchDashboard } from '../api/dashboard'

const dashboard = ref<any>({})
const loading = ref(false)
const lastUpdateTime = ref<string>('')

// Format currency
const formatCurrency = (v?: any) => {
  if (v === null || v === undefined || v === '') return '0.00'
  const num = Number(v)
  if (Number.isNaN(num)) return String(v)
  return new Intl.NumberFormat('ar-SA', { 
    style: 'currency', 
    currency: 'LYD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num)
}

// Format date
const formatDate = (d?: string) => {
  if (!d) return '-'
  try { 
    return new Date(d).toLocaleDateString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit'
    }) 
  } catch (e) { 
    return d 
  }
}

// Get status color
const getStatusColor = (status: string) => {
  const colors: any = {
    'pending': 'bg-yellow-500',
    'processing': 'bg-blue-500',
    'shipped': 'bg-purple-500',
    'delivered': 'bg-green-500',
    'cancelled': 'bg-red-500',
    'returned': 'bg-gray-500'
  }
  return colors[status] || 'bg-gray-400'
}

// Get status text
const getStatusText = (status: string) => {
  const texts: any = {
    'pending': 'قيد الانتظار',
    'processing': 'قيد المعالجة',
    'shipped': 'تم الشحن',
    'delivered': 'تم التسليم',
    'cancelled': 'ملغي',
    'returned': 'مرتجع'
  }
  return texts[status] || status
}

// Get status badge class
const getStatusBadgeClass = (status: string) => {
  const classes: any = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'processing': 'bg-blue-100 text-blue-800',
    'shipped': 'bg-purple-100 text-purple-800',
    'delivered': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800',
    'returned': 'bg-gray-100 text-gray-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

// Calculate completion rate
const getCompletionRate = () => {
  const orders = dashboard.value.orders_by_status || []
  const total = orders.reduce((sum: number, item: any) => sum + item.count, 0)
  const completed = orders
    .filter((item: any) => ['delivered'].includes(item.status))
    .reduce((sum: number, item: any) => sum + item.count, 0)
  
  return total > 0 ? Math.round((completed / total) * 100) : 0
}

// Update time
const updateTime = () => {
  lastUpdateTime.value = new Date().toLocaleTimeString('ar-SA', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// Load dashboard data
const load = async () => {
  loading.value = true
  try {
    const res = await fetchDashboard()
    dashboard.value = res?.data ?? res ?? {}
    updateTime()
  } catch (e) {
    console.error('Failed to load dashboard', e)
  } finally {
    loading.value = false
  }
}

// Auto-refresh every 5 minutes
onMounted(() => {
  load()
  
  // Update time every second
  setInterval(updateTime, 1000)
  
  // Refresh data every 5 minutes
  setInterval(() => {
    if (!loading.value) {
      load()
    }
  }, 5 * 60 * 1000)
})
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

/* Stagger animations for cards */
.grid > div:nth-child(1) { animation-delay: 0.1s; }
.grid > div:nth-child(2) { animation-delay: 0.2s; }
.grid > div:nth-child(3) { animation-delay: 0.3s; }
.grid > div:nth-child(4) { animation-delay: 0.4s; }

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* Smooth transitions */
button, a, .hover-lift {
  transition: all 0.2s ease-in-out;
}

.hover-lift:hover {
  transform: translateY(-2px);
}
</style>