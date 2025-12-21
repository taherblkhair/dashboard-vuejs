<template>
  <nav class="px-6 py-3" aria-label="Breadcrumb">
    <ol class="flex items-center gap-2 text-sm">
      <li>
        <button 
          @click="goTo('/', 'Dashboard')" 
          class="flex items-center gap-1.5 text-gray-500 hover:text-blue-600 transition-colors focus:outline-none group"
        >
          <div class="p-1 rounded-md group-hover:bg-blue-50 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M13 5v6h6" />
            </svg>
          </div>
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
  Products: 'المنتجات',
  ProductDetails: 'تفاصيل المنتج',
  Categories: 'الفئات',
  Orders: 'الطلبات',
  OrderDetails: 'تفاصيل الطلب',
  Customers: 'العملاء',
  Warehouses: 'المستودعات',
  Suppliers: 'الموردون',
  Reports: 'التقارير',
  Deliveries: 'التوصيلات',
  DeliveryProviders: 'شركات التوصيل',
  Riders: 'مندوبي التوصيل',
  Settings: 'الإعدادات',
  Addresses: 'العناوين',
  Users: 'المستخدمون',
  Cities: 'المدن',
  PurchaseOrders: 'طلبات الشراء',
  PurchasesSuppliers: 'الموردون (مشتريات)'
}

// parent mapping when detail pages should show a parent link
const parentMap: Record<string, string> = {
  ProductDetails: 'Products',
  OrderDetails: 'Orders'
}

const crumbs = computed<Crumb[]>(() => {
  const parts: Crumb[] = []

  // Try to use route.matched for hierarchical records first
  if (route.matched && route.matched.length > 0) {
    route.matched.forEach((rec) => {
      const n = rec.name as string | undefined
      if (n && n !== 'Dashboard') {
        const label = labelMap[n] || (rec.meta && (rec.meta as any).title) || n
        parts.push({ label: String(label), name: n })
      }
    })
  }

  // Fallback: use route.name if nothing from matched
  if (parts.length === 0 && route.name) {
    const rn = String(route.name)
    parts.push({ label: labelMap[rn] || rn, name: rn })
  }

  // If current is a detail route, ensure parent exists first
  const last = parts[parts.length - 1]
  if (last) {
    const parent = parentMap[last.name as string]
    if (parent) {
      // insert parent before last
      parts.splice(parts.length - 1, 0, { label: labelMap[parent] || parent, name: parent })
    }
  }

  return parts
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
