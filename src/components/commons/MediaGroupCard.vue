<script lang="ts" setup>
import { defineProps } from 'vue'
import { MediaGroupDto } from '@/dto/MediaGroupDto'
import TagChips from '@/components/commons/TagChips.vue'
import { useRoute } from 'vue-router'

defineProps<{ group: MediaGroupDto }>()

const route = useRoute()
</script>

<template>
  <v-card :to="`${route.path}/${group.id}`" :class="{ trimmed: group.trimmed, 'to-tag': group.toTag }">
    <v-card-title class="d-flex">
      {{ group.name }}
      <v-spacer />
      <span v-if="group.count || group.total">{{ group.count || group.total }}</span>
    </v-card-title>
    <v-card-text v-if="group.tags.length">
      <TagChips :tags="group.tags" :media="group.media" />
    </v-card-text>
  </v-card>
</template>

<style lang="scss" scoped>
.trimmed {
  background-color: rgba(76, 175, 80, 0.1);
}

.to-tag {
  background-color: rgba(255, 152, 0, 0.1);
}
</style>
