<script lang="ts" setup>
import { defineProps } from 'vue'
import { MediaGroupDto } from '@/dto/MediaGroupDto'
import TagChips from '@/components/commons/TagChips.vue'
import MediaCard from '@/components/commons/MediaCard.vue'

defineProps<{ group: MediaGroupDto }>()
</script>

<template>
  <div>
    <h2 class="d-flex">
      {{ group.name }}
      <span v-if="group.count || group.total" class="d-flex align-center ml-2 text-grey">
        <span>({{ group.count || group.total }}</span>
        <span v-if="group.count" class="text-caption ml-2">/ {{ group.total }}</span>
        <span>)</span>
      </span>
      <v-spacer />
      <v-tooltip v-if="group.toFollow" text="To follow">
        <template #activator="{ props }">
          <v-icon icon="mdi-youtube-subscription" color="primary" v-bind="props" />
        </template>
      </v-tooltip>
      <v-tooltip v-if="group.toTag" text="To tag">
        <template #activator="{ props }">
          <v-icon icon="mdi-tag-plus" color="orange-lighten-2" class="ml-2" v-bind="props" />
        </template>
      </v-tooltip>
      <v-tooltip v-if="group.trimmed" text="Trimmed">
        <template #activator="{ props }">
          <v-icon icon="mdi-content-cut" color="green-lighten-2" class="ml-2" v-bind="props" />
        </template>
      </v-tooltip>
    </h2>
    <TagChips :parent="group" class="mt-8" />

    <div class="mt-8">
      <MediaCard v-for="media of group.media" :key="media.id" :media="media" class="mt-4" />
    </div>

    <a v-if="group.externalLink" :href="group.externalLink" target="_blank" class="d-block mt-8">{{ group.externalLink }}</a>

    <div class="mt-8 pl-2 border-s-lg text-pre" v-if="group.comment">
      {{ group.comment }}
    </div>
  </div>
</template>
