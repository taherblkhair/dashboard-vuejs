<template>
  <div class="overflow-x-auto">
    <table class="min-w-full">
      <thead>
        <tr class="border-b border-gray-200">
          <slot name="header" />
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100">
        <slot />
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
</script>
