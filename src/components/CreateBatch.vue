<script lang="ts" setup>
import { computed, defineProps, ref } from 'vue'
import { Field } from '@/types/Field'
import { MediaGroupDto } from '@/dto/MediaGroupDto'
import { plainToInstance } from 'class-transformer'
import { TagDto } from '@/dto/TagDto'
import { useMediaGroupApi } from '@/composables/media-group-api'
import { MediaDto } from '@/dto/MediaDto'

enum Type {
  Profile = 'profile',
  BestByProfile = 'bestByProfile',
  BestByCategories = 'bestByCategories',
}

const { createMedia, createMediaGroup, findMediaGroupByName } = useMediaGroupApi()

const props = defineProps<{ modelValue: boolean }>()
const emits = defineEmits(['update:modelValue'])
const type = ref(Type.BestByCategories)
const entry = ref('')
const toTag = ref(false)
const isSending = ref(false)
const progress = ref(0)
const total = ref(0)

const value = computed({
  get: () => props.modelValue,
  set: (value) => emits('update:modelValue', value),
})

const typeOptions = Object.entries(Type).map(([title, value]) => ({ title, value }))

function submit() {
  switch (type.value) {
    case Type.Profile:
      processProfileBatch()
      break
    case Type.BestByProfile:
      processBestByProfileBatch()
      break
    case Type.BestByCategories:
      processBestByCategoryBatch()
      break
  }
}

async function processBestByCategoryBatch() {
  const mediaList: MediaDto[] = []
  let category: MediaGroupDto | null = null
  let currentMedia: MediaDto | null = null

  isSending.value = true
  for (const line of entry.value.split('\n').filter((l) => Boolean(l.trim()))) {
    if (line.startsWith('#')) {
      const categoryName = line.substring(1).trim()
      category = await createMediaGroup(plainToInstance(MediaGroupDto, { name: categoryName, field: Field.Category }))
    } else if (line.startsWith('/')) {
      if (!currentMedia) {
        currentMedia = plainToInstance(MediaDto, { isBest: true, files: [line.trim()], toSee: isToSee(line) })
        if (category) {
          currentMedia.parent = category
        }
        mediaList.push(currentMedia)
      } else {
        currentMedia.files.push(line.trim())
        if (isToSee(line) && !currentMedia.toSee) {
          currentMedia.toSee = true
        }
      }
    } else if (currentMedia && line.startsWith('>')) {
      currentMedia.tags = extractTags(line)
      currentMedia = null
    } else if (line.startsWith('+')) {
      await extractGuests(line, mediaList[mediaList.length - 1])
    }
  }
  progress.value = 0
  total.value = mediaList.length

  for (const media of mediaList) {
    await createMedia(media)
    progress.value++
  }
  isSending.value = false
  value.value = false
}

async function processBestByProfileBatch() {
  const mediaList: MediaDto[] = []
  let parent = null

  isSending.value = true
  for (const line of entry.value.split('\n').filter((l) => Boolean(l.trim()))) {
    if (line.startsWith('#')) {
      parent = (await findMediaGroupByName(line.substring(1).trim())) || {}
      if (!parent.id) {
        console.log('can\'t find parent', line.substring(1).trim())
      }
      continue
    }
    mediaList.push(
        plainToInstance(MediaDto, { parent: { id: parent.id }, files: [line.trim()], isBest: true, toSee: isToSee(line) }),
    )
  }
  progress.value = 0
  total.value = mediaList.length

  for (const media of mediaList) {
    await createMedia(media)
    progress.value++
  }
  isSending.value = false
  value.value = false
}

async function processProfileBatch() {
  const profiles: MediaGroupDto[] = []

  isSending.value = true
  for (const line of entry.value.split('\n').filter((l) => Boolean(l.trim()))) {
    if (line.startsWith('#')) {
      profiles.push(
          plainToInstance(MediaGroupDto, { name: line.substring(1).trim(), field: Field.Profile, toTag: toTag.value }),
      )
      continue
    }
    const profile = profiles[profiles.length - 1]
    if (line.startsWith('>>')) {
      const [trimmed, count, last] = line.substring(2).split(' - ')

      if (trimmed.trim().toLowerCase() === 'trimmed') {
        profile.trimmed = true
      }
      if (count) {
        const [nbr, total] = count.trim().split('/')
        profile.count = +nbr || undefined
        profile.total = +total || undefined
      }
      if (last) {
        const [, date] = last.match(/last:\s(.*)/i) || []
        if (date) {
          profile.lastEntry = new Date(date)
        }
      }
    } else if (line.startsWith('>')) {
      profile.tags = extractTags(line)
    } else if (line.startsWith('+')) {
      await extractGuests(line, profile)
    }
  }

  progress.value = 0
  total.value = profiles.length

  for (const profile of profiles) {
    await createMediaGroup(profile)
    progress.value++
  }
  isSending.value = false
  value.value = false
}

async function extractGuests(line: string, data: MediaDto | MediaGroupDto) {
  const guest = await findMediaGroupByName(line.substring(1).trim())

  if (guest) {
    data.starring = data.starring || []
    data.starring.push(guest)
  } else {
    const label = `Guest: ${line.substring(1).trim()}`
    data.comment = data.comment ? `${data.comment}\n${label}` : label
  }
}

function extractTags(line: string) {
  const tags = [
    ...new Set(
        line
            .substring(1)
            .trim()
            .split(',')
            .map((tag) => tag.trim().toLowerCase())
            .filter(Boolean),
    ),
  ]
  const idxBest = tags.indexOf('#best')

  if (idxBest !== -1) {
    tags.splice(idxBest, 1)
  }
  return tags.map((title) => plainToInstance(TagDto, { title }))
}

function isToSee(line: string) {
  return !line.includes('/#S/')
}
</script>

<template>
  <v-dialog v-model="value" width="700">
    <v-card>
      <v-card-title>Create Batch</v-card-title>
      <v-card-text>
        <v-select v-model="type" :items="typeOptions" label="Type" />
        <v-textarea v-model="entry" label="Batch" />
        <v-checkbox v-if="type === Type.Profile" v-model="toTag" label="To tag" />
        <v-progress-linear v-if="isSending" :max="total" :model-value="progress" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn :disabled="isSending" @click="value = false">Cancel</v-btn>
        <v-btn :loading="isSending" color="primary" @click="submit">Submit</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
