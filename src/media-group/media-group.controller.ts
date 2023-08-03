import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { MediaGroupService } from './media-group.service';

type MediaGroupQuery = {
  filters?: {
    name: string;
  };
};

@Controller('media-group')
export class MediaGroupController {
  constructor(private mediaGroupService: MediaGroupService) {}

  @Get()
  getAll(@Query() query: MediaGroupQuery) {
    return this.mediaGroupService.getAll(query.filters?.name);
  }

  @Post()
  create(@Body() body) {
    return this.mediaGroupService.create(body);
  }
}
