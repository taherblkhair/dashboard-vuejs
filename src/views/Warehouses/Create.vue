<template>
  <div class="p-4 md:p-6 bg-gradient-to-b from-gray-50 to-white min-h-screen" dir="rtl">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-200">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-md">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
            </div>
            <div>
              <h1 class="text-2xl md:text-3xl font-bold text-gray-900">إضافة مخزن جديد</h1>
              <p class="text-gray-600 mt-2">أدخل بيانات المخزن ثم اضغط حفظ للإنشاء</p>
            </div>
          </div>

         
        </div>
      </div>

      <!-- Form -->
      <div class="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
        <form @submit.prevent="submit" class="space-y-8">
          <!-- Basic Information -->
          <div>
            <div class="flex items-center gap-3 mb-6">
              <div class="p-2 bg-blue-100 rounded-lg">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-800">المعلومات الأساسية</h3>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Name -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">
                  اسم المخزن
                  <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <input 
                    v-model="form.name" 
                    required
                    :class="[
                      'w-full px-4 py-3 border-2 rounded-xl transition-all duration-200',
                      errors.name ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                    ]"
                    placeholder="أدخل اسم المخزن"
                  />
                  <div v-if="errors.name" class="absolute left-0 top-full mt-1 text-xs text-red-600">{{ errors.name }}</div>
                </div>
              </div>

              <!-- Code -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">
                  رمز المخزن
                  <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <input 
                    v-model="form.code" 
                    required
                    :class="[
                      'w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 font-mono',
                      errors.code ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                    ]"
                    placeholder="مثال: WH-001"
                  />
                  <div v-if="errors.code" class="absolute left-0 top-full mt-1 text-xs text-red-600">{{ errors.code }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Contact Information -->
          <div>
            <div class="flex items-center gap-3 mb-6">
              <div class="p-2 bg-green-100 rounded-lg">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-800">معلومات الاتصال</h3>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Phone -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">رقم الهاتف</label>
                <div class="relative">
                  <input 
                    v-model="form.phone" 
                    :class="[
                      'w-full px-4 py-3 border-2 rounded-xl transition-all duration-200',
                      errors.phone ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                    ]"
                    placeholder="أدخل رقم الهاتف"
                  />
                  <div v-if="errors.phone" class="absolute left-0 top-full mt-1 text-xs text-red-600">{{ errors.phone }}</div>
                </div>
              </div>

              <!-- Email -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">البريد الإلكتروني</label>
                <div class="relative">
                  <input 
                    v-model="form.email" 
                    type="email"
                    :class="[
                      'w-full px-4 py-3 border-2 rounded-xl transition-all duration-200',
                      errors.email ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                    ]"
                    placeholder="أدخل البريد الإلكتروني"
                  />
                  <div v-if="errors.email" class="absolute left-0 top-full mt-1 text-xs text-red-600">{{ errors.email }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Configuration -->
          <div>
            <div class="flex items-center gap-3 mb-6">
              <div class="p-2 bg-purple-100 rounded-lg">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-800">الإعدادات والتكوين</h3>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Capacity -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">
                  سعة المخزن
                  <span class="text-xs text-gray-500">(عدد الوحدات)</span>
                </label>
                <div class="relative">
                  <input 
                    v-model.number="form.capacity" 
                    type="number"
                    min="0"
                    :class="[
                      'w-full px-4 py-3 border-2 rounded-xl transition-all duration-200',
                      errors.capacity ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                    ]"
                    placeholder="أدخل سعة المخزن"
                  />
                  <div v-if="errors.capacity" class="absolute left-0 top-full mt-1 text-xs text-red-600">{{ errors.capacity }}</div>
                </div>
              </div>

              <!-- Manager -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">المدير المسؤول</label>
                <div class="relative">
                  <select 
                    v-model.number="form.manager_id"
                    :class="[
                      'w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 bg-white appearance-none',
                      errors.manager_id ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                    ]"
                  >
                    <option :value="undefined">اختر مدير المخزن</option>
                    <option v-for="user in users" :key="user.id" :value="user.id">
                      {{ user.name }} - {{ user.email }}
                    </option>
                  </select>
                  <div class="absolute left-4 top-3.5 pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                  </div>
                  <div v-if="errors.manager_id" class="absolute left-0 top-full mt-1 text-xs text-red-600">{{ errors.manager_id }}</div>
                </div>
              </div>

              <!-- Address -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">العنوان</label>
                <div class="relative">
                  <select 
                    v-model.number="form.address_id"
                    :class="[
                      'w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 bg-white appearance-none',
                      errors.address_id ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                    ]"
                  >
                    <option :value="undefined">اختر عنوان المخزن</option>
                    <option v-for="address in addresses" :key="address.id" :value="address.id">
                      {{ address.city }} - {{ address.area }} - {{ address.street }}
                    </option>
                  </select>
                  <div class="absolute left-4 top-3.5 pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                  </div>
                  <div v-if="errors.address_id" class="absolute left-0 top-full mt-1 text-xs text-red-600">{{ errors.address_id }}</div>
                </div>
              </div>

              <!-- Status -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">حالة المخزن</label>
                <div class="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input 
                      v-model="form.is_active" 
                      type="checkbox" 
                      class="sr-only peer"
                    />
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                  <div>
                    <span class="text-sm font-medium text-gray-700">{{ form.is_active ? 'نشط' : 'غير نشط' }}</span>
                    <p class="text-xs text-gray-500">المخزون {{ form.is_active ? 'مُتاح' : 'غير مُتاح' }} للاستخدام</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Notes -->
          <div>
            <div class="flex items-center gap-3 mb-6">
              <div class="p-2 bg-yellow-100 rounded-lg">
                <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-800">ملاحظات إضافية</h3>
            </div>

            <div class="relative">
              <textarea 
                v-model="form.notes" 
                rows="4"
                :class="[
                  'w-full px-4 py-3 border-2 rounded-xl transition-all duration-200',
                  errors.notes ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                ]"
                placeholder="أضف أي ملاحظات أو تعليمات خاصة بالمخزن..."
              ></textarea>
              <div v-if="errors.notes" class="absolute left-0 top-full mt-1 text-xs text-red-600">{{ errors.notes }}</div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex flex-col md:flex-row justify-between gap-4 pt-6 border-t">
            <div class="text-sm text-gray-600">
              <p>جميع الحقول المميزة بـ <span class="text-red-500">*</span> إلزامية</p>
              <p class="mt-1">سيتم إنشاء المخزن مع الإعدادات المحددة</p>
            </div>
            
            <div class="flex gap-3">
              <button 
                type="button" 
                @click="cancel"
                class="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200 flex items-center gap-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
                إلغاء
              </button>
              
              <button 
                type="submit" 
                :disabled="loading"
                :class="[
                  'px-6 py-3 text-white rounded-xl font-medium transition-all duration-200 flex items-center gap-2',
                  loading 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg'
                ]"
              >
                <svg v-if="loading" class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                {{ loading ? 'جاري الإنشاء...' : 'إنشاء المخزن' }}
              </button>
            </div>
          </div>
        </form>
      </div>

      <!-- Toast Notification -->
      <div v-if="toast.visible" 
           :class="[
             'fixed top-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300',
             toast.type === 'success' 
               ? 'bg-green-500 border-green-600' 
               : 'bg-red-500 border-red-600'
           ]"
           class="px-6 py-3 rounded-xl shadow-xl border text-white flex items-center gap-2 animate-fade-in">
        <span v-if="toast.type === 'success'">✓</span>
        <span v-else>!</span>
        {{ toast.message }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { createWarehouse } from '../../api/warehouses'
import { fetchAddresses } from '../../api/addresses'
import { fetchUsers } from '../../api/users'

const router = useRouter()

// Form state
const form = reactive<any>({
  name: '',
  code: '',
  address_id: undefined,
  manager_id: undefined,
  phone: '',
  email: '',
  capacity: undefined,
  notes: '',
  is_active: true
})

// Validation errors
const errors = reactive<any>({})

// Loading state
const loading = ref(false)

// Data for dropdowns
const addresses = ref<any[]>([])
const users = ref<any[]>([])

// Toast notification
const toast = ref<{ visible: boolean; message: string; type: string; timer?: number }>({ 
  visible: false, 
  message: '', 
  type: 'success' 
})

// Load dropdown data
const loadData = async () => {
  try {
    const [addressesRes, usersRes] = await Promise.allSettled([
      fetchAddresses(),
      fetchUsers()
    ])

    if (addressesRes.status === 'fulfilled') {
      addresses.value = Array.isArray(addressesRes.value) 
        ? addressesRes.value 
        : (addressesRes.value?.data || [])
    }

    if (usersRes.status === 'fulfilled') {
      users.value = Array.isArray(usersRes.value)
        ? usersRes.value
        : (usersRes.value?.data || [])
    }
  } catch (e) {
    console.error('Failed to load dropdown data', e)
    showToast('فشل تحميل البيانات', 'error')
  }
}

onMounted(() => {
  loadData()
})

// Validation function
const validateForm = () => {
  let isValid = true
  errors.name = ''
  errors.code = ''
  errors.phone = ''
  errors.email = ''
  errors.capacity = ''

  // Name validation
  if (!form.name.trim()) {
    errors.name = 'اسم المخزن مطلوب'
    isValid = false
  }

  // Code validation
  if (!form.code.trim()) {
    errors.code = 'رمز المخزن مطلوب'
    isValid = false
  }

  // Phone validation (if provided)
  if (form.phone && !/^[\d\s\-\+\(\)]{8,20}$/.test(form.phone)) {
    errors.phone = 'رقم الهاتف غير صالح'
    isValid = false
  }

  // Email validation (if provided)
  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'البريد الإلكتروني غير صالح'
    isValid = false
  }

  // Capacity validation (if provided)
  if (form.capacity !== undefined && form.capacity !== '' && (isNaN(form.capacity) || form.capacity < 0)) {
    errors.capacity = 'السعة يجب أن تكون رقمًا موجبًا'
    isValid = false
  }

  return isValid
}

// Show toast notification
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

// Submit form
const submit = async () => {
  if (!validateForm()) {
    showToast('يرجى تصحيح الأخطاء في النموذج', 'error')
    return
  }

  loading.value = true
  try {
    const payload = { ...form }
    
    // Remove undefined values
    Object.keys(payload).forEach(key => {
      if (payload[key] === undefined || payload[key] === '') {
        delete payload[key]
      }
    })

    await createWarehouse(payload)
    showToast('تم إنشاء المخزن بنجاح', 'success')
    
    // Navigate after success
    setTimeout(() => {
      router.push({ name: 'Warehouses' })
    }, 1500)
    
  } catch (e: any) {
    console.error('Create warehouse failed', e)
    
    // Handle API errors
    const errorMessage = e?.response?.data?.message || 'فشل إنشاء المخزن'
    showToast(errorMessage, 'error')
  } finally {
    loading.value = false
  }
}

// Cancel and go back
const cancel = () => {
  router.push({ name: 'Warehouses' })
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

/* Custom focus styles */
input:focus, 
select:focus, 
textarea:focus {
  outline: none;
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

/* Form field animations */
input, select, textarea {
  transition: all 0.2s ease;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .grid {
    gap: 1rem;
  }
}
</style>