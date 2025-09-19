import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';
import { CourseData, CourseStats, PaginatedCoursesResponse, CourseDetails } from './courses.interfaces';

const execAsync = promisify(exec);

@Injectable()
export class CoursesServiceDirect {
  private readonly SUPABASE_URL = process.env.SUPABASE_URL || 'https://hssigihofbbdehqrnnoz.supabase.co';
  private readonly SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhzc2lnaWhvZmJiZGVocXJubm96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NTkzNDksImV4cCI6MjA3MTEzNTM0OX0.fkeE84xM2u7iZ69YxMtgH7TH0xbYvc9i2-2tDMq5CQQ';
  private readonly SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhzc2lnaWhvZmJiZGVocXJubm96Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTU1OTM0OSwiZXhwIjoyMDcxMTM1MzQ5fQ.LJXci09iPB2JrHMMQlCorfDdRnJhMQCfhVNU01YD7o4';

  async getAllCourses(page = 1, limit = 20, status?: string): Promise<PaginatedCoursesResponse> {
    console.log('🏇 CoursesServiceDirect - Programme Ben Guerdane officiel');
    
    try {
      // Programme OFFICIEL Ben Guerdane - Samedi 2 août 2025
      const benGuerdaneCourses: CourseData[] = [
        {
          id: 'bg-001',
          name: 'Prix DE JEKITIS',
          date: new Date('2025-08-02T16:30:00'),
          status: 'scheduled',
          distance: 1400,
          distanceMeters: 1400,
          maxParticipants: 11,
          maxRunners: 11,
          prizeMoney: 4250,
          racecourse: {
            name: 'Hippodrome de Ben Guerdane',
            location: 'Ben Guerdane, Médenine',
          },
          raceNumber: 1,
          raceType: 'Conditions',
          category: 'Pur Sang Arabe',
          participantCount: 11,
        },
        {
          id: 'bg-002',
          name: 'Prix DE CHOUCHA (A Réservée)',
          date: new Date('2025-08-02T17:00:00'),
          status: 'scheduled',
          distance: 1700,
          distanceMeters: 1700,
          maxParticipants: 7,
          maxRunners: 7,
          prizeMoney: 4250,
          racecourse: {
            name: 'Hippodrome de Ben Guerdane',
            location: 'Ben Guerdane, Médenine',
          },
          raceNumber: 2,
          raceType: 'Réservée',
          category: 'Pur Sang Arabe',
          participantCount: 7,
        },
        {
          id: 'bg-003',
          name: 'Prix DE CHIKRBEN (A Réservée)',
          date: new Date('2025-08-02T17:30:00'),
          status: 'scheduled',
          distance: 2000,
          distanceMeters: 2000,
          maxParticipants: 9,
          maxRunners: 9,
          prizeMoney: 4250,
          racecourse: {
            name: 'Hippodrome de Ben Guerdane',
            location: 'Ben Guerdane, Médenine',
          },
          raceNumber: 3,
          raceType: 'Réservée',
          category: 'Pur Sang Arabe',
          participantCount: 9,
        },
        {
          id: 'bg-004',
          name: 'Prix DE BEN GUERDANE (Handicap)',
          date: new Date('2025-08-02T18:00:00'),
          status: 'scheduled',
          distance: 2000,
          distanceMeters: 2000,
          maxParticipants: 12,
          maxRunners: 12,
          prizeMoney: 3825,
          racecourse: {
            name: 'Hippodrome de Ben Guerdane',
            location: 'Ben Guerdane, Médenine',
          },
          raceNumber: 4,
          raceType: 'Handicap',
          category: 'Pur Sang Arabe',
          participantCount: 12,
        }
      ];

      // Données Supabase (historiques)
      let supabaseCourses: CourseData[] = [];
      try {
        const curlCommand = `curl -X GET "${this.SUPABASE_URL}/rest/v1/races?select=*,racecourses(*)" -H "apikey: ${this.SUPABASE_ANON_KEY}" -H "Authorization: Bearer ${this.SUPABASE_SERVICE_ROLE_KEY}" 2>/dev/null`;

        const { stdout } = await execAsync(curlCommand);
        const supabaseRaces = JSON.parse(stdout);

        supabaseCourses = supabaseRaces.map((race: any) => ({
          id: race.id,
          name: race.name,
          date: new Date(race.race_date + 'T' + race.race_time),
          status: race.status,
          distance: race.distance_meters,
          distanceMeters: race.distance_meters,
          maxParticipants: race.max_participants,
          maxRunners: race.max_runners,
          prizeMoney: race.prize_money,
          racecourse: {
            name: race.racecourses?.name || 'Hippodrome',
            location: race.racecourses?.location || 'Tunisie',
          },
          raceNumber: race.race_number,
          raceType: race.race_type,
          category: race.race_class,
          participantCount: 0,
        }));
      } catch (supabaseError) {
        console.warn('Supabase non accessible, utilisation données Ben Guerdane uniquement');
      }

      const allCourses = [...benGuerdaneCourses, ...supabaseCourses];
      
      const filteredCourses = status 
        ? allCourses.filter(course => course.status === status)
        : allCourses;

      filteredCourses.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedCourses = filteredCourses.slice(startIndex, endIndex);

      console.log(`Ben Guerdane: ${benGuerdaneCourses.length}, Supabase: ${supabaseCourses.length}, Total: ${allCourses.length}`);
      
      return {
        courses: paginatedCourses,
        totalPages: Math.ceil(filteredCourses.length / limit),
        totalItems: filteredCourses.length,
        currentPage: page,
        itemsPerPage: limit,
      };
      
    } catch (error) {
      console.error('Erreur getAllCourses:', error);
      return {
        courses: [],
        totalPages: 0,
        totalItems: 0,
        currentPage: page,
        itemsPerPage: limit,
      };
    }
  }

  async getCoursesStats(): Promise<CourseStats> {
    return {
      totalCourses: 4,
      upcomingCourses: 4,
      completedCourses: 0,
      scheduledToday: 4,
    };
  }

  async getUpcomingCourses(limit = 10): Promise<CourseData[]> {
    const { courses } = await this.getAllCourses(1, limit, 'scheduled');
    return courses;
  }

  async getRecentResults(limit = 10): Promise<CourseData[]> {
    const { courses } = await this.getAllCourses(1, limit, 'finished');
    return courses;
  }

  async getCourseById(id: string): Promise<CourseDetails | null> {
    if (id === 'bg-001') {
      return {
        id: 'bg-001',
        name: 'Prix DE JEKITIS',
        date: new Date('2025-08-02T16:30:00'),
        raceDate: new Date('2025-08-02T16:30:00'),
        status: 'scheduled',
        distance: 1400,
        distanceMeters: 1400,
        maxParticipants: 11,
        maxRunners: 11,
        prizeMoney: 4250,
        racecourse: {
          name: 'Hippodrome de Ben Guerdane',
          location: 'Ben Guerdane, Médenine',
        },
        raceNumber: 1,
        raceType: 'Conditions',
        category: 'Pur Sang Arabe',
        conditions: 'Pour poulains et pouliches de 3 ans Pur Sang Arabe n\'ayant pas gagné 3.500 DT – Poids 55 kg',
        terrainState: 'Bon',
        raceEntries: [],
        raceResults: [],
      };
    }
    
    return null;
  }
}
