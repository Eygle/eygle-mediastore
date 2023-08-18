<script lang="ts" setup>
import { computed, onBeforeMount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useApi } from '@/composables/api'
import { MediaGroupDto } from '@/dto/MediaGroupDto'
import { Field } from '@/types/Field'
import MediaGroupCard from '@/components/commons/MediaGroupCard.vue'
import MediaCard from '@/components/commons/MediaCard.vue'
import { TagDto } from '@/dto/TagDto'

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

const groupsByFields = computed(() =>
  Object.values(Field)
    .map((field) => groups.value.filter((group) => group.field === field))
    .filter((v) => v.length)
)
</script>

<template>
  <v-container>
    <teleport to="#toolbar">
      <v-btn icon="mdi-arrow-left" variant="flat" @click="router.back()" />
      <span class="text-capitalize text-h6">{{ tag?.title }}</span>
    </teleport>
    <div v-if="loading"></div>
    <div v-else class="mt-n8">
      <template v-for="groups of groupsByFields">
        <h1 class="text-center text-capitalize mt-8">{{ groups[0].field }}</h1>
        <MediaGroupCard
          v-if="[Field.Profile, Field.Star].includes(groups[0].field)"
          v-for="profile of groups"
          :group="profile"
          no-action
          class="mt-4 pb-4">
          <MediaCard v-for="media of profile.media" :key="`media-${media.id}`" :media="media" no-action class="mt-4" />
        </MediaGroupCard>
        <template v-else>
          <template v-for="group of groups">
            <router-link :to="{ name: group.field, params: { id: group.id } }" class="text-h5 d-block mt-8">
              {{ group.name }}
            </router-link>
            <MediaCard v-for="media of group.media" :key="media.id" :media="media" no-action class="mt-4" />
          </template>
        </template>
      </template>
    </div>
  </v-container>
</template>
