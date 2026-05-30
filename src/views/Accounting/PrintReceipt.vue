<template>
  <div class="print-root" dir="rtl">
    <div v-if="loading" class="status">جاري تحضير الإيصال...</div>
    <div v-else-if="error" class="status error">{{ error }}</div>
    <ReceiptPrintDocument v-else-if="receipt" :receipt="receipt" :printed-at="printedAt" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { fetchFinancialReceipt } from '../../api/accounting'
import ReceiptPrintDocument from '../../components/print/ReceiptPrintDocument.vue'
import type { FinancialReceipt } from '../../api/accounting'

const route = useRoute()
const receiptId = Number(route.params.id)
const receipt = ref<FinancialReceipt | null>(null)
const loading = ref(true)
const error = ref('')
const printedAt = new Date().toLocaleString('ar-LY')

onMounted(async () => {
  try {
    receipt.value = await fetchFinancialReceipt(receiptId)
    setTimeout(() => window.print(), 500)
  } catch {
    error.value = 'فشل تحميل الإيصال'
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
</style>
