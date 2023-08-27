<script lang="ts" setup>
import { defineProps } from 'vue'
import { MediaGroupDto } from '@/dto/MediaGroupDto'
import TagChips from '@/components/TagChips.vue'
import { useDialogs } from '@/composables/dialogs'
import StatusIcon from '@/components/StatusIcon.vue'
import StarringList from '@/components/StarringList.vue'

const { openMediaGroupDialog } = useDialogs()

defineProps<{ group: MediaGroupDto; noAction?: boolean }>()
</script>

<template>
  <v-card :to="{ name: group.field, params: { id: group.id } }">
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
              <StatusIcon :group="group" />

              <v-tooltip v-if="group.nbToSee" :text="`${group.nbToSee} media to see`">
                <template #activator="{ props }">
                  <v-badge
                    :content="group.nbToSee"
                    v-bind="props"
                    color="secondary"
                    bordered
                    class="pt-2 ml-2"
                    :class="group.nbToSee < 10 ? 'pr-1' : 'pr-3'">
                    <v-icon icon="mdi-eye" color="secondary" />
                  </v-badge>
                </template>
              </v-tooltip>
              <v-tooltip v-if="group.nbBest" :text="`${group.nbBest} best media`">
                <template #activator="{ props }">
                  <v-badge
                    :content="group.nbBest"
                    v-bind="props"
                    color="primary"
                    bordered
                    class="pt-2 ml-2"
                    :class="group.nbBest < 10 ? 'pr-1' : 'pr-3'">
                    <v-icon icon="mdi-star" color="primary" />
                  </v-badge>
                </template>
              </v-tooltip>
            </v-card-title>
            <v-card-text :class="{ 'pb-0': !group.tags?.length }">
              <TagChips :parent="group" />
              <StarringList v-if="group.starring?.length" :value="group.starring" class="mt-4" />
              <slot />
            </v-card-text>
          </div>
          <v-expand-x-transition>
            <div v-if="isHovering">
              <v-btn icon="mdi-pencil" variant="text" class="mr-2" @click.prevent="openMediaGroupDialog(group)" />
            </div>
          </v-expand-x-transition>
        </div>
      </template>
    </v-hover>
  </v-card>
</template>
