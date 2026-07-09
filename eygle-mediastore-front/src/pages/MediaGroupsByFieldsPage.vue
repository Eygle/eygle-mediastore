<script setup lang="ts">
import { computed, onBeforeMount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useCache } from '@/composables/cache'
import { useApi, FieldCount } from '@/composables/api'
import useToast from '@/composables/toast'
import { Field } from '@/types/Field'

const FIELD_ICONS: Record<string, string> = {
  [Field.Category]: 'mdi-dots-grid',
  [Field.Movie]: 'mdi-movie-open',
  [Field.Profile]: 'mdi-account-group',
  [Field.Star]: 'mdi-card-account-details-star',
  [Field.TV]: 'mdi-television',
  [Field.Website]: 'mdi-web',
}

const route = useRoute()
const { getCached } = useCache()
const { fetchMediaCountByField, fetchMediaGroupCountByField } = useApi()
const { toastError } = useToast()

const counts = ref<FieldCount[]>([])
const loading = ref(false)

const total = computed(() => counts.value.reduce((sum, { count }) => sum + count, 0))

onBeforeMount(reload)

// The flag routes share this component, so the instance may be reused on
// navigation instead of remounted
watch(
  () => route.name,
  () => {
    if (route.meta.byFields) reload()
  }
)

async function reload(forceRefresh = false) {
  loading.value = true
  try {
    counts.value = await getCached(
      route.name!,
      async () => {
        const [fromMedia, fromGroups] = await Promise.all([
          fetchMediaCountByField(route.name as string),
          route.meta.groups ? fetchMediaGroupCountByField(route.name as string) : Promise.resolve([]),
        ])
        const merged = new Map<Field | null, number>()
        for (const { field, count } of [...fromMedia, ...fromGroups]) {
          merged.set(field, (merged.get(field) ?? 0) + count)
        }
        return [...Object.values(Field), null]
          .filter((field) => merged.has(field))
          .map((field) => ({ field, count: merged.get(field)! }))
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
    <v-chip v-if="!loading" class="ml-3">{{ total }}</v-chip>
    <v-spacer />
    <v-divider vertical class="mx-4 my-n2" />
    <v-btn icon="mdi-reload" :loading="loading" variant="flat" @click="reload(true)" />
  </teleport>
  <v-container class="h-100 d-flex flex-column">
    <div v-if="loading" class="d-flex align-center justify-center flex-grow-1">
      <v-progress-circular indeterminate size="100" />
    </div>
    <template v-else>
      <v-card
        v-for="{ field, count } of counts"
        :key="field ?? 'none'"
        :to="`${route.path}/${field ?? 'none'}`"
        class="mt-4">
        <v-card-title class="d-flex align-center">
          <v-icon :icon="FIELD_ICONS[field!] ?? 'mdi-help-circle-outline'" class="mr-4" />
          <span class="text-capitalize">{{ field ?? 'None' }}</span>
          <v-spacer />
          <v-chip>{{ count }}</v-chip>
        </v-card-title>
      </v-card>
      <div v-if="!counts.length" class="text-center text-grey mt-8">No result</div>
    </template>
  </v-container>
</template>
