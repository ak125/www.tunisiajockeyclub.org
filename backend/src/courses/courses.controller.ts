import {
  Controller,
  Get,
  Param,
  Query,
  ParseIntPipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import { Public } from '../auth/global-auth.guard';
import { CoursesService } from './courses.service';
import { CoursesServiceDirect } from './courses-direct.service';
import {
  CourseData,
  CourseStats,
  PaginatedCoursesResponse,
  CourseDetails,
} from './courses.interfaces';

@Controller('courses')
export class CoursesController {
  constructor(
    private readonly coursesService: CoursesService,
    private readonly coursesServiceDirect: CoursesServiceDirect,
  ) {}

  // ==========================================
  // ENDPOINTS PUBLICS - CONSULTATION
  // ==========================================

  @Get()
  @Public()
  async getAllCourses(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('status') status?: string,
  ): Promise<PaginatedCoursesResponse> {
    console.log('🎯 Utilisation du service direct avec vraies données');
    return this.coursesServiceDirect.getAllCourses(page || 1, limit || 20, status);
  }

  @Get('stats')
  @Public()
  async getStats(): Promise<CourseStats> {
    return this.coursesService.getCoursesStats();
  }

  @Get('upcoming')
  @Public()
  async getUpcoming(
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ): Promise<CourseData[]> {
    return this.coursesService.getUpcomingCourses(limit || 10);
  }

  @Get('recent-results')
  @Public()
  async getRecentResults(
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ): Promise<CourseData[]> {
    return this.coursesService.getRecentResults(limit || 10);
  }

  @Get(':id')
  @Public()
  async getCourse(@Param('id', ParseUUIDPipe) id: string): Promise<CourseDetails> {
    const course = await this.coursesService.getCourseById(id);
    if (!course) {
      throw new Error('Course non trouvée');
    }
    return course;
  }
}
