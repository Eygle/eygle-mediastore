<script lang="ts" setup>
import { defineProps } from 'vue'
import { MediaGroupDto } from '@/dto/MediaGroupDto'
import TagChips from '@/components/commons/TagChips.vue'
import { useRoute } from 'vue-router'
import { useDialogs } from '@/composables/dialogs'

const route = useRoute()
const { openMediaGroupDialog } = useDialogs()

defineProps<{ group: MediaGroupDto }>()
</script>

<template>
  <v-card :to="`${route.path}/${group.id}`" :class="{ trimmed: group.trimmed, 'to-tag': group.toTag }">
    <v-hover>
      <template #default="{ isHovering, props }">
        <v-card-title class="d-flex" v-bind="props">
          {{ group.name }}
          <v-spacer />
          <span v-if="group.count || group.total">{{ group.count || group.total }}</span>
        </v-card-title>
        <v-card-text v-if="group.tags.length" v-bind="props">
          <TagChips :parent="group" />
        </v-card-text>
        <v-card-actions v-if="isHovering" v-bind="props" class="d-flex justify-end">
          <v-btn class="ml-2" variant="text" @click="openMediaGroupDialog(group)">Edit</v-btn>
        </v-card-actions>
      </template>
    </v-hover>
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
