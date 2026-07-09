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
import { MediaFlag, MediaService } from './media.service';

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

  @Get('/count-by-field')
  countByField(@Query('flag') flag: MediaFlag) {
    return this.mediaService.countByField(flag);
  }

  @Get('/in-progress')
  getInProgress(@Query('field') field?: string) {
    return this.mediaService.getAllFlagged('in-progress', field);
  }

  @Get('/to-see')
  getToSee(@Query('field') field?: string) {
    return this.mediaService.getAllFlagged('to-see', field);
  }

  @Get('/potential-best')
  getPotentialBest(@Query('field') field?: string) {
    return this.mediaService.getAllFlagged('potential-best', field);
  }

  @Get('/best')
  getBest(@Query('field') field?: string) {
    return this.mediaService.getAllFlagged('best', field);
  }

  @Get('/absolute-best')
  getAbsoluteBest(@Query('field') field?: string) {
    return this.mediaService.getAllFlagged('absolute-best', field);
  }

  @Get('/to-tag')
  getToTag(@Query('field') field?: string) {
    return this.mediaService.getAllFlagged('to-tag', field);
  }

  @Get('/commented')
  getCommented(@Query('field') field?: string) {
    return this.mediaService.getAllFlagged('commented', field);
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
