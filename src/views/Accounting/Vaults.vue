<template>
  <div dir="rtl" class="min-h-screen bg-slate-50/50 p-4 lg:p-8">
    <div class="max-w-[1600px] mx-auto space-y-8">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="space-y-1">
          <h1 class="text-3xl font-black text-slate-900 tracking-tight">الخزائن</h1>
          <p class="text-slate-500 font-medium">متابعة أرصدة الكاش والبنك بشكل مباشر</p>
        </div>
        <MButton variant="primary" class="!rounded-2xl" @click="router.push({ name: 'AccountingTransactions' })">
          عرض الحركات المالية
        </MButton>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MStatsCard label="إجمالي الرصيد" :value="formatCurrency(totalBalance)" variant="indigo">
          <template #icon>
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V6m0 12v-2m9-4a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </template>
        </MStatsCard>
      </div>

      <div v-if="loading" class="text-center py-16 text-slate-400 font-bold">جاري التحميل...</div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MCard
          v-for="vault in vaults"
          :key="vault.id"
          class="!rounded-[2rem] overflow-hidden"
        >
          <div class="flex items-start justify-between">
            <div class="space-y-3">
              <div
                class="w-14 h-14 rounded-2xl flex items-center justify-center"
                :class="vault.type === 'cash' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'"
              >
                <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-black text-slate-900">{{ vault.name }}</h3>
                <MBadge :variant="vault.type === 'cash' ? 'warning' : 'success'" class="!mt-2">
                  {{ vault.type === 'cash' ? 'كاش' : 'بنك' }}
                </MBadge>
              </div>
            </div>
            <div class="text-left">
              <p class="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">الرصيد الحالي</p>
              <p class="text-3xl font-black text-slate-900">{{ formatCurrency(vault.balance) }}</p>
            </div>
          </div>
        </MCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { fetchVaults, type Vault } from '../../api/accounting'
import { formatCurrency } from '../../utils/helpers'
import MStatsCard from '../../components/ui/MStatsCard.vue'
import MCard from '../../components/ui/MCard.vue'
import MButton from '../../components/ui/MButton.vue'
import MBadge from '../../components/ui/MBadge.vue'

const router = useRouter()
const vaults = ref<Vault[]>([])
const totalBalance = ref(0)
const loading = ref(false)

const load = async () => {
  loading.value = true
  try {
    const data = await fetchVaults()
    vaults.value = data.vaults
    totalBalance.value = data.total_balance
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>
