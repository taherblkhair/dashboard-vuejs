<template>
  <div dir="rtl" class="min-h-screen bg-slate-50/50 p-4 lg:p-8">
    <div class="max-w-[1600px] mx-auto space-y-8">
      <div class="space-y-1">
        <h1 class="text-3xl font-black text-slate-900 tracking-tight">مديونيات العملاء</h1>
        <p class="text-slate-500 font-medium">متابعة البيع بالآجل وتحصيل المستحقات</p>
      </div>

      <MStatsCard label="إجمالي المديونيات المفتوحة" :value="formatCurrency(totalOutstanding)" variant="amber" />

      <MCard title="قائمة المديونيات" class="min-h-[400px]">
        <MTable :loading="loading" :empty="debts.length === 0">
          <template #header>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">العميل</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الطلب</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الأصلي</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المتبقي</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الحالة</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">إجراء</th>
          </template>
          <tr v-for="debt in debts" :key="debt.id" class="hover:bg-slate-50/80">
            <td class="px-6 py-4 text-sm font-bold">{{ debt.customer?.name || '-' }}</td>
            <td class="px-6 py-4 text-sm">{{ debt.order?.code || debt.order_id }}</td>
            <td class="px-6 py-4 text-sm">{{ formatCurrency(debt.original_amount) }}</td>
            <td class="px-6 py-4 text-sm font-black text-rose-600">{{ formatCurrency(debt.remaining_amount) }}</td>
            <td class="px-6 py-4"><MBadge :variant="debt.status === 'paid' ? 'success' : 'warning'">{{ statusLabel(debt.status) }}</MBadge></td>
            <td class="px-6 py-4">
              <MButton v-if="debt.remaining_amount > 0" size="sm" variant="primary" class="!rounded-xl" @click="openCollect(debt)">تحصيل</MButton>
            </td>
          </tr>
        </MTable>
      </MCard>
    </div>

    <div v-if="collecting" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="collecting = null"></div>
      <MCard class="relative w-full max-w-md !rounded-[2rem] z-10">
        <h3 class="text-xl font-black mb-4">تحصيل مديونية</h3>
        <p class="text-sm text-slate-500 mb-4">المتبقي: {{ formatCurrency(collecting.remaining_amount) }}</p>
        <form @submit.prevent="submitCollect" class="space-y-4">
          <MInput v-model="collectForm.amount" type="number" step="0.01" label="المبلغ" required />
          <select v-model="collectForm.payment_method" class="w-full h-12 px-4 rounded-2xl bg-slate-50 ring-1 ring-slate-100 font-bold text-sm" required>
            <option value="cash">كاش</option>
            <option value="card">بطاقة</option>
            <option value="bank_transfer">تحويل بنكي</option>
            <option value="digital_wallet">محفظة</option>
          </select>
          <div class="flex gap-3">
            <MButton type="submit" variant="primary" class="flex-1 !rounded-2xl" :disabled="saving">تأكيد</MButton>
            <MButton type="button" variant="secondary" class="flex-1 !rounded-2xl" @click="collecting = null">إلغاء</MButton>
          </div>
        </form>
      </MCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { fetchCustomerDebts, collectCustomerDebt, type CustomerDebt } from '../../api/accounting'
import { formatCurrency } from '../../utils/helpers'
import { useToast } from '../../composables/useToast'
import MStatsCard from '../../components/ui/MStatsCard.vue'
import MCard from '../../components/ui/MCard.vue'
import MTable from '../../components/ui/MTable.vue'
import MButton from '../../components/ui/MButton.vue'
import MInput from '../../components/ui/MInput.vue'
import MBadge from '../../components/ui/MBadge.vue'

const { addToast } = useToast()
const debts = ref<CustomerDebt[]>([])
const totalOutstanding = ref(0)
const loading = ref(false)
const saving = ref(false)
const collecting = ref<CustomerDebt | null>(null)
const collectForm = reactive({ amount: '', payment_method: 'cash' })

const statusLabel = (s: string) => ({ open: 'مفتوحة', partial: 'جزئية', paid: 'مسددة' }[s] || s)

const load = async () => {
  loading.value = true
  try {
    const res = await fetchCustomerDebts({ open_only: true })
    debts.value = res.data
    totalOutstanding.value = res.summary?.total_outstanding || 0
  } finally {
    loading.value = false
  }
}

const openCollect = (debt: CustomerDebt) => {
  collecting.value = debt
  collectForm.amount = String(debt.remaining_amount)
  collectForm.payment_method = 'cash'
}

const submitCollect = async () => {
  if (!collecting.value) return
  saving.value = true
  try {
    await collectCustomerDebt(collecting.value.id, {
      amount: Number(collectForm.amount),
      payment_method: collectForm.payment_method,
    })
    addToast('تم التحصيل بنجاح', 'success')
    collecting.value = null
    await load()
  } catch (e: any) {
    addToast(e.message || 'فشل التحصيل', 'error')
  } finally {
    saving.value = false
  }
}

onMounted(load)
</script>
