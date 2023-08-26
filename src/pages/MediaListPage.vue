<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useCache } from '@/composables/cache'
import { useApi } from '@/composables/api'
import useToast from '@/composables/toast'
import { MediaGroupDto } from '@/dto/MediaGroupDto'
import MediaGroupsByFields from '@/components/MediaGroupsByFields.vue'

const route = useRoute()
const { getCached } = useCache()
const { fetchMediaList } = useApi()
const { toastError } = useToast()

const groups = ref<MediaGroupDto[]>([])
const loading = ref(false)
const search = ref('')

onBeforeMount(reload)

async function reload(forceRefresh = false) {
  loading.value = true
  try {
    groups.value = await getCached(route.name!, () => fetchMediaList(route.name), forceRefresh)
  } catch (e) {
    console.error(e)
    toastError()
  }
  loading.value = false
}
</script>

<template>
  <teleport to="#toolbar">
    <span class="text-capitalize text-h6">{{ route.name.toString().replace('-', ' ') }}</span>
    <v-chip v-if="!loading" class="ml-3">{{ groups.length }}</v-chip>
    <v-spacer />
    <v-text-field v-model="search" label="search" hide-details density="compact" clearable />
    <v-spacer />
    <v-divider vertical class="mx-4 my-n2" />
    <v-btn icon="mdi-reload" :loading="loading" variant="flat" @click="reload(true)" />
  </teleport>
  <v-container class="h-100 d-flex flex-column">
    <div v-if="loading" class="d-flex align-center justify-center flex-grow-1">
      <v-progress-circular indeterminate size="100" />
    </div>
    <MediaGroupsByFields v-else :groups="groups" />
  </v-container>
</template>
