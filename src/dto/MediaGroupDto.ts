import { Expose } from 'class-transformer'
import { TagDto } from '@/dto/TagDto'
import { Field } from '@/types/Field'
import { MediaDto } from '@/dto/MediaDto'

export class MediaGroupDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  field: Field;

  @Expose()
  trimmed: boolean;

  @Expose()
  count?: number;

  @Expose()
  total?: number;

  @Expose()
  lastEntry: Date;

  @Expose()
  externalLink: string;

  @Expose()
  toFollow: boolean;

  @Expose()
  toTag: boolean;

  @Expose()
  comment: string


  @Expose()
  tags: TagDto[];

  @Expose()
  media: MediaDto[];

  @Expose()
  starring: MediaGroupDto[];
}
