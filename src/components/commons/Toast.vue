<template>
  <v-snackbar v-model="opened" :timeout="timeout" :color="color">
    <div class="d-flex align-center justify-space-between">
      <div>{{ message }}</div>
      <v-btn icon @click="opened = false"><v-icon>mdi-close</v-icon></v-btn>
    </div>
  </v-snackbar>
</template>

<script setup lang="ts">
import useToast from '@/composables/toast'

const timeout = 10000
const { opened, message, color } = useToast()
</script>
