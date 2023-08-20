<script lang="ts" setup>
import { defineProps } from 'vue'
import { MediaGroupDto } from '@/dto/MediaGroupDto'
import TagChips from '@/components/TagChips.vue'
import { useDialogs } from '@/composables/dialogs'

const { openMediaGroupDialog } = useDialogs()

defineProps<{ group: MediaGroupDto; noAction?: boolean }>()
</script>

<template>
  <v-card
    :to="{ name: group.field, params: { id: group.id } }"
    :class="{ trimmed: group.trimmed, 'to-tag': group.toTag }">
    <v-hover :disabled="noAction">
      <template #default="{ isHovering, props }">
        <div class="d-flex align-center" v-bind="props">
          <div class="flex-grow-1">
            <v-card-title class="d-flex align-center">
              {{ group.name }}
              <span class="text-caption ml-2" v-if="group.count || group.total">
                ({{ group.count || group.total }})
              </span>
              <v-spacer />
              <div v-if="group.nbToSee" class="ml-4 d-flex align-center text-secondary">
                <v-icon icon="mdi-eye" size="22" class="mr-1" /> {{ group.nbToSee }}
              </div>
              <div v-if="group.nbBest" class="ml-4 d-flex align-center text-primary">
                <v-icon icon="mdi-star" size="22" class="mr-1" /> {{ group.nbBest }}
              </div>
            </v-card-title>
            <v-card-text :class="{ 'pb-0': !group.tags?.length }">
              <TagChips :parent="group" />
              <slot />
            </v-card-text>
          </div>
          <v-expand-x-transition>
            <div v-if="isHovering">
              <v-btn
                icon="mdi-pencil"
                size="x-large"
                variant="flat"
                class="mx-4"
                @click.prevent="openMediaGroupDialog(group)" />
            </div>
          </v-expand-x-transition>
        </div>
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
