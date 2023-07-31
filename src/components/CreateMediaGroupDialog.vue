<script setup lang="ts">
import { computed, defineProps, ref, watch } from 'vue'
import { instanceToPlain, plainToInstance } from 'class-transformer'
import { MediaGroupDto } from '@/dto/MediaGroupDto'
import { Field } from '@/types/Field'

const props = defineProps<{ modelValue: boolean }>()
const emits = defineEmits(['update:modelValue'])

const value = computed({
  get: () => props.modelValue,
  set: (value) => emits('update:modelValue', value)
})

const fieldsOptions = Object.entries(Field).map(([title, value]) => ({ title, value }))

const form = ref(plainToInstance(MediaGroupDto, {}))

watch(form, (to) => console.log(instanceToPlain(to)), { deep: true })
</script>

<template>
  <v-dialog v-model="value" width="700">
    <v-card>
      <v-card-title>Create media group</v-card-title>
      <v-card-text>
        <v-select v-model="form.field" label="Field" :items="fieldsOptions" />
        <v-text-field v-model="form.name" label="Name" />
        <v-checkbox v-model="form.trimmed" label="Trimmed" />
        <v-expand-transition>
          <div v-if="form.trimmed" class="d-flex align-center">
            <v-text-field v-model="form.count" label="Count" density="compact" />
            <span class="mx-2">/</span>
            <v-text-field v-model="form.total" label="Total" density="compact" />
          </div>
        </v-expand-transition>
        <v-text-field v-model="form.externalLink" label="Link" />
        <v-text-field v-model="form.lastEntry" label="Last entry" placeholder="yyyy-mm-dd" />
        <v-checkbox v-model="form.toFollow" label="To follow" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="value = false">Cancel</v-btn>
        <v-btn color="primary">Create</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
