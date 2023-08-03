import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from './media.entity';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Media])],
  exports: [TypeOrmModule],
  providers: [MediaService],
  controllers: [MediaController],
})
export class MediaModule {}
