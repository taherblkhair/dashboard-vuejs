<template>
  <div class="fixed left-4 top-4 space-y-2 z-50">
    <div v-for="t in toasts" :key="t.id" :class="['max-w-sm p-3 rounded shadow', t.type === 'error' ? 'bg-red-600 text-white' : 'bg-green-600 text-white']">
      <div class="flex items-start justify-between gap-3">
        <div class="text-sm" v-html="t.message"></div>
        <button @click="$emit('remove', t.id)" class="opacity-80 hover:opacity-100">✕</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ toasts: Array<{ id: number; message: string; type?: string }> }>()
</script>

<style scoped>
.fixed { position: fixed }
</style>
