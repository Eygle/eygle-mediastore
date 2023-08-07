<script lang="ts" setup>
import { defineProps, ref, watch } from 'vue'
import { onClickOutside, watchDebounced } from '@vueuse/core'
import { TagDto } from '@/dto/TagDto'
import { useMediaGroupApi } from '@/composables/media-group-api'

const { findTagsByName } = useMediaGroupApi()

const props = defineProps<{ exclude: TagDto[] }>()
const emits = defineEmits<{ (e: 'addTag', value: string | TagDto): void }>()

const input = ref<string>('')
const list = ref()
const opened = ref(false)
const items = ref<TagDto[]>([])
const loading = ref(false)
const highlight = ref<number>(-1)

watchDebounced(input, () => searchTag(), { debounce: 250 })
watch(highlight, () => {
  if (highlight.value > 4) {
    const list = document.getElementById('list')
    if (list) {
      list.scrollTo({ top: 48 * (highlight.value - 4), behavior: 'smooth' })
    }
  }
})

onClickOutside(list, () => (opened.value = false))

async function searchTag() {
  if (!input.value || input.value.length < 2) return
  loading.value = true
  items.value = (await findTagsByName(input.value)).filter(
    ({ title }) => !props.exclude.find((tag) => tag.title === title)
  )
  highlight.value = items.value.length ? 0 : -1
  opened.value = !!items.value.length
  loading.value = false
}

function addTag(tag = null) {
  if (!tag && !input.value) return
  if (tag) {
    emits('addTag', tag)
  } else if (highlight.value > -1 && highlight.value < items.value.length) {
    emits('addTag', items.value[highlight.value])
  } else {
    emits('addTag', input.value.trim().toLocaleLowerCase())
  }
  input.value = ''
  items.value = []
  opened.value = false
  highlight.value = -1
}
</script>

<template>
  <v-form
    class="position-relative"
    @submit.prevent="addTag()"
    @keydown.prvent.down="highlight = Math.min(highlight + 1, items.length - 1)"
    @keydown.prevent.up="highlight = Math.max(highlight - 1, -1)">
    <v-text-field v-model="input" hide-details :loading="loading" @click="items.length && (opened = true)" />
    <v-list ref="list" id="list" v-if="opened" max-height="250" class="position-absolute" elevation="3" width="100%">
      <v-list-item
        v-for="(tag, idx) of items"
        :title="tag.title"
        :variant="highlight === idx ? 'tonal' : undefined"
        @click="addTag(tag)" />
    </v-list>
  </v-form>
</template>

<style scoped>
.v-list {
  z-index: 10;
}
</style>
