<template>
  <div class="p-4 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen" dir="rtl">
    <div class="max-w-6xl mx-auto">
      <!-- Toast Notification -->
      <div v-if="toast.visible" 
           :class="[
             'fixed top-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300',
             toast.type === 'success' 
               ? 'bg-green-500 border-green-600' 
               : 'bg-blue-500 border-blue-600'
           ]"
           class="px-6 py-3 rounded-lg shadow-lg border text-white flex items-center gap-2 animate-fade-in">
        <span v-if="toast.type === 'success'">✓</span>
        <span v-else>ℹ</span>
        {{ toast.message }}
      </div>

      <!-- Header -->
      <div class="bg-white rounded-2xl shadow-md p-6 mb-6 border border-gray-200">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <div>
              <h1 class="text-2xl md:text-3xl font-bold text-gray-800">إنشاء فاتورة مبيعات</h1>
              <p class="text-gray-600 mt-1">أدخل بيانات الطلب وأضف العناصر ثم احفظ الفاتورة</p>
            </div>
          </div>
          
          <div class="flex flex-col sm:flex-row gap-3">
            <button 
              @click="submit" 
              :disabled="submitting"
              :class="[
                'px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2',
                submitting 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg'
              ]"
            >
              <svg v-if="submitting" class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              {{ submitting ? 'جاري الحفظ...' : 'حفظ وإنشاء الفاتورة' }}
            </button>
            
            <router-link 
              to="/orders" 
              class="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
              إلغاء
            </router-link>
          </div>
        </div>
      </div>

      <!-- Quick Add Section -->
      <div class="bg-white rounded-2xl shadow-md p-6 mb-6 border border-gray-200">
        <div class="flex items-center gap-3 mb-4">
          <div class="p-2 bg-green-100 rounded-lg">
            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-800">إضافة سريعة بالباركود</h3>
        </div>
        <p class="text-gray-600 text-sm mb-4">ابحث عن المنتج عن طريق SKU أو اسم المنتج لإضافته مباشرة إلى الفاتورة</p>
        <VariantAutocomplete 
          @select="addVariantLine" 
          placeholder="اكتب SKU أو اسم المنتج للبحث..."
          class="w-full"
        />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Customer & Order Details -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Customer Information Card -->
          <div class="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
            <div class="flex items-center gap-3 mb-6">
              <div class="p-2 bg-blue-100 rounded-lg">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-800">بيانات العميل</h3>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="block text-sm font-medium text-gray-700">
                  العميل 
                  <span class="text-red-500">*</span>
                </label>
                <select 
                  v-model="form.customer_id" 
                  @change="onCustomerChange"
                  :class="[
                    'w-full px-4 py-3 rounded-xl border transition-all duration-200',
                    form.customer_id ? 'border-blue-300 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                  ]"
                >
                  <option value="" disabled>اختر عميلاً</option>
                  <option 
                    v-for="c in customers" 
                    :key="c.id" 
                    :value="c.id"
                    class="py-2"
                  >
                    {{ c.name }} — {{ c.phone || c.email }}
                  </option>
                </select>
              </div>
              
              <div class="space-y-1">
                <label class="block text-sm font-medium text-gray-700">مصدر الطلب</label>
                <select 
                  v-model="form.source"
                  class="w-full px-4 py-3 rounded-xl border border-gray-300 hover:border-gray-400 transition-all duration-200"
                >
                  <option value="internal">داخلي</option>
                  <option value="webstore">متجر إلكتروني</option>
                </select>
              </div>
              
              <div class="space-y-1">
                <label class="block text-sm font-medium text-gray-700">عنوان التوصيل</label>
                <select 
                  v-model="form.delivery_address_id"
                  :disabled="!customerAddresses.length"
                  class="w-full px-4 py-3 rounded-xl border transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">اختر عنوان التوصيل</option>
                  <option 
                    v-for="a in customerAddresses" 
                    :key="a.id" 
                    :value="a.id"
                  >
                    {{ a.city }} — {{ a.area }} — {{ a.street }}
                  </option>
                </select>
                <p v-if="!customerAddresses.length && form.customer_id" class="text-xs text-gray-500">
                  لم يتم إضافة عناوين لهذا العميل
                </p>
              </div>
              
              <div class="space-y-1">
                <label class="block text-sm font-medium text-gray-700">عنوان الفوترة</label>
                <select 
                  v-model="form.billing_address_id"
                  :disabled="!customerAddresses.length"
                  class="w-full px-4 py-3 rounded-xl border transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">اختر عنوان الفوترة</option>
                  <option 
                    v-for="a in customerAddresses" 
                    :key="a.id" 
                    :value="a.id"
                  >
                    {{ a.city }} — {{ a.area }} — {{ a.street }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <!-- Delivery Information Card -->
          <div class="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
            <div class="flex items-center gap-3 mb-6">
              <div class="p-2 bg-purple-100 rounded-lg">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-800">معلومات التوصيل</h3>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="block text-sm font-medium text-gray-700">تاريخ التوصيل</label>
                <input 
                  v-model="form.delivery_date" 
                  type="date" 
                  class="w-full px-4 py-3 rounded-xl border border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                />
              </div>
              
              <div class="space-y-1">
                <label class="block text-sm font-medium text-gray-700">فترة التوصيل</label>
                <input 
                  v-model="form.delivery_time_slot" 
                  placeholder="مثال: 15:00-18:00"
                  class="w-full px-4 py-3 rounded-xl border border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary Sidebar -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-2xl shadow-md p-6 border border-gray-200 sticky top-6">
            <div class="flex items-center gap-3 mb-6">
              <div class="p-2 bg-gray-100 rounded-lg">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-800">ملخص الفاتورة</h3>
            </div>
            
            <div class="space-y-4">
              <div class="flex justify-between items-center">
                <span class="text-gray-600">عدد الأصناف</span>
                <span class="font-semibold">{{ form.lines.length }}</span>
              </div>
              
              <div class="flex justify-between items-center">
                <span class="text-gray-600">المجموع الجزئي</span>
                <span class="font-semibold text-blue-600">{{ formatCurrency(subtotal) }}</span>
              </div>
              
              <div class="flex justify-between items-center">
                <span class="text-gray-600">الخصم العام</span>
                <div class="flex items-center gap-2">
                  <input 
                    v-model.number="form.discount_amount" 
                    type="number" 
                    step="0.01" 
                    min="0"
                    class="w-24 px-2 py-1 border border-gray-300 rounded text-right"
                  />
                  <span class="font-semibold text-red-600">{{ formatCurrency(form.discount_amount) }}</span>
                </div>
              </div>
              
              <div class="flex justify-between items-center">
                <span class="text-gray-600">رسوم الشحن</span>
                <div class="flex items-center gap-2">
                  <input 
                    v-model.number="form.shipping_fee" 
                    type="number" 
                    step="0.01" 
                    min="0"
                    class="w-24 px-2 py-1 border border-gray-300 rounded text-right"
                  />
                  <span class="font-semibold text-green-600">{{ formatCurrency(form.shipping_fee) }}</span>
                </div>
              </div>
              
              <div class="border-t pt-4 mt-4">
                <div class="flex justify-between items-center">
                  <span class="text-lg font-bold text-gray-800">الإجمالي النهائي</span>
                  <span class="text-2xl font-bold text-gray-900">{{ formatCurrency(grandTotal) }}</span>
                </div>
              </div>
              
              <div class="mt-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">ملاحظات الفاتورة</label>
                <textarea 
                  v-model="form.notes" 
                  rows="3"
                  placeholder="أضف أي ملاحظات خاصة بالطلب..."
                  class="w-full px-4 py-3 rounded-xl border border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Items Card -->
      <div class="bg-white rounded-2xl shadow-md p-6 mt-6 border border-gray-200">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-orange-100 rounded-lg">
              <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-800">عناصر الفاتورة</h3>
              <p class="text-gray-600 text-sm">إدارة المنتجات والكميات والأسعار</p>
            </div>
          </div>
          
          <button 
            @click="addLine" 
            class="px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            إضافة منتج جديد
          </button>
        </div>

        <!-- Empty State -->
        <div v-if="form.lines.length === 0" class="text-center py-12">
          <div class="w-24 h-24 mx-auto mb-4 text-gray-300">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
            </svg>
          </div>
          <h4 class="text-lg font-medium text-gray-700 mb-2">لا توجد منتجات مضافة</h4>
          <p class="text-gray-500 mb-6">استخدم الزر أعلاه أو شريط البحث لإضافة منتجات</p>
        </div>

        <!-- Items List -->
        <div v-else class="space-y-4">
          <div v-for="(line, idx) in form.lines" :key="line._uid" 
               class="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-all duration-200">
            <div class="flex justify-between items-start mb-3">
              <span class="text-sm font-medium text-gray-700">
                <template v-if="line.product_name">
                  {{ line.product_name }}<span v-if="line.product_sku"> — {{ line.product_sku }}</span>
                </template>
                <template v-else>البند #{{ idx + 1 }}</template>
              </span>
              <button 
                @click="removeLine(idx)" 
                class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div class="md:col-span-2">
                <label class="block text-xs font-medium text-gray-600 mb-1">المنتج / المتغير</label>
                <VariantAutocomplete 
                  v-model="line.product_variant_id" 
                  :selected-label="line.product_name ? (line.product_name + (line.product_sku ? ' — ' + line.product_sku : '')) : ''"
                  @select="(v) => onVariantSelected(idx, v)" 
                  placeholder="ابحث عن منتج..."
                  class="w-full"
                />
              </div>
              
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">الكمية</label>
                <input 
                  v-model.number="line.quantity" 
                  type="number" 
                  min="1" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                />
              </div>
              
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">سعر الوحدة</label>
                <input 
                  v-model.number="line.unit_price" 
                  type="number" 
                  step="0.01" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                />
              </div>
              
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">الخصم</label>
                <input 
                  v-model.number="line.discount_amount" 
                  type="number" 
                  step="0.01" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                />
              </div>
            </div>
            
            <div class="mt-3">
              <label class="block text-xs font-medium text-gray-600 mb-1">ملاحظات البند</label>
              <input 
                v-model="line.notes" 
                placeholder="ملاحظات خاصة بهذا البند..."
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              />
            </div>
            
            <div class="flex justify-between items-center mt-4 pt-3 border-t">
              <span class="text-sm text-gray-600">الإجمالي للبند</span>
              <span class="font-semibold text-blue-600">{{ formatCurrency(lineTotal(line)) }}</span>
            </div>
          </div>
        </div>

        <!-- Summary -->
        <div class="mt-8 pt-6 border-t">
          <div class="flex justify-end">
            <div class="w-full md:w-1/2 space-y-3">
              <div class="flex justify-between text-gray-600">
                <span>المجموع الجزئي:</span>
                <span class="font-semibold">{{ formatCurrency(subtotal) }}</span>
              </div>
              <div class="flex justify-between text-red-600">
                <span>الخصم العام:</span>
                <span>-{{ formatCurrency(form.discount_amount) }}</span>
              </div>
              <div class="flex justify-between text-green-600">
                <span>رسوم الشحن:</span>
                <span>+{{ formatCurrency(form.shipping_fee) }}</span>
              </div>
              <div class="flex justify-between text-lg font-bold pt-3 border-t">
                <span class="text-gray-800">الإجمالي النهائي:</span>
                <span class="text-gray-900">{{ formatCurrency(grandTotal) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons Footer -->
      <div class="flex flex-col sm:flex-row justify-between gap-4 mt-8 p-6 bg-white rounded-2xl shadow-md border border-gray-200">
        <div class="text-gray-600 text-sm">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>جميع البيانات المدخلة مؤمنة</span>
          </div>
        </div>
        
        <div class="flex flex-col sm:flex-row gap-3">
          <button 
            @click="submit" 
            :disabled="submitting"
            :class="[
              'px-8 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2',
              submitting 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl'
            ]"
          >
            <svg v-if="submitting" class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            {{ submitting ? 'جاري حفظ الفاتورة...' : 'تأكيد وإنشاء الفاتورة' }}
          </button>
          
          <router-link 
            to="/orders" 
            class="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
            إلغاء والعودة
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { fetchCustomers } from '../../api/customers'
import { fetchProducts } from '../../api/products'
import { createOrder } from '../../api/orders'
import { fetchAddresses } from '../../api/addresses'
import { fetchCustomer } from '../../api/customers'
import VariantAutocomplete from '../../components/VariantAutocomplete.vue'

const router = useRouter()

const customers = ref<any[]>([])
const products = ref<any[]>([])
const customerAddresses = ref<any[]>([])

const submitting = ref(false)

const form = ref<any>({
  customer_id: null,
  source: 'internal',
  discount_amount: 0,
  shipping_fee: 0,
  delivery_date: '',
  delivery_time_slot: '',
  notes: '',
  delivery_address_id: null,
  billing_address_id: null,
  assigned_to: null,
  lines: []
})

const loadCustomers = async () => {
  try {
    const res = await fetchCustomers(1)
    customers.value = res?.data || []
  } catch (e) {
    console.error('Failed to load customers', e)
    showToast('فشل تحميل العملاء', 'info')
  }
}

const loadProducts = async () => {
  try {
    const res = await fetchProducts(1)
    products.value = res?.data || []
  } catch (e) {
    console.error('Failed to load products', e)
    showToast('فشل تحميل المنتجات', 'info')
  }
}

const onCustomerChange = async () => {
  const id = form.value.customer_id
  customerAddresses.value = []
  form.value.delivery_address_id = null
  form.value.billing_address_id = null
  
  if (!id) return
  
  try {
    showToast('جاري تحميل بيانات العميل...', 'info')
    const res = await fetchCustomer(Number(id))
    const cust = res?.data || null
    
    if (cust?.addresses && Array.isArray(cust.addresses)) {
      customerAddresses.value = cust.addresses
    } else {
      const ares = await fetchAddresses(1)
      const all = ares?.data || []
      customerAddresses.value = all.filter((a: any) => 
        a.owner_type && a.owner_type.includes('Customer') && Number(a.owner_id) === Number(id)
      )
    }

    if (cust?.default_address_id) {
      form.value.delivery_address_id = cust.default_address_id
      form.value.billing_address_id = cust.default_address_id
      showToast('تم تعيين العنوان الافتراضي تلقائياً', 'success')
    }
  } catch (e) {
    console.error('Failed to load addresses', e)
    showToast('فشل تحميل عناوين العميل', 'info')
  }
}

onMounted(async () => {
  await Promise.all([loadCustomers(), loadProducts()])
  addLine()
})

const uid = (() => {
  let i = 1
  return () => ++i
})()

const addLine = () => {
  form.value.lines.push({ 
    _uid: uid(), 
    product_variant_id: null, 
    quantity: 1, 
    unit_price: 0, 
    discount_amount: 0, 
    notes: '',
    product_name: null,
    product_sku: ''
  })
  showToast('تمت إضافة بند جديد', 'success')
}

const removeLine = (idx: number) => {
  form.value.lines.splice(idx, 1)
  showToast('تم حذف البند', 'info')
}

const onVariantSelected = (idx: number, variant: any) => {
  if (!variant) return
  form.value.lines[idx].product_variant_id = variant.id
  form.value.lines[idx].unit_price = Number(variant.sale_price || 0)
  const fullName = variant.product?.name || variant.name || 'المنتج'
  const sku = variant.sku_variant || ''
  // store display name on line so it's visible in the card header
  form.value.lines[idx].product_name = fullName
  form.value.lines[idx].product_sku = sku
  showToast(`تمت إضافة البند: ${fullName}${sku ? ' — ' + sku : ''}`, 'success')
}

const addVariantLine = (variant: any) => {
  if (!variant) return
  const l = { 
    _uid: uid(), 
    product_variant_id: variant.id, 
    quantity: 1, 
    unit_price: Number(variant.sale_price || 0), 
    discount_amount: 0, 
    notes: '',
    product_name: variant.product?.name || variant.name || 'المنتج',
    product_sku: variant.sku_variant || ''
  }
  form.value.lines.push(l)
  showToast(`تمت إضافة البند: ${l.product_name}${l.product_sku ? ' — ' + l.product_sku : ''}`, 'success')
}

const lineTotal = (l: any) => {
  const qty = Number(l.quantity || 0)
  const unit = Number(l.unit_price || 0)
  const disc = Number(l.discount_amount || 0)
  return qty * unit - disc
}

const toast = ref<{ visible: boolean; message: string; type: string; timer?: number }>({ 
  visible: false, 
  message: '', 
  type: 'success' 
})

const showToast = (message: string, type = 'success', ms = 3000) => {
  if (toast.value.timer) window.clearTimeout(toast.value.timer)
  toast.value.message = message
  toast.value.type = type
  toast.value.visible = true
  
  toast.value.timer = window.setTimeout(() => {
    toast.value.visible = false
    toast.value.timer = undefined
  }, ms) as unknown as number
}

const subtotal = computed(() => 
  form.value.lines.reduce((sum: number, l: any) => sum + lineTotal(l), 0)
)

const grandTotal = computed(() => 
  subtotal.value - Number(form.value.discount_amount || 0) + Number(form.value.shipping_fee || 0)
)

const formatCurrency = (val?: string | number) => {
  if (val === null || val === undefined || val === '') return '0.00'
  const num = typeof val === 'number' ? val : Number(String(val))
  if (Number.isNaN(num)) return String(val)
  return new Intl.NumberFormat('en-US', {
    style: 'currency', 
    currency: 'LYD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2 
  }).format(num)
}

const submit = async () => {
  if (!form.value.customer_id) {
    showToast('الرجاء اختيار عميل', 'info')
    return
  }
  
  if (!form.value.lines || form.value.lines.length === 0) {
    showToast('أضف بندًا واحدًا على الأقل', 'info')
    return
  }
  
  for (const l of form.value.lines) {
    if (!l.product_variant_id) {
      showToast('اختر منتجًا لكل بند', 'info')
      return
    }
    if (!l.quantity || Number(l.quantity) <= 0) {
      showToast('الكمية يجب أن تكون أكبر من صفر', 'info')
      return
    }
  }

  const payload: any = {
    customer_id: form.value.customer_id,
    source: form.value.source,
    discount_amount: Number(form.value.discount_amount || 0),
    shipping_fee: Number(form.value.shipping_fee || 0),
    delivery_date: form.value.delivery_date || null,
    delivery_time_slot: form.value.delivery_time_slot || null,
    notes: form.value.notes || null,
    delivery_address_id: form.value.delivery_address_id || null,
    billing_address_id: form.value.billing_address_id || null,
    assigned_to: form.value.assigned_to || null,
    lines: form.value.lines.map((l: any) => ({
      product_variant_id: l.product_variant_id,
      quantity: l.quantity,
      unit_price: Number(l.unit_price || 0),
      discount_amount: Number(l.discount_amount || 0),
      notes: l.notes || null
    }))
  }

  try {
    submitting.value = true
    showToast('جاري حفظ الفاتورة...', 'info')
    
    const res = await createOrder(payload)
    const id = res?.data?.id
    
    showToast('تم إنشاء الفاتورة بنجاح', 'success')
    
    setTimeout(() => {
      if (id) {
        router.push({ name: 'OrderDetails', params: { id } })
      } else {
        router.push({ name: 'Orders' })
      }
    }, 1500)
    
  } catch (e) {
    console.error('Failed to create order', e)
    showToast('فشل إنشاء الفاتورة', 'info')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translate(-50%, -20px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  opacity: 1;
  height: auto;
}

select:focus,
input:focus,
textarea:focus {
  outline: none;
}

.hover-lift:hover {
  transform: translateY(-2px);
  transition: transform 0.2s ease;
}

/* Smooth transitions for all interactive elements */
button, 
select, 
input, 
textarea,
a {
  transition: all 0.2s ease-in-out;
}

/* Custom scrollbar for better UX */
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
</style>