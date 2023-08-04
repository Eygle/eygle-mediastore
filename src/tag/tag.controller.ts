import { Controller, Get, Param, Query } from '@nestjs/common';
import { TagService } from './tag.service';

type TagQuery = {
  filters?: { name: string };
};

@Controller('tag')
export class TagController {
  constructor(private tagService: TagService) {}

  @Get()
  getAll(@Query() query: TagQuery) {
    if (query.filters?.name) {
      return this.tagService.findByName(query.filters.name);
    }
    return this.tagService.getAll();
  }

  @Get(':tagId/media')
  getAllMediaTaggedBy(@Param() { tagId }: { tagId: number }) {
    return this.tagService.getAllMediaTaggedBy(tagId);
  }

  @Get(':tagId/media-group')
  getAllMediaGroupTaggedBy(@Param() { tagId }: { tagId: number }) {
    return this.tagService.getAllMediaGroupTaggedBy(tagId);
  }
}
