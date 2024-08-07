import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { MediaService } from './media.service';

type MediaGroupQuery = {
  filters?: {
    parent: string;
  };
};

@Controller('media')
export class MediaController {
  constructor(private mediaService: MediaService) {}

  @Post()
  create(@Body() body) {
    return this.mediaService.create(body);
  }

  @Get()
  getAll(@Query() query: MediaGroupQuery) {
    if (query.filters?.parent) {
      return this.mediaService.getAllFromParent(+query.filters.parent);
    }
    return this.mediaService.getAll();
  }

  @Get('/in-progress')
  getInProgress() {
    return this.mediaService.getAllInProgress();
  }

  @Get('/to-see')
  getToSee() {
    return this.mediaService.getAllToSee();
  }

  @Get('/best')
  getBest() {
    return this.mediaService.getAllBest();
  }

  @Get('/absolute-best')
  getAbsoluteBest() {
    return this.mediaService.getAllAbsoluteBest();
  }

  @Get('/to-tag')
  getToTag() {
    return this.mediaService.getAllToTag();
  }

  @Get('/commented')
  getCommented() {
    return this.mediaService.getAllCommented();
  }

  @Patch(':id')
  update(@Param() { id }: { id: number }, @Body() body) {
    return this.mediaService.update(+id, body);
  }

  @Patch(':id/tags')
  updateTags(@Param() { id }: { id: number }, @Body() body) {
    return this.mediaService.updateTags(id, body);
  }

  @Delete(':id')
  delete(@Param() { id }: { id: string }) {
    return this.mediaService.delete(+id);
  }
}
