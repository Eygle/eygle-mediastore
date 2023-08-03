import { Body, Controller, Get, Post, Query } from "@nestjs/common";
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
      return this.mediaService.getAllFromParent(+query.filters.parent)
    }
    return this.mediaService.getAll();
  }
}
