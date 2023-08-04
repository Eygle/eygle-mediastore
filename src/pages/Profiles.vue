<script lang="ts" setup>
import { useMediaGroupApi } from '@/composables/media-group-api'
import { onBeforeMount, ref } from 'vue'
import { Field } from '@/types/Field'
import { MediaGroupDto } from '@/dto/MediaGroupDto'
import MediaGroupCard from '@/components/commons/MediaGroupCard.vue'

const { fetchMediaGroups } = useMediaGroupApi()
const profiles = ref<MediaGroupDto[]>([])

onBeforeMount(async () => (profiles.value = await fetchMediaGroups(Field.Profile)))
</script>

<template>
  <v-container>
    <MediaGroupCard v-for="profile of profiles" :key="profile.id" :group="profile" class="mt-4" />
  </v-container>
</template>
