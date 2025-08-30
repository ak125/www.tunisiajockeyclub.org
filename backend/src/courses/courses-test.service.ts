import { Injectable, Logger } from '@nestjs/common';
import { SupabaseRestService } from '../supabase/supabase-rest.service';

@Injectable()
export class CoursesTestService {
  private readonly logger = new Logger(CoursesTestService.name);

  constructor(private readonly supabaseRest: SupabaseRestService) {}

  // ==========================================
  // MÉTHODES DE TEST AVEC SUPABASE REST
  // ==========================================

  async getAllCoursesTest(page = 1, limit = 20, status?: string) {
    try {
      // Utilise la méthode existante getRaces
      const races = await this.supabaseRest.getRaces(limit);
      
      return {
        success: true,
        data: {
          courses: races?.map((race: any) => ({
            id: race.id,
            name: race.name,
            date: race.race_date,
            prize: race.prize_money,
            status: 'scheduled', // Valeur par défaut
          })) || [],
          pagination: {
            page,
            limit,
            total: races?.length || 0,
            hasNext: false,
          },
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error: unknown) {
      this.logger.error('Erreur lors de la récupération des courses:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
        timestamp: new Date().toISOString(),
      };
    }
  }

  async getCoursesStatsTest() {
    try {
      // Utilise la méthode existante getCounts
      const counts = await this.supabaseRest.getCounts();
      
      return {
        success: true,
        data: {
          totalCourses: counts.totalRaces,
          coursesThisYear: counts.totalRaces, // Approximation
          upcomingCourses: Math.floor(counts.totalRaces / 2), // Approximation
          totalPrizePool: counts.totalRaces * 50000, // Estimation
          totalParticipants: counts.totalInscriptions,
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error: unknown) {
      this.logger.error('Erreur lors du calcul des statistiques:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
        timestamp: new Date().toISOString(),
      };
    }
  }

  async getCourseByIdTest(id: string) {
    try {
      // Utilise getRaces et filtre par ID (approximation pour le test)
      const races = await this.supabaseRest.getRaces(100);
      const race = races?.find((r: any) => r.id === id);
      
      if (!race) {
        return {
          success: false,
          error: 'Course non trouvée',
          timestamp: new Date().toISOString(),
        };
      }

      return {
        success: true,
        data: {
          id: race.id,
          name: race.name,
          date: race.race_date,
          prize: race.prize_money,
          status: 'scheduled',
          participants: [], // Pas de données de participants dans cette API simple
          results: [],
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error: unknown) {
      this.logger.error(`Erreur lors de la récupération de la course ${id}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
        timestamp: new Date().toISOString(),
      };
    }
  }

  async getUpcomingCoursesTest(limit = 10) {
    try {
      const races = await this.supabaseRest.getRaces(limit);
      
      return {
        success: true,
        data: {
          upcoming: races?.map((race: any) => ({
            id: race.id,
            name: race.name,
            date: race.race_date,
            prize: race.prize_money,
            status: 'scheduled',
          })) || [],
          total: races?.length || 0,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error: unknown) {
      this.logger.error('Erreur lors de la récupération des courses à venir:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
        timestamp: new Date().toISOString(),
      };
    }
  }

  async getRecentResultsTest(limit = 10) {
    try {
      const races = await this.supabaseRest.getRaces(limit);
      
      return {
        success: true,
        data: {
          results: races?.map((race: any) => ({
            id: race.id,
            name: race.name,
            date: race.race_date,
            prize: race.prize_money,
            status: 'finished',
            podium: [
              { position: 1, horse: 'Test Horse 1', jockey: 'Test Jockey 1' },
              { position: 2, horse: 'Test Horse 2', jockey: 'Test Jockey 2' },
              { position: 3, horse: 'Test Horse 3', jockey: 'Test Jockey 3' },
            ],
          })) || [],
          total: races?.length || 0,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error: unknown) {
      this.logger.error('Erreur lors de la récupération des résultats récents:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
        timestamp: new Date().toISOString(),
      };
    }
  }
}