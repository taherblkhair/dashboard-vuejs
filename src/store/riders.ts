import { ref } from 'vue'
import { fetchRiders } from '../api/riders'

export const ridersStore = ref<any[]>([])
export const ridersMeta = ref<any>(null)

export async function loadRiders(page = 1, params: Record<string, any> = {}) {
  const res = await fetchRiders(page, params)
  const d = res?.data?.data ?? res?.data ?? []
  const m = res?.data?.meta ?? res?.meta ?? null
  if (page === 1) ridersStore.value = d
  else ridersStore.value.push(...d)
  ridersMeta.value = m
  return { data: d, meta: m }
}

export function updateRiderLocationInStore(id: number, current_location: string) {
  const idx = ridersStore.value.findIndex((r: any) => Number(r.id) === Number(id))
  if (idx !== -1) {
    ridersStore.value[idx] = { ...ridersStore.value[idx], current_location }
  }
}
