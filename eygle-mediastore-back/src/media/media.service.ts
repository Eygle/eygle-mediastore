import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import * as path from 'path';
import { Media } from './media.entity';
import { TagService } from '../tag/tag.service';
import { MediaGroupService } from '../media-group/media-group.service';
import { MediaGroup } from '../media-group/media-group.entity';
import { groupByParents } from '../utils/group-by-parents';
import { Tag } from '../tag/tag.entity';
import { compareTitle } from '../utils/compare';
import { EFFECTIVE_FIELD_CTE } from '../utils/effective-field';
import { Field } from '../types/Field';

const FLAG_CONDITIONS = {
  'in-progress': 'media.progress[1] IS NOT NULL',
  'to-see': 'media.to_see',
  'potential-best': 'media.is_potential_best',
  best: 'media.is_best',
  'absolute-best': 'media.is_absolute_best',
  'to-tag': 'media.to_tag',
  commented: 'media.comment IS NOT NULL',
} as const;

export type MediaFlag = keyof typeof FLAG_CONDITIONS;

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media) private mediaRepository: Repository<Media>,
    private mediaGroupService: MediaGroupService,
    private tagService: TagService,
  ) {}

  async create(data: Partial<Media>) {
    data.files = data.files.filter(Boolean);
    if (!data.title && data.files[0]) {
      data.title = path.basename(data.files[0]);
    }

    const entity = this.mediaRepository.create(data);

    for (const tag of entity.tags || []) {
      tag.id = await this.tagService.getOrCreate(tag.title);
    }

    if (entity.tags?.length) {
      await this.mediaGroupService.addTags(entity.parent.id, entity.tags);
    }

    return this.mediaRepository.save(entity);
  }

  getAll(): Promise<Media[]> {
    return this.mediaRepository.find({
      relations: { tags: true },
      relationLoadStrategy: 'query',
    });
  }

  findOneById(id: number) {
    return this.mediaRepository.findOne({
      where: { id },
      relations: { tags: true },
      order: { tags: { title: 'asc' } },
    });
  }

  async getAllWithTag(tagId: number): Promise<MediaGroup[]> {
    const ids = await this.mediaRepository.find({
      where: { tags: { id: tagId } },
      select: { id: true },
    });
    return this.getAllGroupedByParents({ id: In(ids.map(({ id }) => id)) });
  }

  getAllFromParent(parentId: number): Promise<Media[]> {
    return this.mediaRepository.find({
      where: { parent: { id: parentId } },
      relations: { tags: true, starring: true },
      relationLoadStrategy: 'query',
    });
  }

  countByField(flag: MediaFlag): Promise<{ field: Field; count: number }[]> {
    return this.mediaRepository.query(
      `${EFFECTIVE_FIELD_CTE}
       SELECT effective_field.field AS field, COUNT(*)::int AS count
       FROM mediastore.media media
       JOIN effective_field ON effective_field.group_id = media.parent_id
       WHERE ${this.flagCondition(flag)}
       GROUP BY effective_field.field`,
    );
  }

  // field 'none' matches media whose whole parent chain has no field
  async getAllFlagged(flag: MediaFlag, field?: string): Promise<MediaGroup[]> {
    const fieldFilter =
      field === 'none'
        ? ' AND effective_field.field IS NULL'
        : field
          ? ' AND effective_field.field = $1'
          : '';
    const ids = await this.mediaRepository.query(
      `${EFFECTIVE_FIELD_CTE}
       SELECT media.id AS id
       FROM mediastore.media media
       JOIN effective_field ON effective_field.group_id = media.parent_id
       WHERE ${this.flagCondition(flag)}${fieldFilter}`,
      field && field !== 'none' ? [field] : [],
    );
    return this.getAllGroupedByParents({
      id: In(ids.map(({ id }) => id)),
    });
  }

  private flagCondition(flag: MediaFlag): string {
    const condition = FLAG_CONDITIONS[flag];
    if (!condition) throw new BadRequestException(`Unknown flag '${flag}'`);
    return condition;
  }

  async update(id: number, data: Media) {
    data.files = data.files.filter(Boolean);
    if (!data.title && data.files[0]) {
      data.title = path.basename(data.files[0]);
    }

    for (const tag of data.tags || []) {
      tag.id = await this.tagService.getOrCreate(tag.title);
    }

    data.id = id;
    const updated = await this.mediaRepository.preload(data);

    if (data.tags?.length) {
      const media = await this.mediaRepository.findOne({
        where: { id },
        select: { id: true, parent: { id: true } },
        relations: { parent: true },
      });
      await this.mediaGroupService.addTags(media.parent.id, data.tags);
    }

    if (await this.mediaRepository.save(updated)) {
      return this.findOneById(id);
    }
  }

  async updateTags(id: number, tags: Tag[]) {
    const media = await this.mediaRepository.findOne({
      where: { id },
      relations: { parent: true },
    });
    for (const tag of tags || []) {
      tag.id = await this.tagService.getOrCreate(tag.title);
    }
    media.tags = tags;

    if (media.parent && media.tags?.length) {
      await this.mediaGroupService.addTags(media.parent.id, media.tags);
    }

    if (await this.mediaRepository.save(media)) {
      return this.findOneById(id);
    }
  }

  private async getAllGroupedByParents(where: FindOptionsWhere<Media>) {
    // 'query' loads each relation with a separate WHERE IN query instead of
    // joining everything at once, which multiplies rows (media × tags ×
    // parent tags × starring) and makes hydration very slow.
    const mediaList = await this.mediaRepository.find({
      where,
      relations: { tags: true, starring: true, parent: { tags: true } },
      relationLoadStrategy: 'query',
    });

    for (const media of mediaList) {
      media.tags?.sort(compareTitle);
      media.parent?.tags?.sort(compareTitle);
    }
    mediaList.sort(
      (a, b) =>
        (a.parent?.name ?? '').localeCompare(b.parent?.name ?? '') ||
        compareTitle(a, b),
    );

    return this.mediaGroupService.setDisplayNames(groupByParents(mediaList));
  }

  delete(id: number) {
    return this.mediaRepository.delete(id);
  }
}
