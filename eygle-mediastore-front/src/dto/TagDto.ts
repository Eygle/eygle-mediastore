import { Expose } from 'class-transformer'

export class TagDto {
  @Expose()
  id!: number

  @Expose()
  title!: string

  @Expose()
  count?: number
}
