import { Expose, Transform, Type } from 'class-transformer'
import { TagDto } from '@/dto/TagDto'
import { Field } from '@/types/Field'
import { MediaDto } from '@/dto/MediaDto'
import { dtoDateToStringTransform } from '@/utils/dtoDateTransform'
import { pluralize } from '@/utils/pluralize'

export class MediaGroupDto {
  @Expose()
  id!: number

  @Expose()
  name!: string

  @Expose()
  field!: Field

  @Expose()
  trimmed!: boolean

  @Expose()
  count?: number

  @Expose()
  total?: number

  @Expose()
  @Transform(dtoDateToStringTransform)
  lastEntry?: string

  @Expose()
  externalLink?: string

  @Expose()
  toFollow!: boolean

  @Expose()
  toTag!: boolean

  @Expose()
  comment!: string | null

  @Expose()
  @Type(() => TagDto)
  tags!: TagDto[]

  @Expose()
  @Type(() => MediaDto)
  media!: MediaDto[]

  @Expose()
  @Type(() => MediaGroupDto)
  @Transform(({ value }) => value ?? [], { toClassOnly: true })
  starring!: MediaGroupDto[]

  @Expose()
  @Type(() => MediaGroupDto)
  parent!: MediaGroupDto

  @Expose()
  @Type(() => MediaGroupDto)
  groups!: MediaGroupDto[]

  get nbBest() {
    return this.media?.filter(({ isBest }) => isBest).length
  }

  get nbToSee() {
    return this.media?.filter(({ toSee }) => toSee).length
  }

  get lastEntryRelativeTime() {
    if (!this.lastEntry) return null
    const totalDays = Math.floor((Date.now() - new Date(this.lastEntry).getTime()) / 1000 / 3600 / 24)
    const years = Math.floor(totalDays / 365)
    const months = Math.floor((totalDays % 365) / 30)
    const days = Math.floor((totalDays % 365) % 30)

    return `${years ? `${pluralize(years, 'year')} ` : ''}${months ? `${pluralize(months, 'month')} ` : ''}${
      days && !years ? pluralize(days, 'day') : ''
    }`
  }
}
