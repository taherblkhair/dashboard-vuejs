<template>
  <div dir="rtl" class="min-h-screen bg-slate-50/50 p-4 lg:p-8">
    <div class="max-w-[1600px] mx-auto space-y-8">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="space-y-1">
          <h1 class="text-3xl font-black text-slate-900 tracking-tight">الإيصالات المالية</h1>
          <p class="text-slate-500 font-medium">سندات القبض والصرف المرتبطة بالعملاء والمبيعات</p>
        </div>
        <MButton variant="secondary" @click="load" :loading="loading">تحديث</MButton>
      </div>

      <MCard title="تصفية">
        <div class="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <MInput v-model="filters.search" label="بحث (رقم السند / العميل)" />
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">النوع</label>
            <select v-model="filters.type" class="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg">
              <option value="">الكل</option>
              <option value="receipt">سند قبض</option>
              <option value="payment">سند صرف</option>
            </select>
          </div>
          <MInput v-model="filters.date_from" type="date" label="من تاريخ" />
          <MInput v-model="filters.date_to" type="date" label="إلى تاريخ" />
        </div>
        <div class="px-4 pb-4">
          <MButton variant="primary" @click="load(1)">تطبيق</MButton>
        </div>
      </MCard>

      <MCard title="قائمة الإيصالات" padding="p-0">
        <MTable :loading="loading" :empty="receipts.length === 0">
          <template #header>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">رقم السند</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">النوع</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">العميل</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الطلب</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المبلغ</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">التاريخ</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">إجراء</th>
          </template>
          <tr v-for="r in receipts" :key="r.id" class="hover:bg-slate-50/80">
            <td class="px-6 py-4 font-mono font-bold text-indigo-600">{{ r.code }}</td>
            <td class="px-6 py-4">
              <MBadge :variant="r.type === 'receipt' ? 'success' : 'warning'">{{ r.type_label }}</MBadge>
            </td>
            <td class="px-6 py-4 text-sm font-bold">{{ r.customer?.name || '—' }}</td>
            <td class="px-6 py-4 text-sm">{{ r.order?.code || '—' }}</td>
            <td class="px-6 py-4 text-sm font-black">{{ formatCurrency(r.amount) }}</td>
            <td class="px-6 py-4 text-sm text-slate-500">{{ formatDate(r.receipt_date) }}</td>
            <td class="px-6 py-4">
              <MButton size="sm" variant="ghost" @click="printReceipt(r)">طباعة</MButton>
            </td>
          </tr>
        </MTable>
      </MCard>
    </div>

    <!-- Print preview -->
    <div v-if="printing" class="fixed inset-0 z-50 flex items-center justify-center p-4 print:p-0">
      <div class="absolute inset-0 bg-slate-900/50 print:hidden" @click="printing = null"></div>
      <div class="relative bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 print:shadow-none print:max-w-none print:w-full" id="receipt-print">
        <div class="text-center border-b pb-4 mb-4">
          <h2 class="text-xl font-black">{{ printing.type_label }}</h2>
          <p class="font-mono text-indigo-600 font-bold mt-1">{{ printing.code }}</p>
        </div>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between"><span class="text-slate-500">العميل</span><span class="font-bold">{{ printing.customer?.name }}</span></div>
          <div class="flex justify-between"><span class="text-slate-500">التاريخ</span><span>{{ formatDate(printing.receipt_date) }}</span></div>
          <div v-if="printing.order?.code" class="flex justify-between"><span class="text-slate-500">الطلب</span><span>{{ printing.order.code }}</span></div>
          <div class="flex justify-between"><span class="text-slate-500">طريقة الدفع</span><span>{{ printing.payment_method }}</span></div>
          <div class="flex justify-between text-lg font-black border-t pt-3 mt-3">
            <span>المبلغ</span><span>{{ formatCurrency(printing.amount) }}</span>
          </div>
          <p v-if="printing.notes" class="text-slate-500 text-xs pt-2">{{ printing.notes }}</p>
        </div>
        <div class="mt-6 flex gap-3 print:hidden">
          <MButton variant="primary" class="flex-1" @click="doPrint">طباعة</MButton>
          <MButton variant="secondary" class="flex-1" @click="printing = null">إغلاق</MButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { fetchFinancialReceipts, type FinancialReceipt } from '../../api/accounting'
import { formatCurrency, formatDate } from '../../utils/helpers'
import { useToast } from '../../composables/useToast'
import MCard from '../../components/ui/MCard.vue'
import MTable from '../../components/ui/MTable.vue'
import MButton from '../../components/ui/MButton.vue'
import MInput from '../../components/ui/MInput.vue'
import MBadge from '../../components/ui/MBadge.vue'

const { addToast } = useToast()
const receipts = ref<FinancialReceipt[]>([])
const loading = ref(false)
const printing = ref<FinancialReceipt | null>(null)
const filters = reactive({ search: '', type: '', date_from: '', date_to: '' })

const load = async (page = 1) => {
  loading.value = true
  try {
    const res = await fetchFinancialReceipts({
      page,
      search: filters.search || undefined,
      type: filters.type || undefined,
      date_from: filters.date_from || undefined,
      date_to: filters.date_to || undefined,
    })
    receipts.value = res.data || []
  } catch {
    addToast('فشل تحميل الإيصالات', 'error')
  } finally {
    loading.value = false
  }
}

const printReceipt = (r: FinancialReceipt) => { printing.value = r }
const doPrint = () => window.print()

onMounted(() => load())
</script>

<style>
@media print {
  body * { visibility: hidden; }
  #receipt-print, #receipt-print * { visibility: visible; }
  #receipt-print { position: absolute; left: 0; top: 0; width: 100%; }
}
</style>
