import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Not, Repository } from 'typeorm';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import * as path from 'path';
import { Media } from './media.entity';
import { TagService } from '../tag/tag.service';
import { MediaGroupService } from '../media-group/media-group.service';
import { MediaGroup } from '../media-group/media-group.entity';
import { groupByParents } from '../utils/group-by-parents';
import { Tag } from '../tag/tag.entity';

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
    return this.mediaRepository.find({ relations: { tags: true } });
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
    });
  }

  async getAllInProgress(): Promise<MediaGroup[]> {
    const mediaList = await this.mediaRepository
      .createQueryBuilder('media')
      .where('media.progress IS NOT NULL')
      .where(`media.progress != '{null,null}'`)
      .leftJoinAndSelect('media.tags', 'tag')
      .leftJoinAndSelect('media.starring', 'starring')
      .leftJoinAndSelect('media.parent', 'parent')
      .leftJoinAndSelect('parent.tags', 'parent_tag')
      .addOrderBy('parent.name', 'ASC')
      .addOrderBy('parent_tag.title', 'ASC')
      .addOrderBy('media.title', 'ASC')
      .addOrderBy('tag.title', 'ASC')
      .getMany();
    return groupByParents(mediaList);
  }

  async getAllToSee(): Promise<MediaGroup[]> {
    return this.getAllGroupedByParents({ toSee: true });
  }

  async getAllBest(): Promise<MediaGroup[]> {
    return this.getAllGroupedByParents({ isBest: true });
  }

  async getAllAbsoluteBest(): Promise<MediaGroup[]> {
    return this.getAllGroupedByParents({ isAbsoluteBest: true });
  }

  async getAllToTag(): Promise<MediaGroup[]> {
    return this.getAllGroupedByParents({ toTag: true });
  }

  async getAllCommented(): Promise<MediaGroup[]> {
    return this.getAllGroupedByParents({ comment: Not(IsNull()) });
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
    const mediaList = await this.mediaRepository.find({
      where,
      relations: { tags: true, starring: true, parent: { tags: true } },
      order: {
        parent: { name: 'asc', tags: { title: 'asc' } },
        title: 'asc',
        tags: { title: 'asc' },
      },
    });
    return groupByParents(mediaList);
  }

  delete(id: number) {
    return this.mediaRepository.delete(id);
  }
}
