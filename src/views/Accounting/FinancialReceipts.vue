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
              <div class="flex flex-wrap gap-2">
                <MButton size="sm" variant="ghost" @click="printReceipt(r)">طباعة الإيصال</MButton>
                <MButton
                  v-if="r.order_id"
                  size="sm"
                  variant="ghost"
                  @click="printCombined(r)"
                >
                  فاتورة + إيصال
                </MButton>
              </div>
            </td>
          </tr>
        </MTable>
      </MCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { fetchFinancialReceipts, getReceiptPrintUrl, getOrderPrintUrl, type FinancialReceipt } from '../../api/accounting'
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

const printReceipt = (r: FinancialReceipt) => {
  window.open(getReceiptPrintUrl(r.id), '_blank')
}

const printCombined = (r: FinancialReceipt) => {
  if (!r.order_id) return
  window.open(getOrderPrintUrl(r.order_id, 'combined'), '_blank')
}

onMounted(() => load())
</script>
