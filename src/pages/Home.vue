<script setup lang="ts">
import CreateMediaDialog from '@/components/CreateMediaDialog.vue'
import { ref } from 'vue'
import CreateMediaGroupDialog from '@/components/CreateMediaGroupDialog.vue'
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

    <div class="mt-8">
      <v-btn :to="{ name: 'profiles' }">Profiles Page</v-btn>
      <v-btn :to="{ name: 'categories' }">Categories Page</v-btn>
    </div>
  </v-container>
</template>
