import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as path from "path";
import { Media } from "./media.entity";
import { TagService } from "../tag/tag.service";

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media) private mediaRepository: Repository<Media>,
    private tagService: TagService,
  ) {}

  async create(data: Partial<Media>) {
    if (!data.title && data.files[0]) {
      data.title = path.basename(data.files[0]);
    }

    const entity = this.mediaRepository.create(data);

    for (const tag of entity.tags || []) {
      tag.id = await this.tagService.getOrCreate(tag.title);
    }

    return this.mediaRepository.save([entity]);
  }

  findAll(): Promise<Media[]> {
    return this.mediaRepository.find();
  }
}
