import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './tag.entity';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { MediaModule } from '../media/media.module';
import { MediaGroupModule } from '../media-group/media-group.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tag]),
    forwardRef(() => MediaModule),
    forwardRef(() => MediaGroupModule),
  ],
  exports: [TypeOrmModule, TagService],
  providers: [TagService],
  controllers: [TagController],
})
export class TagModule {}
