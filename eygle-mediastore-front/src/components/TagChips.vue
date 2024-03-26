<script lang="ts" setup>
import { defineProps } from 'vue'
import { MediaDto } from '@/dto/MediaDto'
import UpsertTagsDialog from '@/components/dialogs/UpsertTagsDialog.vue'
import { MediaGroupDto } from '@/dto/MediaGroupDto'

defineProps<{ parent: MediaDto | MediaGroupDto; editable?: boolean }>()
const emits = defineEmits(['saved'])
</script>

<template>
  <div v-if="parent.tags?.length" class="d-flex flex-wrap">
    <div v-for="(tag, idx) of parent.tags" :key="`tag-${idx}`">
      <v-chip class="mr-2 mb-2">
        {{ tag.title }}
      </v-chip>
    </div>
    <UpsertTagsDialog v-if="!editable" :parent="parent" @saved="emits('saved')" />
  </div>
</template>
