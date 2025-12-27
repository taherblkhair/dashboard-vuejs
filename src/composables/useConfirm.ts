import { ref } from 'vue'

interface ConfirmOptions {
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info'
}

const state = ref({
  isOpen: false,
  title: '',
  message: '',
  confirmText: 'تأكيد',
  cancelText: 'إلغاء',
  type: 'info' as 'danger' | 'warning' | 'info',
  resolve: null as ((value: boolean) => void) | null
})

export function useConfirm() {
  const confirm = (messageOrOptions: string | ConfirmOptions): Promise<boolean> => {
    let options: ConfirmOptions
    
    if (typeof messageOrOptions === 'string') {
      options = { message: messageOrOptions }
    } else {
      options = messageOrOptions
    }

    state.value = {
      isOpen: true,
      title: options.title || 'تأكيد',
      message: options.message,
      confirmText: options.confirmText || 'تأكيد',
      cancelText: options.cancelText || 'إلغاء',
      type: options.type || 'info',
      resolve: null
    }

    return new Promise((resolve) => {
      state.value.resolve = resolve
    })
  }

  const handleConfirm = () => {
    if (state.value.resolve) state.value.resolve(true)
    state.value.isOpen = false
  }

  const handleCancel = () => {
    if (state.value.resolve) state.value.resolve(false)
    state.value.isOpen = false
  }

  return {
    state,
    confirm,
    handleConfirm,
    handleCancel
  }
}
