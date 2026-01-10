<template>
  <nav class="px-6 py-3" aria-label="Breadcrumb">
    <ol class="flex items-center gap-2 text-sm">
      <li>
        <button 
          @click="goTo('/', 'Dashboard')" 
          class="flex items-center gap-1.5 text-gray-500 hover:text-blue-600 transition-colors focus:outline-none group"
        >

          <span class="font-medium">لوحة التحكم</span>
        </button>
      </li>

      <template v-for="(crumb, idx) in crumbs" :key="idx">
        <li class="flex items-center text-gray-300">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </li>
        <li>
          <span v-if="idx === crumbs.length - 1" class="text-blue-600 font-semibold bg-blue-50/50 px-2 py-1 rounded-lg">{{ crumb.label }}</span>
          <button 
            v-else 
            @click="goToCrumb(crumb)" 
            class="text-gray-500 hover:text-gray-900 transition-colors focus:outline-none"
          >
            {{ crumb.label }}
          </button>
        </li>
      </template>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

type Crumb = { label: string; name?: string; path?: string }

// map route names to friendly Arabic labels
const labelMap: Record<string, string> = {
  Dashboard: 'لوحة التحكم',
  Products: 'الآصناف',
  ProductCreate: 'إضافة صنف',
  ProductDetails: 'تفاصيل الصنف',
  Categories: 'الفئات',
  CategoryProducts: 'آصناف الفئة',
  Orders: 'الطلبات',
  OrderCreate: 'إنشاء طلب',
  OrderDetails: 'تفاصيل الطلب',
  OrderEdit: 'تعديل الطلب',
  Customers: 'العملاء',
  CustomersCreate: 'إضافة عميل',
  CustomersView: 'عرض العميل',
  Warehouses: 'المخازن',
  WarehouseCreate: 'إضافة مخزن',
  WarehouseDetails: 'تفاصيل المخزن',
  Suppliers: 'الموردون',
  Reports: 'التقارير',
  ReportsLowStock: 'النواقص',
  ReportsPurchases: 'تقارير المشتريات',
  ReportsSales: 'تقارير المبيعات',
  Deliveries: 'التوصيلات',
  DeliveryDetails: 'تفاصيل التوصيل',
  DeliveryProviders: 'شركات التوصيل',
  DeliveryProviderCreate: 'إضافة شركة توصيل',
  DeliveryProviderDetails: 'تفاصيل شركة التوصيل',
  Riders: 'مندوبي التوصيل',
  RiderCreate: 'إضافة مندوب',
  Settings: 'الإعدادات',
  Addresses: 'العناوين',
  Users: 'المستخدمون',
  Cities: 'المدن',
  PurchaseOrders: 'طلبات الشراء',
  PurchaseOrderCreate: 'إنشاء طلب شراء',
  PurchaseOrderDetails: 'تفاصيل طلب الشراء',
  PurchaseOrderReceives: 'استلامات الشراء',
  PurchaseOrderReceiveCreate: 'استلام طلب شراء',
  PurchasesSuppliers: 'الموردون (مشتريات)',
  PurchasesSupplierCreate: 'إضافة مورد',
  PurchasesSupplierEdit: 'تعديل مورد',
  PurchasesSupplierPurchaseOrders: 'طلبات المورد',
  StockMovementCreate: 'حركة مخزنية',
  StockMovementTransfer: 'تحويل مخزني'
}

// parent mapping when detail pages should show a parent link
const parentMap: Record<string, string> = {
  ProductCreate: 'Products',
  ProductDetails: 'Products',
  CategoryProducts: 'Categories',
  OrderCreate: 'Orders',
  OrderDetails: 'Orders',
  OrderEdit: 'OrderDetails',
  CustomersCreate: 'Customers',
  CustomersView: 'Customers',
  WarehouseCreate: 'Warehouses',
  WarehouseDetails: 'Warehouses',
  ReportsLowStock: 'Reports',
  ReportsPurchases: 'Reports',
  ReportsSales: 'Reports',
  DeliveryDetails: 'Deliveries',
  DeliveryProviderCreate: 'DeliveryProviders',
  DeliveryProviderDetails: 'DeliveryProviders',
  RiderCreate: 'Riders',
  PurchaseOrderCreate: 'PurchaseOrders',
  PurchaseOrderDetails: 'PurchaseOrders',
  PurchaseOrderReceives: 'PurchaseOrders',
  PurchaseOrderReceiveCreate: 'PurchaseOrders',
  PurchasesSupplierCreate: 'PurchasesSuppliers',
  PurchasesSupplierEdit: 'PurchasesSuppliers',
  PurchasesSupplierPurchaseOrders: 'PurchasesSuppliers'
}

const crumbs = computed<Crumb[]>(() => {
  const result: Crumb[] = []
  
  const buildTrail = (name: string) => {
    if (!name || name === 'Dashboard') return
    
    // Check parent first to maintain order (parent > child)
    const parent = parentMap[name]
    if (parent) {
      buildTrail(parent)
    }
    
    const label = labelMap[name] || name
    result.push({ label, name })
  }

  if (route.name) {
    buildTrail(String(route.name))
  }

  return result
})

function goTo(path: string | { name?: string; path?: string }, name?: string) {
  if (typeof path === 'string') {
    router.push(path)
  } else if (path && (path as any).name) {
    router.push({ name: (path as any).name })
  } else if (name) {
    router.push({ name })
  }
}

function goToCrumb(c: Crumb) {
  if (c.name && router.hasRoute(c.name)) {
    router.push({ name: c.name })
  } else if (c.path) {
    router.push(c.path)
  }
}
</script>

<style scoped>
/* small visual tweak for RTL spacing */
.rtl ol { direction: rtl }
</style>
