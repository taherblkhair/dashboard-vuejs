<template>
  <div class="print-container" v-if="order" dir="rtl">
    <!-- Invoice Header -->
    <div class="invoice-header">
      <div class="header-main">
        <h1 class="business-name">فاتورة مبيعات</h1>
        <div class="order-meta">
          <p><span>رقم الفاتورة:</span> <strong>#{{ order.code || order.id }}</strong></p>
          <p><span>التاريخ:</span> <strong>{{ formatDate(order.order_date) }}</strong></p>
        </div>
      </div>
      <div class="business-logo">Dashboard</div>
    </div>

    <!-- Info Sections -->
    <div class="info-grid">
      <div class="info-box">
        <h3>بيانات العميل</h3>
        <p class="name">{{ order.customer?.name }}</p>
        <p v-if="order.customer?.phone">{{ order.customer.phone }}</p>
        <p v-if="order.delivery_address" class="address">
          {{ order.delivery_address.city }} — {{ order.delivery_address.area }}<br/>
          {{ order.delivery_address.street }}
        </p>
      </div>
      <div class="info-box text-left">
        <h3>حالة الطلب</h3>
        <p><span>الحالة:</span> {{ order.status }}</p>
        <p><span>الدفع:</span> {{ order.payment_status }}</p>
        <p v-if="order.delivery_date"><span>تاريخ التوصيل:</span> {{ order.delivery_date }}</p>
      </div>
    </div>

    <!-- Items Table -->
    <table class="invoice-table">
      <thead>
        <tr>
          <th>المنتج</th>
          <th class="text-center">الكمية</th>
          <th class="text-left">السعر</th>
          <th class="text-left">الإجمالي</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="l in order.lines" :key="l.id">
          <td>
            <div class="product-name">{{ l.product_variant?.product?.name }}</div>
            <div class="product-sku" v-if="l.product_variant?.sku_variant">{{ l.product_variant.sku_variant }}</div>
            <div class="product-attr" v-if="l.product_variant?.attributes">
              {{ formatAttributes(l.product_variant.attributes) }}
            </div>
          </td>
          <td class="text-center font-mono">{{ l.quantity }}</td>
          <td class="text-left font-mono">{{ formatCurrency(l.unit_price) }}</td>
          <td class="text-left font-mono font-bold">{{ formatCurrency(l.total_price || (l.quantity * l.unit_price)) }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Totals -->
    <div class="footer-grid">
      <div class="notes-section">
        <h3 v-if="order.notes">ملاحظات:</h3>
        <p v-if="order.notes">{{ order.notes }}</p>
      </div>
      <div class="totals-section">
        <div class="total-row">
          <span>المجموع الفرعي:</span>
          <span>{{ formatCurrency(order.subtotal || order.total_amount) }}</span>
        </div>
        <div class="total-row" v-if="order.discount_amount">
          <span>الخصم:</span>
          <span>- {{ formatCurrency(order.discount_amount) }}</span>
        </div>
        <div class="total-row" v-if="order.shipping_fee">
          <span>الشحن:</span>
          <span>+ {{ formatCurrency(order.shipping_fee) }}</span>
        </div>
        <div class="total-row grand-total">
          <span>الإجمالي النهائي:</span>
          <span>{{ formatCurrency(order.total_amount || order.total) }}</span>
        </div>
      </div>
    </div>

    <!-- Print Footer -->
    <div class="print-footer">
      <p>شكرًا لتعاملك معنا</p>
      <p class="print-time">تمت الطباعة في: {{ new Date().toLocaleString('ar-SA') }}</p>
    </div>
  </div>
  <div v-else-if="loading" class="loading">جاري تحضير الفاتورة...</div>
  <div v-else class="error">خطأ في تحميل بيانات الطلب</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { fetchOrder } from '../../api/orders'
import { formatAttributes } from '../../utils/helpers'

const route = useRoute()
const id = Number(route.params.id)
const order = ref<any>(null)
const loading = ref(true)

const formatCurrency = (val?: number) => {
  if (val == null) return '0.00 د.ل'
  return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(val) + ' د.ل'
}

const formatDate = (iso?: string) => {
  if (!iso) return '-'
  return new Date(iso).toLocaleDateString('en-us' , { year: 'numeric', month: 'long', day: 'numeric' })
}

onMounted(async () => {
  try {
    const res = await fetchOrder(id)
    order.value = res?.data || res
    
    // Auto print when data is loaded
    setTimeout(() => {
      window.print()
      // Optional: Close tab after printing
      // window.close()
    }, 500)
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.print-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px;
  background: white;
  color: #111827;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

.invoice-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 2px solid #f3f4f6;
  padding-bottom: 30px;
  margin-bottom: 40px;
}

.business-name {
  font-size: 28px;
  font-weight: 800;
  margin: 0 0 10px 0;
  color: #111827;
}

.order-meta p {
  margin: 4px 0;
  font-size: 14px;
  color: #6b7280;
}

.order-meta strong {
  color: #111827;
}

.business-logo {
  font-size: 24px;
  font-weight: 900;
  color: #2563eb;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-bottom: 40px;
}

.info-box h3 {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #9ca3af;
  margin: 0 0 10px 0;
  border-bottom: 1px solid #f3f4f6;
  padding-bottom: 5px;
}

.info-box p {
  margin: 5px 0;
  font-size: 15px;
}

.info-box .name {
  font-weight: 600;
  font-size: 17px;
}

.info-box .address {
  font-size: 14px;
  color: #4b5563;
  line-height: 1.5;
}

.invoice-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 40px;
}

.invoice-table th {
  background: #f9fafb;
  color: #4b5563;
  font-size: 12px;
  text-transform: uppercase;
  padding: 12px;
  text-align: right;
  border-bottom: 1px solid #e5e7eb;
}

.invoice-table td {
  padding: 15px 12px;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: top;
}

.product-name {
  font-weight: 600;
  color: #111827;
}

.product-sku {
  font-size: 12px;
  color: #9ca3af;
  margin-top: 2px;
}

.product-attr {
  font-size: 11px;
  color: #6b7280;
  font-style: italic;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 40px;
  margin-bottom: 60px;
}

.notes-section h3 {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 8px;
}

.notes-section p {
  font-size: 13px;
  color: #4b5563;
  line-height: 1.6;
}

.total-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 15px;
  color: #4b5563;
}

.grand-total {
  border-top: 2px solid #111827;
  margin-top: 10px;
  padding-top: 15px;
  font-weight: 800;
  font-size: 20px;
  color: #111827;
}

.print-footer {
  text-align: center;
  border-top: 1px solid #f3f4f6;
  padding-top: 30px;
  color: #9ca3af;
}

.print-footer p {
  margin: 5px 0;
  font-size: 13px;
}

.print-time {
  font-size: 11px !important;
}

.loading, .error {
  padding: 100px;
  text-align: center;
  color: #6b7280;
}

.text-left { text-align: left !important; }
.text-center { text-align: center !important; }
.font-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }

@media print {
  body { background: white !important; }
  .print-container { max-width: 100%; border: none; padding: 0; }
}
</style>
