import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { TagService } from './tag.service';
import { Tag } from './tag.entity';

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
  getAllMediaTaggedBy(@Param() { tagId }: { tagId: string }) {
    return this.tagService.getAllMediaTaggedBy(+tagId);
  }

  @Get(':tagId/media-group')
  getAllMediaGroupTaggedBy(@Param() { tagId }: { tagId: string }) {
    return this.tagService.getAllMediaGroupTaggedBy(+tagId);
  }

  @Patch(':tagId')
  updateTag(@Body() tag: Tag) {
    return this.tagService.update(tag);
  }

  @Patch(':tagId/merge-into')
  mergeTagsIntoOne(
    @Param() { tagId }: { tagId: string },
    @Body() tags: number[],
  ) {
    return this.tagService.mergeInto(+tagId, tags);
  }
}
