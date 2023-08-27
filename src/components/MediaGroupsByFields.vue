<script setup lang="ts">
import { computed, defineProps, ref } from 'vue'
import { Field } from '@/types/Field'
import { MediaGroupDto } from '@/dto/MediaGroupDto'
import MediaGroupCard from '@/components/MediaGroupCard.vue'
import MediaCard from '@/components/MediaCard.vue'
import UpsertMediaGroupDialog from '@/components/dialogs/UpsertMediaGroupDialog.vue'

const props = defineProps<{ groups: MediaGroupDto[]; loading: boolean }>()
const emits = defineEmits(['refresh'])

const tab = ref(0)

const groupsByFields = computed(() =>
  Object.values(Field)
    .map((field) => props.groups.filter((group) => group.field === field))
    .filter((v) => v.length)
)

const tabs = computed(() => groupsByFields.value.map((group) => group[0].field))
</script>

<template>
  <div class="h-100 d-flex flex-column">
    <v-tabs v-model="tab" align-tabs="center">
      <v-tab v-for="(field, idx) of tabs" :value="idx" class="text-capitalize">{{ field }}</v-tab>
    </v-tabs>

    <div v-if="loading" class="d-flex align-center justify-center flex-grow-1 mt-8">
      <v-progress-circular indeterminate size="100" />
    </div>
    <v-window v-else v-model="tab">
      <v-window-item v-for="(field, idx) of tabs" :value="idx">
        <template v-for="group of groupsByFields[idx]">
          <MediaGroupCard v-if="[Field.Profile, Field.Star].includes(field)" :group="group" class="mt-4 pb-4">
            <MediaCard v-for="media of group.media" :key="`media-${media.id}`" :media="media" no-action class="mt-4" />
          </MediaGroupCard>
          <template v-else>
            <router-link :to="{ name: group.field, params: { id: group.id } }" class="text-h5 d-block mt-8">
              {{ group.name }}
            </router-link>
            <MediaCard v-for="media of group.media" :key="media.id" :media="media" no-action class="mt-4" />
          </template>
        </template>
      </v-window-item>
    </v-window>
  </div>
  <UpsertMediaGroupDialog @saved="emits('refresh')" />
</template>
