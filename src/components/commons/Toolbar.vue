<template>
  <v-app-bar app clipped-left fixed>
    <div class="title-container d-flex flex-row align-center">
      <v-btn class="mr-1" icon @click.stop="$emit('toggle-mini-variant')">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
      <router-link :to="{ name: 'home' }" class="app-title">
        <span v-for="part of formatTitle" :class="{ highlight: part.highlight }">{{ part.text }}</span>
      </router-link>
      <v-spacer />
    </div>
    <v-toolbar-title class="ml-8" v-text="toolbar.title" />
  </v-app-bar>
</template>

<script lang="ts" setup>
import { useToolbar } from '@/composables/toolbar'

const { toolbar } = useToolbar()
const formatTitle: { text: string; highlight?: boolean }[] = 'Eygle Mediastore'
    .split(' ')
    .flatMap((v) => [{ text: v.charAt(0).toUpperCase(), highlight: true }, { text: `${v.slice(1)} ` }])
</script>
