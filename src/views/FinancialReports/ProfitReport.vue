<script setup lang="ts">
import { ref, watch } from 'vue'
import { formatCurrency } from '../../utils/helpers'
import { getProfitReport } from '../../api/financialReports'
import { useAsyncData } from '../../composables/useAsyncData'

const date_from = ref<string>(new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0] as string)
const date_to = ref<string>(new Date().toISOString().split('T')[0] as string)

const { data: report, loading, error, execute } = useAsyncData(async () =>
  getProfitReport({ date_from: date_from.value, date_to: date_to.value })
)

watch([date_from, date_to], () => execute(), { immediate: true })
</script>

<template>
	<div class="p-6">
		<h1 class="text-2xl font-bold">تقرير الأرباح</h1>
		<p class="text-gray-600 mt-2">تحليل الأرباح والخسائر خلال فترة محددة.</p>

		<div class="mt-6 bg-white shadow rounded p-4">
			<div class="flex items-center justify-between">
				<h2 class="text-lg font-semibold">ملخص الأرباح</h2>
				<div class="flex items-center gap-4">
					<input type="date" v-model="date_from" class="border-gray-300 rounded-md" />
					<input type="date" v-model="date_to" class="border-gray-300 rounded-md" />
					<button @click="execute" class="px-4 py-2 bg-blue-600 text-white rounded-md">تحديث</button>
				</div>
			</div>

			<div v-if="loading" class="mt-4 text-center">
				<p>جاري تحميل التقرير...</p>
			</div>

			<div v-if="error" class="mt-4 text-center text-red-500">
				<p>{{ error }}</p>
			</div>

			<div v-if="report" class="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<div class="p-4 bg-gray-50 rounded-lg">
					<h3 class="text-sm font-medium text-gray-500">الفترة الزمنية</h3>
					<p class="mt-1 text-base font-semibold text-gray-900">{{ report.period.from }} - {{ report.period.to }}</p>
				</div>
				<div class="p-4 bg-gray-50 rounded-lg">
					<h3 class="text-sm font-medium text-gray-500">طريقة احتساب التكلفة</h3>
					<p class="mt-1 text-base font-semibold text-gray-900">{{ report.costing_method }}</p>
				</div>
				<div class="p-4 bg-gray-50 rounded-lg">
					<h3 class="text-sm font-medium text-gray-500">إجمالي المبيعات</h3>
					<p class="mt-1 text-3xl font-semibold text-gray-900">{{ formatCurrency(report.total_sales) }}</p>
				</div>
				<div class="p-4 bg-gray-50 rounded-lg">
					<h3 class="text-sm font-medium text-gray-500">تكلفة البضاعة المباعة</h3>
					<p class="mt-1 text-3xl font-semibold text-gray-900">{{ formatCurrency(report.cost_of_goods_sold) }}</p>
				</div>
				<div class="p-4 bg-gray-50 rounded-lg">
					<h3 class="text-sm font-medium text-gray-500">الربح التقديري</h3>
					<p class="mt-1 text-3xl font-semibold text-gray-900">{{ formatCurrency(report.estimated_profit) }}</p>
				</div>
				<div class="p-4 bg-gray-50 rounded-lg">
					<h3 class="text-sm font-medium text-gray-500">هامش الربح</h3>
					<p class="mt-1 text-3xl font-semibold text-gray-900">
						{{ typeof report.profit_margin === 'number' ? report.profit_margin.toFixed(2) : report.profit_margin }}%
					</p>
				</div>
			</div>
		</div>
	</div>
</template>
