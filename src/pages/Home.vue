<script lang="ts" setup>
import CreateMediaDialog from '@/components/CreateMediaDialog.vue'
import { ref } from 'vue'
import CreateMediaGroupDialog from '@/components/UpsertMediaGroupDialog.vue'
import CreateBatch from '@/components/CreateBatch.vue'

const isCreateMediaDialogOpened = ref(false)
const isCreateMediaGroupDialogOpened = ref(false)
const isCreateBatchOpened = ref(false)
</script>

<template>
  <v-container>
    <v-btn variant="text" @click="isCreateMediaDialogOpened = true">Create Media</v-btn>
    <v-btn variant="text" @click="isCreateMediaGroupDialogOpened = true">Create Media Group</v-btn>
    <v-btn variant="text" @click="isCreateBatchOpened = true">Create Batch</v-btn>
    <CreateMediaDialog v-model="isCreateMediaDialogOpened" />
    <CreateMediaGroupDialog v-model="isCreateMediaGroupDialogOpened" />
    <CreateBatch v-model="isCreateBatchOpened" />

  </v-container>
</template>
