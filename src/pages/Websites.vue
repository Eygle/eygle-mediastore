<script lang="ts" setup>
import { useApi } from '@/composables/api'
import { onBeforeMount, ref } from 'vue'
import { Field } from '@/types/Field'
import { MediaGroupDto } from '@/dto/MediaGroupDto'
import MediaGroupCard from '@/components/commons/MediaGroupCard.vue'

const { fetchMediaGroups } = useApi()
const websites = ref<MediaGroupDto[]>([])

onBeforeMount(async () => (websites.value = await fetchMediaGroups(Field.Website)))
</script>

<template>
  <v-container>
    <h2>Best by websites</h2>
    <MediaGroupCard v-for="(website, idx) in websites" :key="idx" :group="website" class="mt-4" />
  </v-container>
</template>
