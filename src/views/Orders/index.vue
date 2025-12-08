<template>
  <div class="p-4 md:p-6 bg-gradient-to-b from-gray-50 to-white min-h-screen" dir="rtl">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-200">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-md">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
            </div>
            <div>
              <h1 class="text-2xl md:text-3xl font-bold text-gray-900">إدارة الطلبات</h1>
              <p class="text-gray-600 mt-2">قائمة جميع طلبات المبيعات ومتابعة حالاتها</p>
            </div>
          </div>

          <div class="flex flex-wrap gap-3">
            <button 
              @click="loadOrders(1)"
              :disabled="loading"
              class="px-5 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200 flex items-center gap-2"
            >
              <svg v-if="loading" class="animate-spin h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              تحديث
            </button>
            
            <button 
              @click="createOrder"
              class="px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              إنشاء طلبية مبيعات
            </button>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div class="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-blue-600 font-medium">إجمالي الطلبات</p>
                <p class="text-2xl font-bold text-gray-800 mt-1">{{ stats.total_orders || 0 }}</p>
              </div>
              <div class="p-2 bg-white rounded-lg">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-green-600 font-medium">طلبات اليوم</p>
                <p class="text-2xl font-bold text-gray-800 mt-1">{{ stats.today_orders || 0 }}</p>
              </div>
              <div class="p-2 bg-white rounded-lg">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-xl border border-yellow-200">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-yellow-600 font-medium">طلبات قيد المعالجة</p>
                <p class="text-2xl font-bold text-gray-800 mt-1">{{ stats.processing_orders || 0 }}</p>
              </div>
              <div class="p-2 bg-white rounded-lg">
                <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl border border-red-200">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-red-600 font-medium">طلبات معلقة</p>
                <p class="text-2xl font-bold text-gray-800 mt-1">{{ stats.pending_orders || 0 }}</p>
              </div>
              <div class="p-2 bg-white rounded-lg">
                <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-200">
        <div class="flex items-center gap-3 mb-6">
          <div class="p-2 bg-purple-100 rounded-lg">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-800">تصفية الطلبات</h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Search -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">بحث</label>
            <div class="relative">
              <input 
                v-model="filters.q" 
                placeholder="كود الطلب، اسم العميل، هاتف..."
                class="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-xl hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              />
              <svg class="absolute left-4 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
          </div>

          <!-- Status -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">حالة الطلب</label>
            <select 
              v-model="filters.status"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl appearance-none hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white"
            >
              <option value="">كل الحالات</option>
              <option value="pending">معلق</option>
              <option value="confirmed">تم التأكيد</option>
              <option value="processing">قيد المعالجة</option>
              <option value="shipped">تم الشحن</option>
              <option value="delivered">تم التسليم</option>
              <option value="cancelled">ملغي</option>
              <option value="returned">مرتجع</option>
            </select>
          </div>

          <!-- Payment Status -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">حالة الدفع</label>
            <select 
              v-model="filters.payment_status"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl appearance-none hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white"
            >
              <option value="">كل حالات الدفع</option>
              <option value="pending">معلق</option>
              <option value="partial">مدفوع جزئياً</option>
              <option value="paid">مدفوع</option>
              <option value="failed">فشل الدفع</option>
              <option value="refunded">تم الاسترداد</option>
            </select>
          </div>

          <!-- Date Range -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">نطاق التاريخ</label>
            <div class="grid grid-cols-2 gap-2">
              <input 
                v-model="filters.date_from" 
                type="date"
                class="px-3 py-2 border-2 border-gray-300 rounded-xl hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              />
              <input 
                v-model="filters.date_to" 
                type="date"
                class="px-3 py-2 border-2 border-gray-300 rounded-xl hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              />
            </div>
          </div>
        </div>

        <!-- Advanced Filters -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <!-- Sort By -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">ترتيب حسب</label>
            <select 
              v-model="filters.sort_by"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl appearance-none hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white"
            >
              <option value="created_at">تاريخ الإنشاء</option>
              <option value="order_date">تاريخ الطلب</option>
              <option value="delivery_date">تاريخ التوصيل</option>
              <option value="total">المبلغ الإجمالي</option>
            </select>
          </div>

          <!-- Sort Direction -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">الاتجاه</label>
            <select 
              v-model="filters.sort_dir"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl appearance-none hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white"
            >
              <option value="desc">تنازلي (الأحدث أولاً)</option>
              <option value="asc">تصاعدي (الأقدم أولاً)</option>
            </select>
          </div>

          <!-- Assigned To -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">المسؤول</label>
            <select 
              v-model="filters.assigned_to"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl appearance-none hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white"
            >
              <option value="">الكل</option>
              <option v-for="user in users" :key="user.id" :value="user.id">{{ user.name }}</option>
            </select>
          </div>
        </div>

        <!-- Active Filters & Actions -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-6 pt-6 border-t">
          <div class="flex flex-wrap gap-2">
            <span v-if="hasActiveFilters" class="text-sm text-gray-600">التصفيات النشطة:</span>
            <span 
              v-if="filters.q"
              class="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              بحث: "{{ filters.q }}"
              <button @click="filters.q = ''" class="text-blue-600 hover:text-blue-800">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </span>
            <span 
              v-if="filters.status"
              class="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
            >
              حالة: {{ getStatusText(filters.status) }}
              <button @click="filters.status = ''" class="text-green-600 hover:text-green-800">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </span>
            <button 
              v-if="hasActiveFilters"
              @click="resetFilters"
              class="text-sm text-gray-600 hover:text-gray-800 underline"
            >
              مسح الكل
            </button>
          </div>

          <div class="flex items-center gap-3">
            <button 
              @click="exportCsv"
              :disabled="orders.length === 0"
              :class="[
                'px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-2',
                orders.length === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-gray-100 to-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              ]"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              تصدير CSV
            </button>
            
            <button 
              @click="exportExcel"
              :disabled="orders.length === 0"
              :class="[
                'px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-2',
                orders.length === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-green-100 to-white border border-green-300 text-green-700 hover:bg-green-50'
              ]"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              تصدير Excel
            </button>
            
            <button 
              @click="applyFilters"
              class="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              تطبيق التصفية
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading && orders.length === 0" class="bg-white rounded-2xl shadow-lg p-12 border border-gray-200">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p class="text-gray-600">جاري تحميل الطلبات...</p>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="orders.length === 0" class="bg-white rounded-2xl shadow-lg p-12 border border-gray-200">
        <div class="text-center max-w-md mx-auto">
          <div class="w-24 h-24 mx-auto mb-6 text-gray-300">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-800 mb-2">لا توجد طلبات</h3>
          <p class="text-gray-600 mb-6">لم يتم العثور على طلبات تطابق معايير البحث الخاصة بك</p>
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <button 
              @click="resetFilters"
              class="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors duration-200"
            >
              عرض جميع الطلبات
            </button>
            <button 
              @click="createOrder"
              class="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200"
            >
              إنشاء طلب جديد
            </button>
          </div>
        </div>
      </div>

      <!-- Orders Table -->
      <div v-else class="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
        <!-- Table Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-b border-gray-200 bg-gray-50">
          <div class="text-sm text-gray-600">
            عرض <span class="font-semibold">{{ orders.length }}</span> من أصل <span class="font-semibold">{{ meta.total || 0 }}</span> طلب
          </div>
          
          <div class="flex items-center gap-2">
            <button 
              @click="printOrders"
              :disabled="orders.length === 0"
              :class="[
                'px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-2',
                orders.length === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-100 to-white border border-blue-300 text-blue-700 hover:bg-blue-50'
              ]"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
              </svg>
              طباعة
            </button>
          </div>
        </div>

        <!-- Orders Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">كود الطلب</th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">العميل</th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">حالة الدفع</th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المبلغ</th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تاريخ الطلب</th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تاريخ التوصيل</th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المسؤول</th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr 
                v-for="order in orders" 
                :key="order.id"
                class="hover:bg-gray-50 transition-colors duration-150"
              >
                <!-- Code -->
                <td class="px-6 py-4">
                  <router-link 
                    :to="{ name: 'OrderDetails', params: { id: order.id } }"
                    class="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                    {{ order.code }}
                  </router-link>
                  <div class="text-xs text-gray-500 mt-1">#{{ order.id }}</div>
                </td>

                <!-- Customer -->
                <td class="px-6 py-4">
                  <div v-if="order.customer" class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {{ getInitials(order.customer.name) }}
                    </div>
                    <div>
                      <router-link 
                        :to="{ name: 'CustomersView', params: { id: order.customer.id } }"
                        class="text-gray-900 hover:text-blue-600 font-medium block"
                      >
                        {{ order.customer.name }}
                      </router-link>
                      <div class="text-xs text-gray-500">{{ order.customer.phone || order.customer.email || '' }}</div>
                    </div>
                  </div>
                  <span v-else class="text-gray-500">-</span>
                </td>

                <!-- Status -->
                <td class="px-6 py-4">
                  <span 
                    :class="getStatusBadgeClass(order.status)"
                    class="px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1"
                  >
                    <span class="w-2 h-2 rounded-full" :class="getStatusDotClass(order.status)"></span>
                    {{ getStatusText(order.status) }}
                  </span>
                </td>

                <!-- Payment Status -->
                <td class="px-6 py-4">
                  <span 
                    :class="getPaymentBadgeClass(order.payment_status)"
                    class="px-3 py-1 rounded-full text-xs font-medium"
                  >
                    {{ getPaymentStatusText(order.payment_status) }}
                  </span>
                </td>

                <!-- Amount -->
                <td class="px-6 py-4">
                  <div class="font-semibold text-gray-900">{{ formatCurrency(order.total) }}</div>
                  <div class="text-xs text-gray-500">{{ order.items_count || 0 }} عنصر</div>
                </td>

                <!-- Order Date -->
                <td class="px-6 py-4">
                  <div class="text-gray-900">{{ formatDate(order.order_date) }}</div>
                  <div class="text-xs text-gray-500">{{ formatTime(order.order_date) }}</div>
                </td>

                <!-- Delivery Date -->
                <td class="px-6 py-4">
                  <div class="text-gray-900">{{ formatDate(order.delivery_date) }}</div>
                  <div v-if="order.delivery_time_slot" class="text-xs text-gray-500">{{ order.delivery_time_slot }}</div>
                </td>

                <!-- Assigned To -->
                <td class="px-6 py-4">
                  <div v-if="order.assigned_to" class="flex items-center gap-2">
                    <div class="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg class="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                      </svg>
                    </div>
                    <span class="text-gray-700">{{ order.assigned_to.name }}</span>
                  </div>
                  <span v-else class="text-gray-500">غير معين</span>
                </td>

                <!-- Actions -->
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <router-link 
                      :to="{ name: 'OrderDetails', params: { id: order.id } }"
                      class="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                      title="عرض التفاصيل"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                      </svg>
                    </router-link>
                    
                    <button 
                      @click="editOrder(order.id)"
                      class="p-2 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 rounded-lg transition-colors duration-200"
                      title="تعديل الطلب"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                      </svg>
                    </button>
                    
                    <button 
                      @click="duplicateOrder(order.id)"
                      class="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors duration-200"
                      title="نسخ الطلب"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 border-t border-gray-200">
          <div class="text-sm text-gray-600">
            الصفحة <span class="font-semibold">{{ meta.current_page }}</span> من <span class="font-semibold">{{ meta.last_page }}</span>
            • إجمالي <span class="font-semibold">{{ meta.total }}</span> طلب
          </div>
          
          <div class="flex items-center gap-2">
            <button 
              @click="loadOrders(meta.current_page - 1)"
              :disabled="meta.current_page <= 1"
              class="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
            
            <div class="flex items-center gap-1">
              <button 
                v-for="page in visiblePages"
                :key="page"
                @click="loadOrders(page)"
                :class="[
                  'min-w-10 h-10 rounded-lg transition-colors duration-200 px-2',
                  meta.current_page === page
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-100 text-gray-700'
                ]"
              >
                {{ page }}
              </button>
              <span v-if="showEllipsis" class="px-2 text-gray-500">...</span>
            </div>
            
            <button 
              @click="loadOrders(meta.current_page + 1)"
              :disabled="meta.current_page >= meta.last_page"
              class="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
          </div>
          
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-600">عرض</span>
            <select 
              v-model="perPage"
              @change="changePerPage"
              class="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span class="text-sm text-gray-600">لكل صفحة</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { fetchOrders } from '../../api/orders'
import { fetchUsers } from '../../api/users'

const router = useRouter()

// State
const orders = ref<any[]>([])
const loading = ref(false)
const users = ref<any[]>([])
const stats = ref<any>({})
const perPage = ref(25)

const meta = ref({
  current_page: 1,
  last_page: 1,
  per_page: 25,
  total: 0
})

const filters = ref({
  q: '',
  status: '',
  payment_status: '',
  date_from: '',
  date_to: '',
  sort_by: 'created_at',
  sort_dir: 'desc',
  assigned_to: ''
})

// Computed
const hasActiveFilters = computed(() => {
  return filters.value.q || 
         filters.value.status || 
         filters.value.payment_status || 
         filters.value.date_from || 
         filters.value.date_to ||
         filters.value.assigned_to
})

const visiblePages = computed(() => {
  const pages: number[] = []
  const maxVisible = 5
  
  if (meta.value.last_page <= maxVisible) {
    for (let i = 1; i <= meta.value.last_page; i++) {
      pages.push(i)
    }
  } else {
    let start = Math.max(1, meta.value.current_page - 2)
    let end = Math.min(meta.value.last_page, start + maxVisible - 1)
    
    if (end - start + 1 < maxVisible) {
      start = end - maxVisible + 1
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
  }
  
  return pages
})

const showEllipsis = computed(() => {
  return meta.value.last_page > visiblePages.value.length && 
         !visiblePages.value.includes(meta.value.last_page)
})

// Helper Functions
const getInitials = (name?: string) => {
  if (!name) return '??'
  return name
    .split(' ')
    .map(s => s.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

const getStatusText = (status?: string) => {
  const s = String(status ?? '')
  const texts: any = {
    'pending': 'معلق',
    'confirmed': 'تم التأكيد',
    'processing': 'قيد المعالجة',
    'shipped': 'تم الشحن',
    'delivered': 'تم التسليم',
    'cancelled': 'ملغي',
    'returned': 'مرتجع'
  }
  return texts[s] || status || 'غير معروف'
}

const getStatusBadgeClass = (status?: string) => {
  const s = String(status ?? '')
  const classes: any = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'confirmed': 'bg-blue-100 text-blue-800',
    'processing': 'bg-indigo-100 text-indigo-800',
    'shipped': 'bg-purple-100 text-purple-800',
    'delivered': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800',
    'returned': 'bg-gray-100 text-gray-800'
  }
  return classes[s] || 'bg-gray-100 text-gray-800'
}

const getStatusDotClass = (status?: string) => {
  const s = String(status ?? '')
  const classes: any = {
    'pending': 'bg-yellow-500',
    'confirmed': 'bg-blue-500',
    'processing': 'bg-indigo-500',
    'shipped': 'bg-purple-500',
    'delivered': 'bg-green-500',
    'cancelled': 'bg-red-500',
    'returned': 'bg-gray-500'
  }
  return classes[s] || 'bg-gray-500'
}

const getPaymentStatusText = (status?: string) => {
  const s = String(status ?? '')
  const texts: any = {
    'pending': 'معلق',
    'partial': 'جزئي',
    'paid': 'مدفوع',
    'failed': 'فشل',
    'refunded': 'مسترد'
  }
  return texts[s] || status || 'غير معروف'
}

const getPaymentBadgeClass = (status?: string) => {
  const s = String(status ?? '')
  const classes: any = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'partial': 'bg-orange-100 text-orange-800',
    'paid': 'bg-green-100 text-green-800',
    'failed': 'bg-red-100 text-red-800',
    'refunded': 'bg-gray-100 text-gray-800'
  }
  return classes[s] || 'bg-gray-100 text-gray-800'
}

const formatDate = (iso?: string) => {
  if (!iso) return '-'
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

const formatTime = (iso?: string) => {
  if (!iso) return ''
  try { 
    return new Date(iso).toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit'
    }) 
  } catch { 
    return '' 
  }
}

const formatCurrency = (val?: string | number) => {
  if (val === null || val === undefined || val === '') return '0.00'
  const num = typeof val === 'number' ? val : Number(String(val))
  if (Number.isNaN(num)) return String(val)
  return new Intl.NumberFormat('ar-SA', { 
    style: 'currency', 
    currency: 'LYD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num)
}

// Load Data
const loadOrders = async (page = 1) => {
  loading.value = true
  try {
    const params: Record<string, any> = {
      page,
      per_page: perPage.value
    }
    
    if (filters.value.q) params.q = filters.value.q
    if (filters.value.status) params.status = filters.value.status
    if (filters.value.payment_status) params.payment_status = filters.value.payment_status
    if (filters.value.date_from) params.date_from = filters.value.date_from
    if (filters.value.date_to) params.date_to = filters.value.date_to
    if (filters.value.sort_by) params.sort_by = filters.value.sort_by
    if (filters.value.sort_dir) params.sort_dir = filters.value.sort_dir
    if (filters.value.assigned_to) params.assigned_to = filters.value.assigned_to

    const res = await fetchOrders(page, params)
    orders.value = res?.data || []
    meta.value = res?.meta || meta.value
    
    // Calculate stats from orders if not provided by API
    calculateStats()
    
  } catch (e) {
    console.error('Failed to load orders', e)
    orders.value = []
  } finally {
    loading.value = false
  }
}

const calculateStats = () => {
  const today = new Date().toISOString().split('T')[0]
  
  stats.value = {
    total_orders: meta.value.total || 0,
    today_orders: orders.value.filter(o => 
      o.order_date && o.order_date.startsWith(today)
    ).length,
    processing_orders: orders.value.filter(o => 
      ['processing', 'confirmed'].includes(o.status)
    ).length,
    pending_orders: orders.value.filter(o => 
      o.payment_status === 'pending'
    ).length
  }
}

const loadUsers = async () => {
  try {
    const res = await fetchUsers()
    users.value = res?.data || []
  } catch (e) {
    console.error('Failed to load users', e)
    users.value = []
  }
}

// Actions
const applyFilters = () => {
  loadOrders(1)
}

const resetFilters = () => {
  filters.value = {
    q: '',
    status: '',
    payment_status: '',
    date_from: '',
    date_to: '',
    sort_by: 'created_at',
    sort_dir: 'desc',
    assigned_to: ''
  }
  loadOrders(1)
}

const changePerPage = () => {
  meta.value.per_page = perPage.value
  loadOrders(1)
}

const createOrder = () => {
  router.push({ name: 'OrderCreate' })
}

const editOrder = (id: number) => {
  router.push({ name: 'OrderEdit', params: { id } })
}

const duplicateOrder = (id: number) => {
  // Implement duplicate order logic
  console.log('Duplicating order:', id)
  // This would typically involve fetching the order and creating a copy
}

const exportCsv = () => {
  if (orders.value.length === 0) {
    alert('لا توجد بيانات للتصدير')
    return
  }
  
  const headers = ['الكود', 'العميل', 'الحالة', 'حالة الدفع', 'المبلغ', 'تاريخ الطلب', 'تاريخ التوصيل', 'المسؤول']
  const rows = orders.value.map(o => [
    o.code,
    o.customer?.name || '',
    getStatusText(o.status),
    getPaymentStatusText(o.payment_status),
    o.total,
    formatDate(o.order_date),
    formatDate(o.delivery_date),
    o.assigned_to?.name || ''
  ])
  
  const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `orders-${new Date().toISOString().split('T')[0]}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const exportExcel = () => {
  if (orders.value.length === 0) {
    alert('لا توجد بيانات للتصدير')
    return
  }
  
  // Create HTML table for Excel
  let table = '<table border="1">'
  table += '<tr><th>الكود</th><th>العميل</th><th>الحالة</th><th>حالة الدفع</th><th>المبلغ</th><th>تاريخ الطلب</th><th>تاريخ التوصيل</th><th>المسؤول</th></tr>'
  
  orders.value.forEach(o => {
    table += `<tr>
      <td>${o.code}</td>
      <td>${o.customer?.name || ''}</td>
      <td>${getStatusText(o.status)}</td>
      <td>${getPaymentStatusText(o.payment_status)}</td>
      <td>${o.total}</td>
      <td>${formatDate(o.order_date)}</td>
      <td>${formatDate(o.delivery_date)}</td>
      <td>${o.assigned_to?.name || ''}</td>
    </tr>`
  })
  
  table += '</table>'
  
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>${table}</body></html>`
  const blob = new Blob([html], { type: 'application/vnd.ms-excel' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `orders-${new Date().toISOString().split('T')[0]}.xls`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const printOrders = () => {
  window.print()
}

// Watchers
watch([filters], () => {
  // Debounce filter changes
  clearTimeout((window as any).filterTimeout)
  ;(window as any).filterTimeout = setTimeout(() => {
    loadOrders(1)
  }, 500)
}, { deep: true })

// Lifecycle
onMounted(() => {
  loadOrders(1)
  loadUsers()
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

/* Table hover effects */
tbody tr {
  transition: all 0.2s ease;
}

tbody tr:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

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

/* Print styles */
@media print {
  .bg-gradient-to-b, .shadow-xl, .shadow-lg, button, select, input, .lg\\:grid-cols-3, .md\\:grid-cols-4, .md\\:grid-cols-2 {
    display: none !important;
  }
  
  .bg-white {
    box-shadow: none !important;
    border: 1px solid #ccc !important;
  }
  
  .grid {
    display: block !important;
  }
  
  table {
    width: 100% !important;
    border-collapse: collapse !important;
  }
  
  th, td {
    border: 1px solid #000 !important;
    padding: 8px !important;
  }
}
</style>