<script lang="ts" setup>
import { computed, defineProps } from 'vue'
import { MediaDto } from '@/dto/MediaDto'
import UpsertTagsDialog from '@/components/commons/UpsertTagsDialog.vue'
import { MediaGroupDto } from '@/dto/MediaGroupDto'
import { TagDto } from '@/dto/TagDto'

const props = defineProps<{ parent: MediaDto | MediaGroupDto; tags?: TagDto[]; editable?: boolean }>()

const tags = computed(() => props.tags || props.parent.tags)

function removeTag(tagIdx: number) {
  if (props.editable) {
    tags.value.splice(tagIdx, 1)
  }
}
</script>

<template>
  <div v-if="tags?.length" class="d-flex flex-wrap">
    <div v-if="parent.media?.some(({ isBest }) => isBest)">
      <v-chip color="primary" class="mr-2 mb-2">#best</v-chip>
    </div>
    <div v-for="(tag, idx) of tags" :key="`tag-${idx}`">
      <v-chip
        :closable="editable"
        :color="editable && !tag.id ? 'green-lighten-2' : ''"
        class="mr-2 mb-2"
        @click:close="removeTag(idx)">
        {{ tag.title }}
      </v-chip>
    </div>
    <UpsertTagsDialog v-if="!editable" :parent="parent" />
  </div>
</template>
