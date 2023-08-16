<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useApi } from '@/composables/api'
import { MediaGroupDto } from '@/dto/MediaGroupDto'
import { Field } from '@/types/Field'
import MediaGroupCard from '@/components/commons/MediaGroupCard.vue'
import MediaCard from '@/components/commons/MediaCard.vue'
import { RouteName } from '@/types/RouteName'

const route = useRoute()
const router = useRouter()
const { fetchAllMediasTaggedBy, fetchAllMediaGroupsTaggedBy } = useApi()

const categories = ref<MediaGroupDto[]>([])
const profiles = ref<MediaGroupDto[]>([])
const loading = ref(false)

onBeforeMount(async () => {
  loading.value = true
  const tagId = +route.params.id
  const [fromMedia, groups]: [MediaGroupDto[], MediaGroupDto[]] = await Promise.all([
    fetchAllMediasTaggedBy(tagId),
    fetchAllMediaGroupsTaggedBy(tagId),
  ])

  // Set media under groups
  for (const parent of fromMedia) {
    const found = groups.find(({ id }) => id === parent.id)

    if (found) {
      if (!found.media) {
        found.media = []
      }
      found.media.push(...parent.media)
    } else {
      groups.push(parent)
    }
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
      <template v-if="categories.length">
        <h1 class="text-center mb-4">Categories</h1>
        <template v-for="category of categories">
          <router-link :to="{ name: RouteName.Category, params: { id: category.id } }" class="text-h5">{{ category.name }}</router-link>
          <MediaCard v-for="media of category.media" :key="media.id" :media="media" no-action class="mt-4" />
        </template>
        <v-divider class="my-8" />
      </template>
      <template v-if="profiles.length">
        <h1 class="text-center mb-4">Profiles</h1>
        <MediaGroupCard v-for="profile of profiles" :group="profile" no-action class="mt-4 pb-4">
          <MediaCard v-for="media of profile.media" :key="`media-${media.id}`" :media="media" no-action class="mt-4" />
        </MediaGroupCard>
      </template>
    </div>
  </v-container>
</template>
