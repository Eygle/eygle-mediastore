import { computed, ref } from 'vue'

const opened = ref(false)
const message = ref<string | null>(null)
const color = ref<'success' | 'error'>('success')
const timeout = ref(5000)

export default function useToast() {
  const toastSuccess = (msg: string) => {
    color.value = 'success'
    message.value = msg
    opened.value = true
    timeout.value = 3000
  }

  const toastError = (msg = 'An error occurred') => {
    color.value = 'error'
    message.value = msg
    opened.value = true
    timeout.value = 5000
  }

  return {
    toastSuccess,
    toastError,
    opened,
    message: computed(() => message.value),
    color: computed(() => color.value),
    timeout
  }
}
