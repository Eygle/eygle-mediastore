import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Media } from "./media.entity";
import { MediaService } from "./media.service";
import { MediaController } from "./media.controller";
import { TagModule } from "../tag/tag.module";
import { TagService } from "../tag/tag.service";

@Module({
  imports: [TypeOrmModule.forFeature([Media]), TagModule],
  exports: [TypeOrmModule],
  providers: [MediaService, TagService],
  controllers: [MediaController],
})
export class MediaModule {}
