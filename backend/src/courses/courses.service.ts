import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CourseData,
  CourseStats,
  PaginatedCoursesResponse,
  CourseDetails,
} from './courses.interfaces';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  // Utilisation des données réelles depuis Supabase/PostgreSQL
  async getUpcomingCourses(limit = 10): Promise<CourseData[]> {
    console.log('📅 getUpcomingCourses appelé (données réelles)');
    
    try {
      const upcomingRaces = await this.prisma.race.findMany({
        where: {
          raceDate: {
            gte: new Date(), // Courses à venir
          },
          status: {
            in: ['scheduled', 'confirmed'],
          },
        },
        include: {
          racecourse: {
            select: {
              name: true,
              location: true,
            },
          },
          raceEntries: {
            select: {
              id: true,
              horse: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
            take: 5, // Limit to first 5 entries for performance
          },
        },
        orderBy: [{ raceDate: 'asc' }, { raceTime: 'asc' }],
        take: limit,
      });

      // Transform to match expected format
      return upcomingRaces.map((race) => ({
        id: race.id,
        name: race.name,
        date: new Date(
          `${race.raceDate.toISOString().split('T')[0]}T${race.raceTime}`,
        ),
        status: race.status,
        distance: race.distanceMeters,
        distanceMeters: race.distanceMeters,
        maxParticipants: race.maxRunners || 0,
        maxRunners: race.maxRunners || 0,
        prizeMoney: race.prizeMoney ? Number(race.prizeMoney) : null,
        racecourse: race.racecourse,
        participantCount: race.raceEntries.length,
        raceNumber: race.raceNumber,
        raceType: race.raceType,
        category: race.category,
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
          racecourse: { name: 'Hippodrome de Carthage', location: 'Carthage' },
        },
      ];
    }
  }

  async getRecentResults(limit = 10): Promise<CourseData[]> {
    console.log('🏆 getRecentResults appelé (données réelles)');
    
    try {
      const recentRaces = await this.prisma.race.findMany({
        where: {
          raceDate: {
            lt: new Date(), // Courses passées
          },
          status: {
            in: ['finished', 'completed'],
          },
        },
        include: {
          racecourse: {
            select: {
              name: true,
              location: true,
            },
          },
          raceResults: {
            where: {
              position: 1, // Seulement le gagnant
            },
            include: {
              horse: true,
              jockey: {
                include: {
                  user: true,
                },
              },
            },
            take: 1,
          },
        },
        orderBy: [{ raceDate: 'desc' }, { raceTime: 'desc' }],
        take: limit,
      });

      // Transform to match expected format
      return recentRaces.map((race) => ({
        id: race.id,
        name: race.name,
        date: new Date(
          `${race.raceDate.toISOString().split('T')[0]}T${race.raceTime}`,
        ),
        status: race.status,
        distance: race.distanceMeters,
        distanceMeters: race.distanceMeters,
        maxParticipants: race.maxRunners || 0,
        maxRunners: race.maxRunners || 0,
        racecourse: race.racecourse,
        participantCount: 0, // For past races, we don't need current participant count
        winner: race.raceResults.length > 0 ? {
          name: race.raceResults[0].horse.name,
          jockey: race.raceResults[0].jockey
            ? `${race.raceResults[0].jockey.user?.firstName || ''} ${race.raceResults[0].jockey.user?.lastName || ''}`.trim()
            : 'N/A',
        } : null,
        prizeMoney: race.prizeMoney ? Number(race.prizeMoney) : null,
        raceNumber: race.raceNumber,
        raceType: race.raceType,
        category: race.category,
      }));
    } catch (error) {
      console.error('❌ Erreur lors du chargement des résultats récents:', error);
      // Fallback to mock data if database fails
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
          winner: { name: 'Thunder Bolt', jockey: 'Ahmed Ben Ali' },
          racecourse: { name: 'Hippodrome de Carthage', location: 'Carthage' },
          prizeMoney: 3500,
          raceNumber: 1,
          raceType: 'Plat',
          category: 'Listed',
        },
      ];
    }
  }

  async getAllCourses(page = 1, limit = 20, status?: string): Promise<PaginatedCoursesResponse> {
    console.log('📊 getAllCourses appelé (données réelles)', {
      page,
      limit,
      status,
    });
    
    try {
      // Construire les conditions de filtrage
      const whereConditions: any = {};
      if (status) {
        whereConditions.status = status;
      }

      const allRaces = await this.prisma.race.findMany({
        where: whereConditions,
        include: {
          racecourse: {
            select: {
              name: true,
              location: true,
            },
          },
          raceEntries: {
            select: {
              id: true,
            },
          },
          raceResults: {
            where: {
              position: 1, // Seulement le gagnant
            },
            include: {
              horse: {
                select: {
                  name: true,
                },
              },
              jockey: {
                include: {
                  user: {
                    select: {
                      firstName: true,
                      lastName: true,
                    },
                  },
                },
              },
            },
            take: 1,
          },
        },
        orderBy: [{ raceDate: 'desc' }, { raceTime: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
      });

      // Compter le total pour la pagination
      const totalCount = await this.prisma.race.count({
        where: whereConditions,
      });

      // Transformer les données
      const transformedRaces = allRaces.map((race) => ({
        id: race.id,
        name: race.name,
        date: new Date(
          `${race.raceDate.toISOString().split('T')[0]}T${race.raceTime}`,
        ),
        status: race.status,
        distance: race.distanceMeters,
        distanceMeters: race.distanceMeters,
        maxParticipants: race.maxRunners || 0,
        maxRunners: race.maxRunners || 0,
        prizeMoney: race.prizeMoney ? Number(race.prizeMoney) : null,
        racecourse: race.racecourse,
        participantCount: race.raceEntries.length,
        winner: race.raceResults.length > 0 ? {
          name: race.raceResults[0].horse.name,
          jockey: race.raceResults[0].jockey
            ? `${race.raceResults[0].jockey.user?.firstName || ''} ${race.raceResults[0].jockey.user?.lastName || ''}`.trim()
            : 'N/A',
        } : null,
        raceNumber: race.raceNumber,
        raceType: race.raceType,
        category: race.category,
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
      // Fallback to combined upcoming and recent if needed
      const upcoming = await this.getUpcomingCourses(10);
      const recent = await this.getRecentResults(10);
      let allCourses = [...upcoming, ...recent];
      
      if (status) {
        allCourses = allCourses.filter((course) => course.status === status);
      }
      
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedCourses = allCourses.slice(startIndex, endIndex);
      
      return {
        courses: paginatedCourses,
        totalItems: allCourses.length,
        currentPage: page,
        itemsPerPage: limit,
        totalPages: Math.ceil(allCourses.length / limit),
      };
    }
  }

  async getCoursesStats(): Promise<CourseStats> {
    console.log('📈 getCoursesStats appelé (données réelles)');
    
    try {
      const today = new Date();
      const startOfDay = new Date(today);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(today);
      endOfDay.setHours(23, 59, 59, 999);

      // Compter les courses à venir
      const upcomingCount = await this.prisma.race.count({
        where: {
          raceDate: {
            gte: today,
          },
          status: {
            in: ['scheduled', 'confirmed'],
          },
        },
      });

      // Compter les courses terminées
      const completedCount = await this.prisma.race.count({
        where: {
          raceDate: {
            lt: today,
          },
          status: {
            in: ['finished', 'completed'],
          },
        },
      });

      // Compter les courses prévues aujourd'hui
      const todayCount = await this.prisma.race.count({
        where: {
          raceDate: {
            gte: startOfDay,
            lte: endOfDay,
          },
          status: {
            in: ['scheduled', 'confirmed'],
          },
        },
      });

      // Compter le total
      const totalCount = await this.prisma.race.count();

      return {
        totalCourses: totalCount,
        upcomingCourses: upcomingCount,
        completedCourses: completedCount,
        scheduledToday: todayCount,
      };
    } catch (error) {
      console.error(
        '❌ Erreur lors du chargement des statistiques des courses:',
        error,
      );
      // Fallback calculation using existing methods
      const upcoming: CourseData[] = await this.getUpcomingCourses(100);
      const recent: CourseData[] = await this.getRecentResults(100);
      
      return {
        totalCourses: upcoming.length + recent.length,
        upcomingCourses: upcoming.length,
        completedCourses: recent.length,
        scheduledToday: upcoming.filter((course: CourseData) => {
          const today = new Date();
          const courseDate = new Date(course.date);
          return courseDate.toDateString() === today.toDateString();
        }).length,
      };
    }
  }

  async getCourseById(id: string | number): Promise<CourseDetails> {
    console.log('🔍 getCourseById appelé (données réelles)', { id });
    
    try {
      const raceId = typeof id === 'string' ? id : id.toString();
      
      const race = await this.prisma.race.findUnique({
        where: {
          id: raceId,
        },
        include: {
          racecourse: {
            select: {
              name: true,
              location: true,
            },
          },
          raceEntries: {
            include: {
              horse: {
                select: {
                  id: true,
                  name: true,
                  dateOfBirth: true,
                  currentRating: true,
                },
              },
              jockey: {
                select: {
                  id: true,
                  weightKg: true,
                },
                include: {
                  user: {
                    select: {
                      firstName: true,
                      lastName: true,
                    },
                  },
                },
              },
              trainer: {
                include: {
                  user: {
                    select: {
                      firstName: true,
                      lastName: true,
                    },
                  },
                },
              },
            },
            orderBy: {
              drawPosition: 'asc',
            },
          },
          raceResults: {
            include: {
              horse: {
                select: {
                  id: true,
                  name: true,
                },
              },
              jockey: {
                select: {
                  id: true,
                },
                include: {
                  user: {
                    select: {
                      firstName: true,
                      lastName: true,
                    },
                  },
                },
              },
            },
            orderBy: {
              position: 'asc',
            },
          },
        },
      });

      if (!race) {
        throw new Error(`Course avec ID ${id} non trouvée`);
      }

      // Calculer l'âge des chevaux
      const calculateAge = (birthDate: Date) => {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
          age--;
        }
        return age;
      };

      // Transformer les données pour correspondre au format attendu
      const transformedRace = {
        id: race.id,
        name: race.name,
        raceDate: race.raceDate,
        date: new Date(`${race.raceDate.toISOString().split('T')[0]}T${race.raceTime}`),
        status: race.status,
        distance: race.distanceMeters,
        distanceMeters: race.distanceMeters,
        maxParticipants: race.maxRunners,
        maxRunners: race.maxRunners,
        prizeMoney: race.prizeMoney ? Number(race.prizeMoney) : null,
        racecourse: race.racecourse,
        raceNumber: race.raceNumber,
        raceType: race.raceType,
        category: race.category,
        conditions: race.conditions,
        terrainState: race.terrainState,
        raceEntries: race.raceEntries.map((entry, index) => ({
          id: entry.id,
          clothNumber: entry.clothNumber || index + 1,
          drawPosition: entry.drawPosition || index + 1,
          startingPosition: entry.drawPosition || index + 1,
          weightCarriedKg: entry.weightCarriedKg ? Number(entry.weightCarriedKg) : null,
          odds: entry.odds ? Number(entry.odds) : null,
          horse: {
            id: entry.horse.id,
            name: entry.horse.name,
            age: calculateAge(entry.horse.dateOfBirth),
            weight: entry.weightCarriedKg ? Number(entry.weightCarriedKg) : 58,
            rating: entry.horse.currentRating ? Number(entry.horse.currentRating) : null,
            trainer: entry.trainer ? {
              name: `${entry.trainer.user?.firstName || ''} ${entry.trainer.user?.lastName || ''}`.trim() || 'N/A',
            } : { name: 'N/A' },
          },
          jockey: entry.jockey ? {
            id: entry.jockey.id,
            name: `${entry.jockey.user?.firstName || ''} ${entry.jockey.user?.lastName || ''}`.trim() || 'N/A',
            weight: entry.jockey.weightKg ? Number(entry.jockey.weightKg) : null,
          } : null,
        })),
        raceResults: race.raceResults.map((result) => ({
          position: result.position,
          horse: {
            id: result.horse.id,
            name: result.horse.name,
          },
          jockey: result.jockey ? {
            id: result.jockey.id,
            name: `${result.jockey.user?.firstName || ''} ${result.jockey.user?.lastName || ''}`.trim() || 'N/A',
          } : null,
          time: result.timeSeconds ? `${Math.floor(Number(result.timeSeconds) / 60)}:${(Number(result.timeSeconds) % 60).toFixed(1).padStart(4, '0')}` : null,
          lengthsBehind: result.lengthsBehind ? Number(result.lengthsBehind) : null,
        })),
      };

      return transformedRace;
    } catch (error) {
      console.error('❌ Erreur lors du chargement de la course:', error);
      // Fallback to mock data
      const numId = typeof id === 'string' ? parseInt(id, 10) || 1 : id;
      return {
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
        raceNumber: 1,
        raceType: 'flat',
        category: 'Listed',
        conditions: 'Conditions normales',
        terrainState: 'bon',
        raceEntries: [
          {
            id: '1',
            clothNumber: 1,
            drawPosition: 1,
            startingPosition: 1,
            weightCarriedKg: 58,
            odds: 3.5,
            horse: {
              id: '1',
              name: 'Thunder Strike',
              age: 4,
              weight: 58,
              rating: 75,
              trainer: { name: 'Ahmed Trainer' },
            },
            jockey: {
              id: '1',
              name: 'Mohamed Jockey',
              weight: 52,
            },
          },
        ],
        raceResults: [],
      };
    }
  }
}
