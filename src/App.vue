<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Layout } from '@/types/Layout'

const layout = computed(() => useRoute()?.meta?.layout || Layout.Default)
</script>

<template>
  <v-app full-height>
    <component :is="layout">
      <RouterView />
    </component>
  </v-app>
</template>
