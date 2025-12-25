<template>
  <div class="min-h-screen bg-gray-50/50 pb-12" dir="rtl">
    <!-- Header Area -->
    <header class="bg-white border-b border-gray-200  top-0 z-30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row md:items-center justify-between py-4 gap-4">
          <!-- Title & Breadcrumb -->
          <div class="flex items-center gap-4">
            <button @click="router.back()" class="p-2 -mr-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" class="transform rotate-180" />
              </svg>
            </button>
            <div>
              <h1 class="text-2xl font-bold text-gray-900 tracking-tight">تفاصيل الطلب <span class="text-gray-400 text-lg font-medium">#{{ order?.code }}</span></h1>
              <div class="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
                <span>{{ formatDate(order?.created_at) }}</span>
                <span>•</span>
                <span :class="['px-2 py-0.5 rounded-full text-xs font-medium', getStatusColor(order?.status)]">
                  {{ statusLabels[order?.status] || order?.status }}
                </span>
                 <span v-if="delivery" class="text-gray-300">|</span>
                 <span v-if="delivery" class="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">توصيل: {{ deliveryStatusLabels[delivery.status] || delivery.status }}</span>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-3">
            <button @click="openInvoice" class="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all">
              <svg class="w-4 h-4 ml-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
              طباعة الفاتورة
            </button>
            <button v-if="canEdit" @click="editOrder" class="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all">
              <svg class="w-4 h-4 ml-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              تعديل
            </button>
            <button v-if="order?.status === 'confirmed' && !delivery" @click="openCreateDelivery" class="inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all">
              <svg class="w-4 h-4 ml-2 text-blue-100" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              إنشاء توصيل
            </button>
          </div>
        </div>
        
        <!-- Tabs -->
        <div class="flex space-x-8 space-x-reverse border-b border-gray-200 mt-2">
           <button @click="activeTab = 'order'" :class="['pb-4 px-1 border-b-2 font-medium text-sm transition-colors', activeTab === 'order' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']">
              تفاصيل الطلب
           </button>
           <button v-if="delivery" @click="activeTab = 'delivery'" :class="['pb-4 px-1 border-b-2 font-medium text-sm transition-colors', activeTab === 'delivery' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']">
              إدارة التوصيل
           </button>
        </div>
      </div>
    </header>

    <main v-if="activeTab === 'order'" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <!-- Order Timeline -->
      <section class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 overflow-x-auto">
        <div class="min-w-[700px]">
           <div class="relative flex items-center justify-between">
             <div class="absolute top-1/2 left-0 right-0 h-1 bg-gray-100 -z-0 rounded-full"></div>
             <div class="absolute top-1/2 right-0 h-1 bg-blue-500 -z-0 rounded-full transition-all duration-1000" :style="{ width: orderProgressPercentage + '%' }"></div>
             
             <div v-for="(step, idx) in orderTimelineSteps" :key="step.key" class="relative z-10 flex flex-col items-center group cursor-default">
               <div :class="[
                 'w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300',
                 isOrderStepConfigured(idx) ? 'bg-blue-600 border-blue-100 text-white shadow-md scale-110' : 
                 (idx === currentOrderStepIndex ? 'bg-white border-blue-500 text-blue-600 shadow-sm scale-110' : 'bg-white border-gray-200 text-gray-300')
               ]">
                 <component :is="step.icon" class="w-5 h-5" />
               </div>
               <span :class="[
                 'mt-3 text-sm font-medium transition-colors duration-300',
                 isOrderStepConfigured(idx) || idx === currentOrderStepIndex ? 'text-gray-900' : 'text-gray-400'
               ]">{{ step.label }}</span>
             </div>
           </div>
        </div>
      </section>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Order Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-100 bg-gray-50/30 flex justify-between items-center">
              <h3 class="text-base font-semibold text-gray-900">المنتجات المطلوبة</h3>
              <span class="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-md">{{ order?.lines?.length || 0 }} عناصر</span>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-right">
                <thead>
                  <tr class="bg-gray-50/50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th class="px-6 py-3">المنتج</th>
                    <th class="px-6 py-3 text-center">الكمية</th>
                    <th class="px-6 py-3">سعر الوحدة</th>
                    <th class="px-6 py-3">الإجمالي</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                  <tr v-for="line in order?.lines" :key="line.id" class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-300">
                           <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        </div>
                        <div>
                          <p class="text-sm font-medium text-gray-900">{{ line.product_variant?.product?.name }}</p>
                          <p class="text-xs text-gray-500 mt-0.5">{{ formatAttributes(line.product_variant?.attributes) }}</p>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-center">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">{{ line.quantity }}</span>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-600 font-mono">{{ formatCurrency(line.unit_price) }}</td>
                    <td class="px-6 py-4 text-sm font-semibold text-gray-900 font-mono">{{ formatCurrency(line.total_price || (line.quantity * line.unit_price)) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="bg-gray-50/50 p-6 border-t border-gray-100">
              <div class="flex flex-col sm:flex-row justify-end gap-8">
                <div class="w-full sm:w-64 space-y-3">
                  <div class="flex justify-between text-sm text-gray-600">
                     <span>المجموع الفرعي</span>
                     <span class="font-medium font-mono">{{ formatCurrency(order?.subtotal || order?.total) }}</span>
                  </div>
                  <div v-if="order?.discount_amount" class="flex justify-between text-sm text-green-600">
                    <span>الخصم</span>
                    <span class="font-medium font-mono">- {{ formatCurrency(order.discount_amount) }}</span>
                  </div>
                  <div v-if="order?.shipping_fee" class="flex justify-between text-sm text-gray-600">
                    <span>رسوم الشحن</span>
                    <span class="font-medium font-mono">+ {{ formatCurrency(order.shipping_fee) }}</span>
                  </div>
                  <div class="pt-3 border-t border-gray-200 flex justify-between items-center">
                    <span class="text-base font-bold text-gray-900">الإجمالي النهائي</span>
                    <span class="text-xl font-bold text-blue-600 font-mono">{{ formatCurrency(order?.total) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
           <div v-if="order?.notes || order?.internal_notes" class="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div v-if="order?.notes" class="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                <h4 class="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">ملاحظات العميل</h4>
                <p class="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-lg">{{ order.notes }}</p>
             </div>
             <div v-if="order?.internal_notes" class="bg-yellow-50 rounded-xl border border-yellow-100 p-5 shadow-sm">
                <h4 class="text-sm font-semibold text-yellow-800 mb-3 flex items-center gap-2">ملاحظات داخلية</h4>
                <p class="text-sm text-yellow-700 leading-relaxed">{{ order.internal_notes }}</p>
             </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 class="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">تحديث الحالة</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1.5">الحالة التالية المتاحة</label>
                <div class="relative">
                  <select v-model="orderStatusToSet" class="block w-full pl-3 pr-10 py-2.5 text-sm border border-gray-200 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg bg-gray-50 appearance-none transition-shadow">
                    <option value="" disabled>اختر الحالة...</option>
                    <option v-for="s in allowedOrderStatuses" :key="s" :value="s">{{ statusLabels[s] || s }}</option>
                  </select>
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>
              <button @click="changeOrderStatus" :disabled="!orderStatusToSet" class="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all">تحديث الحالة</button>
            </div>
          </div>

          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">بيانات العميل</h3>
            <div class="flex items-center gap-4 mb-4">
               <div class="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">{{ order?.customer?.name?.charAt(0) || '?' }}</div>
               <div>
                 <p class="font-bold text-gray-900">{{ order?.customer?.name }}</p>
                 <p class="text-sm text-gray-500 dir-ltr text-right">{{ order?.customer?.phone }}</p>
               </div>
            </div>
          </div>

           <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">عنوان التوصيل</h3>
            <div v-if="order?.delivery_address" class="space-y-3">
               <div class="flex gap-3">
                 <div class="mt-0.5"><svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg></div>
                 <div>
                   <p class="text-sm font-medium text-gray-900">{{ order.delivery_address.city }}، {{ order.delivery_address.area }}</p>
                   <p class="text-sm text-gray-500 leading-relaxed mt-1">{{ order.delivery_address.street }}</p>
                 </div>
               </div>
            </div>
            <div v-else class="text-center py-6 bg-gray-50 rounded-lg text-gray-500 text-sm">لا يوجد عنوان مسجل</div>
          </div>
        </div>
      </div>
    </main>
    
    <!-- Delivery Tab Content -->
    <main v-if="activeTab === 'delivery' && delivery" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
       <!-- Delivery Timeline -->
      <section class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 overflow-x-auto">
        <div class="min-w-[700px]">
           <div class="relative flex items-center justify-between">
             <div class="absolute top-1/2 left-0 right-0 h-1 bg-gray-100 -z-0 rounded-full"></div>
             <div class="absolute top-1/2 left-0 h-1 bg-blue-500 -z-0 rounded-full transition-all duration-1000" :style="{ width: deliveryProgressPercentage + '%' }"></div>
             
             <div v-for="(step, idx) in deliveryTimelineSteps" :key="step.key" class="relative z-10 flex flex-col items-center group cursor-default">
               <div :class="[
                 'w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300',
                 isDeliveryStepConfigured(idx) ? 'bg-blue-600 border-blue-100 text-white shadow-md scale-110' : 
                 (idx === currentDeliveryStepIndex ? 'bg-white border-blue-500 text-blue-600 shadow-sm scale-110' : 'bg-white border-gray-200 text-gray-300')
               ]">
                 <component :is="step.icon" class="w-5 h-5" />
               </div>
               <span :class="[
                 'mt-3 text-sm font-medium transition-colors duration-300',
                 isDeliveryStepConfigured(idx) || idx === currentDeliveryStepIndex ? 'text-gray-900' : 'text-gray-400'
               ]">{{ step.label }}</span>
             </div>
           </div>
        </div>
      </section>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Delivery Content Left -->
        <div class="lg:col-span-2 space-y-6">
           <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-6">
               <h3 class="text-base font-semibold text-gray-900 mb-6">سجل التتبع</h3>
               <div v-if="!(delivery.tracking_updates || []).length" class="text-center py-6 text-gray-400 text-sm">لا توجد تحديثات متاحة بعد</div>
               <div v-else class="space-y-8 relative pl-4 pr-2">
                  <div class="absolute top-2 bottom-2 right-[15px] w-0.5 bg-gray-100"></div>
                  <div v-for="(u, idx) in delivery.tracking_updates" :key="u.id" class="relative flex items-start gap-4">
                     <div :class="['relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-4 bg-white shrink-0', idx === 0 ? 'border-blue-100 text-blue-600' : 'border-gray-100 text-gray-400']">
                        <div :class="['w-2.5 h-2.5 rounded-full', idx === 0 ? 'bg-blue-600' : 'bg-gray-300']"></div>
                     </div>
                     <div class="bg-gray-50 rounded-lg p-4 flex-1 border border-gray-100">
                        <div class="flex flex-col sm:flex-row justify-between items-start gap-2">
                           <div>
                              <h4 class="font-bold text-gray-900 text-sm">{{ u.status }}</h4>
                              <p class="text-sm text-gray-600 mt-1">{{ u.notes || '—' }}</p>
                           </div>
                           <span class="text-xs text-gray-400 font-mono whitespace-nowrap">{{ formatDate(u.created_at) }}</span>
                        </div>
                     </div>
                  </div>
               </div>
           </div>

           <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 class="text-base font-bold text-gray-900 mb-4">تفاصيل المزود والمندوب</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">مزود الخدمة</label>
                    <div class="flex items-center gap-3">
                       <div class="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                           <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                       </div>
                       <div>
                          <p class="font-medium text-gray-900">{{ delivery.provider?.name ?? '-' }}</p>
                          <p class="text-xs text-gray-500 font-mono">{{ delivery.provider?.phone ?? '' }}</p>
                       </div>
                    </div>
                 </div>
                 <div class="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                    <label class="block text-xs font-semibold text-blue-800 uppercase tracking-wider mb-2">المندوب المُعين</label>
                    <div v-if="delivery.rider" class="flex items-center gap-3">
                       <div class="h-10 w-10 rounded-full bg-white border border-blue-100 flex items-center justify-center text-blue-600 font-bold shadow-sm">{{ delivery.rider.name?.charAt(0) || 'R' }}</div>
                       <div>
                          <p class="font-bold text-blue-900 text-sm">{{ delivery.rider.name }}</p>
                          <p class="text-xs text-blue-700 font-mono">{{ delivery.rider.phone }}</p>
                       </div>
                    </div>
                    <div v-else class="flex items-center gap-2 text-gray-500 text-sm italic">
                       <span>لم يتم تعيين مندوب بعد</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        <!-- Delivery Sidebar -->
        <div class="space-y-6">
           <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
             <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wider">ملخص التوصيل</h3>
             <div class="flex justify-between items-center py-2 border-b border-gray-50">
                <span class="text-sm text-gray-600">رقم التتبع</span>
                <span class="font-bold text-gray-900 font-mono">{{ delivery.tracking_number }}</span>
             </div>
             <div class="flex justify-between items-center py-2 border-b border-gray-50">
                <span class="text-sm text-gray-600">رسوم التوصيل</span>
                <span class="font-bold text-gray-900 font-mono">{{ formatCurrency(delivery.delivery_fee) }}</span>
             </div>
             <div class="flex justify-between items-center py-2 border-b border-gray-50">
                <span class="text-sm text-gray-600">المسافة</span>
                <span class="font-medium text-gray-900 font-mono">{{ delivery.distance_km || 0 }} كم</span>
             </div>
             <div class="flex justify-between items-center py-2 border-b border-gray-50">
                <span class="text-sm text-gray-600">الوزن</span>
                <span class="font-medium text-gray-900 font-mono">{{ delivery.weight_kg || 0 }} كجم</span>
             </div>
           </div>
           
           <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
             <h3 class="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">تحديث حالة التوصيل</h3>
             <div class="space-y-4">
                 <select v-model="deliveryStatusToSet" :disabled="allowedDeliveryStatusOptions.length === 0" class="block w-full px-3 py-2 text-sm border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                    <option value="" disabled>{{ allowedDeliveryStatusOptions.length ? 'اختر الحالة...' : 'لا توجد حالات متاحة' }}</option>
                    <option v-for="opt in allowedDeliveryStatusOptions" :key="opt.value" :value="opt.value">{{ opt.text }}</option>
                 </select>
                 <button @click="changeDeliveryStatus" :disabled="deliverySaving || !deliveryStatusToSet" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none disabled:opacity-50">تحديث الحالة</button>
             </div>
           </div>
           
           <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
             <h3 class="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">إدارة المندوب</h3>
             <div v-if="ridersForProvider.length" class="space-y-3">
                 <select v-model.number="selectedRider" :disabled="!canAssignRider && !canReassignRider" class="block w-full px-3 py-2 text-sm border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                    <option value="" disabled>{{ canAssignRider ? 'اختر مندوب للتعيين' : (canReassignRider ? 'اختر مندوب جديد' : 'غير متاح للتعديل') }}</option>
                    <option v-for="r in ridersForProvider" :key="r.id" :value="r.id">{{ r.name }}</option>
                 </select>
                 <button @click="reassignRider" :disabled="deliverySaving || !selectedRider || (!canAssignRider && !canReassignRider)" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none disabled:opacity-50">
                    {{ canAssignRider ? 'تأكيد التعيين' : 'إعادة التعيين' }}
                 </button>
             </div>
             <div v-else class="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-lg">لا يوجد مناديب متاحين</div>
          </div>
          
           <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
             <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">إثبات التسليم</h3>
             <label class="block w-full cursor-pointer bg-gray-50 border border-gray-300 border-dashed rounded-lg p-6 text-center hover:bg-gray-100 transition-colors group">
                <span class="mt-2 block text-xs text-gray-500">{{ selectedFile ? selectedFile.name : 'اضغط لرفع ملف الإثبات' }}</span>
                <input ref="fileInput" type="file" @change="onFileChange" class="hidden" />
             </label>
             <button @click="uploadDeliveryProof" :disabled="deliverySaving || !selectedFile" class="mt-3 w-full flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none disabled:opacity-50 transition-colors">رفع الملف</button>
          </div>
        </div>
      </div>
    </main>

    <!-- Create Delivery Modal -->
    <div v-if="showCreateDelivery" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-gray-900/60 transition-opacity backdrop-blur-sm" @click="closeCreate"></div>
        <div class="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all">
          <div class="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
             <h3 class="text-lg font-bold text-gray-900">إنشاء توصيل جديد</h3>
             <button @click="closeCreate" class="text-gray-400 hover:text-gray-500"><svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
          </div>
          
          <div class="p-6 space-y-5">
             <div>
               <label class="block text-sm font-medium text-gray-700 mb-1.5">مزود التوصيل</label>
               <select v-model.number="createForm.provider_id" class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm">
                 <option value="">اختر مزوداً...</option>
                 <option v-for="p in providers" :key="p.id" :value="p.id">{{ p.name }}</option>
               </select>
             </div>
             <div>
               <label class="block text-sm font-medium text-gray-700 mb-1.5">الوقت المتوقع</label>
               <input v-model="createForm.estimated_delivery_time" type="datetime-local" class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm" />
             </div>
             <div class="grid grid-cols-2 gap-4">
               <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">الوزن (كجم)</label>
                  <input v-model.number="createForm.weight_kg" type="number" step="0.01" class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm" />
               </div>
               <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">المسافة (كم)</label>
                  <input v-model.number="createForm.distance_km" type="number" step="0.01" class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm" />
               </div>
             </div>
             <div v-if="createForm.provider_id" class="bg-blue-50 p-4 rounded-xl border border-blue-100 flex justify-between items-center">
               <span class="text-sm font-medium text-blue-900">التكلفة التقديرية</span>
               <span class="text-lg font-bold text-blue-700 font-mono">{{ previewFee !== null ? formatCurrency(previewFee) : '--' }}</span>
             </div>
          </div>
          
          <div class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-3">
             <button @click="closeCreate" class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">إلغاء</button>
             <button @click="submitCreateDelivery" :disabled="!createForm.provider_id || creating" class="flex-1 px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
               <span v-if="creating">جاري الإنشاء...</span>
               <span v-else>تأكيد وإنشاء</span>
             </button>
          </div>
        </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, defineComponent, h } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchOrder, updateOrderStatus } from '../../api/orders'
import { fetchDeliveryProviders } from '../../api/deliveryProviders'
import { createDeliveryForOrder, fetchDeliveries, fetchDelivery, uploadProof, assignRiderToDelivery, updateDeliveryStatus } from '../../api/deliveries'
import { fetchRiders } from '../../api/riders'
import { formatAttributes } from '../../utils/helpers'
import { useToast } from '../../composables/useToast'

// Icons
const IconClipboard = defineComponent({ render: () => h('svg', { fill:'none', viewBox:'0 0 24 24', stroke:'currentColor', class:'w-5 h-5' }, [h('path', { 'stroke-linecap':'round', 'stroke-linejoin':'round', 'stroke-width':'2', d:'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' })]) })
const IconCheckCircle = defineComponent({ render: () => h('svg', { fill:'none', viewBox:'0 0 24 24', stroke:'currentColor', class:'w-5 h-5' }, [h('path', { 'stroke-linecap':'round', 'stroke-linejoin':'round', 'stroke-width':'2', d:'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' })]) })
const IconTruck = defineComponent({ render: () => h('svg', { fill:'none', viewBox:'0 0 24 24', stroke:'currentColor', class:'w-5 h-5' }, [h('path', { 'stroke-linecap':'round', 'stroke-linejoin':'round', 'stroke-width':'2', d:'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' })]) }) 
const IconClock = defineComponent({ render: () => h('svg', { fill:'none', viewBox:'0 0 24 24', stroke:'currentColor', class:'w-5 h-5' }, [h('path', { 'stroke-linecap':'round', 'stroke-linejoin':'round', 'stroke-width':'2', d:'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' })]) })
const IconBox = defineComponent({ render: () => h('svg', { fill:'none', viewBox:'0 0 24 24', stroke:'currentColor', class:'w-5 h-5' }, [h('path', { 'stroke-linecap':'round', 'stroke-linejoin':'round', 'stroke-width':'2', d:'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' })]) })
const IconHome = defineComponent({ render: () => h('svg', { fill:'none', viewBox:'0 0 24 24', stroke:'currentColor', class:'w-5 h-5' }, [h('path', { 'stroke-linecap':'round', 'stroke-linejoin':'round', 'stroke-width':'2', d:'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' })]) })
const IconUser = defineComponent({ render: () => h('svg', { fill:'none', viewBox:'0 0 24 24', stroke:'currentColor', class:'w-5 h-5' }, [h('path', { 'stroke-linecap':'round', 'stroke-linejoin':'round', 'stroke-width':'2', d:'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' })]) })
const IconCheck = defineComponent({ render: () => h('svg', { fill:'none', viewBox:'0 0 24 24', stroke:'currentColor', class:'w-5 h-5' }, [h('path', { 'stroke-linecap':'round', 'stroke-linejoin':'round', 'stroke-width':'2', d:'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' })]) })

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id || 0)
const { addToast } = useToast()

const order = ref<any>(null)
const delivery = ref<any>(null)
const activeTab = ref<'order' | 'delivery'>('order')

const orderStatusToSet = ref('')
const deliveryStatusToSet = ref('')

const ridersForProvider = ref<any[]>([])
const selectedRider = ref<number | null>(null)
const deliverySaving = ref(false)
const selectedFile = ref<File | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

// --- Mappings & options ---
const validOrderTransitions: Record<string, string[]> = {
  draft: ['pending', 'cancelled'],
  pending: ['confirmed', 'cancelled'],
  confirmed: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered', 'returned'],
  delivered: ['returned'],
  cancelled: [],
  returned: []
}

const statusLabels: Record<string, string> = {
  draft: 'مسودة', status: 'الحالة', pending: 'قيد الانتظار', confirmed: 'معتمد', processing: 'قيد التجهيز', shipped: 'تم الشحن', delivered: 'تم التسليم', returned: 'معاد', cancelled: 'ملغي'
}

const deliveryStatusLabels: Record<string, string> = {
  pending: 'قيد الانتظار', assigned: 'معين', picked_up: 'تم الاستلام', in_transit: 'قيد التوصيل', delivered: 'تم التسليم', failed: 'فشل التسليم', cancelled: 'ملغي', returned: 'معاد'
}

const deliveryTransitions: Record<string, string[]> = {
  pending: ['assigned', 'cancelled'],
  assigned: ['picked_up', 'cancelled'],
  picked_up: ['in_transit', 'failed', 'cancelled'],
  in_transit: ['delivered', 'failed', 'returned'],
  delivered: [],
  failed: ['assigned'],
  cancelled: [],
  returned: ['assigned'],
}

// --- Timelines ---
const orderTimelineSteps = [
  { key: 'draft', label: 'مسودة', icon: IconClipboard },
  { key: 'pending', label: 'قيد الانتظار', icon: IconClock },
  { key: 'confirmed', label: 'معتمد', icon: IconCheckCircle },
  { key: 'processing', label: 'قيد التجهيز', icon: IconBox },
  { key: 'shipped', label: 'تم الشحن', icon: IconTruck },
  { key: 'delivered', label: 'تم التسليم', icon: IconHome },
]
const currentOrderStepIndex = computed(() => orderTimelineSteps.findIndex(step => step.key === (order.value?.status || '').toLowerCase()))
const isOrderStepConfigured = (idx: number) => currentOrderStepIndex.value !== -1 && idx < currentOrderStepIndex.value
const orderProgressPercentage = computed(() => {
  if (currentOrderStepIndex.value <= 0) return 0
  return (currentOrderStepIndex.value / (orderTimelineSteps.length - 1)) * 100
})

const deliveryTimelineSteps = [
  { key: 'pending', label: 'قيد الانتظار', icon: IconClock },
  { key: 'assigned', label: 'تم التعيين', icon: IconUser },
  { key: 'picked_up', label: 'تم الاستلام', icon: IconBox },
  { key: 'in_transit', label: 'في الطريق', icon: IconTruck },
  { key: 'delivered', label: 'تم التسليم', icon: IconCheck },
]
const currentDeliveryStepIndex = computed(() => deliveryTimelineSteps.findIndex(step => step.key === (delivery.value?.status || '').toLowerCase()))
const isDeliveryStepConfigured = (idx: number) => currentDeliveryStepIndex.value !== -1 && idx < currentDeliveryStepIndex.value
const deliveryProgressPercentage = computed(() => {
  if (currentDeliveryStepIndex.value <= 0) return 0
  return (currentDeliveryStepIndex.value / (deliveryTimelineSteps.length - 1)) * 100
})

// --- Computed ---
const allowedOrderStatuses = computed(() => validOrderTransitions[String(order.value?.status || '').toLowerCase()] || [])
const canEdit = computed(() => ['pending', 'draft'].includes((order.value?.status || '').toLowerCase()))
const allowedDeliveryStatusOptions = computed(() => {
   const s = String(delivery.value?.status || '').toLowerCase()
   const arr = deliveryTransitions[s] || []
   // disable 'assigned' via dropdown
   return arr.filter(x => x !== 'assigned').map(x => ({ value: x, text: deliveryStatusLabels[x] || x }))
})
const canAssignRider = computed(() => (delivery.value?.status || '') === 'pending')
const canReassignRider = computed(() => ['assigned', 'picked_up', 'failed', 'returned'].includes((delivery.value?.status || '')))

// --- Methods ---
const load = async () => {
  if (!id) return
  try {
    // 1. Fetch Order
    const res = await fetchOrder(id)
    order.value = res?.data?.data || res?.data || null
    
    // 2. Fetch Delivery associated with order. 
    // Ideally order has 'delivery' or we query deliveries by order_id. 
    // We try to use what's in order if included, otherwise fetch list filtering by order_id
    if (order.value?.delivery) {
       delivery.value = order.value.delivery
    } else {
       // fallback search
       const dRes = await fetchDeliveries(1, { order_id: id })
       // if we found one
       const list = dRes?.data?.data ?? dRes?.data ?? []
       if (list.length > 0) delivery.value = list[0]
       else delivery.value = null
    }

    // Load riders if delivery exists
     if (delivery.value) {
       const pid = delivery.value.provider_id || delivery.value.provider?.id
       if (pid) {
          const rRes = await fetchRiders(1, { provider_id: pid })
          ridersForProvider.value = rRes?.data?.data ?? rRes?.data ?? []
       }
       // If no tab selected, maybe switch to order. But if user just created delivery, they might want to see it? keping default 'order'.
    }

  } catch (e) { console.error(e) }
}

onMounted(() => load())

const changeOrderStatus = async () => {
  if (!order.value?.id || !orderStatusToSet.value) return
  try {
    await updateOrderStatus(order.value.id, orderStatusToSet.value)
    await load()
    orderStatusToSet.value = ''
    addToast('تم تحديث حالة الطلب', 'success')
  } catch (e) { console.error(e) }
}

const changeDeliveryStatus = async () => {
  if (!delivery.value || !deliveryStatusToSet.value) return
  const s = String(delivery.value.status || '').toLowerCase()
  const allowed = deliveryTransitions[s] || []
  if (!allowed.includes(deliveryStatusToSet.value)) {
     alert('غير مسموح')
     return
  }
  deliverySaving.value = true
  try {
     await updateDeliveryStatus(delivery.value.id, { status: deliveryStatusToSet.value })
     await load()
     deliveryStatusToSet.value = ''
     addToast('تم تحديث حالة التوصيل', 'success')
  } catch (e) {
     console.error(e) 
     addToast('حدث خطأ', 'error')
  } finally { deliverySaving.value = false }
}

const reassignRider = async () => {
   if (!delivery.value || !selectedRider.value) return
   deliverySaving.value = true
   try {
      await assignRiderToDelivery(delivery.value.id, { rider_id: selectedRider.value })
      await load()
      addToast('تم تعيين المندوب', 'success')
   } catch(e) {
      addToast('فشل تعيين المندوب', 'error') 
   } finally { deliverySaving.value = false }
}

const onFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const f = target.files?.[0] ?? null
  selectedFile.value = f
}

const uploadDeliveryProof = async () => {
   if (!delivery.value || !selectedFile.value) return
   deliverySaving.value = true
   try {
      await uploadProof(delivery.value.id, selectedFile.value)
      await load()
      addToast('تم رفع الإثبات', 'success')
      selectedFile.value = null
      if (fileInput.value) fileInput.value.value = ''
   } catch (e) { addToast('فشل الرفع', 'error') }
   finally { deliverySaving.value = false }
}

// Helpers
const formatDate = (iso?: string) => {
  if (!iso) return '—'
  try { return new Date(iso).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit' }) } catch { return iso }
}
const formatCurrency = (val?: number) => {
  if (val == null) return '0.00 د.ل'
  return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(val) + ' د.ل'
}
// Removed recursive formatAttributes definition to use imported one
const getStatusColor = (s?: string) => {
  const m: any = { delivered: 'bg-green-100 text-green-800', shipped: 'bg-blue-100 text-blue-800', processing: 'bg-indigo-100 text-indigo-800', confirmed: 'bg-blue-100 text-blue-800', pending: 'bg-yellow-100 text-yellow-800', cancelled: 'bg-red-100 text-red-800', returned: 'bg-gray-100 text-gray-800', draft: 'bg-gray-100 text-gray-600' }
  return m[String(s || '').toLowerCase()] || 'bg-gray-100 text-gray-800'
}
const getPaymentColor = (s?: string) => {
  const m: any = { paid: 'text-green-600', pending: 'text-yellow-600', failed: 'text-red-600' }
  return m[String(s || '').toLowerCase()] || 'text-gray-600'
}
const editOrder = () => { if (order.value?.id) router.push({ name: 'OrderEdit', params: { id: order.value.id } }) }
const openInvoice = () => { if (order.value?.id) window.open(router.resolve({ name: 'OrderPrint', params: { id: order.value.id } }).href, '_blank') }

// Create Delivery Modal
const showCreateDelivery = ref(false)
const providers = ref<any[]>([])
const createForm = ref<any>({ provider_id: null, estimated_delivery_time: '', weight_kg: null, distance_km: null })
const creating = ref(false)
const openCreateDelivery = async () => {
  showCreateDelivery.value = true
  try {
    const res = await fetchDeliveryProviders(1)
    providers.value = res?.data?.data ?? res?.data ?? []
  } catch (e) { providers.value = [] }
}
const closeCreate = () => {
  showCreateDelivery.value = false
  createForm.value = { provider_id: null, estimated_delivery_time: '', weight_kg: null, distance_km: null }
}
const previewFee = computed(() => {
  const prov = providers.value.find((p: any) => p.id === createForm.value.provider_id)
  if (!prov) return null
  const pr = prov.pricing_rules || {}
  const base = Number(pr.base_fee || 0)
  const w = Number(createForm.value.weight_kg || 0) * Number(pr.weight_rate || 0)
  const d = Number(createForm.value.distance_km || 0) * Number(pr.distance_rate || 0)
  return base + w + d
})
const submitCreateDelivery = async () => {
  if (!order.value?.id || !createForm.value.provider_id) return
  creating.value = true
  try {
    const res = await createDeliveryForOrder(order.value.id, createForm.value)
    closeCreate()
    // reload and switch tab
    await load()
    if (delivery.value) activeTab.value = 'delivery'
    addToast('تم إنشاء التوصيل', 'success')
  } catch (e) { console.error(e) }
  finally { creating.value = false }
}
</script>

<style scoped>
.overflow-x-auto::-webkit-scrollbar { height: 6px; }
.overflow-x-auto::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 4px; }
.overflow-x-auto::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 4px; }
.font-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }
</style>