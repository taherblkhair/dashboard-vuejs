<template>
  <div class="p-6 bg-gray-50 min-h-screen" dir="rtl">
    <div class="max-w-2xl mx-auto">
      <div class="mb-6">
        <h1 class="text-2xl font-bold">إنشاء عميل جديد</h1>
        <p class="text-sm text-gray-500">أدخل بيانات العميل ثم اضغط حفظ.</p>
      </div>

      <div class="bg-white rounded shadow p-4">
        <div class="grid grid-cols-1 gap-3">
          <div>
            <label class="block text-sm mb-1">الاسم</label>
            <input v-model="form.name" class="w-full border rounded px-2 py-2" />
          </div>
          <div>
            <label class="block text-sm mb-1">الهاتف</label>
            <input v-model="form.phone" class="w-full border rounded px-2 py-2" />
          </div>
          <div>
            <label class="block text-sm mb-1">البريد الإلكتروني</label>
            <input v-model="form.email" class="w-full border rounded px-2 py-2" />
          </div>
          <div>
            <label class="block text-sm mb-1">نوع العميل</label>
            <select v-model="form.customer_type" class="w-full border rounded px-2 py-2">
              <option value="individual">فردي</option>
              <option value="business">شركة</option>
            </select>
          </div>
          <div>
            <label class="block text-sm mb-1">الرقم الضريبي (اختياري)</label>
            <input v-model="form.tax_number" class="w-full border rounded px-2 py-2" />
          </div>
          <div class="flex items-center gap-3">
            <input type="checkbox" v-model="form.is_active" id="active" />
            <label for="active" class="text-sm">مفعل</label>
          </div>

          <div class="flex justify-end gap-2 mt-3">
            <button @click="submit" class="px-4 py-2 bg-green-600 text-white rounded">حفظ</button>
            <button @click="cancel" class="px-4 py-2 border rounded">إلغاء</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { createCustomer } from '../../api/customers'

const router = useRouter()
const form = ref<any>({ name: '', phone: '', email: '', customer_type: 'individual', tax_number: '', is_active: true })
const loading = ref(false)

const submit = async () => {
  if (!form.value.name) return alert('الاسم مطلوب')
  try {
    loading.value = true
  await createCustomer(form.value)
  // navigate back to list
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

<style scoped>
</style>
