import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../components/layout/MainLayout.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { guest: true }
  },
  {
    path: '/',
    component: MainLayout,
    // all child routes under MainLayout are protected by the global guard
    children: [
      { path: '', name: 'Dashboard', component: () => import('../views/Home.vue') },
  { path: 'products', name: 'Products', component: () => import('../views/Products/index.vue') },
  { path: 'products/:id', name: 'ProductDetails', component: () => import('../views/Products/ProductDetails.vue') },
  { path: 'categories/:id/products', name: 'CategoryProducts', component: () => import('../views/Categories/CategoryProducts.vue') },
      { path: 'orders', name: 'Orders', component: () => import('../views/Orders/index.vue') },
      { path: 'customers', name: 'Customers', component: () => import('../views/Users/index.vue') },
      { path: 'categories', name: 'Categories', component: () => import('../views/Categories/index.vue') },
  { path: 'warehouses', name: 'Warehouses', component: () => import('../views/Warehouses/index.vue') },
  { path: 'warehouses/create', name: 'WarehouseCreate', component: () => import('../views/Warehouses/Create.vue') },
  { path: 'warehouses/:id', name: 'WarehouseDetails', component: () => import('../views/Warehouses/Details.vue') },
  { path: 'stock-movements/create', name: 'StockMovementCreate', component: () => import('../views/StockMovements/Create.vue') },
  { path: 'stock-movements/transfer', name: 'StockMovementTransfer', component: () => import('../views/StockMovements/Transfer.vue') },
  { path: 'reports/stock/low-stock', name: 'ReportsLowStock', component: () => import('../views/Reports/LowStock.vue') },
  { path: 'purchases/suppliers', name: 'PurchasesSuppliers', component: () => import('../views/Purchases/Suppliers.vue') },
  { path: 'purchases/suppliers/create', name: 'PurchasesSupplierCreate', component: () => import('../views/Purchases/SuppliersCreate.vue') },
  { path: 'purchases/suppliers/:id/edit', name: 'PurchasesSupplierEdit', component: () => import('../views/Purchases/SuppliersCreate.vue') },
      { path: 'reports', name: 'Reports', component: () => import('../views/Reports.vue') },
      { path: 'settings', name: 'Settings', component: () => import('../views/Settings.vue') }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Global guard: require token for protected routes; allow guest routes like /login
router.beforeEach((to: any, _from: any, next: any) => {
  const token = localStorage.getItem('token')

  if (!token && !to.meta?.guest) {
    return next({ name: 'Login' })
  }

  if (token && to.meta?.guest) {
    return next({ name: 'Dashboard' })
  }

  next()
})

export default router