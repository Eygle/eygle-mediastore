import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Raw, Repository } from 'typeorm';
import { MediaGroup } from './media-group.entity';
import { TagService } from '../tag/tag.service';
import { Field } from '../types/Field';

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
    return this.mediaGroupRepository.find({
      where: { field },
      relations: { tags: true, media: true },
      order: { name: 'asc', tags: { title: 'asc' } },
    });
  }

  async getAllWithTag(tagId: number): Promise<MediaGroup[]> {
    const res = await this.mediaGroupRepository.find({
      where: { tags: { id: tagId } },
      select: { id: true },
    });
    return this.mediaGroupRepository.find({
      where: { id: In(res.map(({ id }) => id)) },
      relations: { tags: true },
      order: { name: 'asc', tags: { title: 'asc' } },
    });
  }

  findOneById(id: number) {
    return this.mediaGroupRepository.findOne({
      where: { id },
      relations: { tags: true, media: { tags: true } },
      order: { media: { title: 'asc', tags: { title: 'asc' } } },
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

  async updateTags(id: number, tags) {
    const mediaGroup = await this.mediaGroupRepository.findOne({
      where: { id },
    });
    for (const tag of tags || []) {
      tag.id = await this.tagService.getOrCreate(tag.title);
    }
    mediaGroup.tags = tags
    if (await this.mediaGroupRepository.save(mediaGroup)) {
      return this.findOneById(id)
    }
  }
}
