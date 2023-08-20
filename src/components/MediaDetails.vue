<script lang="ts" setup>
import { defineProps } from 'vue'
import { MediaDto } from '@/dto/MediaDto'
import TagChips from '@/components/TagChips.vue'

defineProps<{ media: MediaDto }>()
</script>

<template>
  <div>
    <h2>{{ media.name }}</h2>
    <TagChips :parent="media" class="mt-4" />
  </div>
</template>
