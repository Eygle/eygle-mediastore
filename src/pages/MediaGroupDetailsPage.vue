<script lang="ts" setup>
import { useApi } from '@/composables/api'
import { onBeforeMount, provide, ref } from 'vue'
import { MediaGroupDto } from '@/dto/MediaGroupDto'
import { useRoute, useRouter } from 'vue-router'
import UpsertMediaGroupDialog from '@/components/dialogs/UpsertMediaGroupDialog.vue'
import UpsertMediaDialog from '@/components/dialogs/UpsertMediaDialog.vue'
import { useDialogs } from '@/composables/dialogs'
import { Provide } from '@/types/Provide'
import TagChips from '@/components/TagChips.vue'
import MediaCard from '@/components/MediaCard.vue'

const route = useRoute()
const router = useRouter()
const { getMediaGroupById } = useApi()
const { openMediaDialog, openMediaGroupDialog } = useDialogs()

const group = ref<MediaGroupDto | null>(null)
const loading = ref(false)

provide(Provide.TagsSuggestions, group)

onBeforeMount(reload)

async function reload() {
  loading.value = true
  group.value = await getMediaGroupById(+route.params.id)
  loading.value = false
}
</script>

<template>
  <teleport to="#toolbar">
    <v-btn icon="mdi-arrow-left" variant="flat" @click="router.back()" />
    <v-spacer />
    <v-btn icon="mdi-pencil" variant="flat" @click="openMediaGroupDialog(group)" />
    <v-divider vertical class="mx-4 my-n2" />
    <v-btn icon="mdi-reload" :loading="loading" variant="flat" @click="reload()" />
  </teleport>
  <v-container class="h-100 d-flex flex-column">
    <div v-if="loading" class="d-flex align-center justify-center flex-grow-1">
      <v-progress-circular indeterminate size="100" />
    </div>
    <template v-else>
      <div v-if="!group"></div>
      <div v-else>
        <h2 class="d-flex">
          {{ group.name }}
          <span v-if="group.count || group.total" class="d-flex align-center ml-2 text-grey">
            <span>({{ group.count || group.total }}</span>
            <span v-if="group.count" class="text-caption ml-2">/ {{ group.total }}</span>
            <span>)</span>
          </span>
          <v-spacer />
          <v-tooltip v-if="group.toFollow" text="To follow">
            <template #activator="{ props }">
              <v-icon icon="mdi-youtube-subscription" color="primary" v-bind="props" />
            </template>
          </v-tooltip>
          <v-tooltip v-if="group.toTag" text="To tag">
            <template #activator="{ props }">
              <v-icon icon="mdi-tag-plus" color="orange-lighten-2" class="ml-2" v-bind="props" />
            </template>
          </v-tooltip>
          <v-tooltip v-if="group.trimmed" text="Trimmed">
            <template #activator="{ props }">
              <v-icon icon="mdi-content-cut" color="green-lighten-2" class="ml-2" v-bind="props" />
            </template>
          </v-tooltip>
        </h2>
        <TagChips :parent="group" class="mt-8" />

        <div class="mt-8">
          <MediaCard v-for="media of group.media" :key="media.id" :media="media" class="mt-4" />
        </div>

        <a v-if="group.externalLink" :href="group.externalLink" target="_blank" class="d-block mt-8">{{
          group.externalLink
        }}</a>

        <div class="mt-8 pl-2 border-s-lg text-pre" v-if="group.comment">
          {{ group.comment }}
        </div>
      </div>
      <UpsertMediaGroupDialog v-if="group" :source="group" @saved="(data) => (group = data)" />
      <UpsertMediaDialog v-if="group" :parent="group" @saved="reload" />
      <v-btn icon="mdi-plus" color="primary" class="fab top" size="large" @click="openMediaDialog()" />
    </template>
  </v-container>
</template>
