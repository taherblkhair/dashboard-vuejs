<template>
  <div dir="rtl" class="min-h-screen bg-slate-50/50 p-4 lg:p-8">
    <div class="max-w-[1600px] mx-auto space-y-8">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="space-y-1">
          <h1 class="text-3xl font-black text-slate-900 tracking-tight">الحركات المالية</h1>
          <p class="text-slate-500 font-medium">سجل الإيرادات والمصروفات والتحويلات</p>
        </div>
        <MButton variant="primary" class="!rounded-2xl" @click="showModal = true">
          إضافة حركة
        </MButton>
      </div>

      <MCard title="تصفية الحركات">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select v-model="filters.type" class="h-12 px-4 rounded-2xl bg-slate-50 ring-1 ring-slate-100 font-bold text-sm">
            <option value="">كل الأنواع</option>
            <option value="income">إيراد</option>
            <option value="expense">مصروف</option>
            <option value="transfer">تحويل</option>
            <option value="receivable">مدين (آجل)</option>
            <option value="payable">دائن (مورد)</option>
          </select>
          <select v-model="filters.vault_id" class="h-12 px-4 rounded-2xl bg-slate-50 ring-1 ring-slate-100 font-bold text-sm">
            <option value="">كل الخزائن</option>
            <option v-for="v in vaults" :key="v.id" :value="String(v.id)">{{ v.name }}</option>
          </select>
          <input type="date" v-model="filters.date_from" class="h-12 px-4 rounded-2xl bg-slate-50 ring-1 ring-slate-100 font-bold text-sm" />
          <input type="date" v-model="filters.date_to" class="h-12 px-4 rounded-2xl bg-slate-50 ring-1 ring-slate-100 font-bold text-sm" />
        </div>
      </MCard>

      <MCard title="قائمة الحركات" class="min-h-[400px]">
        <MTable :loading="loading" :empty="transactions.length === 0">
          <template #header>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">التاريخ</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">النوع</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الخزنة</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المبلغ</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الوصف</th>
          </template>
          <tr v-for="tx in transactions" :key="tx.id" class="hover:bg-slate-50/80">
            <td class="px-6 py-4 text-sm font-medium">{{ formatDateTime(tx.created_at) }}</td>
            <td class="px-6 py-4">
              <MBadge :variant="typeVariant(tx.type)">{{ typeLabel(tx.type) }}</MBadge>
            </td>
            <td class="px-6 py-4 text-sm">
              {{ tx.vault?.name || '-' }}
              <span v-if="tx.type === 'transfer' && tx.target_vault" class="text-slate-400"> ← {{ tx.target_vault.name }}</span>
            </td>
            <td class="px-6 py-4 text-sm font-black" :class="tx.type === 'expense' ? 'text-rose-600' : 'text-emerald-600'">
              {{ formatCurrency(tx.amount) }}
            </td>
            <td class="px-6 py-4 text-sm text-slate-500">{{ tx.description || '-' }}</td>
          </tr>
        </MTable>
      </MCard>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="showModal = false"></div>
      <MCard class="relative w-full max-w-lg !rounded-[2rem] z-10">
        <h3 class="text-xl font-black text-slate-900 mb-6">إضافة حركة مالية</h3>
        <form @submit.prevent="submit" class="space-y-4">
          <select v-model="form.type" class="w-full h-12 px-4 rounded-2xl bg-slate-50 ring-1 ring-slate-100 font-bold text-sm" required>
            <option value="income">إيراد</option>
            <option value="expense">مصروف</option>
            <option value="transfer">تحويل بين الخزائن</option>
          </select>
          <select v-model="form.vault_id" class="w-full h-12 px-4 rounded-2xl bg-slate-50 ring-1 ring-slate-100 font-bold text-sm" required>
            <option value="">اختر الخزنة</option>
            <option v-for="v in vaults" :key="v.id" :value="v.id">{{ v.name }}</option>
          </select>
          <select
            v-if="form.type === 'transfer'"
            v-model="form.target_vault_id"
            class="w-full h-12 px-4 rounded-2xl bg-slate-50 ring-1 ring-slate-100 font-bold text-sm"
            required
          >
            <option value="">الخزنة المستهدفة</option>
            <option v-for="v in vaults.filter(x => x.id !== form.vault_id)" :key="v.id" :value="v.id">{{ v.name }}</option>
          </select>
          <MInput v-model="form.amount" type="number" step="0.01" label="المبلغ" placeholder="0.00" required />
          <MInput v-model="form.description" label="الوصف" placeholder="وصف الحركة..." />
          <div class="flex gap-3 pt-2">
            <MButton type="submit" variant="primary" class="flex-1 !rounded-2xl" :disabled="saving">حفظ</MButton>
            <MButton type="button" variant="secondary" class="flex-1 !rounded-2xl" @click="showModal = false">إلغاء</MButton>
          </div>
        </form>
      </MCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { fetchVaults, fetchTransactions, createTransaction, type Vault, type VaultTransaction } from '../../api/accounting'
import { formatCurrency, formatDateTime } from '../../utils/helpers'
import { useToast } from '../../composables/useToast'
import MCard from '../../components/ui/MCard.vue'
import MButton from '../../components/ui/MButton.vue'
import MInput from '../../components/ui/MInput.vue'
import MTable from '../../components/ui/MTable.vue'
import MBadge from '../../components/ui/MBadge.vue'

const { addToast } = useToast()

const vaults = ref<Vault[]>([])
const transactions = ref<VaultTransaction[]>([])
const loading = ref(false)
const saving = ref(false)
const showModal = ref(false)

const filters = reactive({
  type: '',
  vault_id: '',
  date_from: '',
  date_to: '',
})

const form = reactive({
  type: 'income' as 'income' | 'expense' | 'transfer',
  vault_id: '' as number | '',
  target_vault_id: '' as number | '',
  amount: '',
  description: '',
})

const typeLabel = (type: string) => ({
  income: 'إيراد',
  expense: 'مصروف',
  transfer: 'تحويل',
  receivable: 'مدين (آجل)',
  payable: 'دائن (مورد)',
}[type] || type)
const typeVariant = (type: string): 'success' | 'danger' | 'info' | 'neutral' => {
  const map: Record<string, 'success' | 'danger' | 'info' | 'neutral'> = {
    income: 'success',
    expense: 'danger',
    transfer: 'info',
  }
  return map[type] || 'neutral'
}

const loadVaults = async () => {
  const data = await fetchVaults()
  vaults.value = data.vaults
}

const loadTransactions = async () => {
  loading.value = true
  try {
    const res = await fetchTransactions({
      type: filters.type || undefined,
      vault_id: filters.vault_id ? Number(filters.vault_id) : undefined,
      date_from: filters.date_from || undefined,
      date_to: filters.date_to || undefined,
    })
    transactions.value = res.data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const submit = async () => {
  saving.value = true
  try {
    await createTransaction({
      type: form.type,
      amount: Number(form.amount),
      vault_id: Number(form.vault_id),
      target_vault_id: form.type === 'transfer' ? Number(form.target_vault_id) : undefined,
      description: form.description || undefined,
    })
    addToast('تم تسجيل الحركة بنجاح', 'success')
    showModal.value = false
    form.amount = ''
    form.description = ''
    await loadTransactions()
    await loadVaults()
  } catch (e: any) {
    addToast(e.message || 'فشل تسجيل الحركة', 'error')
  } finally {
    saving.value = false
  }
}

watch(filters, loadTransactions, { deep: true })

onMounted(async () => {
  await loadVaults()
  await loadTransactions()
})
</script>
