<script setup lang="ts">
import useConfirm from '@/composables/confirm'

const { opened, options, confirmed } = useConfirm()
</script>

<template>
  <v-dialog v-model="opened" width="700">
    <v-card>
      <v-card-title>{{ options.title }}</v-card-title>
      <v-card-text>{{ options.message }}</v-card-text>
      <v-card-actions class="justify-end">
        <v-btn variant="text" @click="opened = false">Cancel</v-btn>
        <v-btn variant="text" color="primary" @click="confirmed">Confirm</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
