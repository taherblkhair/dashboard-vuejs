import { ref } from 'vue'

type ToastType = 'success' | 'error' | 'warning' | 'info'
type Toast = { id: number; message: string; type?: ToastType }

const toasts = ref<Toast[]>([])
let nextId = 1

export function useToast() {
  const addToast = (message: string, type: ToastType = 'success') => {
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
