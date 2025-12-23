<template>
  <span :class="badgeClasses" class="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded">
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  variant?: 'success' | 'warning' | 'error' | 'neutral' | 'info'
}>(), {
  variant: 'neutral',
})

const badgeClasses = computed(() => {
  const variants: Record<string, string> = {
    success: 'bg-green-50 text-green-700',
    warning: 'bg-yellow-50 text-yellow-700',
    error: 'bg-red-50 text-red-700',
    info: 'bg-primary-50 text-primary-700',
    neutral: 'bg-gray-100 text-gray-700',
  }
  return variants[props.variant] || variants.neutral
})
</script>
