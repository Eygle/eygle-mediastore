<script lang="ts" setup>
import { onBeforeMount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { VDataIterator } from 'vuetify/labs/VDataIterator'
import { MediaGroupDto } from '@/dto/MediaGroupDto'
import MediaGroupCard from '@/components/commons/MediaGroupCard.vue'
import UpsertMediaGroupDialog from '@/components/UpsertMediaGroupDialog.vue'
import { useDialogs } from '@/composables/dialogs'
import { useCache } from '@/composables/cache'
import { useApi } from '@/composables/api'
import useToast from '@/composables/toast'

const router = useRouter()
const route = useRoute()
const { fetchMediaGroups } = useApi()
const { getCached } = useCache()
const { openMediaGroupDialog } = useDialogs()
const { toastError } = useToast()

const groups = ref<MediaGroupDto[]>([])
const loading = ref(false)
const page = ref(1)
const search = ref('')

onBeforeMount(reload)

async function reload(forceRefresh = false) {
  loading.value = true
  try {
    groups.value = await getCached(route.name, () => fetchMediaGroups(route.meta.field!), forceRefresh)
  } catch (e) {
    console.error(e)
    toastError()
  }
  loading.value = false
}

function onSave(group: MediaGroupDto) {
  const idx = groups.value.findIndex(({ id }) => id === group.id)
  if (idx === -1) return router.push(`${route.path}/${group.id}`)

  groups.value.splice(idx, 1, group)
}

watch(page, () => window.scrollTo({ top: 0, behavior: 'smooth' }))
</script>

<template>
  <teleport to="#toolbar">
    <span class="text-capitalize text-h6">{{ route.name }}</span>
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
    <template v-else>
      <v-data-iterator :items="groups" :page="page" :search="search" items-per-page="25">
        <template #default="{ items }">
          <MediaGroupCard v-for="group of items" :key="group.raw.id" :group="group.raw" class="mt-4" />
        </template>
        <template #footer="{ pageCount, items }">
          <v-pagination v-if="pageCount > 1" v-model="page" :length="pageCount" class="mt-8 mb-4" />
        </template>
      </v-data-iterator>
      <UpsertMediaGroupDialog :field="route.meta.field" @saved="onSave" />
      <v-btn icon="mdi-plus" color="primary" class="fab" size="large" @click="openMediaGroupDialog()" />
    </template>
  </v-container>
</template>
