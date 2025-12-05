import { updateRiderLocation as apiUpdateRiderLocation } from '../api/riders'
import { ridersStore } from '../store/riders'

export async function updateRiderLocationOptimistic(id: number, current_location: string) {
  const idx = ridersStore.value.findIndex(r => Number(r.id) === Number(id))
  const previous = idx !== -1 ? ridersStore.value[idx].current_location : undefined

  // optimistic update
  if (idx !== -1) {
    ridersStore.value[idx] = { ...ridersStore.value[idx], current_location }
  }

  try {
    const res = await apiUpdateRiderLocation(id, { current_location })
    // if API returns updated item, merge it
    const updated = res?.data?.data ?? res?.data ?? null
    if (updated && idx !== -1) ridersStore.value[idx] = { ...ridersStore.value[idx], ...updated }
    return res
  } catch (err) {
    // revert optimistic update
    if (idx !== -1) ridersStore.value[idx] = { ...ridersStore.value[idx], current_location: previous }
    throw err
  }
}

export default {
  updateRiderLocationOptimistic,
}
