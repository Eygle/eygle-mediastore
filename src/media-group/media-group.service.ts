import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Raw, Repository } from 'typeorm';
import { MediaGroup } from './media-group.entity';
import { Tag } from '../tag/tag.entity';

@Injectable()
export class MediaGroupService {
  constructor(
    @InjectRepository(MediaGroup)
    private mediaGroupRepository: Repository<MediaGroup>,
    @InjectRepository(Tag) private tagRepository: Repository<Tag>,
  ) {}

  async create(data: Partial<MediaGroup>) {
    const entity = this.mediaGroupRepository.create(data);

    if (entity.tags) {
      for (const tag of entity.tags) {
        const found = await this.tagRepository.findOne({
          where: { title: tag.title },
          select: ['id'],
        });
        if (found) {
          tag.id = found.id;
        } else {
          const n = await this.tagRepository.insert(tag);
          tag.id = n.identifiers[0].id;
        }
      }
    }
    return this.mediaGroupRepository.save([entity]);
  }

  getAll(search?: string) {
    return this.mediaGroupRepository.find({
      ...(search && {
        where: {
          name: Raw(
            (alias) => `LOWER(${alias}) LIKE '${search.toLocaleLowerCase()}'`,
          ),
        },
      }),
      relations: { tags: true, media: true },
      order: { name: 'asc', tags: { title: 'asc' } },
    });
  }
}
