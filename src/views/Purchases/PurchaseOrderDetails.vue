<template>
  <div class="p-4 md:p-6 bg-gradient-to-b from-gray-50 to-white min-h-screen" dir="rtl">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-200">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div class="flex items-center gap-4">
            <div 
              :class="[
                'w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg',
                getStatusColor(order.status)
              ]"
            >
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
            </div>
            <div>
              <div class="flex items-center gap-3">
                <h1 class="text-2xl md:text-3xl font-bold text-gray-900">طلب شراء #{{ order.code || order.id }}</h1>
                <span 
                  :class="[
                    'px-3 py-1 rounded-full text-sm font-medium',
                    getStatusBadgeClass(order.status)
                  ]"
                >
                  {{ getStatusText(order.status) }}
                </span>
              </div>
              <p class="text-gray-600 mt-2">تفاصيل طلب الشراء من المورد</p>
            </div>
          </div>

          <div class="flex flex-wrap gap-3">
            <button 
              @click="$router.back()"
              class="px-5 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200 flex items-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
              </svg>
              رجوع
            </button>
            
            <button 
              v-if="canReceiveOrder"
              @click="receiveOrder"
              class="px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              استلام الطلب
            </button>
            
            <button 
              @click="printOrder"
              class="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
              </svg>
              طباعة الطلب
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="bg-white rounded-2xl shadow-lg p-12 border border-gray-200">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p class="text-gray-600">جاري تحميل تفاصيل طلب الشراء...</p>
        </div>
      </div>

      <!-- Main Content -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column - Order Info -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Order Details Card -->
          <div class="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div class="flex items-center gap-3 mb-6">
              <div class="p-2 bg-blue-100 rounded-lg">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-800">معلومات الطلب</h3>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Supplier Info -->
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-500 mb-1">المورد</label>
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg flex items-center justify-center">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                      </svg>
                    </div>
                    <div>
                      <p class="font-semibold text-gray-800">{{ order.supplier?.name || '-' }}</p>
                      <p class="text-sm text-gray-600">{{ order.supplier?.contact_name || '-' }}</p>
                    </div>
                  </div>
                </div>
                
                <div v-if="order.supplier?.contact_info" class="space-y-1">
                  <div class="flex items-center gap-2 text-sm text-gray-600">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                    <span>{{ order.supplier.contact_info.phone || '-' }}</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm text-gray-600">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89-4.26a2 2 0 012.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                    <span>{{ order.supplier.contact_info.email || '-' }}</span>
                  </div>
                </div>
              </div>

              <!-- Order Dates -->
              <div class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-500 mb-1">تاريخ الطلب</label>
                    <div class="flex items-center gap-2">
                      <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                      <span class="font-medium text-gray-800">{{ formatDate(order.order_date) }}</span>
                    </div>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-500 mb-1">التوصيل المتوقع</label>
                    <div class="flex items-center gap-2">
                      <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      <span class="font-medium text-gray-800">{{ formatDate(order.expected_delivery_date) }}</span>
                    </div>
                  </div>
                </div>

                <!-- Delivery Progress -->
                <div v-if="showDeliveryProgress" class="mt-4">
                  <div class="flex justify-between text-sm text-gray-600 mb-2">
                    <span>معدل التسليم</span>
                    <span>{{ deliveryProgress }}%</span>
                  </div>
                  <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      class="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full transition-all duration-1000"
                      :style="{ width: `${deliveryProgress}%` }"
                    ></div>
                  </div>
                </div>
              </div>

              <!-- Approval Info -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-500">الموافق</label>
                <div v-if="order.approved_by" class="flex items-center gap-2">
                  <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                  </div>
                  <div>
                    <p class="font-medium text-gray-800">{{ order.approved_by.name }}</p>
                    <p class="text-xs text-gray-500">{{ formatDate(order.approved_at) }}</p>
                  </div>
                </div>
                <p v-else class="text-gray-500">لم يتم الاعتماد بعد</p>
              </div>

              <!-- Status Change -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-500">تغيير الحالة</label>
                <div class="flex items-center gap-2">
                  <select 
                    v-model="selectedStatus"
                    class="flex-1 px-3 py-2 border-2 border-gray-300 rounded-xl hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white"
                  >
                    <option value="">اختر الحالة الجديدة</option>
                    <option value="draft">مسودة</option>
                    <option value="pending">قيد الانتظار</option>
                    <option value="ordered">تم الطلب</option>
                    <option value="approved">معتمد</option>
                    <option value="partially_received">مستلم جزئياً</option>
                    <option value="received">مستلم</option>
                    <option value="cancelled">ملغي</option>
                  </select>
                  <button 
                    @click="saveStatus"
                    :disabled="!selectedStatus || selectedStatus === order.status || savingStatus"
                    :class="[
                      'px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-2',
                      (!selectedStatus || selectedStatus === order.status || savingStatus)
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white shadow-md hover:shadow-lg'
                    ]"
                  >
                    <svg v-if="savingStatus" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    حفظ
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Items Card -->
          <div class="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div class="flex items-center gap-3 mb-6">
              <div class="p-2 bg-green-100 rounded-lg">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-800">عناصر الطلب</h3>
              <span class="text-sm text-gray-500">{{ order.lines?.length || 0 }} عنصر</span>
            </div>

            <div v-if="!order.lines || order.lines.length === 0" class="text-center py-12">
              <div class="w-24 h-24 mx-auto mb-6 text-gray-300">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
                </svg>
              </div>
              <p class="text-gray-500">لا توجد عناصر في هذا الطلب</p>
            </div>

            <div v-else class="overflow-x-auto rounded-xl border border-gray-200">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المنتج</th>
                    <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المتغير</th>
                    <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الكمية</th>
                    <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المستلمة</th>
                    <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">سعر الوحدة</th>
                    <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المجموع</th>
                    <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr 
                    v-for="item in order.lines" 
                    :key="item.id"
                    class="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <!-- Product -->
                    <td class="px-6 py-4">
                      <div class="flex items-center">
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900">
                            {{ item.product_variant?.product?.name || 'منتج غير معروف' }}
                          </div>
                          <div class="text-sm text-gray-500">
                            {{ item.product_variant?.product?.code || item.product_variant?.product?.sku || 'بدون رمز' }}
                          </div>
                        </div>
                      </div>
                    </td>

                    <!-- Variant -->
                    <td class="px-6 py-4">
                      <div class="text-sm text-gray-900">
                        {{ item.product_variant?.sku_variant || 'بدون متغير' }}
                      </div>
                      <div class="text-xs text-gray-500">
                        {{ formatAttributes(item.product_variant?.attributes) }}
                      </div>
                    </td>

                    <!-- Quantities -->
                    <td class="px-6 py-4">
                      <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                        {{ item.quantity_ordered || 0 }}
                      </span>
                    </td>
                    
                    <td class="px-6 py-4">
                      <span 
                        :class="[
                          'px-3 py-1 rounded-full text-sm font-semibold',
                          getQuantityStatusClass(item.quantity_ordered, item.quantity_received)
                        ]"
                      >
                        {{ item.quantity_received || 0 }}
                      </span>
                    </td>

                    <!-- Price -->
                    <td class="px-6 py-4">
                      <div class="text-sm text-gray-900">{{ formatCurrency(item.unit_price) }}</div>
                    </td>

                    <!-- Total -->
                    <td class="px-6 py-4">
                      <div class="text-sm font-semibold text-gray-900">
                        {{ formatCurrency((item.quantity_ordered || 0) * (item.unit_price || 0)) }}
                      </div>
                    </td>

                    <!-- Status -->
                    <td class="px-6 py-4">
                      <span 
                        :class="[
                          'px-3 py-1 rounded-full text-xs font-medium',
                          getLineStatusClass(item.quantity_ordered, item.quantity_received)
                        ]"
                      >
                        {{ getLineStatusText(item.quantity_ordered, item.quantity_received) }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Order Summary -->
            <div v-if="order.lines && order.lines.length > 0" class="mt-8 pt-6 border-t">
              <div class="flex justify-end">
                <div class="w-full md:w-1/2 space-y-3">
                  <div class="flex justify-between text-gray-600">
                    <span>إجمالي العناصر:</span>
                    <span class="font-semibold">{{ totalItems }}</span>
                  </div>
                  <div class="flex justify-between text-gray-600">
                    <span>إجمالي الكميات المطلوبة:</span>
                    <span class="font-semibold">{{ totalQuantityOrdered }}</span>
                  </div>
                  <div class="flex justify-between text-gray-600">
                    <span>إجمالي الكميات المستلمة:</span>
                    <span class="font-semibold text-green-600">{{ totalQuantityReceived }}</span>
                  </div>
                  <div class="flex justify-between text-lg font-bold pt-3 border-t">
                    <span class="text-gray-800">المبلغ الإجمالي:</span>
                    <span class="text-gray-900">{{ formatCurrency(order.total_amount) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Actions & Notes -->
        <div class="space-y-8">
          <!-- Order Summary Card -->
          <div class="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div class="flex items-center gap-3 mb-6">
              <div class="p-2 bg-purple-100 rounded-lg">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-800">ملخص الطلب</h3>
            </div>

            <div class="space-y-4">
              <div class="flex justify-between items-center">
                <span class="text-gray-600">رقم الطلب</span>
                <span class="font-mono font-semibold text-gray-800">{{ order.code || order.id }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">حالة الدفع</span>
                <span 
                  :class="[
                    'px-3 py-1 rounded-full text-sm font-medium',
                    order.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                    order.payment_status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  ]"
                >
                  {{ getPaymentStatusText(order.payment_status) }}
                </span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">المبلغ المدفوع</span>
                <span class="font-semibold text-gray-800">{{ formatCurrency(order.paid_amount) }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">المبلغ المتبقي</span>
                <span class="font-semibold text-red-600">{{ formatCurrency(remainingAmount) }}</span>
              </div>
              <div class="pt-4 border-t">
                <div class="text-sm text-gray-600 mb-1">تاريخ الإنشاء</div>
                <div class="font-medium">{{ formatDateTime(order.created_at) }}</div>
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
                @click="receiveOrder"
                :disabled="!canReceiveOrder"
                :class="[
                  'w-full px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-between group',
                  canReceiveOrder
                    ? 'bg-gradient-to-r from-green-50 to-white border border-green-300 text-green-800 hover:bg-green-100'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                ]"
              >
                <span>استلام الطلب</span>
                <svg class="w-5 h-5" :class="canReceiveOrder ? 'text-green-400 group-hover:text-green-600' : 'text-gray-400'"
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
              </button>
              
              <button 
                @click="editOrder"
                class="w-full px-4 py-3 bg-gradient-to-r from-blue-50 to-white border border-blue-300 text-blue-800 rounded-xl font-medium hover:bg-blue-100 transition-all duration-200 flex items-center justify-between group"
              >
                <span>تعديل الطلب</span>
                <svg class="w-5 h-5 text-blue-400 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
              </button>
              
              <button 
                @click="printOrder"
                class="w-full px-4 py-3 bg-gradient-to-r from-gray-50 to-white border border-gray-300 text-gray-800 rounded-xl font-medium hover:bg-gray-100 transition-all duration-200 flex items-center justify-between group"
              >
                <span>طباعة الطلب</span>
                <svg class="w-5 h-5 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
                </svg>
              </button>
              
              <button 
                @click="downloadPDF"
                class="w-full px-4 py-3 bg-gradient-to-r from-red-50 to-white border border-red-300 text-red-800 rounded-xl font-medium hover:bg-red-100 transition-all duration-200 flex items-center justify-between group"
              >
                <span>تحميل PDF</span>
                <svg class="w-5 h-5 text-red-400 group-hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Notes Card -->
          <div class="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div class="flex items-center gap-3 mb-6">
              <div class="p-2 bg-yellow-100 rounded-lg">
                <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-800">ملاحظات</h3>
            </div>

            <div v-if="order.notes" class="p-4 bg-gray-50 rounded-xl">
              <p class="text-gray-700">{{ order.notes }}</p>
            </div>
            <p v-else class="text-gray-500 text-center py-4">لا توجد ملاحظات</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { request } from '../../api'
import { updatePurchaseOrderStatus } from '../../api/purchaseOrders'

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id)

const order = ref<any>({})
const loading = ref(false)
const selectedStatus = ref<string>('')
const savingStatus = ref(false)

// Computed Properties
const canReceiveOrder = computed(() => {
  const status = order.value.status
  return ['ordered', 'approved', 'partially_received'].includes(status)
})

const totalItems = computed(() => {
  return order.value.lines?.length || 0
})

const totalQuantityOrdered = computed(() => {
  return order.value.lines?.reduce((sum: number, line: any) => sum + (line.quantity_ordered || 0), 0) || 0
})

const totalQuantityReceived = computed(() => {
  return order.value.lines?.reduce((sum: number, line: any) => sum + (line.quantity_received || 0), 0) || 0
})

const remainingAmount = computed(() => {
  const total = order.value.total_amount || 0
  const paid = order.value.paid_amount || 0
  return total - paid
})

const deliveryProgress = computed(() => {
  if (totalQuantityOrdered.value === 0) return 0
  return Math.round((totalQuantityReceived.value / totalQuantityOrdered.value) * 100)
})

const showDeliveryProgress = computed(() => {
  return totalQuantityOrdered.value > 0
})

// Helper Functions
const getStatusColor = (status: string) => {
  const colors: any = {
    'draft': 'bg-gray-500',
    'pending': 'bg-yellow-500',
    'ordered': 'bg-blue-500',
    'approved': 'bg-purple-500',
    'partially_received': 'bg-orange-500',
    'received': 'bg-green-500',
    'cancelled': 'bg-red-500'
  }
  return colors[status] || 'bg-gray-500'
}

const getStatusText = (status: string) => {
  const texts: any = {
    'draft': 'مسودة',
    'pending': 'قيد الانتظار',
    'ordered': 'تم الطلب',
    'approved': 'معتمد',
    'partially_received': 'مستلم جزئياً',
    'received': 'مستلم',
    'cancelled': 'ملغي'
  }
  return texts[status] || status
}

const getStatusBadgeClass = (status: string) => {
  const classes: any = {
    'draft': 'bg-gray-100 text-gray-800',
    'pending': 'bg-yellow-100 text-yellow-800',
    'ordered': 'bg-blue-100 text-blue-800',
    'approved': 'bg-purple-100 text-purple-800',
    'partially_received': 'bg-orange-100 text-orange-800',
    'received': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getPaymentStatusText = (status: string) => {
  const texts: any = {
    'pending': 'قيد الانتظار',
    'partial': 'مدفوع جزئياً',
    'paid': 'مدفوع بالكامل',
    'overdue': 'متأخر'
  }
  return texts[status] || status
}

const getQuantityStatusClass = (ordered: number, received: number) => {
  ordered = ordered || 0
  received = received || 0
  
  if (received === 0) return 'bg-gray-100 text-gray-800'
  if (received < ordered) return 'bg-yellow-100 text-yellow-800'
  if (received === ordered) return 'bg-green-100 text-green-800'
  if (received > ordered) return 'bg-red-100 text-red-800'
  return 'bg-gray-100 text-gray-800'
}

const getLineStatusClass = (ordered: number, received: number) => {
  ordered = ordered || 0
  received = received || 0
  
  if (received === 0) return 'bg-gray-100 text-gray-800'
  if (received < ordered) return 'bg-yellow-100 text-yellow-800'
  if (received === ordered) return 'bg-green-100 text-green-800'
  if (received > ordered) return 'bg-red-100 text-red-800'
  return 'bg-gray-100 text-gray-800'
}

const getLineStatusText = (ordered: number, received: number) => {
  ordered = ordered || 0
  received = received || 0
  
  if (received === 0) return 'لم يتم الاستلام'
  if (received < ordered) return 'مستلم جزئياً'
  if (received === ordered) return 'مستلم بالكامل'
  if (received > ordered) return 'استلام زائد'
  return 'غير معروف'
}

const formatDate = (iso?: string) => {
  if (!iso) return 'غير محدد'
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

const formatDateTime = (iso?: string) => {
  if (!iso) return 'غير محدد'
  try { 
    return new Date(iso).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }) 
  } catch { 
    return iso 
  }
}

const formatCurrency = (val?: any) => {
  if (val === null || val === undefined || val === '') return '0.00'
  const num = Number(val)
  if (Number.isNaN(num)) return String(val)
  return new Intl.NumberFormat('ar-SA', { 
    style: 'currency', 
    currency: 'LYD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num)
}

const formatAttributes = (attr: any) => {
  if (!attr) return ''
  if (typeof attr === 'string') {
    try { 
      const parsed = JSON.parse(attr)
      return Object.entries(parsed)
        .map(([k, v]) => `${k}: ${v}`)
        .join(', ')
    } catch { 
      return attr 
    }
  }
  if (typeof attr === 'object') {
    try {
      return Object.entries(attr)
        .map(([k, v]) => `${k}: ${v}`)
        .join(', ')
    } catch {
      return String(attr)
    }
  }
  return String(attr)
}

// Actions
const receiveOrder = () => {
  router.push({ 
    name: 'PurchaseOrderReceives',
    query: { purchase_order_id: id }
  })
}

const editOrder = () => {
  router.push({ 
    name: 'PurchaseOrderEdit',
    params: { id }
  })
}

const printOrder = () => {
  window.print()
}

const downloadPDF = () => {
  // Implement PDF download logic
  console.log('Downloading PDF for order:', id)
}

// Load Order Data
const load = async () => {
  if (!id) return
  loading.value = true
  try {
    const res = await request(`/purchase-orders/${id}`)
    order.value = res?.data || res || {}
    selectedStatus.value = order.value?.status || ''
  } catch (e) {
    console.error('Failed to fetch purchase order', e)
  } finally {
    loading.value = false
  }
}

const saveStatus = async () => {
  if (!id) return
  if (!selectedStatus.value) {
    alert('اختر الحالة الجديدة أولاً')
    return
  }
  
  if (selectedStatus.value === order.value.status) {
    alert('الحالة الحالية هي نفس الحالة المحددة')
    return
  }
  
  if (!confirm(`هل أنت متأكد من تغيير الحالة إلى "${getStatusText(selectedStatus.value)}"؟`)) {
    return
  }
  
  savingStatus.value = true
  try {
    await updatePurchaseOrderStatus(id, selectedStatus.value)
    alert('تم تحديث الحالة بنجاح')
    await load()
  } catch (e) {
    console.error('Update status failed', e)
    alert('فشل تحديث الحالة')
  } finally {
    savingStatus.value = false
  }
}

// Lifecycle
onMounted(() => {
  load()
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
  .bg-gradient-to-b, .shadow-xl, .shadow-lg, button, select, .lg\\:grid-cols-3 {
    display: none !important;
  }
  
  .bg-white {
    box-shadow: none !important;
    border: 1px solid #ccc !important;
  }
  
  .grid {
    display: block !important;
  }
  
  .grid > div {
    break-inside: avoid;
    margin-bottom: 20px;
  }
}
</style>