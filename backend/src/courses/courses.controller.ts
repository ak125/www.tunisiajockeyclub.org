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

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  // ==========================================
  // ENDPOINTS PUBLICS - CONSULTATION
  // ==========================================

  @Get()
  @Public()
  async getAllCourses(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('status') status?: string,
  ) {
    return this.coursesService.getAllCourses(page || 1, limit || 20, status);
  }

  @Get('stats')
  @Public()
  async getStats() {
    return this.coursesService.getCoursesStats();
  }

  @Get('upcoming')
  @Public()
  async getUpcoming(
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.coursesService.getUpcomingCourses(limit || 10);
  }

  @Get('recent-results')
  @Public()
  async getRecentResults(
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.coursesService.getRecentResults(limit || 10);
  }

  @Get(':id')
  @Public()
  async getCourse(@Param('id', ParseUUIDPipe) id: string) {
    return this.coursesService.getCourseById(id);
  }

  // ==========================================
  // ENDPOINTS UTILITAIRES
  // ==========================================

  @Get(':id/participants')
  @Public()
  async getCourseParticipants(@Param('id', ParseUUIDPipe) id: string) {
    const race = await this.coursesService.getCourseById(id);
    return {
      participants: race.raceEntries || [],
      count: race.raceEntries?.length || 0,
      maxParticipants: race.maxRunners || 16,
      registrationOpen: race.status === 'scheduled',
    };
  }

  @Get(':id/results')
  @Public()
  async getCourseResults(@Param('id', ParseUUIDPipe) id: string) {
    const race = await this.coursesService.getCourseById(id);
    return {
      results: race.raceResults || [],
      finished: race.status === 'finished',
      course: {
        id: race.id,
        name: race.name,
        date: race.raceDate,
        distance: race.distanceMeters,
        prize: race.prizeMoney,
      },
    };
  }
}
