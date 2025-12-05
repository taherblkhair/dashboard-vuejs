<template>
	<div class="p-6" dir="rtl">
		<h1 class="text-2xl font-bold">لوحة التحكم</h1>
		<p class="text-gray-600 mt-2">نظرة عامة سريعة على مؤشرات الأداء</p>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
			<div class="bg-white rounded shadow p-4">
				<div class="text-sm text-gray-500">إجمالي الطلبات</div>
				<div class="text-2xl font-semibold mt-2">{{ dashboard.meta?.total_orders ?? '-' }}</div>
			</div>

			<div class="bg-white rounded shadow p-4">
				<div class="text-sm text-gray-500">العملاء</div>
				<div class="text-2xl font-semibold mt-2">{{ dashboard.meta?.customers ?? '-' }}</div>
			</div>

			<div class="bg-white rounded shadow p-4">
				<div class="text-sm text-gray-500">المناديب النشطون</div>
				<div class="text-2xl font-semibold mt-2">{{ dashboard.meta?.active_riders ?? '-' }}</div>
			</div>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
			<div class="bg-white rounded shadow p-4">
				<div class="text-sm text-gray-500">إيرادات</div>
				<div class="mt-2">
					<div>اليوم: <span class="font-semibold">{{ formatCurrency(dashboard.revenue?.today) }}</span></div>
					<div class="text-sm text-gray-600">آخر 30 يوم: <span class="font-semibold">{{ formatCurrency(dashboard.revenue?.last_30_days) }}</span></div>
				</div>
			</div>

			<div class="bg-white rounded shadow p-4">
				<div class="text-sm text-gray-500">التسليمات المعلقة</div>
				<div class="text-2xl font-semibold mt-2">{{ dashboard.pending_deliveries ?? 0 }}</div>
			</div>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
			<div class="bg-white rounded shadow p-4 col-span-1 md:col-span-2">
				<h3 class="font-semibold">الطلبات الأخيرة</h3>
				<div v-if="!(dashboard.recent_orders || []).length" class="text-gray-500 text-sm mt-2">لا توجد طلبات مؤخراً</div>
				<ul v-else class="mt-2 space-y-2">
					<li v-for="o in dashboard.recent_orders" :key="o.id" class="border rounded p-2 flex justify-between items-center">
						<div>
							<div class="font-semibold">#{{ o.code ?? o.id }}</div>
							<div class="text-sm text-gray-600">{{ o.customer?.name ?? '-' }}</div>
						</div>
						<div class="text-sm text-gray-500">{{ formatDate(o.created_at) }}</div>
					</li>
				</ul>
			</div>

			<div class="bg-white rounded shadow p-4">
				<h3 class="font-semibold">المنتجات الأكثر مبيعاً</h3>
				<div v-if="!(dashboard.top_products || []).length" class="text-gray-500 text-sm mt-2">لا توجد بيانات</div>
				<ol v-else class="mt-2 list-decimal list-inside text-sm">
					<li v-for="p in dashboard.top_products" :key="p.id">{{ p.name }} <span class="text-gray-500">({{ p.sold ?? 0 }})</span></li>
				</ol>
			</div>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
			<div class="bg-white rounded shadow p-4">
				<h3 class="font-semibold">المنتجات منخفضة المخزون</h3>
				<div v-if="!(dashboard.low_stock || []).length" class="text-gray-500 text-sm mt-2">لا توجد منتجات منخفضة المخزون</div>
				<ul v-else class="mt-2 text-sm space-y-2">
					<li v-for="l in dashboard.low_stock" :key="l.id">{{ l.name }} — المتبقي: {{ l.quantity }}</li>
				</ul>
			</div>

			<div class="bg-white rounded shadow p-4">
				<h3 class="font-semibold">الطلبات حسب الحالة</h3>
				<div v-if="!(dashboard.orders_by_status || []).length" class="text-gray-500 text-sm mt-2">لا توجد بيانات</div>
				<ul v-else class="mt-2 text-sm space-y-2">
					<li v-for="s in dashboard.orders_by_status" :key="s.status">{{ s.status }} — {{ s.count }}</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { fetchDashboard } from '../api/dashboard'

const dashboard = ref<any>({})
const loading = ref(false)

const formatCurrency = (v?: any) => {
	if (v === null || v === undefined || v === '') return '-'
	const num = Number(v)
	if (Number.isNaN(num)) return String(v)
	return new Intl.NumberFormat('en-uk', { style: 'currency', currency: 'LYD' }).format(num)
}

const formatDate = (d?: string) => {
	if (!d) return '-'
	try { return new Date(d).toLocaleString('ar-SA') } catch (e) { return d }
}

const load = async () => {
	loading.value = true
	try {
		const res = await fetchDashboard()
		dashboard.value = res?.data ?? res ?? {}
	} catch (e) {
		console.error('Failed to load dashboard', e)
	} finally {
		loading.value = false
	}
}

onMounted(() => load())
</script>

<style scoped>
.text-right { text-align: right }
</style>
