<template>
  <div class="p-6 bg-gray-50 min-h-screen" dir="rtl">
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold">الفئات (Categories)</h1>
          <p class="text-sm text-gray-500">عرض وإضافة الفئات</p>
        </div>
        <div class="flex items-center gap-3">
          <button @click="openModal" class="px-4 py-2 bg-blue-600 text-white rounded">إضافة فئة جديدة</button>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-4">
        <template v-if="loading">
          <div class="text-center py-8">جاري التحميل...</div>
        </template>

        <template v-else>
          <ul class="space-y-4">
            <li v-for="cat in categories" :key="cat.id" class="border rounded p-3">
              <div class="flex items-center justify-between">
                <div>
                  <div class="font-semibold">{{ cat.name }}</div>
                  <div class="text-sm text-gray-500">{{ cat.description }}</div>
                  <div class="text-xs text-gray-400 mt-1">Parent: {{ cat.parent?.name || '-' }}</div>
                </div>
                <div class="text-right">
                  <div class="text-sm">{{ cat.children?.length || 0 }} children</div>
                </div>
              </div>
            </li>
          </ul>
        </template>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="show" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg w-full max-w-md p-6 mx-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium">إضافة فئة جديدة</h3>
          <button @click="closeModal" class="text-gray-600">×</button>
        </div>

        <form @submit.prevent="submit" class="space-y-3">
          <div>
            <label class="block text-sm text-gray-700">الاسم</label>
            <input v-model="form.name" required class="w-full px-3 py-2 border rounded" />
          </div>

          <div>
            <label class="block text-sm text-gray-700">الوصف</label>
            <textarea v-model="form.description" class="w-full px-3 py-2 border rounded" rows="3"></textarea>
          </div>

          <div>
            <label class="block text-sm text-gray-700">الفئة الرئيسية (اختياري)</label>
            <select v-model="form.parent_id" class="w-full px-3 py-2 border rounded">
              <option :value="null">بدون</option>
              <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
          </div>

          <div class="flex items-center gap-3">
            <label class="inline-flex items-center gap-2">
              <input type="checkbox" v-model="form.is_active" />
              <span class="text-sm">نشط</span>
            </label>
          </div>

          <div class="flex justify-end gap-2 pt-2">
            <button type="button" @click="closeModal" class="px-4 py-2 rounded border">إلغاء</button>
            <button type="submit" class="px-4 py-2 rounded bg-blue-600 text-white">حفظ</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { fetchCategories, createCategory } from '../../api/categories'
import type { Category } from '../../api/categories'

const categories = ref<Category[]>([])
const loading = ref(false)
const show = ref(false)

const form = ref({ name: '', description: '', parent_id: null as number | null, is_active: true })

const load = async () => {
  loading.value = true
  try {
    const res = await fetchCategories()
    // normalize: API returns { data: [...] }
    categories.value = res?.data || []
  } catch (e) {
    console.error('Failed to fetch categories', e)
  } finally {
    loading.value = false
  }
}

onMounted(load)

const openModal = () => {
  form.value = { name: '', description: '', parent_id: null, is_active: true }
  show.value = true
}
const closeModal = () => { show.value = false }

const submit = async () => {
  try {
    const payload = { ...form.value }
    await createCategory(payload)
    closeModal()
    await load()
    alert('تم إضافة الفئة')
  } catch (e) {
    console.error('Create category failed', e)
    alert('فشل إضافة الفئة')
  }
}
</script>

<style scoped>
/* minimal local styles; layout uses Tailwind */
</style>
