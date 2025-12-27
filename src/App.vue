<template>
  <!-- global toast list -->
  <ToastList :toasts="toasts" @remove="removeToast" />
  <!-- global confirm dialog -->
  <ConfirmDialog />
  <!-- router-view is the app entry; Login route is top-level and will not be wrapped by MainLayout -->
  <router-view />
</template>

<script setup lang="ts">
import ToastList from './components/ToastList.vue'
import ConfirmDialog from './components/ui/ConfirmDialog.vue'
import { useToast } from './composables/useToast'

const { toasts, removeToast } = useToast()
</script>

<script lang="ts">
// expose binding names for template (Vue SFC bindings are available automatically from setup)
export default {}
</script>
