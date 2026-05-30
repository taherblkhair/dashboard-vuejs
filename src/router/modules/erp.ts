import type { RouteRecordRaw } from 'vue-router'

export const erpRoutes: RouteRecordRaw[] = [
  { path: '', name: 'Dashboard', component: () => import('../../views/Home.vue') },
  { path: 'products', name: 'Products', component: () => import('../../views/Products/index.vue') },
  { path: 'products/create', name: 'ProductCreate', component: () => import('../../views/Products/Create.vue') },
  { path: 'products/:id', name: 'ProductDetails', component: () => import('../../views/Products/ProductDetails.vue') },
  { path: 'products/:id/edit', name: 'ProductEdit', component: () => import('../../views/Products/Edit.vue') },
  { path: 'categories/:id/products', name: 'CategoryProducts', component: () => import('../../views/Categories/CategoryProducts.vue') },
  { path: 'orders', name: 'Orders', component: () => import('../../views/Orders/index.vue') },
  { path: 'orders/create', name: 'OrderCreate', component: () => import('../../views/Orders/Create.vue') },
  { path: 'orders/:id', name: 'OrderDetails', component: () => import('../../views/Orders/OrderDetails.vue') },
  { path: 'orders/:id/edit', name: 'OrderEdit', component: () => import('../../views/Orders/Edit.vue') },
  { path: 'customers', name: 'Customers', component: () => import('../../views/Customers/index.vue') },
  { path: 'customers/create', name: 'CustomersCreate', component: () => import('../../views/Customers/Create.vue') },
  { path: 'categories', name: 'Categories', component: () => import('../../views/Categories/index.vue') },
]

export const financialReportRoutes: RouteRecordRaw[] = [
  { path: 'reports/financial/expenses', name: 'FinancialExpenses', component: () => import('../../views/FinancialReports/ExpensesReport.vue') },
  { path: 'reports/financial/sales', name: 'FinancialSales', component: () => import('../../views/FinancialReports/SalesReport.vue') },
  { path: 'reports/financial/profit', name: 'FinancialProfit', component: () => import('../../views/FinancialReports/ProfitReport.vue') },
]
