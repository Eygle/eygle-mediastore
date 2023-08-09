<script lang="ts" setup>
import { useApi } from '@/composables/api'
import { onBeforeMount, ref } from 'vue'
import { Field } from '@/types/Field'
import { MediaGroupDto } from '@/dto/MediaGroupDto'
import MediaGroupCard from '@/components/commons/MediaGroupCard.vue'

const { fetchMediaGroups } = useApi()
const categories = ref<MediaGroupDto[]>([])

onBeforeMount(async () => (categories.value = await fetchMediaGroups(Field.Category)))
</script>

<template>
  <v-container>
    <h2>Best by categories</h2>
    <MediaGroupCard v-for="(category, idx) in categories" :key="idx" :group="category" class="mt-4" />
  </v-container>
</template>
