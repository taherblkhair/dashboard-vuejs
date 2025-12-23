<template>
  <div class="p-6 bg-gray-50 min-h-screen" dir="rtl">
    <div class="max-w-xl mx-auto">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-semibold text-gray-900">إنشاء عميل جديد</h1>
        <p class="text-sm text-gray-500 mt-1">أدخل بيانات العميل</p>
      </div>

      <!-- Form -->
      <MCard>
        <div class="p-6 space-y-4">
          <MInput v-model="form.name" label="الاسم" :error="errors.name" />
          <MInput v-model="form.phone" label="الهاتف" />
          <MInput v-model="form.email" label="البريد الإلكتروني" type="email" />
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">نوع العميل</label>
            <select v-model="form.customer_type" class="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="individual">فردي</option>
              <option value="business">شركة</option>
            </select>
          </div>

          <MInput v-model="form.tax_number" label="الرقم الضريبي (اختياري)" />

          <div class="flex items-center gap-2">
            <input type="checkbox" v-model="form.is_active" id="active" class="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
            <label for="active" class="text-sm text-gray-700">مفعل</label>
          </div>
        </div>

        <div class="flex justify-end gap-3 p-4 border-t border-gray-100">
          <MButton variant="secondary" @click="cancel">إلغاء</MButton>
          <MButton variant="primary" @click="submit" :loading="loading">حفظ</MButton>
        </div>
      </MCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { createCustomer } from '../../api/customers'
import MButton from '../../components/ui/MButton.vue'
import MInput from '../../components/ui/MInput.vue'
import MCard from '../../components/ui/MCard.vue'

const router = useRouter()
const loading = ref(false)

const form = reactive({
  name: '',
  phone: '',
  email: '',
  customer_type: 'individual',
  tax_number: '',
  is_active: true,
})

const errors = reactive({ name: '' })

const submit = async () => {
  errors.name = ''
  if (!form.name) {
    errors.name = 'الاسم مطلوب'
    return
  }
  try {
    loading.value = true
    await createCustomer(form)
    router.push({ name: 'Customers' })
  } catch (e) {
    console.error('Failed to create customer', e)
    alert('فشل إنشاء العميل')
  } finally {
    loading.value = false
  }
}

const cancel = () => router.back()
</script>
