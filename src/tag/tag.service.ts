import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './tag.entity';
import { Raw, Repository } from 'typeorm';
import { MediaService } from '../media/media.service';
import { MediaGroupService } from '../media-group/media-group.service';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag) private tagRepository: Repository<Tag>,
    @Inject(forwardRef(() => MediaService)) private mediaService: MediaService,
    @Inject(forwardRef(() => MediaGroupService))
    private mediaGroupService: MediaGroupService,
  ) {}

  async getOrCreate(title: string): Promise<number> {
    const found = await this.tagRepository.findOne({
      where: { title },
      select: ['id'],
    });
    if (found) {
      return found.id;
    }
    const n = await this.tagRepository.insert({ title });
    return n.identifiers[0].id;
  }

  getAll() {
    return this.tagRepository.find({ order: { title: 'asc' } });
  }

  findByName(name: string) {
    return this.tagRepository.find({
      where: {
        title: Raw(
          (alias) =>
            `LOWER(${alias}) LIKE '%${name.toLocaleLowerCase().trim()}%'`,
        ),
      },
      order: { title: 'asc' },
    });
  }

  getAllMediaTaggedBy(tagId: number) {
    return this.mediaService.getAllWithTag(tagId);
  }

  getAllMediaGroupTaggedBy(tagId: number) {
    return this.mediaGroupService.getAllWithTag(tagId);
  }

  async update(tag: Tag) {
    const updated = await this.tagRepository.preload(tag);
    return await this.tagRepository.save(updated);
  }

  async mergeInto(target: number, tags: number[]) {
    const tag = await this.tagRepository.findOne({ where: { id: target } });
    if (!tag || !tags.length || !tags.every(Number.isInteger)) return false;
    const inParams = tags.map((_, idx) => `$${idx + 2}`).join(', ');

    await this.tagRepository.query(
      `UPDATE "mediastore"."media_tags_tag" AS t SET "tag_id" = $1 WHERE t."tag_id" IN (${inParams})`,
      [target, ...tags],
    );
    await this.tagRepository.query(
      `UPDATE "mediastore"."media_group_tags_tag" AS t SET "tag_id" = $1 WHERE t."tag_id" IN (${inParams})`,
      [target, ...tags],
    );
    return !!(await this.tagRepository.delete(tags));
  }
}
