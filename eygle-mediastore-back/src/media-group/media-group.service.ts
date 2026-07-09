import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Raw, Repository } from 'typeorm';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import { MediaGroup } from './media-group.entity';
import { TagService } from '../tag/tag.service';
import { Field } from '../types/Field';
import { Tag } from '../tag/tag.entity';
import { compareName, compareTitle } from '../utils/compare';
import { EFFECTIVE_FIELD_CTE } from '../utils/effective-field';

const FLAG_CONDITIONS = {
  'to-tag': 'media_group.to_tag',
  commented: 'media_group.comment IS NOT NULL',
} as const;

export type MediaGroupFlag = keyof typeof FLAG_CONDITIONS;

@Injectable()
export class MediaGroupService {
  constructor(
    @InjectRepository(MediaGroup)
    private mediaGroupRepository: Repository<MediaGroup>,
    @Inject(forwardRef(() => TagService)) private tagService: TagService,
  ) {}

  async create(data: Partial<MediaGroup>) {
    const entity = this.mediaGroupRepository.create(data);

    for (const tag of entity.tags || []) {
      tag.id = await this.tagService.getOrCreate(tag.title);
    }
    return this.mediaGroupRepository.save(entity);
  }

  async getAll() {
    const groups = await this.mediaGroupRepository.find({
      relations: { tags: true, media: true },
      relationLoadStrategy: 'query',
      order: { name: 'asc' },
    });
    for (const group of groups) group.tags?.sort(compareTitle);
    return groups;
  }

  async getAllByField(field: Field) {
    const groups = await this.mediaGroupRepository.find({
      where: { field },
      relations: { tags: true, media: true, starring: true },
      relationLoadStrategy: 'query',
    });
    groups.sort((a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
    );
    for (const group of groups) group.tags?.sort(compareTitle);
    return groups;
  }

  async getAllWithTag(tagId: number): Promise<MediaGroup[]> {
    const res = await this.mediaGroupRepository.find({
      where: { tags: { id: tagId } },
      select: { id: true },
    });
    return this.getAllWithTagsAndStarring({
      id: In(res.map(({ id }) => id)),
    });
  }

  async findOneById(id: number) {
    const group = await this.mediaGroupRepository.findOne({
      where: { id },
      relations: {
        tags: true,
        media: { tags: true, starring: true },
        groups: { tags: true, media: true },
        starring: true,
        starringMedia: { tags: true, parent: true },
      },
      relationLoadStrategy: 'query',
    });
    if (!group) return group;

    // The 'query' strategy cannot load the self-referencing parent relation
    // ("table name MediaGroup specified more than once"), so the group's own
    // parent is fetched separately with the default join strategy. The parent
    // of group.media and group.groups is this group by definition.
    const { parent } = await this.mediaGroupRepository.findOne({
      where: { id },
      relations: { parent: true },
    });
    group.parent = parent;

    const asParent = { ...group, parent: undefined } as MediaGroup;
    delete asParent.tags;
    delete asParent.media;
    delete asParent.groups;
    delete asParent.starring;
    delete asParent.starringMedia;
    for (const media of group.media || []) media.parent = asParent;
    for (const child of group.groups || []) child.parent = asParent;

    group.tags?.sort(compareTitle);
    group.media?.sort(compareTitle);
    group.groups?.sort(compareName);
    for (const media of group.media || []) media.tags?.sort(compareTitle);
    for (const child of group.groups || []) child.tags?.sort(compareTitle);
    return group;
  }

  findOneByName(name: string) {
    return this.mediaGroupRepository.findOne({
      where: {
        name: Raw(
          (alias) =>
            `LOWER(${alias}) LIKE '${name.toLocaleLowerCase().trim()}'`,
        ),
      },
    });
  }

  findAllByName(name: string, fields: Field[]) {
    return this.mediaGroupRepository.find({
      where: {
        name: Raw(
          (alias) =>
            `LOWER(${alias}) LIKE '${name.toLocaleLowerCase().trim()}%'`,
        ),
        ...(fields ? { field: In([Field.Profile, Field.Star]) } : undefined),
      },
    });
  }

  countByField(
    flag: MediaGroupFlag,
  ): Promise<{ field: Field; count: number }[]> {
    return this.mediaGroupRepository.query(
      `${EFFECTIVE_FIELD_CTE}
       SELECT effective_field.field AS field, COUNT(*)::int AS count
       FROM mediastore.media_group media_group
       JOIN effective_field ON effective_field.group_id = media_group.id
       WHERE ${this.flagCondition(flag)}
       GROUP BY effective_field.field`,
    );
  }

  // field 'none' matches groups whose whole parent chain has no field
  async getAllFlagged(
    flag: MediaGroupFlag,
    field?: string,
  ): Promise<MediaGroup[]> {
    const fieldFilter =
      field === 'none'
        ? ' AND effective_field.field IS NULL'
        : field
          ? ' AND effective_field.field = $1'
          : '';
    const ids = await this.mediaGroupRepository.query(
      `${EFFECTIVE_FIELD_CTE}
       SELECT media_group.id AS id
       FROM mediastore.media_group media_group
       JOIN effective_field ON effective_field.group_id = media_group.id
       WHERE ${this.flagCondition(flag)}${fieldFilter}`,
      field && field !== 'none' ? [field] : [],
    );
    return this.getAllWithTagsAndStarring({
      id: In(ids.map(({ id }) => id)),
    });
  }

  private flagCondition(flag: MediaGroupFlag): string {
    const condition = FLAG_CONDITIONS[flag];
    if (!condition) throw new BadRequestException(`Unknown flag '${flag}'`);
    return condition;
  }

  // Sets displayName ("Ancestor - Parent - Name") on each group and sorts by
  // it, so nested groups appear next to their parent in flat listings
  async setDisplayNames(groups: MediaGroup[]): Promise<MediaGroup[]> {
    if (!groups.length) return groups;
    const rows: { id: number; display_name: string }[] =
      await this.mediaGroupRepository.query(
        `WITH RECURSIVE path AS (
             SELECT id, parent_id, name AS display_name
             FROM mediastore.media_group
             WHERE id = ANY($1)
           UNION ALL
             SELECT path.id, parent.parent_id, parent.name || ' - ' || path.display_name
             FROM path
             JOIN mediastore.media_group parent ON parent.id = path.parent_id
         )
         SELECT id, display_name FROM path WHERE parent_id IS NULL`,
        [groups.map(({ id }) => id)],
      );
    const names = new Map(
      rows.map(({ id, display_name }) => [id, display_name]),
    );
    for (const group of groups) {
      group.displayName = names.get(group.id) ?? group.name;
    }
    return groups.sort((a, b) => a.displayName.localeCompare(b.displayName));
  }

  async getAllToFollow(): Promise<MediaGroup[]> {
    return this.getAllWithTagsAndStarring({ toFollow: true });
  }

  private async getAllWithTagsAndStarring(where: FindOptionsWhere<MediaGroup>) {
    const groups = await this.mediaGroupRepository.find({
      where,
      relations: { tags: true, starring: true },
      relationLoadStrategy: 'query',
      order: { name: 'asc' },
    });
    for (const group of groups) group.tags?.sort(compareTitle);
    return this.setDisplayNames(groups);
  }

  async update(id: number, data: Partial<MediaGroup>) {
    for (const tag of data.tags || []) {
      tag.id = await this.tagService.getOrCreate(tag.title);
    }
    data.id = id;
    const updated = await this.mediaGroupRepository.preload(data);
    if (await this.mediaGroupRepository.save(updated)) {
      return this.findOneById(id);
    }
  }

  async updateTags(id: number, tags) {
    const mediaGroup = await this.mediaGroupRepository.findOne({
      where: { id },
    });
    for (const tag of tags || []) {
      tag.id = await this.tagService.getOrCreate(tag.title);
    }
    mediaGroup.tags = tags;
    if (await this.mediaGroupRepository.save(mediaGroup)) {
      return this.findOneById(id);
    }
  }

  async addTags(id: number, tags: Tag[]) {
    const mediaGroup = await this.mediaGroupRepository.findOne({
      where: { id },
      relations: { tags: true, parent: true },
    });
    if (
      ![Field.Profile, Field.Star].includes(mediaGroup.field) &&
      !mediaGroup.parent
    )
      return;
    for (const tag of tags || []) {
      if (!mediaGroup.tags.find(({ id }) => id === tag.id)) {
        mediaGroup.tags.push(tag);
      }
    }
    return await this.mediaGroupRepository.save(mediaGroup);
  }

  delete(id: number) {
    return this.mediaGroupRepository.delete(id);
  }
}
