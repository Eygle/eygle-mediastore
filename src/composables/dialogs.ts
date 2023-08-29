import { ref } from 'vue'
import { MediaDto } from '@/dto/MediaDto'
import { MediaGroupDto } from '@/dto/MediaGroupDto'

const upsertMediaDialogOpened = ref(false)
const upsertMediaGroupDialogOpened = ref(false)
const media = ref<MediaDto | undefined>()
const mediaGroup = ref<MediaGroupDto | undefined>()
const mediaGroupDefault = ref<Partial<MediaGroupDto> | undefined>()

export function useDialogs() {
  function openMediaDialog(source?: MediaDto) {
    upsertMediaDialogOpened.value = true
    media.value = source
  }

  function openMediaGroupDialog(source?: MediaGroupDto, defaultValues?: Partial<MediaGroupDto>) {
    upsertMediaGroupDialogOpened.value = true
    mediaGroup.value = source
    mediaGroupDefault.value = defaultValues
  }

  return { media, mediaGroup, mediaGroupDefault, openMediaDialog, openMediaGroupDialog, upsertMediaDialogOpened, upsertMediaGroupDialogOpened}
}
