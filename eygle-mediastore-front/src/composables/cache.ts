import { ref } from 'vue'

const cached = ref<Record<string | symbol, unknown>>({})

export function useCache() {
  async function getCached<T>(key: string | symbol, fetch: () => Promise<T>, forceRefresh = false): Promise<T> {
    if (forceRefresh || !cached.value[key]) {
      cached.value[key] = await fetch()
    }

    return cached.value[key] as T
  }

  function drop(key: string | symbol) {
    delete cached.value[key]
  }

  return { getCached, drop }
}
