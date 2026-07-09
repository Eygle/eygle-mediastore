/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TITLE: string
  readonly VITE_API: string
  readonly VITE_ITEMS_PER_PAGE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
