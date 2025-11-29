<template>
  <MainLayout>
    <div class="space-y-4">
      <h1 class="text-2xl font-bold">لوحة التحكم</h1>
      <p class="text-gray-600">مرحباً بك في مشروع Vue + Tailwind 🚀</p>

      <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
        زر تجريبي
      </button>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import MainLayout from './components/layout/MainLayout.vue'
</script>