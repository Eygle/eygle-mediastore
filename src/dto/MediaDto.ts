import { Expose, Transform, TransformationType } from 'class-transformer'
import { TagDto } from '@/dto/TagDto'
import { MediaGroupDto } from '@/dto/MediaGroupDto'
import { durationToString, stringToDuration } from '@/utils/time'

export class MediaDto {
  @Expose()
  id!: number

  @Expose()
  title!: string

  @Expose()
  files!: string[]

  @Expose()
  toSee!: boolean

  @Expose()
  isBest!: boolean

  @Expose()
  toTag!: boolean

  @Expose()
  externalLink?: string

  @Expose()
  @Transform(({ value, type }) => {
    if (type === TransformationType.CLASS_TO_CLASS) return value || [null, null]
    if (type === TransformationType.CLASS_TO_PLAIN) return [stringToDuration(value[0]), stringToDuration(value[1])]
    return [durationToString(value?.[0]), durationToString(value?.[1])]
  })
  progress!: [string | null, string | null]

  @Expose()
  comment?: string

  @Expose()
  parent!: MediaGroupDto

  @Expose()
  tags!: TagDto[]

  @Expose()
  starring?: MediaGroupDto[]
}
