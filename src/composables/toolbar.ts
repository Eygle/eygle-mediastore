import { computed, ref } from 'vue'

type Toolbar = {
  title?: string | null
  count?: number | null
}

const toolbar = ref<Toolbar>({ title: null, count: null })

export function useToolbar() {
  const resetToolbar = (title?: string) => (toolbar.value = { title, count: null as number })

  const setToolbarTitle = (title: string) => (toolbar.value.title = title)

  const setToolbarCount = (count: number) => (toolbar.value.count = count)

  return {
    toolbar: computed(() => toolbar.value),
    resetToolbar,
    setToolbarTitle,
    setToolbarCount,
  }
}
