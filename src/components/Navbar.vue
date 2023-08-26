<script lang="ts" setup>
import { defineProps, ref } from 'vue'
import { useRouter } from 'vue-router'

type Category = {
  label: string
  items: any[]
}

const router = useRouter()

defineProps<{ miniVariant: boolean }>()

const drawer = ref(true)

const routes = router.getRoutes().filter((r) => r.meta.navbar)
</script>

<template>
  <v-navigation-drawer v-model="drawer" :rail="miniVariant" :expand-on-hover="miniVariant" app clipped>
    <v-list>
      <template v-for="route in routes" :key="route.name">
        <v-divider v-if="route.meta.divider" class="my-4" />
        <v-list-item :to="route" router exact-path>
          <template #prepend>
            <v-icon :icon="route.meta.icon" />
          </template>
          <v-list-item-title v-text="route.name!.toString().replace('-', ' ')" class="text-capitalize" />
        </v-list-item>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>
