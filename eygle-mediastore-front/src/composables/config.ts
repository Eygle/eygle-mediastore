export function useConfig() {
  return {
    title: import.meta.env.VITE_TITLE,
    api: import.meta.env.VITE_API,
    itemsPerPage: Number(import.meta.env.VITE_ITEMS_PER_PAGE),
  }
}
