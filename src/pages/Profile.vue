<script lang="ts" setup>
import { useMediaGroupApi } from '@/composables/media-group-api'
import { onBeforeMount, ref } from 'vue'
import { MediaGroupDto } from '@/dto/MediaGroupDto'
import { useRoute } from 'vue-router'
import MediaGroupDetails from '@/components/commons/MediaGroupDetails.vue'
import UpsertMediaGroupDialog from '@/components/UpsertMediaGroupDialog.vue'

const { getMediaGroupById } = useMediaGroupApi()
const profile = ref<MediaGroupDto | null>(null)
const editDialogOpened = ref(false)

onBeforeMount(async () => (profile.value = await getMediaGroupById(+useRoute().params.id)))
</script>

<template>
  <v-container>
    <div v-if="!profile"></div>
    <MediaGroupDetails v-else :group="profile" />
    <UpsertMediaGroupDialog v-if="profile" v-model="editDialogOpened" :source="profile" @success="(data) => profile = data" />
    <v-btn icon="mdi-pencil" color="primary" class="fab" size="large" @click="editDialogOpened = true" />
  </v-container>
</template>
