import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { MediaService } from './media.service';

type MediaGroupQuery = {
  filters?: {
    parent: string;
  };
  addTagsToParent?: boolean
};

@Controller('media')
export class MediaController {
  constructor(private mediaService: MediaService) {}

  @Post()
  create(@Body() body, @Query() query: MediaGroupQuery) {
    return this.mediaService.create(body, query.addTagsToParent || false);
  }

  @Get()
  getAll(@Query() query: MediaGroupQuery) {
    if (query.filters?.parent) {
      return this.mediaService.getAllFromParent(+query.filters.parent)
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

  @Patch(':id')
  update(@Param() { id }: { id: number }, @Body() body, @Query() query: MediaGroupQuery) {
    return this.mediaService.update(+id, body, query.addTagsToParent || false)
  }

  @Patch(':id/tags')
  updateTags(@Param() { id }: { id: number }, @Body() body) {
    return this.mediaService.updateTags(id, body)
  }
}
