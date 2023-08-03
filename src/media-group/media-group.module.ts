import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { MediaGroup } from "./media-group.entity";
import { MediaGroupService } from './media-group.service';
import { MediaGroupController } from './media-group.controller';
import { Tag } from "../tag/tag.entity";

@Module({
  imports: [TypeOrmModule.forFeature([MediaGroup, Tag])],
  exports: [TypeOrmModule],
  providers: [MediaGroupService],
  controllers: [MediaGroupController]
})
export class MediaGroupModule {}
