<script lang="ts" setup>
import { computed, onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '@/composables/api'
import { TagDto } from '@/dto/TagDto'
import { VDataTable } from 'vuetify/labs/VDataTable'
import MergeTagsDialog from '@/components/dialogs/MergeTagsDialog.vue'
import { RouteName } from '@/types/RouteName'
import { instanceToInstance } from 'class-transformer'
import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue'
import useConfirm from '@/composables/confirm'
import useToast from '@/composables/toast'

const route = useRoute()
const { fetchTags, updateTag, deleteTag } = useApi()
const { confirm } = useConfirm()
const { toastError } = useToast()

const tags = ref<TagDto[]>([])
const loading = ref(false)
const updateLoading = ref(false)
const search = ref('')
const page = ref(1)
const selectedIds = ref<number[]>([])
const headers = [
  { key: 'title', title: 'Tag' },
  { key: 'count', title: 'Count' },
  { key: 'edit', align: 'end', width: '40px' },
  { key: 'delete', align: 'end', width: '40px' },
]
const editForm = ref<TagDto | null>()

const selected = computed(() => selectedIds.value.map((tagId) => tags.value.find(({ id }) => id === tagId)))

onBeforeMount(reload)

async function reload() {
  loading.value = true
  selectedIds.value = []
  tags.value = await fetchTags()
  loading.value = false
}

function toggleTagUpdate(tag: TagDto) {
  if (editForm.value?.id === tag.id) {
    editForm.value = null
    return
  }
  editForm.value = instanceToInstance(tag)
}

async function updateCurrentTag() {
  if (!editForm.value?.title) return
  if (tags.value.find(({ title }) => title === editForm.value!.title.toLocaleLowerCase().trim())) {
    toastError('Tag already exists')
    return
  }
  updateLoading.value = true
  try {
    if (await updateTag(editForm.value!)) {
      tags.value.find(({ id }) => id === editForm.value!.id).title = editForm.value!.title
      editForm.value = null
    }
  } catch (e) {
    toastError()
    console.error(e)
  }
  updateLoading.value = false
}

async function remove(tag) {
  await deleteTag(tag)
  return reload()
}
</script>

<template>
  <teleport to="#toolbar">
    <span class="text-capitalize text-h6">{{ route.name }}</span>
    <v-chip v-if="!loading" class="ml-3">{{ tags.length }}</v-chip>
    <v-spacer />
    <v-text-field v-model="search" label="search" hide-details density="compact" clearable />
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
        v-model:page="page"
        :items="tags"
        :headers="headers"
        :search="search"
        :page="page"
        items-per-page="25"
        show-select
        density="compact"
      >
        <template #item.title="{ item }">
          <v-form v-if="editForm?.id === item.raw.id" @submit.prevent="updateCurrentTag()">
            <v-text-field
              v-model="editForm.title"
              density="compact"
              hide-details
              :loading="updateLoading"
              autofocus
              @keydown.esc="editForm = null" />
          </v-form>
          <router-link v-else :to="{ name: RouteName.Tag, params: { id: item.raw.id } }">{{
            item.raw.title
          }}</router-link>
        </template>
        <template #item.edit="{ item }">
          <v-btn
            :icon="editForm?.id === item.raw.id ? 'mdi-close' : 'mdi-pencil'"
            density="compact"
            variant="flat"
            @click="toggleTagUpdate(item.raw)" />
        </template>
        <template #item.delete="{ item }">
          <v-btn
            icon="mdi-delete"
            density="compact"
            variant="flat"
            @click="confirm('Delete tag', `Do you want to delete '${item.raw.title}'?`, () => remove(item.raw))" />
        </template>
      </v-data-table>
    </div>
  </v-container>
  <ConfirmDialog />
</template>
