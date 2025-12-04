<template>
  <div class="p-6 bg-gray-50 min-h-screen" dir="rtl">
    <div class="max-w-6xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold">الموردون</h1>
          <p class="text-sm text-gray-500">قائمة الموردين.</p>
        </div>
        <div>
          <button @click="() => router.push({ name: 'PurchasesSupplierCreate' })" class="px-4 py-2 bg-blue-600 text-white rounded">إضافة مورد</button>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-4">
        <div v-if="loading" class="text-center py-8">جاري التحميل...</div>
        <div v-else>
          <div v-if="suppliers.length === 0" class="text-center py-8 text-gray-500">لا يوجد موردون</div>
          <div v-else class="overflow-x-auto">
            <table class="w-full table-auto text-sm">
              <thead>
                <tr class="text-right text-xs text-gray-500 border-b">
                  <th class="p-2">#</th>
                  <th class="p-2">الاسم</th>
                  <th class="p-2">الشخص المسؤول</th>
                  <th class="p-2">الهاتف</th>
                  <th class="p-2">البريد</th>
                  <th class="p-2">ملاحظات</th>
                  <th class="p-2">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="s in suppliers" :key="s.id" class="border-b hover:bg-gray-50">
                  <td class="p-2 text-right">{{ s.id }}</td>
                  <td class="p-2 text-right">{{ s.name }}</td>
                  <td class="p-2 text-right">{{ s.contact_name || '-' }}</td>
                  <td class="p-2 text-right">{{ s.phone || '-' }}</td>
                  <td class="p-2 text-right">{{ s.email || '-' }}</td>
                  <td class="p-2 text-right">{{ s.notes || '-' }}</td>
                  <td class="p-2 text-right">
                    <div class="flex justify-end gap-2">
                      <button @click="() => editSupplier(s.id)" class="px-2 py-1 bg-yellow-500 text-white rounded text-xs">تعديل</button>
                      <button @click="() => viewPurchaseOrders(s.id)" class="px-2 py-1 bg-indigo-600 text-white rounded text-xs">طلبات الشراء</button>
                      <button @click="() => removeSupplier(s.id)" class="px-2 py-1 bg-red-500 text-white rounded text-xs">حذف</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="mt-4 flex items-center justify-between">
            <div class="text-sm text-gray-500">الصفحة {{ meta.current_page }} من {{ meta.last_page }}</div>
            <div class="flex gap-2">
              <button :disabled="meta.current_page <= 1" @click="changePage(meta.current_page - 1)" class="px-3 py-1 border rounded">السابق</button>
              <button :disabled="meta.current_page >= meta.last_page" @click="changePage(meta.current_page + 1)" class="px-3 py-1 border rounded">التالي</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { fetchSuppliers, deleteSupplier } from '../../api/suppliers'

const router = useRouter()
const suppliers = ref<any[]>([])
const loading = ref(false)
const meta = ref<any>({ current_page: 1, last_page: 1 })

const load = async (page = 1) => {
  loading.value = true
  try {
    const res = await fetchSuppliers(page)
    suppliers.value = res?.data || []
    meta.value = res?.meta || meta.value
  } catch (e) {
    console.error('Failed to fetch suppliers', e)
  } finally {
    loading.value = false
  }
}

onMounted(load)

const changePage = (p: number) => {
  load(p)
}

const editSupplier = (id?: number) => {
  if (!id) return
  router.push({ name: 'PurchasesSupplierEdit', params: { id } })
}

const viewPurchaseOrders = (id?: number) => {
  if (!id) return
  router.push({ name: 'PurchasesSupplierPurchaseOrders', params: { id } })
}

const removeSupplier = async (id?: number) => {
  if (!id) return
  if (!confirm('هل أنت متأكد من حذف هذا المورد؟')) return
  try {
    await deleteSupplier(id)
    // refresh current page
    load(meta.value.current_page)
  } catch (e) {
    console.error('Failed to delete supplier', e)
    alert('فشل الحذف')
  }
}
</script>

<style scoped>
</style>
