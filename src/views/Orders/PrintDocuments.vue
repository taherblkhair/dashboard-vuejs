<template>
  <div class="print-root" dir="rtl">
    <div v-if="loading" class="status">جاري تحضير المستندات...</div>
    <div v-else-if="error" class="status error">{{ error }}</div>
    <template v-else>
      <InvoicePrintDocument v-if="showInvoice && order" :order="order" />

      <template v-if="showReceipts && receipts.length">
        <div v-for="(r, idx) in receipts" :key="r.id" :class="{ 'page-break': showInvoice || idx > 0 }">
          <ReceiptPrintDocument :receipt="r" :printed-at="printedAt" />
        </div>
      </template>

      <div v-if="!showInvoice && showReceipts && !receipts.length" class="status error">
        لا توجد إيصالات مالية مرتبطة
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { fetchOrder } from '../../api/orders'
import { fetchFinancialReceipt } from '../../api/accounting'
import InvoicePrintDocument from '../../components/print/InvoicePrintDocument.vue'
import ReceiptPrintDocument from '../../components/print/ReceiptPrintDocument.vue'
import type { FinancialReceipt } from '../../api/accounting'

const route = useRoute()
const orderId = Number(route.params.id)
const mode = computed(() => String(route.query.mode || 'invoice'))
const receiptId = computed(() => route.query.receipt_id ? Number(route.query.receipt_id) : null)

const order = ref<any>(null)
const receipts = ref<FinancialReceipt[]>([])
const loading = ref(true)
const error = ref('')
const printedAt = new Date().toLocaleString('ar-LY')

const showInvoice = computed(() => mode.value === 'invoice' || mode.value === 'combined')
const showReceipts = computed(() => mode.value === 'receipt' || mode.value === 'combined')

onMounted(async () => {
  try {
    if (showInvoice.value || mode.value === 'combined') {
      const res = await fetchOrder(orderId)
      order.value = res?.data || res
    }

    if (receiptId.value) {
      const r = await fetchFinancialReceipt(receiptId.value)
      receipts.value = [r]
    } else if (showReceipts.value && order.value?.financial_receipts?.length) {
      receipts.value = order.value.financial_receipts
    } else if (showReceipts.value && !showInvoice.value) {
      const res = await fetchOrder(orderId)
      order.value = res?.data || res
      receipts.value = order.value?.financial_receipts || []
    } else if (showReceipts.value && order.value?.financial_receipts) {
      receipts.value = order.value.financial_receipts
    }

    setTimeout(() => window.print(), 600)
  } catch {
    error.value = 'فشل تحميل بيانات الطباعة'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.print-root {
  background: white;
  min-height: 100vh;
}

.status {
  padding: 80px;
  text-align: center;
  color: #6b7280;
}

.status.error {
  color: #dc2626;
}

.page-break {
  page-break-before: always;
  break-before: page;
  padding-top: 40px;
}

@media print {
  .page-break {
    page-break-before: always;
    break-before: page;
  }
}
</style>
