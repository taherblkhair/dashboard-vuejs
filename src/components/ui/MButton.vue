<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="buttonClasses"
    class="inline-flex items-center justify-center gap-2 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <svg v-if="loading" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
    </svg>
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'warning' | 'success'
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
}>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  disabled: false,
  loading: false,
})

const buttonClasses = computed(() => {
  const base: string[] = []

  // Size
  if (props.size === 'sm') base.push('px-3 py-1.5 text-sm rounded')
  else if (props.size === 'lg') base.push('px-6 py-3 text-base rounded-lg')
  else base.push('px-4 py-2 text-sm rounded-lg')

  // Variant
  if (props.variant === 'primary') {
    base.push('bg-primary-600 text-white hover:bg-primary-700')
  } else if (props.variant === 'secondary') {
    base.push('bg-white text-gray-700 border border-gray-300 hover:bg-gray-50')
  } else if (props.variant === 'danger') {
    base.push('bg-red-600 text-white hover:bg-red-700')
  } else if (props.variant === 'warning') {
    base.push('bg-yellow-500 text-white hover:bg-yellow-600')
  } else if (props.variant === 'success') {
    base.push('bg-green-600 text-white hover:bg-green-700')
  } else {
    base.push('bg-transparent text-gray-600 hover:bg-gray-100')
  }

  return base.join(' ')
})
</script>
