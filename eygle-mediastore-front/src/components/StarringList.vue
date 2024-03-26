<script setup lang="ts">
import { Field } from '@/types/Field'
import { RouteName } from '@/types/RouteName'
import { MediaGroupDto } from '@/dto/MediaGroupDto'

defineProps<{ value: MediaGroupDto[] }>()
</script>

<template>
  <div v-if="value.length">
    Starring:
    <template v-for="(star, idx) of value" :key="`star-${star.id}`">
      <span v-if="idx > 0">, </span>
      <router-link
        :to="{ name: star.field === Field.Profile ? RouteName.Profile : RouteName.Star, params: { id: star.id } }">
        {{ star.name }}
      </router-link>
    </template>
  </div>
</template>
