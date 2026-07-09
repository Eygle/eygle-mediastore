<script setup lang="ts">
import { computed, onBeforeMount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCache } from '@/composables/cache'
import { useApi } from '@/composables/api'
import useToast from '@/composables/toast'
import { Field } from '@/types/Field'
import { RouteName } from '@/types/RouteName'
import { MediaGroupDto } from '@/dto/MediaGroupDto'
import MediaGroupCard from '@/components/MediaGroupCard.vue'
import MediaCard from '@/components/MediaCard.vue'
import UpsertMediaGroupDialog from '@/components/dialogs/UpsertMediaGroupDialog.vue'
import { mergeMediaAndParents } from '@/utils/merge-media-and-parents'

const route = useRoute()
const router = useRouter()
const { getCached } = useCache()
const { fetchMediaList, fetchMediaGroupsList } = useApi()
const { toastError } = useToast()

const flag = computed(() => route.meta.flag as string)
const field = computed(() => route.params.field as string)

const groups = ref<MediaGroupDto[]>([])
const loading = ref(false)
const search = ref('')

const displayedGroups = computed(() => {
  const needle = search.value?.toLowerCase().trim()
  if (!needle) return groups.value
  return groups.value.filter(
    (group) =>
      (group.displayName || group.name).toLowerCase().includes(needle) ||
      group.media?.some(({ title }) => title.toLowerCase().includes(needle))
  )
})

onBeforeMount(reload)

// The flag detail routes share this component, so the instance may be reused
// on navigation instead of remounted
watch(
  () => route.fullPath,
  () => {
    if (route.meta.flag) reload()
  }
)

async function reload(forceRefresh = false) {
  loading.value = true
  try {
    groups.value = await getCached(
      `${flag.value}/${field.value}`,
      async () => {
        const [fromMedia, fromGroups] = await Promise.all([
          fetchMediaList(flag.value, field.value),
          ...(route.meta.groups ? [fetchMediaGroupsList(flag.value, field.value)] : []),
        ])
        // Both sources are sorted, but their merge is not
        return mergeMediaAndParents(fromMedia, fromGroups).sort((a, b) =>
          (a.displayName || a.name).localeCompare(b.displayName || b.name)
        )
      },
      forceRefresh
    )
  } catch (e) {
    console.error(e)
    toastError()
  }
  loading.value = false
}

// Detail routes are named after the group's field ('website', 'star', ...);
// fall back to the website route for fields without a dedicated route.
function detailRoute(group: MediaGroupDto) {
  const name = group.field ?? field.value
  return {
    name: Object.values(RouteName).includes(name as RouteName) ? name : RouteName.Website,
    params: { id: group.id },
  }
}
</script>

<template>
  <teleport to="#toolbar">
    <v-btn icon="mdi-arrow-left" variant="flat" @click="router.back()" />
    <span class="text-capitalize text-h6">{{ flag.replace('-', ' ') }} — {{ field }}</span>
    <v-chip v-if="!loading" class="ml-3">{{ displayedGroups.length }}</v-chip>
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
      <template v-for="group of displayedGroups" :key="group.id">
        <MediaGroupCard
          v-if="[Field.Profile, Field.Star].includes(group.field)"
          :group="group"
          include-comment
          class="mt-4 pb-4">
          <MediaCard
            v-for="media of group.media"
            :key="`media-${media.id}`"
            :media="media"
            no-action
            class="mt-4"
            @tags-saved="reload(true)" />
        </MediaGroupCard>
        <template v-else>
          <router-link :to="detailRoute(group)" class="text-h5 d-block mt-8">
            {{ group.displayName || group.name }}
          </router-link>
          <MediaCard
            v-for="media of group.media"
            :key="media.id"
            :media="media"
            no-action
            class="mt-4"
            @tags-saved="reload(true)" />
        </template>
      </template>
      <div v-if="!displayedGroups.length" class="text-center text-grey mt-8">No result</div>
    </template>
  </v-container>
  <UpsertMediaGroupDialog @saved="reload(true)" />
</template>
