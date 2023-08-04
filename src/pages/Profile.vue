<script lang="ts" setup>
import { useMediaGroupApi } from '@/composables/media-group-api'
import { onBeforeMount, ref } from 'vue'
import { MediaGroupDto } from '@/dto/MediaGroupDto'
import { useRoute } from 'vue-router'
import MediaGroupDetails from '@/components/commons/MediaGroupDetails.vue'

const { getMediaGroupById } = useMediaGroupApi()
const profile = ref<MediaGroupDto | null>(null)

onBeforeMount(async () => (profile.value = await getMediaGroupById(+useRoute().params.id)))
</script>

<template>
  <v-container>
    <div v-if="!profile"></div>
    <MediaGroupDetails v-else :group="profile" />
  </v-container>
</template>
