import { ref } from 'vue'

type Toast = { id: number; message: string; type?: 'success' | 'error' }

const toasts = ref<Toast[]>([])
let nextId = 1

export function useToast() {
  const addToast = (message: string, type: 'success' | 'error' = 'success') => {
    const id = nextId++
    toasts.value.unshift({ id, message, type })
    // auto-remove after 4s
    setTimeout(() => {
      removeToast(id)
    }, 4000)
  }

  const removeToast = (id: number) => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  return { toasts, addToast, removeToast }
}

export default useToast
