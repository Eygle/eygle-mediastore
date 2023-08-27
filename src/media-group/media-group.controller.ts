import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { MediaGroupService } from './media-group.service';
import { Field } from '../types/Field';

type MediaGroupQuery = {
  filters?: {
    name: string;
    id: string;
  };
};

@Controller('media-group')
export class MediaGroupController {
  constructor(private mediaGroupService: MediaGroupService) {}

  @Get()
  getAll(@Query() query: MediaGroupQuery) {
    if (query.filters?.name) {
      return this.mediaGroupService.findOneByName(query.filters.name);
    }
    if (query.filters?.id) {
      return this.mediaGroupService.findOneById(+query.filters.id);
    }
    return this.mediaGroupService.getAll();
  }

  @Get('/search/:name')
  searchByName(@Param() { name }: { name: string }) {
    return this.mediaGroupService.findAllByName(name);
  }

  @Get('/to-tag')
  getToTag() {
    return this.mediaGroupService.getAllToTag();
  }

  @Get('/commented')
  getCommented() {
    return this.mediaGroupService.getAllCommented();
  }

  @Get('/to-follow')
  getToFollow() {
    return this.mediaGroupService.getAllToFollow();
  }

  @Get(':field')
  getByField(@Param() { field }: { field: Field }) {
    return this.mediaGroupService.getAllByField(field);
  }

  @Post()
  create(@Body() body) {
    return this.mediaGroupService.create(body);
  }

  @Patch(':id')
  update(@Param() { id }: { id: string }, @Body() body) {
    return this.mediaGroupService.update(+id, body);
  }

  @Patch(':id/tags')
  updateTags(@Param() { id }: { id: string }, @Body() body) {
    return this.mediaGroupService.updateTags(+id, body);
  }
}
