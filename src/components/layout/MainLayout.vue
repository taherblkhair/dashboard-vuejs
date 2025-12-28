<template>
  <div class="flex h-screen bg-slate-50" dir="rtl">
    <Sidebar
      :isOpen="sidebarOpen"
      @close="sidebarOpen = false"
      @navigate="sidebarOpen = false"
    />

    <div class="flex-1 flex flex-col overflow-hidden">
      <Navbar @toggle-sidebar="sidebarOpen = !sidebarOpen" />

      <!-- global breadcrumbs -->
      <Breadcrumbs />

      <main class="flex-1 overflow-auto p-4">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from "vue";
import Sidebar from "./Sidebar.vue";
import Navbar from "./Navbar.vue";
import Breadcrumbs from "./Breadcrumbs.vue";

const sidebarOpen = ref(false);

// prevent background scrolling when sidebar (mobile) is open
watch(sidebarOpen, (val) => {
  if (typeof document !== "undefined") {
    document.body.classList.toggle("overflow-hidden", val);
  }
});

// close on Escape key for accessibility
function handleKeydown(e: KeyboardEvent) {
  if (e.key === "Escape" && sidebarOpen.value) {
    sidebarOpen.value = false;
  }
}

onMounted(() => window.addEventListener("keydown", handleKeydown));
onUnmounted(() => window.removeEventListener("keydown", handleKeydown));
</script>
