<script lang="ts" setup>
import { useApi } from '@/composables/api'
import { onBeforeMount, ref } from 'vue'
import { Field } from '@/types/Field'
import { MediaGroupDto } from '@/dto/MediaGroupDto'
import MediaGroupCard from '@/components/commons/MediaGroupCard.vue'
import UpsertMediaGroupDialog from '@/components/UpsertMediaGroupDialog.vue'
import { useRouter } from 'vue-router'
import { RouteName } from '@/types/RouteName'
import { useDialogs } from '@/composables/dialogs'

const router = useRouter()
const { fetchMediaGroups } = useApi()
const { openMediaGroupDialog } = useDialogs()

const profiles = ref<MediaGroupDto[]>([])
const loading = ref(false)

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
    <UpsertMediaGroupDialog
      :field="Field.Profile"
      @saved="({ id }) => router.push({ name: RouteName.Profile, params: { id } })" />
    <v-btn icon="mdi-plus" color="primary" class="fab" size="large" @click="openMediaGroupDialog()" />
  </v-container>
</template>
