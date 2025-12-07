<template>
	<div class="p-6" dir="rtl">
			<div class="flex items-center justify-between mb-4">
					<div>
						<h1 class="text-2xl font-bold">الطلبات</h1>
						<p class="text-gray-600 mt-1">قائمة الطلبات</p>
					</div>
					<div class="flex items-center gap-2">
						<button @click="loadOrders(1)" class="px-3 py-1 bg-gray-100 rounded text-sm">تحديث</button>
					</div>
					<!-- create new order button -->
					 <div class="flex items-center gap-2 mt-3">
						<button @click="createOrder" class="px-3 py-1 bg-blue-600 text-white rounded">إنشاء طلبية مبيعات</button>
					</div>
				</div>

					<div class="bg-white rounded shadow p-3 mb-4">
						<div class="grid grid-cols-1 md:grid-cols-6 gap-3">
							<input v-model="filters.q" placeholder="بحث بكود الطلب أو اسم العميل" class="border rounded px-2 py-1" />
							<select v-model="filters.status" class="border rounded px-2 py-1">
							<option value="">كل الحالات</option>
							<option value="confirmed">confirmed</option>
							<option value="processing">processing</option>
							<option value="shipped">shipped</option>
							<option value="delivered">delivered</option>
							<option value="cancelled">cancelled</option>
						</select>
								<select v-model="filters.payment_status" class="border rounded px-2 py-1">
							<option value="">كل حالات الدفع</option>
							<option value="pending">pending</option>
							<option value="partial">partial</option>
							<option value="paid">paid</option>
						</select>
								<input v-model="filters.date_from" type="date" class="border rounded px-2 py-1" />
								<input v-model="filters.date_to" type="date" class="border rounded px-2 py-1" />
								<select v-model="filters.sort_by" class="border rounded px-2 py-1">
									<option value="">فرز حسب</option>
									<option value="order_date">تاريخ الطلب</option>
									<option value="total">المبلغ</option>
								</select>
								<select v-model="filters.sort_dir" class="border rounded px-2 py-1">
									<option value="desc">تنازلي</option>
									<option value="asc">تصاعدي</option>
								</select>
								<div class="flex gap-2">
									<button @click="applyFilters" class="px-3 py-1 bg-blue-600 text-white rounded">بحث</button>
									<button @click="resetFilters" class="px-3 py-1 border rounded">إعادة</button>
								</div>
					</div>
				</div>

				<div v-if="loading" class="text-center py-8">جاري التحميل...</div>

				<div v-else>
					<div v-if="orders.length === 0" class="text-gray-500">لا توجد طلبات</div>

					<div v-else class="bg-white rounded shadow overflow-x-auto">
				<table class="min-w-full text-sm">
					<thead>
						<tr class="text-right text-xs text-gray-500">
							<th class="px-3 py-2">كود</th>
							<th class="px-3 py-2">العميل</th>
							<th class="px-3 py-2">الحالة</th>
							<th class="px-3 py-2">حالة الدفع</th>
							<th class="px-3 py-2">المبلغ</th>
							<th class="px-3 py-2">تاريخ الطلب</th>
							<th class="px-3 py-2">تاريخ التوصيل</th>
							<th class="px-3 py-2">المكلف</th>
						</tr>
					</thead>
					<tbody>
									<tr v-for="o in orders" :key="o.id" class="border-t hover:bg-gray-50">
										<td class="px-3 py-2"><router-link :to="{ name: 'OrderDetails', params: { id: o.id } }" class="text-blue-600">{{ o.code }}</router-link></td>
										<td class="px-3 py-2"><router-link :to="{ name: 'CustomersView', params: { id: o.customer?.id } }" class="text-blue-600">{{ o.customer?.name || '-' }}</router-link></td>
										<td class="px-3 py-2"><span :class="statusClass(o.status)" class="px-2 py-1 rounded text-xs">{{ o.status }}</span></td>
										<td class="px-3 py-2"><span :class="paymentClass(o.payment_status)" class="px-2 py-1 rounded text-xs">{{ o.payment_status }}</span></td>
										<td class="px-3 py-2">{{ formatCurrency(o.total) }}</td>
										<td class="px-3 py-2">{{ formatDate(o.order_date) }}</td>
										<td class="px-3 py-2">{{ formatDate(o.delivery_date) }}</td>
										<td class="px-3 py-2">{{ o.assigned_to?.name || '-' }}</td>
									</tr>
					</tbody>
				</table>
			</div>

			<div class="flex items-center justify-between mt-3">
				<div class="text-sm text-gray-600">الصفحة {{ meta.current_page }} من {{ meta.last_page }}</div>
				<div class="flex items-center gap-2">
					<button :disabled="meta.current_page <= 1" @click="loadOrders(meta.current_page - 1)" class="px-3 py-1 border rounded disabled:opacity-50">السابق</button>
					<button :disabled="meta.current_page >= meta.last_page" @click="loadOrders(meta.current_page + 1)" class="px-3 py-1 border rounded disabled:opacity-50">التالي</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { fetchOrders } from '../../api/orders'

const orders = ref<any[]>([])
const loading = ref(false)
const meta = ref({ current_page: 1, last_page: 1, per_page: 15, total: 0 })
const filters = ref({ q: '', status: '', payment_status: '', date_from: '', date_to: '', sort_by: '', sort_dir: 'desc' })

const loadOrders = async (page = 1) => {
	loading.value = true
	try {
		const params: Record<string, any> = {}
		if (filters.value.q) params.q = filters.value.q
		if (filters.value.status) params.status = filters.value.status
		if (filters.value.payment_status) params.payment_status = filters.value.payment_status

		const res = await fetchOrders(page, params)
		orders.value = res?.data || []
		meta.value = res?.meta || meta.value
	} catch (e) {
		console.error('Failed to load orders', e)
		orders.value = []
	} finally {
		loading.value = false
	}
}

const applyFilters = () => loadOrders(1)
const resetFilters = () => {
	filters.value = { q: '', status: '', payment_status: '', date_from: '', date_to: '', sort_by: '', sort_dir: 'desc' }
	loadOrders(1)
}

onMounted(() => loadOrders(1))
const createOrder = () => {
	window.location.href = 'orders/create'
}

const formatDate = (iso?: string) => {
	if (!iso) return '—'
	try {
		const d = new Date(iso)
		return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
	} catch {
		return iso
	}
}

const formatCurrency = (val?: string | number) => {
	if (val === null || val === undefined || val === '') return '0.00'
	const num = typeof val === 'number' ? val : Number(String(val))
	if (Number.isNaN(num)) return String(val)
	return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(num)
}

const statusClass = (s?: string) => {
	switch (s) {
		case 'confirmed': return 'bg-yellow-100 text-yellow-800'
		case 'processing': return 'bg-blue-100 text-blue-800'
		case 'shipped': return 'bg-indigo-100 text-indigo-800'
		case 'delivered': return 'bg-green-100 text-green-800'
		case 'cancelled': return 'bg-red-100 text-red-800'
		default: return 'bg-gray-100 text-gray-800'
	}
}

const paymentClass = (s?: string) => {
	switch (s) {
		case 'pending': return 'bg-yellow-100 text-yellow-800'
		case 'partial': return 'bg-orange-100 text-orange-800'
		case 'paid': return 'bg-green-100 text-green-800'
		default: return 'bg-gray-100 text-gray-800'
	}
}
</script>

<style scoped>
</style>
