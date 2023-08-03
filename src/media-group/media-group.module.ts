import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MediaGroup } from "./media-group.entity";
import { MediaGroupService } from "./media-group.service";
import { MediaGroupController } from "./media-group.controller";
import { TagModule } from "../tag/tag.module";
import { TagService } from "../tag/tag.service";

@Module({
  imports: [TypeOrmModule.forFeature([MediaGroup]), TagModule],
  exports: [TypeOrmModule],
  providers: [MediaGroupService, TagService],
  controllers: [MediaGroupController]
})
export class MediaGroupModule {}
