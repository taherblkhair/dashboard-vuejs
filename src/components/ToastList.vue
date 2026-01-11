<template>
  <div class="fixed top-4 left-4 right-4 z-[100] space-y-3 pointer-events-none md:left-8 md:right-auto md:w-auto md:min-w-[340px]">
    <div 
      v-for="t in toasts" 
      :key="t.id" 
      class="pointer-events-auto w-full p-4 rounded-2xl shadow-xl shadow-slate-200/50 flex items-start justify-between gap-4 transition-all duration-500 animate-in slide-in-from-top-4 md:max-w-md ring-1 ring-inset"
      :class="{
        'bg-green-50 text-green-900 ring-green-100': t.type === 'success',
        'bg-red-50 text-red-900 ring-red-100': t.type === 'error',
        'bg-yellow-50 text-yellow-900 ring-yellow-100': t.type === 'warning',
        'bg-gray-50 text-gray-900 ring-gray-100': (!t.type || t.type === 'info')
      }"
    >
      <div class="flex gap-3">
        <!-- Icons -->
        <div class="shrink-0 mt-0.5">
          <svg v-if="t.type === 'success'" class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <svg v-else-if="t.type === 'error'" class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
           <svg v-else class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="text-sm font-bold leading-snug" v-html="t.message"></div>
      </div>
      <button 
        @click="$emit('remove', t.id)" 
        class="shrink-0 p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ toasts: Array<{ id: number; message: string; type?: string }> }>()
</script>

<style scoped>
.fixed { position: fixed }
</style>
