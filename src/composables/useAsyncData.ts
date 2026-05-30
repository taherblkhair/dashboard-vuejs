import { ref, type Ref } from 'vue'

export function useAsyncData<T>(fetcher: () => Promise<T>) {
  const data = ref<T | null>(null) as Ref<T | null>
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function execute() {
    loading.value = true
    error.value = null
    try {
      data.value = await fetcher()
    } catch (e: any) {
      error.value = e.message || 'An error occurred'
    } finally {
      loading.value = false
    }
  }

  return { data, loading, error, execute }
}
