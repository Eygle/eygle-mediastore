<script lang="ts" setup>
import { computed, defineProps, ref, watch } from 'vue'
import { MediaDto } from '@/dto/MediaDto'
import { MediaGroupDto } from '@/dto/MediaGroupDto'
import TagsAutocomplete from '@/components/TagsAutocomplete.vue'
import { useApi } from '@/composables/api'

const { updateMediaTags, updateMediaGroupTags } = useApi()

const props = defineProps<{ parent: MediaDto | MediaGroupDto }>()

const opened = ref(false)
const loading = ref(false)
const tags = ref([...props.parent.tags])

const addedTags = computed(() =>
  tags.value.filter(({ title }) => !props.parent.tags.find((tag) => tag.title === title))
)

const deletedTags = computed(() =>
  props.parent.tags.filter(({ title }) => !tags.value.find((tag) => tag.title === title))
)

async function save() {
  loading.value = true
  try {
    let res
    if (props.parent instanceof MediaGroupDto) {
      res = await updateMediaGroupTags(props.parent, tags.value)
    } else {
      res = await updateMediaTags(props.parent, tags.value)
    }

    if (res) {
      props.parent.tags = res.tags
      opened.value = false
    }
  } catch (e) {
    console.error(e)
  }
  loading.value = false
}

watch(opened, () => (tags.value = [...props.parent.tags]))
</script>

<template>
  <v-dialog v-model="opened" persistent width="500">
    <template #activator="{ props }">
      <v-btn icon="mdi-plus" variant="text" density="compact" v-bind="props" @click.prevent.stop />
    </template>

    <v-card>
      <v-card-title>Manage tags</v-card-title>
      <v-card-text>
        <p class="mb-4">{{ parent.title || parent.name }}</p>
        <TagsAutocomplete :exclude="tags" autofocus @add-tag="(tag) => tags.push(tag)" class="mb-4" />

        <v-chip v-for="(tag, idx) of tags" class="mr-2 mb-2">
          {{ tag.title }}
          <v-icon icon="mdi-close-circle ml-1 mr-n1" size="18" @click="tags.splice(idx, 1)" />
        </v-chip>

        <div v-if="addedTags.length" class="mt-4">
          <h2 class="mb-2">Added tags</h2>
          <v-chip v-for="tag in addedTags" color="green-lighten-2" class="mr-2 mb-2">
            {{ tag.title }}
          </v-chip>
        </div>
        <div v-if="deletedTags.length" class="mt-4">
          <h2 class="mb-2">Deleted tags</h2>
          <v-chip v-for="tag in deletedTags" color="red-lighten-2" class="mr-2 mb-2">
            {{ tag.title }}
          </v-chip>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" text="Cancel" :disabled="loading" @click="opened = false" />
        <v-btn variant="text" text="Save" color="primary" :loading="loading" @click="save" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
