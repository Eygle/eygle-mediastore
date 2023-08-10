import { ref } from 'vue'

const cached = ref<Record<string, unknown>>({})

export function useCache() {
  async function getCached<T>(key: string, fetch: () => Promise<T>, forceRefresh = false) {
    if (forceRefresh || !cached.value[key]) {
      cached.value[key] = await fetch()
    }

    return cached.value[key]
  }
  return { getCached }
}
