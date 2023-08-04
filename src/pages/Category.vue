<script lang="ts" setup>
import { useMediaGroupApi } from '@/composables/media-group-api'
import { onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'
import MediaGroupDetails from '@/components/commons/MediaGroupDetails.vue'
import { MediaGroupDto } from '@/dto/MediaGroupDto'

const { getMediaGroupById } = useMediaGroupApi()

const category = ref<MediaGroupDto | null>(null)

onBeforeMount(async () => {
  category.value = await getMediaGroupById(+useRoute().params.id)
})
</script>

<template>
  <v-container>
    <div v-if="!category"></div>
    <MediaGroupDetails v-else :group="category" />
  </v-container>
</template>
