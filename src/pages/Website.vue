<script lang="ts" setup>
import { useMediaGroupApi } from '@/composables/media-group-api'
import { onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'
import MediaGroupDetails from '@/components/commons/MediaGroupDetails.vue'
import { MediaGroupDto } from '@/dto/MediaGroupDto'

const route = useRoute()

const { getMediaGroupById } = useMediaGroupApi()

const website = ref<MediaGroupDto | null>(null)

onBeforeMount(async () => {
  website.value = await getMediaGroupById(+route.params.id)
})
</script>

<template>
  <v-container>
    <div v-if="!website"></div>
    <MediaGroupDetails v-else :group="website" />
  </v-container>
</template>
