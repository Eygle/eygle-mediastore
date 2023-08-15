import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import * as path from 'path';
import { Media } from './media.entity';
import { TagService } from '../tag/tag.service';
import { MediaGroupService } from '../media-group/media-group.service';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media) private mediaRepository: Repository<Media>,
    private mediaGroupService: MediaGroupService,
    private tagService: TagService,
  ) {}

  async create(data: Partial<Media>, addTagsToParent: boolean) {
    data.files = data.files.filter(Boolean);
    if (!data.title && data.files[0]) {
      data.title = path.basename(data.files[0]);
    }

    const entity = this.mediaRepository.create(data);

    for (const tag of entity.tags || []) {
      tag.id = await this.tagService.getOrCreate(tag.title);
    }

    if (addTagsToParent && entity.tags?.length) {
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

  async getAllWithTag(tagId: number): Promise<Media[]> {
    const res = await this.mediaRepository.find({
      where: { tags: { id: tagId } },
      select: { id: true },
    });
    return this.mediaRepository.find({
      where: { id: In(res.map(({ id }) => id)) },
      relations: { tags: true, parent: true, starring: true },
      order: { parent: { name: 'asc' }, title: 'asc', tags: { title: 'asc' } },
    });
  }

  getAllFromParent(parentId: number): Promise<Media[]> {
    return this.mediaRepository.find({
      where: { parent: { id: parentId } },
      relations: { tags: true, starring: true },
    });
  }

  async update(id: number, data, addTagsToParent: boolean) {
    data.files = data.files.filter(Boolean);
    if (!data.title && data.files[0]) {
      data.title = path.basename(data.files[0]);
    }

    for (const tag of data.tags || []) {
      tag.id = await this.tagService.getOrCreate(tag.title);
    }

    data.id = id;
    const updated = await this.mediaRepository.preload(data);

    if (addTagsToParent && data.tags?.length) {
      const media = await this.mediaRepository.findOne({
        where: { id },
        select: { id: true, parent: { id: true } },
        relations: { parent: true },
      });
      await this.mediaGroupService.addTags(media.parent.id, data.tags)
    }

    if (await this.mediaRepository.save(updated)) {
      return this.findOneById(id);
    }
  }

  async updateTags(id: number, tags) {
    const mediaGroup = await this.mediaRepository.findOne({
      where: { id },
    });
    for (const tag of tags || []) {
      tag.id = await this.tagService.getOrCreate(tag.title);
    }
    mediaGroup.tags = tags;
    if (await this.mediaRepository.save(mediaGroup)) {
      return this.findOneById(id);
    }
  }
}
