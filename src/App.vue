<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Layout } from '@/types/Layout'

const route = useRoute()

const layout = computed(() => route.meta?.layout || Layout.Default)
</script>

<template>
  <v-app full-height>
    <component :is="layout">
      <RouterView />
    </component>
  </v-app>
</template>
