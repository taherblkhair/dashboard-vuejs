<template>
  <div class="p-6 bg-gray-50 min-h-screen" dir="rtl">
    <div class="max-w-2xl mx-auto">
      <div class="mb-6">
        <h1 class="text-2xl font-bold">إضافة مخزن جديد</h1>
        <p class="text-sm text-gray-500">أدخل بيانات المخزن ثم اضغط حفظ</p>
      </div>

      <form @submit.prevent="submit" class="bg-white p-6 rounded-lg shadow">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm text-gray-700 mb-1">الاسم</label>
            <input v-model="form.name" required class="w-full px-3 py-2 border rounded" />
          </div>

          <div>
            <label class="block text-sm text-gray-700 mb-1">الرمز (Code)</label>
            <input v-model="form.code" required class="w-full px-3 py-2 border rounded" />
          </div>

          <div>
            <label class="block text-sm text-gray-700 mb-1">معرف العنوان (address_id)</label>
            <input v-model.number="form.address_id" type="number" class="w-full px-3 py-2 border rounded" />
          </div>

          <div>
            <label class="block text-sm text-gray-700 mb-1">معرف المدير (manager_id)</label>
            <input v-model.number="form.manager_id" type="number" class="w-full px-3 py-2 border rounded" />
          </div>

          <div>
            <label class="block text-sm text-gray-700 mb-1">الهاتف</label>
            <input v-model="form.phone" class="w-full px-3 py-2 border rounded" />
          </div>

          <div>
            <label class="block text-sm text-gray-700 mb-1">البريد الإلكتروني</label>
            <input v-model="form.email" type="email" class="w-full px-3 py-2 border rounded" />
          </div>

          <div>
            <label class="block text-sm text-gray-700 mb-1">السعة</label>
            <input v-model.number="form.capacity" type="number" class="w-full px-3 py-2 border rounded" />
          </div>

          <div>
            <label class="block text-sm text-gray-700 mb-1">النوتس</label>
            <input v-model="form.notes" class="w-full px-3 py-2 border rounded" />
          </div>

          <div class="flex items-center gap-3">
            <input type="checkbox" v-model="form.is_active" id="active" />
            <label for="active" class="text-sm text-gray-700">نشط</label>
          </div>
        </div>

        <div class="flex justify-end gap-3 mt-6">
          <button type="button" @click="cancel" class="px-4 py-2 border rounded">إلغاء</button>
          <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded">حفظ</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { createWarehouse } from '../../api/warehouses'

const router = useRouter()

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

const submit = async () => {
  try {
    const payload = { ...form }
    await createWarehouse(payload)
    alert('تم إنشاء المخزن بنجاح')
    router.push({ name: 'Warehouses' })
  } catch (e) {
    console.error('Create warehouse failed', e)
    alert('فشل إنشاء المخزن')
  }
}

const cancel = () => router.push({ name: 'Warehouses' })
</script>

<style scoped>
/* minimal */
</style>
