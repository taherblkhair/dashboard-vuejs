import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchRiders } from '../api/riders'

export const useRidersStore = defineStore('riders', () => {
  const riders = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const currentPage = ref(1)
  const lastPage = ref(1)
  const total = ref(0)

  async function load(page = 1) {
    loading.value = true
    error.value = null
    try {
      const res = await fetchRiders(page)
      riders.value = res.data ?? res
      if (res.meta) {
        currentPage.value = res.meta.current_page
        lastPage.value = res.meta.last_page
        total.value = res.meta.total
      }
    } catch (e: any) {
      error.value = e.message || 'Failed to load riders'
    } finally {
      loading.value = false
    }
  }

  return { riders, loading, error, currentPage, lastPage, total, load }
})
