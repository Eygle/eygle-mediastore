<script lang="ts" setup>
import { ref } from 'vue'
import { TagDto } from '@/dto/TagDto'
import { useApi } from '@/composables/api'

const props = defineProps<{ tags: TagDto[] }>()
const emits = defineEmits(['save'])

const { mergeTags } = useApi()

const opened = ref(false)
const selectedIdx = ref<number>(0)
const loading = ref(false)

async function save() {
  loading.value = true
  try {
    const selected = props.tags[selectedIdx.value].id
    const tags = props.tags.map(({ id }) => id).filter((id) => id !== selected)
    if (await mergeTags(selected, tags)) {
      opened.value = false
      emits('save')
    }
  } catch (e) {
    console.error(e)
  }
  loading.value = false
}
</script>

<template>
  <v-dialog v-model="opened" width="700" persistent>
    <template #activator="{ props }">
      <slot name="activator" :props="props" />
    </template>
    <v-card>
      <v-card-title>Merge tags</v-card-title>
      <v-card-text>
        <p class="text-caption text-grey mb-2">Select the one to merge into:</p>
        <v-chip-group v-model="selectedIdx" color="primary">
          <v-chip v-for="tag of tags" :key="tag.id" :text="tag.title" />
        </v-chip-group>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn text="Cancel" :disabled="loading" @click="opened = false" />
        <v-btn text="Save" color="primary" :loading="loading" @click="save()" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
