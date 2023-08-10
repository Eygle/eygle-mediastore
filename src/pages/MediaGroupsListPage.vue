<script lang="ts" setup>
import { computed, onBeforeMount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { VDataIterator } from 'vuetify/labs/VDataIterator'
import { MediaGroupDto } from '@/dto/MediaGroupDto'
import MediaGroupCard from '@/components/commons/MediaGroupCard.vue'
import UpsertMediaGroupDialog from '@/components/UpsertMediaGroupDialog.vue'
import { useDialogs } from '@/composables/dialogs'
import { useCache } from '@/composables/cache'
import { useApi } from '@/composables/api'

const router = useRouter()
const route = useRoute()
const { fetchMediaGroups } = useApi()
const { getCached } = useCache()
const { openMediaGroupDialog } = useDialogs()

const groups = ref<MediaGroupDto[]>([])
const loading = ref(false)
const page = ref(1)
const itemsPerPage = 25

onBeforeMount(() => reload())

const totalPages = computed(() => Math.ceil(groups.value.length / itemsPerPage))

async function reload(forceRefresh = false) {
  loading.value = true
  groups.value = await getCached(route.meta.field, () => fetchMediaGroups(route.meta.field), forceRefresh)
  loading.value = false
}

function onSave(group: MediaGroupDto) {
  const idx = groups.value.findIndex(({ id }) => id === group.id)
  if (idx === -1) return router.push(`${route.path}/${group.id}`)

  groups.value.splice(idx, 1, group)
}
</script>

<template>
  <v-container class="h-100 d-flex flex-column">
    <div v-if="loading" class="d-flex align-center justify-center flex-grow-1">
      <v-progress-circular indeterminate size="100" />
    </div>
    <template v-else>
      <v-data-iterator :items="groups" :page="page" :items-per-page="itemsPerPage">
        <template #default="{ items }">
          <MediaGroupCard v-for="group of items" :key="group.raw.id" :group="group.raw" class="mt-4" />
        </template>
        <template #footer>
          <v-pagination v-if="totalPages > 1" v-model="page" :length="totalPages" class="mt-8 mb-4" />
        </template>
      </v-data-iterator>
      <UpsertMediaGroupDialog :field="route.meta.field" @saved="onSave" />
      <v-btn icon="mdi-plus" color="primary" class="fab" size="large" @click="openMediaGroupDialog()" />
    </template>
  </v-container>
</template>
