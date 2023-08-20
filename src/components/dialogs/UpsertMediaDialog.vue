<script lang="ts" setup>
import { defineProps, ref, watch } from 'vue'
import { instanceToInstance, plainToInstance } from 'class-transformer'
import { MediaDto } from '@/dto/MediaDto'
import { MediaGroupDto } from '@/dto/MediaGroupDto'
import { useApi } from '@/composables/api'
import TagsAutocomplete from '@/components/TagsAutocomplete.vue'
import { useDialogs } from '@/composables/dialogs'
import { rules } from '@/utils/form-validator'
import { useRoute } from 'vue-router'
import useToast from '@/composables/toast'

const route = useRoute()
const { createMedia, updateMedia } = useApi()
const { upsertMediaDialogOpened: opened, media: source } = useDialogs()
const { toastError } = useToast()

const props = defineProps<{ parent: MediaGroupDto }>()
const emits = defineEmits(['saved'])

const form = ref(initForm())
const loading = ref(false)
const valid = ref(false)

watch(source, () => (form.value = initForm()), { deep: true })

async function save() {
  if (!valid.value) return
  try {
    loading.value = true
    const res = await (source.value
      ? updateMedia(form.value, route.meta.taggableParent)
      : createMedia(form.value, route.meta.taggableParent))
    emits('saved', res)
    loading.value = false
    opened.value = false
  } catch (e) {
    toastError()
    console.error(e)
  }
}

function initForm(): MediaDto {
  return source.value
    ? instanceToInstance(source.value!)
    : plainToInstance(MediaDto, { tags: [], files: [null], progress: [null, null], parent: { id: props.parent.id } })
}
</script>

<template>
  <v-dialog v-model="opened" width="700" persistent="">
    <v-card>
      <v-card-title>{{ source ? 'Edit' : 'Create' }} media</v-card-title>
      <v-card-text>
        <v-form v-model="valid">
          <v-text-field v-model="form.title" label="Title" />
          <TagsAutocomplete :exclude="form.tags" @add-tag="(tag) => form.tags.push(tag)" />
          <v-chip v-for="(tag, idx) of form.tags" class="mr-2 mt-2">
            {{ tag.title }}
            <v-icon icon="mdi-close-circle ml-1 mr-n1" size="18" @click="form.tags.splice(idx, 1)" />
          </v-chip>
          <div class="mt-5">
            <div v-for="(_, idx) in form.files" :key="idx" class="d-flex align-center">
              <v-text-field
                v-model="form.files[idx]"
                :label="`File ${idx + 1}`"
                :rules="idx === 0 ? [rules.required()] : undefined" />
              <v-btn
                v-if="idx === form.files.length - 1"
                class="ml-4"
                icon="mdi-plus"
                variant="text"
                @click="form.files.push(null)" />
              <v-btn v-else class="ml-4" icon="mdi-minus" variant="text" @click="form.files.splice(idx, 1)" />
            </div>
          </div>
          <v-checkbox v-model="form.isBest" color="primary" label="Is best?" hide-details />
          <v-checkbox v-model="form.toSee" label="To see?" />
          <div class="d-flex align-center">
            <v-text-field
              v-model="form.progress[0]"
              density="compact"
              label="Progress"
              placeholder="[hh:][mm:]ss"
              :rules="[rules.duration()]" />
            <span class="mx-2">/</span>
            <v-text-field
              v-model="form.progress[1]"
              density="compact"
              label="Total time"
              placeholder="[hh:][mm:]ss"
              :rules="[rules.duration()]" />
          </div>
          <v-textarea v-model="form.comment" label="Comment" />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn :disabled="loading" @click="opened = false">Cancel</v-btn>
        <v-btn :loading="loading" color="primary" :disabled="!valid" @click="save">{{
          source ? 'Edit' : 'Create'
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
