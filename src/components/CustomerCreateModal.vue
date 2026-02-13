<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click.self="close">
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
      <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <h3 class="text-lg font-bold text-gray-900">إضافة عميل جديد</h3>
        <button @click="close" class="text-gray-400 hover:text-gray-600 transition-colors">✕</button>
      </div>
      
      <div class="p-6 space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">الاسم <span class="text-red-500">*</span></label>
            <input 
              v-model="form.name" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              :class="{ 'border-red-500': errors.name }"
              placeholder="اسم العميل"
            />
            <p v-if="errors.name" class="text-xs text-red-500 mt-1">{{ errors.name }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف <span class="text-red-500">*</span></label>
            <input 
              v-model="form.phone" 
              type="tel" 
              class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
              dir="ltr"
              placeholder="0912345678"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">نوع العميل</label>
            <select v-model="form.customer_type" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
              <option value="individual">فرد</option>
              <option value="business">شركة</option>
              <option value="wholesale">جملة</option>
            </select>
          </div>
          
          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
            <input 
              v-model="form.email" 
              type="email" 
              class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
              dir="ltr"
              placeholder="customer@example.com"
            />
          </div>
          
          <!-- <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">الرقم الضريبي</label>
            <input 
              v-model="form.tax_number" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="اختياري"
            />
          </div> -->
          
          <div class="flex items-center pt-6">
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" v-model="form.is_active" class="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" />
              <span class="text-sm font-medium text-gray-700">نشط</span>
            </label>
          </div>
        </div>
      </div>

      <div class="px-6 py-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
        <button 
          @click="close"
          class="px-6 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors"
        >
          إلغاء
        </button>
        <button 
          @click="submit"
          :disabled="loading"
          class="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? 'جاري الحفظ...' : 'حفظ' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { createCustomer } from '../api/customers'
import { useToast } from '../composables/useToast'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits(['close', 'customer-created'])

const { addToast } = useToast()
const loading = ref(false)

const form = reactive({
  name: '',
  phone: '',
  email: '',
  customer_type: 'individual',
  tax_number: '',
  is_active: true,
})

const errors = reactive({ 
  name: '' 
})

// Reset form when modal opens
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    form.name = ''
    form.phone = ''
    form.email = ''
    form.customer_type = 'individual'
    form.tax_number = ''
    form.is_active = true
    errors.name = ''
  }
})

const close = () => {
  emit('close')
}

const submit = async () => {
  // Validation
  errors.name = ''
  if (!form.name) {
    errors.name = 'الاسم مطلوب'
    return
  }
  
  if (!form.phone) {
    addToast('رقم الهاتف مطلوب', 'error')
    return
  }

  try {
    loading.value = true
    const response = await createCustomer(form)
    const newCustomer = response.data
    
    addToast('تم إضافة العميل بنجاح', 'success')
    emit('customer-created', newCustomer)
    close()
  } catch (e: any) {
    console.error('Failed to create customer', e)
    let msg = 'فشل إنشاء العميل'
    if (e.message) msg = e.message
    try {
      const parsed = JSON.parse(e.message)
      if (parsed.message) msg = parsed.message
      if (parsed.errors) {
        const firstKey = Object.keys(parsed.errors)[0]
        if (firstKey) msg += `: ${parsed.errors[firstKey][0]}`
      }
    } catch {}
    addToast(msg, 'error')
  } finally {
    loading.value = false
  }
}
</script>
