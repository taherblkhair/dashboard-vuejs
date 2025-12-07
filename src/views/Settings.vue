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

				<div class="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
					<!-- Quick link cards (polished) -->
					<template v-for="link in quickLinks" :key="link.key">
						<router-link
							v-if="link.exists"
							:to="{ name: link.name }"
							class="group block bg-white border rounded-lg p-4 text-center rtl shadow-sm hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
							:aria-label="`فتح ${link.label}`">
							<div class="flex flex-col items-center gap-2">
								<div class="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-100">
									<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
										<path :d="link.icon" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
									</svg>
								</div>
								<div class="text-sm font-semibold text-slate-800">{{ link.label }}</div>
								<div class="text-xs text-gray-500">{{ link.sub || '' }}</div>
							</div>
						</router-link>

						<div v-else class="block bg-gray-50 border border-dashed rounded-lg p-4 text-center opacity-70">
							<div class="flex flex-col items-center gap-2">
								<div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
									<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
										<path d="M12 4v16m8-8H4" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
									</svg>
								</div>
								<div class="text-sm font-semibold text-slate-700">{{ link.label }}</div>
								<div class="text-xs text-gray-400">قادم</div>
							</div>
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
	icon?: string
	exists: boolean
}

const quickLinks = reactive<QuickLink[]>([
	{ key: 'addresses', label: 'العناوين', name: 'Addresses', sub: 'إدارة العناوين', icon: 'M3 10h4l3 8 4-16 3 8h4', exists: false },
	{ key: 'cities', label: 'المدن', name: 'Cities', sub: 'قائمة المدن', icon: 'M3 7h18M12 3v4M5 21h14a2 2 0 002-2V7H3v12a2 2 0 002 2z', exists: false },
	{ key: 'products', label: 'المنتجات', name: 'Products', sub: 'قائمة المنتجات', icon: 'M3 3v18h18V3H3zm9 14l7-4V7l-7 4-7-4v6l7 4z', exists: false },
	{ key: 'orders', label: 'الطلبات', name: 'Orders', sub: 'قائمة الطلبات', icon: 'M3 3h18v2H3V3zm2 4h14v14H5V7z', exists: false },
	{ key: 'customers', label: 'العملاء', name: 'Customers', sub: 'قائمة العملاء', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M7 20v-2a5 5 0 0110 0v2', exists: false },
	{ key: 'warehouses', label: 'المستودعات', name: 'Warehouses', sub: 'المستودعات', icon: 'M3 7l9-4 9 4v10l-9 4-9-4V7z', exists: false },
	{ key: 'reports', label: 'التقارير', name: 'Reports', sub: 'تقارير ومقاييس', icon: 'M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6', exists: false },
	{ key: 'deliveries', label: 'التوصيلات', name: 'Deliveries', sub: 'إدارة التوصيل', icon: 'M3 10h18M5 6h14l1 4H4l1-4z', exists: false },
	{ key: 'riders', label: 'دراجين', name: 'Riders', sub: 'قائمة الدراجين', icon: 'M5 12h14M12 6v6', exists: false },
	{ key: 'users', label: 'المستخدمون', name: 'Users', sub: 'إدارة المستخدمين', icon: 'M12 14a4 4 0 100-8 4 4 0 000 8z', exists: false }
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
