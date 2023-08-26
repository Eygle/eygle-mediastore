<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useApi } from '@/composables/api'
import { MediaGroupDto } from '@/dto/MediaGroupDto'
import { TagDto } from '@/dto/TagDto'
import MediaGroupsByFields from '@/components/MediaGroupsByFields.vue'

const route = useRoute()
const router = useRouter()
const { getTagById, fetchAllMediasTaggedBy, fetchAllMediaGroupsTaggedBy } = useApi()

const tag = ref<TagDto>()
const groups = ref<MediaGroupDto[]>([])
const loading = ref(false)

onBeforeMount(async () => {
  loading.value = true
  const tagId = +route.params.id
  const [fromTag, fromMedia, fromGroups]: [TagDto, MediaGroupDto[], MediaGroupDto[]] = await Promise.all([
    getTagById(tagId),
    fetchAllMediasTaggedBy(tagId),
    fetchAllMediaGroupsTaggedBy(tagId),
  ])

  tag.value = fromTag

  // Set media under groups
  for (const parent of fromMedia) {
    const found = fromGroups.find(({ id }) => id === parent.id)

    if (found) {
      if (!found.media) {
        found.media = []
      }
      found.media.push(...parent.media)
    } else {
      fromGroups.push(parent)
    }
  }

  groups.value = fromGroups
  loading.value = false
})
</script>

<template>
  <v-container>
    <teleport to="#toolbar">
      <v-btn icon="mdi-arrow-left" variant="flat" @click="router.back()" />
      <span class="text-capitalize text-h6">{{ tag?.title }}</span>
      <v-chip v-if="!loading" class="ml-3">{{ groups.reduce((count, g) => count + g.media?.length || 1, 0) }}</v-chip>
    </teleport>
    <div v-if="loading"></div>
    <MediaGroupsByFields v-else :groups="groups" />
  </v-container>
</template>
