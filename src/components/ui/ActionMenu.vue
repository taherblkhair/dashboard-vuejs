<template>
  <div class="relative inline-block text-left" ref="menuRef">
    <button @click="isOpen = !isOpen" type="button" class="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none">
      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
      </svg>
    </button>

    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div v-if="isOpen" class="origin-top-left absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
        <div class="py-1">
          <template v-for="(item, index) in items" :key="index">
            <component
              :is="item.to ? 'router-link' : 'button'"
              :to="item.to"
              @click="handleAction(item)"
              :class="[
                'group flex items-center w-full px-4 py-2 text-sm',
                item.variant === 'danger' ? 'text-red-600 hover:bg-red-50' : 'text-gray-700 hover:bg-gray-100'
              ]"
            >
              <component v-if="item.icon" :is="item.icon" :class="['w-4 h-4 ml-3 opacity-70 group-hover:opacity-100', item.variant === 'danger' ? 'text-red-500' : 'text-gray-500']" />
               {{ item.label }}
            </component>
          </template>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  items: Array<{
    label: string
    icon?: any
    to?: any
    action?: () => void
    variant?: 'default' | 'danger'
  }>
}>()

const isOpen = ref(false)
const menuRef = ref<HTMLElement | null>(null)

const handleAction = (item: any) => {
  if (item.action) item.action()
  isOpen.value = false
}

const handleClickOutside = (event: MouseEvent) => {
  if (menuRef.value && !menuRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
