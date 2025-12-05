<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div class="bg-white rounded shadow p-4 w-96" dir="rtl">
      <h3 class="font-semibold mb-2">تعيين مندوب</h3>
      <div v-if="loading" class="p-4 text-center">جاري التحميل...</div>
      <div v-else>
        <div v-if="riders.length">
          <label class="text-sm">اختر المندوب</label>
          <select v-model.number="selected" class="w-full border rounded px-2 py-1 mt-1 text-sm">
            <option value="">-- اختر --</option>
            <option v-for="r in riders" :key="r.id" :value="r.id">{{ r.name }} — {{ r.phone }}</option>
          </select>
        </div>
        <div v-else class="text-gray-500 text-sm">لا توجد مناديب متاحة للمزود</div>
        <div class="mt-4 flex justify-end gap-2">
          <button @click="$emit('close')" class="px-3 py-1 border rounded">إلغاء</button>
          <button @click="confirm" :disabled="!selected" class="px-3 py-1 bg-blue-600 text-white rounded">تعيين</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { fetchRiders } from '../api/riders'

const props = defineProps<{ show: boolean; providerId?: number }>()
const emits = defineEmits(['close', 'confirm'])

const riders = ref<any[]>([])
const loading = ref(false)
const selected = ref<number | null>(null)

const load = async () => {
  if (!props.providerId) return
  loading.value = true
  try {
    const res = await fetchRiders(1, { provider_id: props.providerId })
    const d = res?.data?.data ?? res?.data ?? []
    riders.value = d
  } catch (e) {
    console.error('Failed to load riders for provider', e)
    riders.value = []
  } finally {
    loading.value = false
  }
}

watch(() => props.providerId, (nv) => {
  if (nv) load()
})

onMounted(() => { if (props.providerId) load() })

const confirm = () => {
  if (!selected.value) return
  emits('confirm', selected.value)
}
</script>

<style scoped>
.text-right { text-align: right }
</style>
