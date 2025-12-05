<template>
  <div class="p-6 bg-gray-50 min-h-screen" dir="rtl">
    <div class="max-w-2xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold">إضافة مندوب توصيل</h1>
          <p class="text-sm text-gray-500">إنشاء مندوب جديد وربطه بمزود توصيل.</p>
        </div>
        <div>
          <router-link to="/delivery-providers" class="px-3 py-2 border rounded">مزودو التوصيل</router-link>
        </div>
      </div>

  <form @submit.prevent="submit" class="bg-white p-4 rounded shadow">
        <div class="grid grid-cols-1 gap-3">
          <div>
            <label class="text-sm">مزود التوصيل</label>
            <select v-model.number="form.provider_id" class="w-full border rounded px-2 py-1 mt-1" :class="errors.provider_id ? 'border-red-500' : ''">
              <option value="" disabled>اختر مزوداً</option>
              <option v-for="p in providers" :key="p.id" :value="p.id">{{ p.name }} — {{ p.phone }}</option>
            </select>
            <div v-if="errors.provider_id" class="text-xs text-red-600 mt-1">{{ errors.provider_id }}</div>
          </div>

          <div>
            <label class="text-sm">الاسم</label>
            <input v-model="form.name" required class="w-full border rounded px-2 py-1 mt-1" :class="errors.name ? 'border-red-500' : ''" />
            <div v-if="errors.name" class="text-xs text-red-600 mt-1">{{ errors.name }}</div>
          </div>

          <div>
            <label class="text-sm">الهاتف</label>
            <input v-model="form.phone" required class="w-full border rounded px-2 py-1 mt-1" :class="errors.phone ? 'border-red-500' : ''" />
            <div v-if="errors.phone" class="text-xs text-red-600 mt-1">{{ errors.phone }}</div>
          </div>

          <div>
            <label class="text-sm">البريد الإلكتروني</label>
            <input v-model="form.email" type="email" class="w-full border rounded px-2 py-1 mt-1" />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label class="text-sm">نوع المركبة</label>
              <input v-model="form.vehicle_type" class="w-full border rounded px-2 py-1 mt-1" />
            </div>
            <div>
              <label class="text-sm">رقم المركبة</label>
              <input v-model="form.vehicle_number" class="w-full border rounded px-2 py-1 mt-1" />
            </div>
          </div>

          <div>
            <label class="text-sm">الحد الأقصى للسعة</label>
            <input v-model.number="form.max_capacity" type="number" class="w-full border rounded px-2 py-1 mt-1" />
          </div>

          <div>
            <label class="text-sm">الموقع الحالي</label>
            <input v-model="form.current_location" class="w-full border rounded px-2 py-1 mt-1" />
          </div>

          <div class="flex items-center gap-4">
            <label class="inline-flex items-center">
              <input type="checkbox" v-model="form.is_active" class="mr-2" />
              <span class="text-sm">نشط</span>
            </label>
            <label class="inline-flex items-center">
              <input type="checkbox" v-model="form.is_available" class="mr-2" />
              <span class="text-sm">متاح</span>
            </label>
          </div>

          <div class="mt-3">
            <button :disabled="submitting" type="submit" class="px-4 py-2 bg-blue-600 text-white rounded">{{ submitting ? 'جارٍ الإرسال...' : 'إضافة المندوب' }}</button>
          </div>
        </div>
      </form>

      <div class="mt-4">
        <h4 class="font-medium">المندوبون المضافون مؤخراً</h4>
        <ul class="mt-2 space-y-2">
          <li v-for="r in recentRiders" :key="r.id" class="bg-white p-2 rounded shadow text-sm flex justify-between">
            <div>
              <div class="font-semibold">{{ r.name }}</div>
              <div class="text-xs text-gray-500">{{ r.phone }}</div>
            </div>
            <div class="text-xs text-gray-600">{{ r.vehicle_type }}</div>
          </li>
        </ul>
        <div v-if="!recentRiders.length" class="text-gray-500 mt-2">لم يتم إضافة مندوب بعد</div>
      </div>

      <ToastList :toasts="toasts" @remove="removeToast" />

      <div class="mt-6">
        <h3 class="text-lg font-semibold">لماذا تختار المزود؟</h3>
        <p class="text-sm text-gray-500">يمكنك جلب قائمة مزودي التوصيل المتاحة في السهم أعلاه واختيار المزود الذي تريد إضافة المندوب له.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { createRider } from '../../api/riders'
import { fetchDeliveryProviders } from '../../api/deliveryProviders'
import { ridersStore } from '../../store/riders'
import ToastList from '../../components/ToastList.vue'

const form = ref<any>({
  provider_id: null,
  name: 'خالد عبدالله',
  phone: '+966501234568',
  email: 'khalid@delivery.com',
  vehicle_type: 'motorcycle',
  vehicle_number: 'ك أ 1234',
  max_capacity: 100,
  current_location: 'الرياض - حي النخيل',
  is_active: true,
  is_available: true,
})

const providers = ref<any[]>([])
const submitting = ref(false)
const toasts = ref<Array<{ id: number; message: string; type?: string }>>([])
const errors = ref<Record<string, string>>({})

const recentRiders = computed(() => ridersStore.value.slice(0, 5))

const addToast = (msg: string, type = 'success') => {
  const id = Date.now()
  toasts.value.push({ id, message: msg, type })
  setTimeout(() => { const idx = toasts.value.findIndex(t => t.id === id); if (idx !== -1) toasts.value.splice(idx, 1) }, 4000)
}

const removeToast = (id: number) => {
  const idx = toasts.value.findIndex(t => t.id === id)
  if (idx !== -1) toasts.value.splice(idx, 1)
}

const loadProviders = async () => {
  try {
    const res = await fetchDeliveryProviders(1)
    providers.value = res?.data?.data ?? res?.data ?? []
  } catch (e) {
    console.error('Failed to load providers', e)
    addToast('فشل جلب قائمة المزودين', 'error')
  }
}

const validate = () => {
  errors.value = {}
  if (!form.value.provider_id) errors.value.provider_id = 'الرجاء اختيار مزود'
  if (!form.value.name || !String(form.value.name).trim()) errors.value.name = 'الاسم مطلوب'
  if (!form.value.phone || !String(form.value.phone).trim()) errors.value.phone = 'الهاتف مطلوب'
  if (!form.value.vehicle_type || !String(form.value.vehicle_type).trim()) errors.value.vehicle_type = 'نوع المركبة مطلوب'
  return Object.keys(errors.value).length === 0
}

const submit = async () => {
  if (!validate()) {
    addToast('الرجاء تصحيح الحقول المطلوبة', 'error')
    return
  }

  try {
    submitting.value = true
    const res = await createRider(form.value)
    const created = res?.data?.data ?? res?.data ?? res
    // append to shared riders store so list views update
    if (created) ridersStore.value.unshift(created)
    addToast('تمت الإضافة بنجاح', 'success')
    // reset some fields but keep provider pre-selected
    form.value.name = ''
    form.value.phone = ''
    form.value.email = ''
    form.value.vehicle_type = ''
    form.value.vehicle_number = ''
    form.value.max_capacity = 0
    form.value.current_location = ''
  } catch (err: any) {
    console.error('Failed to create rider', err)
    addToast('فشل الإضافة: ' + (err?.message || err), 'error')
  } finally {
    submitting.value = false
  }
}

onMounted(() => loadProviders())
</script>

<style scoped>
.text-right { text-align: right }
</style>
