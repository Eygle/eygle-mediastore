<script lang="ts" setup>
import { defineProps } from 'vue'
import { MediaDto } from '@/dto/MediaDto'
import TagChips from '@/components/commons/TagChips.vue'

defineProps<{ media: MediaDto }>()
</script>

<template>
  <div>
    <h2>{{ media.name }}</h2>
    <TagChips :tags="media.tags" class="mt-4" />
  </div>
</template>
