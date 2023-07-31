import { computed, ref } from 'vue'

const opened = ref(false)
const message = ref<string | null>(null)
const color = ref<'success' | 'error'>('success')

export default function useToast() {
  const toastSuccess = (msg: string) => {
    color.value = 'success'
    message.value = msg
    opened.value = true
  }

  const toastError = (msg = 'An error occurred') => {
    color.value = 'error'
    message.value = msg
    opened.value = true
  }

  return {
    toastSuccess,
    toastError,
    opened,
    message: computed(() => message.value),
    color: computed(() => color.value)
  }
}
