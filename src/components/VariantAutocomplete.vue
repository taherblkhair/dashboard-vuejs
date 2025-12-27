<template>
  <div class="relative">
    <input
      v-model="query"
      @input="onInput"
      @keydown.down.prevent="onKeyDown(1)"
      @keydown.up.prevent="onKeyDown(-1)"
      @keydown.enter.prevent="onEnter"
      :placeholder="placeholder || 'اكتب SKU أو اسم المنتج للبحث'"
      class="w-full border rounded px-2 py-2" />

    <ul v-if="show && results.length" class="absolute z-50 mt-1 w-full bg-white border rounded shadow max-h-48 overflow-auto">
      <li v-for="(r, i) in results" :key="r.id" :class="['px-3 py-2 cursor-pointer hover:bg-gray-50', i === idx ? 'bg-gray-100' : '']"
          @mousedown.prevent="selectResult(r)">
        <div class="text-sm font-medium">{{ r.product?.name }} <span v-if="r.sku_variant">({{ r.sku_variant }})</span></div>
        <div class="text-xs text-gray-500" v-if="r.attributes">{{ formatAttributes(r.attributes) }}</div>
      </li>
    </ul>
    <div v-if="show && !results.length && !loading" class="absolute z-50 mt-1 w-full bg-white border rounded p-2 text-sm text-gray-500">لا توجد نتائج</div>
    <div v-if="loading" class="absolute z-50 mt-1 w-full bg-white border rounded p-2 text-sm text-gray-500">جاري البحث...</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { fetchProductVariants } from '../api/products'
import { formatAttributes as fa } from '../utils/helpers'

const props = defineProps({
  modelValue: { type: [Number, String], default: null },
  placeholder: { type: String, default: '' },
  selectedLabel: { type: String, default: '' }
})
const emit = defineEmits(['update:modelValue', 'select'])

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
    // hide dropdown when a selection label is set
    show.value = false
  } else if (!val) {
    // if cleared, reset the input
    query.value = ''
  }
})

// when parent changes modelValue to null/empty, clear the input
watch(() => props.modelValue, (val) => {
  if (!val) {
    query.value = ''
  }
})

const search = async (q: string) => {
  if (!q || q.trim().length === 0) {
    results.value = []
    return
  }
  loading.value = true
  try {
    const res = await fetchProductVariants(q, 1)
    results.value = res?.data || []
    show.value = true
    idx.value = -1
  } catch (e) {
    console.error('variant search failed', e)
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
  // nothing for now
})

const formatAttributes = (a: any) => fa(a)
</script>

<style scoped>
.relative ul { min-width: 10rem }
</style>
