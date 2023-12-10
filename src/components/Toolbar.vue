<script lang="ts" setup>
import { RouteName } from '@/types/RouteName'

const formatTitle: { text: string; highlight?: boolean }[] = 'Eygle Mediastore'
  .split(' ')
  .flatMap((v) => [{ text: v.charAt(0).toUpperCase(), highlight: true }, { text: `${v.slice(1)} ` }])
</script>

<template>
  <v-app-bar app clipped-left fixed>
    <div class="title-container d-flex flex-row align-center">
      <v-btn icon="mdi-menu" class="mr-1" @click.stop="$emit('toggle-mini-variant')" />
      <router-link :to="{ name: RouteName.Home }" class="app-title">
        <span v-for="part of formatTitle" :class="{ highlight: part.highlight }">{{ part.text }}</span>
      </router-link>
      <v-spacer />
    </div>
    <v-divider vertical />
    <div id="toolbar" class="d-flex align-center flex-grow-1 px-4" />
  </v-app-bar>
</template>

<style scoped>
.title-container {
  width: 256px;
}
</style>
