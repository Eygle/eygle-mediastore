<script setup lang="ts">
import { ref } from 'vue'

import Toolbar from '@/components/commons/Toolbar.vue'
import Toast from '@/components/commons/Toast.vue'

const miniVariant = ref(false)
</script>

<template>
  <Toolbar @toggle-mini-variant="miniVariant = !miniVariant" />
  <v-main>
    <div class="tw-p-4">
      <router-view />
    </div>
  </v-main>
  <Toast />
</template>
