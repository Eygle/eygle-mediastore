<script lang="ts" setup>
import { useMediaGroupApi } from '@/composables/media-group-api'
import { onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'
import { MediaDto } from '@/dto/MediaDto'

const { fetchMedias } = useMediaGroupApi()

const medias = ref<MediaDto[]>([])

onBeforeMount(async () => {
  medias.value = await fetchMedias(+useRoute().params.id)
})
</script>

<template>
  <v-container>
    <h2>Best by categories</h2>
    <v-card v-for="media of medias" :key="media.id" class="mt-4">
      <v-card-title>{{ media.title }}</v-card-title>
      <v-card-text>
        <v-chip v-for="tag of media.tags" :key="`tag-${tag.id}`" class="mr-2 mb-2">
          {{ tag.title }}
        </v-chip>
        <v-card class="mt-4" color="grey-darken-3" variant="flat">
          <v-card-text>
            <pre class="text-caption">{{ media.files.join('\n') }}</pre>
          </v-card-text>
        </v-card>

        <div v-if="media.starring.length" class="mt-4">
          Starring:
          <router-link v-for="star of media.starring" :key="`star-${star.id}`" to="">
            {{ star.name }}
          </router-link>
        </div>

        <div class="mt-4 pl-2 border-s-lg" v-if="media.comment">
          {{ media.comment }}
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>
