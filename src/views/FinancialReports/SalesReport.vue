<template>
	<div class="p-6">
		<h1 class="text-2xl font-bold">تقرير المبيعات</h1>
		<p class="text-gray-600 mt-2">تحليل المبيعات خلال فترة محددة.</p>

		<div class="mt-6 bg-white shadow rounded p-4">
			<div class="flex items-center justify-between">
				<h2 class="text-lg font-semibold">ملخص المبيعات</h2>
				<div class="flex items-center gap-4">
					<input type="date" v-model="date_from" class="border-gray-300 rounded-md" />
					<input type="date" v-model="date_to" class="border-gray-300 rounded-md" />
					<button @click="fetchReport" class="px-4 py-2 bg-blue-600 text-white rounded-md">تحديث</button>
				</div>
			</div>

			<div v-if="loading" class="mt-4 text-center">
				<p>جاري تحميل التقرير...</p>
			</div>

			<div v-if="error" class="mt-4 text-center text-red-500">
				<p>{{ error }}</p>
			</div>

			<div v-if="report" class="mt-4">
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
					<div class="p-4 bg-gray-50 rounded-lg">
						<h3 class="text-sm font-medium text-gray-500">إجمالي المبيعات</h3>
						<p class="mt-1 text-3xl font-semibold text-gray-900">{{ formatCurrency(report.total_sales) }}</p>
					</div>
					<div class="p-4 bg-gray-50 rounded-lg">
						<h3 class="text-sm font-medium text-gray-500">عدد الطلبات</h3>
						<p class="mt-1 text-3xl font-semibold text-gray-900">{{ report.orders_count }}</p>
					</div>
					<div class="p-4 bg-gray-50 rounded-lg">
						<h3 class="text-sm font-medium text-gray-500">المجموع الفرعي</h3>
						<p class="mt-1 text-3xl font-semibold text-gray-900">{{ formatCurrency(report.subtotal) }}</p>
					</div>
					<div class="p-4 bg-gray-50 rounded-lg">
						<h3 class="text-sm font-medium text-gray-500">الخصومات</h3>
						<p class="mt-1 text-3xl font-semibold text-gray-900">{{ formatCurrency(report.discounts) }}</p>
					</div>
					<div class="p-4 bg-gray-50 rounded-lg">
						<h3 class="text-sm font-medium text-gray-500">الشحن</h3>
						<p class="mt-1 text-3xl font-semibold text-gray-900">{{ formatCurrency(report.shipping) }}</p>
					</div>
				</div>

				<h3 class="text-lg font-semibold mb-2">تفصيل المبيعات اليومي</h3>
				<table class="min-w-full divide-y divide-gray-200">
					<thead class="bg-gray-50">
						<tr>
							<th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">التاريخ</th>
							<th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">إجمالي المبيعات</th>
							<th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">عدد الطلبات</th>
						</tr>
					</thead>
					<tbody class="bg-white divide-y divide-gray-200">
						<tr v-for="day in report.daily_breakdown" :key="day.date">
							<td class="px-6 py-4 whitespace-nowrap">{{ day.date }}</td>
							<td class="px-6 py-4 whitespace-nowrap">{{ formatCurrency(day.total) }}</td>
							<td class="px-6 py-4 whitespace-nowrap">{{ day.orders_count }}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getSalesReport } from '../../api/financialReports'
import { formatCurrency } from '../../utils/helpers'


const date_from = ref(new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0])
const date_to = ref(new Date().toISOString().split('T')[0])
const report = ref<any>(null)
const loading = ref(false)
const error = ref<string | null>(null)

const fetchReport = async () => {
	loading.value = true
	error.value = null
	try {
		const res = await getSalesReport({
			date_from: date_from.value,
			date_to: date_to.value
		})
		report.value = res
	} catch (err: any) {
		error.value = 'فشل تحميل التقرير: ' + err.message
	} finally {
		loading.value = false
	}
}

onMounted(fetchReport)
</script>
