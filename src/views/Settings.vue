<template>
	<div class="p-6">
		<h1 class="text-2xl font-bold">الإعدادات</h1>
		<p class="text-gray-600 mt-2">صفحة الإعدادات (قالب مؤقت)</p>
		<!-- صفحة العناوين والإعدادات العامة -->
		 <div class="flex flex-col gap-4">
			<button @click="gotoAddressPage" class="px-4 py-2 bg-blue-600 text-white rounded w-48 text-center">إدارة العناوين</button>
		 </div>
	</div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
// إعدادات الصفحة يمكن إضافتها هنا لاحقًا
	const gotoAddressPage = () => {
		router.push({ name: 'Addresses' })
	}

</script>

<style scoped>
</style>
