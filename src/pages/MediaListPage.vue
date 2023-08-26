<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'
import { VDataIterator } from 'vuetify/labs/VDataIterator'
import { MediaDto } from '@/dto/MediaDto'
import { useCache } from '@/composables/cache'
import { useApi } from '@/composables/api'
import useToast from '@/composables/toast'
import MediaCard from '@/components/MediaCard.vue'

const route = useRoute()
const { getCached } = useCache()
const { fetchMediaList } = useApi()
const { toastError } = useToast()

const mediaList = ref<MediaDto[]>([])
const loading = ref(false)
const page = ref(1)
const search = ref('')

onBeforeMount(reload)

async function reload(forceRefresh = false) {
  loading.value = true
  try {
    mediaList.value = await getCached(route.name!, () => fetchMediaList(route.name), forceRefresh)
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
    <v-chip v-if="!loading" class="ml-3">{{ mediaList.length }}</v-chip>
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
    <template v-else>
      <v-data-iterator :items="mediaList" :page="page" :search="search" items-per-page="25">
        <template #default="{ items }">
          <MediaCard v-for="media of items" :key="media.raw.id" :media="media.raw" no-action class="mt-4" />
        </template>
        <template #footer="{ pageCount }">
          <v-pagination v-if="pageCount > 1" v-model="page" :length="pageCount" class="mt-8 mb-4" />
        </template>
      </v-data-iterator>
    </template>
  </v-container>
</template>
