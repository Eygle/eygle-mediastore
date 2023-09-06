import { Controller, Get } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('/synchronize-parent-tags')
  synchronizeParentTags() {
    return this.adminService.synchronizeParentTags();
  }

  @Get('/change-files-path')
  changeFilesPath() {
    return this.adminService.changeFilesPath();
  }
}
