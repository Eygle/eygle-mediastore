import { ref } from 'vue'
import { MediaDto } from '@/dto/MediaDto'
import { MediaGroupDto } from '@/dto/MediaGroupDto'

const upsertMediaDialogOpened = ref(false)
const upsertMediaGroupDialogOpened = ref(false)
const media = ref<MediaDto | undefined>()
const mediaGroup = ref<MediaGroupDto | undefined>()

export function useDialogs() {
  function openMediaDialog(source?: MediaDto) {
    upsertMediaDialogOpened.value = true
    media.value = source
  }

  function openMediaGroupDialog(source?: MediaGroupDto) {
    upsertMediaGroupDialogOpened.value = true
    mediaGroup.value = source
  }

  return { media, mediaGroup, openMediaDialog, openMediaGroupDialog, upsertMediaDialogOpened, upsertMediaGroupDialogOpened}
}
