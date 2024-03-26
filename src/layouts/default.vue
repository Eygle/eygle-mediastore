<script lang="ts" setup>
import { ref } from 'vue'

import Toolbar from '@/components/Toolbar.vue'
import Toast from '@/components/Toast.vue'
import Navbar from '@/components/Navbar.vue'

const miniVariant = ref(false)
</script>

<template>
  <Toolbar @toggle-mini-variant="miniVariant = !miniVariant" />
  <Navbar :mini-variant="miniVariant" />
  <v-main>
    <div class="tw-p-4 h-100">
      <router-view />
    </div>
  </v-main>
  <Toast />
</template>
