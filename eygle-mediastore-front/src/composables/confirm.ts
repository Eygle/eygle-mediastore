import { reactive, ref } from 'vue'
import useToast from '@/composables/toast'

const opened = ref(false)
const options = reactive({ title: '', message: '' })
const callback = ref(() => (opened.value = false))

export default function useConfirm() {
  const { toastError } = useToast()

  function confirm(title: string, message: string, callbackFn: Function) {
    options.title = title
    options.message = message
    callback.value = callbackFn
    opened.value = true
  }

  async function confirmed() {
    try {
      await callback.value()
      opened.value = false
    } catch (e) {
      toastError()
      console.error(e)
    }
  }

  return { confirm, confirmed, opened, options }
}
