<script lang="ts" setup>
import { useMediaGroupApi } from '@/composables/media-group-api'
import { onBeforeMount, ref } from 'vue'
import { Field } from '@/types/Field'
import { MediaGroupDto } from '@/dto/MediaGroupDto'
import MediaGroupCard from '@/components/commons/MediaGroupCard.vue'
import { TagDto } from '@/dto/TagDto'
import { RouteName } from '@/types/RouteName'

const { fetchTags } = useMediaGroupApi()
const tags = ref<TagDto[]>([])
const loading = ref(false)

onBeforeMount(async () => {
  loading.value = true
  tags.value = await fetchTags()
  loading.value = false
})
</script>

<template>
  <v-container class="h-100 d-flex flex-column">
    <h2>All tags <span v-if="!loading">({{ tags.length }})</span></h2>
    <div v-if="loading" class="d-flex align-center justify-center flex-grow-1">
      <v-progress-circular indeterminate size="100" />
    </div>
    <div v-else class="mt-8 h-100">
      <v-table>
        <tbody>
          <tr v-for="tag of tags" :key="tag.id">
            <td>
              <router-link :to="{ name: RouteName.Tag, params: { id: tag.id } }">{{ tag.title }}</router-link>
            </td>
            <td style="width: 80px"><v-checkbox hide-details /></td>
            <td style="width: 80px"><v-btn icon="mdi-pencil" density="compact" variant="flat" /></td>
          </tr>
        </tbody>
      </v-table>
    </div>
  </v-container>
</template>
