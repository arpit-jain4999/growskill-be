import { Controller, Get, Param } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { Public } from '../common/decorators/public.decorator';

@Controller('modules')
@Public()
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Get()
  async findAll() {
    return this.modulesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.modulesService.findById(id);
  }

  @Get('course/:courseId')
  async findByCourse(@Param('courseId') courseId: string) {
    return this.modulesService.findByCourseId(courseId);
  }
}

