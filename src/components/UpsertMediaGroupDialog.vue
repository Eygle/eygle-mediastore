<script lang="ts" setup>
import { computed, defineProps, ref, watch } from 'vue'
import { instanceToInstance, plainToInstance } from 'class-transformer'
import { MediaGroupDto } from '@/dto/MediaGroupDto'
import { Field } from '@/types/Field'
import TagsAutocomplete from '@/components/TagsAutocomplete.vue'
import { useApi } from '@/composables/api'
import { useDialogs } from '@/composables/dialogs'

const { createMediaGroup, updateMediaGroup } = useApi()
const { upsertMediaGroupDialogOpened: opened, mediaGroup: source } = useDialogs()

const props = defineProps<{ field?: Field }>()
const emits = defineEmits(['saved'])

const fieldsOptions = Object.entries(Field).map(([title, value]) => ({ title, value }))
const loading = ref(false)
const form = ref(initForm())

watch(source, () => (form.value = initForm()), { deep: true })

async function save() {
  try {
    loading.value = true
    const res = await (source.value ? updateMediaGroup(form.value) : createMediaGroup(form.value))
    emits('saved', res)
    loading.value = false
    opened.value = false
  } catch (e) {
    console.error(e)
  }
}

function initForm(): MediaGroupDto {
  return source.value
    ? instanceToInstance(source.value!)
    : plainToInstance(MediaGroupDto, { field: props.field, tags: [] })
}
</script>

<template>
  <v-dialog v-model="opened" width="700" persistent>
    <v-card>
      <v-form @submit.prevent="save">
        <v-card-title>{{ source ? 'Edit' : 'Create' }} {{ field || 'media group' }}</v-card-title>
        <v-card-text>
          <v-select v-if="!field" v-model="form.field" :items="fieldsOptions" label="Field" hide-details class="mb-4" />
          <v-text-field v-model="form.name" label="Name" hide-details />
          <TagsAutocomplete :exclude="form.tags" @add-tag="(tag) => form.tags.push(tag)" class="mt-4" />
          <v-chip v-for="(tag, idx) of form.tags" class="mr-2 mt-2">
            {{ tag.title }}
            <v-icon icon="mdi-close-circle ml-1 mr-n1" size="18" @click="form.tags.splice(idx, 1)" />
          </v-chip>
          <v-checkbox v-model="form.trimmed" label="Trimmed" hide-details />
          <div class="d-flex align-center mb-4">
            <v-text-field v-model="form.count" density="compact" label="Count" hide-details />
            <span class="mx-2">/</span>
            <v-text-field v-model="form.total" density="compact" label="Total" hide-details />
          </div>
          <v-text-field v-model="form.externalLink" label="Link" hide-details />
          <v-text-field
            v-model="form.lastEntry"
            label="Last entry"
            placeholder="yyyy-mm-dd"
            hide-details
            class="mt-4" />
          <div class="d-flex justify-space-between">
            <v-checkbox v-model="form.toFollow" label="To follow" hide-details />
            <v-checkbox v-model="form.toTag" label="To tag" hide-details />
          </div>
          <v-textarea v-model="form.comment" label="Comment" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn :disabled="loading" @click="opened = false">Cancel</v-btn>
          <v-btn :loading="loading" color="primary" @click="save">{{ source ? 'Edit' : 'Create' }}</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>
