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
const { openMediaDialog } = useDialogs()

const profile = ref<MediaGroupDto | null>(null)
const loading = ref(false)
const editDialogOpened = ref(false)

onBeforeMount(() => reload())

async function reload() {
  loading.value = false
  profile.value = await getMediaGroupById(+route.params.id)
  loading.value = true
}
</script>

<template>
  <v-container>
    <div v-if="!profile"></div>
    <MediaGroupDetails v-else :group="profile" />
    <UpsertMediaGroupDialog v-if="profile" v-model="editDialogOpened" :source="profile" @saved="(data) => profile = data" />
    <UpsertMediaDialog v-if="profile" :parent="profile" @saved="reload" />
    <v-btn icon="mdi-pencil" color="primary" class="fab" size="large" @click="editDialogOpened = true" />
    <v-btn icon="mdi-plus" color="primary" class="fab top" size="large" @click="openMediaDialog()" />
  </v-container>
</template>
