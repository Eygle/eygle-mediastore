import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Raw, Repository } from "typeorm";
import { MediaGroup } from "./media-group.entity";
import { TagService } from "../tag/tag.service";
import { Field } from "../types/Field";

@Injectable()
export class MediaGroupService {
  constructor(
    @InjectRepository(MediaGroup)
    private mediaGroupRepository: Repository<MediaGroup>,
    private tagService: TagService,
  ) {}

  async create(data: Partial<MediaGroup>) {
    const entity = this.mediaGroupRepository.create(data);

    for (const tag of entity.tags || []) {
      tag.id = await this.tagService.getOrCreate(tag.title);
    }
    return this.mediaGroupRepository.save([entity]);
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

  findOneById(id: number) {
    return this.mediaGroupRepository.findOne({ where: { id } });
  }

  findOneByName(name: string) {
    return this.mediaGroupRepository.findOne({
      where: {
        name: Raw(
          (alias) => `LOWER(${alias}) LIKE '${name.toLocaleLowerCase()}'`,
        ),
      },
    });
  }
}
