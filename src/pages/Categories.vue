<script lang="ts" setup>
import { useMediaGroupApi } from '@/composables/media-group-api'
import { onBeforeMount, ref } from 'vue'
import { Field } from '@/types/Field'
import { MediaGroupDto } from '@/dto/MediaGroupDto'

const { fetchMediaGroups } = useMediaGroupApi()
const categories = ref<MediaGroupDto[]>([])

onBeforeMount(async () => (categories.value = await fetchMediaGroups(Field.Category)))
</script>

<template>
  <v-container>
    <v-card v-for="category of categories" :key="category.id" class="mt-4">
      <v-card-title class="d-flex"> {{ category.name }}</v-card-title>
    </v-card>
  </v-container>
</template>
