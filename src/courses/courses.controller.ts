import { Controller, Get, Param } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { Public } from '../common/decorators/public.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserPayload } from '../common/decorators/current-user.decorator';
import { UseGuards } from '@nestjs/common';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Public()
  @Get()
  async findAll() {
    return this.coursesService.findAll();
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.coursesService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-courses')
  async findMyCourses(@CurrentUser() user: CurrentUserPayload) {
    return this.coursesService.findMyCourses(user.userId);
  }
}

