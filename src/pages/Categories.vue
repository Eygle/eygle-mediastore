<script lang="ts" setup>
import { useMediaGroupApi } from '@/composables/media-group-api'
import { onBeforeMount, ref } from 'vue'
import { Field } from '@/types/Field'
import { MediaGroupDto } from '@/dto/MediaGroupDto'
import { RouteName } from '@/types/RouteName'

const { fetchMediaGroups } = useMediaGroupApi()
const categories = ref<MediaGroupDto[]>([])

onBeforeMount(async () => (categories.value = await fetchMediaGroups(Field.Category)))
</script>

<template>
  <v-container>
    <h2>Best by categories</h2>
    <v-card v-for="({ id, name }) in categories" :key="id" :to="{ name: RouteName.Category, params: { id } }" class="mt-4">
      <v-card-title class="d-flex"> {{ name }}</v-card-title>
    </v-card>
  </v-container>
</template>
