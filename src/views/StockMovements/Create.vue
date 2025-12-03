<template>
  <div class="p-6 bg-gray-50 min-h-screen" dir="rtl">
    <div class="max-w-xl mx-auto">
      <div class="mb-6">
        <h1 class="text-2xl font-bold">إضافة حركة مخزون</h1>
        <p class="text-sm text-gray-500">أدخل بيانات الحركة ثم اضغط حفظ</p>
      </div>

      <form @submit.prevent="submit" class="bg-white p-6 rounded-lg shadow">
        <div class="grid grid-cols-1 gap-4">
          <div>
            <label class="block text-sm text-gray-700 mb-1">المخزن (warehouse_id)</label>
            <input v-model.number="form.warehouse_id" type="number" required class="w-full px-3 py-2 border rounded" />
          </div>

          <div>
            <label class="block text-sm text-gray-700 mb-1">معرف المنتج (variant id)</label>
            <input v-model.number="form.product_variant_id" type="number" required class="w-full px-3 py-2 border rounded" />
          </div>

          <div>
            <label class="block text-sm text-gray-700 mb-1">النوع</label>
            <select v-model="form.type" required class="w-full px-3 py-2 border rounded">
              <option value="IN">IN (وارد)</option>
              <option value="OUT">OUT (صادر)</option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm text-gray-700 mb-1">الكمية</label>
              <input v-model.number="form.quantity" type="number" min="0" step="1" required class="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label class="block text-sm text-gray-700 mb-1">تكلفة الوحدة</label>
              <input v-model.number="form.unit_cost" type="number" step="0.01" class="w-full px-3 py-2 border rounded" />
            </div>
          </div>

          <div>
            <label class="block text-sm text-gray-700 mb-1">الملاحظة</label>
            <input v-model="form.note" class="w-full px-3 py-2 border rounded" />
          </div>

          <div>
            <label class="block text-sm text-gray-700 mb-1">تاريخ الحركة</label>
            <input v-model="form.movement_date_local" type="datetime-local" class="w-full px-3 py-2 border rounded" />
            <div class="text-xs text-gray-400 mt-1">سيتم تحويل التاريخ إلى الصيغة المطلوبة قبل الإرسال</div>
          </div>
        </div>

        <div class="flex justify-end gap-3 mt-6">
          <button type="button" @click="cancel" class="px-4 py-2 border rounded">إلغاء</button>
          <button :disabled="submitting" type="submit" class="px-4 py-2 bg-blue-600 text-white rounded">
            {{ submitting ? 'جارٍ...' : 'حفظ' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { createStockMovement } from '../../api/stockMovements'

const route = useRoute()
const router = useRouter()

const form = reactive<any>({
  warehouse_id: undefined,
  product_variant_id: undefined,
  type: 'IN',
  quantity: 1,
  unit_cost: undefined,
  note: '',
  // local binding for datetime-local input
  movement_date_local: ''
})

const submitting = ref(false)

onMounted(() => {
  // prefill warehouse id from query param if present
  const w = route.query.warehouse_id
  if (w) {
    const n = Number(w)
    if (!isNaN(n)) form.warehouse_id = n
  }
})

function toServerDate(local: string | undefined) {
  if (!local) return undefined
  // local looks like '2025-12-03T14:30'
  const s = local.replace('T', ' ')
  // add seconds if missing
  return s.length === 16 ? `${s}:00` : s
}

const submit = async () => {
  if (!form.warehouse_id || !form.product_variant_id || !form.type || !form.quantity) {
    alert('الرجاء تعبئة الحقول المطلوبة')
    return
  }
  submitting.value = true
  try {
    const payload: any = {
      warehouse_id: Number(form.warehouse_id),
      product_variant_id: Number(form.product_variant_id),
      type: form.type,
      quantity: Number(form.quantity),
      unit_cost: form.unit_cost !== undefined ? Number(form.unit_cost) : undefined,
      note: form.note || undefined,
      movement_date: toServerDate(form.movement_date_local) || undefined
    }

    await createStockMovement(payload)
    alert('تم إنشاء حركة المخزون')
    router.back()
  } catch (e) {
    console.error('Create stock movement failed', e)
    alert('فشل إنشاء حركة المخزون')
  } finally {
    submitting.value = false
  }
}

const cancel = () => router.back()
</script>

<style scoped>
/* minor */
</style>
