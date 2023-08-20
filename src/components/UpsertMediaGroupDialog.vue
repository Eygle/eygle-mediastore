<script lang="ts" setup>
import { defineProps, onMounted, ref, VueElement, watch } from 'vue'
import { instanceToInstance, plainToInstance } from 'class-transformer'
import { MediaGroupDto } from '@/dto/MediaGroupDto'
import { Field } from '@/types/Field'
import TagsAutocomplete from '@/components/TagsAutocomplete.vue'
import { useApi } from '@/composables/api'
import { useDialogs } from '@/composables/dialogs'
import { rules } from '@/utils/form-validator'
import useToast from '@/composables/toast'

const { createMediaGroup, updateMediaGroup } = useApi()
const { upsertMediaGroupDialogOpened: opened, mediaGroup: source } = useDialogs()
const { toastError } = useToast()

const props = defineProps<{ field?: Field }>()
const emits = defineEmits(['saved'])

const fieldsOptions = Object.entries(Field).map(([title, value]) => ({ title, value }))
const loading = ref(false)
const model = ref(initForm())
const valid = ref(false)

watch(source, () => (model.value = initForm()), { deep: true })

async function save() {
  try {
    if (!valid.value) return
    loading.value = true
    const res = await (source.value ? updateMediaGroup(model.value) : createMediaGroup(model.value))
    emits('saved', res)
    loading.value = false
    opened.value = false
  } catch (e) {
    toastError()
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
      <v-form v-model="valid" @submit.prevent="save">
        <v-card-title>{{ source ? 'Edit' : 'Create' }} {{ field || 'media group' }}</v-card-title>
        <v-card-text>
          <v-select
            v-if="!field"
            v-model="model.field"
            :items="fieldsOptions"
            :rules="[rules.required()]"
            label="Field"
            hide-details="auto"
            class="mb-4" />
          <v-text-field v-model="model.name" label="Name" autofocus :rules="[rules.required()]" hide-details="auto" />
          <TagsAutocomplete :exclude="model.tags" @add-tag="(tag) => model.tags.push(tag)" class="mt-4" />
          <v-chip v-for="(tag, idx) of model.tags" class="mr-2 mt-2">
            {{ tag.title }}
            <v-icon icon="mdi-close-circle ml-1 mr-n1" size="18" @click="model.tags.splice(idx, 1)" />
          </v-chip>
          <v-checkbox v-model="model.trimmed" label="Trimmed" hide-details />
          <div class="d-flex align-center mb-4">
            <v-text-field
              v-model="model.count"
              density="compact"
              label="Count"
              hide-details
              :rules="[rules.numeric()]" />
            <span class="mx-2">/</span>
            <v-text-field
              v-model="model.total"
              density="compact"
              label="Total"
              hide-details
              :rules="[rules.numeric()]" />
          </div>
          <v-text-field v-model="model.externalLink" label="Link" hide-details />
          <v-text-field
            v-model="model.lastEntry"
            label="Last entry"
            placeholder="yyyy-mm-dd"
            hide-details
            :rules="[rules.date()]"
            class="mt-4" />
          <div class="d-flex justify-space-between">
            <v-checkbox v-model="model.toFollow" label="To follow" hide-details />
            <v-checkbox v-model="model.toTag" label="To tag" hide-details />
          </div>
          <v-textarea v-model="model.comment" label="Comment" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn :disabled="loading" @click="opened = false">Cancel</v-btn>
          <v-btn :loading="loading" color="primary" :disabled="!valid" @click="save">{{
            source ? 'Edit' : 'Create'
          }}</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>
