import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Media } from "./media.entity";
import { MediaService } from "./media.service";
import { MediaController } from "./media.controller";
import { TagModule } from "../tag/tag.module";

@Module({
  imports: [TypeOrmModule.forFeature([Media]), forwardRef(() => TagModule)],
  exports: [TypeOrmModule, MediaService],
  providers: [MediaService],
  controllers: [MediaController],
})
export class MediaModule {}
