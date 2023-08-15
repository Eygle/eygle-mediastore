<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useApi } from '@/composables/api'
import { MediaGroupDto } from '@/dto/MediaGroupDto'
import { Field } from '@/types/Field'
import { MediaDto } from '@/dto/MediaDto'
import MediaGroupDetails from '@/components/commons/MediaGroupDetails.vue'
import MediaGroupCard from '@/components/commons/MediaGroupCard.vue'

const route = useRoute()
const router = useRouter()
const { fetchAllMediasTaggedBy, fetchAllMediaGroupsTaggedBy } = useApi()

const categories = ref<MediaGroupDto[]>([])
const profiles = ref<MediaGroupDto[]>([])
const loading = ref(false)

console.log('inside tag !')

onBeforeMount(async () => {
  loading.value = true
  const tagId = +route.params.id
  const [medias, groups]: [MediaDto[], MediaGroupDto[]] = await Promise.all([
    fetchAllMediasTaggedBy(tagId),
    fetchAllMediaGroupsTaggedBy(tagId),
  ])

  // Set media under groups
  for (const media of medias) {
    const found = groups.find(({ id }) => id === media.parent.id)

    if (found) {
      found.media.push(media)
    } else {
      media.parent.media = [media]
      groups.push(media.parent)
    }
    delete media.parent
  }

  profiles.value = groups.filter(({ field }) => field === Field.Profile)
  categories.value = groups.filter(({ field }) => field === Field.Category)
  loading.value = false
})
</script>

<template>
  <v-container>
    <teleport to="#toolbar">
      <v-btn icon="mdi-arrow-left" variant="flat" @click="router.back()" />
    </teleport>
    <div v-if="loading"></div>
    <div v-else>
      <div v-if="categories.length">
        <MediaGroupDetails v-for="category of categories" :group="category" class="mt-12" />
      </div>
      <div v-if="profiles.length" class="mt-12">
        <v-divider v-if="categories.length" class="my-8" />
        <h2>Profiles</h2>
        <MediaGroupCard v-for="profile of profiles" :group="profile" class="mt-4" />
      </div>
    </div>
  </v-container>
</template>
