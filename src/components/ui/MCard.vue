<template>
  <div :class="['bg-white border border-gray-200 rounded-lg', padding]">
    <div v-if="title" class="px-4 py-3 border-b border-gray-100">
      <h3 class="text-base font-semibold text-gray-900">{{ title }}</h3>
    </div>
    <div :class="title ? '' : padding">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  padding?: string
}>(), {
  padding: 'p-4',
})
</script>
