<template>
  <div dir="rtl" class="min-h-screen bg-slate-50/50 p-4 lg:p-8">
    <div class="max-w-[1600px] mx-auto space-y-8">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="space-y-1">
          <h1 class="text-3xl font-black text-slate-900 tracking-tight">التقرير اليومي</h1>
          <p class="text-slate-500 font-medium">ملخص حركة اليوم المالي</p>
        </div>
        <input
          type="date"
          v-model="selectedDate"
          class="h-12 px-4 rounded-2xl bg-white ring-1 ring-slate-100 font-bold text-sm"
          @change="load"
        />
      </div>

      <div v-if="loading" class="text-center py-16 text-slate-400 font-bold">جاري التحميل...</div>

      <template v-else-if="report">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MStatsCard label="إجمالي الإيرادات" :value="formatCurrency(report.total_income)" variant="emerald" />
          <MStatsCard label="إجمالي المصروفات" :value="formatCurrency(report.total_expense)" variant="rose" />
          <MStatsCard label="صافي اليوم" :value="formatCurrency(report.net)" variant="blue" />
          <MStatsCard label="إجمالي الرصيد" :value="formatCurrency(report.total_balance)" variant="indigo" />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MCard
            v-for="row in report.vaults"
            :key="row.vault.id"
            :title="row.vault.name"
            class="!rounded-[2rem]"
          >
            <div class="space-y-3 text-sm">
              <div class="flex justify-between"><span class="text-slate-500">إيرادات اليوم</span><span class="font-black text-emerald-600">{{ formatCurrency(row.income) }}</span></div>
              <div class="flex justify-between"><span class="text-slate-500">مصروفات اليوم</span><span class="font-black text-rose-600">{{ formatCurrency(row.expense) }}</span></div>
              <div class="flex justify-between"><span class="text-slate-500">تحويلات واردة</span><span class="font-black">{{ formatCurrency(row.transfer_in) }}</span></div>
              <div class="flex justify-between"><span class="text-slate-500">تحويلات صادرة</span><span class="font-black">{{ formatCurrency(row.transfer_out) }}</span></div>
              <div class="flex justify-between border-t border-slate-100 pt-3"><span class="text-slate-700 font-bold">صافي الحركة</span><span class="font-black">{{ formatCurrency(row.net_movement) }}</span></div>
              <div class="flex justify-between"><span class="text-slate-700 font-bold">الرصيد الحالي</span><span class="text-xl font-black text-slate-900">{{ formatCurrency(row.closing_balance) }}</span></div>
            </div>
          </MCard>
        </div>

        <MCard title="حركات اليوم" class="min-h-[300px]">
          <MTable :empty="!report.transactions.length">
            <template #header>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الوقت</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">النوع</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الخزنة</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المبلغ</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الوصف</th>
            </template>
            <tr v-for="tx in report.transactions" :key="tx.id" class="hover:bg-slate-50/80">
              <td class="px-6 py-4 text-sm">{{ formatTime(tx.created_at) }}</td>
              <td class="px-6 py-4 text-sm font-bold">{{ typeLabel(tx.type) }}</td>
              <td class="px-6 py-4 text-sm">{{ tx.vault?.name }}</td>
              <td class="px-6 py-4 text-sm font-black">{{ formatCurrency(tx.amount) }}</td>
              <td class="px-6 py-4 text-sm text-slate-500">{{ tx.description || '-' }}</td>
            </tr>
          </MTable>
        </MCard>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { fetchDailyReport, type DailyReport } from '../../api/accounting'
import { formatCurrency, formatTime } from '../../utils/helpers'
import MStatsCard from '../../components/ui/MStatsCard.vue'
import MCard from '../../components/ui/MCard.vue'
import MTable from '../../components/ui/MTable.vue'

const selectedDate = ref(new Date().toISOString().split('T')[0] as string)
const report = ref<DailyReport | null>(null)
const loading = ref(false)

const typeLabel = (type: string) => ({ income: 'إيراد', expense: 'مصروف', transfer: 'تحويل' }[type] || type)

const load = async () => {
  loading.value = true
  try {
    report.value = await fetchDailyReport(selectedDate.value)
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>
