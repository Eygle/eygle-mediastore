<script setup lang="ts">
import { computed, defineProps, ref, watch } from 'vue'
import { instanceToPlain, plainToInstance } from 'class-transformer'
import { MediaDto } from '@/dto/MediaDto'
const form = ref(plainToInstance(MediaDto, { files: [null], progress: [null, null] }))

const props = defineProps<{ modelValue: boolean }>()
const emits = defineEmits(['update:modelValue'])

const value = computed({
  get: () => props.modelValue,
  set: (value) => emits('update:modelValue', value)
})

watch(form, (to) => console.log(instanceToPlain(to)), { deep: true })
</script>

<template>
  <v-dialog v-model="value" width="700">
    <v-card>
      <v-card-title>Create media</v-card-title>
      <v-card-text>
        <v-text-field v-model="form.title" label="Title" />
        <div v-for="(_, idx) in form.files" :key="idx" class="d-flex align-center">
          <v-text-field v-model="form.files[idx]" :label="`File ${idx + 1}`" />
          <v-btn v-if="idx === form.files.length - 1" icon="mdi-plus" variant="text" class="ml-4" @click="form.files.push(null)" />
          <v-btn v-else icon="mdi-minus" variant="text" class="ml-4" @click="form.files.splice(idx, 1)" />
        </div>
        <v-checkbox v-model="form.isBest" color="primary" label="Is best?" />
        <v-checkbox v-model="form.toSee" label="To see?" />
        <div class="d-flex align-center">
          <v-text-field
              v-model="form.progress[0]"
              label="Progress"
              density="compact"
              placeholder="[hh:][mm:]ss"
          />
          <span class="mx-2">/</span>
          <v-text-field
              v-model="form.progress[1]"
              label="Total time"
              density="compact"
              placeholder="[hh:][mm:]ss"
          />
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="value = false">Cancel</v-btn>
        <v-btn color="primary">Create</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
