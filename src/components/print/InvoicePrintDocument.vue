<template>
  <section class="invoice-doc" dir="rtl">
    <div class="invoice-header">
      <div class="header-main">
        <h1 class="business-name">فاتورة مبيعات</h1>
        <div class="order-meta">
          <p><span>رقم الفاتورة:</span> <strong>#{{ order.code || order.id }}</strong></p>
          <p><span>التاريخ:</span> <strong>{{ formatDate(order.order_date) }}</strong></p>
        </div>
      </div>
    </div>

    <div class="info-grid">
      <div class="info-box">
        <h3>بيانات العميل</h3>
        <p class="name">{{ order.customer?.name }}</p>
        <p v-if="order.customer?.phone">{{ order.customer.phone }}</p>
        <p v-if="order.delivery_address" class="address">
          {{ order.delivery_address.city }} — {{ order.delivery_address.area }}<br />
          {{ order.delivery_address.street }}
        </p>
      </div>
      <div class="info-box">
        <h3>حالة الطلب</h3>
        <p><span>الحالة:</span> {{ order.status }}</p>
        <p><span>الدفع:</span> {{ order.payment_status }}</p>
        <p v-if="order.payment_terms"><span>الشروط:</span> {{ order.payment_terms === 'credit' ? 'آجل' : 'نقدي' }}</p>
        <p v-if="order.delivery_date"><span>تاريخ التوصيل:</span> {{ order.delivery_date }}</p>
      </div>
    </div>

    <table class="invoice-table">
      <thead>
        <tr>
          <th>الصنف</th>
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
          </td>
          <td class="text-center font-mono">{{ l.quantity }}</td>
          <td class="text-left font-mono">{{ formatCurrency(l.unit_price) }}</td>
          <td class="text-left font-mono font-bold">{{ formatCurrency(l.total_price || (l.quantity * l.unit_price)) }}</td>
        </tr>
      </tbody>
    </table>

    <div class="footer-grid">
      <div class="notes-section">
        <h3 v-if="order.notes">ملاحظات:</h3>
        <p v-if="order.notes">{{ order.notes }}</p>
      </div>
      <div class="totals-section">
        <div class="total-row">
          <span>المجموع الفرعي:</span>
          <span>{{ formatCurrency(order.subtotal || order.total) }}</span>
        </div>
        <div class="total-row" v-if="order.discount_amount">
          <span>الخصم:</span>
          <span>- {{ formatCurrency(order.discount_amount) }}</span>
        </div>
        <div class="total-row" v-if="order.shipping_fee">
          <span>الشحن:</span>
          <span>+ {{ formatCurrency(order.shipping_fee) }}</span>
        </div>
        <div class="total-row" v-if="order.paid_amount != null">
          <span>المدفوع:</span>
          <span>{{ formatCurrency(order.paid_amount) }}</span>
        </div>
        <div class="total-row" v-if="order.remaining_amount != null && order.remaining_amount > 0">
          <span>المتبقي:</span>
          <span>{{ formatCurrency(order.remaining_amount) }}</span>
        </div>
        <div class="total-row grand-total">
          <span>الإجمالي النهائي:</span>
          <span>{{ formatCurrency(order.total) }}</span>
        </div>
      </div>
    </div>

    <div class="doc-footer">
      <p>شكرًا لتعاملك معنا</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { formatCurrency, formatDate } from '../../utils/helpers'

defineProps<{ order: any }>()
</script>

<style scoped>
.invoice-doc {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px;
  background: white;
  color: #111827;
  font-family: system-ui, -apple-system, sans-serif;
}

.invoice-header {
  border-bottom: 2px solid #f3f4f6;
  padding-bottom: 30px;
  margin-bottom: 40px;
}

.business-name {
  font-size: 28px;
  font-weight: 800;
  margin: 0 0 10px 0;
}

.order-meta p {
  margin: 4px 0;
  font-size: 14px;
  color: #6b7280;
}

.order-meta strong {
  color: #111827;
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
}

.product-sku {
  font-size: 12px;
  color: #9ca3af;
  margin-top: 2px;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 40px;
  margin-bottom: 40px;
}

.notes-section h3 {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 8px;
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

.doc-footer {
  text-align: center;
  border-top: 1px solid #f3f4f6;
  padding-top: 20px;
  color: #9ca3af;
  font-size: 13px;
}

.text-left { text-align: left !important; }
.text-center { text-align: center !important; }
.font-mono { font-family: ui-monospace, monospace; }
.font-bold { font-weight: 700; }
</style>
