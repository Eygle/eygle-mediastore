<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { RouteName } from '@/types/RouteName'

const router = useRouter()

const cards = [
  { route: router.getRoutes().find(({ name }) => name === RouteName.Categories), class: 'bg-indigo-darken-4' },
  { route: router.getRoutes().find(({ name }) => name === RouteName.Profiles), class: 'bg-cyan-darken-4' },
  { route: router.getRoutes().find(({ name }) => name === RouteName.Websites), class: 'bg-teal-darken-4' },
  { route: router.getRoutes().find(({ name }) => name === RouteName.Stars), class: 'bg-deep-purple-darken-3' },
  { route: router.getRoutes().find(({ name }) => name === RouteName.Movies), class: 'bg-purple-darken-4' },
]
</script>

<template>
  <v-container class="h-100 d-flex align-center justify-center">
    <div class="d-flex flex-wrap align-center justify-center">
      <router-link
        v-for="card of cards"
        :to="{ name: card.route!.name }"
        class="bg-purple text-h4 ma-3"
        :class="card.class">
        <v-responsive :aspect-ratio="1" min-width="250" width="100%">
          <div class="h-100 d-flex flex-column align-center justify-center">
            <v-icon :icon="card.route!.meta.icon" class="mb-4" />
            <span class="text-capitalize">{{ card.route!.name!.toString() }}</span>
          </div>
        </v-responsive>
      </router-link>
    </div>
  </v-container>
</template>
