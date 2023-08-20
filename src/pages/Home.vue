<script lang="ts" setup>
import { ref } from 'vue'
import CreateBatchDialog from '@/components/dialogs/CreateBatchDialog.vue'

const isCreateBatchOpened = ref(false)
</script>

<template>
  <v-container>
    <v-btn variant="text" @click="isCreateBatchOpened = true">Create Batch</v-btn>
    <CreateBatchDialog v-model="isCreateBatchOpened" />

  </v-container>
</template>
