import { Expose, Transform, TransformationType } from 'class-transformer'
import { TagDto } from '@/dto/TagDto'
import { MediaGroupDto } from '@/dto/MediaGroupDto'
import { durationToString, stringToDuration } from '@/utils/time'

export class MediaDto {
  @Expose()
  id: number

  @Expose()
  title: string

  @Expose()
  files: string[]

  @Expose()
  toSee: boolean

  @Expose()
  isBest: boolean

  @Expose()
  @Transform(
    ({ value, type }) =>
      type === TransformationType.CLASS_TO_CLASS ? value : [durationToString(value[0]), durationToString(value[1])],
    { toClassOnly: true }
  )
  @Transform(({ value }) => [stringToDuration(value[0]), stringToDuration(value[1])], { toPlainOnly: true })
  progress: [string, string]

  @Expose()
  comment: string

  @Expose()
  parent: MediaGroupDto

  @Expose()
  tags: TagDto[]

  @Expose()
  starring: MediaGroupDto[]
}
