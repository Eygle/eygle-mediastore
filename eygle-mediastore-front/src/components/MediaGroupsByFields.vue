<script setup lang="ts">
import { computed, defineProps, ref } from 'vue'
import { Field } from '@/types/Field'
import { MediaGroupDto } from '@/dto/MediaGroupDto'
import MediaGroupCard from '@/components/MediaGroupCard.vue'
import MediaCard from '@/components/MediaCard.vue'
import UpsertMediaGroupDialog from '@/components/dialogs/UpsertMediaGroupDialog.vue'
import { RouteName } from '@/types/RouteName'

const props = defineProps<{ groups: MediaGroupDto[]; loading: boolean }>()
const emits = defineEmits(['refresh'])

const tab = ref(0)

const noFieldMedia = computed(() => props.groups.filter((group) => group.field === null))

const groupsByFields = computed(() => [
  ...Object.values(Field)
    .map((field) => props.groups.filter((group) => group.field === field))
    .filter((v) => v.length),
  ...(noFieldMedia.value.length ? [noFieldMedia.value] : []),
])

const tabs = computed(() => groupsByFields.value.map((group) => group[0].field))
</script>

<template>
  <div class="h-100 d-flex flex-column">
    <v-tabs v-model="tab" align-tabs="center">
      <v-tab v-for="(field, idx) of tabs" :key="field" :value="idx" class="text-capitalize"
        >{{ field ?? 'None' }} ({{ groupsByFields[idx].length }})</v-tab
      >
    </v-tabs>

    <div v-if="loading" class="d-flex align-center justify-center flex-grow-1 mt-8">
      <v-progress-circular indeterminate size="100" />
    </div>
    <v-window v-else v-model="tab">
      <v-window-item v-for="(field, idx) of tabs" :key="field" :value="idx">
        <template v-for="group of groupsByFields[idx]">
          <MediaGroupCard
            v-if="[Field.Profile, Field.Star].includes(field)"
            :key="group.id"
            :group="group"
            include-comment
            class="mt-4 pb-4"
          >
            <MediaCard
              v-for="media of group.media"
              :key="`media-${media.id}`"
              :media="media"
              no-action
              class="mt-4"
              @tags-saved="emits('refresh')"
            />
          </MediaGroupCard>
          <template v-else>
            <router-link
              :to="{ name: group.field ?? RouteName.Website, params: { id: group.id } }"
              :key="group.id"
              class="text-h5 d-block mt-8"
            >
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
