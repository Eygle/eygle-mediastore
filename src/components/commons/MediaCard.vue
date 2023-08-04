<script lang="ts" setup>
import { defineProps } from 'vue'
import copy from 'copy-to-clipboard'
import { MediaDto } from '@/dto/MediaDto'
import TagChips from '@/components/commons/TagChips.vue'

defineProps<{ media: MediaDto }>()
</script>

<template>
  <v-card>
    <v-card-title class="d-flex justify-lg-space-between">
      {{ media.title }}
      <v-icon v-if="media.isBest" icon="mdi-star" color="primary" />
    </v-card-title>
    <v-card-text>
      <TagChips :tags="media.tags" />

      <v-card class="mt-4" color="grey-darken-3" variant="flat">
        <v-card-text>
          <div v-for="file of media.files" class="d-flex justify-lg-space-between">
            <p class="text-caption">{{ file }}</p>
            <v-tooltip text="Copied !" open-on-click :open-on-hover="false" close-on-content-click>
              <template #activator="{ props }">
                <v-icon icon="mdi-content-copy" @click="copy(file)" v-bind="props" />
              </template>
            </v-tooltip>
          </div>
        </v-card-text>
      </v-card>

      <div v-if="media.starring?.length" class="mt-4">
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
</template>
