<script lang="ts" setup>
import { useApi } from '@/composables/api'
import { onBeforeMount, ref } from 'vue'
import { MediaGroupDto } from '@/dto/MediaGroupDto'
import { useRoute } from 'vue-router'
import MediaGroupDetails from '@/components/commons/MediaGroupDetails.vue'
import UpsertMediaGroupDialog from '@/components/UpsertMediaGroupDialog.vue'
import UpsertMediaDialog from '@/components/UpsertMediaDialog.vue'
import { useDialogs } from '@/composables/dialogs'

const route = useRoute()
const { getMediaGroupById } = useApi()
const { openMediaDialog, openMediaGroupDialog } = useDialogs()

const group = ref<MediaGroupDto | null>(null)
const loading = ref(false)

onBeforeMount(() => reload())

async function reload() {
  loading.value = true
  group.value = await getMediaGroupById(+route.params.id)
  loading.value = false
}
</script>

<template>
  <v-container class="h-100 d-flex flex-column">
    <div v-if="loading" class="d-flex align-center justify-center flex-grow-1">
      <v-progress-circular indeterminate size="100" />
    </div>
    <template v-else>
      <div v-if="!group"></div>
      <MediaGroupDetails v-else :group="group" />
      <UpsertMediaGroupDialog v-if="group" :source="group" @saved="(data) => (group = data)" />
      <UpsertMediaDialog v-if="group" :parent="group" @saved="reload" />
      <v-btn icon="mdi-pencil" color="primary" class="fab" size="large" @click="openMediaGroupDialog(group)" />
      <v-btn icon="mdi-plus" color="primary" class="fab top" size="large" @click="openMediaDialog()" />
    </template>
  </v-container>
</template>
