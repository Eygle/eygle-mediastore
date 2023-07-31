<script setup lang="ts">
import { useMediaGroupApi } from '@/composables/media-group-api'
import { onBeforeMount, ref } from 'vue'
import { Field } from '@/types/Field'
import { MediaGroupDto } from '@/dto/MediaGroupDto'

const { fetchMediaGroups } = useMediaGroupApi()
const profiles = ref<MediaGroupDto[]>([])

onBeforeMount(async () => (profiles.value = await fetchMediaGroups(Field.Profile)))

const getAllProfileBestFiles = (profile: MediaGroupDto) =>
  profile.media.reduce((acc, media) => [...acc, ...media.files], [])
</script>

<template>
  <v-container>
    <v-card
      v-for="profile of profiles"
      :key="profile.id"
      :class="{ trimmed: profile.trimmed, 'to-tag': profile.toTag }"
      class="mt-4"
    >
      <v-card-title class="d-flex">
        {{ profile.name }}
        <v-spacer />
        <span v-if="profile.count || profile.total">{{ profile.count || profile.total }}</span>
      </v-card-title>
      <v-card-text>
        <v-chip v-for="tag of profile.tags" :key="`tag-${tag.id}`" class="mr-2 mb-2">
          {{ tag.title }}
        </v-chip>
        <v-expansion-panels v-if="profile.media?.length" class="mt-4">
          <v-expansion-panel :title="`View ${getAllProfileBestFiles(profile).length} best files`">
            <v-expansion-panel-text>
              <div v-for="media of getAllProfileBestFiles(profile)" class="text-caption">{{ media }}</div>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped lang="scss">
.trimmed {
  background-color: rgba(76, 175, 80, 0.1);
}

.to-tag {
  background-color: rgba(255, 152, 0, 0.1);
}
</style>
