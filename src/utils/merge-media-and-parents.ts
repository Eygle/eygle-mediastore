import { MediaGroupDto } from '@/dto/MediaGroupDto'

// Set media under groups
export function mergeMediaAndParents(fromMedia: MediaGroupDto[], fromGroups: MediaGroupDto[] = []) {
  for (const parent of fromMedia) {
    const found = fromGroups.find(({ id }) => id === parent.id)

    if (found) {
      if (!found.media) {
        found.media = []
      }
      found.media.push(...parent.media)
    } else {
      fromGroups.push(parent)
    }
  }

  return fromGroups
}
