import 'vue-router'
import { Field } from '@/types/Field'

declare module 'vue-router' {
  interface RouteMeta {
    navbar?: boolean
    icon?: string
    title?: string
    field?: Field
    taggableParent?: true
  }
}
