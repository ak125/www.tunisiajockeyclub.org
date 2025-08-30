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

  async getAllCourses() {
    console.log('📊 getAllCourses appelé (version mock)');
    
    const upcoming = await this.getUpcomingCourses(5);
    const recent = await this.getRecentResults(5);
    
    return {
      upcoming,
      recent,
      total: upcoming.length + recent.length
    };
  }
}
