import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  // Version simplifiée temporaire pour éviter les erreurs Prisma/Supabase
  async getUpcomingCourses(limit = 10) {
    console.log('📅 getUpcomingCourses appelé (version mock)');
    
    // Données mock temporaires - remplace les appels Prisma défaillants
    const mockRaces = [
      {
        id: 1,
        name: 'Prix de Tunis',
        date: new Date('2025-09-05T14:00:00Z'),
        status: 'scheduled',
        distance: 1600,
        maxParticipants: 12,
        racecourse: { name: 'Hippodrome de Carthage', location: 'Carthage' }
      },
      {
        id: 2,
        name: 'Grand Prix de Sousse', 
        date: new Date('2025-09-08T15:30:00Z'),
        status: 'scheduled',
        distance: 2000,
        maxParticipants: 14,
        racecourse: { name: 'Hippodrome de Sousse', location: 'Sousse' }
      }
    ];

    return mockRaces.slice(0, limit);
  }

  async getRecentResults(limit = 10) {
    console.log('🏆 getRecentResults appelé (version mock)');
    
    // Données mock temporaires - remplace les appels Prisma défaillants  
    const mockResults = [
      {
        id: 3,
        name: 'Prix des Oliviers',
        date: new Date('2025-08-28T16:00:00Z'),
        status: 'finished',
        distance: 1400,
        winner: { name: 'Thunder Bolt', jockey: 'Ahmed Ben Ali' },
        racecourse: { name: 'Hippodrome de Carthage', location: 'Carthage' }
      },
      {
        id: 4,
        name: 'Course du Patrimoine',
        date: new Date('2025-08-25T14:30:00Z'),
        status: 'finished',
        distance: 1800,
        winner: { name: 'Desert Star', jockey: 'Fatima Lahlou' },
        racecourse: { name: 'Hippodrome de Sousse', location: 'Sousse' }
      }
    ];

    return mockResults.slice(0, limit);
  }

  async getAllCourses(page = 1, limit = 20, status?: string) {
    console.log('📊 getAllCourses appelé (version mock)', { page, limit, status });
    
    const upcoming = await this.getUpcomingCourses(10);
    const recent = await this.getRecentResults(10);
    
    // Combine toutes les courses
    let allCourses = [...upcoming, ...recent];
    
    // Filtrer par status si fourni
    if (status) {
      allCourses = allCourses.filter(course => course.status === status);
    }
    
    // Pagination simple
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCourses = allCourses.slice(startIndex, endIndex);
    
    return {
      courses: paginatedCourses,
      total: allCourses.length,
      page,
      limit,
      totalPages: Math.ceil(allCourses.length / limit)
    };
  }

  async getCoursesStats() {
    console.log('📈 getCoursesStats appelé (version mock)');
    
    const upcoming = await this.getUpcomingCourses(100);
    const recent = await this.getRecentResults(100);
    
    return {
      totalCourses: upcoming.length + recent.length,
      upcomingCourses: upcoming.length,
      completedCourses: recent.length,
      scheduledToday: upcoming.filter(course => {
        const today = new Date();
        const courseDate = new Date(course.date);
        return courseDate.toDateString() === today.toDateString();
      }).length
    };
  }

  async getCourseById(id: string | number) {
    console.log('🔍 getCourseById appelé (version mock)', { id });
    const numId = typeof id === 'string' ? parseInt(id, 10) : id;
    // Mock data enrichi pour compatibilité contrôleur
    const mockCourse = {
      id: numId,
      name: `Course Mock ${numId}`,
      raceDate: new Date('2025-09-05T14:00:00Z'),
      date: new Date('2025-09-05T14:00:00Z'),
      status: 'scheduled',
      distance: 1600,
      distanceMeters: 1600,
      maxParticipants: 12,
      maxRunners: 12,
      prizeMoney: 4250,
      racecourse: { name: 'Hippodrome de Carthage', location: 'Carthage' },
      raceEntries: [
        {
          id: 1,
          horse: {
            id: 1,
            name: 'Thunder Strike',
            age: 4,
            weight: 58,
            trainer: { name: 'Ahmed Trainer' }
          },
          jockey: {
            id: 1,
            name: 'Mohamed Jockey',
            weight: 52
          },
          startingPosition: 1
        },
        {
          id: 2,
          horse: {
            id: 2,
            name: 'Desert Rose',
            age: 3,
            weight: 56,
            trainer: { name: 'Fatima Trainer' }
          },
          jockey: {
            id: 2,
            name: 'Ali Jockey',
            weight: 54
          },
          startingPosition: 2
        }
      ],
      raceResults: [
        {
          position: 1,
          horse: { id: 1, name: 'Thunder Strike' },
          jockey: { id: 1, name: 'Mohamed Jockey' },
          time: '1:36.5'
        },
        {
          position: 2,
          horse: { id: 2, name: 'Desert Rose' },
          jockey: { id: 2, name: 'Ali Jockey' },
          time: '1:37.2'
        }
      ]
    };
    return mockCourse;
  }
}
