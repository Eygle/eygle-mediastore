import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MediaGroup } from "./media-group.entity";
import { MediaGroupService } from "./media-group.service";
import { MediaGroupController } from "./media-group.controller";
import { TagModule } from "../tag/tag.module";

@Module({
  imports: [TypeOrmModule.forFeature([MediaGroup]), forwardRef(() => TagModule)],
  exports: [TypeOrmModule, MediaGroupService],
  providers: [MediaGroupService],
  controllers: [MediaGroupController]
})
export class MediaGroupModule {}
