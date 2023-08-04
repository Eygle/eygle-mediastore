<script lang="ts" setup>
import { defineProps, ref, watch } from 'vue'
import { MediaDto } from '@/dto/MediaDto'
import { MediaGroupDto } from '@/dto/MediaGroupDto'
import TagChips from '@/components/commons/TagChips.vue'
import { plainToInstance } from 'class-transformer'
import { TagDto } from '@/dto/TagDto'
import { watchDebounced } from '@vueuse/core'
import { useMediaGroupApi } from '@/composables/media-group-api'

const { findTagsByName } = useMediaGroupApi()

const props = defineProps<{ parent: MediaDto | MediaGroupDto }>()

const opened = ref(false)
const tags = ref([...props.parent.tags])
const formTag = ref<string | TagDto>('')
const items = ref<TagDto[]>([])
const loading = ref(false)

function isString(data: TagDto | string): data is string {
  return !(data instanceof TagDto)
}

function addTag() {
  if (formTag.value instanceof TagDto) {
    tags.value.push(formTag.value)
  } else {
    tags.value.push(plainToInstance(TagDto, { title: formTag.value }))
  }
  formTag.value = ''
}

async function searchTag() {
  if (!formTag.value || !isString(formTag.value) || formTag.value?.length < 2) return
  loading.value = true
  items.value = await findTagsByName(formTag.value)
  loading.value = false
}

function save() {}

watch(opened, () => (tags.value = [...props.parent.tags]))
watchDebounced(formTag, () => searchTag(), { debounce: 250 })
</script>

<template>
  <v-dialog v-model="opened" persistent width="500">
    <template #activator="{ props }">
      <v-btn icon="mdi-plus" variant="text" density="compact" v-bind="props" @click.prevent.stop />
    </template>

    <v-card>
      <v-card-title>Manage tags</v-card-title>
      <v-card-text>
        <v-form @keydown.enter="addTag">
          <v-combobox
            v-model="formTag"
            :loading="loading"
            label="Add tag"
            :items="items"
            item-title="title"
            item-value="id"
            hide-no-data
            @select="console.log('on select')" />
        </v-form>
        <TagChips :parent="parent" :tags="tags" editable />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" text="Cancel" @click="opened = false" />
        <v-btn variant="text" text="Save" color="primary" @click="save" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
