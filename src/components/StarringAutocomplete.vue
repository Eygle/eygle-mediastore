<script setup lang="ts">
import { computed, defineProps, ref } from 'vue'
import { MediaGroupDto } from '@/dto/MediaGroupDto'
import { useApi } from '@/composables/api'
import { watchDebounced } from '@vueuse/core'

const { findMediaGroupsByName } = useApi()

const props = defineProps<{ modelValue: MediaGroupDto[] }>()
const emits = defineEmits(['update:modelValue'])

const search = ref('')
const loading = ref(false)
const items = ref<MediaGroupDto[]>([])

const model = computed({
  get: () => props.modelValue,
  set: (value) => emits('update:modelValue', value),
})

watchDebounced(
  search,
  async (to) => {
    if (!to) return
    loading.value = true
    items.value = (await findMediaGroupsByName(to)) || []
    loading.value = false
  },
  { debounce: 250 }
)
</script>

<template>
  <v-autocomplete
    v-model="model"
    v-model:search="search"
    :loading="loading"
    :items="items"
    label="Starring"
    multiple
    chips
    auto-select-first
    item-title="name"
    return-object />
</template>
