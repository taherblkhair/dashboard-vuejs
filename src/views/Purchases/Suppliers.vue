<template>
  <div class="p-6 bg-gray-50 min-h-screen" dir="rtl">
    <div class="max-w-6xl mx-auto space-y-6">
      
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900">الموردون</h1>
          <p class="text-sm text-gray-500 mt-1">إدارة قائمة الموردين والشركاء</p>
        </div>
        <MButton variant="primary" @click="() => router.push({ name: 'PurchasesSupplierCreate' })">
          إضافة مورد جديد
        </MButton>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-12 text-gray-500">جاري التحميل...</div>

      <!-- Empty -->
      <MCard v-else-if="suppliers.length === 0" padding="p-12">
        <div class="text-center">
          <p class="text-gray-500 mb-4">لا يوجد موردون مضافون حالياً</p>
          <MButton variant="secondary" @click="() => router.push({ name: 'PurchasesSupplierCreate' })">إضافة أول مورد</MButton>
        </div>
      </MCard>

      <!-- Suppliers Table -->
      <MCard v-else padding="p-0">
        <MTable>
          <template #header>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">الاسم</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">المسؤول</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">الهاتف</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">البريد</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">إجراءات</th>
          </template>
          <tr v-for="s in suppliers" :key="s.id" class="hover:bg-gray-50">
            <td class="px-4 py-3 font-medium text-gray-900">{{ s.name }}</td>
            <td class="px-4 py-3 text-sm text-gray-600">{{ s.contact_name || '-' }}</td>
            <td class="px-4 py-3 text-sm text-gray-600 font-mono">{{ s.phone || '-' }}</td>
            <td class="px-4 py-3 text-sm text-gray-600">{{ s.email || '-' }}</td>
            <td class="px-4 py-3">
              <div class="flex gap-2">
                <MButton variant="ghost" size="sm" @click="() => editSupplier(s.id)">تعديل</MButton>
                <MButton variant="ghost" size="sm" @click="() => viewPurchaseOrders(s.id)">الطلبات</MButton>
                <MButton variant="ghost" size="sm" class="text-red-500 hover:bg-red-50" @click="() => removeSupplier(s.id)">حذف</MButton>
              </div>
            </td>
          </tr>
        </MTable>

        <!-- Pagination -->
        <div class="flex items-center justify-between p-4 border-t border-gray-100">
          <span class="text-sm text-gray-500">صفحة {{ meta.current_page }} من {{ meta.last_page }}</span>
          <div class="flex gap-2">
            <MButton variant="secondary" size="sm" :disabled="meta.current_page <= 1" @click="changePage(meta.current_page - 1)">السابق</MButton>
            <MButton variant="secondary" size="sm" :disabled="meta.current_page >= meta.last_page" @click="changePage(meta.current_page + 1)">التالي</MButton>
          </div>
        </div>
      </MCard>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { fetchSuppliers, deleteSupplier } from '../../api/suppliers'
import MButton from '../../components/ui/MButton.vue'
import MCard from '../../components/ui/MCard.vue'
import MTable from '../../components/ui/MTable.vue'
import { useToast } from '../../composables/useToast'
import { useConfirm } from '../../composables/useConfirm'

const router = useRouter()
const { addToast } = useToast()
const { confirm: confirmDialog } = useConfirm()

const suppliers = ref<any[]>([])
const loading = ref(false)
const meta = ref<any>({ current_page: 1, last_page: 1 })

const load = async (page = 1) => {
  loading.value = true
  try {
    const res = await fetchSuppliers(page)
    suppliers.value = res?.data || []
    meta.value = res?.meta || meta.value
  } catch (e) { console.error(e) }
  finally { loading.value = false }
}

onMounted(load)
const changePage = (p: number) => load(p)

const editSupplier = (id?: number) => id && router.push({ name: 'PurchasesSupplierEdit', params: { id } })
const viewPurchaseOrders = (id?: number) => id && router.push({ name: 'PurchasesSupplierPurchaseOrders', params: { id } })

const removeSupplier = async (id?: number) => {
  if (!id) return
  const ok = await confirmDialog({
    title: 'تأكيد الحذف',
    message: 'هل أنت متأكد من حذف هذا المورد؟',
    type: 'danger',
    confirmText: 'نعم، حذف'
  })
  
  if (!ok) return
  
  try {
    await deleteSupplier(id)
    await load(meta.value.current_page)
    addToast('تم حذف المورد بنجاح')
  } catch (e) { 
    console.error(e)
    addToast('فشل حذف المورد', 'error') 
  }
}
</script>

<style scoped>
</style>
