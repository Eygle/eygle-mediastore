<script lang="ts" setup>
import {computed, onBeforeMount, ref, watch} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { VDataIterator } from 'vuetify/labs/VDataIterator'
import { MediaGroupDto } from '@/dto/MediaGroupDto'
import MediaGroupCard from '@/components/MediaGroupCard.vue'
import UpsertMediaGroupDialog from '@/components/dialogs/UpsertMediaGroupDialog.vue'
import { useDialogs } from '@/composables/dialogs'
import { useCache } from '@/composables/cache'
import { useApi } from '@/composables/api'
import useToast from '@/composables/toast'

const router = useRouter()
const route = useRoute()
const { fetchMediaGroups } = useApi()
const { getCached, drop } = useCache()
const { openMediaGroupDialog } = useDialogs()
const { toastError } = useToast()

const groups = ref<MediaGroupDto[]>([])
const loading = ref(false)
const page = ref(1)
const search = ref('')
const filter = ref<Filters | null>(null)
const filters = [
  { title: 'None', value: null },
  { title: 'To See', value: 'toSee|nbToSee' },
  { title: 'To Tag', value: 'toTag' },
  { title: 'To Trim', value: 'toTrim' },
  { title: 'To Follow', value: 'toFollow' },
  { title: 'Has best', value: 'nbBest' },
]

onBeforeMount(reload)

const displayedGroups = computed(() => groups.value.filter(v => filter.value ? filter.value.split('|').some(f => v[f]) : true))

async function reload(forceRefresh = false) {
  loading.value = true
  try {
    groups.value = await getCached(route.name!, () => fetchMediaGroups(route.meta.field!), forceRefresh)
  } catch (e) {
    console.error(e)
    toastError()
  }
  loading.value = false
}

function onSave(group: MediaGroupDto) {
  if (!group) {
    return reload(true)
  }
  const idx = groups.value.findIndex(({ id }) => id === group.id)
  if (idx === -1) {
    drop(route.name!)
    return router.push(`${route.path}/${group.id}`)
  }

  groups.value.splice(idx, 1, group)
}

watch(page, () => window.scrollTo({ top: 0, behavior: 'smooth' }))
</script>

<template>
  <teleport to="#toolbar">
    <span class="text-capitalize text-h6">{{ route.name }}</span>
    <v-chip v-if="!loading" class="ml-3">{{ displayedGroups.length }}</v-chip>
    <v-spacer />
    <v-text-field v-model="search" label="search" hide-details density="compact" clearable />
    <div class="ml-4" >
      <v-select v-model="filter" :items="filters" item-title="title" label="Filter" hide-details density="compact"/>
    </div>
    <v-spacer />
    <v-divider vertical class="mx-4 my-n2" />
    <v-btn icon="mdi-reload" :loading="loading" variant="flat" @click="reload(true)" />
  </teleport>
  <v-container class="h-100 d-flex flex-column">
    <div v-if="loading" class="d-flex align-center justify-center flex-grow-1">
      <v-progress-circular indeterminate size="100" />
    </div>
    <template v-else>
      <v-data-iterator :items="displayedGroups" :page="page" :search="search" items-per-page="25">
        <template #default="{ items }">
          <MediaGroupCard v-for="group of items" :key="group.raw.id" :group="group.raw" class="mt-4" />
        </template>
        <template #footer="{ pageCount }">
          <v-pagination v-if="pageCount > 1" v-model="page" :length="pageCount" class="mt-8 mb-4" />
        </template>
      </v-data-iterator>
      <UpsertMediaGroupDialog :field="route.meta.field" @saved="onSave" />
      <v-btn icon="mdi-plus" color="primary" class="fab" size="large" @click="openMediaGroupDialog()" />
    </template>
  </v-container>
</template>
