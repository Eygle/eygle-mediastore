<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useCache } from '@/composables/cache'
import { useApi } from '@/composables/api'
import useToast from '@/composables/toast'
import { MediaGroupDto } from '@/dto/MediaGroupDto'
import MediaGroupsByFields from '@/components/MediaGroupsByFields.vue'
import { mergeMediaAndParents } from '@/utils/merge-media-and-parents'

const route = useRoute()
const { getCached } = useCache()
const { fetchMediaList, fetchMediaGroupsList } = useApi()
const { toastError } = useToast()

const groups = ref<MediaGroupDto[]>([])
const loading = ref(false)
const search = ref('')

onBeforeMount(reload)

async function reload(forceRefresh = false) {
  loading.value = true
  try {
    groups.value = await getCached(
      route.name!,
      async () => {
        const [fromMedia, fromGroups] = await Promise.all([
          fetchMediaList(route.name),
          ...(route.meta.groups ? [fetchMediaGroupsList(route.name)] : []),
        ])
        return mergeMediaAndParents(fromMedia, fromGroups)
      },
      forceRefresh
    )
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
  <v-container class="h-100">
    <MediaGroupsByFields :groups="groups" :loading="loading" @refresh="reload(true)" />
  </v-container>
</template>
