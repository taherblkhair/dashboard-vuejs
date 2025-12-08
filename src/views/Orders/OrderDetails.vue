<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6" dir="rtl">
    <!-- Header -->
    <div class="max-w-7xl mx-auto">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <router-link 
              to="/orders" 
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </router-link>
            <h1 class="text-2xl md:text-3xl font-bold text-gray-800">تفاصيل الطلب</h1>
          </div>
          <div class="flex items-center gap-3">
            <div class="inline-flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
              <span class="text-sm text-gray-600">رقم الطلب:</span>
              <span class="font-mono font-semibold text-gray-800">#{{ order?.code }}</span>
            </div>
            <div :class="statusBadgeClass">
              {{ order?.status }}
            </div>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="flex flex-wrap gap-2">
          <button 
            @click="openInvoice"
            class="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span class="text-sm font-medium">طباعة الفاتورة</span>
          </button>
          
          <button 
            @click="openCreateDelivery"
            class="inline-flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-sm font-medium">إنشاء توصيل</span>
          </button>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column - Order Info -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Order Summary Card -->
          <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div class="flex items-center gap-2 mb-6">
              <div class="p-2 bg-blue-50 rounded-lg">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h2 class="text-lg font-semibold text-gray-800">معلومات الطلب</h2>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <!-- Customer Info -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-500">العميل</label>
                <router-link 
                  :to="{ name: 'CustomersView', params: { id: order?.customer?.id } }"
                  class="group block"
                >
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <div class="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                        {{ order?.customer?.name }}
                      </div>
                      <div class="text-sm text-gray-500">{{ order?.customer?.phone }}</div>
                    </div>
                  </div>
                </router-link>
              </div>

              <!-- Order Details -->
              <div class="space-y-3">
                <div>
                  <label class="block text-sm font-medium text-gray-500">تاريخ الطلب</label>
                  <div class="flex items-center gap-2 mt-1">
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span class="font-medium">{{ formatDate(order?.order_date) }}</span>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-500">حالة الدفع</label>
                  <div :class="paymentStatusBadgeClass" class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm mt-1">
                    {{ order?.payment_status }}
                  </div>
                </div>
              </div>

              <!-- Amount -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-500">المبلغ الإجمالي</label>
                <div class="flex items-center gap-2">
                  <div class="text-2xl font-bold text-gray-800">
                    {{ formatCurrency(order?.total) }}
                  </div>
                  <div class="text-sm text-gray-500">
                    شامل الضريبة
                  </div>
                </div>
              </div>
            </div>

            <!-- Status Update Section -->
            <div class="mt-8 pt-6 border-t border-gray-200">
              <div class="flex flex-col sm:flex-row sm:items-center gap-4">
                <div class="flex-1">
                  <label class="block text-sm font-medium text-gray-700 mb-2">تحديث حالة الطلب</label>
                  <div class="flex flex-col sm:flex-row gap-3">
                    <select 
                      v-model="statusToSet" 
                      class="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    >
                      <option value="">اختر الحالة الجديدة</option>
                      <option v-for="s in allowedStatuses" :key="s" :value="s">{{ s }}</option>
                    </select>
                    <button 
                      @click="changeStatus" 
                      :disabled="!statusToSet"
                      :class="statusToSet ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'"
                      class="px-6 py-2.5 text-white rounded-lg font-medium transition-colors"
                    >
                      تطبيق التغيير
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Items Card -->
          <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div class="flex items-center gap-2 mb-6">
              <div class="p-2 bg-purple-50 rounded-lg">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h2 class="text-lg font-semibold text-gray-800">عناصر الطلب</h2>
              <span class="bg-gray-100 text-gray-600 text-sm font-medium px-3 py-1 rounded-full">
                {{ order?.lines?.length || 0 }} منتج
              </span>
            </div>

            <div class="overflow-hidden rounded-lg border border-gray-200">
              <table class="w-full">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="py-4 px-6 text-right text-sm font-semibold text-gray-700">المنتج</th>
                    <th class="py-4 px-6 text-right text-sm font-semibold text-gray-700">المتغير</th>
                    <th class="py-4 px-6 text-right text-sm font-semibold text-gray-700">الكمية</th>
                    <th class="py-4 px-6 text-right text-sm font-semibold text-gray-700">سعر الوحدة</th>
                    <th class="py-4 px-6 text-right text-sm font-semibold text-gray-700">الإجمالي</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr 
                    v-for="l in order?.lines" 
                    :key="l.id"
                    class="hover:bg-gray-50 transition-colors"
                  >
                    <td class="py-4 px-6">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                        </div>
                        <div>
                          <div class="font-medium text-gray-800">{{ l.product_variant?.product?.name }}</div>
                          <div class="text-sm text-gray-500">{{ l.product_variant?.sku }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="py-4 px-6">
                      <div v-if="formatAttributes(l.product_variant?.attributes)" 
                           class="inline-flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm">
                        {{ formatAttributes(l.product_variant?.attributes) }}
                      </div>
                    </td>
                    <td class="py-4 px-6">
                      <div class="inline-flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">
                        {{ l.quantity }}
                      </div>
                    </td>
                    <td class="py-4 px-6 font-medium text-gray-800">
                      {{ formatCurrency(l.unit_price) }}
                    </td>
                    <td class="py-4 px-6 font-semibold text-gray-800">
                      {{ formatCurrency(l.total_price) }}
                    </td>
                  </tr>
                </tbody>
                <tfoot class="bg-gray-50">
                  <tr>
                    <td colspan="4" class="py-4 px-6 text-left text-sm font-semibold text-gray-700">المبلغ الإجمالي</td>
                    <td class="py-4 px-6 text-right text-xl font-bold text-gray-800">
                      {{ formatCurrency(order?.total) }}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        <!-- Right Column - Side Info -->
        <div class="space-y-6">
          <!-- Delivery Address Card -->
          <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div class="flex items-center gap-2 mb-6">
              <div class="p-2 bg-green-50 rounded-lg">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2 class="text-lg font-semibold text-gray-800">عنوان التوصيل</h2>
            </div>

            <div v-if="order?.delivery_address" class="space-y-4">
              <div class="p-4 bg-gray-50 rounded-lg">
                <div class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <div class="space-y-2">
                    <div class="font-semibold text-gray-800">
                      {{ order.delivery_address.city }} — {{ order.delivery_address.area }}
                    </div>
                    <div class="text-sm text-gray-600 leading-relaxed">
                      {{ order.delivery_address.street }}
                      <span v-if="order.delivery_address.building">
                        ، مبنى {{ order.delivery_address.building }}
                      </span>
                    </div>
                    <div v-if="order.delivery_address.notes" 
                         class="text-sm text-gray-500 bg-yellow-50 p-3 rounded border border-yellow-100">
                      <span class="font-medium text-yellow-700">ملاحظات:</span> 
                      {{ order.delivery_address.notes }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-8">
              <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-gray-500">لا يوجد عنوان توصيل</p>
            </div>
          </div>

          <!-- Quick Stats -->
          <div class="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white">
            <h3 class="text-lg font-semibold mb-4">ملخص الطلب</h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-blue-100">عدد المنتجات</span>
                <span class="text-xl font-bold">{{ order?.lines?.length || 0 }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-blue-100">المبلغ الإجمالي</span>
                <span class="text-xl font-bold">{{ formatCurrency(order?.total) }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-blue-100">حالة الطلب</span>
                <span class="font-medium">{{ order?.status }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-blue-100">حالة الدفع</span>
                <span class="font-medium">{{ order?.payment_status }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Delivery Modal -->
    <div v-if="showCreateDelivery" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
        <!-- Overlay -->
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeCreate"></div>

        <!-- Modal -->
        <div class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
          <!-- Header -->
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-green-100 rounded-lg">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">إنشاء توصيل جديد</h3>
                <p class="text-sm text-gray-500">الطلب #{{ order?.code }}</p>
              </div>
            </div>
            <button @click="closeCreate" class="text-gray-400 hover:text-gray-600 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Form -->
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">مزود التوصيل</label>
              <select 
                v-model.number="createForm.provider_id" 
                class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
              >
                <option value="" disabled>اختر مزوداً</option>
                <option v-for="p in providers" :key="p.id" :value="p.id">
                  {{ p.name }} — {{ p.phone }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">التاريخ والوقت المتوقع</label>
              <input 
                v-model="createForm.estimated_delivery_time" 
                type="datetime-local"
                class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">الوزن (كجم)</label>
                <input 
                  v-model.number="createForm.weight_kg" 
                  type="number" 
                  step="0.01"
                  class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">المسافة (كم)</label>
                <input 
                  v-model.number="createForm.distance_km" 
                  type="number" 
                  step="0.01"
                  class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                />
              </div>
            </div>

            <!-- Preview -->
            <div class="p-4 bg-gray-50 rounded-lg">
              <div class="text-sm text-gray-600 mb-1">تكلفة التوصيل المتوقعة</div>
              <div class="flex items-center justify-between">
                <div class="text-2xl font-bold text-gray-800">
                  {{ previewFee !== null ? formatCurrency(previewFee) : '--' }}
                </div>
                <div v-if="previewFee === null" class="text-sm text-gray-500">
                  اختر مزوداً لرؤية المعاينة
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-3 pt-4 border-t border-gray-200">
              <button 
                @click="closeCreate" 
                class="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                إلغاء
              </button>
              <button 
                @click="submitCreateDelivery" 
                :disabled="creating || !createForm.provider_id"
                :class="creating || !createForm.provider_id ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'"
                class="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-medium transition-colors"
              >
                <span v-if="creating">
                  <svg class="animate-spin h-5 w-5 text-white inline-block mr-2" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  جارٍ الإنشاء...
                </span>
                <span v-else>إنشاء التوصيل</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchOrder } from '../../api/orders'
import { formatAttributes } from '../../utils/helpers'
import { updateOrderStatus, getOrderInvoiceUrl } from '../../api/orders'
import { fetchDeliveryProviders } from '../../api/deliveryProviders'
import { createDeliveryForOrder } from '../../api/deliveries'

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id || 0)
const order = ref<any>(null)
const statusToSet = ref('')

// Status transitions
const validTransitions: Record<string, string[]> = {
  draft: ['pending', 'cancelled'],
  pending: ['confirmed', 'cancelled'],
  confirmed: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered', 'returned'],
  delivered: ['returned'],
  cancelled: [],
  returned: []
}

const allowedStatuses = computed(() => {
  const cur = order.value?.status
  if (!cur) return []
  return validTransitions[cur] || []
})

// Status badge classes
const statusBadgeClass = computed(() => {
  const status = order.value?.status?.toLowerCase()
  const base = 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium'
  
  switch(status) {
    case 'delivered':
      return `${base} bg-green-100 text-green-800`
    case 'shipped':
      return `${base} bg-blue-100 text-blue-800`
    case 'processing':
      return `${base} bg-yellow-100 text-yellow-800`
    case 'cancelled':
      return `${base} bg-red-100 text-red-800`
    case 'pending':
      return `${base} bg-orange-100 text-orange-800`
    default:
      return `${base} bg-gray-100 text-gray-800`
  }
})

const paymentStatusBadgeClass = computed(() => {
  const status = order.value?.payment_status?.toLowerCase()
  const base = 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium'
  
  switch(status) {
    case 'paid':
      return `${base} bg-green-100 text-green-800`
    case 'pending':
      return `${base} bg-yellow-100 text-yellow-800`
    case 'failed':
      return `${base} bg-red-100 text-red-800`
    default:
      return `${base} bg-gray-100 text-gray-800`
  }
})

// Load order data
const load = async () => {
  if (!id) return
  try {
    const res = await fetchOrder(id)
    order.value = res?.data || null
  } catch (e) {
    console.error('Failed to load order', e)
  }
}

onMounted(() => load())

// Formatters
const formatDate = (iso?: string) => {
  if (!iso) return '—'
  try { 
    return new Date(iso).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch { return iso }
}

const formatCurrency = (val?: string | number) => {
  if (val === null || val === undefined || val === '') return '0.00 ر.س'
  const num = typeof val === 'number' ? val : Number(String(val))
  if (Number.isNaN(num)) return String(val)
  return new Intl.NumberFormat('ar-SA', { 
    style: 'currency', 
    currency: 'SAR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2 
  }).format(num)
}

// Invoice
const openInvoice = () => {
  if (!order.value?.id) return
  const url = getOrderInvoiceUrl(order.value.id)
  window.open(url, '_blank')
}

// Status change
const changeStatus = async () => {
  if (!order.value?.id || !statusToSet.value) return
  try {
    await updateOrderStatus(order.value.id, statusToSet.value)
    await load()
    statusToSet.value = ''
  } catch (e) {
    console.error('Failed to update status', e)
  }
}

// Delivery creation
const showCreateDelivery = ref(false)
const providers = ref<any[]>([])
const createForm = ref<any>({ 
  provider_id: null, 
  estimated_delivery_time: '', 
  weight_kg: null, 
  distance_km: null 
})
const creating = ref(false)

const openCreateDelivery = async () => {
  showCreateDelivery.value = true
  try {
    const res = await fetchDeliveryProviders(1)
    providers.value = res?.data?.data ?? res?.data ?? []
  } catch (e) {
    console.error('Failed to load providers', e)
    providers.value = []
  }
}

const closeCreate = () => {
  showCreateDelivery.value = false
  createForm.value = { 
    provider_id: null, 
    estimated_delivery_time: '', 
    weight_kg: null, 
    distance_km: null 
  }
}

const previewFee = computed(() => {
  const pid = createForm.value.provider_id
  const prov = providers.value.find((p: any) => p.id === pid)
  if (!prov) return null
  const pr = prov.pricing_rules || {}
  const base = Number(pr.base_fee || 0)
  const weightRate = Number(pr.weight_rate || 0)
  const distanceRate = Number(pr.distance_rate || 0)
  const areaFee = (() => {
    try {
      const city = order.value?.delivery_address?.city
      return Number(pr.area_fees?.[city] ?? 0)
    } catch { return 0 }
  })()
  const w = Number(createForm.value.weight_kg || 0)
  const d = Number(createForm.value.distance_km || 0)
  return base + areaFee + (w * weightRate) + (d * distanceRate)
})

const submitCreateDelivery = async () => {
  if (!order.value?.id) return
  if (!createForm.value.provider_id) return
  
  creating.value = true
  try {
    const payload = {
      provider_id: createForm.value.provider_id,
      estimated_delivery_time: createForm.value.estimated_delivery_time,
      weight_kg: createForm.value.weight_kg,
      distance_km: createForm.value.distance_km,
    }
    const res = await createDeliveryForOrder(order.value.id, payload)
    const created = res?.data?.data ?? res?.data ?? res
    
    showCreateDelivery.value = false
    if (created?.id) {
      router.push({ path: `/deliveries/${created.id}` })
    }
  } catch (e) {
    console.error('Failed to create delivery', e)
  } finally {
    creating.value = false
  }
}
</script>

<style scoped>
/* Smooth transitions */
* {
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* Modal animation */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>