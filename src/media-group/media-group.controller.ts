import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { MediaGroupService } from './media-group.service';
import { Field } from "../types/Field";

type MediaGroupQuery = {
  filters?: {
    name: string;
    id: string
  };
};

@Controller('media-group')
export class MediaGroupController {
  constructor(private mediaGroupService: MediaGroupService) {}

  @Get()
  getAll(@Query() query: MediaGroupQuery) {
    if (query.filters?.name) {
      return this.mediaGroupService.findOneByName(query.filters.name)
    }
    if (query.filters?.id) {
      return this.mediaGroupService.findOneById(+query.filters.id)
    }
    return this.mediaGroupService.getAll();
  }

  @Get(':field')
  getByField(@Param() {  field  }: {  field: Field }) {
    return this.mediaGroupService.getAllByField(field);
  }

  @Post()
  create(@Body() body) {
    return this.mediaGroupService.create(body);
  }
}
