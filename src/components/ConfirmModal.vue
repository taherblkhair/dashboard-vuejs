<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div class="bg-white rounded shadow p-4 w-96" dir="rtl">
      <h3 class="font-semibold mb-2">{{ title }}</h3>
      <div class="text-sm text-gray-700">{{ message }}</div>
      <div class="mt-4 flex justify-end gap-2">
        <button @click="$emit('cancel')" class="px-3 py-1 border rounded">إلغاء</button>
        <button @click="$emit('confirm')" class="px-3 py-1 bg-red-600 text-white rounded">تأكيد</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ show: boolean; title?: string; message?: string }>()
// emits: confirm, cancel
</script>

<style scoped>
</style>
