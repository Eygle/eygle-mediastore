<script lang="ts" setup>
import { computed, defineProps, ref } from 'vue'
import { watchDebounced } from '@vueuse/core'
import { TagDto } from '@/dto/TagDto'
import { useApi } from '@/composables/api'
import { plainToInstance } from 'class-transformer'

const { findTagsByName } = useApi()

const props = defineProps<{ modelValue: TagDto[]; input: string; autofocus?: boolean }>()
const emits = defineEmits<{
  (e: 'update:modelValue', value: TagDto[]): void
  (e: 'update:input', value: string): void
}>()

const items = ref<TagDto[]>([])
const loading = ref(false)

const search = computed({
  get: () => props.input,
  set: (value) => emits('update:input', value ?? ''),
})

const tags = computed({
  get: () => props.modelValue,
  set: (value: (TagDto | string)[]) => {
    const tags: TagDto[] = []
    for (const entry of value) {
      const tag = typeof entry === 'string' ? toTag(entry) : entry
      if (tag?.title && !tags.find(({ title }) => title === tag.title)) {
        tags.push(tag)
      }
    }
    emits('update:modelValue', tags)
  },
})

watchDebounced(search, () => searchTags(), { debounce: 250 })

function toTag(input: string): TagDto | null {
  const title = input.trim().toLocaleLowerCase()
  if (!title) return null
  return items.value.find((tag) => tag.title === title) ?? plainToInstance(TagDto, { title })
}

function compareTags(a?: TagDto | string, b?: TagDto | string) {
  const titleA = typeof a === 'string' ? a : a?.title
  const titleB = typeof b === 'string' ? b : b?.title
  return !!titleA && titleA === titleB
}

async function searchTags() {
  if (!search.value || search.value.length < 2) return
  loading.value = true
  items.value = await findTagsByName(search.value)
  loading.value = false
}
</script>

<template>
  <v-combobox
    v-model="tags"
    v-model:search="search"
    :items="items"
    :loading="loading"
    :autofocus="autofocus"
    :value-comparator="compareTags"
    label="Add tag"
    item-title="title"
    item-value="title"
    return-object
    multiple
    chips
    closable-chips
    hide-details
    hide-no-data
    no-filter />
</template>
