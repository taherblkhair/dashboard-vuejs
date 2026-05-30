<template>
  <section class="receipt-doc" dir="rtl">
    <div class="doc-header">
      <h1 class="doc-title">{{ receipt.type_label }}</h1>
      <p class="doc-code">{{ receipt.code }}</p>
    </div>

    <div class="doc-meta">
      <div class="meta-row">
        <span class="meta-label">التاريخ</span>
        <span class="meta-value">{{ formatDate(receipt.receipt_date) }}</span>
      </div>
      <div class="meta-row">
        <span class="meta-label">العميل</span>
        <span class="meta-value">{{ receipt.customer?.name || '—' }}</span>
      </div>
      <div v-if="receipt.customer?.phone" class="meta-row">
        <span class="meta-label">الهاتف</span>
        <span class="meta-value">{{ receipt.customer.phone }}</span>
      </div>
      <div v-if="receipt.order?.code" class="meta-row">
        <span class="meta-label">فاتورة مبيعات</span>
        <span class="meta-value">#{{ receipt.order.code }}</span>
      </div>
      <div class="meta-row">
        <span class="meta-label">طريقة الدفع</span>
        <span class="meta-value">{{ paymentMethodLabel(receipt.payment_method) }}</span>
      </div>
      <div v-if="receipt.vault?.name" class="meta-row">
        <span class="meta-label">الخزنة</span>
        <span class="meta-value">{{ receipt.vault.name }}</span>
      </div>
    </div>

    <div class="amount-box">
      <span class="amount-label">المبلغ</span>
      <span class="amount-value">{{ formatCurrency(receipt.amount) }}</span>
    </div>

    <p v-if="receipt.notes" class="doc-notes">{{ receipt.notes }}</p>

    <div class="doc-footer">
      <p>توقيع المحاسب: _______________</p>
      <p>توقيع العميل: _______________</p>
      <p class="print-time">تمت الطباعة: {{ printedAt }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { formatCurrency, formatDate } from '../../utils/helpers'
import type { FinancialReceipt } from '../../api/accounting'

defineProps<{
  receipt: FinancialReceipt
  printedAt?: string
}>()

const paymentMethodLabel = (m: string) =>
  ({ cash: 'كاش', card: 'بطاقة', bank_transfer: 'تحويل بنكي', digital_wallet: 'محفظة' }[m] || m)
</script>

<style scoped>
.receipt-doc {
  max-width: 520px;
  margin: 0 auto;
  padding: 32px;
  background: white;
  color: #111827;
  font-family: system-ui, -apple-system, sans-serif;
}

.doc-header {
  text-align: center;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 16px;
  margin-bottom: 24px;
}

.doc-title {
  font-size: 22px;
  font-weight: 800;
  margin: 0;
}

.doc-code {
  font-family: ui-monospace, monospace;
  color: #4f46e5;
  font-weight: 700;
  margin-top: 8px;
}

.doc-meta {
  margin-bottom: 24px;
}

.meta-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px dashed #f3f4f6;
  font-size: 14px;
}

.meta-label {
  color: #6b7280;
}

.meta-value {
  font-weight: 600;
}

.amount-box {
  background: #f0fdf4;
  border: 2px solid #86efac;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  margin-bottom: 20px;
}

.amount-label {
  display: block;
  font-size: 13px;
  color: #166534;
  margin-bottom: 4px;
}

.amount-value {
  font-size: 28px;
  font-weight: 900;
  color: #14532d;
  font-family: ui-monospace, monospace;
}

.doc-notes {
  font-size: 13px;
  color: #4b5563;
  background: #f9fafb;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.doc-footer {
  border-top: 1px solid #e5e7eb;
  padding-top: 20px;
  font-size: 13px;
  color: #6b7280;
}

.doc-footer p {
  margin: 8px 0;
}

.print-time {
  text-align: center;
  font-size: 11px;
  margin-top: 16px !important;
}
</style>
