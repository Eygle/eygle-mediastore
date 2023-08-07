<script lang="ts" setup>
import { computed, defineProps, ref, watch } from 'vue'
import { instanceToInstance, plainToInstance } from 'class-transformer'
import { MediaGroupDto } from '@/dto/MediaGroupDto'
import { Field } from '@/types/Field'
import TagsAutocomplete from '@/components/TagsAutocomplete.vue'
import { useMediaGroupApi } from '@/composables/media-group-api'

const { createMediaGroup, updateMediaGroup } = useMediaGroupApi()

const props = defineProps<{ modelValue: boolean; source?: MediaGroupDto; field?: Field }>()
const emits = defineEmits(['update:modelValue', 'success'])

const opened = computed({
  get: () => props.modelValue,
  set: (value) => emits('update:modelValue', value),
})

const fieldsOptions = Object.entries(Field).map(([title, value]) => ({ title, value }))
const loading = ref(false)
const form = ref(
  props.source ? instanceToInstance(props.source) : plainToInstance(MediaGroupDto, { field: props.field, tags: [] })
)

async function save() {
  try {
    loading.value = true
    const res = await (props.source ? updateMediaGroup(form.value) : createMediaGroup(form.value))
    console.log('success', res)
    emits('success', res)
    loading.value = false
    opened.value = false
  } catch {}
}

watch(props.source, (to) => {
  if (to) {
    form.value = instanceToInstance(props.source)
  }
}, { deep: true })
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
          <v-expand-transition>
            <div v-if="form.trimmed" class="d-flex align-center mb-4">
              <v-text-field v-model="form.count" density="compact" label="Count" hide-details />
              <span class="mx-2">/</span>
              <v-text-field v-model="form.total" density="compact" label="Total" hide-details />
            </div>
          </v-expand-transition>
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
