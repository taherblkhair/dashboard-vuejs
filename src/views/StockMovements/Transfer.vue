<template>
  <div class="p-6 bg-gray-50 min-h-screen" dir="rtl">
    <div class="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h2 class="text-xl font-semibold mb-4">نقل مخزون بين المخازن</h2>

      <form @submit.prevent="submit" class="space-y-4">
        <div>
          <label class="text-sm text-gray-600">من المخزن</label>
          <select v-model.number="form.from_warehouse_id" class="w-full mt-1 p-2 border rounded">
            <option value="">اختر المخزن المرسل</option>
            <option v-for="w in warehouses" :key="w.id" :value="w.id">{{ w.name }} — #{{ w.id }}</option>
          </select>
        </div>

        <div>
          <label class="text-sm text-gray-600">إلى المخزن</label>
          <select v-model.number="form.to_warehouse_id" class="w-full mt-1 p-2 border rounded">
            <option value="">اختر المخزن المستقبل</option>
            <option v-for="w in warehouses" :key="w.id" :value="w.id">{{ w.name }} — #{{ w.id }}</option>
          </select>
        </div>

        <div>
          <label class="text-sm text-gray-600">معرف متغير المنتج (product_variant_id)</label>
          <input v-model.number="form.product_variant_id" type="number" min="1" class="w-full mt-1 p-2 border rounded" />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="text-sm text-gray-600">الكمية</label>
            <input v-model.number="form.quantity" type="number" min="1" class="w-full mt-1 p-2 border rounded" />
          </div>
          <div>
            <label class="text-sm text-gray-600">سعر الوحدة (اختياري)</label>
            <input v-model.number="form.unit_cost" step="0.01" type="number" class="w-full mt-1 p-2 border rounded" />
          </div>
        </div>

        <div>
          <label class="text-sm text-gray-600">ملاحظة</label>
          <textarea v-model="form.note" rows="3" class="w-full mt-1 p-2 border rounded"></textarea>
        </div>

        <div class="flex items-center gap-3">
          <button :disabled="submitting" type="submit" class="px-4 py-2 bg-green-600 text-white rounded">نقل المخزون</button>
          <button type="button" @click="() => router.back()" class="px-4 py-2 bg-gray-200 rounded">إلغاء</button>
        </div>

        <div v-if="error" class="text-sm text-red-600">{{ error }}</div>
        <div v-if="success" class="text-sm text-green-600">{{ success }}</div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { fetchWarehouses } from '../../api/warehouses'
import { transferStockMovement } from '../../api/stockMovements'

const router = useRouter()
const route = useRoute()
const warehouses = ref<any[]>([])
const loading = ref(false)
const submitting = ref(false)
const error = ref('')
const success = ref('')

const form = ref({
  from_warehouse_id: null as number | null,
  to_warehouse_id: null as number | null,
  product_variant_id: null as number | null,
  quantity: 1,
  unit_cost: null as number | null,
  note: ''
})

const loadWarehouses = async () => {
  loading.value = true
  try {
    const res = await fetchWarehouses()
    warehouses.value = res?.data || []
  } catch (e) {
    console.error('Failed to load warehouses', e)
  } finally {
    loading.value = false
  }
}

onMounted(loadWarehouses)

// prefill from/to warehouse if provided via query params
onMounted(() => {
  const q = route.query
  const fromId = q.from_warehouse_id || q.warehouse_id
  const toId = q.to_warehouse_id
  if (fromId) form.value.from_warehouse_id = Number(fromId)
  if (toId) form.value.to_warehouse_id = Number(toId)
})

const submit = async () => {
  error.value = ''
  success.value = ''

  if (!form.value.from_warehouse_id || !form.value.to_warehouse_id) {
    error.value = 'يرجى اختيار كلا المخزنين (المرسل والمستقبل)'
    return
  }
  if (!form.value.product_variant_id) {
    error.value = 'يرجى إدخال معرف متغير المنتج'
    return
  }
  if (!form.value.quantity || form.value.quantity <= 0) {
    error.value = 'الكمية يجب أن تكون أكبر من صفر'
    return
  }

  submitting.value = true
  try {
    const payload = {
      from_warehouse_id: form.value.from_warehouse_id,
      to_warehouse_id: form.value.to_warehouse_id,
      product_variant_id: form.value.product_variant_id,
      quantity: form.value.quantity,
      unit_cost: form.value.unit_cost,
      note: form.value.note
    }
    await transferStockMovement(payload)
    success.value = 'تم إنشاء عملية النقل بنجاح'
    // redirect to destination warehouse details
    router.push({ name: 'WarehouseDetails', params: { id: form.value.to_warehouse_id } })
  } catch (e: any) {
    console.error('Transfer error', e)
    // If API returns validation about insufficient stock, show specific Arabic message
    const msg = (e?.message || '').toString()
    // Show the requested error message when transfer failed due to insufficient stock
    if (msg.toLowerCase().includes('stock') || msg.includes('insufficient') || (e?.response && e.response.status === 400)) {
      error.value = 'تآكد من توفر المنتج في المخزون'
    } else if (e?.response && e.response.data && e.response.data.message) {
      error.value = e.response.data.message
    } else {
      error.value = 'فشل النقل. حاول مرة أخرى.'
    }
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
/* small spacing overrides if needed */
</style>
