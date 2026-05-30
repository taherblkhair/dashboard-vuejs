<template>
  <MCard title="الحساب المالي للعميل" class="col-span-full">
    <div v-if="loading" class="text-center py-8 text-slate-500">جاري التحميل...</div>
    <div v-else class="space-y-6">
      <!-- Balance summary -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="p-4 rounded-2xl bg-rose-50 border border-rose-100">
          <p class="text-xs font-bold text-rose-500 uppercase">عليه (مديونيات)</p>
          <p class="text-2xl font-black text-rose-700 mt-1">{{ formatCurrency(summary?.total_owed || 0) }}</p>
        </div>
        <div class="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
          <p class="text-xs font-bold text-emerald-500 uppercase">له عندنا (رصيد دائن)</p>
          <p class="text-2xl font-black text-emerald-700 mt-1">{{ formatCurrency(summary?.credit_balance || 0) }}</p>
        </div>
        <div class="p-4 rounded-2xl bg-indigo-50 border border-indigo-100">
          <p class="text-xs font-bold text-indigo-500 uppercase">الصافي — {{ summary?.balance_label || '—' }}</p>
          <p class="text-2xl font-black text-indigo-700 mt-1">{{ formatCurrency(Math.abs(summary?.net_balance || 0)) }}</p>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex flex-wrap gap-3">
        <MButton variant="primary" class="!rounded-xl" @click="openReceiptModal()">+ سند قبض</MButton>
        <MButton variant="secondary" class="!rounded-xl" @click="openPaymentModal()" :disabled="!(summary && summary.credit_balance > 0)">+ سند صرف</MButton>
        <MButton variant="ghost" class="!rounded-xl" @click="load">تحديث</MButton>
      </div>

      <!-- Open debts -->
      <div v-if="debts.length" class="space-y-2">
        <h4 class="text-sm font-black text-slate-700">مديونيات مفتوحة</h4>
        <div class="overflow-x-auto rounded-xl border border-slate-100">
          <table class="w-full text-sm">
            <thead class="bg-slate-50 text-slate-500">
              <tr>
                <th class="px-4 py-2 text-right">الطلب</th>
                <th class="px-4 py-2 text-right">الأصلي</th>
                <th class="px-4 py-2 text-right">المتبقي</th>
                <th class="px-4 py-2 text-right">إجراء</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="debt in debts" :key="debt.id" class="border-t border-slate-100">
                <td class="px-4 py-2 font-bold">{{ debt.order_code || debt.order_id }}</td>
                <td class="px-4 py-2">{{ formatCurrency(debt.original_amount) }}</td>
                <td class="px-4 py-2 text-rose-600 font-bold">{{ formatCurrency(debt.remaining_amount) }}</td>
                <td class="px-4 py-2">
                  <MButton size="sm" variant="primary" @click="openReceiptModal(debt)">تحصيل</MButton>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Statement -->
      <div class="space-y-2">
        <h4 class="text-sm font-black text-slate-700">كشف الحساب</h4>
        <div class="overflow-x-auto rounded-xl border border-slate-100 max-h-80">
          <table class="w-full text-sm">
            <thead class="bg-slate-50 text-slate-500 sticky top-0">
              <tr>
                <th class="px-3 py-2 text-right">التاريخ</th>
                <th class="px-3 py-2 text-right">البيان</th>
                <th class="px-3 py-2 text-right">مدين</th>
                <th class="px-3 py-2 text-right">دائن</th>
                <th class="px-3 py-2 text-right">الرصيد</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(entry, idx) in statement" :key="idx" class="border-t border-slate-50 hover:bg-slate-50/50">
                <td class="px-3 py-2 text-slate-500 whitespace-nowrap">{{ formatDate(entry.date) }}</td>
                <td class="px-3 py-2">
                  <div class="font-medium">{{ entry.description }}</div>
                  <div class="text-xs text-slate-400">{{ entry.type_label }}</div>
                </td>
                <td class="px-3 py-2 text-rose-600">{{ entry.debit > 0 ? formatCurrency(entry.debit) : '—' }}</td>
                <td class="px-3 py-2 text-emerald-600">{{ entry.credit > 0 ? formatCurrency(entry.credit) : '—' }}</td>
                <td class="px-3 py-2 font-bold">{{ formatCurrency(entry.balance) }}</td>
              </tr>
              <tr v-if="!statement.length">
                <td colspan="5" class="px-4 py-6 text-center text-slate-400">لا توجد حركات</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Receipt modal -->
    <div v-if="receiptModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/40" @click="receiptModal = false"></div>
      <MCard class="relative w-full max-w-md z-10 !rounded-2xl">
        <h3 class="text-lg font-black mb-4">سند قبض</h3>
        <form @submit.prevent="submitReceipt" class="space-y-4">
          <MInput v-model="receiptForm.amount" type="number" step="0.01" label="المبلغ" required />
          <select v-model="receiptForm.payment_method" class="w-full h-11 px-3 rounded-xl bg-slate-50 ring-1 ring-slate-100 text-sm font-bold" required>
            <option value="cash">كاش</option>
            <option value="card">بطاقة</option>
            <option value="bank_transfer">تحويل بنكي</option>
            <option value="digital_wallet">محفظة</option>
          </select>
          <MInput v-model="receiptForm.notes" label="ملاحظات (اختياري)" />
          <div class="flex gap-3">
            <MButton type="submit" variant="primary" class="flex-1" :loading="saving">إصدار السند</MButton>
            <MButton type="button" variant="secondary" class="flex-1" @click="receiptModal = false">إلغاء</MButton>
          </div>
        </form>
      </MCard>
    </div>

    <!-- Payment modal -->
    <div v-if="paymentModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/40" @click="paymentModal = false"></div>
      <MCard class="relative w-full max-w-md z-10 !rounded-2xl">
        <h3 class="text-lg font-black mb-4">سند صرف للعميل</h3>
        <p class="text-sm text-slate-500 mb-4">الرصيد الدائن المتاح: {{ formatCurrency(summary?.credit_balance || 0) }}</p>
        <form @submit.prevent="submitPayment" class="space-y-4">
          <MInput v-model="paymentForm.amount" type="number" step="0.01" label="المبلغ" required />
          <select v-model="paymentForm.payment_method" class="w-full h-11 px-3 rounded-xl bg-slate-50 ring-1 ring-slate-100 text-sm font-bold" required>
            <option value="cash">كاش</option>
            <option value="card">بطاقة</option>
            <option value="bank_transfer">تحويل بنكي</option>
            <option value="digital_wallet">محفظة</option>
          </select>
          <MInput v-model="paymentForm.notes" label="ملاحظات (اختياري)" />
          <div class="flex gap-3">
            <MButton type="submit" variant="primary" class="flex-1" :loading="saving">إصدار السند</MButton>
            <MButton type="button" variant="secondary" class="flex-1" @click="paymentModal = false">إلغاء</MButton>
          </div>
        </form>
      </MCard>
    </div>
  </MCard>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import {
  fetchCustomerAccountSummary,
  fetchCustomerStatement,
  fetchCustomerOpenDebts,
  issueCustomerReceipt,
  issueCustomerPayment,
  type CustomerAccountSummary,
  type CustomerStatementEntry,
} from '../api/accounting'
import { formatCurrency, formatDate } from '../utils/helpers'
import { useToast } from '../composables/useToast'
import MCard from './ui/MCard.vue'
import MButton from './ui/MButton.vue'
import MInput from './ui/MInput.vue'

const props = defineProps<{ customerId: number }>()
const { addToast } = useToast()

const loading = ref(false)
const saving = ref(false)
const summary = ref<CustomerAccountSummary | null>(null)
const statement = ref<CustomerStatementEntry[]>([])
const debts = ref<any[]>([])
const receiptModal = ref(false)
const paymentModal = ref(false)
const receiptForm = reactive({ amount: '', payment_method: 'cash', notes: '', customer_debt_id: null as number | null })
const paymentForm = reactive({ amount: '', payment_method: 'cash', notes: '' })

const load = async () => {
  if (!props.customerId) return
  loading.value = true
  try {
    const [sum, stmtRes, openDebts] = await Promise.all([
      fetchCustomerAccountSummary(props.customerId),
      fetchCustomerStatement(props.customerId),
      fetchCustomerOpenDebts(props.customerId),
    ])
    summary.value = sum
    statement.value = stmtRes?.data?.entries || []
    debts.value = openDebts || []
  } catch {
    addToast('فشل تحميل الحساب المالي', 'error')
  } finally {
    loading.value = false
  }
}

const openReceiptModal = (debt?: any) => {
  receiptForm.amount = debt ? String(debt.remaining_amount) : ''
  receiptForm.customer_debt_id = debt?.id || null
  receiptForm.payment_method = 'cash'
  receiptForm.notes = ''
  receiptModal.value = true
}

const openPaymentModal = () => {
  paymentForm.amount = String(summary.value?.credit_balance || '')
  paymentForm.payment_method = 'cash'
  paymentForm.notes = ''
  paymentModal.value = true
}

const submitReceipt = async () => {
  saving.value = true
  try {
    const payload: Record<string, unknown> = {
      amount: Number(receiptForm.amount),
      payment_method: receiptForm.payment_method,
      notes: receiptForm.notes || undefined,
    }
    if (receiptForm.customer_debt_id) payload.customer_debt_id = receiptForm.customer_debt_id

    const res = await issueCustomerReceipt(props.customerId, payload)
    addToast(`تم إصدار سند قبض ${res?.data?.code || ''}`, 'success')
    receiptModal.value = false
    await load()
  } catch (e: any) {
    addToast(e.message || 'فشل إصدار سند القبض', 'error')
  } finally {
    saving.value = false
  }
}

const submitPayment = async () => {
  saving.value = true
  try {
    const res = await issueCustomerPayment(props.customerId, {
      amount: Number(paymentForm.amount),
      payment_method: paymentForm.payment_method,
      notes: paymentForm.notes || undefined,
      use_credit: true,
    })
    addToast(`تم إصدار سند صرف ${res?.data?.code || ''}`, 'success')
    paymentModal.value = false
    await load()
  } catch (e: any) {
    addToast(e.message || 'فشل إصدار سند الصرف', 'error')
  } finally {
    saving.value = false
  }
}

watch(() => props.customerId, load)
onMounted(load)
</script>
