<template>
  <div class="p-6 bg-gray-50 min-h-screen" dir="rtl">
    <div class="max-w-2xl mx-auto bg-white p-6 rounded shadow">
  <h2 class="text-xl font-semibold mb-4">{{ supplierId ? 'تعديل مورد' : 'إضافة مورد جديد' }}</h2>

      <form @submit.prevent="submit" class="space-y-4">
        <div>
          <label class="text-sm text-gray-600">الاسم</label>
          <input v-model="form.name" required class="w-full mt-1 p-2 border rounded" />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="text-sm text-gray-600">الشخص المسؤول</label>
            <input v-model="form.contact_name" class="w-full mt-1 p-2 border rounded" />
          </div>
          <div>
            <label class="text-sm text-gray-600">الهاتف</label>
            <input v-model="form.phone" class="w-full mt-1 p-2 border rounded" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="text-sm text-gray-600">البريد الإلكتروني</label>
            <input v-model="form.email" type="email" class="w-full mt-1 p-2 border rounded" />
          </div>
          <div>
            <label class="text-sm text-gray-600">الرمز الضريبي</label>
            <input v-model="form.tax_number" class="w-full mt-1 p-2 border rounded" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="text-sm text-gray-600">شروط الدفع</label>
            <input v-model="form.payment_terms" class="w-full mt-1 p-2 border rounded" />
          </div>
          <div>
            <label class="text-sm text-gray-600">زمن التوريد (أيام)</label>
            <input v-model.number="form.lead_time_days" type="number" min="0" class="w-full mt-1 p-2 border rounded" />
          </div>
        </div>

        <div>
          <label class="text-sm text-gray-600">العنوان</label>
          <select v-model.number="form.address_id" class="w-full mt-1 p-2 border rounded">
            <option value="">اختر عنواناً</option>
            <option v-for="a in addresses" :key="a.id" :value="a.id">{{ a.city }} - {{ a.area }} - {{ a.street }} {{ a.building || '' }}</option>
          </select>
        </div>

        <div>
          <label class="text-sm text-gray-600">ملاحظات</label>
          <textarea v-model="form.notes" rows="3" class="w-full mt-1 p-2 border rounded"></textarea>
        </div>

        <div class="flex items-center gap-3">
          <button :disabled="submitting" type="submit" class="px-4 py-2 bg-green-600 text-white rounded">حفظ</button>
          <button type="button" @click="() => router.back()" class="px-4 py-2 bg-gray-200 rounded">إلغاء</button>
        </div>

        <div v-if="error" class="text-sm text-red-600">{{ error }}</div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { createSupplier, fetchSupplier, updateSupplier } from '../../api/suppliers'
import { fetchAddresses } from '../../api/addresses'

const router = useRouter()
const submitting = ref(false)
const error = ref('')
const addresses = ref<any[]>([])

const route = useRoute()
const supplierId = Number(route.params.id || 0)

const form = ref({
  name: '',
  contact_name: '',
  phone: '',
  email: '',
  address_id: undefined as number | undefined,
  tax_number: '',
  payment_terms: '',
  lead_time_days: 0,
  notes: '',
  is_active: true
})

const loadAddresses = async () => {
  try {
    const res = await fetchAddresses()
    addresses.value = res?.data || []
  } catch (e) {
    console.error('Failed to load addresses', e)
  }
}

const loadSupplier = async (id: number) => {
  try {
    const res = await fetchSupplier(id)
    const data = res?.data || {}
    Object.assign(form.value, data)
  } catch (e) {
    console.error('Failed to load supplier', e)
  }
}

onMounted(() => {
  loadAddresses()
  if (supplierId) loadSupplier(supplierId)
})

const submit = async () => {
  error.value = ''
  submitting.value = true
  try {
    if (supplierId) {
      await updateSupplier(supplierId, form.value)
    } else {
      await createSupplier(form.value)
    }
    router.push({ name: 'PurchasesSuppliers' })
  } catch (e: any) {
    console.error('Create supplier error', e)
    error.value = e?.message || 'فشل الحفظ'
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
</style>
