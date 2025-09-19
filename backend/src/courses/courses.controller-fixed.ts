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
import { CoursesServiceRest } from './courses-rest.service';
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
    private readonly coursesServiceRest: CoursesServiceRest,
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
    // TEMPORAIRE: Test avec vraies données via API REST
    console.log('🔄 Test vraies données via API REST');
    
    try {
      const { exec } = require('child_process');
      const { promisify } = require('util');
      const execAsync = promisify(exec);
      
      let endpoint = `races?select=*,racecourses(name,location)&order=race_date.desc,race_time.desc`;
      if (status) {
        endpoint += `&status=eq.${status}`;
      }
      
      const actualPage = page || 1;
      const actualLimit = limit || 20;
      const offset = (actualPage - 1) * actualLimit;
      endpoint += `&limit=${actualLimit}&offset=${offset}`;
      
      const curlCommand = `curl -s -X GET 'https://hssigihofbbdehqrnnoz.supabase.co/rest/v1/${endpoint}' -H 'apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhzc2lnaWhvZmJiZGVocXJubm96Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTU1OTM0OSwiZXhwIjoyMDcxMTM1MzQ5fQ.LJXci09iPB2JrHMMQlCorfDdRnJhMQCfhVNU01YD7o4' -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhzc2lnaWhvZmJiZGVocXJubm96Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTU1OTM0OSwiZXhwIjoyMDcxMTM1MzQ5fQ.LJXci09iPB2JrHMMQlCorfDdRnJhMQCfhVNU01YD7o4'`;
      
      const { stdout } = await execAsync(curlCommand);
      const races = JSON.parse(stdout);
      
      // Transformer les données au format attendu
      const transformedRaces = races.map((race: any) => ({
        id: race.id,
        name: race.name,
        date: new Date(`${race.race_date}T${race.race_time}`),
        status: race.status,
        distance: race.distance_meters,
        distanceMeters: race.distance_meters,
        maxParticipants: race.max_runners || 0,
        maxRunners: race.max_runners || 0,
        prizeMoney: race.prize_money ? Number(race.prize_money) : null,
        racecourse: {
          name: race.racecourses?.name || 'Hippodrome',
          location: race.racecourses?.location || 'Tunisie',
        },
        raceNumber: race.race_number,
        raceType: race.race_type,
        category: race.race_class,
        participantCount: 0, // Sera ajouté plus tard
      }));

      return {
        courses: transformedRaces,
        totalItems: races.length,
        currentPage: actualPage,
        itemsPerPage: actualLimit,
        totalPages: Math.ceil(races.length / actualLimit),
      };
      
    } catch (error) {
      console.error('❌ Erreur API REST, retour au service original:', error);
      return this.coursesService.getAllCourses(page || 1, limit || 20, status);
    }
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
