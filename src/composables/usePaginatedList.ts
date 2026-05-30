import { ref } from 'vue'
import { parsePaginated, type PaginationMeta } from '../api/index'

export function usePaginatedList<T>(
  fetcher: (params: Record<string, any>) => Promise<unknown>
) {
  const items = ref<T[]>([])
  const meta = ref<PaginationMeta>({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  })
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filters = ref<Record<string, any>>({})

  async function load(page = 1) {
    loading.value = true
    error.value = null
    try {
      const response = await fetcher({ ...filters.value, page })
      const parsed = parsePaginated<T>(response)
      items.value = parsed.data
      meta.value = parsed.meta
    } catch (e: any) {
      error.value = e.message || 'Failed to load data'
    } finally {
      loading.value = false
    }
  }

  function setFilters(next: Record<string, any>) {
    filters.value = next
  }

  return { items, meta, loading, error, filters, load, setFilters }
}
