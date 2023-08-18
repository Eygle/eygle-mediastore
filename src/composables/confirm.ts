import { reactive, ref } from 'vue'

const opened = ref(false)
const options = reactive({ title: '', message: '' })
const callback = ref(() => (opened.value = false))

export default function useConfirm() {
  function confirm(title: string, message: string, callbackFn: Function) {
    console.log('inside confirm')
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
      console.error(e)
    }
  }

  return { confirm, confirmed, opened, options }
}
