<script lang="ts" setup>
import { defineProps } from 'vue'
import copy from 'copy-to-clipboard'
import { MediaDto } from '@/dto/MediaDto'
import TagChips from '@/components/commons/TagChips.vue'
import { useDialogs } from '@/composables/dialogs'

const { openMediaDialog } = useDialogs()

defineProps<{ media: MediaDto }>()
</script>

<template>
  <v-card>
    <v-hover>
      <template #default="{ isHovering, props }">
        <v-card-title class="d-flex justify-space-between" v-bind="props">
          <p class="text-truncate">{{ media.title }}</p>
          <div>
            <v-tooltip v-if="media.toSee" text="To see">
              <template #activator="{ props }">
                <v-icon icon="mdi-eye" color="blue" class="ml-2" v-bind="props" />
              </template>
            </v-tooltip>
            <v-tooltip v-if="media.isBest" text="Best">
              <template #activator="{ props }">
                <v-icon icon="mdi-star" color="primary" class="ml-2" v-bind="props" />
              </template>
            </v-tooltip>
          </div>
        </v-card-title>
        <v-card-text v-bind="props" class="pt-4">
          <TagChips class="pb-4 mt-n2" :parent="media" />

          <v-card class="d-flex" color="grey-darken-3" variant="flat">
            <v-card-text class="pb-2">
              <div v-for="file of media.files" class="d-flex justify-space-between mb-2">
                <p dir="rtl" class="text-caption text-truncate">{{ file.substring(1) }}</p>
                <v-tooltip text="Copied !" open-on-click :open-on-hover="false" close-on-content-click>
                  <template #activator="{ props }">
                    <v-icon icon="mdi-content-copy" class="ml-2" @click="copy(file)" v-bind="props" />
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
              :to="{
                name: star.field === Field.Profile ? RouteName.Profile : RouteName.Star,
                params: { id: star.id },
              }">
              {{ star.name }}
            </router-link>
          </div>

          <div class="mt-4 pl-2 border-s-lg" v-if="media.comment">
            {{ media.comment }}
          </div>
        </v-card-text>
        <v-card-actions v-if="isHovering" v-bind="props" class="d-flex justify-end">
          <v-btn class="ml-2" variant="text" @click="openMediaDialog(media)">Edit</v-btn>
        </v-card-actions>
      </template>
    </v-hover>
  </v-card>
</template>

<style lang="scss" scoped>
p[dir='rtl']:after {
  content: '/';
}
</style>
