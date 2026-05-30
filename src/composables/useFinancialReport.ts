import { ref } from 'vue'
import { request } from '../api/index'

export function useFinancialReport(endpoint: string) {
  const data = ref<unknown>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const startDate = ref('')
  const endDate = ref('')

  async function load() {
    if (!startDate.value || !endDate.value) return
    loading.value = true
    error.value = null
    try {
      const query = new URLSearchParams({
        start_date: startDate.value,
        end_date: endDate.value,
      })
      data.value = await request(`${endpoint}?${query}`)
    } catch (e: any) {
      error.value = e.message || 'Failed to load report'
    } finally {
      loading.value = false
    }
  }

  return { data, loading, error, startDate, endDate, load }
}
