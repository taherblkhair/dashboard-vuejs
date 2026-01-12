<template>
  <div class="relative">
    <input
      ref="inputRef"
      v-model="query"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
      @keydown.down.prevent="onKeyDown(1)"
      @keydown.up.prevent="onKeyDown(-1)"
      @keydown.enter.prevent="onEnter"
      :placeholder="placeholder || 'ابحث عن عميل (الاسم أو رقم الهاتف)'"
      class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 transition-shadow" 
    />

    <ul v-if="show && results.length" class="absolute z-50 mt-1 w-full bg-white border border-gray-100 rounded-lg shadow-lg max-h-60 overflow-auto animate-in fade-in zoom-in-95 duration-100">
      <li 
        v-for="(r, i) in results" 
        :key="r.id" 
        :class="['px-3 py-2 cursor-pointer hover:bg-gray-50 flex justify-between items-center', i === idx ? 'bg-gray-50' : '']"
        @mousedown.prevent="selectResult(r)"
      >
        <div>
           <div class="text-sm font-bold text-gray-900">{{ r.name }}</div>
           <div class="text-xs text-gray-500 font-mono">{{ r.phone }}</div>
        </div>
        <div v-if="r.customer_type" class="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
          {{ r.customer_type === 'business' ? 'شركة' : 'فرد' }}
        </div>
      </li>
    </ul>
    
    <div v-if="show && !results.length && !loading && query.trim()" class="absolute z-50 mt-1 w-full bg-white border border-gray-100 rounded-lg shadow-lg p-3 text-sm text-gray-500 text-center">
      لا توجد نتائج
    </div>
    
    <div v-if="loading" class="absolute z-50 mt-1 w-full bg-white border border-gray-100 rounded-lg shadow-lg p-3 text-sm text-gray-500 text-center">
      جاري البحث...
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { fetchCustomers } from '../api/customers'

const props = defineProps({
  modelValue: { type: [Number, String], default: null },
  initialLabel: { type: String, default: '' },
  placeholder: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue', 'select'])

const query = ref('')
const results = ref<any[]>([])
const loading = ref(false)
const show = ref(false)
const idx = ref(-1)
let timer: any = null
const inputRef = ref<HTMLInputElement | null>(null)

// If initialLabel is provided (e.g. from existing data), set it
watch(() => props.initialLabel, (val) => {
  if (val && !show.value) query.value = val
}, { immediate: true })

// Clear query if modelValue is cleared externally
watch(() => props.modelValue, (val) => {
  if (!val) query.value = ''
})

const search = async (q: string) => {
  if (!q || q.trim().length === 0) {
    results.value = []
    loading.value = false
    return
  }
  loading.value = true
  try {
    const res = await fetchCustomers(1, q)
    results.value = res?.data || []
    if (results.value.length > 0) show.value = true
    idx.value = -1
  } catch (e) {
    console.error(e)
    results.value = []
  } finally {
    loading.value = false
  }
}

const onInput = () => {
  show.value = !!query.value.trim()
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => search(query.value), 300)
}

const onFocus = () => {
    if (query.value.trim() && results.value.length) show.value = true
}

const onBlur = () => {
    // delay hiding to allow mousedown on result to fire
    setTimeout(() => { show.value = false }, 200)
}

const selectResult = (r: any) => {
  query.value = r.name
  emit('update:modelValue', r.id)
  emit('select', r)
  show.value = false
}

const onKeyDown = (dir: number) => {
  if (!results.value.length) return
  idx.value = Math.min(Math.max(0, idx.value + dir), results.value.length - 1)
  
  // scroll into view
}

const onEnter = () => {
  if (idx.value >= 0 && idx.value < results.value.length) {
    selectResult(results.value[idx.value])
    inputRef.value?.blur()
  }
}
</script>

<style scoped>
</style>
