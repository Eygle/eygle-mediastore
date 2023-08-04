import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Tag } from "./tag.entity";
import { Raw, Repository } from "typeorm";
import { MediaService } from "../media/media.service";
import { MediaGroupService } from "../media-group/media-group.service";

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
    });
  }

  getAllMediaTaggedBy(tagId: number) {
    return this.mediaService.getAllWithTag(tagId);
  }

  getAllMediaGroupTaggedBy(tagId: number) {
    return this.mediaGroupService.getAllWithTag(tagId);
  }
}
