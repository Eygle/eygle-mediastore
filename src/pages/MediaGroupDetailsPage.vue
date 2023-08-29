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
import StatusIcon from '@/components/StatusIcon.vue'
import StarringList from '@/components/StarringList.vue'

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
    <template v-if="group">
      <span class="text-capitalize text-h6">{{ group.name }}</span>
      <v-chip v-if="!loading && (group.count || group.total)" class="ml-3">
        <span>{{ group.count || group.total }}</span>
        <span v-if="group.total && group.count" class="ml-1">/ {{ group.total }}</span>
      </v-chip>
      <v-spacer />
      <StatusIcon :group="group" spaced />
      <v-divider vertical class="mx-4 my-n2" />
      <v-btn
        icon="mdi-plus"
        variant="flat"
        @click="openMediaGroupDialog(undefined, { parent: { id: group.id } as any })" />
      <v-btn icon="mdi-pencil" variant="flat" @click="openMediaGroupDialog(group)" />
      <v-divider vertical class="mx-4 my-n2" />
    </template>
    <v-btn icon="mdi-reload" :loading="loading" variant="flat" @click="reload()" />
  </teleport>
  <v-container class="h-100 d-flex flex-column">
    <div v-if="loading" class="d-flex align-center justify-center flex-grow-1">
      <v-progress-circular indeterminate size="100" />
    </div>
    <template v-else>
      <div v-if="!group"></div>
      <div v-else class="pt-4">
        <TagChips :parent="group" />
        <StarringList v-if="group.starring.length" :value="group.starring" class="mt-4" />
        <div v-if="group.comment || group.externalLink || group.lastEntry" class="d-flex mt-4 justify-space-between">
          <div :class="{ 'pl-2 border-s-lg text-pre': group.comment }">{{ group.comment }}</div>
          <div class="text-right">
            <a v-if="group?.externalLink" :href="group.externalLink" target="_blank" class="d-block">
              {{ group.externalLink }}
            </a>
            <div v-if="group.lastEntry" class="text-grey">Last entry: {{ group.lastEntryRelativeTime }}</div>
          </div>
        </div>

        <v-divider
          v-if="group?.tags.length || group?.externalLink || group?.lastEntry || group?.comment"
          class="my-8" />

        <MediaCard v-for="media of group.media" :key="media.id" :media="media" class="mt-4" @tags-saved="reload" />
      </div>
      <UpsertMediaGroupDialog v-if="group" @saved="(data) => (group = data)" />
      <UpsertMediaDialog v-if="group" :parent="group" @saved="reload" />
      <v-btn icon="mdi-plus" color="primary" class="fab top" size="large" @click="openMediaDialog()" />
    </template>
  </v-container>
</template>
