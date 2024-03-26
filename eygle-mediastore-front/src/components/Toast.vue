<script lang="ts" setup>
import useToast from '@/composables/toast'

const { opened, message, color, timeout } = useToast()
</script>

<template>
  <v-snackbar v-model="opened" :color="color" :timeout="timeout">
    {{ message }}
    <template #actions>
      <v-icon @click="opened = false"> mdi-close </v-icon>
    </template>
  </v-snackbar>
</template>
