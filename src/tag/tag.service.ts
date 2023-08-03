import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './tag.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TagService {
  constructor(@InjectRepository(Tag) private tagRepository: Repository<Tag>) {}

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
}
