<template>
	<div class="p-6">
		<h1 class="text-2xl font-bold">الإعدادات</h1>
		<p class="text-gray-600 mt-2">روابط وصول سريع للصفحات الشائعة داخل لوحة التحكم</p>

		<section class="mt-6">
			<div class="bg-white shadow rounded p-4">
				<div class="flex items-center justify-between">
					<h2 class="text-lg font-semibold">وصول سريع</h2>
					<p class="text-sm text-gray-500">انقر للوصول إلى الصفحة</p>
				</div>

				<div class="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
					<!-- Quick link cards -->
					<template v-for="link in quickLinks" :key="link.key">
						<router-link v-if="link.exists" :to="{ name: link.name }" class="block bg-slate-50 hover:bg-slate-100 border rounded p-3 text-center rtl">
							<div class="text-sm font-medium">{{ link.label }}</div>
							<div class="text-xs text-gray-500 mt-1">{{ link.sub || '' }}</div>
						</router-link>

						<div v-else class="block bg-gray-100 border border-dashed rounded p-3 text-center opacity-60">
							<div class="text-sm font-medium">{{ link.label }}</div>
							<div class="text-xs text-gray-500 mt-1">قادم</div>
						</div>
					</template>
				</div>
			</div>
		</section>
	</div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { reactive, onMounted } from 'vue'

const router = useRouter()

type QuickLink = {
	key: string
	label: string
	name?: string
	sub?: string
	exists: boolean
}

const quickLinks = reactive<QuickLink[]>([
	{ key: 'addresses', label: 'العناوين', name: 'Addresses', sub: 'إدارة العناوين', exists: false },
	{ key: 'cities', label: 'المدن', name: 'Cities', sub: 'قائمة المدن', exists: false },
	{ key: 'products', label: 'المنتجات', name: 'Products', sub: 'قائمة المنتجات', exists: false },
	{ key: 'orders', label: 'الطلبات', name: 'Orders', sub: 'قائمة الطلبات', exists: false },
	{ key: 'customers', label: 'العملاء', name: 'Customers', sub: 'قائمة العملاء', exists: false },
	{ key: 'warehouses', label: 'المستودعات', name: 'Warehouses', sub: 'المستودعات', exists: false },
	{ key: 'reports', label: 'التقارير', name: 'Reports', sub: 'تقارير المبيعات والمخزون', exists: false },
	{ key: 'deliveries', label: 'التوصيلات', name: 'Deliveries', sub: 'إدارة التوصيلات', exists: false },
	{ key: 'riders', label: 'دراجين', name: 'Riders', sub: 'قائمة الدراجين', exists: false },
	{ key: 'users', label: 'المستخدمون', name: 'Users', sub: 'إدارة المستخدمين', exists: false }
])

onMounted(() => {
	// Mark which named routes actually exist to avoid linking to missing pages
	quickLinks.forEach((l) => {
		if (l.name && router.hasRoute(l.name)) {
			l.exists = true
		} else {
			l.exists = false
		}
	})
})

// (no extra helpers required)

</script>

<style scoped>
</style>
