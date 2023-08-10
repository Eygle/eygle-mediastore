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
        <v-card-title class="d-flex align-center" v-bind="props">
          {{ group.name }} <span class="text-caption ml-2" v-if="group.count || group.total">({{ group.count || group.total }})</span>
          <v-spacer />
          <div v-if="group.nbToSee" class="ml-4 d-flex align-center text-secondary">
            <v-icon icon="mdi-eye" size="22" class="mr-1" /> {{ group.nbToSee }}
          </div>
          <div v-if="group.nbBest" class="ml-4 d-flex align-center text-primary">
            <v-icon icon="mdi-star" size="22" class="mr-1" /> {{ group.nbBest }}
          </div>
        </v-card-title>
        <v-card-text v-if="group.tags.length" v-bind="props">
          <TagChips :parent="group" />
        </v-card-text>
        <v-card-actions v-if="isHovering" v-bind="props" class="d-flex justify-end">
          <v-btn variant="text" @click.prevent="openMediaGroupDialog(group)">Edit</v-btn>
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
