import { Expose } from 'class-transformer'
import { TagDto } from '@/dto/TagDto'
import { MediaGroupDto } from '@/dto/MediaGroupDto'

export class MediaDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  files: string[];

  @Expose()
  toSee: boolean;

  @Expose()
  isBest: boolean;

  @Expose()
  progress: number[];

  @Expose()
  comment: string

  @Expose()
  parent: MediaGroupDto;

  @Expose()
  tags: TagDto[];

  @Expose()
  starring: MediaGroupDto[];
}
