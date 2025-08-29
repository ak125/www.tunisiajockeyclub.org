import {
  Controller,
  Get,
  Param,
  Query,
  ParseIntPipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import { Public } from '../auth/global-auth.guard';
import { CoursesTestService } from './courses-test.service';

@Controller('courses-test')
export class CoursesTestController {
  constructor(private readonly coursesTestService: CoursesTestService) {}

  @Get()
  @Public()
  async getAllCourses(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('status') status?: string,
  ) {
    return this.coursesTestService.getAllCoursesTest(page || 1, limit || 10, status);
  }

  @Get('stats')
  @Public()
  async getStats() {
    return this.coursesTestService.getCoursesStatsTest();
  }

  @Get(':id')
  @Public()
  async getCourse(@Param('id', ParseUUIDPipe) id: string) {
    return this.coursesTestService.getCourseByIdTest(id);
  }
}
