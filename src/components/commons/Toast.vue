<script lang="ts" setup>
import useToast from '@/composables/toast'

const timeout = 10000
const { opened, message, color } = useToast()
</script>

<template>
  <v-snackbar v-model="opened" :color="color" :timeout="timeout">
    <div class="d-flex align-center justify-space-between">
      <div>{{ message }}</div>
      <v-btn icon @click="opened = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </div>
  </v-snackbar>
</template>
