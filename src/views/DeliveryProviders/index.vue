<template>
  <div dir="rtl" class="min-h-screen bg-slate-50/50 p-4 lg:p-8">
    <div class="max-w-[1600px] mx-auto space-y-8">
      <!-- Header Section -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="space-y-1">
          <h1 class="text-3xl font-black text-slate-900 tracking-tight">مزودو خدمة التوصيل</h1>
          <p class="text-slate-500 font-medium">إدارة ومتابعة شركات وفنيي التوصيل المتعاقد معهم.</p>
        </div>

        <div class="flex items-center gap-4">
          <MButton
            variant="primary"
            class="!rounded-2xl shadow-lg shadow-indigo-200"
            @click="createDeliveryProvider"
          >
            <template #icon>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
            </template>
            إضافة مزود جديد
          </MButton>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MStatsCard
          label="إجمالي المزودين"
          :value="totalProviders"
          variant="indigo"
        >
          <template #icon>
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </template>
        </MStatsCard>

        <MStatsCard
          label="الشركات النشطة"
          :value="activeCompanies"
          variant="emerald"
        >
          <template #icon>
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </template>
        </MStatsCard>

        <MStatsCard
          label="الأفراد النشطون"
          :value="activeIndividuals"
          variant="amber"
        >
          <template #icon>
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </template>
        </MStatsCard>
      </div>

      <!-- Providers Grid -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        <div v-for="i in 3" :key="i" class="h-64 bg-slate-100 rounded-3xl"></div>
      </div>
      <div v-else-if="providers.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MCard v-for="p in providers" :key="p.id" class="!p-0 overflow-hidden group hover:scale-[1.02] transition-all duration-300">
          <div class="p-6 space-y-4">
            <div class="flex items-start justify-between">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                  {{ p.name.charAt(0) }}
                </div>
                <div>
                  <h3 class="font-black text-slate-900 leading-tight">{{ p.name }}</h3>
                  <div class="flex items-center gap-2 mt-1">
                    <MBadge :variant="p.type === 'company' ? 'info' : 'neutral'">
                      {{ p.type === 'company' ? 'شركة' : 'فرد' }}
                    </MBadge>
                    <div :class="[
                      'w-1.5 h-1.5 rounded-full',
                      p.is_active ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-300'
                    ]"></div>
                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{{ p.is_active ? 'نشط' : 'غير نشط' }}</span>
                  </div>
                </div>
              </div>
              <ActionMenu :items="[
                { label: 'عرض التفاصيل', action: () => viewDetails(p.id), icon: IconEye }
              ]" />
            </div>

            <div class="grid grid-cols-2 gap-4 py-4 border-y border-slate-50">
              <div class="space-y-1">
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">عدد المناديب</p>
                <p class="text-lg font-black text-slate-900">{{ p.active_riders_count ?? 0 }}</p>
              </div>
              <div class="space-y-1">
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">إجمالي العمليات</p>
                <p class="text-lg font-black text-slate-900">{{ p.total_deliveries_count ?? 0 }}</p>
              </div>
            </div>

            <div class="space-y-2 pt-2">
              <div class="flex items-center gap-2 text-sm text-slate-600">
                 <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                 </svg>
                 <span class="font-medium">{{ p.contact_person }}</span>
              </div>
              <div class="flex items-center gap-2 text-sm text-slate-600">
                 <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                 </svg>
                 <a :href="`tel:${p.phone}`" class="font-medium text-indigo-600 hover:text-indigo-700 transition-colors">{{ p.phone }}</a>
              </div>
            </div>
          </div>
          <div class="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">المناطق</span>
            <div class="flex -space-x-2 space-x-reverse overflow-hidden">
               <span v-if="p.service_areas && p.service_areas.length" class="text-[10px] font-bold text-slate-600 italic">
                 {{ p.service_areas.slice(0, 2).join(', ') }}{{ p.service_areas.length > 2 ? '...' : '' }}
               </span>
               <span v-else class="text-[10px] font-bold text-slate-300">غير محدد</span>
            </div>
          </div>
        </MCard>
      </div>

      <div v-if="!providers.length && !loading" class="flex flex-col items-center justify-center py-20 text-slate-400">
         <svg class="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
         </svg>
         <p class="font-bold">لا يوجد مزودو توصيل مضافون حالياً</p>
      </div>

      <div class="mt-8 flex justify-center">
        <MButton v-if="meta && meta.current_page < meta.last_page" variant="secondary" @click="load(meta.current_page + 1)" :loading="loading">
           عرض المزيد من المزودين
        </MButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, defineComponent, h } from 'vue'
import { fetchDeliveryProviders } from '../../api/deliveryProviders'
import { useRouter } from 'vue-router'
import ActionMenu from '../../components/ui/ActionMenu.vue'
import MCard from '../../components/ui/MCard.vue'
import MButton from '../../components/ui/MButton.vue'
import MBadge from '../../components/ui/MBadge.vue'
import MStatsCard from '../../components/ui/MStatsCard.vue'

// Icons
const IconEye = defineComponent({ render: () => h('svg', { fill:'none', viewBox:'0 0 24 24', stroke:'currentColor', class:'w-4 h-4' }, [h('path', { 'stroke-linecap':'round', 'stroke-linejoin':'round', 'stroke-width':'2', d:'M15 12a3 3 0 11-6 0 3 3 0 016 0z' }), h('path', { 'stroke-linecap':'round', 'stroke-linejoin':'round', 'stroke-width':'2', d:'M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' })]) })


const providers = ref<any[]>([])
const meta = ref<any>(null)
const loading = ref(false)
const router = useRouter()

const totalProviders = computed(() => meta.value?.total ?? providers.value.length)
const activeCompanies = computed(() => providers.value.filter(p => p.type === 'company' && p.is_active).length)
const activeIndividuals = computed(() => providers.value.filter(p => p.type !== 'company' && p.is_active).length)

const load = async (page = 1) => {
  loading.value = true
  try {
    const res = await fetchDeliveryProviders(page)
    const d = res?.data?.data ?? res?.data ?? []
    const m = res?.data?.meta ?? res?.meta ?? null
    if (page === 1) providers.value = d
    else providers.value.push(...d)
    meta.value = m
  } catch (e) {
    console.error('Failed to load delivery providers', e)
  } finally {
    loading.value = false
  }
}

const viewDetails = (id: number) => {
  // placeholder - no details page yet
  router.push({ path: `/delivery-providers/${id}` })
}

const createDeliveryProvider = () => {
  router.push({ path: `delivery-providers/create` })
}
onMounted(() => load(1))
</script>

<style scoped>
.text-right { text-align: right }
</style>
