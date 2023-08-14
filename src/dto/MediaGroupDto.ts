import { Expose, Transform, TransformationType, Type } from 'class-transformer'
import { TagDto } from '@/dto/TagDto'
import { Field } from '@/types/Field'
import { MediaDto } from '@/dto/MediaDto'
import { dtoDateTransform } from '@/utils/dtoDateTransform'

export class MediaGroupDto {
  @Expose()
  id: number

  @Expose()
  name: string

  @Expose()
  field: Field

  @Expose()
  trimmed: boolean

  @Expose()
  count?: number

  @Expose()
  total?: number

  @Expose()
  @Transform(dtoDateTransform)
  lastEntry: Date

  @Expose()
  externalLink: string

  @Expose()
  toFollow: boolean

  @Expose()
  toTag: boolean

  @Expose()
  comment: string

  @Expose()
  @Type(() => TagDto)
  tags: TagDto[]

  @Expose()
  @Type(() => MediaDto)
  media: MediaDto[]

  @Expose()
  @Type(() => MediaDto)
  starring: MediaGroupDto[]

  get nbBest() {
    return this.media?.filter(({ isBest }) => isBest).length
  }

  get nbToSee() {
    return this.media?.filter(({ toSee }) => toSee).length
  }
}
