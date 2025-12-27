<template>
  <div class="relative inline-block text-left" ref="menuContainer">
    <button ref="triggerButton" @click="toggleMenu" type="button" class="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none">
      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
      </svg>
    </button>

    <Teleport to="body">
      <transition
        enter-active-class="transition ease-out duration-100"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
      >
        <div 
          v-if="isOpen" 
          ref="dropdownMenu"
          :style="menuStyles"
          class="fixed z-[9999] w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
        >
          <div class="py-1">
            <template v-for="item in items" :key="item.label">
              <component
                :is="item.to ? 'router-link' : 'button'"
                :to="item.to"
                @click="handleAction(item)"
                :class="[
                  'group flex items-center w-full px-4 py-2 text-sm text-right',
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
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  items: Array<{
    label: string
    icon?: any
    to?: any
    action?: () => void
    variant?: 'default' | 'danger'
    disabled?: boolean
    textClass?: string
  }>
}>()

const isOpen = ref(false)
const triggerButton = ref<HTMLElement | null>(null)
const dropdownMenu = ref<HTMLElement | null>(null)
const position = ref({ top: 0, left: 0 })

const menuStyles = computed(() => ({
  top: `${position.value.top}px`,
  left: `${position.value.left}px`,
}))

const updatePosition = () => {
  if (!triggerButton.value || !isOpen.value) return
  
  const rect = triggerButton.value.getBoundingClientRect()
  const menuWidth = 192 // w-48 = 12rem = 192px approx, or we can measure if mounted
  
  // Basic positioning: below the button, aligned to the left (or right if RTL context needs it)
  // Since we are in RTL usually, let's try to align the right edge of menu with right edge of button if possible,
  // or just left for now. The previous implementation was `left-0` (align left).
  // Let's stick to aligning left edge for consistency with previous behavior, or adjust.
  // Actually, usually dropdowns align to the start edge. In RTL, "left-0" means absolute left.
  
  // Let's center it or align it securely. 
  // Let's place it aligned to the left of the button for now.
  let left = rect.left
  let top = rect.bottom + 5

  // Boundary check (viewport right)
  if (left + menuWidth > window.innerWidth) {
    left = rect.right - menuWidth // Flip to align right edges
  }

  // Boundary check (viewport bottom) - not strictly implemented but Teleport helps z-index.
  // If we really want to flip up:
  if (top + 200 > window.innerHeight) { // assuming menu height approx 200px
      top = rect.top - 5 - (dropdownMenu.value?.offsetHeight || 0) 
      // Note: offsetHeight might not be available immediately if not rendered.
      // For now, simpler bottom positioning is usually enough unless typically at bottom of screen.
      // Given the user issue "last row", flipping UP is probably desired.
       const estimatedHeight = props.items.length * 40 + 20 
       if (rect.bottom + estimatedHeight > window.innerHeight) {
         top = rect.top - 5 - estimatedHeight // Approximate flip
       }
  }

  position.value = { top, left }
}

const toggleMenu = async () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    await nextTick()
    updatePosition()
  }
}

const handleAction = (item: any) => {
  if (item.action) item.action()
  isOpen.value = false
}

const handleClickOutside = (event: MouseEvent) => {
  // Check if click is inside trigger or menu
  const target = event.target as Node
  const isTrigger = triggerButton.value?.contains(target)
  const isMenu = dropdownMenu.value?.contains(target)

  if (!isTrigger && !isMenu) {
    isOpen.value = false
  }
}

const handleScroll = () => {
  if (isOpen.value) updatePosition()
}

const handleResize = () => {
  if (isOpen.value) isOpen.value = false // Close on resize to avoid complex logic
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('scroll', handleScroll, true) // Capture scroll to handle internal scrolling
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('scroll', handleScroll, true)
  window.removeEventListener('resize', handleResize)
})
</script>
