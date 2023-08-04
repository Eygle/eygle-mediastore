<script lang="ts" setup>
import { defineProps } from 'vue'
import { TagDto } from '@/dto/TagDto'
import { MediaDto } from '@/dto/MediaDto'

defineProps<{ tags?: TagDto[]; media?: MediaDto[] }>()
</script>

<template>
  <div v-if="tags?.length">
    <v-chip v-if="media?.some(({ isBest }) => isBest)" color="primary" class="mr-2 mb-2">#best</v-chip>
    <v-chip v-for="tag of tags" :key="`tag-${tag.id}`" class="mr-2 mb-2">
      {{ tag.title }}
    </v-chip>
  </div>
</template>
