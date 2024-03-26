import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from './media.entity';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { TagModule } from '../tag/tag.module';
import { MediaGroupModule } from '../media-group/media-group.module';
import { MediaGroupService } from '../media-group/media-group.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Media]),
    forwardRef(() => TagModule),
    forwardRef(() => MediaGroupModule),
  ],
  exports: [TypeOrmModule, MediaService],
  providers: [MediaService, MediaGroupService],
  controllers: [MediaController],
})
export class MediaModule {}
