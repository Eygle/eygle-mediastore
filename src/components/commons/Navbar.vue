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
      <v-list-item v-for="route in routes" :key="route.name" :to="route" router exact-path>
        <template #prepend>
          <v-icon :icon="route.meta.icon" />
        </template>
        <v-list-item-title v-text="route.name" class="text-capitalize" />
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped lang="scss">
//@import '../../assets/variables.scss';
//
//.v-list-item {
//  &__action {
//    margin-right: unit(4) !important;
//  }
//  &--active {
//    & > * {
//      color: $primary-color;
//    }
//    &::before {
//      opacity: 0 !important;
//    }
//  }
//}
</style>
