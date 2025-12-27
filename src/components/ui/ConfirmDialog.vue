<template>
  <div v-if="state.isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click.self="handleCancel">
    <div class="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden animate-fade-in-up">
      <div class="p-6">
        <div class="flex items-start gap-4">
          <div :class="['p-3 rounded-full shrink-0', iconBgClass]">
            <svg class="w-6 h-6" :class="iconTextClass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="state.type === 'danger'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900">{{ state.title }}</h3>
            <p class="mt-2 text-sm text-gray-500 leading-relaxed">{{ state.message }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-gray-50 px-6 py-4 flex gap-3 justify-end">
        <button 
          @click="handleCancel"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
        >
          {{ state.cancelText }}
        </button>
        <button 
          @click="handleConfirm"
          class="px-4 py-2 text-sm font-medium text-white border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors"
          :class="confirmBtnClass"
        >
          {{ state.confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useConfirm } from '../../composables/useConfirm'

const { state, handleConfirm, handleCancel } = useConfirm()

const iconBgClass = computed(() => {
  switch (state.value.type) {
    case 'danger': return 'bg-red-100'
    case 'warning': return 'bg-yellow-100'
    default: return 'bg-blue-100'
  }
})

const iconTextClass = computed(() => {
  switch (state.value.type) {
    case 'danger': return 'text-red-600'
    case 'warning': return 'text-yellow-600'
    default: return 'text-blue-600'
  }
})

const confirmBtnClass = computed(() => {
  switch (state.value.type) {
    case 'danger': return 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
    case 'warning': return 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
    default: return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
  }
})
</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.2s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
