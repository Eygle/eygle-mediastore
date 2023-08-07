<script lang="ts" setup>
import { defineProps } from 'vue'
import copy from 'copy-to-clipboard'
import { MediaDto } from '@/dto/MediaDto'
import TagChips from '@/components/commons/TagChips.vue'
import { RouteName } from '@/types/RouteName'
import { Field } from '@/types/Field'

defineProps<{ media: MediaDto }>()
</script>

<template>
  <v-card>
    <v-card-title class="d-flex justify-lg-space-between">
      {{ media.title }}
      <v-icon v-if="media.isBest" icon="mdi-star" color="primary" />
    </v-card-title>
    <v-card-text>
      <TagChips :parent="media" />

      <v-card class="mt-4" color="grey-darken-3" variant="flat">
        <v-card-text class="pb-2">
          <div v-for="file of media.files" class="d-flex justify-lg-space-between mb-2">
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
        <router-link
          v-for="star of media.starring"
          :key="`star-${star.id}`"
          :to="{ name: star.field === Field.Profile ? RouteName.Profile : RouteName.Star, params: { id: star.id } }">
          {{ star.name }}
        </router-link>
      </div>

      <div class="mt-4 pl-2 border-s-lg" v-if="media.comment">
        {{ media.comment }}
      </div>
    </v-card-text>
  </v-card>
</template>
