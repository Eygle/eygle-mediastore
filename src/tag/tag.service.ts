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

  async getAll() {
    const countMediasByTags = await this.tagRepository.query(`
      SELECT mt.tag_id, COUNT(*) total FROM "mediastore"."media_tags_tag" mt GROUP BY mt."tag_id"`);
    const countMediaGroupsByTags = await this.tagRepository.query(`
      SELECT mgt.tag_id, COUNT(*) total FROM "mediastore"."media_group_tags_tag" mgt GROUP BY mgt."tag_id"`);
    return (await this.tagRepository.find({ order: { title: 'asc' } })).map(
      (tag: any) => ({
        ...tag,
        count:
          +countMediasByTags.find(({ tag_id }) => tag_id === tag.id)?.total ||
          0 +
            +countMediaGroupsByTags.find(({ tag_id }) => tag_id === tag.id)
              ?.total ||
          0,
      }),
    );
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
    const inParams = (start: number, length: number) =>
      [...Array(length)].map((_, idx) => `$${idx + start}`);

    const mediaWithTarget = await this.tagRepository.query(
      `SELECT mt."media_id" FROM "mediastore"."media_tags_tag" mt WHERE mt."tag_id" = $1`,
      [target],
    );
    await this.tagRepository.query(
      `DELETE FROM "mediastore"."media_tags_tag" mt
        WHERE mt."tag_id" IN (${inParams(1, tags.length)})
        AND mt."media_id" IN (${inParams(
          tags.length + 1,
          mediaWithTarget.length,
        )})`,
      [...tags, ...mediaWithTarget.map(({ media_id }) => media_id)],
    );

    const mediaGroupsWithTarget = await this.tagRepository.query(
      `SELECT mgt."media_group_id" FROM "mediastore"."media_group_tags_tag" mgt WHERE mgt."tag_id" = $1`,
      [target],
    );
    await this.tagRepository.query(
      `DELETE FROM "mediastore"."media_group_tags_tag" mgt
       WHERE mgt."tag_id" IN (${inParams(1, tags.length)})
         AND mgt."media_group_id" IN (${inParams(
           tags.length + 1,
           mediaGroupsWithTarget.length,
         )})`,
      [
        ...tags,
        ...mediaGroupsWithTarget.map(({ media_group_id }) => media_group_id),
      ],
    );

    await this.tagRepository.query(
      `UPDATE "mediastore"."media_tags_tag" t
        SET "tag_id" = $1
        WHERE t."tag_id" IN (${inParams(2, tags.length)})`,
      [target, ...tags],
    );
    await this.tagRepository.query(
      `UPDATE "mediastore"."media_group_tags_tag" t
        SET "tag_id" = $1
        WHERE t."tag_id" IN (${inParams(2, tags.length)})`,
      [target, ...tags],
    );
    return !!(await this.tagRepository.delete(tags));
  }
}
