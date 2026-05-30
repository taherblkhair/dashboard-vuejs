<template>
  <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wider">الحالة المالية</h3>
      <button
        v-if="customerId"
        type="button"
        class="text-xs font-bold text-indigo-600 hover:text-indigo-700"
        @click="goToCustomerAccount"
      >
        حساب العميل ←
      </button>
    </div>

    <div class="space-y-3 text-sm">
      <div class="flex justify-between items-center">
        <span class="text-gray-500">شروط الدفع</span>
        <span :class="['px-2 py-0.5 rounded-full text-xs font-bold', paymentTermsClass]">{{ paymentTermsLabel }}</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-gray-500">حالة الدفع</span>
        <span :class="['px-2 py-0.5 rounded-full text-xs font-bold', paymentStatusClass]">{{ paymentStatusLabel }}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-500">إجمالي الطلب</span>
        <span class="font-bold font-mono">{{ formatCurrency(order?.total) }}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-500">المدفوع</span>
        <span class="font-bold font-mono text-emerald-600">{{ formatCurrency(paidAmount) }}</span>
      </div>
      <div class="flex justify-between border-t border-gray-100 pt-3">
        <span class="text-gray-700 font-medium">المتبقي</span>
        <span class="font-black font-mono text-lg" :class="remainingAmount > 0 ? 'text-rose-600' : 'text-emerald-600'">
          {{ formatCurrency(remainingAmount) }}
        </span>
      </div>
    </div>

    <div v-if="order?.customer_debt && order.customer_debt.remaining_amount > 0" class="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-100">
      <p class="text-xs font-bold text-amber-700 mb-1">مديونية مرتبطة بالطلب</p>
      <p class="text-sm text-amber-900">
        الأصل: {{ formatCurrency(order.customer_debt.original_amount) }}
        — المتبقي: <strong>{{ formatCurrency(order.customer_debt.remaining_amount) }}</strong>
      </p>
    </div>

    <div v-if="payments.length" class="mt-4 space-y-2">
      <p class="text-xs font-bold text-gray-500 uppercase">سجل الدفعات</p>
      <div
        v-for="p in payments"
        :key="p.id"
        class="flex justify-between items-center text-xs bg-gray-50 rounded-lg px-3 py-2"
      >
        <span class="text-gray-600">{{ formatDate(p.payment_date || p.created_at) }} · {{ paymentMethodLabel(p.payment_method) }}</span>
        <span class="font-bold font-mono">{{ formatCurrency(p.amount) }}</span>
      </div>
    </div>

    <button
      v-if="canCollect"
      type="button"
      class="mt-4 w-full flex justify-center items-center py-2.5 px-4 rounded-lg shadow-sm text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 transition-all"
      @click="openCollectModal"
    >
      تحصيل المتبقي ({{ formatCurrency(collectAmount) }})
    </button>

    <!-- Collect modal -->
    <div v-if="showCollect" class="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" @click="showCollect = false"></div>
      <div class="relative bg-white w-full max-w-md rounded-2xl shadow-xl p-6 z-10">
        <h3 class="text-lg font-black text-gray-900 mb-1">تحصيل من العميل</h3>
        <p class="text-sm text-gray-500 mb-4">الطلب {{ order?.code }} — المتبقي {{ formatCurrency(collectAmount) }}</p>
        <form @submit.prevent="submitCollect" class="space-y-4">
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1">المبلغ</label>
            <input
              v-model.number="collectForm.amount"
              type="number"
              step="0.01"
              min="0.01"
              :max="collectAmount"
              required
              class="block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono font-bold"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1">طريقة الدفع</label>
            <select v-model="collectForm.payment_method" required class="block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
              <option value="cash">كاش</option>
              <option value="card">بطاقة</option>
              <option value="bank_transfer">تحويل بنكي</option>
              <option value="digital_wallet">محفظة</option>
            </select>
          </div>
          <div class="flex gap-3 pt-2">
            <button
              type="submit"
              :disabled="collecting"
              class="flex-1 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-bold disabled:opacity-50"
            >
              {{ collecting ? 'جاري التحصيل...' : 'إصدار سند قبض' }}
            </button>
            <button type="button" class="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-medium" @click="showCollect = false">
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { issueCustomerReceipt } from '../api/accounting'
import { formatCurrency, formatDate } from '../utils/helpers'
import { useToast } from '../composables/useToast'
import { getPaymentStatusLabel } from '../constants'

const props = defineProps<{
  order: any
}>()

const emit = defineEmits<{ (e: 'collected'): void }>()

const router = useRouter()
const { addToast } = useToast()

const showCollect = ref(false)
const collecting = ref(false)
const collectForm = reactive({ amount: 0, payment_method: 'cash' })

const customerId = computed(() => props.order?.customer?.id ?? props.order?.customer_id ?? null)

const paidAmount = computed(() => {
  if (props.order?.paid_amount != null) return Number(props.order.paid_amount)
  return (props.order?.payments || [])
    .filter((p: any) => p.status === 'completed' && p.payment_method !== 'credit')
    .reduce((s: number, p: any) => s + Number(p.amount), 0)
})

const remainingAmount = computed(() => {
  if (props.order?.remaining_amount != null) return Number(props.order.remaining_amount)
  return Math.max(0, Number(props.order?.total || 0) - paidAmount.value)
})

const collectAmount = computed(() => {
  const debtRemaining = props.order?.customer_debt?.remaining_amount
  if (debtRemaining != null && debtRemaining > 0) return Number(debtRemaining)
  return remainingAmount.value
})

const canCollect = computed(() => collectAmount.value > 0 && customerId.value)

const payments = computed(() =>
  [...(props.order?.payments || [])]
    .filter((p: any) => p.status === 'completed')
    .sort((a: any, b: any) => String(b.payment_date || b.created_at).localeCompare(String(a.payment_date || a.created_at)))
)

const paymentTermsLabel = computed(() =>
  props.order?.payment_terms === 'credit' ? 'آجل' : 'نقدي'
)

const paymentTermsClass = computed(() =>
  props.order?.payment_terms === 'credit' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
)

const paymentStatusLabel = computed(() => getPaymentStatusLabel(props.order?.payment_status || ''))

const paymentStatusClass = computed(() => {
  const s = props.order?.payment_status
  if (s === 'paid') return 'bg-emerald-100 text-emerald-700'
  if (s === 'partial') return 'bg-amber-100 text-amber-700'
  return 'bg-gray-100 text-gray-600'
})

const paymentMethodLabel = (m: string) =>
  ({ cash: 'كاش', card: 'بطاقة', bank_transfer: 'تحويل', digital_wallet: 'محفظة' }[m] || m)

const openCollectModal = () => {
  collectForm.amount = collectAmount.value
  collectForm.payment_method = 'cash'
  showCollect.value = true
}

const submitCollect = async () => {
  if (!customerId.value || !props.order?.id) return
  if (collectForm.amount <= 0 || collectForm.amount > collectAmount.value) {
    addToast('المبلغ غير صالح', 'error')
    return
  }

  collecting.value = true
  try {
    const payload: Record<string, unknown> = {
      amount: collectForm.amount,
      payment_method: collectForm.payment_method,
      order_id: props.order.id,
      notes: `تحصيل طلب ${props.order.code}`,
    }
    if (props.order.customer_debt?.id) {
      payload.customer_debt_id = props.order.customer_debt.id
    }

    const res = await issueCustomerReceipt(customerId.value, payload)
    addToast(`تم إصدار سند قبض ${res?.data?.code || ''}`, 'success')
    showCollect.value = false
    emit('collected')
  } catch (e: any) {
    addToast(e.message || 'فشل التحصيل', 'error')
  } finally {
    collecting.value = false
  }
}

const goToCustomerAccount = () => {
  if (customerId.value) {
    router.push({ name: 'CustomersView', params: { id: customerId.value } })
  }
}
</script>
