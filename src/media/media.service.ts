import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as path from 'path';
import { Media } from './media.entity';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media) private mediaRepository: Repository<Media>,
  ) {}

  async create(data: Partial<Media>) {
    if (!data.title && data.files[0]) {
      data.title = path.basename(data.files[0]);
    }
    const entity = this.mediaRepository.create(data);
    return this.mediaRepository.save([entity]);
  }

  findAll(): Promise<Media[]> {
    return this.mediaRepository.find();
  }
}
