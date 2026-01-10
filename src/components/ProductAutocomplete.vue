<template>
  <div class="relative">
    <input
      v-model="query"
      @input="onInput"
      @keydown.down.prevent="onKeyDown(1)"
      @keydown.up.prevent="onKeyDown(-1)"
      @keydown.enter.prevent="onEnter"
      :placeholder="placeholder || 'ابحث عن صنف...'
      "
      aria-autocomplete="list"
      role="combobox"
      :aria-expanded="show"
      class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
    />

    <ul v-if="show && (results.length || loading)" class="absolute z-50 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-56 overflow-auto">
      <li v-if="loading" class="px-3 py-3 text-sm text-gray-500">جاري البحث...</li>
      <li v-else-if="!results.length" class="px-3 py-3 text-sm text-gray-500">لا توجد نتائج</li>
      <li v-else v-for="(r, i) in results" :key="r.id" :class="['px-3 py-3 hover:bg-gray-50', i === idx ? 'bg-gray-100' : '']" role="option" :aria-selected="i === idx">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm font-medium text-gray-800">{{ r.name }}</div>
            <div class="text-xs text-gray-500">{{ r.category?.name || 'بدون تصنيف' }}</div>
          </div>
          <div class="text-right">
            <div class="text-xs text-gray-400">{{ r.sku || r.code || '—' }}</div>
            <div class="text-xs text-gray-400">{{ (r.variants && r.variants.length) ? r.variants.length + ' متغير' : 'بدون متغير' }}</div>
          </div>
        </div>
        <div class="mt-2 flex justify-end gap-2">
          <button
            class="text-xs text-blue-600 hover:underline"
            @mousedown.prevent.stop="() => emit('select-all', r)"
            title="أضِف كل المتغيرات إلى الطلب"
          >
            أضف كل المتغيرات
          </button>
          <button class="text-xs text-gray-600 hover:text-gray-800" @mousedown.prevent.stop="() => selectResult(r)">اختر</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { searchProducts } from '../api/products'

const props = defineProps({
  modelValue: { type: [Number, String], default: null },
  placeholder: { type: String, default: '' },
  selectedLabel: { type: String, default: '' }
})
const emit = defineEmits(['update:modelValue', 'select', 'select-all'])

const query = ref('')
const results = ref<any[]>([])
const loading = ref(false)
const show = ref(false)
let timer: any = null
const idx = ref(-1)

// keep query in sync when parent provides a selected label (so the input shows the name)
watch(() => props.selectedLabel, (val) => {
  if (val && typeof val === 'string') {
    query.value = val
    show.value = false
  } else if (!val) {
    query.value = ''
  }
})

watch(() => props.modelValue, (val) => {
  if (!val) query.value = ''
})

const search = async (q: string) => {
  if (!q || q.trim().length === 0) {
    results.value = []
    return
  }
  loading.value = true
  try {
    const res = await searchProducts(q, 1)
    results.value = res?.data || []
    show.value = true
    idx.value = -1
  } catch (e) {
    console.error('product search failed', e)
    results.value = []
  } finally {
    loading.value = false
  }
}

const onInput = () => {
  show.value = true
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => search(query.value), 300)
}

const selectResult = (r: any) => {
  emit('update:modelValue', r.id)
  emit('select', r)
  // update input label so the selected product name appears
  query.value = r.name || ''
  show.value = false
}

const onKeyDown = (dir: number) => {
  if (!results.value.length) return
  idx.value = Math.min(Math.max(0, idx.value + dir), results.value.length - 1)
}

const onEnter = () => {
  if (idx.value >= 0 && idx.value < results.value.length) selectResult(results.value[idx.value])
}

onMounted(() => {
  // nothing
})
</script>

<style scoped>
.relative ul { min-width: 10rem }
</style>

