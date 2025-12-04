<template>
  <div class="p-6 bg-gray-50 min-h-screen" dir="rtl">
    <div class="max-w-6xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold">العملاء</h1>
          <p class="text-sm text-gray-500">قائمة العملاء.</p>
        </div>
      </div>

      <div class="flex justify-end gap-3 mt-6">
        <button @click="createCustomer" class="px-4 py-2 border rounded bg-gray-100 text-sm">إضافة عميل</button>
      </div>

      <div class="bg-white rounded-lg shadow p-4 mt-4">
        <div v-if="loading" class="text-center py-8">جاري التحميل...</div>
        <div v-else>
          <div v-if="customers.length === 0" class="text-center py-8 text-gray-500">لا يوجد عملاء</div>
          <div v-else class="overflow-x-auto">
            <table class="w-full table-auto text-sm">
              <thead>
                <tr class="text-right text-xs text-gray-500 border-b">
                  <th class="p-2">#</th>
                  <th class="p-2">الاسم</th>
                  <th class="p-2">الهاتف</th>
                  <th class="p-2">البريد الإلكتروني</th>
                  <th class="p-2">النوع</th>
                  <th class="p-2">الطلبات</th>
                  <th class="p-2">المجموع</th>
                  <th class="p-2">آخر طلب</th>
                  <th class="p-2">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="c in customers" :key="c.id" class="border-b hover:bg-gray-50">
                  <td class="p-2 text-right">{{ c.id }}</td>
                  <td class="p-2 text-right">{{ c.name }}</td>
                  <td class="p-2 text-right">{{ c.phone }}</td>
                  <td class="p-2 text-right">{{ c.email }}</td>
                  <td class="p-2 text-right">{{ c.customer_type }}</td>
                  <td class="p-2 text-right">{{ c.total_orders }}</td>
                  <td class="p-2 text-right">{{ c.total_spent }}</td>
                  <td class="p-2 text-right">{{ formatDate(c.last_order_date) }}</td>
                  <td class="p-2 text-right">
                    <div class="flex justify-end gap-2">
                      <button @click="viewCustomer(c.id)" class="px-2 py-1 bg-blue-600 text-white rounded text-xs">عرض</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { fetchCustomers } from '../../api/customers'

const router = useRouter()
const customers = ref<any[]>([])
const loading = ref(false)
const meta = ref<any>({ current_page: 1, last_page: 1 })

const load = async (page = 1) => {
  loading.value = true
  try {
    const res = await fetchCustomers(page)
    customers.value = res?.data || []
    meta.value = res?.meta || meta.value
  } catch (e) {
    console.error('Failed to fetch customers', e)
  } finally {
    loading.value = false
  }
}

onMounted(() => load())

const formatDate = (iso?: string) => {
  if (!iso) return '-'
  try { return new Date(iso).toLocaleDateString() } catch { return iso }
}

const createCustomer = () => router.push({ name: 'CustomersCreate' })
const viewCustomer = (id?: number) => { if (!id) return; router.push({ name: 'CustomersView', params: { id } }) }

</script>

<style scoped>
</style>
