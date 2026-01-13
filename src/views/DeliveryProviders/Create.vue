<template>
  <div class="p-6 bg-gray-50 min-h-screen" dir="rtl">
    <div class="max-w-3xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold">إضافة مزود توصيل</h1>
          <p class="text-sm text-gray-500">إنشاء مزود توصيل جديد عبر واجهة API.</p>
        </div>
        <div>
          <router-link to="/delivery-providers" class="px-3 py-2 border rounded">العودة للقائمة</router-link>
        </div>
      </div>

      <form @submit.prevent="submit" class="bg-white p-4 rounded shadow">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label class="text-sm">الاسم</label>
            <input v-model="form.name" required class="w-full border rounded px-2 py-1 mt-1" />
          </div>

          <div>
            <label class="text-sm">النوع</label>
            <select v-model="form.type" class="w-full border rounded px-2 py-1 mt-1">
              <option value="company">شركة</option>
              <option value="individual">مستقل</option>
            </select>
          </div>

          <div>
            <label class="text-sm">الشخص المسؤول</label>
            <input v-model="form.contact_person" class="w-full border rounded px-2 py-1 mt-1" />
          </div>

          <div>
            <label class="text-sm">الهاتف</label>
            <input v-model="form.phone" class="w-full border rounded px-2 py-1 mt-1" />
          </div>

          <div>
            <label class="text-sm">البريد الإلكتروني</label>
            <input v-model="form.email" type="email" class="w-full border rounded px-2 py-1 mt-1" />
          </div>

          <div>
            <label class="text-sm">العنوان</label>
            <input v-model="form.address" class="w-full border rounded px-2 py-1 mt-1" />
          </div>
        </div>

        <div class="mt-3">
          <h3 class="font-medium">قواعد التسعير</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
            <div>
              <label class="text-sm">الرسوم الأساسية</label>
              <input v-model.number="form.pricing_rules.base_fee" type="number" step="0.01" class="w-full border rounded px-2 py-1 mt-1" />
            </div>
            <div>
              <label class="text-sm">معدل الوزن (SAR/kg)</label>
              <input v-model.number="form.pricing_rules.weight_rate" type="number" step="0.01" class="w-full border rounded px-2 py-1 mt-1" />
            </div>
            <div>
              <label class="text-sm">معدل المسافة (SAR/km)</label>
              <input v-model.number="form.pricing_rules.distance_rate" type="number" step="0.01" class="w-full border rounded px-2 py-1 mt-1" />
            </div>
          </div>

          <div class="mt-3">
            <label class="text-sm">رسوم المناطق (JSON بسيط)</label>
            <textarea v-model="areaFeesRaw" rows="3" class="w-full border rounded px-2 py-1 mt-1 text-sm" />
            <div class="text-xs text-gray-500 mt-1">مثال: { "الرياض": 5, "جدة": 10 }</div>
          </div>
        </div>

        <div class="mt-3">
          <label class="text-sm">مناطق الخدمة (افصل بفواصل)</label>
          <input v-model="serviceAreasRaw" class="w-full border rounded px-2 py-1 mt-1" placeholder="الرياض, جدة, الدمام" />
        </div>

        <div class="mt-3 flex items-center gap-3">
          <label class="inline-flex items-center">
            <input type="checkbox" v-model="form.is_active" class="mr-2" />
            <span class="text-sm">نشط</span>
          </label>

          <button :disabled="submitting" type="submit" class="px-4 py-2 bg-blue-600 text-white rounded">
            {{ submitting ? 'جارٍ الإرسال...' : 'إنشاء' }}
          </button>
        </div>
      </form>

      <div class="mt-6">
        <h3 class="text-lg font-semibold"> مزودي التوصيل </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          <div v-for="p in shortList" :key="p.id" class="bg-white rounded shadow p-3">
            <div class="flex items-start justify-between">
              <div>
                <div class="font-semibold">{{ p.name }}</div>
                <div class="text-xs text-gray-500">{{ p.type === 'company' ? 'شركة' : 'فرد' }}</div>
              </div>
              <div class="text-sm text-gray-600">{{ p.phone }}</div>
            </div>
            <div class="text-sm text-gray-600 mt-2">{{ p.address }}</div>
          </div>
        </div>
        <div v-if="!shortList.length" class="text-gray-500 mt-3">لا توجد بيانات لعرضها</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { createDeliveryProvider, fetchDeliveryProviders } from '../../api/deliveryProviders'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = ref<any>({
  name: 'شركة درب السبيل',
  type: 'company',
  contact_person: 'أحمد محمد',
  phone: '+966501234567',
  email: 'info@fast-delivery.com',
  address: 'الرياض - حي العليا',
  pricing_rules: {
    base_fee: 15,
    area_fees: { 'الرياض': 5, 'جدة': 10, 'الدمام': 12 },
    weight_rate: 2,
    distance_rate: 1.5,
  },
  service_areas: ['الرياض', 'جدة', 'الدمام'],
  is_active: true,
})

const areaFeesRaw = ref<string>(JSON.stringify(form.value.pricing_rules.area_fees))
const serviceAreasRaw = ref<string>(form.value.service_areas.join(', '))

const submitting = ref(false)
const providers = ref<any[]>([])

const shortList = computed(() => providers.value.slice(0, 5))

const load = async () => {
  try {
    const res = await fetchDeliveryProviders(1)
    const d = res?.data?.data ?? res?.data ?? []
    providers.value = d
  } catch (e) {
    console.error('Failed to load providers', e)
  }
}

const submit = async () => {
  // merge area fees and service areas
  try {
    submitting.value = true
    const areaFees = JSON.parse(areaFeesRaw.value || '{}')
    const service_areas = serviceAreasRaw.value.split(',').map((s: string) => s.trim()).filter(Boolean)
    const payload = {
      ...form.value,
      pricing_rules: {
        ...form.value.pricing_rules,
        area_fees: areaFees,
      },
      service_areas,
    }

    await createDeliveryProvider(payload)
    // refresh short list
    await load()
    // navigate back to list or reset form
    router.push({ path: '/delivery-providers' })
  } catch (err: any) {
    console.error('Create failed', err)
    alert('فشل الإنشاء: ' + (err?.message || err))
  } finally {
    submitting.value = false
  }
}

onMounted(() => load())
</script>

<style scoped>
.text-right { text-align: right }
</style>
