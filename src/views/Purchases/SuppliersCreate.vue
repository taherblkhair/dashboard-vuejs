<template>
  <div class="p-6 bg-gray-50 min-h-screen" dir="rtl">
    <div class="max-w-3xl mx-auto space-y-6">
      
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900">{{ supplierId ? 'تعديل بيانات مورد' : 'إضافة مورد جديد' }}</h1>
          <p class="text-sm text-gray-500 mt-1">أدخل معلومات المورد وسجل بيانات الاتصال</p>
        </div>
      </div>

      <form @submit.prevent="submit" class="space-y-6">
        <MCard title="المعلومات الأساسية">
          <div class="p-4 space-y-4">
            <MInput v-model="form.name" label="اسم المورد" placeholder="مثال: شركة النور للتجارة" required />
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MInput v-model="form.contact_name" label="الشخص المسؤول" placeholder="اسم جهة الاتصال" />
              <MInput v-model="form.phone" label="رقم الهاتف" placeholder="09XXXXXXXX" />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MInput v-model="form.email" label="البريد الإلكتروني" type="email" placeholder="email@example.com" />
              <MInput v-model.number="form.lead_time_days" label="زمن التوريد المتوقع (أيام)" type="number" min="0" />
            </div>
          </div>
        </MCard>

        <MCard title="العنوان والملاحظات">
          <div class="p-4 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">العنوان</label>
              <select v-model.number="form.address_id" :disabled="addressesLoading" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm disabled:bg-gray-50">
                <option value="">اختر عنواناً</option>
                <option v-for="a in addresses" :key="a.id" :value="a.id">{{ a.city }} - {{ a.area }} - {{ a.street }}</option>
              </select>
              <p v-if="addressesLoading" class="mt-1 text-[10px] text-gray-400">جاري تحميل العناوين...</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">ملاحظات</label>
              <textarea v-model="form.notes" rows="3" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm" placeholder="أي تفاصيل أخرى عن المورد..."></textarea>
            </div>
          </div>
        </MCard>

        <div v-if="error" class="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
          {{ error }}
        </div>

        <div class="flex items-center gap-3 justify-end pt-4">
          <MButton variant="secondary" type="button" @click="() => router.back()">إلغاء</MButton>
          <MButton variant="primary" type="submit" :loading="submitting">حفظ البيانات</MButton>
        </div>
      </form>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { createSupplier, fetchSupplier, updateSupplier } from '../../api/suppliers'
import { fetchAddresses } from '../../api/addresses'
import MButton from '../../components/ui/MButton.vue'
import MInput from '../../components/ui/MInput.vue'
import MCard from '../../components/ui/MCard.vue'

const router = useRouter()
const route = useRoute()
const supplierId = Number(route.params.id || 0)

const submitting = ref(false)
const error = ref('')
const addresses = ref<any[]>([])
const addressesLoading = ref(false)

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
  addressesLoading.value = true
  try {
    const res = await fetchAddresses()
    addresses.value = Array.isArray(res) ? res : (res?.data || res || [])
  } catch (e) {
    console.error(e)
    addresses.value = []
  } finally {
    addressesLoading.value = false
  }
}

const loadSupplier = async (id: number) => {
  try {
    const res = await fetchSupplier(id)
    Object.assign(form.value, res?.data || {})
  } catch (e) { console.error(e) }
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
    error.value = e?.message || 'فشل الحفظ'
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
</style>
