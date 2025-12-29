<template>
  <MCard class="!p-6 !rounded-[2rem] border-none shadow-sm bg-white overflow-hidden relative group">
    <!-- Decorative Circle -->
    <div 
      class="absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110 duration-500"
      :class="variantClasses.bgCircle"
    ></div>
    
    <div class="relative flex items-center gap-5">
      <!-- Icon Container -->
      <div 
        class="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110 duration-500"
        :class="[variantClasses.iconBg, variantClasses.iconShadow]"
      >
        <slot name="icon">
          <!-- Fallback Icon if needed -->
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </slot>
      </div>
      
      <!-- Content -->
      <div class="flex flex-col">
        <p class="text-[10px] md:text-sm font-bold text-slate-400 uppercase tracking-widest mb-1 leading-none">{{ label }}</p>
        <h3 class="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-none">{{ value }}</h3>
      </div>
    </div>
  </MCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MCard from './MCard.vue'

const props = withDefaults(defineProps<{
  label: string
  value: string | number
  variant?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'blue' | 'slate' | 'violet'
}>(), {
  variant: 'indigo'
})

const variantClasses = computed(() => {
  const maps = {
    indigo: {
      bgCircle: 'bg-indigo-50',
      iconBg: 'bg-indigo-600',
      iconShadow: 'shadow-indigo-100'
    },
    emerald: {
      bgCircle: 'bg-emerald-50',
      iconBg: 'bg-emerald-500',
      iconShadow: 'shadow-emerald-100'
    },
    amber: {
      bgCircle: 'bg-amber-50',
      iconBg: 'bg-amber-500',
      iconShadow: 'shadow-amber-100'
    },
    rose: {
      bgCircle: 'bg-rose-50',
      iconBg: 'bg-rose-500',
      iconShadow: 'shadow-rose-100'
    },
    blue: {
      bgCircle: 'bg-blue-50',
      iconBg: 'bg-blue-500',
      iconShadow: 'shadow-blue-100'
    },
    slate: {
      bgCircle: 'bg-slate-50',
      iconBg: 'bg-slate-500',
      iconShadow: 'shadow-slate-100'
    },
    violet: {
        bgCircle: 'bg-violet-50',
        iconBg: 'bg-violet-600',
        iconShadow: 'shadow-violet-100'
    }
  }
  return maps[props.variant] || maps.indigo
})
</script>

<style scoped>
/* Scoped styles if needed */
</style>
