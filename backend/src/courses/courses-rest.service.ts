import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';
import {
  CourseData,
  CourseStats,
  PaginatedCoursesResponse,
  CourseDetails,
} from './courses.interfaces';

@Injectable()
export class CoursesServiceRest {
  private readonly SUPABASE_URL = 'https://hssigihofbbdehqrnnoz.supabase.co';
  private readonly SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhzc2lnaWhvZmJiZGVocXJubm96Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTU1OTM0OSwiZXhwIjoyMDcxMTM1MzQ5fQ.LJXci09iPB2JrHMMQlCorfDdRnJhMQCfhVNU01YD7o4';

  private async supabaseRequest(endpoint: string, method: string = 'GET', body?: any) {
    const url = `${this.SUPABASE_URL}/rest/v1/${endpoint}`;
    const headers: Record<string, string> = {
      'apikey': this.SUPABASE_SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${this.SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
    };

    const config: any = {
      method,
      headers,
    };

    if (body && (method === 'POST' || method === 'PATCH' || method === 'PUT')) {
      config.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`❌ Erreur requête ${method} ${endpoint}:`, error);
      throw error;
    }
  }

  async getUpcomingCourses(limit = 10): Promise<CourseData[]> {
    console.log('🏁 getUpcomingCourses appelé (API REST)');
    
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const races = (await this.supabaseRequest(
        `races?race_date=gte.${today}&status=eq.scheduled&select=*,racecourses(name,location)&order=race_date.asc,race_time.asc&limit=${limit}`
      )) as any[];

      return races.map((race: any) => ({
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
      }));

    } catch (error) {
      console.error('❌ Erreur lors du chargement des courses à venir:', error);
      // Fallback to mock data if database fails
      return [
        {
          id: 'fallback-1',
          name: 'Prix de Tunis (Fallback)',
          date: new Date('2025-09-05T14:00:00Z'),
          status: 'scheduled',
          distance: 1600,
          distanceMeters: 1600,
          maxParticipants: 12,
          maxRunners: 12,
          prizeMoney: null,
          racecourse: {
            name: 'Hippodrome de Carthage',
            location: 'Carthage',
          },
        },
      ];
    }
  }

  async getAllCourses(page = 1, limit = 20, status?: string): Promise<PaginatedCoursesResponse> {
    console.log('📊 getAllCourses appelé (API REST)', { page, limit, status });
    
    try {
      let endpoint = `races?select=*,racecourses(name,location)&order=race_date.desc,race_time.desc`;
      
      if (status) {
        endpoint += `&status=eq.${status}`;
      }
      
      const offset = (page - 1) * limit;
      endpoint += `&limit=${limit}&offset=${offset}`;

      const races = (await this.supabaseRequest(endpoint)) as any[];

      // Count total for pagination
      let countEndpoint = `races?select=count`;
      if (status) {
        countEndpoint += `&status=eq.${status}`;
      }
      
      const countResult = (await this.supabaseRequest(countEndpoint)) as any[];
      const totalCount = countResult[0]?.count || races.length;

      const transformedRaces: CourseData[] = races.map((race: any) => ({
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
        participantCount: 0, // Sera ajouté plus tard avec les inscriptions
      }));

      return {
        courses: transformedRaces,
        totalItems: totalCount,
        currentPage: page,
        itemsPerPage: limit,
        totalPages: Math.ceil(totalCount / limit),
      };

    } catch (error) {
      console.error('❌ Erreur lors du chargement de toutes les courses:', error);
      // Fallback simple
      const upcoming = await this.getUpcomingCourses(limit);
      return {
        courses: upcoming,
        totalItems: upcoming.length,
        currentPage: 1,
        itemsPerPage: limit,
        totalPages: 1,
      };
    }
  }

  async getRecentResults(limit = 10): Promise<CourseData[]> {
    console.log('🏆 getRecentResults appelé (API REST)');
    
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const races = (await this.supabaseRequest(
        `races?race_date=lt.${today}&status=eq.finished&select=*,racecourses(name,location)&order=race_date.desc,race_time.desc&limit=${limit}`
      )) as any[];

      return races.map((race: any) => ({
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
        participantCount: 0,
        winner: null, // Sera ajouté plus tard avec les résultats
        raceNumber: race.race_number,
        raceType: race.race_type,
        category: race.race_class,
      }));

    } catch (error) {
      console.error('❌ Erreur lors du chargement des résultats récents:', error);
      // Fallback
      return [
        {
          id: 'fallback-past-1',
          name: 'Prix des Oliviers (Fallback)',
          date: new Date('2025-08-28T16:00:00Z'),
          status: 'finished',
          distance: 1400,
          distanceMeters: 1400,
          maxParticipants: 12,
          maxRunners: 12,
          participantCount: 0,
          winner: {
            name: 'Thunder Bolt',
            jockey: 'Ahmed Ben Ali',
          },
          racecourse: {
            name: 'Hippodrome de Carthage',
            location: 'Carthage',
          },
          prizeMoney: 3500,
          raceNumber: 1,
          raceType: 'Plat',
          category: 'Listed',
        },
      ];
    }
  }

  async getCoursesStats(): Promise<CourseStats> {
    console.log('📈 getCoursesStats appelé (API REST)');
    
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Total races
      const totalResult = (await this.supabaseRequest('races?select=count')) as any[];
      const totalCourses = totalResult[0]?.count || 0;
      
      // Upcoming races
      const upcomingResult = (await this.supabaseRequest(`races?race_date=gte.${today}&status=eq.scheduled&select=count`)) as any[];
      const upcomingCourses = upcomingResult[0]?.count || 0;
      
      // Finished races
      const finishedResult = (await this.supabaseRequest(`races?status=eq.finished&select=count`)) as any[];
      const completedCourses = finishedResult[0]?.count || 0;
      
      // Today's races
      const todayResult = (await this.supabaseRequest(`races?race_date=eq.${today}&select=count`)) as any[];
      const scheduledToday = todayResult[0]?.count || 0;

      return {
        totalCourses,
        upcomingCourses,
        completedCourses,
        scheduledToday,
      };

    } catch (error) {
      console.error('❌ Erreur lors du calcul des statistiques:', error);
      // Fallback calculation
      return {
        totalCourses: 2,
        upcomingCourses: 1,
        completedCourses: 1,
        scheduledToday: 0,
      };
    }
  }

  async getCourseById(id: string): Promise<CourseDetails | null> {
    console.log('🔍 getCourseById appelé (API REST)', { id });
    
    try {
      const races = (await this.supabaseRequest(
        `races?id=eq.${id}&select=*,racecourses(name,location)`
      )) as any[];
      
      if (races.length === 0) {
        return null;
      }
      
      const race = races[0];
      
      return {
        id: race.id,
        name: race.name,
        raceDate: new Date(`${race.race_date}T${race.race_time}`),
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
        conditions: race.conditions,
        terrainState: race.terrain_state,
        raceEntries: [], // Sera ajouté plus tard
        raceResults: [], // Sera ajouté plus tard
      };

    } catch (error) {
      console.error('❌ Erreur lors du chargement du détail course:', error);
      return null;
    }
  }
}
