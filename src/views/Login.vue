<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50">
    <div class="w-full max-w-md bg-white p-8 rounded-lg shadow">
      <h1 class="text-2xl font-bold mb-4">تسجيل الدخول</h1>

      <form @submit.prevent="submit" class="space-y-4">
        <div>
          <label class="block text-sm mb-1">البريد الإلكتروني</label>
          <input v-model="email" type="email" required class="w-full border px-3 py-2 rounded" />
        </div>

        <div>
          <label class="block text-sm mb-1">كلمة المرور</label>
          <input v-model="password" type="password" required class="w-full border px-3 py-2 rounded" />
        </div>

        <div v-if="error" class="text-red-600 text-sm">{{ error }}</div>

        <div class="flex items-center justify-between">
          <button :disabled="loading" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            {{ loading ? 'جارٍ...' : 'دخول' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../store'

const email = ref('admin@sales-system.com')
const password = ref('password')
const error = ref<string | null>(null)

const router = useRouter()
const { login } = useAuth()

const loading = ref(false)

async function submit() {
  error.value = null
  loading.value = true
  try {
    await login(email.value, password.value)
    // redirect to dashboard
    router.push({ name: 'Dashboard' })
  } catch (e: any) {
    error.value = e?.message || 'حصل خطأ أثناء تسجيل الدخول'
  } finally {
    loading.value = false
  }
}
</script>
