<script lang="ts" setup>
import { useApi } from '@/composables/api'
import { onBeforeMount, ref } from 'vue'
import { Field } from '@/types/Field'
import { MediaGroupDto } from '@/dto/MediaGroupDto'
import MediaGroupCard from '@/components/commons/MediaGroupCard.vue'
import UpsertMediaGroupDialog from '@/components/UpsertMediaGroupDialog.vue'
import { useRoute, useRouter } from 'vue-router'
import { RouteName } from '@/types/RouteName'
import { useDialogs } from '@/composables/dialogs'

const router = useRouter()
const route = useRoute()
const { fetchMediaGroups } = useApi()
const { openMediaGroupDialog } = useDialogs()

const groups = ref<MediaGroupDto[]>([])
const loading = ref(false)

onBeforeMount(() => reload())

async function reload() {
  loading.value = true
  groups.value = await fetchMediaGroups(route.meta.field!)
  loading.value = false
}

function onSave(group: MediaGroupDto) {
  const idx = groups.value.findIndex(({ id }) => id === group.id)
  if (idx === -1) return router.push(`${route.path}/${group.id}`)

  groups.value.splice(idx, 1, group)
}
</script>

<template>
  <v-container class="h-100 d-flex flex-column">
    <div v-if="loading" class="d-flex align-center justify-center flex-grow-1">
      <v-progress-circular indeterminate size="100" />
    </div>
    <template v-else>
      <MediaGroupCard v-for="group of groups" :key="group.id" :group="group" class="mt-4" />
      <UpsertMediaGroupDialog :field="route.meta.field" @saved="onSave" />
      <v-btn icon="mdi-plus" color="primary" class="fab" size="large" @click="openMediaGroupDialog()" />
    </template>
  </v-container>
</template>
