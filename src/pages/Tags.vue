<script lang="ts" setup>
import { computed, onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '@/composables/api'
import { TagDto } from '@/dto/TagDto'
import { VDataTable } from 'vuetify/labs/VDataTable'
import MergeTagsDialog from '@/components/MergeTagsDialog.vue'
import { RouteName } from '@/types/RouteName'

const route = useRoute()
const { fetchTags } = useApi()

const tags = ref<TagDto[]>([])
const loading = ref(false)
const search = ref('')
const selectedIds = ref<number[]>([])
const headers = [{ key: 'title' }, { key: 'edit', align: 'end', width: '40px' }, { key: 'delete', align: 'end', width: '40px'}]

const selected = computed(() => selectedIds.value.map((tagId) => tags.value.find(({ id }) => id === tagId)))

onBeforeMount(reload)

async function reload() {
  loading.value = true
  tags.value = await fetchTags()
  loading.value = false
}
</script>

<template>
  <teleport to="#toolbar">
    <span class="text-capitalize text-h6">{{ route.name }}</span>
    <v-chip v-if="!loading" class="ml-3">{{ tags.length }}</v-chip>
    <v-spacer />
    <v-text-field v-model="search" label="search" hide-details density="compact" />
    <v-spacer />
    <MergeTagsDialog :tags="selected" @save="reload">
      <template #activator="{ props }">
        <v-badge v-if="selectedIds.length" :content="selectedIds.length" offset-x="5" offset-y="5">
          <v-btn icon="mdi-axis-z-arrow" variant="flat" v-bind="props" />
        </v-badge>
      </template>
    </MergeTagsDialog>
    <v-divider vertical class="mx-4 my-n2" />
    <v-btn icon="mdi-reload" :loading="loading" variant="flat" @click="reload()" />
  </teleport>
  <v-container class="h-100 d-flex flex-column">
    <div v-if="loading" class="d-flex align-center justify-center flex-grow-1">
      <v-progress-circular indeterminate size="100" />
    </div>
    <div v-else class="mt-8 h-100">
      <v-data-table
        v-model="selectedIds"
        :items="tags"
        :headers="headers"
        :search="search"
        items-per-page="25"
        show-select
        density="compact">
        <template #item.title="{ item }">
          <router-link :to="{ name: RouteName.Tag, params: { id: item.raw.id } }">{{ item.raw.title }}</router-link>
        </template>
        <template #item.edit="{ item }">
          <v-btn icon="mdi-pencil" density="compact" variant="flat" />
        </template>
        <template #item.delete="{ item }">
          <v-btn icon="mdi-delete" density="compact" variant="flat" />
        </template>
      </v-data-table>
    </div>
  </v-container>
</template>
