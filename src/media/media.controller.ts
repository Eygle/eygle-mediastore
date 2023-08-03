import { Body, Controller, Post } from "@nestjs/common";
import { MediaService } from "./media.service";

@Controller('media')
export class MediaController {
  constructor(private mediaService: MediaService) {}

  @Post()
  create(@Body() body) {
    return this.mediaService.create(body)
  }}
