import { forwardRef, Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaGroup } from '../media-group/media-group.entity';
import { TagModule } from '../tag/tag.module';
import { Media } from '../media/media.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MediaGroup, Media]),
    forwardRef(() => TagModule),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
