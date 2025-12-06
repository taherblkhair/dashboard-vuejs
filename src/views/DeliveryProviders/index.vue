<template>
  <div class="p-6 bg-gray-50 min-h-screen" dir="rtl">
    <div class="max-w-6xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold">مزودو خدمة التوصيل</h1>
          <p class="text-sm text-gray-500">قائمة مزودي التوصيل المتوفرين ومعلوماتهم الأساسية.</p>
        </div>
        <div class="flex items-center gap-3">
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" @click="createDeliveryProvider">
            إضافة مزود
          </button>
          </div>

      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="p in providers" :key="p.id" class="bg-white rounded shadow p-4">
          <div class="flex items-start justify-between gap-3">
            <div>
              <h3 class="font-semibold text-lg">{{ p.name }}</h3>
              <div class="text-xs text-gray-500">{{ p.type === 'company' ? 'شركة' : 'فرد' }}</div>
            </div>
            <div class="text-right text-sm">
              <div :class="p.is_active ? 'text-green-600' : 'text-red-500'">{{ p.is_active ? 'نشط' : 'غير نشط' }}</div>
              <div class="text-gray-500">رُكب: {{ p.active_riders_count ?? 0 }}</div>
            </div>
          </div>

          <div class="mt-3 text-sm text-gray-700 space-y-1">
            <div><strong>جهة الاتصال:</strong> {{ p.contact_person }}</div>
            <div><strong>الهاتف:</strong> <a :href="`tel:${p.phone}`" class="text-blue-600">{{ p.phone }}</a></div>
            <div v-if="p.email"><strong>البريد:</strong> {{ p.email }}</div>
            <div v-if="p.address"><strong>العنوان:</strong> {{ p.address }}</div>
            <div v-if="p.service_areas && p.service_areas.length"><strong>مناطق الخدمة:</strong> {{ p.service_areas.join(', ') }}</div>
          </div>

          <div class="mt-3 text-sm text-gray-600 border-t pt-3 flex items-center justify-between">
            <div>إجمالي التوصيلات: <span class="font-semibold">{{ p.total_deliveries_count ?? 0 }}</span></div>
            <button @click="viewDetails(p.id)" class="px-3 py-1 bg-blue-600 text-white rounded text-sm">عرض</button>
          </div>
        </div>
      </div>

      <div v-if="!providers.length && !loading" class="text-center text-gray-500 mt-8">لا يوجد مزودو توصيل</div>

      <div class="mt-6 flex justify-center">
        <button v-if="meta && meta.current_page < meta.last_page" @click="load(meta.current_page + 1)" class="px-4 py-2 bg-gray-200 rounded">المزيد</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { fetchDeliveryProviders } from '../../api/deliveryProviders'
import { useRouter } from 'vue-router'

const providers = ref<any[]>([])
const meta = ref<any>(null)
const loading = ref(false)
const router = useRouter()

const load = async (page = 1) => {
  loading.value = true
  try {
    const res = await fetchDeliveryProviders(page)
    const d = res?.data?.data ?? res?.data ?? []
    const m = res?.data?.meta ?? res?.meta ?? null
    if (page === 1) providers.value = d
    else providers.value.push(...d)
    meta.value = m
  } catch (e) {
    console.error('Failed to load delivery providers', e)
  } finally {
    loading.value = false
  }
}

const viewDetails = (id: number) => {
  // placeholder - no details page yet
  router.push({ path: `/delivery-providers/${id}` })
}

const createDeliveryProvider = () => {
  router.push({ path: `delivery-providers/create` })
}
onMounted(() => load(1))
</script>

<style scoped>
.text-right { text-align: right }
</style>
