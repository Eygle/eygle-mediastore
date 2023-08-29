import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Not, Raw, Repository } from 'typeorm';
import { MediaGroup } from './media-group.entity';
import { TagService } from '../tag/tag.service';
import { Field } from '../types/Field';
import { Tag } from '../tag/tag.entity';

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

  getAll() {
    return this.mediaGroupRepository.find({
      relations: { tags: true, media: true },
      order: { name: 'asc', tags: { title: 'asc' } },
    });
  }

  getAllByField(field: Field) {
    return this.mediaGroupRepository
      .createQueryBuilder('groups')
      .where({ field })
      .leftJoinAndSelect('groups.tags', 'tag')
      .leftJoinAndSelect('groups.media', 'media')
      .leftJoinAndSelect('groups.starring', 'starring')
      .orderBy('LOWER(groups.name)', 'ASC')
      .addOrderBy('tag.title', 'ASC')
      .getMany();
  }

  async getAllWithTag(tagId: number): Promise<MediaGroup[]> {
    const res = await this.mediaGroupRepository.find({
      where: { tags: { id: tagId } },
      select: { id: true },
    });
    return this.mediaGroupRepository.find({
      where: { id: In(res.map(({ id }) => id)) },
      relations: { tags: true, starring: true },
      order: { name: 'asc', tags: { title: 'asc' } },
    });
  }

  findOneById(id: number) {
    return this.mediaGroupRepository.findOne({
      where: { id },
      relations: {
        tags: true,
        media: { tags: true, starring: true, parent: true },
        groups: { tags: true, parent: true, media: true },
        parent: true,
        starring: true,
      },
      order: {
        media: { title: 'asc', tags: { title: 'asc' } },
        tags: { title: 'asc' },
        groups: { tags: { title: 'asc' } },
      },
    });
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

  async getAllToTag(): Promise<MediaGroup[]> {
    return this.mediaGroupRepository.find({
      where: { toTag: true },
      relations: { tags: true, starring: true },
      order: { name: 'asc', tags: { title: 'asc' } },
    });
  }

  async getAllCommented(): Promise<MediaGroup[]> {
    return this.mediaGroupRepository.find({
      where: { comment: Not(IsNull()) },
      relations: { tags: true, starring: true },
      order: { name: 'asc', tags: { title: 'asc' } },
    });
  }

  async getAllToFollow(): Promise<MediaGroup[]> {
    return this.mediaGroupRepository.find({
      where: { toFollow: true },
      relations: { tags: true, starring: true },
      order: { name: 'asc', tags: { title: 'asc' } },
    });
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
      relations: { tags: true },
    });
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
