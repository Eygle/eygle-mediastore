<script setup lang="ts">
import { MediaDto } from '@/dto/MediaDto'
import { MediaGroupDto } from '@/dto/MediaGroupDto'

defineProps<{ media?: MediaDto; group?: MediaGroupDto; spaced?: boolean }>()
</script>

<template>
  <div>
    <v-tooltip v-if="group?.toFollow" text="To follow">
      <template #activator="{ props }">
        <v-icon icon="mdi-youtube-subscription" color="primary" v-bind="props" />
      </template>
    </v-tooltip>
    <v-tooltip v-if="media?.toTag || group?.toTag" text="To tag">
      <template #activator="{ props }">
        <v-icon icon="mdi-tag-plus" color="orange-lighten-2" :class="spaced ? 'ml-4' : 'ml-2'" v-bind="props" />
      </template>
    </v-tooltip>
    <v-tooltip v-if="media?.toSee" text="To see">
      <template #activator="{ props }">
        <v-icon icon="mdi-eye" color="blue" :class="spaced ? 'ml-4' : 'ml-2'" v-bind="props" />
      </template>
    </v-tooltip>
    <v-tooltip v-if="group?.trimmed" text="Trimmed">
      <template #activator="{ props }">
        <v-icon icon="mdi-content-cut" color="green-lighten-2" :class="spaced ? 'ml-4' : 'ml-2'" v-bind="props" />
      </template>
    </v-tooltip>
    <v-tooltip v-if="media?.isBest" text="Best">
      <template #activator="{ props }">
        <v-icon icon="mdi-star" color="primary" :class="spaced ? 'ml-4' : 'ml-2'" v-bind="props" />
      </template>
    </v-tooltip>
  </div>
</template>
