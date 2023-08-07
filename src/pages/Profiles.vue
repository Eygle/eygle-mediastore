<script lang="ts" setup>
import { useMediaGroupApi } from '@/composables/media-group-api'
import { onBeforeMount, ref } from 'vue'
import { Field } from '@/types/Field'
import { MediaGroupDto } from '@/dto/MediaGroupDto'
import MediaGroupCard from '@/components/commons/MediaGroupCard.vue'
import UpsertMediaGroupDialog from '@/components/UpsertMediaGroupDialog.vue'

const { fetchMediaGroups } = useMediaGroupApi()
const profiles = ref<MediaGroupDto[]>([])
const loading = ref(false)
const addDialogOpened = ref(false)

onBeforeMount(() => reload())

async function reload() {
  loading.value = true
  profiles.value = await fetchMediaGroups(Field.Profile)
  loading.value = false
}
</script>

<template>
  <v-container>
    <MediaGroupCard v-for="profile of profiles" :key="profile.id" :group="profile" class="mt-4" />
    <UpsertMediaGroupDialog v-model="addDialogOpened" :field="Field.Profile" @success="reload" />
    <v-btn icon="mdi-plus" color="primary" class="fab" size="large" @click="addDialogOpened = true" />
  </v-container>
</template>
