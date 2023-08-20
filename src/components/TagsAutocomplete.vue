<script lang="ts" setup>
import { defineProps, reactive, ref, watch } from 'vue'
import { onClickOutside, watchDebounced } from '@vueuse/core'
import { TagDto } from '@/dto/TagDto'
import { useApi } from '@/composables/api'
import { plainToInstance } from 'class-transformer'

const { findTagsByName } = useApi()

const props = defineProps<{ exclude: TagDto[]; autofocus?: boolean }>()
const emits = defineEmits<{ (e: 'addTag', value: TagDto): void }>()

const input = ref<string>('')
const list = ref<HTMLElement>()
const textField = ref<HTMLElement>()
const opened = ref(false)
const items = ref<TagDto[]>([])
const loading = ref(false)
const highlight = ref<number>(-1)
const listStyles = reactive({ top: '', left: '', width: '', zIndex: 10000})

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
  open()
  loading.value = false
}

function addTag(tag = null) {
  if (!tag && !input.value) return
  if (tag) {
    emits('addTag', tag)
  } else if (highlight.value > -1 && highlight.value < items.value.length) {
    emits('addTag', items.value[highlight.value])
  } else {
    emits('addTag', plainToInstance(TagDto, { title: input.value.trim().toLocaleLowerCase() }))
  }
  input.value = ''
  items.value = []
  opened.value = false
  highlight.value = -1
}

function open() {
  if (!items.value.length) return
  opened.value = true
  const parentBound = textField.value!.getBoundingClientRect()
  listStyles.top = `${parentBound.top + 30}px`
  listStyles.left = `${parentBound.left - 16}px`
  listStyles.width = `${parentBound.width + 32}px`
}
</script>

<template>
  <v-form
    class="position-relative"
    @submit.prevent="addTag()"
    @keydown.prvent.down="highlight = Math.min(highlight + 1, items.length - 1)"
    @keydown.prevent.up="highlight = Math.max(highlight - 1, -1)">
    <v-text-field
      v-model="input"
      ref="textField"
      label="Add tag"
      hide-details
      :loading="loading"
      :autofocus="autofocus"
      @click="open()" />
    <teleport v-if="opened" to="body">
      <v-list ref="list" id="list" max-height="250" class="position-fixed" elevation="3" width="100%" :style="listStyles">
        <v-list-item
          v-for="(tag, idx) of items"
          :title="tag.title"
          :variant="highlight === idx ? 'tonal' : undefined"
          @click="addTag(tag)" />
      </v-list>
    </teleport>
  </v-form>
</template>
